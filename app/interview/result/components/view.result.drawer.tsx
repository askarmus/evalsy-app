import React, { useEffect, useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerBody, Card, CardHeader, CardBody, Accordion, AccordionItem, Tab, Tabs, Chip } from "@heroui/react";

import { getInterviewerById } from "@/services/interviwers.service";
import { ToastContainer } from "react-toastify";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

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

export const ViewResultDrawer: React.FC<AddInterviewerProps> = ({ isOpen, onClose, invitationId: interviewerId }) => {
  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    if (interviewerId) {
      const fetchInterviewer = async () => {
        try {
          const data = await getInterviewerById(interviewerId);
        } catch (error) {}
      };
      fetchInterviewer();
    }
  }, [interviewerId]);

  return (
    <Drawer isOpen={isOpen} onOpenChange={handleClose} size='2xl'>
      <DrawerContent>
        <DrawerHeader className='w-full'>
          <Card className='w-full'>
            <CardBody className='p-0 w-full'>
              <p className='bg-black px-4 py-1 text-sm  text-white rounded-tl-lg rounded-br-xl w-fit'>FEATURED</p>
              <div className='grid grid-cols-12 gap-4 p-5 w-full'>
                {/* Name and Title */}
                <div className='col-span-9'>
                  <p className='text-sm font-semibold'>Askar Musthaffa</p>
                  <p className='text-sm text-gray-400'>Solution Architect</p>
                </div>

                {/* Weight */}
                <div className='col-span-3 flex justify-end items-start'>
                  <div>
                    <p className='rounded-lg text-sky-500 text-sm py-1 px-3 center'>Weight</p>
                    <p className='rounded-lg text-sky-500 font-bold bg-sky-100 py-1 px-3 text-sm center'>5</p>
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
                  <CardHeader className='text-sm font-semibold  '>Overall Evaluation</CardHeader>
                  <CardBody>
                    <ul className='space-y-1 text-sm'>
                      <li className='flex justify-between items-center'>
                        <span>Technical Accuracy:</span>
                        <Chip variant='flat' className='color-technical-accuracy'>
                          0
                        </Chip>
                      </li>

                      <li className='flex justify-between items-center'>
                        <span>Clarity:</span>
                        <Chip variant='flat' className='color-clarity'>
                          2.4
                        </Chip>
                      </li>

                      <li className='flex justify-between items-center'>
                        <span>Problem Solving:</span>
                        <Chip variant='flat' className='color-problem-solving'>
                          3
                        </Chip>
                      </li>

                      <li className='flex justify-between items-center'>
                        <span>Real World Impact:</span>
                        <Chip variant='flat' className='color-real-world-impact'>
                          3.2
                        </Chip>
                      </li>

                      <li className='flex justify-between items-center'>
                        <span>Confidence Level:</span>
                        <Chip variant='flat' className='color-confidence-level'>
                          2
                        </Chip>
                      </li>

                      <li className='flex justify-between items-center'>
                        <span>Communication Skills:</span>
                        <Chip variant='flat' className='color-communication-skills'>
                          0
                        </Chip>
                      </li>
                    </ul>
                  </CardBody>
                </Card>

                <Card className='p-2'>
                  <CardBody>
                    <Pie data={pieChartData} options={pieChartOptions} />
                  </CardBody>
                </Card>
              </div>

              <Card className='p-2 mt-6'>
                <CardHeader className='text-sm font-semibold'>Feedabck</CardHeader>
                <CardBody>
                  <div className='p-2'>The candidate showed a lack of depth in their understanding of key architectural concepts. Their responses were generally brief and lacked detail, indicating a need for improvement in communication skills and technical knowledge. The problem-solving approach was not clearly demonstrated, and their ability to articulate real-world applications of concepts was limited. significant room for improvement in all areas, particularly in technical accuracy and the ability to provide comprehensive, well-structured answers.</div>
                </CardBody>
              </Card>
            </Tab>
            <Tab key='questionsnaswers' title='Questions and Answers'>
              <Card className='p-2 mt-6'>
                <CardHeader className='text-sm font-semibold'>Questions & Answers</CardHeader>
                <CardBody>
                  <Accordion isCompact>
                    <AccordionItem key='1' aria-label='Accordion 1' title='1. What is Object-Oriented Programming (OOP)?' subtitle={<span>Technical: ★★☆☆ | Clarity: ★★★☆ | Problem Solving: ★★☆☆ | Real World Impact: ★★☆☆</span>}>
                      Lorem Innei ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </AccordionItem>
                    <AccordionItem key='2' aria-label='Accordion 2' title='2. Explain the four pillars of OOP.' subtitle={<span>Technical : ★★☆☆ | Clarity: ★★★☆ | Problem Solving: ★★☆☆ | Real World Impact: ★★☆☆</span>}>
                      <p className='text-gray-700'>
                        <strong>Answer:</strong> The four pillars of OOP are Encapsulation, Inheritance, Polymorphism, and Abstraction...
                      </p>
                      <a href='https://example.com/recordings/q2.mp4' className='text-blue-600 font-semibold'>
                        ▶ View Recording
                      </a>
                    </AccordionItem>
                  </Accordion>
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        </DrawerBody>
      </DrawerContent>
      <ToastContainer />
    </Drawer>
  );
};
