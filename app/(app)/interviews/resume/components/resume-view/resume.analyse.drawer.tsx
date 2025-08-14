import React, { useState } from 'react';
import { Drawer, DrawerContent, DrawerBody, DrawerFooter, Button } from '@heroui/react';
import { SendInvitationDrawer } from '@/components/jobs/send-invitation';
import { ResumeHeader } from './ResumeHeader';
import { EducationAndSoftSkills } from './EducationAndSoftSkills';
import { RedFlagsSection } from './RedFlagsSection';
import { KeyMatchesSection } from './KeyMatchesSection';
import { RecommendationSection } from './RecommendationSection';
import { KeyMissingSection } from './KeyMissingSection';
import { MailPlusIcon, Send } from 'lucide-react';

export const ResumeAnalyseDrawer: React.FC<{ isOpen: boolean; onClose: () => void; resumeData: any }> = ({ isOpen, onClose, resumeData }) => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const handleCloseDrawer = () => setDrawerOpen(false);
  const handleInviteClick = () => {
    setDrawerOpen(true);
  };
  if (!resumeData) return null;
  const { candidate_info, current_role, experience, education, soft_skills, red_flags, job_match, decision_summary, skill_experience } = resumeData.analysisResults;
  const { jobId } = resumeData;

  return (
    <>
      <Drawer isOpen={isOpen} onOpenChange={onClose} size="2xl">
        <DrawerContent>
          <DrawerBody className="space-y-6">
            <ResumeHeader contact={candidate_info} current_role={candidate_info} experience={candidate_info} />
          </DrawerBody>
          <DrawerFooter>
            <Button color="secondary" radius="full" variant="flat" size="md" onPress={() => handleInviteClick()} startContent={<Send />}>
              Send Interview Invitation
            </Button>
            <Button color="default" radius="full" variant="bordered" size="md" onPress={onClose}>
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* <SendInvitationDrawer isOpen={isDrawerOpen} name={contact.name} email={contact.email} onClose={handleCloseDrawer} jobId={jobId} /> */}
    </>
  );
};
