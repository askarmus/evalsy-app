// app/features/resume/utils/resumeFilters.ts

export const filterResumes = (resumes: any[], search: string): any[] => {
  const lowerSearch = search.toLowerCase();

  return resumes.filter((resume) => {
    return resume.name?.toLowerCase().includes(lowerSearch) || resume.analysisResults?.name?.toLowerCase().includes(lowerSearch) || resume.analysisResults?.email?.toLowerCase().includes(lowerSearch) || resume.analysisResults?.phone?.toLowerCase().includes(lowerSearch) || resume.analysisResults?.total_experience?.toString().toLowerCase().includes(lowerSearch) || resume.analysisResults?.relevant_experience?.toString().toLowerCase().includes(lowerSearch) || resume.analysisResults?.match_score?.toString().toLowerCase().includes(lowerSearch) || resume.analysisResults?.education?.degree?.toLowerCase().includes(lowerSearch);
  });
};

export const sortResumes = (resumes: any[]): any[] => {
  const priority: Record<string, number> = {
    uploading: 2,
    uploaded: 1,
    processed: 0,
  };

  return [...resumes].sort((a, b) => {
    const aPriority = priority[a.status] ?? -1;
    const bPriority = priority[b.status] ?? -1;
    if (aPriority !== bPriority) return bPriority - aPriority;

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
};

export const paginateResumes = (resumes: any[], page: number, pageSize: number): any[] => {
  const start = (page - 1) * pageSize;
  return resumes.slice(start, start + pageSize);
};
