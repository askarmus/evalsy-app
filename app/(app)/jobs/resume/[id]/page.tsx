"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { io, Socket } from "socket.io-client";
import axios from "axios";
import { Button, Input, Pagination, Progress, Tab, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tabs, Tooltip } from "@heroui/react";
import { Breadcrumb } from "@/components/bread.crumb";
import { AiFillFileUnknown, AiOutlineCloudUpload, AiOutlineDelete, AiOutlineFilePdf, AiOutlineFileWord, AiOutlineRight } from "react-icons/ai";
import { nanoid } from "nanoid";
import { useParams } from "next/navigation";
import { deleteResume, fetchResumes, getResume } from "@/services/resume.service";
import DateFormatter from "@/app/utils/DateFormatter";
import { truncateText } from "@/app/utils/truncate.text";
import { useResumeStatus } from "@/context/ResumeStatusContext";
import ResumeStatsGrid from "../components/stats.card";
import ConfirmDialog from "@/components/ConfirmDialog";
import { showToast } from "@/app/utils/toastUtils";
import { FaSearch } from "react-icons/fa";
import { ResumeAnalyseDrawer } from "../components/resume.analyse.drawer";
import { getInterviewResultById } from "@/services/interview.service";
const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
const PAGE_SIZE = 10;

export default function UploadFiles() {
  const [files, setFiles] = useState<any[]>([]);
  const [loadingResults, setLoadingResults] = useState<{ [key: string]: boolean }>({});
  const [selectedResumeData, setSelectedResumeData] = useState<any>(null);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [uploadedResumes, setUploadedResumes] = useState<any[]>([]);
  const { notifications } = useResumeStatus();
  const { id } = useParams() as { id: string };
  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [resumeToDelete, setResumeToDelete] = useState<string | null>(null);
  const [resumeStats, setResumeStats] = useState({ totalCandidates: 0, avgMatchScore: 0, topCandidatesPercent: 0, rejectedCandidates: 0 });

  const loadResumes = useCallback(async () => {
    const result = await fetchResumes(id);
    setUploadedResumes(result.resumes);
    setResumeStats(result.stats);
    setJobTitle(result.jobTitle);
  }, [id]);

  const handleDeleteClick = (id: string) => {
    setResumeToDelete(id);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (resumeToDelete) {
      try {
        await deleteResume(id, resumeToDelete);
        setConfirmDialogOpen(false);
        setResumeToDelete(null);
        showToast.success("Resume deleted successfully.");
        await loadResumes();
      } catch (error) {
        console.error("Error deleting interviewer:", error);
        showToast.error("Failed to delete the resume. Please try again.");
      }
    }
  };

  const handleCancelDelete = () => {
    setConfirmDialogOpen(false);
    setResumeToDelete(null);
  };

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

      const totalAfterUpload = uploadedResumes.length + valid.length;
      if (totalAfterUpload > 20) {
        showToast.error("You can upload a maximum of 20 resumes.");
        return;
      }

      if (valid.length) uploadFiles(valid);
    },
    [socket, uploadedResumes]
  );

  const uploadingResumes = uploadedResumes.filter((r) => r.status === "uploading");
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
    disabled: uploadedResumes.length >= 20,
  });

  const overallProgress = useMemo(() => {
    if (uploadingResumes.length === 0) return 0;
    const total = uploadingResumes.reduce((sum, r) => sum + (r.progress || 0), 0);
    return Math.round(total / uploadingResumes.length);
  }, [uploadingResumes]);

  const filteredResumes = useMemo(() => {
    return uploadedResumes.filter((resume) => {
      const lowerSearch = search.toLowerCase();

      return resume.name?.toLowerCase().includes(lowerSearch) || resume.analysisResults?.name?.toLowerCase().includes(lowerSearch) || resume.analysisResults?.email?.toLowerCase().includes(lowerSearch) || resume.analysisResults?.phone?.toLowerCase().includes(lowerSearch) || resume.analysisResults?.total_experience?.toString().toLowerCase().includes(lowerSearch) || resume.analysisResults?.relevant_experience?.toString().toLowerCase().includes(lowerSearch) || resume.analysisResults?.match_score?.toString().toLowerCase().includes(lowerSearch) || resume.analysisResults?.education?.degree?.toLowerCase().includes(lowerSearch);
    });
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

  const handleViewDetails = async (resumeId: string) => {
    setLoadingResults((prev) => ({ ...prev, [resumeId]: true }));

    try {
      const data = await getResume(id, resumeId);
      console.log("Resume data:", data);
      setSelectedResumeData(data);
      setDrawerOpen(true);
    } catch (error) {
      console.error("Error fetching interviewer data:", error);
    }

    setLoadingResults((prev) => ({ ...prev, [resumeId]: false }));
  };

  return (
    <div className='my-10 px-4 lg:px-6 max-w-[90rem] mx-auto w-full flex flex-col gap-4'>
      <Breadcrumb
        items={[
          { name: "Dashboard", link: "/" },
          { name: "Job", link: "/jobs/list" },
          { name: "Analyzer", link: null },
        ]}
      />
      <h3 className='text-xl font-semibold mb-5'>Resume Analyzer - {jobTitle}</h3>
      <ResumeStatsGrid resumeStats={resumeStats} />

      <Input value={search} onChange={(e) => setSearch(e.target.value)} labelPlacement='outside' placeholder='Search by name, email, phone, degree...' startContent={<FaSearch className='h-4 w-4 text-muted-foreground' />} type='search' />

      <div {...getRootProps()} className={`border-2 border-dashed p-4 rounded-xl text-center cursor-pointer transition-all duration-200 ${isDragActive ? "border-blue-600 bg-blue-50" : uploadingResumes.length > 0 ? "border-gray-300 bg-gray-100 opacity-50 cursor-not-allowed" : "border-gray-400"}`}>
        <input {...getInputProps()} disabled={uploadingResumes.length > 0} />
        <div className='flex items-center gap-4 justify-center'>
          <AiOutlineCloudUpload className='h-10 w-10 text-muted-foreground' />
          <div className='flex flex-col text-center gap-1'>
            <h3 className='text-lg font-medium'>{uploadingResumes.length > 0 ? "Upload in progress..." : isDragActive ? "Drop your resumes here..." : "Drag & drop resumes here, or click to select"}</h3>
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
          <TableColumn align='end' width={5}>
            {""}
          </TableColumn>
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
                  <Button color='primary' endContent={<AiOutlineRight />} isLoading={loadingResults[resume.resumeId]} onPress={() => handleViewDetails(resume.resumeId)} radius='full' size='sm'>
                    {loadingResults[resume.resumeId] ? "Loading.." : " View Analysis"}
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
                    onPress={() => {
                      const fileFromList = files.find((f) => f.resumeId === resume.resumeId)?.file;
                      if (fileFromList) uploadFiles(fileFromList);
                    }}>
                    Retry
                  </Button>
                ) : (
                  resume.status
                )}
              </TableCell>
              <TableCell>
                <Tooltip content='Delete Resume'>
                  <Button isIconOnly aria-label='Delete' onPress={() => handleDeleteClick(resume.resumeId)} size='sm' color='danger' variant='bordered'>
                    <AiOutlineDelete />
                  </Button>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ResumeAnalyseDrawer isOpen={isDrawerOpen} onClose={() => setDrawerOpen(false)} resumeData={selectedResumeData} />

      <ConfirmDialog isOpen={isConfirmDialogOpen} onClose={handleCancelDelete} title='Confirm Deletion' description='Are you sure you want to delete this resume?' onConfirm={handleConfirmDelete} confirmButtonText='Delete' cancelButtonText='Cancel' />
    </div>
  );
}
