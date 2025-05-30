'use client';
import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Tabs, Tab, Card, CardBody } from '@heroui/react';
import { getAllInterviewResult, getInterviewResultById } from '@/services/interview.service';
import EvaluationChart from './components/EvaluationChart';
import CustomVideoPlayer from './components/CustomVideoPlayer';
import ImageSlider from '@/components/shared/ImageSlider';
import Sidebar from './components/Sidebar';
import CandidateHeader from './components/CandidateHeader';
import FeedbackCard from './components/FeedbackCard';
import { useRouter, useSearchParams } from 'next/navigation';
import EventTable from './components/EventTable';
import EmptyStateCards from '@/components/shared/empty-state-cards';
import AudioPlayerWithHighlight from './components/TranscriptPlayer';
import CandidateSkeleton from './components/CandidateSkeleton';

export default function InterviewResultList() {
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true); // ✅ set to true by default
  const [filterValue, setFilterValue] = useState('');
  const [interviewResults, setInterviewResults] = useState([]);
  const [selectedInterviewerData, setSelectedInterviewerData] = useState<any>(null);
  const [selectedTab, setSelectedTab] = useState<string>('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<any>({});
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
    setIsLoading(true);
    try {
      const data = await getInterviewResultById(resultId);
      setSelectedInterviewerData(data);
    } catch (error) {
      console.error('Error fetching interviewer data:', error);
    } finally {
      setIsLoading(false);
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
                    <Tabs>
                      <Tab key="overall" title="Overall Performence">
                        <div className="grid grid-cols-[1fr_auto_1fr] gap-5">
                          <div className="space-y-5">
                            <div>
                              <h2 className="text-lg font-semibold mb-4">Overall Performence</h2>
                              {selectedInterviewerData && <EvaluationChart data={selectedInterviewerData} />}
                            </div>
                          </div>

                          {/* Divider */}
                          <div className="w-px bg-gray-300 " />

                          <div className="space-y-5">
                            <FeedbackCard data={selectedInterviewerData} />
                          </div>
                        </div>
                      </Tab>

                      <Tab key="fraud" title="Fraud Risk">
                        <EventTable data={selectedInterviewerData?.fraudEvents} />
                      </Tab>
                    </Tabs>
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
