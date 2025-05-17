'use client';
import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Tabs, Tab, Card, CardBody } from '@heroui/react';
import { getAllInterviewResult, getInterviewResultById } from '@/services/interview.service';

import EvaluationChart from './components/EvaluationChart';
import QuestionsTable from './components/QuestionsTable';
import CustomVideoPlayer from './components/CustomVideoPlayer';
import SimpleScoreDisplay from './components/SimpleScoreDisplay';
import ImageSlider from '@/components/shared/ImageSlider';
import Sidebar from './components/Sidebar';
import CandidateHeader from './components/CandidateHeader';
import FeedbackCard from './components/FeedbackCard';
import { useRouter } from 'next/navigation';
import EventTable from './components/EventTable';

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

  const fetchInterviewResult = async () => {
    try {
      setIsLoading(true);

      const data = await getAllInterviewResult();
      setInterviewResults(data.all);
      setSelectedInterviewerData(data.first);
    } catch (err) {
      console.error('Failed to fetch interview results:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (question) => {
    setSelectedQuestion(question);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.load(); // reload source
        audioRef.current.play().catch((e) => {
          console.warn('Auto-play blocked:', e);
        });
      }
    }, 100);
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
      results = results.filter((r: any) => r.overallWeight <= 25);
    } else if (selectedTab === 'average') {
      results = results.filter((r: any) => r.overallWeight > 25 && r.overallWeight <= 50);
    } else if (selectedTab === 'good') {
      results = results.filter((r: any) => r.overallWeight > 50 && r.overallWeight <= 75);
    } else if (selectedTab === 'excellent') {
      results = results.filter((r: any) => r.overallWeight > 75);
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
      <div className="sm:h-[calc(100vh-110px)] overflow-hidden xl:h-[calc(100vh-110px)]">
        <div className="flex h-full flex-col gap-2 xl:flex-row">
          <aside className="flex flex-col xl:w-[320px]">
            <div className="no-scrollbar max-h-full overflow-auto p-1 ">
              <Card shadow="sm" radius="sm" className="no-scrollbar max-h-full overflow-auto p-1 ">
                <CardBody>
                  <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} selectedTab={selectedTab} setSelectedTab={setSelectedTab} filterValue={filterValue} setFilterValue={setFilterValue} onSearchChange={onSearchChange} isLoading={isLoading} fetchInterviewResult={fetchInterviewResult} items={items} selectedId={selectedId} handleViewDetails={handleViewDetails} />
                </CardBody>
              </Card>
            </div>
          </aside>

          <main className="flex h-screen flex-col overflow-hidden xl:h-full xl:w-[calc(100%-300px)]">
            <div className="p-1">
              <Card shadow="sm" radius="sm" className="mb-4 p-2">
                <CardBody>
                  <CandidateHeader selectedInterviewerData={selectedInterviewerData} />
                </CardBody>
              </Card>
              <Card shadow="sm" radius="sm">
                <CardBody>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <h3 className="text-base font-semibold   mb-4">Interview Questions</h3>
                      {selectedInterviewerData && <QuestionsTable data={selectedInterviewerData} onSelect={handleSelect} />}
                    </div>

                    <div className="">
                      <Tabs aria-label="Options" size="sm">
                        <Tab key="photos" title="Photos">
                          <ImageSlider images={selectedInterviewerData?.screenshots} />
                        </Tab>

                        <Tab key="videos" title="Videos">
                          <h3 className="text-base font-semibold   mb-4">Comming</h3>

                          <CustomVideoPlayer />
                        </Tab>
                      </Tabs>
                    </div>
                    <div className=" ">
                      <h3 className="text-base font-semibold   mb-4">Transcript</h3>
                      <div className=" pt-4">
                        <h3 className="text-sm   mb-3   flex items-center gap-2">{selectedQuestion?.text}</h3>
                        <div className="text-sm    p-4 rounded-lg border border-slate-200">
                          {selectedQuestion?.transcription ? (
                            <>
                              <p className="mb-3">{selectedQuestion.transcription}</p>
                              <audio ref={audioRef} controls className="mt-3 w-full">
                                <source src={selectedQuestion.recordedUrl} type="audio/mpeg" />
                                Your browser does not support the audio element.
                              </audio>
                            </>
                          ) : (
                            <p>No Answered</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5">
                    <SimpleScoreDisplay scores={selectedQuestion} totalScore={100} />
                  </div>
                </CardBody>
              </Card>

              <Card shadow="sm" radius="sm" className="mt-4 p-2">
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
                        <div className="w-px bg-gray-300 h-full mx-auto" />

                        <div className="space-y-5">
                          <FeedbackCard summary={selectedInterviewerData?.notes?.summary} />
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
      </div>
    </div>
  );

  // <div className="  max-w-[80rem] mx-auto w-full flex flex-col gap-4">
  //   <div className="flex flex-col min-h-screen ">
  //     {isLoading && <OverlayLoader />}
  //     <div className="flex flex-col md:flex-row flex-1 max-w-screen-2xl mx-auto w-full">
  //       <div className="md:hidden sticky top-16 z-10   border-b p-2">
  //         <button className="inline-flex items-center justify-between w-full rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2" onClick={() => setSidebarOpen(!sidebarOpen)}>
  //           <div className="flex items-center gap-2">
  //             dd
  //             <span>All Candidates</span>
  //           </div>
  //           dd
  //         </button>
  //       </div>

  //       <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} selectedTab={selectedTab} setSelectedTab={setSelectedTab} filterValue={filterValue} setFilterValue={setFilterValue} onSearchChange={onSearchChange} isLoading={isLoading} fetchInterviewResult={fetchInterviewResult} items={items} selectedId={selectedId} handleViewDetails={handleViewDetails} />

  //       <main className="flex-1 border-r overflow-auto lg:max-w-[calc(100%-320px)]">
  //         <CandidateHeader selectedInterviewerData={selectedInterviewerData} />

  //         <div className="m-5 ">
  //           <div className="  rounded-xl border  p-5 shadow-sm">
  //             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  //               <div>
  //                 <h3 className="text-base font-semibold   mb-4">Interview Questions</h3>
  //                 {selectedInterviewerData && <QuestionsTable data={selectedInterviewerData} onSelect={handleSelect} />}
  //               </div>

  //               <div className="">
  //                 <Tabs aria-label="Options" size="sm">
  //                   <Tab key="photos" title="Photos">
  //                     <ImageSlider images={selectedInterviewerData?.screenshots} />
  //                   </Tab>

  //                   <Tab key="videos" title="Videos">
  //                     <h3 className="text-base font-semibold   mb-4">Comming</h3>

  //                     <CustomVideoPlayer />
  //                   </Tab>
  //                 </Tabs>
  //               </div>
  //               <div className=" ">
  //                 <h3 className="text-base font-semibold   mb-4">Transcript</h3>
  //                 <div className=" pt-4">
  //                   <h3 className="text-sm   mb-3   flex items-center gap-2">{selectedQuestion?.text}</h3>
  //                   <div className="text-sm    p-4 rounded-lg border border-slate-200">
  //                     {selectedQuestion?.transcription ? (
  //                       <>
  //                         <p className="mb-3">{selectedQuestion.transcription}</p>
  //                         <audio ref={audioRef} controls className="mt-3 w-full">
  //                           <source src={selectedQuestion.recordedUrl} type="audio/mpeg" />
  //                           Your browser does not support the audio element.
  //                         </audio>
  //                       </>
  //                     ) : (
  //                       <p>No Answered</p>
  //                     )}
  //                   </div>
  //                 </div>
  //               </div>
  //             </div>

  //             <div className="mt-5">
  //               <SimpleScoreDisplay scores={selectedQuestion} totalScore={100} />
  //             </div>
  //           </div>
  //         </div>
  //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-5 p-5">
  //           <div className="space-y-5">
  //             <div className="  rounded-xl border border-slate-200 p-5 shadow-sm">
  //               <h2 className="text-lg font-semibold   mb-4">Overall Performence</h2>
  //               {selectedInterviewerData && <EvaluationChart data={selectedInterviewerData}></EvaluationChart>}
  //             </div>
  //           </div>
  //           <div className="space-y-5">
  //             <FeedbackCard summary={selectedInterviewerData?.notes?.summary} />
  //           </div>
  //         </div>
  //       </main>
  //     </div>
  //   </div>
  // </div>
}
