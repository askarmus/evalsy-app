"use client";

import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { doc, onSnapshot, getFirestore } from "firebase/firestore";
import { app } from "@/config/firebase.config";

type UploadStatus = "idle" | "uploading" | "success" | "error";
type ProcessStatus = "queued" | "processing" | "processed" | "failed";

type UploadFile = {
  file: File;
  name: string;
  progress: number;
  status: UploadStatus;
  processStatus: ProcessStatus;
  resumeId: string;
};

const db = getFirestore(app);

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
      processStatus: "queued",
      resumeId: uuidv4(),
    }));

    const startIndex = files.length;
    setFiles((prev) => [...prev, ...newUploads]);

    newUploads.forEach((f, i) => {
      uploadFile(f, startIndex + i);
      listenToProcessingStatus(f.resumeId, startIndex + i);
    });
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

    try {
      await axios.post("/api/upload", formData, {
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

  const listenToProcessingStatus = (resumeId: string, index: number) => {
    const unsub = onSnapshot(doc(db, "resume-status", resumeId), (docSnap) => {
      if (docSnap.exists()) {
        const { status } = docSnap.data();
        setFiles((prev) => {
          const updated = [...prev];
          updated[index].processStatus = status;
          return updated;
        });
      }
    });

    return unsub;
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: acceptedTypes,
    multiple: true,
  });

  return (
    <div className='p-6 border rounded-md bg-white'>
      <div {...getRootProps()} className='border-2 border-dashed border-gray-300 p-8 rounded-lg cursor-pointer text-center hover:bg-gray-50 transition'>
        <input {...getInputProps()} />
        <p className='text-gray-700 font-medium'>Drag & drop resumes here, or click to select files</p>
        <p className='text-sm text-gray-500 mt-1'>Only PDF, DOC, DOCX are allowed</p>
      </div>

      {files.length > 0 && (
        <div className='mt-6 space-y-4'>
          {files.map((f, i) => (
            <div key={i} className='p-3 border rounded shadow-sm bg-gray-50'>
              <div className='flex justify-between text-sm font-medium'>
                <span>{f.name}</span>
                <span className='capitalize text-xs text-gray-600'>Upload: {f.status}</span>
              </div>

              <div className='w-full bg-gray-200 h-2 rounded mt-2'>
                <div className={`h-2 rounded ${f.status === "error" ? "bg-red-500" : f.status === "success" ? "bg-green-500" : "bg-blue-500"}`} style={{ width: `${f.progress}%` }}></div>
              </div>

              <div className='mt-1 text-xs text-gray-600'>
                Processing: <span className={f.processStatus === "processed" ? "text-green-600" : f.processStatus === "processing" ? "text-blue-600" : f.processStatus === "failed" ? "text-red-500" : "text-gray-500"}>{f.processStatus}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
