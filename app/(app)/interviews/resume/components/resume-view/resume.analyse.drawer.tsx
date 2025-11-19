import React, { useEffect, useState } from 'react';
import { Drawer, DrawerContent, DrawerBody, DrawerFooter, Button } from '@heroui/react';
import { Send } from 'lucide-react';
import ResumeHeader from './ResumeHeader';
import { SendInvitationDrawer } from '@/components/jobs/send-invitation';

export const ResumeAnalyseDrawer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  resumeData: any;
}> = ({ isOpen, onClose, resumeData }) => {
  const [isInviteDrawerOpen, setInviteDrawerOpen] = useState(false);

  // Ensure child drawer closes when main drawer closes
  useEffect(() => {
    if (!isOpen) {
      setInviteDrawerOpen(false);
    }
  }, [isOpen]);

  // If no resume data, do not render content
  if (!resumeData) {
    return null;
  }

  const { jobId } = resumeData;

  return (
    <>
      <Drawer
        isOpen={isOpen}
        onOpenChange={(open) => {
          if (!open) onClose();
        }}
        size="4xl"
      >
        <DrawerContent>
          <DrawerBody className="space-y-6">
            <ResumeHeader data={resumeData.analysisResults} />
          </DrawerBody>

          <DrawerFooter>
            <Button color="secondary" radius="full" variant="flat" size="md" onPress={() => setInviteDrawerOpen(true)} startContent={<Send />}>
              Invite Interview
            </Button>

            <Button color="default" radius="full" variant="bordered" size="md" onPress={onClose}>
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <SendInvitationDrawer isOpen={isInviteDrawerOpen} name={resumeData?.analysisResults?.candidate_info?.candidatename} email={resumeData?.analysisResults?.candidate_info?.email} jobId={jobId} onClose={() => setInviteDrawerOpen(false)} />
    </>
  );
};
