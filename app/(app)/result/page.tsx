"use client";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Card, Button, Input, CardBody, Tabs, Tab, CardHeader, Avatar } from "@heroui/react";
import { getAllInterviewResult, getInterviewResultById } from "@/services/interview.service";
import RatingBadge from "./components/rating,badge";
import DateFormatter from "@/app/utils/DateFormatter";
import { FaSearch, FaSyncAlt } from "react-icons/fa";
import EvaluationChart from "./components/EvaluationChart";
import QuestionsTable from "./components/QuestionsTable";
import CustomVideoPlayer from "./components/CustomVideoPlayer";
import SimpleScoreDisplay from "./components/SimpleScoreDisplay";
import OverlayLoader from "@/components/shared/OverlayLoader";

export default function InterviewResultList() {
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true); // ✅ set to true by default
  const [filterValue, setFilterValue] = useState("");
  const [interviewResults, setInterviewResults] = useState([]);
  const [selectedInterviewerData, setSelectedInterviewerData] = useState<any>(null);
  const [selectedTab, setSelectedTab] = useState<string>("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<any>({});

  const rowsPerPage = 1000;

  const fetchInterviewResult = async () => {
    try {
      setIsLoading(true);

      const data = await getAllInterviewResult();
      setInterviewResults(data.all);
      setSelectedInterviewerData(data.first);
    } catch (err) {
      console.error("Failed to fetch interview results:", err);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSelect = (question) => {
    setSelectedQuestion(question);
    console.log("Selected:", question);
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
      console.error("Error fetching interviewer data:", error);
    } finally {
      setIsLoading(false);
    }
    try {
      const data = await getInterviewResultById(resultId);
      setSelectedInterviewerData(data);
    } catch (error) {
      console.error("Error fetching interviewer data:", error);
    }
  };

  const onSearchChange = useCallback((value: string) => {
    setFilterValue(value);
    setPage(1);
  }, []);

  const filteredResults = useMemo(() => {
    let results = [...interviewResults];

    if (selectedTab === "below-average") {
      results = results.filter((r: any) => r.overallWeight <= 25);
    } else if (selectedTab === "average") {
      results = results.filter((r: any) => r.overallWeight > 25 && r.overallWeight <= 50);
    } else if (selectedTab === "good") {
      results = results.filter((r: any) => r.overallWeight > 50 && r.overallWeight <= 75);
    } else if (selectedTab === "excellent") {
      results = results.filter((r: any) => r.overallWeight > 75);
    }

    if (filterValue) {
      results = results.filter((r: any) => r.name.toLowerCase().includes(filterValue.toLowerCase()));
    }

    return results;
  }, [filterValue, interviewResults, selectedTab]);

  const pages = Math.ceil(filteredResults.length / rowsPerPage);
  useEffect(() => {
    setPage(1);
  }, [selectedTab]);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredResults.slice(start, end);
  }, [page, filteredResults]);

  return (
    <div className='  max-w-[90rem] mx-auto w-full flex flex-col gap-4'>
      <div className='flex flex-col min-h-screen '>
        {/* Top Navigation would go here */}
  { isLoading && <OverlayLoader   /> }  
        <div className='flex flex-col md:flex-row flex-1 max-w-screen-2xl mx-auto w-full'>
          {/* Mobile Sidebar Toggle */}
          <div className='md:hidden sticky top-16 z-10   border-b p-2'>
            <button className='inline-flex items-center justify-between w-full rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2' onClick={() => setSidebarOpen(!sidebarOpen)}>
              <div className='flex items-center gap-2'>
                dd
                <span>All Candidates</span>
              </div>
              dd
            </button>
          </div>

          {/* Desktop Sidebar */}
          <aside className={`${sidebarOpen ? "block" : "hidden"} md:block w-80 lg:w-80 border-r border-l  overflow-y-auto`}>
            <div className='p-5 border-b'>
              <h2 className='text-lg font-semibold mb-4 '>All Candidates</h2>
              <div className='relative'>
                <Tabs key='tabs' aria-label='Performance Tabs' size='sm' selectedKey={selectedTab} onSelectionChange={(key) => setSelectedTab(key as string)}>
                  <Tab key='all' title='All' />
                  <Tab
                    key='below-average'
                    title={
                      <>
                        <span className='text-xs'>Low </span>
                      </>
                    }
                  />
                  <Tab
                    key='average'
                    title={
                      <>
                        <span>Avg </span>
                      </>
                    }
                  />
                  <Tab
                    key='good'
                    title={
                      <>
                        <span> Good </span>
                      </>
                    }
                  />
                  <Tab
                    key='excellent'
                    title={
                      <>
                        <span>Best </span>
                      </>
                    }
                  />
                </Tabs>

                <div className='flex items-center mt-5 '>
                  <Input
                    onChange={(e) => onSearchChange(e.target.value)}
                    isClearable
                    className='max-w-md'
                    placeholder='Search Result'
                    defaultValue=''
                    startContent={<FaSearch />}
                    variant='bordered'
                    onClear={() => {
                      setFilterValue("");
                      setPage(1);
                    }}
                  />

                  <Button
                    className='ml-3'
                    isIconOnly
                    variant='ghost'
                    size='sm'
                    isLoading={isLoading}
                    color='default'
                    onPress={() => {
                      setIsLoading(true);
                      fetchInterviewResult();
                    }}>
                    <FaSyncAlt />
                  </Button>
                </div>
              </div>
            </div>
            <div className='overflow-auto'>
              <div className=' '>
                <div className='h-[700px] flex flex-col'>
                  <div className='p-0 overflow-y-auto flex-grow'>
                    <ul className='divide-y'>
                      {items.map((data: any) => (
                        <li
                          onClick={() => handleViewDetails(data.id)}
                          key={data.id}
                          className={`flex items-center cursor-pointer justify-between p-4 transition-colors
                          ${selectedId === data.id ? "bg-gray-100" : "hover:bg-gray-50"}`}>
                          <div className='flex items-center gap-3'>
                            <Avatar name={data.name} className='h-10 w-10  '></Avatar>
                            <div>
                              <h3 className='font-medium text-sm '>{data.name}</h3>
                              <p className='text-xs  '>{data.jobTitle}</p>
                            </div>
                          </div>
                          <RatingBadge weight={data.overallWeight} />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className='flex-1 border-r overflow-auto lg:max-w-[calc(100%-320px)]'>
            {/* Candidate Header */}
            <div className='  border-b  '>
              {/* Top section with candidate info */}
              <div className='p-5 lg:p-6 border-b border-slate-100'>
                <div className='flex flex-col md:flex-row gap-4 items-start md:items-center'>
                  <div className='flex items-center gap-4'>
                    <div className='relative'>
                      <div className='absolute -top-2 -left-2 rounded-full p-1 shadow-sm z-10'>
                        <div className='w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center text-sm font-semibold text-white'>{Math.floor(selectedInterviewerData?.overallWeight)}</div>
                      </div>
                      <div className="w-16 h-16 rounded-xl border-2 border-slate-100 bg-slate-100 flex items-center justify-center overflow-hidden">
                          <img
                           
                            src={selectedInterviewerData?.imageUrl ? selectedInterviewerData?.imageUrl : "/avatar-cartoon-in-flat-style-png.webp"}
                            alt={selectedInterviewerData?.name}
                            className="w-full h-full object-cover rounded-xl"
                          />
                      </div>

                    </div>
                    <div>
                      <div className='text-xs font-medium text-blue-600'>{selectedInterviewerData?.jobTitle}</div>
                      <h1 className='text-xl font-bold '>{selectedInterviewerData?.name}</h1>
                    </div>
                  </div>

                  <div className='flex flex-wrap gap-4 ml-auto items-center'>
                    <div className='flex items-center gap-6'>
                      <div className='flex items-center gap-1.5 text-sm'>
                        <div className='flex items-center gap-2 text-sm   px-3 py-2 rounded-lg'>
                          <span className='font-medium'>Completed:</span>
                          <span className=''>{DateFormatter.formatDate(selectedInterviewerData?.statusUpdateAt)}</span>
                        </div>
                      </div>
                      <div className='flex items-center gap-2 text-sm'>
                        <span className='inline-flex items-center gap-1.5 px-3 py-1.5 font-medium bg-green-50 text-green-600 border border-green-200 rounded-lg'>
                          <div className='w-4 h-4 flex items-center justify-center'>✓</div>
                          Shortlisted
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='m-5 '>
              <div className='  rounded-xl border  p-5 shadow-sm'>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                  <div>
                    <h3 className='text-base font-semibold   mb-4'>Interview Questions</h3>
                    {selectedInterviewerData && <QuestionsTable data={selectedInterviewerData} onSelect={handleSelect} />}
                  </div>

                  <div className=''>
                    <h3 className='text-base font-semibold   mb-4'>Video</h3>
                    <CustomVideoPlayer />
                  </div>
                  <div className=' '>
                    <h3 className='text-base font-semibold   mb-4'>Transcript</h3>
                    <div className=' pt-4'>
                      <h3 className='text-sm font-medium mb-3   flex items-center gap-2'>{selectedQuestion?.text}</h3>
                      <div className='text-sm    p-4 rounded-lg border border-slate-200'>
                        <p className='mb-3'>{selectedQuestion?.transcription}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='mt-5'>
                  <SimpleScoreDisplay
                    scores={{
                      relevance: 4.2,
                      completeness: 3.8,
                      clarity: 4.5,
                      grammar_language: 4.0,
                      technical_accuracy: 4.3,
                    }}
                    totalScore={100}
                  />
                </div>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-5 p-5'>
              <div className='space-y-5'>
                <div className='  rounded-xl border border-slate-200 p-5 shadow-sm'>
                  <h2 className='text-lg font-semibold   mb-4'>Overall Performence</h2>

                  {selectedInterviewerData && <EvaluationChart data={selectedInterviewerData}></EvaluationChart>}
                </div>
              </div>

              <div className='space-y-5'>
                <div className=' rounded-xl border border-slate-200 p-5 shadow-sm'>
                  <h2 className='text-lg font-semibold   mb-4'>Feedback</h2>
                  <Card shadow='sm' radius='sm' className='p-2 mt-6 w-full'>
                    <CardBody className='  w-full'>
                      {Array.isArray(selectedInterviewerData?.notes?.summary) && selectedInterviewerData.notes.summary.filter((item) => item.trim() !== "").length > 0 && (
                        <ul className='space-y-3'>
                          {selectedInterviewerData.notes.summary
                            .filter((item) => item.trim() !== "")
                            .map((item, index) => (
                              <li key={index} className='flex items-start gap-2'>
                                <span className='mt-2 w-2 h-2 rounded-full   shrink-0' />
                                <span className='text-sm   leading-relaxed'>{item}</span>
                              </li>
                            ))}
                        </ul>
                      )}
                    </CardBody>
                  </Card>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
