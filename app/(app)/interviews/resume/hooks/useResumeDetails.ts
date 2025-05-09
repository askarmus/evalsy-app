import { useState } from "react";
import { getResume } from "@/services/resume.service";
import { showToast } from "@/app/utils/toastUtils";

export const useResumeDetails = (jobId: string) => {
  const [selectedResumeData, setSelectedResumeData] = useState<any>(null);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [loadingResults, setLoadingResults] = useState<{ [key: string]: boolean }>({});

  const handleViewDetails = async (resumeId: string) => {
    setLoadingResults((prev) => ({ ...prev, [resumeId]: true }));

    try {
      const data = await getResume(jobId, resumeId);
      setSelectedResumeData(data);
      setDrawerOpen(true);
    } catch (error) {
      console.error("Error fetching resume details:", error);
      showToast.error("Failed to load resume details.");
    } finally {
      setLoadingResults((prev) => ({ ...prev, [resumeId]: false }));
    }
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  return {
    selectedResumeData,
    isDrawerOpen,
    handleViewDetails,
    closeDrawer,
    loadingResults,
  };
};
