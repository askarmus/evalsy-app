'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { deleteResume } from '@/services/resume.service';
import ResumeStatsGrid from '../components/stats.card';
import ConfirmDialog from '@/components/ConfirmDialog';
import { showToast } from '@/app/utils/toastUtils';
import { ResumeAnalyseDrawer } from '../components/resume.analyse.drawer';
import { useResumeNotifications } from '../hooks/useResumeNotifications';
import { useResumeDetails } from '../hooks/useResumeDetails';
import ResumeUploaderTable from '../components/MultiFileUploader';

export default function UploadFiles() {
  const { id } = useParams() as { id: string };
  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [resumeToDelete, setResumeToDelete] = useState<string | null>(null);
  const [resumeStats, setResumeStats] = useState({ totalCandidates: 0, avgMatchScore: 0, topCandidatesPercent: 0, rejectedCandidates: 0 });
  const { selectedResumeData, isDrawerOpen, handleViewDetails, closeDrawer, loadingResults } = useResumeDetails(id);
  const { notifications } = useResumeNotifications(id);

  // const loadResumes = useCallback(async () => {
  //   const result = await fetchResumes(id);
  //   setUploadedResumes(result.resumes);
  //   setResumeStats(result.stats);
  //   setJobTitle(result.jobTitle);
  // }, [id]);

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
        showToast.success('Resume deleted successfully.');
      } catch (error) {
        console.error('Error deleting resume:', error);
        showToast.error('Failed to delete the resume. Please try again.');
      }
    }
  };

  const handleCancelDelete = () => {
    setConfirmDialogOpen(false);
    setResumeToDelete(null);
  };

  return (
    <div className="my-10 px-4 lg:px-6 max-w-[90rem] mx-auto w-full flex flex-col gap-4">
      <h3 className="text-xl font-semibold mb-5">Resume Analyzer - {jobTitle}</h3>
      <ResumeStatsGrid resumeStats={resumeStats} />
      <ResumeUploaderTable jobid={id} onViewDetails={handleViewDetails} onDelete={handleDeleteClick} />
      <ResumeAnalyseDrawer isOpen={isDrawerOpen} onClose={closeDrawer} resumeData={selectedResumeData} />
      <ConfirmDialog isOpen={isConfirmDialogOpen} onClose={handleCancelDelete} title="Confirm Deletion" description="Are you sure you want to delete this resume?" onConfirm={handleConfirmDelete} confirmButtonText="Delete" cancelButtonText="Cancel" />
    </div>
  );
}
