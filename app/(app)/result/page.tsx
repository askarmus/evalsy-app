'use client';
import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Tabs, Tab, Card, CardBody, Spinner, CircularProgress, CardFooter, Chip, CardHeader, Button } from '@heroui/react';
import { getAllInterviewResult, getInterviewResultById, updateReadStatus } from '@/services/interview.service';
import EvaluationChart from './components/EvaluationChart';
import ImageSlider from '@/components/shared/ImageSlider';
import Sidebar from './components/Sidebar';
import CandidateHeader from './components/CandidateHeader';
import FeedbackCard from './components/FeedbackCard';
import { useRouter, useSearchParams } from 'next/navigation';
import EventTable from './components/EventTable';
import EmptyStateCards from '@/components/shared/empty-state-cards';
import AudioPlayerWithHighlight from './components/TranscriptPlayer';
import CandidateSkeleton from './components/CandidateSkeleton';
import { HiringGradeUtil } from '@/app/utils/hiring-grade.util';
import CustomVideoPlayer from './components/CustomVideoPlayer';
import { FaPlayCircle, FaStopCircle } from 'react-icons/fa';
import { formatExperience } from '@/app/utils/formatExperience';

export default function InterviewResultList() {
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true); // ✅ set to true by default
  const [isLoadingOnResultSelected, setSsLoadingOnResultSelected] = useState(false); // ✅ set to true by default
  const [filterValue, setFilterValue] = useState('');
  const [interviewResults, setInterviewResults] = useState<any[]>([]);
  const [selectedInterviewerData, setSelectedInterviewerData] = useState<any>(null);
  const [selectedTab, setSelectedTab] = useState<string>('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const router = useRouter();
  const rowsPerPage = 1000;
  const searchParams = useSearchParams();
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleStop = () => {
    setIsPlaying(false);
  };
  const fetchInterviewResult = async () => {
    try {
      setIsLoading(true);

      const id = searchParams?.get('id') ?? '';
      const data = await getAllInterviewResult(id);

      if (id) {
        setSelectedId(id);
      } else {
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

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5; // Set default volume to 50%
    }
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

  useEffect(() => {
    // Apply overflow hidden when this page mounts
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    // Clean up on unmount (go back to normal)
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredResults.slice(start, end);
  }, [page, filteredResults]);

  const items1 = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `Candidate ${i + 1}`,
    jobTitle: 'Software Engineer',
    totalScore: Math.floor(Math.random() * 100),
  }));

  return (
    // Top wrapper
    <div className="my-6 px-4 lg:px-6 max-w-[86rem] mx-auto w-full  ">
      {isLoadingOnResultSelected && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/10 backdrop-blur-sm">
          <Spinner label="Loading, please wait..." color="primary" />
        </div>
      )}

      {isLoading && <CandidateSkeleton />}
      <div className=" ">
        {!isLoading && interviewResults.length == 0 && (
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
      </div>

      {!isLoading && interviewResults.length > 0 && (
        <div className="w-full h-[100vh] overflow-hidden">
          <div className="flex h-full">
            {/* Sidebar */}
            <aside className="w-[360px] min-w-[360px]   h-full overflow-y-auto">
              <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} selectedTab={selectedTab} setSelectedTab={setSelectedTab} filterValue={filterValue} setFilterValue={setFilterValue} onSearchChange={onSearchChange} isLoading={isLoading} fetchInterviewResult={fetchInterviewResult} items={items} selectedId={selectedId} handleViewDetails={handleViewDetails} />
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto h-full  ">
              <div className="p-1">
                <Card className="mb-4 p-2">
                  <CardBody>
                    <CandidateHeader selectedInterviewerData={selectedInterviewerData} />
                  </CardBody>
                </Card>

                <div className="grid grid-cols-5 gap-4 mb-4">
                  <Card className="  p-0">
                    <CardBody>
                      <div className="text-sm text-gray-600 mb-1">Current Salary</div>
                      <div className="font-semibold text-gray-900">
                        {selectedInterviewerData?.currentSalary?.amount ?? 0} {selectedInterviewerData?.currentSalary?.currency}
                      </div>
                    </CardBody>
                  </Card>
                  <Card className="  p-0">
                    <CardBody>
                      <div className="text-sm text-gray-600 mb-1">Expected Salary</div>
                      <div className="font-semibold text-gray-900">
                        {selectedInterviewerData?.expectedSalary?.amount ?? 0} {selectedInterviewerData?.expectedSalary?.currency ?? 0}
                      </div>
                    </CardBody>
                  </Card>
                  <Card className="  p-0">
                    <CardBody>
                      <div className="text-sm text-gray-600 mb-1">Total Experience</div>
                      <div className="font-semibold text-gray-900">{selectedInterviewerData?.totalExperience ? formatExperience(selectedInterviewerData.totalExperience) : 'Unknown'}</div>{' '}
                    </CardBody>
                  </Card>
                  <Card className="  p-0">
                    <CardBody>
                      <div className="text-sm text-gray-600 mb-1">Fraud Risk</div>
                      <div className="font-semibold text-gray-900">{selectedInterviewerData?.fraudProbability ?? 0}%</div>
                    </CardBody>
                  </Card>
                  <Card className="  p-0">
                    <CardBody>
                      <div className="text-sm text-gray-600 mb-1">Score</div>
                      <div className="font-semibold text-gray-900">{selectedInterviewerData?.totalScore}</div>
                    </CardBody>
                  </Card>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-5">
                  <Card className="   ">
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
                  {/* Communication Score */}
                  <Card className="  p-2">
                    <CardBody>
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Overall Score</h3>
                      </div>

                      <div className="flex flex-col items-center">{selectedInterviewerData && <EvaluationChart data={selectedInterviewerData} />}</div>
                    </CardBody>
                  </Card>

                  {/* AI Summary */}
                  <Card className="  p-2">
                    <CardBody>
                      <div className="flex items-center gap-2 mb-6">
                        <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
                          <span className="text-green-600 text-sm">🤖</span>
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
                      <h2 className="text-lg font-semibold">Candidate Audio & Video Recording</h2>

                      <div className="flex gap-2">
                        {!isPlaying && (
                          <Button color="success" radius="full" size="sm" startContent={<FaPlayCircle />} onClick={handlePlay}>
                            Play Video
                          </Button>
                        )}
                        {isPlaying && (
                          <Button color="danger" radius="full" size="sm" startContent={<FaStopCircle />} onClick={handleStop}>
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
                          <h2 className="text-lg font-semibold mb-4">Fraud Events</h2>
                          <EventTable data={selectedInterviewerData?.fraudEvents} />
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="w-px bg-gray-300 " />

                      <div className="space-y-5">
                        <FeedbackCard data={selectedInterviewerData} />
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </main>
          </div>
        </div>
      )}
    </div>
  );
}
