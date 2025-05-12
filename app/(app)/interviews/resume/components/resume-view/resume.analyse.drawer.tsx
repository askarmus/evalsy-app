import React, { useState } from 'react';
import { Drawer, DrawerContent, DrawerBody, DrawerFooter, Button } from '@heroui/react';
import { SendInvitationDrawer } from '@/components/jobs/send-invitation';
import { ResumeHeader } from './ResumeHeader';
import { EducationAndSoftSkills } from './EducationAndSoftSkills';
import { RedFlagsSection } from './RedFlagsSection';
import { KeyMatchesSection } from './KeyMatchesSection';
import { RecommendationSection } from './RecommendationSection';
import { KeyMissingSection } from './KeyMissingSection';
import { TopSkillsSection } from './TopSkillsSection';

export const ResumeAnalyseDrawer: React.FC<{ isOpen: boolean; onClose: () => void; resumeData: any }> = ({ isOpen, onClose, resumeData }) => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const handleCloseDrawer = () => setDrawerOpen(false);
  const handleInviteClick = () => setDrawerOpen(true);
  if (!resumeData) return null;
  const { contact, current_role, experience, education, soft_skills, red_flags, job_match, decision_summary, skill_experience, jobId } = resumeData.analysisResults;

  return (
    <>
      <Drawer isOpen={isOpen} onOpenChange={onClose} size="2xl">
        <DrawerContent>
          <DrawerBody className="space-y-6">
            <ResumeHeader contact={contact} current_role={current_role} experience={experience} />
            <RecommendationSection job_match={job_match} decision_summary={decision_summary} />
            <KeyMatchesSection key_matches={job_match.key_matches} />
            <KeyMissingSection key_missing={job_match.key_missing} />
            <RedFlagsSection red_flags={red_flags} />
            <EducationAndSoftSkills education={education} soft_skills={soft_skills} />
            <TopSkillsSection skill_experience={skill_experience} />
          </DrawerBody>
          <DrawerFooter>
            <Button color="primary" onPress={() => handleInviteClick()} variant="solid">
              Send Interview Invitation
            </Button>
            <Button color="default" variant="bordered" onPress={onClose}>
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <SendInvitationDrawer isOpen={isDrawerOpen} name={contact.name} email={contact.email} onClose={handleCloseDrawer} jobId={jobId} />
    </>
  );
};
