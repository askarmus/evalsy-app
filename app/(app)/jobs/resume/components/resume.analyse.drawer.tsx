import React from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerBody, Card, CardHeader, CardBody, DrawerFooter, Tab, Tabs, Button, Divider } from "@heroui/react";
import { CertificationsSection } from "./certifications-section";
import { EducationSection } from "./education-section";
import { ResumeHeader } from "./resume-header";
import { SkillsSection } from "./skills-section";
import { ProjectsSection } from "./projects-section";

export const ResumeAnalyseDrawer: React.FC<{ isOpen: boolean; onClose: () => void; resumeData: any }> = ({ isOpen, onClose, resumeData }) => {
  return (
    <Drawer isOpen={isOpen} onOpenChange={onClose} size='5xl'>
      <DrawerContent>
        <DrawerHeader>
          <ResumeHeader name={resumeData?.analysisResults.name} email={resumeData?.analysisResults.email} phone={resumeData?.analysisResults.phone} totalExperience={resumeData?.analysisResults.total_experience} relevantExperience={resumeData?.analysisResults.relevant_experience} />
        </DrawerHeader>
        <DrawerBody>
          <div className='min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200'>
            <div className='container mx-auto  max-w-5xl'>
              <div className='bg-white dark:bg-gray-800   rounded-lg overflow-hidden'>
                <div className='flex flex-col md:flex-row border border-gray-200 dark:border-gray-700'>
                  <div className='md:w-1/3 p-6 bg-gray-50 dark:bg-gray-900 dark:border-r dark:border-gray-700'>
                    <SkillsSection skills={resumeData?.analysisResults.skills || []} />

                    <CertificationsSection certifications={resumeData?.analysisResults.certifications || []} />
                  </div>

                  <div className='md:w-2/3 p-6'>
                    <EducationSection education={resumeData?.analysisResults?.education} />

                    <ProjectsSection projects={resumeData?.analysisResults.projects || []} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DrawerBody>
        <DrawerFooter>
          <Button color='success' onPress={onClose}>
            Send Interview Invitation
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
