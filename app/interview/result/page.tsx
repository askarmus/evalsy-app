"use client";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Card, Button, Input, Pagination, CardBody, Tabs, Tab, Chip } from "@heroui/react";
import { Breadcrumb } from "@/components/bread.crumb";
import { getAllInterviewResult, getInterviewResultById } from "@/services/interview.service";
import { ViewResultDrawer } from "./components/view.result.drawer";
import RatingBadge from "./components/rating,badge";
import DateFormatter from "@/app/utils/DateFormatter";
import { FaAccessibleIcon, FaChevronRight, FaSearch } from "react-icons/fa";
import ResultListItemSkeleton from "./components/result.listItem.skeleton";
import EmptyStateCards from "@/components/shared/empty-state-cards";

export default function InterviewResultList() {
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true); // ✅ set to true by default
  const [loadingResults, setLoadingResults] = useState<{ [key: string]: boolean }>({});
  const [filterValue, setFilterValue] = useState("");
  const [interviewResults, setInterviewResults] = useState([]);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [selectedInterviewerData, setSelectedInterviewerData] = useState<any>(null);
  const [selectedTab, setSelectedTab] = useState<string>("all");

  const rowsPerPage = 5;

  const fetchInterviewResult = async () => {
    try {
      const data = await getAllInterviewResult();
      setInterviewResults(data);
    } catch (err) {
      console.error("Failed to fetch interview results:", err);
    } finally {
      setIsLoading(false); // ✅ ensures the skeleton disappears after fetch
    }
  };

  useEffect(() => {
    fetchInterviewResult();
  }, []);

  const handleViewDetails = async (resultId: string) => {
    setLoadingResults((prev) => ({ ...prev, [resultId]: true }));
    try {
      const data = await getInterviewResultById(resultId);
      setSelectedInterviewerData(data);
      setDrawerOpen(true);
    } catch (error) {
      console.error("Error fetching interviewer data:", error);
    }
    setLoadingResults((prev) => ({ ...prev, [resultId]: false }));
  };

  const onSearchChange = useCallback((value: string) => {
    setFilterValue(value);
    setPage(1);
  }, []);

  const filteredResults = useMemo(() => {
    let results = [...interviewResults];

    // Filter by tab
    if (selectedTab === "below-average") {
      results = results.filter((r: any) => r.overallWeight <= 25);
    } else if (selectedTab === "average") {
      results = results.filter((r: any) => r.overallWeight > 25 && r.overallWeight <= 50);
    } else if (selectedTab === "good") {
      results = results.filter((r: any) => r.overallWeight > 50 && r.overallWeight <= 75);
    } else if (selectedTab === "excellent") {
      results = results.filter((r: any) => r.overallWeight > 75);
    }

    // Then filter by search
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

  const getTrendIcon = (score: number) => {
    if (score > 150) return <FaAccessibleIcon className='h-4 w-4 text-emerald-500' />;
    if (score < 100) return <FaAccessibleIcon className='h-4 w-4 text-red-500' />;
    return <FaAccessibleIcon className='h-4 w-4 text-amber-500' />;
  };

  return (
    <div className='my-10 px-4 lg:px-6 max-w-[90rem] mx-auto w-full flex flex-col gap-4'>
      <Breadcrumb
        items={[
          { name: "Dashboard", link: "/" },
          { name: "Result", link: "" },
        ]}
      />
      <h3 className='text-xl font-semibold'>Interview Results</h3>

      <div className='flex justify-between flex-wrap gap-4 items-center'>
        <div className='flex items-center gap-3 flex-wrap md:flex-nowrap'>
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
        </div>

        <div>
          <Tabs key='tabs' aria-label='Performance Tabs' size='sm' selectedKey={selectedTab} onSelectionChange={(key) => setSelectedTab(key as string)}>
            <Tab key='all' title='All' />
            <Tab
              key='below-average'
              title={
                <>
                  <span>Below Average </span>
                  <Chip size='sm' variant='faded'>
                    {interviewResults.filter((j: any) => j.overallWeight <= 25).length}
                  </Chip>
                </>
              }
            />
            <Tab
              key='average'
              title={
                <>
                  <span>Average </span>
                  <Chip size='sm' variant='faded'>
                    {
                      interviewResults.filter((j: any) => {
                        return j.overallWeight > 25 && j.overallWeight <= 50;
                      }).length
                    }
                  </Chip>
                </>
              }
            />
            <Tab
              key='good'
              title={
                <>
                  <span>Good </span>
                  <Chip size='sm' variant='faded'>
                    {
                      interviewResults.filter((j: any) => {
                        return j.overallWeight > 50 && j.overallWeight <= 75;
                      }).length
                    }
                  </Chip>
                </>
              }
            />
            <Tab
              key='excellent'
              title={
                <>
                  <span>Excellent </span>
                  <Chip size='sm' variant='faded'>
                    {
                      interviewResults.filter((j: any) => {
                        return j.overallWeight > 75;
                      }).length
                    }
                  </Chip>
                </>
              }
            />
          </Tabs>
        </div>
      </div>

      {isLoading ? (
        <>
          <ResultListItemSkeleton />
          <div className='h-10' />
        </>
      ) : (
        <>
          <div>
            {filteredResults.length === 0 ? (
              <div className='w-full text-center text-gray-500 py-10'>
                {filterValue ? (
                  <EmptyStateCards
                    title='No matching results'
                    description='Try adjusting your search or filter to find what you are looking for.'
                    onReset={() => {
                      setFilterValue("");
                      setPage(1);
                    }}
                  />
                ) : (
                  <EmptyStateCards
                    title='No interview results found'
                    description='No results are currently available..'
                    onReset={() => {
                      setSelectedTab("all");
                      setFilterValue("");
                      setPage(1);
                    }}
                  />
                )}
              </div>
            ) : (
              items.map((data: any) => (
                <Card radius='sm' shadow='sm' key={data.id} className='mb-4'>
                  <CardBody>
                    <div className='flex items-center p-4'>
                      <div className='flex-1 flex items-center space-x-4'>
                        <div>
                          <h3 className='font-medium'>{data?.name}</h3>
                          <p className='text-sm text-muted-foreground mt-1'>{data?.jobTitle}</p>
                        </div>
                      </div>

                      <div className='flex items-center space-x-6'>
                        <div className='text-sm text-muted-foreground'>{DateFormatter.formatDate(data.statusUpdateAt)}</div>
                        <div className='flex items-center space-x-1'>
                          {getTrendIcon(data?.score)}
                          <span className='font-semibold'>{data?.overallWeight}%</span>
                        </div>
                        <RatingBadge weight={data?.overallWeight} />
                        <Button color='primary' endContent={<FaChevronRight />} isLoading={loadingResults[data.id]} onPress={() => handleViewDetails(data.id)} radius='full' size='sm'>
                          {loadingResults[data.id] ? "Loading.." : "View Result"}
                        </Button>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))
            )}
          </div>

          <div className='flex w-full justify-center'>
            {filteredResults.length > 0 && (
              <div className='flex w-full justify-center'>
                <Pagination showControls color='default' size='sm' page={page} total={pages} onChange={(page) => setPage(page)} />
              </div>
            )}
          </div>

          <ViewResultDrawer isOpen={isDrawerOpen} onClose={() => setDrawerOpen(false)} interviewerData={selectedInterviewerData} />
        </>
      )}
    </div>
  );
}
