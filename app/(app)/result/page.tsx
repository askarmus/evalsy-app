'use client';
import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Card, CardBody, Spinner, CircularProgress, CardFooter, Chip, CardHeader, Button } from '@heroui/react';
import { getAllInterviewResult, getInterviewResultById, updateReadStatus } from '@/services/interview.service';
import EvaluationChart from './components/EvaluationChart';
import Sidebar from './components/Sidebar';
import CandidateHeader from './components/CandidateHeader';
import FeedbackCard from './components/FeedbackCard';
import { useRouter, useSearchParams } from 'next/navigation';
import EventTable from './components/EventTable';
import EmptyStateCards from '@/components/shared/empty-state-cards';
import CandidateSkeleton from './components/CandidateSkeleton';
import { HiringGradeUtil } from '@/app/utils/hiring-grade.util';
import CustomVideoPlayer from './components/CustomVideoPlayer';
import { FaStopCircle } from 'react-icons/fa';
import { formatExperience } from '@/app/utils/formatExperience';
import { Brain, Play, Shield, Trophy, Video } from 'lucide-react';
import { QuestionResponses } from './components/QuestionResponses';

export default function InterviewResultList() {
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingOnResultSelected, setSsLoadingOnResultSelected] = useState(false);
  const [filterValue, setFilterValue] = useState('');
  const [interviewResults, setInterviewResults] = useState<any[]>([]);
  const [selectedInterviewerData, setSelectedInterviewerData] = useState<any>(null);
  const [selectedTab, setSelectedTab] = useState<string>('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const router = useRouter();
  const rowsPerPage = 1000;
  const searchParams = useSearchParams();
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => setIsPlaying(true);
  const handleStop = () => setIsPlaying(false);

  const fetchInterviewResult = async () => {
    try {
      setIsLoading(true);
      const id = searchParams?.get('id') ?? '';
      const data = await getAllInterviewResult(id);

      if (id) {
        setSelectedId(id);
      } else if (data.all.length > 0) {
        setSelectedId(data.all[0].id);
      }

      setInterviewResults(data.all);
      setSelectedInterviewerData(data.first);
    } catch (err) {
      console.error('Failed to fetch interview results:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviewResult();
  }, []);

  const handleViewDetails = async (resultId: string) => {
    setSelectedId(resultId);
    setSsLoadingOnResultSelected(true);

    try {
      const data = await getInterviewResultById(resultId);
      await updateReadStatus({ id: resultId });
      setInterviewResults((prev) => prev.map((item) => (item.id === resultId ? { ...item, isRead: true } : item)));
      setSelectedInterviewerData(data);
      router.replace(`/result?id=${resultId}`, { scroll: false });
    } catch (error) {
      console.error('Error fetching interviewer data:', error);
    } finally {
      setSsLoadingOnResultSelected(false);
    }
  };

  const onSearchChange = useCallback((value: string) => {
    setFilterValue(value);
    setPage(1);
  }, []);

  const filteredResults = useMemo(() => {
    let results = [...interviewResults];

    if (selectedTab === 'below-average') {
      results = results.filter((r: any) => r.totalScore <= 25);
    } else if (selectedTab === 'average') {
      results = results.filter((r: any) => r.totalScore > 25 && r.totalScore <= 50);
    } else if (selectedTab === 'good') {
      results = results.filter((r: any) => r.totalScore > 50 && r.totalScore <= 75);
    } else if (selectedTab === 'excellent') {
      results = results.filter((r: any) => r.totalScore > 75);
    }

    if (filterValue) {
      results = results.filter((r: any) => r.name.toLowerCase().includes(filterValue.toLowerCase()));
    }

    return results;
  }, [filterValue, interviewResults, selectedTab]);

  useEffect(() => {
    setPage(1);
  }, [selectedTab]);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredResults.slice(start, end);
  }, [page, filteredResults]);

  return (
    <div className=" my-10 px-4 lg:px-6  mx-auto w-full flex flex-col gap-4">
      {isLoadingOnResultSelected && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/10 backdrop-blur-sm">
          <Spinner label="Loading, please wait..." color="secondary" />
        </div>
      )}

      {isLoading && <CandidateSkeleton />}

      {!isLoading && interviewResults.length === 0 && (
        <div className="flex items-center justify-center h-full w-full">
          <EmptyStateCards
            title="No Interview Results Yet"
            description="Interview results will appear here once a candidate has completed an interview. Please check back later."
            onReset={
              interviewResults.length === 0
                ? undefined
                : () => {
                    setFilterValue('');
                    setPage(1);
                  }
            }
          />
        </div>
      )}

      {!isLoading && interviewResults.length > 0 && (
        <div className="w-full flex">
          {/* Fixed Sidebar */}
          <aside className="fixed top-240 left-230 h-screen w-[360px] min-w-[360px]  overflow-y-auto   z-50">
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} selectedTab={selectedTab} setSelectedTab={setSelectedTab} filterValue={filterValue} setFilterValue={setFilterValue} onSearchChange={onSearchChange} isLoading={isLoading} fetchInterviewResult={fetchInterviewResult} items={items} selectedId={selectedId} handleViewDetails={handleViewDetails} />
          </aside>

          {/* Main Content with left padding */}
          <main className="flex-1 min-h-screen overflow-y-auto pl-[340px]">
            <div className="p-4 pt-1">
              <Card className="mb-4 p-2">
                <CardBody>
                  <CandidateHeader selectedInterviewerData={selectedInterviewerData} />
                </CardBody>
              </Card>

              <div className="grid grid-cols-5 gap-4 mb-4">
                <Card>
                  <CardBody>
                    <div className="text-sm text-gray-600 mb-1">Current Salary</div>
                    <div className="font-semibold text-gray-900">
                      {selectedInterviewerData?.currentSalary?.amount ?? 0} {selectedInterviewerData?.currentSalary?.currency}
                    </div>
                  </CardBody>
                </Card>

                <Card>
                  <CardBody>
                    <div className="text-sm text-gray-600 mb-1">Expected Salary</div>
                    <div className="font-semibold text-gray-900">
                      {selectedInterviewerData?.expectedSalary?.amount ?? 0} {selectedInterviewerData?.expectedSalary?.currency ?? 0}
                    </div>
                  </CardBody>
                </Card>

                <Card>
                  <CardBody>
                    <div className="text-sm text-gray-600 mb-1">Total Experience</div>
                    <div className="font-semibold text-gray-900">{selectedInterviewerData?.totalExperience ? formatExperience(selectedInterviewerData.totalExperience) : 'Unknown'}</div>
                  </CardBody>
                </Card>

                <Card>
                  <CardBody>
                    <div className="text-sm text-gray-600 mb-1">Fraud Risk</div>
                    <div className="font-semibold text-gray-900">{selectedInterviewerData?.fraudProbability ?? 0}%</div>
                  </CardBody>
                </Card>

                <Card>
                  <CardBody>
                    <div className="text-sm text-gray-600 mb-1">Score</div>
                    <div className="font-semibold text-gray-900">{selectedInterviewerData?.totalScore}</div>
                  </CardBody>
                </Card>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-5">
                <Card>
                  <CardBody className="justify-center items-center pb-0">
                    <CircularProgress
                      color={HiringGradeUtil.getHiringRecommendation(selectedInterviewerData?.totalScore || 0).color}
                      classNames={{
                        svg: 'w-32 h-32 drop-shadow-none',
                        track: 'stroke-gray-200',
                        value: 'text-2xl font-semibold ',
                      }}
                      showValueLabel={true}
                      strokeWidth={4}
                      value={selectedInterviewerData?.totalScore}
                    />
                  </CardBody>
                  <CardFooter className="justify-center items-center pt-0">
                    <Chip size="sm" color={HiringGradeUtil.getHiringRecommendation(selectedInterviewerData?.totalScore || 0).color} variant="bordered">
                      {HiringGradeUtil.getHiringRecommendation(selectedInterviewerData?.totalScore || 0).recommendation}
                    </Chip>
                  </CardFooter>
                </Card>

                <Card className="p-2">
                  <CardBody>
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-8 h-8 bg-secondary-100 rounded-full p-2 flex items-center justify-center">
                        <Trophy className="w-4 h-4 text-secondary-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Overall Score</h3>
                    </div>
                    <div className="flex flex-col items-center">{selectedInterviewerData && <EvaluationChart data={selectedInterviewerData} />}</div>
                  </CardBody>
                </Card>

                <Card className="p-2">
                  <CardBody>
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-8 h-8 bg-secondary-100 rounded-full p-2 flex items-center justify-center">
                        <Brain className="w-4 h-4 text-secondary-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">AI Final Assessment</h3>
                    </div>
                    <div className="space-y-4 text-xs">{selectedInterviewerData?.finalAssessment || 'No final assessment provided.'}</div>
                  </CardBody>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <div className="flex justify-between gap-2 w-full">
                    <div className="mb-6 flex items-center gap-[5px] md:mb-4">
                      <Video className="w-5 h-5 text-xl text-secondary-400" />
                      <h1 className="text-xl/[24px] font-semibold text-tertiary md:text-[20px]/[24px]">Audio & Video Recording</h1>
                    </div>
                    <div className="flex gap-2">
                      {!isPlaying && (
                        <Button color="secondary" radius="full" variant="flat" size="sm" startContent={<Play />} onPress={handlePlay}>
                          Play Video
                        </Button>
                      )}
                      {isPlaying && (
                        <Button color="danger" radius="full" size="sm" startContent={<FaStopCircle />} onPress={handleStop}>
                          Stop Video
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="flex gap-4">
                    <div className="w-full">
                      <CustomVideoPlayer images={selectedInterviewerData?.screenshots} videoUrl={selectedInterviewerData?.videoUrl} playTrigger={isPlaying} stopTrigger={!isPlaying} transcript={selectedInterviewerData.messages} />
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card shadow="md" radius="md" className="mt-4 p-2">
                <CardBody>
                  <div className="grid grid-cols-[1fr_auto_1fr] gap-5">
                    <div className="space-y-5">
                      <div>
                        <div className="flex items-center gap-2 mb-6">
                          <div className="w-8 h-8 bg-secondary-100 rounded-full p-2 flex items-center justify-center">
                            <Shield className="w-4 h-4 text-secondary-600" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">Fraud Events</h3>
                        </div>
                        <EventTable data={selectedInterviewerData?.fraudEvents} />
                      </div>
                    </div>
                    <div className="w-px bg-gray-300 " />
                    <div className="space-y-5">
                      <FeedbackCard data={selectedInterviewerData} />
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card shadow="md" radius="md" className="mt-4 p-2">
                <CardBody>{selectedInterviewerData?.questionRatings && <QuestionResponses assessmentData={selectedInterviewerData?.questionRatings} />}</CardBody>
              </Card>
            </div>
          </main>
        </div>
      )}
    </div>
  );
}
