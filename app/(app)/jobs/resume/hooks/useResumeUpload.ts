import { nanoid } from "nanoid";
import axios from "axios";
import { showToast } from "@/app/utils/toastUtils";

interface ResumeUploadOptions {
  id: string;
  waitForConnection: () => Promise<string>;
  setFiles: React.Dispatch<React.SetStateAction<any[]>>;
  setUploadedResumes: React.Dispatch<React.SetStateAction<any[]>>;
}

export const useResumeUpload = ({ id, waitForConnection, setFiles, setUploadedResumes }: ResumeUploadOptions) => {
  const uploadFiles = async (incoming: File[] | File) => {
    const filesToUpload = Array.isArray(incoming) ? incoming : [incoming];

    const socketId = await waitForConnection(); // ✅ get socket id from useResumeSocket

    const filesWithIds = filesToUpload.map((file) => ({ file, resumeId: nanoid() }));

    // Add to uploadedResumes state
    setUploadedResumes((prev) => {
      const newResumes = filesWithIds.map(({ file, resumeId }) => ({
        resumeId,
        jobId: id,
        name: file.name,
        url: "",
        analysisResults: null,
        status: "uploading",
        progress: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: "",
      }));

      const existingIds = new Set(prev.map((r) => r.resumeId));
      const filtered = newResumes.filter((r) => !existingIds.has(r.resumeId));

      return [...prev, ...filtered];
    });

    // Add to files state
    setFiles((prev) => {
      const updated = [...prev];
      for (const { file, resumeId } of filesWithIds) {
        updated.push({ file, resumeId, progress: 0, status: "uploading" });
      }
      return updated;
    });

    // Upload via API
    await Promise.all(
      filesWithIds.map(async ({ file, resumeId }) => {
        const formData = new FormData();
        formData.append("files", file);
        formData.append("resumeId", resumeId);
        formData.append("jobId", id);

        try {
          await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/resume/upload`, formData, {
            headers: { "x-socket-id": socketId },
            withCredentials: true,
            onUploadProgress: (event) => {
              const percent = Math.round((event.loaded * 100) / (event.total || 1));
              setUploadedResumes((prev) => prev.map((r) => (r.resumeId === resumeId ? { ...r, progress: percent, status: "uploading" } : r)));
            },
          });
        } catch (error) {
          console.error("Upload error", error);
          showToast.error("Failed to upload resume. Please try again.");
          setFiles((prev) => prev.map((f) => (f.resumeId === resumeId ? { ...f, status: "error" } : f)));
          setUploadedResumes((prev) => prev.map((r) => (r.resumeId === resumeId ? { ...r, status: "error" } : r)));
        }
      })
    );
  };

  return { uploadFiles };
};
