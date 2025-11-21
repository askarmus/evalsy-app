'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Select, SelectItem, Button, Pagination, Chip, Card, CardBody, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Checkbox, Selection, Spinner } from '@heroui/react';
import { useDropzone } from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/supabaseClient';
import { createResume, fetchResumes, getResume } from '@/services/resume.service';
import { AnimatePresence, motion } from 'framer-motion';
import DateFormatter from '@/app/utils/DateFormatter';
import { showToast } from '@/app/utils/toastUtils';
import { ResumeAnalyseDrawer } from '../components/resume-view/resume.analyse.drawer';
import ResumeStatsGrid from '../components/stats.card';
import { ArrowUpCircle, CheckCircle, Clock, Download, Eye, Loader2, Upload, View, XCircle } from 'lucide-react';
import { toTitleCase } from '@/app/utils/text.utls';
import { useAuthContext } from '@/context/AuthContext';
import { HiringGradeUtil, Recommendation } from '@/app/utils/hiring-grade.util';

// Normalise analysis results coming from backend / realtime
const normalize = (r: any) => {
  let ar = r.analysisResults;

  // If Supabase sends JSONB as string → parse it
  if (typeof ar === 'string') {
    try {
      ar = JSON.parse(ar);
    } catch (e) {
      console.error('Failed to parse analysisResults', e);
    }
  }

  return {
    ...r,
    analysisResults: {
      candidateName: ar?.candidate_info?.candidatename ?? '-',
      currentRole: ar?.candidate_info?.current_role ?? '-',
      totalExperience: ar?.candidate_info?.total_experience ?? '-',
      matchScore: ar?.matchscore ?? 0,
      validityStatus: ar?.validitystatus ?? false,
    },
  };
};

type ResumeRow = {
  resumeId: string;
  name: string;
  url: string;
  createdAt: string;
  status: string;
  analysisResults: {
    candidateName: string;
    currentRole: string;
    matchScore: number;
    validityStatus?: boolean;
  };
  file?: File; // only for newly uploaded, not existing
};

export default function ResumeUploaderHero({ jobId }: { jobId: string }) {
  const [items, setItems] = useState<ResumeRow[]>([]);
  const { user, loading } = useAuthContext();

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filters / search / sort
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'top' | 'rejected'>('all');
  const [sortField, setSortField] = useState<'date' | 'name' | 'score'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [recommendationFilter, setRecommendationFilter] = useState<Recommendation | 'all'>('all');

  // Bulk select
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));

  // Preview modal
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewResume, setPreviewResume] = useState<ResumeRow | null>(null);

  // Global progress (auto refreshed every second, animated bar)
  const [progress, setProgress] = useState(0);

  const [selectedResumeData, setSelectedResumeData] = useState<any>(null);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isResumesLoading, setResumesLoading] = useState(false);
  const [loadingResults, setLoadingResults] = useState<{ [key: string]: boolean }>({});

  const handleClose = () => setDrawerOpen(false);
  // -----------------------------------------------------------
  // LOAD EXISTING RESUMES AT MOUNT
  // -----------------------------------------------------------
  useEffect(() => {
    const load = async () => {
      try {
        setResumesLoading(true);
        const existing = await fetchResumes(jobId);

        const formatted: ResumeRow[] = (existing.resumes || []).map((r: any) => ({
          resumeId: r.resumeId,
          name: r.name,
          url: r.url,
          createdAt: r.createdAt,
          status: r.status ?? 'processed',
          analysisResults: r.analysisResults, // already normalized in BE
        }));

        setItems(formatted);
      } catch (err) {
        console.error('Failed loading existing resumes:', err);
      } finally {
        setResumesLoading(false);
      }
    };

    load();
  }, [jobId]);

  const statusIcon = {
    processed: <CheckCircle className="h-4 w-4 translate-y-[1px]" />,
    error: <XCircle className="h-4 w-4 translate-y-[1px]" />,
    processing: <Loader2 className="h-4 w-4 animate-spin translate-y-[1px]" />,
    uploading: <ArrowUpCircle className="h-4 w-4 translate-y-[1px]" />,
    uploaded: <Upload className="h-4 w-4 translate-y-[1px]" />,
    queued: <Clock className="h-4 w-4 translate-y-[1px]" />,
  };

  const handleViewDetails = async (resumeId: string) => {
    setLoadingResults((prev) => ({ ...prev, [resumeId]: true }));

    try {
      const data = await getResume(jobId, resumeId);
      setSelectedResumeData(data);
      setDrawerOpen(true);
    } catch (error) {
      console.error('Error fetching resume details:', error);
      showToast.error('Failed to load resume details.');
    } finally {
      setLoadingResults((prev) => ({ ...prev, [resumeId]: false }));
    }
  };

  const computedStats = useMemo(() => {
    if (!items.length) {
      return {
        totalCandidates: 0,
        avgMatchScore: 0,
        topCandidates: 0,
        topCandidatesPercent: 0,
        rejectedCandidates: 0,
        rejectedCandidatesPercent: 0,
      };
    }

    const total = items.length;

    const processed = items.filter((r) => r.status === 'processed');

    const avgScore = processed.length === 0 ? 0 : Math.round(processed.reduce((sum, r) => sum + (r.analysisResults?.matchScore || 0), 0) / processed.length);

    const top = processed.filter((r) => r.analysisResults.matchScore >= 75).length;
    const rejected = processed.filter((r) => r.analysisResults.matchScore < 50).length;

    return {
      totalCandidates: total,
      avgMatchScore: avgScore,
      topCandidates: top,
      topCandidatesPercent: Math.round((top / total) * 100),
      rejectedCandidates: rejected,
      rejectedCandidatesPercent: Math.round((rejected / total) * 100),
    };
  }, [items]);

  // -----------------------------------------------------------
  // SUPABASE REALTIME LISTENER
  // -----------------------------------------------------------
  useEffect(() => {
    const channel = supabase
      .channel(`resume-${jobId}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'resume' }, (payload) => {
        const updated: any = payload.new;
        if (!updated || updated.jobId !== jobId) return;

        const norm = normalize(updated);

        setItems((prev) =>
          prev.map((i) =>
            i.resumeId === updated.resumeId
              ? {
                  ...i,
                  status: norm.status,
                  analysisResults: norm.analysisResults,
                }
              : i
          )
        );
      })

      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [jobId]);

  // -----------------------------------------------------------
  // UPDATE STATUS HELPER
  // -----------------------------------------------------------
  const updateStatus = (resumeId: string, newStatus: string) => {
    setItems((prev) => prev.map((i) => (i.resumeId === resumeId ? { ...i, status: newStatus } : i)));
  };

  // -----------------------------------------------------------
  // UPLOAD FILE → GCS + CREATE RESUME
  // -----------------------------------------------------------
  const uploadFile = async (file: File, resumeId: string) => {
    try {
      updateStatus(resumeId, 'uploading');

      const res = await fetch('/api/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, contentType: file.type, userId: user?.id }),
      });

      const { uploadUrl, publicUrl } = await res.json();

      await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      setItems((prev) => prev.map((i) => (i.resumeId === resumeId ? { ...i, url: publicUrl } : i)));

      updateStatus(resumeId, 'uploaded');

      await createResume({
        jobId,
        resumeId,
        baseName: file.name,
        publicUrl,
        isTest: false,
      });

      updateStatus(resumeId, 'processing');
    } catch (err) {
      console.error(err);
      updateStatus(resumeId, 'error');
    }
  };

  // -----------------------------------------------------------
  // DROPZONE HANDLER
  // -----------------------------------------------------------
  const onDrop = useCallback(async (files: File[]) => {
    const validFiles = files.filter((file) => ['pdf', 'doc', 'docx'].includes(file.name.split('.').pop()?.toLowerCase() || ''));

    const rows: ResumeRow[] = validFiles.map((file) => ({
      resumeId: uuidv4(),
      name: file.name,
      url: '',
      file,
      createdAt: new Date().toISOString(),
      status: 'queued',
      analysisResults: {
        candidateName: '-',
        currentRole: '-',
        matchScore: 0,
      },
    }));

    // Insert new at top
    setItems((prev) => [...rows, ...prev]);
    // Jump to first page so user sees uploads
    setPage(1);

    for (const row of rows) {
      await uploadFile(row.file as File, row.resumeId);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  // -----------------------------------------------------------
  // SUMMARY COUNTS + PROGRESS
  // -----------------------------------------------------------
  const { uploadingCount, processingCount, completedCount, totalCount } = useMemo(() => {
    const uploadingStatuses = ['queued', 'uploading', 'uploaded'];
    const uploading = items.filter((i) => uploadingStatuses.includes(i.status)).length;
    const processing = items.filter((i) => i.status === 'processing').length;
    const completed = items.filter((i) => i.status === 'processed').length;
    const total = items.length;
    return {
      uploadingCount: uploading,
      processingCount: processing,
      completedCount: completed,
      totalCount: total,
    };
  }, [items]);

  const isUploading = useMemo(() => {
    return items.some((i) => ['queued', 'uploading', 'uploaded', 'processing'].includes(i.status));
  }, [items]);
  // Animated, auto-refresh progress every second
  useEffect(() => {
    const calcProgress = () => {
      if (!totalCount) return 0;
      return (completedCount / totalCount) * 100;
    };

    setProgress(calcProgress());

    const id = setInterval(() => {
      setProgress(calcProgress());
    }, 1000);

    return () => clearInterval(id);
  }, [completedCount, totalCount]);

  // -----------------------------------------------------------
  // SEARCH / FILTER / SORT / PAGINATION
  // -----------------------------------------------------------
  const filteredAndSorted = useMemo(() => {
    const q = search.toLowerCase();

    // 1️⃣ Filtering by search
    let list = items.filter((r) => {
      return r.name.toLowerCase().includes(q) || r.analysisResults.candidateName.toLowerCase().includes(q);
    });

    // 2️⃣ Filter by hiring recommendation (Weak Fit / Needs Review / etc.)
    if (recommendationFilter !== 'all') {
      list = list.filter((r) => {
        const grade = HiringGradeUtil.getHiringRecommendation(r.analysisResults.matchScore);
        return grade.recommendation === recommendationFilter;
      });
    }

    // 3️⃣ Status priority sorting
    const statusRank = (s: string) => {
      if (['queued', 'uploading', 'uploaded', 'processing'].includes(s)) return 0;
      if (s === 'processed') return 1;
      if (s === 'error') return 2;
      return 3;
    };

    // 4️⃣ Sort
    list.sort((a, b) => {
      // status first
      const sa = statusRank(a.status);
      const sb = statusRank(b.status);
      if (sa !== sb) return sa - sb;

      // then sorting by chosen field
      if (sortField === 'score') {
        return sortOrder === 'asc' ? a.analysisResults.matchScore - b.analysisResults.matchScore : b.analysisResults.matchScore - a.analysisResults.matchScore;
      }

      if (sortField === 'name') {
        return sortOrder === 'asc' ? a.analysisResults.candidateName.localeCompare(b.analysisResults.candidateName) : b.analysisResults.candidateName.localeCompare(a.analysisResults.candidateName);
      }

      // fallback: date sorting
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();
      return sortOrder === 'asc' ? da - db : db - da;
    });

    return list;
  }, [items, search, recommendationFilter, sortField, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSorted.length / pageSize));
  const paginated = useMemo(() => filteredAndSorted.slice((page - 1) * pageSize, page * pageSize), [filteredAndSorted, page, pageSize]);

  // -----------------------------------------------------------
  // BULK DELETE (FRONTEND ONLY)
  // -----------------------------------------------------------
  const handleBulkDelete = () => {
    if (!items.length) return;

    let idsToDelete: string[] = [];

    if (selectedKeys === 'all') {
      idsToDelete = filteredAndSorted.map((r) => r.resumeId);
    } else {
      idsToDelete = Array.from(selectedKeys) as string[];
    }

    setItems((prev) => prev.filter((i) => !idsToDelete.includes(i.resumeId)));
    setSelectedKeys(new Set([]));
  };

  // -----------------------------------------------------------
  // PREVIEW HANDLER
  // -----------------------------------------------------------
  const openPreview = (resume: ResumeRow) => {
    if (!resume.url) return;
    setPreviewResume(resume);
    setIsPreviewOpen(true);
  };

  // -----------------------------------------------------------
  // RENDER
  // -----------------------------------------------------------
  return (
    <div className="p-4 space-y-6">
      <ResumeStatsGrid resumeStats={computedStats} />
      <AnimatePresence mode="sync">
        {!isUploading && (
          <motion.div key="overview-upload" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35, ease: 'easeOut' }} className="space-y-6">
            {/* Upload Box */}
            <div {...getRootProps()} className="cursor-pointer">
              <Card shadow="sm" className="bg-secondary-50 hover:bg-gray-100 border-2 border-dashed border-secondary">
                <CardBody className="text-center py-10">
                  <input {...getInputProps()} />
                  <p className="text-lg font-medium text-gray-700">Drag & Drop resumes or click to upload</p>
                  <p className="text-sm text-gray-500 mt-1">Supported formats: .pdf, .doc, .docx</p>
                </CardBody>
              </Card>
            </div>
          </motion.div>
        )}

        {isUploading && (
          <motion.div key="overview-upload" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35, ease: 'easeOut' }} className="space-y-6">
            {/* Resume Processing Overview */}
            <Card shadow="sm" className="bg-white">
              <CardBody className="space-y-4">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold">Resume Processing Overview</h2>
                    <p className="text-sm text-gray-500">Monitor uploading, processing and completed resumes.</p>

                    <div className="flex flex-wrap gap-2">
                      <Chip color="warning" variant="flat">
                        Uploading: {uploadingCount}
                      </Chip>
                      <Chip color="secondary" variant="flat">
                        Processing: {processingCount}
                      </Chip>
                      <Chip color="success" variant="flat">
                        Completed: {completedCount}
                      </Chip>
                      <Chip color="default" variant="flat">
                        Total: {totalCount}
                      </Chip>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Overall progress</span>
                      <span>{totalCount ? progress.toFixed(0) : 0}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                      <motion.div className="h-full bg-blue-500" animate={{ width: `${totalCount ? progress : 0}%` }} transition={{ duration: 0.4 }} />
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters / Search / Bulk actions */}
      <div className="flex flex-wrap items-center gap-4">
        <Input
          size="sm"
          label="Search"
          labelPlacement="outside-left"
          placeholder="Candidate or filename..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          variant="bordered"
          className="w-72"
        />
        <Select
          label="Recommendation"
          labelPlacement="outside-left"
          size="sm"
          selectedKeys={[recommendationFilter]}
          onChange={(e) => {
            setRecommendationFilter(e.target.value as Recommendation);
            setPage(1);
          }}
          className="w-72"
        >
          <>
            <SelectItem key="all">All</SelectItem>

            {HiringGradeUtil.RECOMMENDATION_LABELS.map((r) => (
              <SelectItem key={r}>{r}</SelectItem>
            ))}
          </>
        </Select>

        <Select
          size="sm"
          label="Sort by"
          labelPlacement="outside-left"
          selectedKeys={[sortField]}
          onChange={(e) => {
            setSortField(e.target.value as any);
            setPage(1);
          }}
          variant="bordered"
          className="w-44"
        >
          <SelectItem key="date">Date</SelectItem>
          <SelectItem key="name">Candidate name</SelectItem>
          <SelectItem key="score">Score</SelectItem>
        </Select>

        <Button size="sm" variant="flat" onPress={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}>
          {sortOrder === 'asc' ? 'Ascending ↑' : 'Descending ↓'}
        </Button>

        <div className="flex-1" />

        <Button color="danger" size="sm" variant="flat" isDisabled={selectedKeys === 'all' ? filteredAndSorted.length === 0 : (selectedKeys as Set<React.Key>).size === 0} onPress={handleBulkDelete}>
          Delete selected
        </Button>

        <Select
          label="Page size"
          size="sm"
          labelPlacement="outside-left"
          selectedKeys={[String(pageSize)]}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setPage(1);
          }}
          variant="bordered"
          className="w-32"
        >
          <SelectItem key="5">5</SelectItem>
          <SelectItem key="10">10</SelectItem>
          <SelectItem key="20">20</SelectItem>
          <SelectItem key="50">50</SelectItem>
        </Select>
      </div>

      {/* Table */}
      <Table aria-label="Resumes table" shadow="sm" selectionMode="multiple" isStriped selectedKeys={selectedKeys} onSelectionChange={setSelectedKeys}>
        <TableHeader>
          <TableColumn key="name">File</TableColumn>
          <TableColumn key="status">Status</TableColumn>
          <TableColumn key="candidate">Candidate</TableColumn>
          <TableColumn key="role">Role</TableColumn>
          <TableColumn key="score">Score</TableColumn>
          <TableColumn key="createdAt">Processed</TableColumn>

          <TableColumn key="actions" align="end">
            Actions
          </TableColumn>
        </TableHeader>
        <TableBody emptyContent={'No resumes found'} items={paginated} isLoading={isResumesLoading} loadingContent={<Spinner />}>
          {(item: ResumeRow) => {
            // ✅ FIX — calculate here, OUTSIDE JSX
            const grade = HiringGradeUtil.getHiringRecommendation(item.analysisResults.matchScore);

            return (
              <TableRow key={item.resumeId}>
                <TableCell>{item.name}</TableCell>

                <TableCell width={40}>
                  <Chip size="sm" startContent={statusIcon[item.status]} variant="flat" color={item.status === 'processed' ? 'success' : item.status === 'error' ? 'danger' : 'warning'} className="flex items-center gap-1 whitespace-nowrap">
                    <span className="leading-none">{toTitleCase(item.status)}</span>
                  </Chip>
                </TableCell>

                <TableCell>{item.analysisResults.candidateName}</TableCell>
                <TableCell>{item.analysisResults.currentRole}</TableCell>

                {/* 🌟 MATCH SCORE BADGE ✔️ */}
                <TableCell>
                  {item.status === 'processed' && (
                    <Chip size="sm" color={grade.color} variant="flat">
                      {grade.text} ({item.analysisResults.matchScore}%)
                    </Chip>
                  )}

                  {item.status !== 'processed' && '--'}
                </TableCell>

                <TableCell>{DateFormatter.formatDate(item.createdAt || '', true)}</TableCell>

                <TableCell>
                  <div className="flex justify-end items-center gap-2">
                    <Button size="sm" isIconOnly variant="flat" isDisabled={item.status !== 'processed'} onPress={() => openPreview(item)}>
                      <Eye />
                    </Button>

                    <Button isIconOnly size="sm" variant="bordered" as="a" href={item.url || '#'} target="_blank" isDisabled={item.status !== 'processed'}>
                      <Download />
                    </Button>

                    <Button size="sm" radius="full" variant="flat" color="secondary" isDisabled={item.status !== 'processed'} isLoading={loadingResults[item.resumeId] === true} onPress={() => handleViewDetails(item.resumeId)} className="min-w-[110px] justify-center">
                      View Result
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          }}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex justify-center pt-4">
        <Pagination showControls total={totalPages} page={page} onChange={setPage} />
      </div>

      {/* Preview Modal */}
      <Modal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} size="5xl" scrollBehavior="inside">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{previewResume?.name}</ModalHeader>
              <ModalBody>{previewResume?.url ? <iframe src={previewResume.url} className="w-full h-[70vh]" title={previewResume.name} /> : <p className="text-sm text-gray-500">No preview available.</p>}</ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  Close
                </Button>
                {previewResume?.url && (
                  <Button as="a" href={previewResume.url} target="_blank" color="primary">
                    Download
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <ResumeAnalyseDrawer isOpen={isDrawerOpen} onClose={handleClose} resumeData={selectedResumeData} />
    </div>
  );
}
