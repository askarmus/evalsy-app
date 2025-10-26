import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';
import { Button, ButtonGroup, Card, CardBody, Chip, Divider, Progress, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from '@heroui/react';
import { FaUpload } from 'react-icons/fa';
import { createResume } from '@/services/resume.service';
import { ResumeUploaderProps } from '../types/UploadFileType';
import { UploadingCard } from './result-list/UploadingCard';
import { ValidProcessedCard } from './result-list/ValidProcessedCard';
import { InvalidProcessedCard } from './result-list/InvalidProcessedCard';
import { showToast } from '@/app/utils/toastUtils';
import { useCredits } from '@/context/CreditContext';
import { supabase } from '@/lib/supabaseClient';
import { Eye, Trash2 } from 'lucide-react';
import DateFormatter from '@/app/utils/DateFormatter';
import { HiringGradeUtil } from '@/app/utils/hiring-grade.util';
import { AiOutlineDownload } from 'react-icons/ai';

const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx'] as const;

type LocalUpload = {
  resumeId: string;
  baseName: string;
  progress: number; // 0-100
  status: 'uploading' | 'processing' | 'done' | 'error';
  publicUrl?: string;
};

const ResumeUploader = ({ jobid, onViewDetails, onDelete, existingResume }: ResumeUploaderProps) => {
  const { refreshCredits } = useCredits();
  const [uploadingFiles, setUploadingFiles] = useState<LocalUpload[]>([]);
  const [loadingResumeId, setLoadingResumeId] = useState<string | null>(null);
  const [resumeList, setResumeList] = useState(existingResume);
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');

  useEffect(() => {
    if (existingResume?.length) {
      setResumeList(existingResume);
    }
  }, [existingResume]);

  useEffect(() => {
    if (!uploadingFiles.length) return; // only listen if uploads are in progress

    const channel = supabase
      .channel('resume-updates')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'resume' }, (payload: any) => {
        const updated = payload.new;
        if (!updated || !updated.resumeId) return;

        const isTracked = uploadingFiles.some((u) => u.resumeId === updated.resumeId);
        if (!isTracked) return; // ignore updates not in current uploads

        if (updated.status === 'processed') {
          const normalized = {
            ...updated,
            analysisResults: {
              ...updated.analysisResults,
              validityStatus: updated.analysisResults?.validityStatus ?? updated.analysisResults?.validitystatus ?? false,
              matchScore: updated.analysisResults?.matchScore ?? updated.analysisResults?.matchscore ?? 0,
            },
          };

          // 1️⃣ Remove from uploadingFiles
          setUploadingFiles((prev) => prev.filter((u) => u.resumeId !== updated.resumeId));

          // 2️⃣ Add to permanent resume list
          setResumeList((prev) => [...prev, normalized]);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [uploadingFiles]); // 👈 dependency ensures listener rebuilds for current batch

  const handleUpload = useCallback(
    async (file: File, resumeId: string) => {
      try {
        // 1️⃣ Generate signed URL
        const res = await fetch('/api/upload-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: file.name, contentType: file.type }),
        });

        if (!res.ok) {
          showToast.error('Failed to generate upload URL');
          throw new Error('Failed to generate upload URL');
        }

        const { uploadUrl, publicUrl } = await res.json();

        // 2️⃣ Upload to GCS with progress tracking
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open('PUT', uploadUrl, true);
          xhr.setRequestHeader('Content-Type', file.type);

          xhr.upload.onprogress = (evt) => {
            if (evt.lengthComputable) {
              const pct = Math.round((evt.loaded / evt.total) * 100);
              setUploadingFiles((prev) => prev.map((u) => (u.resumeId === resumeId ? { ...u, progress: pct } : u)));
            }
          };

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              // ✅ Upload finished → show "Processing..."
              setUploadingFiles((prev) => prev.map((u) => (u.resumeId === resumeId ? { ...u, status: 'processing', progress: 100, publicUrl } : u)));
              resolve();
            } else {
              reject(new Error('Upload failed'));
            }
          };

          xhr.onerror = () => reject(new Error('Network error during upload'));
          xhr.send(file);
        });

        // 3️⃣ Create resume record (AI job will process later)
        await createResume({
          jobId: jobid,
          resumeId,
          baseName: file.name,
          publicUrl,
          isTest: false,
        });

        await refreshCredits();
      } catch (err) {
        console.error(err);
        setUploadingFiles((prev) => prev.map((u) => (u.resumeId === resumeId ? { ...u, status: 'error' } : u)));
        showToast.error(`Upload failed: ${file.name}`);
      }
    },
    [jobid, refreshCredits]
  );

  const handleViewDetails = async (resumeId: string) => {
    setLoadingResumeId(resumeId);
    try {
      await onViewDetails(resumeId);
    } finally {
      setLoadingResumeId(null);
    }
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!acceptedFiles?.length) return;

      for (const file of acceptedFiles) {
        const ext = file.name.split('.').pop()?.toLowerCase();
        if (!ext || !ALLOWED_EXTENSIONS.includes(ext as (typeof ALLOWED_EXTENSIONS)[number])) {
          // 🔴 Your toast style
          showToast.error(`Unsupported file type: ${file.name}`);
          continue;
        }

        const resumeId = uuidv4();
        const local: LocalUpload = {
          resumeId,
          baseName: file.name,
          progress: 0,
          status: 'uploading',
        };

        // Show immediately
        setUploadingFiles((prev) => [...prev, local]);

        await handleUpload(file, resumeId);
      }
    },
    [handleUpload]
  );

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    multiple: true,
    noClick: true,
    noKeyboard: true,
  });

  // Global counters (only for current batch tracked locally)
  const totalFiles = uploadingFiles.length;
  const completedFiles = uploadingFiles.filter((f) => f.status === 'done').length;

  return (
    <div>
      {/* Upload Area */}
      <div {...getRootProps()}>
        <input {...getInputProps()} className="hidden" aria-label="Upload resume file" />
        <Card radius="sm" shadow="sm" className="w-full mb-8 p-2 border-2 border-dashed cursor-pointer transition-colors hover:bg-slate-50 hover:border-slate-400 dark:hover:bg-slate-800 dark:hover:border-slate-600">
          <CardBody className="flex flex-row items-center justify-between py-4 px-6">
            <div className="flex items-center">
              <div className="rounded-full p-2 mr-4">
                <FaUpload className="h-5 w-5 text-secondary-100" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-800 dark:text-slate-100">Drag & drop resume files here</h3>
                <p className="text-xs">
                  Supported formats: <strong>.pdf, .doc, .docx</strong>. Upload <strong>1–20 files</strong> at a time.
                </p>
              </div>
            </div>
            <div>
              <Button onPress={open} variant="flat" size="sm" color="secondary" radius="full">
                Browse Files
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Global Upload Stats */}
      {totalFiles > 0 && (
        <div className="mb-4 text-sm text-slate-600 dark:text-slate-300">
          Uploads: {completedFiles} / {totalFiles} completed
          <Progress value={(completedFiles / totalFiles) * 100} color="secondary" size="sm" className="mt-1" />
        </div>
      )}

      {/* Resume Cards */}
      <Card shadow="sm" className="p-1">
        <CardBody>
          <div className="flex justify-end mb-4">
            <ButtonGroup radius="full" variant="flat" size="sm">
              <Button color={viewMode === 'card' ? 'secondary' : 'default'} onPress={() => setViewMode('card')}>
                Card View
              </Button>
              <Button color={viewMode === 'table' ? 'secondary' : 'default'} onPress={() => setViewMode('table')}>
                Table View
              </Button>
            </ButtonGroup>
          </div>
          {viewMode === 'card' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {uploadingFiles.map((u) => (
                <UploadingCard key={u.resumeId} file={u} />
              ))}
              {/* Existing (already known) resumes */}
              {resumeList.map((file) => {
                if (file.status === 'uploading')
                  return (
                    <UploadingCard
                      key={file.resumeId}
                      file={{
                        baseName: file.name,
                        progress: 100,
                        status: 'processing',
                      }}
                    />
                  );

                if (file.status === 'processing' || file.status === 'queued') return <UploadingCard key={file.resumeId} file={{ baseName: file.name, progress: 100, status: 'processing' }} />;

                if (file.status === 'processed' && !file.analysisResults?.validityStatus) return <InvalidProcessedCard key={file.resumeId} file={file} />;

                if (file.status === 'processed' && file.analysisResults?.validityStatus) return <ValidProcessedCard key={file.resumeId} file={file} onViewDetails={handleViewDetails} isLoading={loadingResumeId === file.resumeId} onDelete={onDelete} />;

                return null;
              })}
            </div>
          ) : (
            <Table aria-label="Resume Table" isStriped>
              <TableHeader>
                <TableColumn>Status</TableColumn>
                <TableColumn>Name</TableColumn>
                <TableColumn>Role</TableColumn>
                <TableColumn>Date</TableColumn>
                <TableColumn>Fit</TableColumn>
                <TableColumn align="end">Actions</TableColumn>
              </TableHeader>
              <TableBody emptyContent="No resumes available.">
                {resumeList.map((r: any) => {
                  // ✅ move logic here, outside JSX
                  const { color, text } = HiringGradeUtil.getHiringRecommendation(r.analysisResults?.matchScore);

                  return (
                    <TableRow key={r.resumeId}>
                      <TableCell>
                        {/* ✅ fixed variable names and dynamic color handling */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${color?.startsWith('#') ? '' : `bg-${color}`}`} style={color?.startsWith('#') ? { backgroundColor: color } : {}} aria-label="Match score">
                          <span className="text-white text-xs font-semibold">{Math.round(r.analysisResults?.matchScore ?? 0)}%</span>
                        </div>
                      </TableCell>

                      <TableCell>{r.name}</TableCell>
                      <TableCell>{r.analysisResults?.currentRole ?? 'N/A'}</TableCell>
                      <TableCell>{DateFormatter.formatDate(r.createdAt || '', true)}</TableCell>

                      <TableCell>{text}</TableCell>

                      <TableCell align="right">
                        <div className="flex justify-end gap-2">
                          <Tooltip content="View Details">
                            <Button isIconOnly size="sm" variant="faded" color="secondary" onPress={() => handleViewDetails(r.resumeId)} isLoading={loadingResumeId === r.resumeId}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Tooltip>
                          <Tooltip content="Download Resume">
                            <Button
                              isIconOnly
                              aria-label="Download"
                              onPress={() => {
                                if (!r.url) return;
                                const link = document.createElement('a');
                                link.href = r.url;
                                link.download = r.name || 'resume';
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                              }}
                              size="sm"
                              color="default"
                              variant="faded"
                            >
                              <AiOutlineDownload />
                            </Button>
                          </Tooltip>

                          <Tooltip content="Delete">
                            <Button isIconOnly size="sm" variant="faded" color="danger" onPress={() => onDelete(r.resumeId)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default ResumeUploader;
