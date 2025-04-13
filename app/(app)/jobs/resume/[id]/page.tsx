// ✅ FULL COMPONENT: UploadFiles with Retry, Upload Summary, and Row Priority

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { io, Socket } from "socket.io-client";
import axios from "axios";
import { Button, Card, CardBody, CardHeader, CircularProgress, Input, Pagination, Progress, Tab, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tabs } from "@heroui/react";
import { Breadcrumb } from "@/components/bread.crumb";
import { AiFillFileUnknown, AiOutlineCloudUpload, AiOutlineFilePdf, AiOutlineFileWord } from "react-icons/ai";
import { nanoid } from "nanoid";
import { useParams } from "next/navigation";
import { fetchResumes } from "@/services/resume.service";
import DateFormatter from "@/app/utils/DateFormatter";
import { truncateText } from "@/app/utils/truncate.text";
import { useResumeStatus } from "@/context/ResumeStatusContext";

const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
const PAGE_SIZE = 10;

export default function UploadFiles() {
  const [files, setFiles] = useState<any[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [uploadedResumes, setUploadedResumes] = useState<any[]>([]);
  const { notifications } = useResumeStatus();
  const { id } = useParams() as { id: string };

  const loadResumes = useCallback(async () => {
    const result = await fetchResumes(id);
    setUploadedResumes(result);
  }, [id]);

  useEffect(() => {
    if (notifications.length === 0) return;

    setUploadedResumes((prev) => {
      const updated = prev.map((r) => {
        const notification = notifications.find((n) => n.resumeId === r.resumeId);
        if (!notification) return r;
        return { ...r, analysisResults: notification.analysisResults, status: "processed" };
      });
      return updated;
    });
  }, [notifications]);

  useEffect(() => {
    if (id) loadResumes();
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

    socketInstance.on("upload-progress", ({ file, progress }) => {
      const mapped = 50 + Math.floor(progress * 0.5);
      setFiles((prev) =>
        prev.map((f) =>
          f.file.name === file
            ? {
                ...f,
                progress: Math.max(f.progress, mapped),
                status: mapped >= 100 ? "finishing" : "uploading",
              }
            : f
        )
      );
    });

    socketInstance.on("upload-complete", ({ file }) => {
      setFiles((prev) => prev.map((f) => (f.file.name === file ? { ...f, progress: 100, status: "complete" } : f)));
      setUploadedResumes((prev) => prev.map((r) => (r.name === file ? { ...r, progress: 100, status: "uploaded" } : r)));
    });

    // ✅ Proper cleanup function
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const waitForSocketConnection = (): Promise<string> => {
    return new Promise((resolve) => {
      if (socket?.connected && socket.id) resolve(socket.id);
      else socket?.on("connect", () => resolve(socket.id!));
    });
  };

  const getIcon = (type: string) => {
    if (type.includes("pdf")) return <AiOutlineFilePdf />;
    if (type.includes("word")) return <AiOutlineFileWord />;
    return <AiFillFileUnknown />;
  };

  const uploadFiles = async (incoming: File[] | File) => {
    const filesToUpload = Array.isArray(incoming) ? incoming : [incoming];
    const socketId = await waitForSocketConnection();

    const filesWithIds = filesToUpload.map((file) => ({ file, resumeId: nanoid() }));

    setUploadedResumes((prev) => {
      const newResumes = filesWithIds.map(({ file, resumeId }) => ({
        resumeId,
        jobId: id,
        name: file.name,
        url: "",
        analysisResults: null,
        status: "uploading",
        progress: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: "",
      }));

      const existingIds = new Set(prev.map((r) => r.resumeId));
      const filtered = newResumes.filter((r) => !existingIds.has(r.resumeId));

      return [...prev, ...filtered];
    });

    setFiles((prev) => {
      const updated = [...prev];
      for (const { file, resumeId } of filesWithIds) {
        updated.push({ file, resumeId, progress: 0, status: "uploading" });
      }
      return updated;
    });

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
              setUploadedResumes((prev) => prev.map((r) => (r.resumeId === resumeId ? { ...r, progress: percent, status: "uploading" } : r)));
            },
          })
          .catch((err) => {
            console.error("Upload error", err);
            setFiles((prev) => prev.map((f) => (f.resumeId === resumeId ? { ...f, status: "error" } : f)));
            setUploadedResumes((prev) => prev.map((r) => (r.resumeId === resumeId ? { ...r, status: "error" } : r)));
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { "application/pdf": [".pdf"], "application/msword": [".doc"], "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"] }, multiple: true });

  const uploadingResumes = uploadedResumes.filter((r) => r.status === "uploading");

  const overallProgress = useMemo(() => {
    if (uploadingResumes.length === 0) return 0;
    const total = uploadingResumes.reduce((sum, r) => sum + (r.progress || 0), 0);
    return Math.round(total / uploadingResumes.length);
  }, [uploadingResumes]);

  const filteredResumes = useMemo(() => {
    return uploadedResumes.filter((resume) => resume.name.toLowerCase().includes(search.toLowerCase()));
  }, [uploadedResumes, search]);

  const sortedResumes = useMemo(() => {
    return [...filteredResumes].sort((a, b) => {
      const priority = { uploading: 2, uploaded: 1, processed: 0 };
      const aPriority = priority[a.status] ?? -1;
      const bPriority = priority[b.status] ?? -1;
      if (aPriority !== bPriority) return bPriority - aPriority;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [filteredResumes]);

  const paginatedResumes = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return sortedResumes.slice(start, start + PAGE_SIZE);
  }, [sortedResumes, currentPage]);

  const totalPages = Math.ceil(filteredResumes.length / PAGE_SIZE);

  return (
    <div className='my-10 px-4 lg:px-6 max-w-[90rem] mx-auto w-full flex flex-col gap-4'>
      <Breadcrumb
        items={[
          { name: "Dashboard", link: "/" },
          { name: "Job", link: "/jobs/list" },
          { name: "Analyzer", link: null },
        ]}
      />
      <h3 className='text-xl font-semibold'>Resume Analyzer - Senior Software Engineer</h3>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <h1 className='text-sm font-medium'>Total Candidates</h1>
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' className='h-4 w-4 text-muted-foreground'>
              <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
              <circle cx='9' cy='7' r='4' />
              <path d='M22 21v-2a4 4 0 0 0-3-3.87' />
              <path d='M16 3.13a4 4 0 0 1 0 7.75' />
            </svg>
          </CardHeader>
          <CardBody>
            <div className='text-2xl font-bold'>245</div>
            <p className='text-xs text-muted-foreground'>35% match score or below</p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <h1 className='text-sm font-medium'>Average Match Score</h1>
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' className='h-4 w-4 text-muted-foreground'>
              <path d='M22 12h-4l-3 9L9 3l-3 9H2' />
            </svg>
          </CardHeader>
          <CardBody>
            <div className='text-2xl font-bold'>72%</div>
            <p className='text-xs text-muted-foreground'>35% match score or below</p>
          </CardBody>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <h1 className='text-sm font-medium'>Top Candidates</h1>
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' className='h-4 w-4 text-muted-foreground'>
              <path d='M22 12h-4l-3 9L9 3l-3 9H2' />
            </svg>
          </CardHeader>
          <CardBody>
            <div className='text-2xl font-bold'>72%</div>
            <p className='text-xs text-muted-foreground'>35% match score or below</p>
          </CardBody>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <h1 className='text-sm font-medium'>Rejected Candidates</h1>
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' className='h-4 w-4 text-muted-foreground'>
              <path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
            </svg>
          </CardHeader>
          <CardBody>
            <div className='text-2xl font-bold'>12</div>
            <p className='text-xs text-muted-foreground'>35% match score or below</p>
          </CardBody>
        </Card>
      </div>
      <div {...getRootProps()} className={`border-2 border-dashed p-4 rounded-xl text-center cursor-pointer ${isDragActive ? "border-blue-600 bg-blue-50" : "border-gray-400"}`}>
        <input {...getInputProps()} />
        <div className='flex items-center gap-4 justify-center'>
          <AiOutlineCloudUpload className='h-10 w-10 text-muted-foreground' />
          <div className='flex flex-col text-center gap-1'>
            <h3 className='text-lg font-medium'>{isDragActive ? "Drop your resumes here..." : "Drag & drop resumes here, or click to select"}</h3>
            <p className='text-sm text-muted-foreground'>Only .pdf, .doc, .docx allowed</p>
          </div>
        </div>
      </div>

      {uploadingResumes.length > 0 && <Progress value={overallProgress} label={`Uploading ${uploadingResumes.length} of ${uploadedResumes.length} files`} showValueLabel size='sm' radius='sm' classNames={{ base: "max-w-full", indicator: "bg-gradient-to-r from-purple-500 to-pink-500", label: "text-sm font-medium text-default-700" }} />}

      <Table
        aria-label='Uploaded resumes'
        bottomContent={
          <div className='flex w-full justify-center'>
            <Pagination isCompact showControls showShadow color='primary' page={currentPage} total={totalPages} onChange={setCurrentPage} />
          </div>
        }>
        <TableHeader>
          <TableColumn>FILE</TableColumn>
          <TableColumn>CANDIDATE</TableColumn>
          <TableColumn>TOTAL EXP</TableColumn>
          <TableColumn>RELEVANT EXP</TableColumn>
          <TableColumn>MATCH %</TableColumn>
          <TableColumn>CREATED</TableColumn>
          <TableColumn align='end'>{""}</TableColumn>
        </TableHeader>
        <TableBody emptyContent={"No resumes found"}>
          {paginatedResumes.map((resume, i) => (
            <TableRow key={i}>
              <TableCell className='flex items-center gap-2 font-medium'>
                {getIcon(resume.name)}
                <a href={resume.url} download={resume.name} className='text-blue-600 hover:underline'>
                  {truncateText(resume.name, 40)}
                </a>
              </TableCell>
              <TableCell>{resume.analysisResults?.name ?? "N/A"}</TableCell>
              <TableCell>{resume.analysisResults?.total_experience ?? "N/A"}</TableCell>
              <TableCell>{resume.analysisResults?.relevant_experience ?? "N/A"}</TableCell>
              <TableCell>{resume.analysisResults?.match_score ?? "N/A"}</TableCell>
              <TableCell>{DateFormatter.formatDate(resume.createdAt)}</TableCell>
              <TableCell align='right' style={{ width: "150px", minWidth: "150px" }}>
                {resume.status === "processed" ? (
                  <Button size='sm' color='primary' variant='bordered'>
                    View Analysis
                  </Button>
                ) : resume.status === "uploading" ? (
                  <Progress value={resume.progress} size='sm' radius='sm' label={`${resume.progress}%`} />
                ) : resume.status === "uploaded" ? (
                  <Button size='sm' color='primary' variant='bordered' isLoading={true}>
                    Analyzing...
                  </Button>
                ) : resume.status === "error" ? (
                  <Button
                    size='sm'
                    variant='flat'
                    onClick={() => {
                      const fileFromList = files.find((f) => f.resumeId === resume.resumeId)?.file;
                      if (fileFromList) uploadFiles(fileFromList);
                    }}>
                    Retry
                  </Button>
                ) : (
                  resume.status
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
