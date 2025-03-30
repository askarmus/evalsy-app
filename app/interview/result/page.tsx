"use client";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Card, CardBody, Button, Input, Pagination, Spinner, CardFooter, CardHeader, Divider } from "@heroui/react";
import { Breadcrumb } from "@/components/bread.crumb";
import { getAllInterviewResult, getInterviewResultById } from "@/services/interview.service";
import { ViewResultDrawer } from "./components/view.result.drawer";
import RatingLegend from "./components/RatingLegend";
import RatingBadge from "./components/rating,badge";
import { AiOutlineRight } from "react-icons/ai";
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
  const getBorderColor = (percent: number) => {
    if (percent >= 0 && percent <= 25) return "border-orange-500"; // Below Average
    if (percent > 25 && percent <= 50) return "border-yellow-600"; // Average
    if (percent > 50 && percent <= 75) return "border-blue-600"; // Good
    if (percent > 75 && percent <= 100) return "border-green-600"; // Excellent

    return "border-gray-500"; // Fallback
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
            <Card shadow='sm' key={result.id} className={`rounded-xl shadow-md p-3 w-full border-1 ${getBorderColor(result.overallWeight)}`}>
              <CardHeader>
                <div className='flex items-start justify-between w-full'>
                  <div>
                    <RatingBadge weight={result?.overallWeight} />
                  </div>
                  <div className='text-right'>
                    <p className='text-sm  '>
                      Score : <span className={`text-sm font-medium`}>{((result?.overallWeight / 30) * 100).toFixed(2)}%</span>{" "}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <Divider />
              <CardBody>
                <h3 className='text-lg font-semibold  '>{result?.name}</h3>
                <p className='text-sm '>{result?.jobTitle}</p>
              </CardBody>

              <CardFooter>
                <div className='flex items-start justify-between w-full'>
                  <div className='text-sm'>{DateFormatter.formatDate(result.statusUpdateAt)}</div>
                  <div className='text-right'>
                    <Button color='primary' endContent={<AiOutlineRight />} isLoading={loadingResults[result.id]} onPress={() => handleViewDetails(result.id)} radius='full' size='sm'>
                      {loadingResults[result.id] ? "Loading.." : "View Result"}
                    </Button>
                  </div>
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
