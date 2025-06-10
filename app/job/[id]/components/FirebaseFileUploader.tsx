import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { showToast } from '@/app/utils/toastUtils';
import { CircularProgress, Progress } from '@heroui/react';
import { storage } from '@/config/firebase.config';

interface FirebaseFileUploaderProps {
  onUpload: (url: string) => void;
  acceptedFileTypes?: { [key: string]: string[] };
  browseText?: string;
}

const FirebaseFileUploader: React.FC<FirebaseFileUploaderProps> = ({ onUpload, acceptedFileTypes = { 'image/*': [] }, browseText = 'Browse files' }) => {
  const [isUploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFirebaseUpload = useCallback(
    (file: File) => {
      const storageRef = ref(storage, `uploads/${Date.now()}-${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const pct = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(Math.round(pct));
        },
        (error) => {
          console.error('Upload error:', error);
          showToast.error('File upload failed.');
          setUploading(false);
        },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          onUpload(url);
          showToast.success('File uploaded successfully!');
          setUploading(false);
          setUploadProgress(0);
        }
      );
    },
    [onUpload]
  );

  const onDrop = (acceptedFiles: File[]) => {
    if (!acceptedFiles || acceptedFiles.length === 0) {
      showToast.error('No file selected for upload.');
      return;
    }

    const file = acceptedFiles[0];
    setUploading(true);
    handleFirebaseUpload(file);
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
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 text-center text-sm">
              <CircularProgress aria-label="Loading..." size="sm" />
              Uploading... {uploadProgress}%
            </div>
            <Progress size="sm" aria-label="Upload progress" value={uploadProgress} />
          </div>
        ) : (
          <p className="text-sm text-slate-600 font-medium">{browseText}</p>
        )}
      </div>
    </div>
  );
};

export default FirebaseFileUploader;
