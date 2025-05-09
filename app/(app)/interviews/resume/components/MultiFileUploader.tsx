import { useState, useCallback, useMemo, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { nanoid } from 'nanoid';
import { storage } from '@/config/firebase.config';
import { Button, Card, CardBody, CardFooter, CardHeader, Checkbox, CircularProgress, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Tooltip } from '@heroui/react';
import { FaFilter, FaList, FaSearch, FaTable, FaUpload } from 'react-icons/fa';
import { fetchResumes } from '@/services/resume.service';
import { AiOutlineDelete, AiOutlineDownload, AiOutlineRight } from 'react-icons/ai';
import DateFormatter from '@/app/utils/DateFormatter';
import { useResumeNotifications } from '../hooks/useResumeNotifications';

const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx'];
const PAGE_SIZE = 3;

export type UploadFile = {
  resumeId: string;
  file: File;
  jobId: string;
  name: string;
  progress: number;
  isLoadingResult: boolean;
  createdAt?: string;
  analysisResults: any;
  url?: string;
  error?: string;
  status?: string;
};

const statusOptions = ['Recommended', 'Consider', 'Rejected'];
type ResumeUploaderProps = {
  jobid: string;
  onViewDetails: (resumeId: string) => void;
  onDelete: (resumeId: string) => void;
};

const ResumeUploader = ({ jobid, onViewDetails, onDelete }: ResumeUploaderProps) => {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterExtension, setFilterExtension] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const { notifications } = useResumeNotifications(jobid);

  const loadResumes = async () => {
    try {
      const result = await fetchResumes(jobid);
      const resume = result.resumes;
      console.log('resumes', resume);
      const mappedFiles: UploadFile[] = resume.map((resume: any) => ({
        resumeId: resume.resumeId,
        file: new File([], resume.name), // placeholder file object
        jobId: resume.jobId,
        name: resume.name,
        createdAt: resume.createdAt,
        url: resume.url,
        analysisResults: resume.analysisResults,
        progress: 100,
        status: resume.status,
      }));

      setFiles((prev) => [...mappedFiles, ...prev]);
    } catch (err) {
      console.error('Failed to load resumes', err);
    }
  };

  useEffect(() => {
    loadResumes();
  }, []);

  const handleUpload = useCallback((file: File, index: number) => {
    const storageRef = ref(storage, `uploads/${Date.now()}-${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const pct = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFiles((prev) => prev.map((f, i) => (i === index ? { ...f, progress: pct } : f)));
      },
      (error) => {
        setFiles((prev) => prev.map((f, i) => (i === index ? { ...f, error: error.message } : f)));
      },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        const statuses = ['Recommended', 'Consider', 'Hold', 'Rejected'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

        setFiles((prev: any) => {
          const updated = prev.map((f, i) => (i === index ? { ...f, downloadURL: url, status: 'uploaded' } : f));

          const resumeId = updated[index].id;
          // fetch("/api/resume-uploaded", {
          //   method: "POST",
          //   headers: { "Content-Type": "application/json" },
          //   body: JSON.stringify({ id: resumeId, url }),
          // });

          return updated;
        });
      }
    );
  }, []);

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
      resumeFiles.forEach((file, i) => handleUpload(file, i));
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

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation?.toLowerCase()) {
      case 'strong':
        return 'success';
      case 'conditional':
        return 'primary';
      case 'weak':
        return 'danger';
      default:
        return 'default';
    }
  };

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
        <input {...getInputProps()} className="hidden" />
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

          <div className=" flex">
            <Button isIconOnly startContent={viewMode === 'grid' ? <FaTable /> : <FaList />} variant="bordered" onPress={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}></Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedFiles.map((f) => (
          <Card shadow="sm" radius="sm" className="P-5">
            <CardHeader className="justify-between">
              <div className="flex gap-5">
                <div className="flex items-center justify-between w-full">
                  {f.status === 'processed' && <CircularProgress color={getRecommendationColor(f.analysisResults?.hireRecommendation)} value={f.analysisResults?.matchScore} showValueLabel size="lg" />}

                  {f.status == 'uploading' && <CircularProgress color="warning" value={f.progress} showValueLabel size="lg" />}
                  <div className="flex flex-col gap-1 items-start ml-3">
                    <h4 className="text-lg font-semibold leading-none text-default-600">{f.analysisResults?.candidateName ?? 'N/A'}</h4>
                    <h5 className="text-small tracking-tight text-default-400">{f.analysisResults?.currentRole ?? 'N/A'}</h5>
                  </div>
                </div>
              </div>
              {f.status === 'processed' ? (
                <Button color="primary" endContent={<AiOutlineRight />} isLoading={f.isLoadingResult} onPress={() => onViewDetails(f.resumeId)} radius="full" variant="solid" size="sm">
                  {'Analysis'}
                </Button>
              ) : f.status === 'uploaded' ? (
                <Button size="sm" color="default" variant="faded" isLoading={true}>
                  Analysing...
                </Button>
              ) : null}
            </CardHeader>
            <CardBody className="px-3 py-0 text-small text-default-400">
              <p>Frontend developer and UI/UX enthusiast. Join me on this coding adventure!</p>
            </CardBody>
            <CardFooter className="gap-3">
              <div className="flex items-center justify-between w-full">
                {/* Left: Text info */}
                <div className="flex items-center gap-x-2">
                  <p className="text-default-400 text-small">Processed</p>
                  <p className="font-semibold text-default-400 text-small">{DateFormatter.formatDate(f.createdAt || '', true)}</p>
                </div>

                {/* Right: Action buttons */}
                <div className="flex items-center gap-x-2">
                  <Tooltip content="Delete Resume">
                    <Button isIconOnly aria-label="Delete" onPress={() => onDelete(f.resumeId)} size="sm" color="default" variant="bordered">
                      <AiOutlineDelete />
                    </Button>
                  </Tooltip>

                  <Tooltip content="Download Resume">
                    <Button
                      isIconOnly
                      aria-label="Download"
                      onPress={() => {
                        const link = document.createElement('a');
                        link.href = f.url!;
                        link.download = f.name;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                      size="sm"
                      color="default"
                      variant="bordered"
                    >
                      <AiOutlineDownload />
                    </Button>
                  </Tooltip>
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}
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
