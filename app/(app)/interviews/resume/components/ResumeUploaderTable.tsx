// ResumeUploader.tsx
import { useReducer, useCallback, useMemo, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { nanoid } from 'nanoid';
import { storage } from '@/config/firebase.config';
import { Badge, Button, Card, CardBody, Divider, Pagination, Progress } from '@heroui/react';
import { FaUpload } from 'react-icons/fa';
import { useResumeNotifications } from '../hooks/useResumeNotifications';
import { createResume } from '@/services/resume.service';
import { ResumeUploaderProps, UploadFile } from '../types/UploadFileType';
import { InvalidProcessedCard } from './result-list/InvalidProcessedCard';
import { UploadingCard } from './result-list/UploadingCard';
import { ValidProcessedCard } from './result-list/ValidProcessedCard';
import { UploadedCard } from './result-list/UploadedCard';
import { showToast } from '@/app/utils/toastUtils';
import { useResumeFilters } from '../hooks/useResumeFilters';
import { ResumeFilters } from './result-list/ResumeFilters';
import { useCredits } from '@/context/CreditContext';

const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx'];
const PAGE_SIZE = 50;

type Action = { type: 'INIT'; payload: UploadFile[] } | { type: 'ADD_NEW'; payload: UploadFile[] } | { type: 'UPDATE_PROGRESS'; resumeId: string; progress: number } | { type: 'SET_ERROR'; resumeId: string; error: string } | { type: 'SET_UPLOADED'; resumeId: string; url: string } | { type: 'MARK_PROCESSED'; resumeId: string; analysisResults: any };

function filesReducer(state: UploadFile[], action: Action): UploadFile[] {
  switch (action.type) {
    case 'INIT':
      return action.payload;
    case 'ADD_NEW':
      return [...action.payload, ...state.map((f) => ({ ...f, isNew: false }))];
    case 'UPDATE_PROGRESS':
      return state.map((f) => (f.resumeId === action.resumeId ? { ...f, progress: action.progress } : f));
    case 'SET_ERROR':
      return state.map((f) => (f.resumeId === action.resumeId ? { ...f, error: action.error } : f));
    case 'SET_UPLOADED':
      return state.map((f) => (f.resumeId === action.resumeId ? { ...f, url: action.url, status: 'uploaded' } : f));
    case 'MARK_PROCESSED':
      return state.map((f) =>
        f.resumeId === action.resumeId
          ? {
              ...f,
              analysisResults: action.analysisResults,
              hireRecommendation: action.analysisResults?.hireRecommendation,
              status: 'processed',
              isLoadingResult: false,
            }
          : f
      );

    default:
      return state;
  }
}

const ResumeUploader = ({ jobid, onViewDetails, onDelete, existingResume }: ResumeUploaderProps) => {
  const [files, dispatch] = useReducer(filesReducer, []);
  const { credits, refreshCredits } = useCredits();
  const [currentPage, setCurrentPage] = useState(1);
  const { notifications } = useResumeNotifications(jobid);
  const [loadingResumeId, setLoadingResumeId] = useState<string | null>(null);
  const { searchTerm, setSearchTerm, selectedRecommendations, setSelectedRecommendations, experienceRange, setExperienceRange, dateRange, setDateRange, filteredFiles, clearFilters } = useResumeFilters(files);

  useEffect(() => {
    console.log('Loaded resumes:', existingResume);
    const normalized = existingResume.map((f) => ({
      ...f,
      hireRecommendation: f.hireRecommendation ?? f.analysisResults?.hireRecommendation ?? '',
    }));
    dispatch({ type: 'INIT', payload: normalized });
  }, [existingResume]);

  const handleUpload = useCallback(
    (file: File, resumeId: string) => {
      const storageRef = ref(storage, `uploads/${Date.now()}-${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const pct = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          dispatch({ type: 'UPDATE_PROGRESS', resumeId, progress: pct });
        },
        (error) => {
          dispatch({ type: 'SET_ERROR', resumeId, error: error.message });
        },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          dispatch({ type: 'SET_UPLOADED', resumeId, url });

          try {
            await createResume({
              jobId: jobid,
              resumeId,
              baseName: file.name,
              publicUrl: url,
              isTest: false,
            });
            await refreshCredits();
          } catch (err) {
            console.error('Failed to create resume:', err);
          }
        }
      );
    },
    [jobid]
  );

  const isUploadingOrProcessing = useMemo(() => {
    const newFiles = files.filter((f) => f.isNew);
    return newFiles.some((f) => f.status === 'uploading' || f.status !== 'processed');
  }, [files]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 2) {
        showToast.error('You can only upload a maximum of 20 files at a time.');
        return;
      }
      if (credits < acceptedFiles.length) {
        showToast.error(`You only have ${credits} credit(s), but tried uploading ${acceptedFiles.length}.`);
        return;
      }

      if (isUploadingOrProcessing) return;

      const accepted = acceptedFiles
        .filter((file) => {
          const ext = file.name.split('.').pop()?.toLowerCase();
          return ext && ALLOWED_EXTENSIONS.includes(ext);
        })
        .filter((file, i, self) => i === self.findIndex((f) => f.name === file.name && f.size === file.size))
        .filter((file) => !files.some((f) => f.name === file.name && f.file.size === file.size));

      if (accepted.length === 0) return;

      const uploadList: UploadFile[] = accepted.map((file) => ({
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
        isNew: true,
      }));

      dispatch({ type: 'ADD_NEW', payload: uploadList });

      uploadList.forEach((f) => handleUpload(f.file, f.resumeId));
    },
    [files, handleUpload, jobid, isUploadingOrProcessing]
  );

  const handleViewDetails = async (resumeId: string) => {
    setLoadingResumeId(resumeId);
    try {
      await onViewDetails(resumeId); // assuming this is async or wraps an async call
    } finally {
      setLoadingResumeId(null);
    }
  };
  const { getRootProps, getInputProps } = useDropzone({ onDrop, multiple: true, disabled: isUploadingOrProcessing });

  useEffect(() => {
    if (!notifications.length) return;
    notifications.forEach((n) => {
      dispatch({ type: 'MARK_PROCESSED', resumeId: n.resumeId, analysisResults: n.analysisResults });
      console.log('Marking processed for:', n.resumeId, n.analysisResults);
    });
  }, [notifications]);

  const paginatedFiles = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredFiles.slice(start, start + PAGE_SIZE);
  }, [filteredFiles, currentPage]);

  const totalPages = Math.ceil(filteredFiles.length / PAGE_SIZE);

  const uploadProgress = useMemo(() => {
    const newFiles = files.filter((f) => f.isNew && f.status === 'uploading');
    if (!newFiles.length) return 100;
    const sum = newFiles.reduce((a, f) => a + f.progress, 0);
    return Math.round(sum / newFiles.length);
  }, [files]);

  const processingProgress = useMemo(() => {
    const newFiles = files.filter((f) => f.isNew);
    if (!newFiles.length) return 100;
    const processed = newFiles.filter((f) => f.status === 'processed').length;
    return Math.round((processed / newFiles.length) * 100);
  }, [files]);

  const pendingUploadCount = files.filter((f) => f.status === 'uploading' && f.isNew).length;
  const pendingProcessingCount = files.filter((f) => f.isNew && f.status !== 'processed').length;

  return (
    <div className="">
      <div {...getRootProps()}>
        <input {...getInputProps()} className="hidden" aria-label="Upload resume file" />
        <Card radius="md" shadow="md" className="w-full mb-8 border-dashed border-2 cursor-pointer hover:bg-slate-50 hover:border-slate-400 transition-colors">
          <CardBody className="flex flex-row items-center justify-between py-4 px-6">
            <div className="flex items-center">
              <div className="rounded-full bg-slate-100 p-2 mr-4">
                <FaUpload className="h-5 w-5 text-slate-500" />
              </div>
              <div>
                <h3 className="text-sm font-medium">Drag & drop resume files here</h3>
                <p className="text-xs text-slate-500">
                  Supported formats: <strong>.pdf, .doc, .docx</strong>. Upload <strong>1–20 files</strong> at a time. Duplicate files will be skipped. Please wait for current uploads and processing to finish before uploading more.
                </p>
              </div>
            </div>
            <div>
              <Button isDisabled={isUploadingOrProcessing} variant="bordered" size="md">
                Browse Files
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
      <ResumeFilters
        searchTerm={searchTerm}
        onSearchChange={(val) => {
          setSearchTerm(val);
          setCurrentPage(1);
        }}
        selectedRecommendations={selectedRecommendations}
        onRecommendationChange={(option, isSelected) => {
          setSelectedRecommendations((prev) => (isSelected ? [...prev, option] : prev.filter((r) => r !== option)));
        }}
        experienceRange={experienceRange}
        onExperienceChange={setExperienceRange}
        dateRange={dateRange}
        onDateChange={(range) => {
          setDateRange(range);
          setCurrentPage(1);
        }}
        onClearFilters={() => {
          clearFilters();
          setCurrentPage(1);
        }}
      />

      <Divider orientation="horizontal" className="mb-4" />
      {(uploadProgress < 100 || processingProgress < 100) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-blue-800">Uploading Progress</span>
              {pendingUploadCount > 0 && (
                <Badge color="primary" size="md">
                  {pendingUploadCount} pending
                </Badge>
              )}
            </div>
            <Progress aria-label="Uploading progress" value={uploadProgress} color="primary" className="w-full" />
            <span className="text-xs text-blue-700">{uploadProgress}%</span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-purple-800">Processing Progress</span>
              {pendingProcessingCount > 0 && (
                <Badge color="secondary" size="md">
                  {pendingProcessingCount} pending
                </Badge>
              )}
            </div>
            <Progress aria-label="Processing progress" value={processingProgress} color="secondary" className="w-full" />
            <span className="text-xs text-purple-700">{processingProgress}%</span>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedFiles.map((file) => {
          if (file.status === 'uploading') return <UploadingCard key={file.resumeId} file={file} />;
          if (file.status === 'uploaded') return <UploadedCard key={file.resumeId} file={file} />;
          if (file.status === 'processed') {
            return file.analysisResults.validityStatus ? <ValidProcessedCard onViewDetails={handleViewDetails} isLoading={loadingResumeId === file.resumeId} key={file.resumeId} file={file} onDelete={onDelete} /> : <InvalidProcessedCard key={file.resumeId} file={file} />;
          }
          return null;
        })}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination total={totalPages} page={currentPage} onChange={setCurrentPage} showControls loop size="md" radius="full" color="primary" />
        </div>
      )}
    </div>
  );
};

export default ResumeUploader;
