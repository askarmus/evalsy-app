import React from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerBody, Card, CardHeader, CardBody, DrawerFooter } from "@heroui/react";
import FeaturedBadge from "./featured,badge";
import DownloadAndEmailPDF from "./DownloadPDFButton";
import EvaluationTable from "./EvaluationTable";
import EvaluationChart from "./EvaluationChart";

export const ViewResultDrawer: React.FC<{ isOpen: boolean; onClose: () => void; interviewerData: any }> = ({ isOpen, onClose, interviewerData }) => {
  return (
    <Drawer isOpen={isOpen} onOpenChange={onClose} size='2xl'>
      <DrawerContent>
        <DrawerHeader className='w-full'>
          <div className='flex items-start justify-between w-full'>
            <div className='text-right'>
              <h3 className='text-lg font-semibold text-gray-800'>{interviewerData?.name}</h3>
              <p className='text-sm text-gray-500'>{interviewerData?.jobTitle}</p>
            </div>

            <div className='mr-5'>
              <FeaturedBadge weight={interviewerData?.overallWeight} />
            </div>
          </div>
        </DrawerHeader>

        <DrawerBody>
          <EvaluationChart data={interviewerData}></EvaluationChart>
          <EvaluationTable data={interviewerData} />
          <Card shadow='sm' className='p-2 mt-6 w-full'>
            <CardHeader className='text-sm font-semibold'>Feedabck</CardHeader>
            <CardBody className='  w-full'>
              <ul className='list-disc list-inside space-y-2'>
                {interviewerData?.notes?.summary?.map((item, index) => (
                  <li key={index} className='text-gray-700 text-sm'>
                    {item}
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </DrawerBody>
        <DrawerFooter>
          <DownloadAndEmailPDF result={interviewerData} />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
