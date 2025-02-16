import React, { useEffect, useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerBody, Card, CardHeader, CardBody, Accordion, AccordionItem, Tab, Tabs, Chip, Spinner, DrawerFooter } from "@heroui/react";

import { getInterviewerById } from "@/services/interviwers.service";
import { ToastContainer } from "react-toastify";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import { RatingDisplay } from "./rating.display";
import FeaturedBadge from "./featured,badge";
import DownloadPDFButton from "./DownloadPDFButton";

interface AddInterviewerProps {
  isOpen: boolean;
  onClose: () => void;
  invitationId?: string | null;
}
const evaluationData = [
  { category: "Technical Accuracy", score: 0 },
  { category: "Clarity", score: 2.4 },
  { category: "Problem Solving", score: 3 },
  { category: "Real World Impact", score: 7.2 },
  { category: "Confidence Level", score: 2 },
  { category: "Communication Skills", score: 0 },
];
ChartJS.register(CategoryScale, LinearScale, BarElement, Title);
ChartJS.register(ArcElement, Tooltip, Legend);

const pieChartData = {
  labels: evaluationData.map((item) => item.category),
  datasets: [
    {
      data: evaluationData.map((item) => item.score),
      backgroundColor: [
        "rgba(255, 99, 132, 0.6)", // Technical Accuracy
        "rgba(54, 162, 235, 0.6)", // Clarity
        "rgba(255, 206, 86, 0.6)", // Problem Solving
        "rgba(75, 192, 192, 0.6)", // Real World Impact
        "rgba(153, 102, 255, 0.6)", // Confidence Level
        "rgba(255, 159, 64, 0.6)", // Communication Skills
      ],
      borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)", "rgba(75, 192, 192, 1)", "rgba(153, 102, 255, 1)", "rgba(255, 159, 64, 1)"],
      borderWidth: 1,
    },
  ],
};

// Chart Options
const pieChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
      position: "bottom" as const,
      labels: {
        boxWidth: 10, // Size of the color box
        padding: 20, // Space between legend items
        maxWidth: 100, // Limit the width of legend labels
        textAlign: "center" as const,
        // Align text if needed
      },
    },
    tooltip: {
      enabled: true,
    },
  },
};

export const ViewResultDrawer: React.FC<{ isOpen: boolean; onClose: () => void; interviewerData: any }> = ({ isOpen, onClose, interviewerData }) => {
  return (
    <Drawer isOpen={isOpen} onOpenChange={onClose} size='3xl'>
      <DrawerContent>
        <DrawerHeader className='w-full'>
          <Card className='w-full'>
            <CardBody className='p-0 w-full'>
              <FeaturedBadge weight={interviewerData?.overallWeight} />
              <div className='grid grid-cols-12 gap-4 p-5 w-full'>
                <div className='col-span-9'>
                  <p className='text-sm font-semibold'>{interviewerData?.name}</p>
                  <p className='text-sm text-gray-400'>{interviewerData?.jobTitle}</p>
                </div>
                <div className='col-span-3 flex justify-end items-start'>
                  <div>
                    <p className='rounded-lg text-sky-500 text-sm py-1 px-3 center'>Weight</p>
                    <p className='rounded-lg text-sky-500 font-bold bg-sky-100 py-1 px-3 text-sm text-center'>{interviewerData?.overallWeight}</p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </DrawerHeader>

        <DrawerBody>
          <Tabs aria-label='Options'>
            <Tab key='overallresult' title='Overall Result'>
              <div className='grid grid-cols-2 gap-6'>
                <Card className='p-2'>
                  <CardHeader className='text-sm font-semibold'>Overall Evaluation</CardHeader>
                  <CardBody>
                    <ul className='space-y-1 text-sm'>
                      {interviewerData?.overallCriteria?.map((criteria: any) => (
                        <li key={criteria.id} className='flex justify-between items-center'>
                          <span>{criteria.name}:</span>
                          <Chip variant='flat'>{criteria.expectedValue}</Chip>
                        </li>
                      ))}
                    </ul>
                  </CardBody>
                </Card>

                <Card className='p-2'>
                  <CardBody>
                    <Pie
                      data={{
                        labels: interviewerData?.overallCriteria.map((item: any) => item.name),
                        datasets: [
                          {
                            data: interviewerData?.overallCriteria.map((item: any) => item.expectedValue),
                            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"],
                          },
                        ],
                      }}
                      options={{ responsive: true }}
                    />
                  </CardBody>
                </Card>
              </div>
              <Card className='p-2 mt-6 w-full'>
                <CardHeader className='text-sm font-semibold'>Feedabck</CardHeader>
                <CardBody className='  w-full'>
                  <div className='p-2'>{interviewerData?.notes}</div>
                </CardBody>
              </Card>
            </Tab>
            <Tab key='questionsnaswers' title='Questions and Answers'>
              <Card className='p-2 mt-6'>
                <CardHeader className='text-sm font-semibold'>Questions & Answers</CardHeader>
                <CardBody>
                  <Accordion isCompact>
                    {interviewerData?.questionAnswers?.map((qa: any, index: number) => {
                      const questionRating = interviewerData?.questionCriteria?.find((crit: any) => crit.name === qa.name);

                      return (
                        <AccordionItem
                          key={qa.id}
                          aria-label={`Accordion ${index + 1}`}
                          title={`${index + 1}. ${qa.text}`}
                          subtitle={
                            questionRating ? (
                              <span>
                                Technical: <RatingDisplay rating={questionRating.expectedValue} /> | Clarity: <RatingDisplay rating={questionRating.expectedValue} /> | Problem Solving: <RatingDisplay rating={questionRating.expectedValue} />
                              </span>
                            ) : null
                          }>
                          <p className='text-gray-700'>
                            <strong>Answer:</strong> {qa.transcription || "No transcription available."}
                          </p>

                          {qa.recordedUrl && (
                            <audio controls className='mt-2 mb-2 w-full'>
                              <source src={qa.recordedUrl} type='audio/mpeg' />
                              Your browser does not support the audio element.
                            </audio>
                          )}
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        </DrawerBody>
        <DrawerFooter>
          <DownloadPDFButton interviewerData={interviewerData} />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
