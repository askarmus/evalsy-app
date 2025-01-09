import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { showToast } from "@/app/utils/toastUtils";
import { uploadLogo } from "@/services/company.service";

interface FileUploadWithPreviewProps {
  onUpload: (url: string) => void; // Callback function to return the uploaded file URL
}

const FileUploadWithPreview: React.FC<FileUploadWithPreviewProps> = ({
  onUpload,
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setUploading] = useState(false);

  const onDrop = async (acceptedFiles: File[]) => {
    if (!acceptedFiles || acceptedFiles.length === 0) {
      showToast.error("No file selected for upload.");
      return;
    }

    const file = acceptedFiles[0];
    setPreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      const url = await uploadLogo(file); // Service call to upload the file
      onUpload(url); // Pass the file URL back to the parent component
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
      "image/*": [], // Correct type for 'accept'
    },
    maxFiles: 1,
  });

  return (
    <div className="flex items-center gap-4">
      <div
        {...getRootProps()}
        className="flex-1 border-2 border-dashed border-primary rounded-lg p-4 text-center cursor-pointer"
      >
        <input {...getInputProps()} />
        {isUploading ? (
          <p>Uploading...</p>
        ) : (
          <p>Drag and drop an image here, or click to select one</p>
        )}
      </div>
      {preview && (
        <div className="flex flex-col items-center">
          <img
            src={preview}
            alt="Preview"
            className=" h-16 object-cover rounded-md"
          />
        </div>
      )}
    </div>
  );
};

export default FileUploadWithPreview;
