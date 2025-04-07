"use client";

import { useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

type UploadStatus = "idle" | "uploading" | "success" | "error";
type ProcessStatus = "queued" | "processing" | "processed" | "failed";

type UploadFile = {
  file: File;
  name: string;
  progress: number;
  status: UploadStatus;
  response?: any;
  processStatus: ProcessStatus;
  resumeId: string;
};

export default function ResumeUploader() {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [overallProgress, setOverallProgress] = useState(0);

  const totalBytesRef = useRef(0);
  const uploadedBytesRef = useRef(0);

  const acceptedTypes = {
    "application/pdf": [".pdf"],
    "application/msword": [".doc"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  };

  const onDrop = (acceptedFiles: File[]) => {
    const totalBytes = acceptedFiles.reduce((sum, file) => sum + file.size, 0);
    totalBytesRef.current = totalBytes;
    uploadedBytesRef.current = 0;
    setOverallProgress(0);

    const newUploads: UploadFile[] = acceptedFiles.map((file) => ({
      file,
      name: file.name,
      progress: 0,
      status: "idle",
      processStatus: "queued",
      resumeId: uuidv4(),
    }));

    const startIndex = files.length;
    setFiles((prev) => [...prev, ...newUploads]);

    newUploads.forEach((f, i) => uploadFile(f, startIndex + i));
  };

  const uploadFile = async (fileObj: UploadFile, index: number) => {
    const formData = new FormData();
    formData.append("file", fileObj.file);
    formData.append("resumeId", fileObj.resumeId);

    setFiles((prev) => {
      const updated = [...prev];
      updated[index].status = "uploading";
      return updated;
    });

    let lastLoaded = 0;

    try {
      const res = await axios.post("/api/upload", formData, {
        onUploadProgress: (event) => {
          const loaded = event.loaded;
          const percent = Math.round((loaded / event.total!) * 100);

          // Update per-file progress
          setFiles((prev) => {
            const updated = [...prev];
            updated[index].progress = percent;
            return updated;
          });

          // Update overall progress
          const delta = loaded - lastLoaded;
          lastLoaded = loaded;
          uploadedBytesRef.current += delta;

          const overall = totalBytesRef.current > 0 ? (uploadedBytesRef.current / totalBytesRef.current) * 100 : 0;

          setOverallProgress(overall);
        },
      });

      setFiles((prev) => {
        const updated = [...prev];
        updated[index].status = "success";
        updated[index].response = res.data;
        return updated;
      });
    } catch (err) {
      console.error("Upload failed:", err);
      setFiles((prev) => {
        const updated = [...prev];
        updated[index].status = "error";
        return updated;
      });
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: acceptedTypes,
    multiple: true,
  });

  const isComplete = files.length > 0 && files.every((f) => f.status === "success");
  const displayedOverallProgress = isComplete ? 100 : Math.min(overallProgress, 99.5);

  return (
    <div className='p-6 border rounded-md bg-white'>
      <div {...getRootProps()} className='border-2 border-dashed border-gray-300 p-8 rounded-lg cursor-pointer text-center hover:bg-gray-50 transition'>
        <input {...getInputProps()} />
        <p className='text-gray-700 font-medium'>Drag & drop resumes here, or click to select files</p>
        <p className='text-sm text-gray-500 mt-1'>Only PDF, DOC, DOCX are allowed</p>
      </div>

      {files.length > 0 && (
        <>
          {/* ✅ Overall Progress */}
          <div className='mt-6'>
            <div className='text-sm font-medium mb-1'>Overall Progress</div>
            <div className='w-full bg-gray-200 h-2 rounded'>
              <div className='h-2 bg-blue-600 rounded' style={{ width: `${displayedOverallProgress}%` }}></div>
            </div>
            <div className='text-xs text-right mt-1 text-gray-600'>{isComplete ? "Complete" : `${Math.round(displayedOverallProgress)}%`}</div>
          </div>

          {/* ✅ Per-File Progress */}
          <div className='mt-6 space-y-4'>
            {files.map((f, i) => (
              <div key={i} className='p-3 border rounded shadow-sm bg-gray-50'>
                <div className='flex justify-between items-center text-sm font-medium'>
                  <span>{f.name}</span>
                  <span className='capitalize text-xs text-gray-600'>Status: {f.status}</span>
                </div>
                <div className='w-full bg-gray-200 h-2 rounded mt-2'>
                  <div className={`h-2 rounded ${f.status === "error" ? "bg-red-500" : f.status === "success" ? "bg-green-500" : "bg-blue-500"}`} style={{ width: `${f.progress}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
