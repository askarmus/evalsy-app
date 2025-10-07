export type ResumeRow = {
  id: string; // uuid
  user_id: string | null;
  file_path: string;
  file_name: string;
  status: "uploading" | "processing" | "queued" | "completed" | "failed";
  error_message: string | null;
  created_at: string;
  updated_at: string;
};

export type UploadItem = {
  tempId: string;
  file: File;
  progress: number; // 0..100
  status: ResumeRow["status"];
  dbId?: string;
  error?: string | null;
};
