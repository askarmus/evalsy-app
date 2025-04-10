"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { io, Socket } from "socket.io-client";
import axios from "axios";

type FileProgress = {
  file: File;
  progress: number;
  status: "pending" | "uploading" | "finishing" | "complete" | "error";
};

const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

const PAGE_SIZE = 5;

export default function UploadFiles() {
  const [files, setFiles] = useState<FileProgress[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_BASE_API_URL, {
      transports: ["websocket"],
      withCredentials: true,
    });

    setSocket(socketInstance);

    // ✅ When connected
    socketInstance.on("connect", () => {
      console.log("✅ Connected to socket:", socketInstance.id);
    });

    // ✅ Upload progress updates
    socketInstance.on("upload-progress", ({ file, progress }) => {
      setFiles((prev) =>
        prev.map((f) =>
          f.file.name === file
            ? {
                ...f,
                progress,
                status: progress >= 100 && f.status !== "complete" ? "finishing" : "uploading",
              }
            : f
        )
      );
    });

    // ✅ Upload complete
    socketInstance.on("upload-complete", ({ file }) => {
      setTimeout(() => {
        setFiles((prev) => prev.map((f) => (f.file.name === file ? { ...f, progress: 100, status: "complete" } : f)));
      }, 300); // slight delay for smoother UX
    });

    // ✅ Cleanup when component unmounts
    return () => {
      socketInstance.disconnect();
      console.log("🔌 Socket disconnected");
    };
  }, []);

  const waitForSocketConnection = (): Promise<string> => {
    return new Promise((resolve) => {
      if (socket?.connected && socket.id) {
        resolve(socket.id);
      } else {
        socket?.on("connect", () => resolve(socket.id!));
      }
    });
  };

  const formatSize = (size: number) => (size >= 1048576 ? `${(size / 1048576).toFixed(2)} MB` : `${(size / 1024).toFixed(1)} KB`);

  const getIcon = (type: string) => {
    if (type.includes("pdf")) return "📄";
    if (type.includes("word")) return "📝";
    return "📁";
  };

  const uploadFiles = async (incoming: File[] | File) => {
    const filesToUpload = Array.isArray(incoming) ? incoming : [incoming];
    const socketId = await waitForSocketConnection();
    const formData = new FormData();
    filesToUpload.forEach((f) => formData.append("files", f));

    setFiles((prev) => {
      const updated = [...prev];
      for (const file of filesToUpload) {
        const index = updated.findIndex((f) => f.file.name === file.name);
        if (index > -1) {
          updated[index] = { file, progress: 0, status: "uploading" };
        } else {
          updated.push({ file, progress: 0, status: "uploading" });
        }
      }
      return updated;
    });

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/resume/upload`, formData, {
        headers: { "x-socket-id": socketId },
        withCredentials: true,
      });
    } catch (err) {
      console.error("Upload error", err);
      setFiles((prev) => prev.map((f) => (filesToUpload.some((ft) => ft.name === f.file.name) ? { ...f, status: "error" } : f)));
    }
  };

  const onDrop = useCallback(
    (accepted: File[]) => {
      const valid = accepted.filter((f) => allowedTypes.includes(f.type));
      const rejected = accepted.filter((f) => !allowedTypes.includes(f.type));
      if (rejected.length) alert("❌ Only .pdf, .doc, .docx allowed.");
      if (valid.length) uploadFiles(valid);
    },
    [socket]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    multiple: true,
  });

  const filteredFiles = useMemo(() => files.filter((f) => f.file.name.toLowerCase().includes(search.toLowerCase())), [files, search]);

  const paginatedFiles = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredFiles.slice(start, start + PAGE_SIZE);
  }, [filteredFiles, currentPage]);

  const totalPages = Math.ceil(filteredFiles.length / PAGE_SIZE);

  return (
    <div className='p-6 max-w-6xl mx-auto space-y-6'>
      {/* Dropzone */}
      <div {...getRootProps()} className={`border-2 border-dashed p-8 rounded-md text-center cursor-pointer ${isDragActive ? "border-blue-600 bg-blue-50" : "border-gray-400"}`}>
        <input {...getInputProps()} />
        <p className='text-gray-600'>{isDragActive ? "Drop your resumes here..." : "Drag & drop resumes here, or click to select"}</p>
        <p className='text-sm text-gray-500 mt-1'>Only .pdf, .doc, .docx allowed</p>
      </div>

      {/* Search */}
      <input
        className='border rounded w-full max-w-sm px-3 py-2 text-sm'
        placeholder='Search files...'
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
      />

      {/* Table */}
      <div className='overflow-x-auto'>
        <table className='w-full table-auto border rounded text-sm'>
          <thead className='bg-gray-100'>
            <tr>
              <th className='px-4 py-2 text-left'>File</th>
              <th className='px-4 py-2 text-left'>Type</th>
              <th className='px-4 py-2 text-left'>Size</th>
              <th className='px-4 py-2 text-left'>Status</th>
              <th className='px-4 py-2 text-left'>Progress</th>
            </tr>
          </thead>
          <tbody>
            {paginatedFiles.map(({ file, status, progress }, i) => (
              <tr key={i} className={`border-t ${status === "error" ? "bg-red-50" : ""}`}>
                <td className='px-4 py-2 whitespace-nowrap font-medium flex items-center gap-2'>
                  {getIcon(file.type)}
                  {file.name}
                </td>
                <td className='px-4 py-2'>{file.type}</td>
                <td className='px-4 py-2'>{formatSize(file.size)}</td>
                <td className='px-4 py-2'>
                  {status === "pending" && "⏳ Waiting"}
                  {status === "uploading" && "🚀 Uploading"}
                  {status === "finishing" && "📦 Finishing..."}
                  {status === "complete" && "✅ Done"}
                  {status === "error" && (
                    <div className='flex items-center gap-2 text-red-600'>
                      ❌ Failed
                      <button className='text-blue-600 text-xs underline' onClick={() => uploadFiles(file)}>
                        🔁 Retry
                      </button>
                    </div>
                  )}
                </td>
                <td className='px-4 py-2 w-[200px]'>
                  <div className='h-2 bg-gray-200 rounded'>
                    <div className='h-2 bg-green-500 rounded transition-all duration-300' style={{ width: `${progress}%` }} />
                  </div>
                  <div className='text-right text-xs text-gray-500 mt-1'>{progress}%</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className='flex gap-2 justify-end pt-4'>
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button key={idx} onClick={() => setCurrentPage(idx + 1)} className={`px-3 py-1 rounded border text-sm ${currentPage === idx + 1 ? "bg-blue-600 text-white" : "bg-white text-gray-600"}`}>
              {idx + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
