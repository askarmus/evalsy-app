import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { showToast } from '@/app/utils/toastUtils';
import { upload } from '@/services/company.service';
import { CircularProgress } from '@heroui/react';

interface FileUploadWithPreviewProps {
  onUpload: (blob: any) => void;
  acceptedFileTypes?: { [key: string]: string[] }; // default: image/*
  browseText?: string; // NEW: customizable browse button text
}

const FileUploadWithPreview: React.FC<FileUploadWithPreviewProps> = ({
  onUpload,
  acceptedFileTypes = { 'image/*': [] },
  browseText = 'Browse files', // Default caption
}) => {
  const [isUploading, setUploading] = useState(false);

  const onDrop = async (acceptedFiles: File[]) => {
    if (!acceptedFiles || acceptedFiles.length === 0) {
      showToast.error('No file selected for upload.');
      return;
    }

    const file = acceptedFiles[0];
    setUploading(true);

    try {
      const blob = await upload(file);
      onUpload(blob);
      showToast.success('File uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file:', error);
      showToast.error('File upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    maxFiles: 1,
  });

  return (
    <div className="flex items-center gap-4">
      <div {...getRootProps()} className="flex-1 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-slate-100 transition-colors">
        <input {...getInputProps()} />
        {isUploading ? (
          <div className="flex items-center justify-center gap-2 text-center">
            <CircularProgress aria-label="Loading..." size="sm" />
            Uploading...
          </div>
        ) : (
          <div>
            <p className="text-sm text-slate-600 font-medium">{browseText}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadWithPreview;
