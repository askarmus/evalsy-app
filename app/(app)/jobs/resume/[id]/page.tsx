"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { io, Socket } from "socket.io-client";
import axios from "axios";
import { Input, Pagination, Progress, Tab, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tabs } from "@heroui/react";
import { Breadcrumb } from "@/components/bread.crumb";
import { AiFillFileUnknown, AiOutlineCloudUpload, AiOutlineFilePdf, AiOutlineFileWord } from "react-icons/ai";
import { nanoid } from "nanoid";
import { useParams } from "next/navigation";
import { fetchResumes } from "@/services/resume.service";
import DateFormatter from "@/app/utils/DateFormatter";
import { truncateText } from "@/app/utils/truncate.text";

type FileProgress = {
  file: File;
  progress: number;
  sourceProgress?: {
    axios: number;
    socket: number;
  };
  status: "pending" | "uploading" | "finishing" | "complete" | "error";
  url?: string;
  resumeId?: string;
};

const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

const PAGE_SIZE = 10;

export default function UploadFiles() {
  const [files, setFiles] = useState<FileProgress[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [uploadedResumes, setUploadedResumes] = useState<any[]>([]);

  const { id } = useParams() as { id: string };

  const loadResumes = useCallback(async () => {
    const result = await fetchResumes(id);
    setUploadedResumes(result);
  }, [id]);

  useEffect(() => {
    if (id) {
      loadResumes();
    }
  }, [id, loadResumes]);

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

    // Create a file + resumeId pair for each file
    const filesWithIds = filesToUpload.map((file) => ({
      file,
      resumeId: nanoid(),
    }));

    // Add files to UI with resumeId
    setFiles((prev) => {
      const updated = [...prev];
      for (const { file, resumeId } of filesWithIds) {
        const index = updated.findIndex((f) => f.file.name === file.name);
        const entry: FileProgress = {
          file,
          resumeId,
          progress: 0,
          status: "uploading",
        };
        if (index > -1) {
          updated[index] = entry;
        } else {
          updated.push(entry);
        }
      }
      return updated;
    });

    // Upload files
    await Promise.all(
      filesWithIds.map(({ file, resumeId }) => {
        const formData = new FormData();
        formData.append("files", file);
        formData.append("resumeId", resumeId);
        formData.append("jobId", id);

        return axios
          .post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/resume/upload`, formData, {
            headers: { "x-socket-id": socketId },
            withCredentials: true,
            onUploadProgress: (event) => {
              const percent = Math.round((event.loaded * 100) / (event.total || 1));
              const mapped = Math.floor(percent * 0.5);

              setFiles((prev) =>
                prev.map((f) =>
                  f.resumeId === resumeId
                    ? {
                        ...f,
                        progress: Math.max(f.progress, mapped),
                        sourceProgress: {
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
          .then((response) => {
            const uploadedFile = response.data?.files?.find((f: any) => f.resumeId === resumeId);
            if (uploadedFile) {
              setFiles((prev) =>
                prev.map((f) =>
                  f.resumeId === resumeId
                    ? {
                        ...f,
                        progress: 100,
                        status: "complete",
                        url: uploadedFile.ur,
                      }
                    : f
                )
              );
            }
          })
          .catch((err) => {
            console.error("Upload error", err);
            setFiles((prev) => prev.map((f) => (f.resumeId === resumeId ? { ...f, status: "error" } : f)));
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

  // Combine uploaded resumes and completed file uploads
  const combinedResumes = useMemo(() => {
    const completedUploads = files
      .filter((f) => f.status === "complete")
      .map((f) => ({
        id: nanoid(),
        resumeId: f.resumeId,
        jobId: id,
        name: f.file.name,
        url: f.url || "", // ✅ This enables download link
        analysisResults: null,
        status: "UPLOADED",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: "",
      }));

    return [...completedUploads, ...uploadedResumes];
  }, [files, uploadedResumes, id]);

  // Filter combined resumes based on search
  const filteredResumes = useMemo(() => {
    return combinedResumes.filter((resume) => resume.name.toLowerCase().includes(search.toLowerCase()));
  }, [combinedResumes, search]);

  // Paginate filtered resumes
  const paginatedResumes = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredResumes.slice(start, start + PAGE_SIZE);
  }, [filteredResumes, currentPage]);

  const totalPages = Math.ceil(filteredResumes.length / PAGE_SIZE);
  const breadcrumbItems = [
    { name: "Dashboard", link: "/" },
    { name: "Job", link: "/jobs/list" },
    { name: "Analyzer", link: null },
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
        <div className='flex flex-row gap-3.5 flex-wrap'>
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder='Search files...'
            className='w-full'
          />
        </div>
        <div className='flex flex-row gap-3.5 flex-wrap'>
          <Tabs variant='solid'>
            <Tab key='poor' title='Poor' />
            <Tab key='average' title='Average' />
            <Tab key='good' title='Good' />
            <Tab key='verygood' title='Very Good' />
          </Tabs>
        </div>
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
          <TableColumn>CREATED ON</TableColumn>
          <TableColumn>STATUS</TableColumn>
        </TableHeader>
        <TableBody emptyContent={"No resumes found"}>
          {paginatedResumes.map((resume, i) => (
            <TableRow key={i}>
              <TableCell className='flex items-center gap-2 font-medium'>
                {getIcon(resume.name.includes(".pdf") ? "application/pdf" : resume.name.includes(".doc") ? "application/msword" : "")}
                <a
                  href={resume.url} // Make sure `resume.url` is the direct path to the file
                  download={resume.name}
                  className='text-blue-600 hover:underline'>
                  {truncateText(resume.name, 40)}
                </a>
              </TableCell>
              <TableCell>
                {/* Size isn't available in the resume data, you might need to add it to your API response */}
                N/A
              </TableCell>
              <TableCell>{DateFormatter.formatDate(resume.createdAt)}</TableCell>

              <TableCell>{resume.status === "UPLOADED" ? "Uploaded" : resume.status}</TableCell>
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
