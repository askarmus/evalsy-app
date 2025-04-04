"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

type UploadStatus = "idle" | "uploading" | "success" | "error";

type UploadFile = {
  file: File;
  name: string;
  progress: number;
  status: UploadStatus;
  response?: any;
};

export default function ResumeUploader() {
  const [files, setFiles] = useState<UploadFile[]>([]);

  const acceptedTypes = {
    "application/pdf": [".pdf"],
    "application/msword": [".doc"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  };

  const onDrop = (acceptedFiles: File[]) => {
    const newUploads: UploadFile[] = acceptedFiles.map((file) => ({
      file,
      name: file.name,
      progress: 0,
      status: "idle",
    }));

    const startIndex = files.length;
    setFiles((prev) => [...prev, ...newUploads]);

    newUploads.forEach((f, i) => uploadFile(f, startIndex + i));
  };

  const uploadFile = async (fileObj: UploadFile, index: number) => {
    const formData = new FormData();
    formData.append("file", fileObj.file);

    setFiles((prev) => {
      const updated = [...prev];
      updated[index].status = "uploading";
      return updated;
    });

    try {
      const res = await axios.post("/api/upload", formData, {
        onUploadProgress: (event) => {
          const percent = Math.round((event.loaded / event.total!) * 100);

          setFiles((prev) => {
            const updated = [...prev];
            updated[index].progress = percent;
            return updated;
          });
        },
      });

      setFiles((prev) => {
        const updated = [...prev];
        updated[index].status = "success";
        updated[index].progress = 100;
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

  // ✅ Compute overall progress based on completed files
  const totalFiles = files.length;
  const completedFiles = files.filter((f) => f.status === "success").length;
  const overallProgress = totalFiles > 0 ? (completedFiles / totalFiles) * 100 : 0;

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
              <div className='h-2 bg-blue-600 rounded' style={{ width: `${overallProgress}%` }}></div>
            </div>
            <div className='text-xs text-right mt-1 text-gray-600'>{Math.round(overallProgress)}%</div>
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
