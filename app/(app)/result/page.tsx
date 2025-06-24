'use client';
import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Tabs, Tab, Card, CardBody, Spinner, CircularProgress, CardFooter, Chip } from '@heroui/react';
import { getAllInterviewResult, getInterviewResultById } from '@/services/interview.service';
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

export default function InterviewResultList() {
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true); // ✅ set to true by default
  const [isLoadingOnResultSelected, setSsLoadingOnResultSelected] = useState(false); // ✅ set to true by default
  const [filterValue, setFilterValue] = useState('');
  const [interviewResults, setInterviewResults] = useState([]);
  const [selectedInterviewerData, setSelectedInterviewerData] = useState<any>(null);
  const [selectedTab, setSelectedTab] = useState<string>('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const router = useRouter();
  const rowsPerPage = 1000;
  const searchParams = useSearchParams();

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
      setSelectedInterviewerData(data);
    } catch (error) {
      console.error('Error fetching interviewer data:', error);
    } finally {
      setSsLoadingOnResultSelected(false);
      router.replace(`/result?id=${resultId}`, { scroll: false });
    }
    try {
      const data = await getInterviewResultById(resultId);
      setSelectedInterviewerData(data);
    } catch (error) {
      console.error('Error fetching interviewer data:', error);
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

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredResults.slice(start, end);
  }, [page, filteredResults]);

  return (
    <div className="my-3 px-4 lg:px-6 max-w-[82rem] mx-auto w-full  ">
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
        {!isLoading && interviewResults.length > 0 && (
          <div className="flex h-full flex-col gap-2 xl:flex-row">
            <aside className="flex flex-col xl:w-[320px]">
              <div className="no-scrollbar max-h-full overflow-auto p-1 ">
                <Card shadow="none" className="no-scrollbar max-h-full overflow-auto p-1 ">
                  <CardBody>
                    <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} selectedTab={selectedTab} setSelectedTab={setSelectedTab} filterValue={filterValue} setFilterValue={setFilterValue} onSearchChange={onSearchChange} isLoading={isLoading} fetchInterviewResult={fetchInterviewResult} items={items} selectedId={selectedId} handleViewDetails={handleViewDetails} />
                  </CardBody>
                </Card>
              </div>
            </aside>

            <main className="flex flex-col">
              <div className="p-1">
                <Card shadow="none" className="mb-4 p-2">
                  <CardBody>
                    <CandidateHeader selectedInterviewerData={selectedInterviewerData} />
                  </CardBody>
                </Card>

                {/* <div className="flex items-center gap-2">
            <FaCalendar className="h-4 w-4 text-gray-400" />
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Completed</span>
              <span className="text-sm font-medium">{DateFormatter.formatDate(selectedInterviewerData?.statusUpdateAt, true)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <FaCheckCircle className="h-4 w-4 text-gray-400" />
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Score</span>
              <span className="text-sm font-medium">{Math.floor(selectedInterviewerData?.totalScore)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <FaCheckCircle className="h-4 w-4 text-gray-400" />
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Hire Rec.</span>
              <span className="text-sm font-medium">
                <RatingChips weight={selectedInterviewerData?.totalScore} />
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <FaExclamationCircle className="h-4 w-4 text-gray-400" />
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Fraud Risk</span>
              <span className="text-sm font-medium">{selectedInterviewerData?.fraudProbability ?? 0} %</span>
            </div>
          </div> */}
                <div className="grid grid-cols-5 gap-4 mb-4">
                  <Card shadow="none" className="  p-0">
                    <CardBody>
                      <div className="text-sm text-gray-600 mb-1">Current Salary</div>
                      <div className="font-semibold text-gray-900">
                        {selectedInterviewerData?.currentSalary?.amount ?? 0} {selectedInterviewerData?.currentSalary?.currency}
                      </div>
                    </CardBody>
                  </Card>
                  <Card shadow="none" className="  p-0">
                    <CardBody>
                      <div className="text-sm text-gray-600 mb-1">Expected Salary</div>
                      <div className="font-semibold text-gray-900">
                        {selectedInterviewerData?.expectedSalary?.amount ?? 0} {selectedInterviewerData?.expectedSalary?.currency ?? 0}
                      </div>
                    </CardBody>
                  </Card>
                  <Card shadow="none" className="  p-0">
                    <CardBody>
                      <div className="text-sm text-gray-600 mb-1">Total Experience</div>
                      <div className="font-semibold text-gray-900">2 yrs & 4 months</div>
                    </CardBody>
                  </Card>
                  <Card shadow="none" className="  p-0">
                    <CardBody>
                      <div className="text-sm text-gray-600 mb-1">Fraud Risk</div>
                      <div className="font-semibold text-gray-900">{selectedInterviewerData?.fraudProbability ?? 0}%</div>
                    </CardBody>
                  </Card>
                  <Card shadow="none" className="  p-0">
                    <CardBody>
                      <div className="text-sm text-gray-600 mb-1">Score</div>
                      <div className="font-semibold text-gray-900">{selectedInterviewerData?.totalScore}</div>
                    </CardBody>
                  </Card>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-5">
                  {/* Technical Score */}
                  {/* <Card shadow="none" className="  p-2">
                    <CardBody>
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Technical Score</h3>
                        sss
                      </div>

                      <div className="flex flex-col items-center">
                        <CircularProgress
                          color={HiringGradeUtil.getHiringRecommendation(selectedInterviewerData?.totalScore || 0).color}
                          classNames={{
                            svg: 'w-32 h-32  ',
                            track: 'stroke-gray-400',
                            value: 'text-xl font-semibold  ',
                          }}
                          showValueLabel={true}
                          strokeWidth={4}
                          value={selectedInterviewerData?.totalScore}
                        />
                      </div>
                    </CardBody>
                  </Card> */}
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
                  <Card shadow="none" className="  p-2">
                    <CardBody>
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Overall Score</h3>
                        dsd
                      </div>

                      <div className="flex flex-col items-center">{selectedInterviewerData && <EvaluationChart data={selectedInterviewerData} />}</div>
                    </CardBody>
                  </Card>

                  {/* AI Summary */}
                  <Card shadow="none" className="  p-2">
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

                <Card shadow="none">
                  <CardBody>
                    <div className="flex gap-4">
                      <div className="w-1/3">
                        <Tabs aria-label="Options" size="sm">
                          <Tab key="photos" title="Photos">
                            <ImageSlider images={selectedInterviewerData?.screenshots} />
                          </Tab>
                          <Tab key="videos" title="Videos">
                            <p className="text-base  mb-4">Coming soon</p>
                            {/* <CustomVideoPlayer /> */}
                          </Tab>
                        </Tabs>
                      </div>
                      <div className="w-2/3">
                        <AudioPlayerWithHighlight transcript={selectedInterviewerData.messages} recordingUrl={selectedInterviewerData.recordingUrl} />
                      </div>
                    </div>
                  </CardBody>
                </Card>

                <Card shadow="none" className="mt-4 p-2">
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
        )}
      </div>
    </div>
  );
}
