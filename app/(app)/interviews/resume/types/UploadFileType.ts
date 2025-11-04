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
  isNew?: boolean;
};
export type ResumeUploaderProps = {
  jobid: string;
  onViewDetails: (resumeId: string) => void;
  onDelete: (resumeId: string) => void;
  existingResume: UploadFile[];
  onRefresh?: () => Promise<void>; // ✅ added optional refresh callback
};
