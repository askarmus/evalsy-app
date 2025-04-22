// app/jobs/components/resume.dropzone.tsx
"use client";

import { FC } from "react";
import { useDropzone } from "react-dropzone";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { showToast } from "@/app/utils/toastUtils";

interface ResumeDropzoneProps {
  onDrop: (acceptedFiles: File[]) => void;
  uploadingCount: number;
  disabled: boolean;
}

const ResumeDropzone: FC<ResumeDropzoneProps> = ({ onDrop, uploadingCount, disabled }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected: () => {
      showToast.error("Only .pdf, .doc, .docx files are allowed.");
    },
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    multiple: true,
    maxFiles: 20,
    disabled,
  });

  return (
    <div {...getRootProps()} className={`border-2 border-dashed p-4 bg-white rounded-xl text-center cursor-pointer transition-all duration-200 ${isDragActive ? "border-blue-600 bg-blue-50" : uploadingCount > 0 ? "border-gray-100 bg-gray-100 opacity-50 cursor-not-allowed" : "border-gray-300"}`}>
      <input {...getInputProps()} disabled={disabled} />
      <div className='flex items-center gap-4 justify-center'>
        <AiOutlineCloudUpload className='h-10 w-10  text-gray-500' />
        <div className='flex flex-col text-center gap-1'>
          <h3 className='text-sm font-medium'>{uploadingCount > 0 ? "Upload in progress..." : isDragActive ? "Drop your resumes here..." : "Drag & drop resumes here, or click to select"}</h3>
          <p className='text-sm text-muted-foreground'>Only .pdf, .doc, .docx allowed</p>
        </div>
      </div>
    </div>
  );
};

export default ResumeDropzone;
