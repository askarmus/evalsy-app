"use client";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Card, CardBody, Button, Input, Pagination, Spinner, CardHeader, CardFooter } from "@heroui/react";
import { Breadcrumb } from "@/components/bread.crumb";
import { getAllInterviewResult, getInterviewResultById } from "@/services/interview.service";
import { ViewResultDrawer } from "./components/view.result.drawer";
import DateFormatter from "@/app/utils/DateFormatter";

export default function InterviewResultList() {
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingResults, setLoadingResults] = useState<{ [key: string]: boolean }>({});

  const [filterValue, setFilterValue] = useState("");
  const [interviewResults, setInterviewResults] = useState([]);
  const rowsPerPage = 6;
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [selectedInterviewerData, setSelectedInterviewerData] = useState<any>(null);

  // Fetch interview results
  const fetchInterviewResult = async () => {
    setIsLoading(true);
    const data = await getAllInterviewResult();
    setInterviewResults(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchInterviewResult();
  }, []);

  // Handle drawer open
  const handleViewDetails = async (resultId: string) => {
    setLoadingResults((prev) => ({ ...prev, [resultId]: true })); // Set loading for the specific result

    try {
      const data = await getInterviewResultById(resultId);
      setSelectedInterviewerData(data);
      setDrawerOpen(true);
    } catch (error) {
      console.error("Error fetching interviewer data:", error);
    }

    setLoadingResults((prev) => ({ ...prev, [resultId]: false })); // Reset loading after fetch
  };
  // Handle search input change
  const onSearchChange = useCallback((value: string) => {
    setFilterValue(value);
    setPage(1);
  }, []);

  // Filter interview results
  const filteredResults = useMemo(() => {
    return interviewResults.filter((result: any) => result.name.toLowerCase().includes(filterValue.toLowerCase()));
  }, [filterValue, interviewResults]);

  // Pagination logic
  const pages = Math.ceil(filteredResults.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredResults.slice(start, end);
  }, [page, filteredResults]);

  // Define card background based on `overallWeight`
  const getBorderColor = (weight: number | null) => {
    if (weight === null || weight < 1) return "border-red-600";
    if (weight >= 4) return "border-green-600";
    if (weight >= 3) return "border-blue-600";
    if (weight >= 2) return "border-yellow-600";
    return "border-orange-500";
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
          <Input value={filterValue} onChange={(e) => onSearchChange(e.target.value)} classNames={{ input: "w-full", mainWrapper: "w-full max-w-md" }} placeholder='Search candidate' />
        </div>
      </div>

      <div>{/* Overall Performance Chip */}</div>
      {/* Interview Results as Cards */}
      {isLoading ? (
        <div className='flex justify-center'>
          <Spinner />
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {items.map((result: any) => (
            <Card key={result.id} className={`rounded-xl shadow-md px-3 py-3 w-full border-1 ${getBorderColor(result.overallWeight)}`}>
              <CardHeader className='justify-between'>
                <div className='flex gap-5'>
                  <div className='flex flex-col gap-1 items-start justify-center'>
                    <h4 className='text-1xl font-semibold leading-none text-default-600'>{result.name}</h4>
                    <h5 className='text-small tracking-tight text-default-400'>{result.jobTitle}</h5>
                  </div>
                </div>
                <Button color='primary' isLoading={loadingResults[result.id]} onPress={() => handleViewDetails(result.id)} radius='full' size='sm' variant={"flat"}>
                  {loadingResults[result.id] ? "Loading.." : "View"}
                </Button>
              </CardHeader>
              <CardFooter className='gap-3'>
                <div className='flex gap-1'>
                  <p className='font-semibold text-default-400 text-small'>{result.overallWeight}</p>
                  <p className=' text-default-400 text-small'>Overal lWeight</p>
                </div>
                <div className='flex gap-1'>
                  <p className='font-semibold text-default-400 text-small'>{DateFormatter.formatDate(result.statusUpdateAt)}</p>
                  <p className='text-default-400 text-small'>Completed</p>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Weight Legend */}
      <div className='flex flex-wrap justify-center mt-6 gap-4 mb-5'>
        <div className='flex items-center gap-2'>
          <span className='w-4 h-4 bg-red-200 rounded-full'></span>
          <span className='text-sm font-medium'>Poor (0 - 0.9)</span>
        </div>
        <div className='flex items-center gap-2'>
          <span className='w-4 h-4 bg-orange-500 rounded-full'></span>
          <span className='text-sm font-medium'>Below Average (1 - 1.9)</span>
        </div>
        <div className='flex items-center gap-2'>
          <span className='w-4 h-4 bg-yellow-500 rounded-full'></span>
          <span className='text-sm font-medium'>Average (2 - 2.9)</span>
        </div>
        <div className='flex items-center gap-2'>
          <span className='w-4 h-4 bg-blue-500 rounded-full'></span>
          <span className='text-sm font-medium'>Good (3 - 3.9)</span>
        </div>
        <div className='flex items-center gap-2'>
          <span className='w-4 h-4 bg-green-500 rounded-full'></span>
          <span className='text-sm font-medium'>Excellent (4 - 5)</span>
        </div>
      </div>
      {/* Pagination */}
      <div className='flex w-full justify-center'>
        <Pagination isCompact showControls showShadow color='secondary' page={page} total={pages} onChange={(page) => setPage(page)} />
      </div>

      {/* View Details Drawer */}
      <ViewResultDrawer isOpen={isDrawerOpen} onClose={() => setDrawerOpen(false)} interviewerData={selectedInterviewerData} />
    </div>
  );
}
