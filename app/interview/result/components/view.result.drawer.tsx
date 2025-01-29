import React, { useEffect, useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Card,
  CardHeader,
  CardBody,
  Accordion,
  AccordionItem,
} from "@heroui/react";

import { getInterviewerById } from "@/services/interviwers.service";
import { ToastContainer } from "react-toastify";
import { Chart } from "react-google-charts";

interface AddInterviewerProps {
  isOpen: boolean;
  onClose: () => void;
  invitationId?: string | null;
}

export const data = [
  ["City", "2010 Population", "2000 Population"],
  ["New York City, NY", 8175000, 8008000],
  ["Los Angeles, CA", 3792000, 3694000],
  ["Chicago, IL", 2695000, 2896000],
  ["Houston, TX", 2099000, 1953000],
  ["Philadelphia, PA", 1526000, 1517000],
];

// Different options for non-material charts
export const options = {
  title: "Population of Largest U.S. Cities",
  chartArea: { width: "50%" },
  hAxis: {
    title: "Total Population",
    minValue: 0,
  },
  vAxis: {
    title: "City",
  },
};

export const ViewResultDrawer: React.FC<AddInterviewerProps> = ({
  isOpen,
  onClose,
  invitationId: interviewerId,
}) => {
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
    <Drawer isOpen={isOpen} onOpenChange={handleClose} size="3xl">
      <DrawerContent>
        <DrawerHeader>Interview Result</DrawerHeader>
        <DrawerBody>
          <div className="grid grid-cols-2 gap-6">
            <Card className="p-3 bg-blue-100">
              <CardHeader className="text-sm font-semibold text-blue-800">
                Candidate Details
              </CardHeader>
              <CardBody>
                <p className="text-sm">
                  <strong>Name:</strong> Askar Stokes Musthaffa
                </p>
                <p className="text-sm">
                  <strong>Email:</strong> askarmus@hotmail.com
                </p>
                <p className="text-sm">
                  <strong>Job Title:</strong> Senior Software Engineer
                </p>
                <p className="text-sm">
                  <strong>Experience:</strong> Mid-Senior Level
                </p>
              </CardBody>
            </Card>
            <Card className="p-3 bg-yellow-100">
              <CardHeader className="text-sm font-semibold text-yellow-800">
                Interview Status
              </CardHeader>
              <CardBody>
                <p className="text-sm">
                  <strong>Status:</strong> 🟢 Completed
                </p>
                <p className="text-sm">
                  <strong>Started At:</strong> 2025-01-27 12:08:47
                </p>
                <p className="text-sm">
                  <strong>Completed At:</strong> 2025-01-27 12:45:32
                </p>
              </CardBody>
            </Card>
          </div>
          <Card className="p-3 mt-6">
            <CardHeader className="text-sm font-semibold">
              Evaluation Result
            </CardHeader>
            <CardBody>
              <div className="p-3">
                <Chart chartType="BarChart" data={data} options={options} />
              </div>
            </CardBody>
          </Card>
          <Card className="p-3 mt-6">
            <CardHeader className="text-sm font-semibold">
              Questions & Answers
            </CardHeader>
            <CardBody>
              <Accordion isCompact>
                <AccordionItem
                  key="1"
                  aria-label="Accordion 1"
                  title="1. What is Object-Oriented Programming (OOP)?"
                >
                  Lorem Innei ipsum dolor sit amet, consectetur adipiscing elit,
                  sed do eiusmod tempor incididunt ut labore et dolore magna
                  aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                  ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </AccordionItem>
                <AccordionItem
                  key="2"
                  aria-label="Accordion 2"
                  title="2. Explain the four pillars of OOP."
                >
                  <p className="text-gray-700">
                    <strong>Answer:</strong> The four pillars of OOP are
                    Encapsulation, Inheritance, Polymorphism, and Abstraction...
                  </p>
                  <a
                    href="https://example.com/recordings/q2.mp4"
                    className="text-blue-600 font-semibold"
                  >
                    ▶ View Recording
                  </a>
                </AccordionItem>
              </Accordion>
            </CardBody>
          </Card>
        </DrawerBody>
      </DrawerContent>
      <ToastContainer />
    </Drawer>
  );
};
