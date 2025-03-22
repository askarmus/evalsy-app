"use client";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Card, CardBody, Button, Input, Pagination, Spinner, CardFooter } from "@heroui/react";
import { Breadcrumb } from "@/components/bread.crumb";
import { getAllInterviewResult, getInterviewResultById } from "@/services/interview.service";
import { ViewResultDrawer } from "./components/view.result.drawer";
import DateFormatter from "@/app/utils/DateFormatter";
import RatingLegend from "./components/RatingLegend";
import FeaturedBadge from "./components/featured,badge";

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
  const getBorderColor = (weight: number) => {
    if (weight >= 1 && weight <= 7.5) return "border-orange-500"; // Below Average
    if (weight >= 7.6 && weight <= 15) return "border-yellow-600"; // Average
    if (weight >= 15.1 && weight <= 22.5) return "border-blue-600"; // Good
    if (weight >= 22.6 && weight <= 30) return "border-green-600"; // Excellent
    return "border-gray-500"; // Fallback (if weight is out of range)
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

      {isLoading ? (
        <div className='flex justify-center'>
          <Spinner />
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {items.map((result: any) => (
            <Card shadow='sm' key={result.id} className={`rounded-xl shadow-md    w-full border-2 ${getBorderColor(result.overallWeight)}`}>
              <CardBody className='p-0 w-full'>
                <FeaturedBadge weight={result?.overallWeight} />
                <div className='grid grid-cols-12 gap-4 p-5 w-full'>
                  <div className='col-span-9'>
                    <p className='text-sm font-semibold'>{result?.name}</p>
                    <p className='text-sm text-gray-400'>{result?.jobTitle}</p>
                  </div>
                  <div className='col-span-3 flex justify-end items-start'>
                    <div>
                      <p className='rounded-lg text-sky-500 text-sm py-1 px-3 center'>Score </p>
                      <p className='rounded-lg text-sky-500 font-bold bg-sky-100 py-1 px-3 text-sm text-center'>{((result?.overallWeight / 30) * 100).toFixed(2)}%</p>
                    </div>
                  </div>
                </div>
              </CardBody>
              <CardFooter className='gap-3'>
                <div className='flex justify-between gap-5 w-full'>
                  <div className='flex flex-col gap-1 items-start justify-center'>
                    <p className='font-semibold text-default-400 text-small'> {DateFormatter.formatDate(result.statusUpdateAt)}</p>
                  </div>
                  <Button color='primary' isLoading={loadingResults[result.id]} onPress={() => handleViewDetails(result.id)} radius='full' size='sm' variant='flat'>
                    {loadingResults[result.id] ? "Loading.." : "View"}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <RatingLegend />
      <div className='flex w-full justify-center'>
        <Pagination isCompact showControls showShadow color='primary' page={page} total={pages} onChange={(page) => setPage(page)} />
      </div>
      <ViewResultDrawer isOpen={isDrawerOpen} onClose={() => setDrawerOpen(false)} interviewerData={selectedInterviewerData} />
    </div>
  );
}
