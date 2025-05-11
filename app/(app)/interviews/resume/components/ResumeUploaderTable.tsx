import { useState, useCallback, useMemo, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { nanoid } from 'nanoid';
import { storage } from '@/config/firebase.config';
import { Button, Card, CardBody, Checkbox, CircularProgress, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input } from '@heroui/react';
import { FaFilter, FaSearch, FaUpload } from 'react-icons/fa';
import { useResumeNotifications } from '../hooks/useResumeNotifications';
import { createResume } from '@/services/resume.service';
import { ResumeUploaderProps, UploadFile } from '../types/UploadFileType';
import { InvalidProcessedCard } from './result-list/InvalidProcessedCard';
import { UploadingCard } from './result-list/UploadingCard';
import { ValidProcessedCard } from './result-list/ValidProcessedCard';
import { UploadedCard } from './result-list/UploadedCard';

const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx'];
const PAGE_SIZE = 1000;

const statusOptions = ['Recommended', 'Consider', 'Rejected'];

const ResumeUploader = ({ jobid, onViewDetails, onDelete, existingResume }: ResumeUploaderProps) => {
  const [files, setFiles] = useState<UploadFile[]>(existingResume);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterExtension, setFilterExtension] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const { notifications } = useResumeNotifications(jobid);

  useEffect(() => {
    setFiles(existingResume);
  }, [existingResume]);

  const handleUpload = useCallback(
    (file: File, resumeId: string) => {
      const storageRef = ref(storage, `uploads/${Date.now()}-${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const pct = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setFiles((prev) => prev.map((f) => (f.resumeId === resumeId ? { ...f, progress: pct } : f)));
        },
        (error) => {
          setFiles((prev) => prev.map((f) => (f.resumeId === resumeId ? { ...f, error: error.message } : f)));
        },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);

          setFiles((prev: UploadFile[]) => prev.map((f) => (f.resumeId === resumeId ? { ...f, url, status: 'uploaded' } : f)));

          try {
            await createResume({
              jobId: jobid,
              resumeId,
              baseName: file.name,
              publicUrl: url,
              isTest: false,
            });
          } catch (err) {
            console.error('Failed to create resume:', err);
          }
        }
      );
    },
    [jobid]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const resumeFiles = acceptedFiles.filter((file) => {
        const ext = file.name.split('.').pop()?.toLowerCase();
        return ext && ALLOWED_EXTENSIONS.includes(ext);
      });

      const uploadList: UploadFile[] = resumeFiles.map((file) => ({
        resumeId: nanoid(),
        file,
        name: file.name,
        analysisResults: {},
        jobId: jobid,
        url: '',
        status: 'uploading',
        progress: 0,
        isLoadingResult: false,
        createdAt: new Date().toISOString(),
      }));

      setFiles((prev) => [...uploadList, ...prev]);
      resumeFiles.forEach((file, i) => handleUpload(file, uploadList[i].resumeId));
    },
    [handleUpload]
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop, multiple: true });

  useEffect(() => {
    if (notifications.length === 0) return;

    setFiles((prev) => {
      const updated = prev.map((r) => {
        const notification = notifications.find((n) => n.resumeId === r.resumeId);
        if (!notification) return r;
        return {
          ...r,
          analysisResults: notification.analysisResults,
          status: 'processed',
          isLoadingResult: false,
        };
      });
      return updated;
    });
  }, [notifications]);

  const filteredFiles = useMemo(() => {
    return files.filter((f) => {
      const nameMatch = f.file.name.toLowerCase().includes(searchTerm.toLowerCase());
      const ext = f.file.name.split('.').pop()?.toLowerCase();
      const extMatch = filterExtension === 'all' || ext === filterExtension;
      const statusMatch = selectedStatuses.length === 0 || (f.status && selectedStatuses.includes(f.status));

      return nameMatch && extMatch && statusMatch;
    });
  }, [files, searchTerm, filterExtension, selectedStatuses]);

  const paginatedFiles = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredFiles.slice(start, start + PAGE_SIZE);
  }, [filteredFiles, currentPage]);

  const totalPages = Math.ceil(filteredFiles.length / PAGE_SIZE);

  const overallProgress = useMemo(() => {
    if (files.length === 0) return 0;
    const total = files.reduce((acc, f) => acc + f.progress, 0);
    return total / files.length;
  }, [files]);

  return (
    <div className=" ">
      <div {...getRootProps()}>
        <input {...getInputProps()} className="hidden" aria-label="Upload resume file" />
        <Card radius="sm" shadow="sm" className=" w-full mb-8 border-dashed border-2   cursor-pointer">
          <CardBody className="flex flex-row items-center justify-between py-4 px-6">
            <div className="flex items-center">
              <div className="rounded-full bg-slate-100 p-2 mr-4">
                <FaUpload className="h-5 w-5 text-slate-500" />
              </div>
              <div>
                <h3 className="text-sm font-medium">Drag & drop resume files here</h3>
                <p className="text-xs text-slate-500">Supported formats: .pdf, .doc, .docx</p>
              </div>
            </div>
            <div>
              {files.length > 0 && overallProgress == 100 && (
                <Button variant="bordered" size="sm">
                  Browse Files
                </Button>
              )}

              {files.length > 0 && overallProgress < 100 && <CircularProgress aria-label="Loading..." color="warning" showValueLabel={true} size="md" value={overallProgress} />}
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Input
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            isClearable
            aria-label="Search resumes"
            placeholder="Search Result"
            defaultValue=""
            startContent={<FaSearch />}
            variant="bordered"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Dropdown>
            <DropdownTrigger>
              <Button variant="bordered" startContent={<FaFilter />}>
                Filter
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Status Filters" closeOnSelect={false}>
              {statusOptions.map((status) => (
                <DropdownItem key={status} className="p-0" isReadOnly>
                  <label className="flex items-center px-3 py-2 cursor-pointer w-full">
                    <Checkbox
                      isSelected={selectedStatuses.includes(status)}
                      onChange={(isSelected) => {
                        setSelectedStatuses((prev) => (isSelected ? [...prev, status] : prev.filter((s) => s !== status)));
                        setCurrentPage(1);
                      }}
                    >
                      {status}
                    </Checkbox>
                  </label>
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          <Button
            variant="bordered"
            onPress={() => {
              setSearchTerm('');
              setFilterExtension('all');
              setCurrentPage(1);
            }}
          >
            Clear Filters
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedFiles.map((file) => {
          if (file.status === 'uploading') return <UploadingCard key={file.resumeId} file={file} />;
          if (file.status === 'uploaded') return <UploadedCard key={file.resumeId} file={file} />;
          if (file.status === 'processed') {
            return file.analysisResults.validityStatus ? <ValidProcessedCard key={file.resumeId} file={file} onDelete={onDelete} onViewDetails={onViewDetails} /> : <InvalidProcessedCard key={file.resumeId} file={file} />;
          }
          return null;
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <Button variant="bordered" radius="full" onPress={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
            Prev
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button variant="bordered" radius="full" onPress={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default ResumeUploader;
