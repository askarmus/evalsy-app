import React from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerBody, Card, CardHeader, CardBody, DrawerFooter, Tab, Tabs } from "@heroui/react";
import RatingBadge from "./rating,badge";
import DownloadAndEmailPDF from "./DownloadPDFButton";
import EvaluationTable from "./EvaluationTable";
import EvaluationChart from "./EvaluationChart";

export const ViewResultDrawer: React.FC<{ isOpen: boolean; onClose: () => void; interviewerData: any }> = ({ isOpen, onClose, interviewerData }) => {
  return (
    <Drawer isOpen={isOpen} onOpenChange={onClose} size='2xl'>
      <DrawerContent>
        <DrawerHeader className='w-full'>
          <div className='flex items-start justify-between w-full'>
            <div className='text-left'>
              <h3 className='text-lg font-semibold'>{interviewerData?.name}</h3>
              <p className='text-sm'>{interviewerData?.jobTitle}</p>
            </div>

            <div className='mr-5'>
              <RatingBadge weight={interviewerData?.overallWeight} />
            </div>
          </div>
        </DrawerHeader>

        <DrawerBody>
          <Tabs aria-label='Options'>
            <Tab key='Overall Result' title='Overall Result'>
              <EvaluationChart data={interviewerData}></EvaluationChart>
              <Card shadow='sm' radius='sm' className='p-2 mt-6 w-full'>
                <CardHeader className='text-sm font-semibold'>Feedabck</CardHeader>
                <CardBody className='  w-full'>
                  {Array.isArray(interviewerData?.notes?.summary) && interviewerData.notes.summary.filter((item) => item.trim() !== "").length > 0 && (
                    <ul className='space-y-3'>
                      {interviewerData.notes.summary
                        .filter((item) => item.trim() !== "") // Filter out empty or whitespace-only strings
                        .map((item, index) => (
                          <li key={index} className='flex items-start gap-2'>
                            <span className='mt-2 w-2 h-2 rounded-full bg-blue-500 shrink-0' />
                            <span className='text-sm text-gray-800 leading-relaxed'>{item}</span>
                          </li>
                        ))}
                    </ul>
                  )}
                </CardBody>
              </Card>
            </Tab>
            <Tab key='Questions and Answers' title='Questions and Answers'>
              <EvaluationTable data={interviewerData} />
            </Tab>
          </Tabs>
        </DrawerBody>
        <DrawerFooter>
          <DownloadAndEmailPDF result={interviewerData} />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
