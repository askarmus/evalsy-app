export const filterResumes = (resumes: any[], search: string, filterDate?: Date, selectedRecommendations: string[] = []): any[] => {
  const lowerSearch = search.toLowerCase();

  const isSameDay = (d1: Date, d2: Date) => d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();

  return resumes.filter((resume) => {
    const matchesText = resume.name?.toLowerCase().includes(lowerSearch) || resume.analysisResults?.name?.toLowerCase().includes(lowerSearch) || resume.analysisResults?.email?.toLowerCase().includes(lowerSearch) || resume.analysisResults?.phone?.toLowerCase().includes(lowerSearch) || resume.analysisResults?.total_experience?.toString().toLowerCase().includes(lowerSearch) || resume.analysisResults?.relevant_experience?.toString().toLowerCase().includes(lowerSearch) || resume.analysisResults?.match_score?.toString().toLowerCase().includes(lowerSearch) || resume.analysisResults?.education?.degree?.toLowerCase().includes(lowerSearch);

    const matchesDate = filterDate ? isSameDay(new Date(resume.createdAt), filterDate) : true;

    const matchesRecommendation = selectedRecommendations.length === 0 || selectedRecommendations.includes(resume.analysisResults?.hireRecommendation?.toLowerCase());

    return matchesText && matchesDate && matchesRecommendation;
  });
};
