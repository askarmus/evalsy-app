"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { io, Socket } from "socket.io-client";
import axios from "axios";
import { Input, Pagination, Progress, Tab, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tabs } from "@heroui/react";
import { Breadcrumb } from "@/components/bread.crumb";
import { AiFillFileUnknown, AiOutlineCloudUpload, AiOutlineFilePdf, AiOutlineFileWord } from "react-icons/ai";

type FileProgress = {
  file: File;
  progress: number; // final mapped progress (0-100)
  sourceProgress?: {
    axios: number; // 0–100 from axios
    socket: number; // 0–100 from socket
  };
  status: "pending" | "uploading" | "finishing" | "complete" | "error";
};

const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

const PAGE_SIZE = 20;

export default function UploadFiles() {
  const [files, setFiles] = useState<FileProgress[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_BASE_API_URL!, {
      transports: ["websocket"],
      withCredentials: true,
    });

    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      console.log("✅ Connected to socket:", socketInstance.id);
    });

    // GCS Streaming progress: 50–100%
    socketInstance.on("upload-progress", ({ file, progress }) => {
      const mapped = 50 + Math.floor(progress * 0.5); // 50–100%

      setFiles((prev) =>
        prev.map((f) =>
          f.file.name === file
            ? {
                ...f,
                progress: Math.max(f.progress, mapped), // prevent regress
                sourceProgress: {
                  ...f.sourceProgress,
                  axios: f.sourceProgress?.axios ?? 0,
                  socket: progress,
                },
                status: mapped >= 100 ? "finishing" : "uploading",
              }
            : f
        )
      );
    });

    socketInstance.on("upload-complete", ({ file }) => {
      setFiles((prev) => prev.map((f) => (f.file.name === file ? { ...f, progress: 100, status: "complete" } : f)));
    });

    return () => {
      socketInstance.disconnect();
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
    if (type.includes("pdf")) return <AiOutlineFilePdf />;
    if (type.includes("word")) return <AiOutlineFileWord />;
    return <AiFillFileUnknown />;
  };

  const uploadFiles = async (incoming: File[] | File) => {
    const filesToUpload = Array.isArray(incoming) ? incoming : [incoming];
    const socketId = await waitForSocketConnection();

    // Add files to UI
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

    // Upload files in parallel
    await Promise.all(
      filesToUpload.map((file) => {
        const formData = new FormData();
        formData.append("files", file);

        return axios
          .post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/resume/upload`, formData, {
            headers: { "x-socket-id": socketId },
            withCredentials: true,
            onUploadProgress: (event) => {
              const percent = Math.round((event.loaded * 100) / (event.total || 1));
              const mapped = Math.floor(percent * 0.5); // 0–50%

              setFiles((prev) =>
                prev.map((f) =>
                  f.file.name === file.name
                    ? {
                        ...f,
                        progress: Math.max(f.progress, mapped), // prevent backward
                        sourceProgress: {
                          ...f.sourceProgress,
                          axios: percent,
                          socket: f.sourceProgress?.socket ?? 0,
                        },
                        status: "uploading",
                      }
                    : f
                )
              );
            },
          })
          .catch((err) => {
            console.error("Upload error", err);
            setFiles((prev) => prev.map((f) => (f.file.name === file.name ? { ...f, status: "error" } : f)));
          });
      })
    );
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

  const uploadingQueue = files.filter((f) => ["pending", "uploading", "finishing", "error"].includes(f.status));

  const filteredFiles = useMemo(() => files.filter((f) => f.status === "complete").filter((f) => f.file.name.toLowerCase().includes(search.toLowerCase())), [files, search]);

  const paginatedFiles = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredFiles.slice(start, start + PAGE_SIZE);
  }, [filteredFiles, currentPage]);

  const totalPages = Math.ceil(filteredFiles.length / PAGE_SIZE);
  const breadcrumbItems = [
    { name: "Dashboard", link: "/" },
    { name: "Job", link: "" },
    { name: "Analyzer", link: "" },
  ];

  const overallProgress = useMemo(() => {
    if (uploadingQueue.length === 0) return 0;
    const total = uploadingQueue.reduce((sum, f) => sum + f.progress, 0);
    return Math.round(total / uploadingQueue.length);
  }, [uploadingQueue]);

  return (
    <div className='my-10 px-4 lg:px-6 max-w-[90rem] mx-auto w-full flex flex-col gap-4'>
      <Breadcrumb items={breadcrumbItems} />
      <h3 className='text-xl font-semibold'>Resume Analyzer - Senior Software Engineer</h3>

      <div {...getRootProps()} className={`border-2 border-dashed p-4 rounded-md text-center cursor-pointer ${isDragActive ? "border-blue-600 bg-blue-50" : "border-gray-400"}`}>
        <input {...getInputProps()} />
        <div className='flex flex-col items-center justify-center gap-2'>
          <AiOutlineCloudUpload className='h-10 w-10 text-muted-foreground' />
          <h3 className='text-lg font-medium'>{isDragActive ? "Drop your resumes here..." : "Drag & drop resumes here, or click to select"}</h3>
          <p className='text-sm text-muted-foreground'>Only .pdf, .doc, .docx allowed</p>
        </div>
      </div>

      {uploadingQueue.length > 0 && (
        <div className='w-full mt-2'>
          <Progress
            value={overallProgress}
            showValueLabel
            label='Overall Upload Progress'
            size='sm'
            radius='sm'
            classNames={{
              base: "max-w-full",
              indicator: "bg-gradient-to-r from-purple-500 to-pink-500",
              label: "text-sm font-medium text-default-700",
            }}
          />
        </div>
      )}

      <div className='flex justify-between flex-wrap gap-4 items-center'>
        <Input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          placeholder='Search files...'
          classNames={{ input: "w-full", mainWrapper: "w-full" }}
        />
        <Tabs variant='solid'>
          <Tab key='poor' title='Poor' />
          <Tab key='average' title='Average' />
          <Tab key='good' title='Good' />
          <Tab key='verygood' title='Very Good' />
        </Tabs>
      </div>

      <Table
        aria-label='Uploaded resumes'
        bottomContent={
          <div className='flex w-full justify-center'>
            <Pagination isCompact showControls showShadow color='primary' page={currentPage} total={totalPages} onChange={setCurrentPage} />
          </div>
        }
        classNames={{ wrapper: "min-h-[222px]" }}>
        <TableHeader>
          <TableColumn>FILE</TableColumn>
          <TableColumn>SIZE</TableColumn>
        </TableHeader>
        <TableBody emptyContent={"No resumes found"}>
          {paginatedFiles.map(({ file }, i) => (
            <TableRow key={i}>
              <TableCell className='flex items-center gap-2 font-medium'>
                {getIcon(file.type)}
                {file.name}
              </TableCell>
              <TableCell>{formatSize(file.size)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {uploadingQueue.length > 0 && (
        <div className='fixed bottom-4 right-4 z-50 w-[360px] bg-white border shadow-xl rounded-xl overflow-hidden'>
          <div className='bg-blue-600 text-white px-4 py-2 font-medium'>⬆ Upload Queue</div>
          <div className='divide-y max-h-[300px] overflow-y-auto'>
            {uploadingQueue.map(({ file, status, progress }, i) => (
              <div key={i} className='p-3 text-sm space-y-2'>
                <div className='flex justify-between items-center'>
                  <span className='truncate font-medium'>{file.name}</span>
                  {status === "error" && (
                    <button onClick={() => uploadFiles(file)} className='text-blue-600 text-xs underline ml-2'>
                      Retry
                    </button>
                  )}
                </div>
                <Progress value={progress} showValueLabel size='sm' radius='sm' label={status === "pending" ? "⏳ Waiting" : status === "uploading" ? "🚀 Uploading" : status === "finishing" ? "📦 Finishing..." : status === "error" ? "❌ Failed" : ""} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
