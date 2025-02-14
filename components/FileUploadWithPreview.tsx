import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { showToast } from "@/app/utils/toastUtils";
import { upload } from "@/services/company.service";
import { CircularProgress } from "@heroui/react";

interface FileUploadWithPreviewProps {
  onUpload: (blob: any) => void;
}

const FileUploadWithPreview: React.FC<FileUploadWithPreviewProps> = ({ onUpload }) => {
  const [isUploading, setUploading] = useState(false);

  const onDrop = async (acceptedFiles: File[]) => {
    if (!acceptedFiles || acceptedFiles.length === 0) {
      showToast.error("No file selected for upload.");
      return;
    }

    const file = acceptedFiles[0];
    setUploading(true);

    try {
      const blob = await upload(file); // Service call to upload the file
      onUpload(blob); // Pass the file URL back to the parent component
      showToast.success("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      showToast.error("File upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    maxFiles: 1,
  });

  return (
    <div className='flex items-center gap-4'>
      <div {...getRootProps()} className='flex-1 border-2 border-dashed border-primary rounded-lg p-4 text-center cursor-pointer'>
        <input {...getInputProps()} />
        {isUploading ? (
          <div className='flex items-center justify-center gap-2 text-center'>
            <CircularProgress aria-label='Loading...' size='sm' />
            Uploading...
          </div>
        ) : (
          <div>
            <p>Browse</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadWithPreview;
