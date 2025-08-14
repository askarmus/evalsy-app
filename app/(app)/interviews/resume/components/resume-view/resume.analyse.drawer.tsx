import React, { useState } from 'react';
import { Drawer, DrawerContent, DrawerBody, DrawerFooter, Button } from '@heroui/react';

import { Send } from 'lucide-react';
import ResumeHeader, { bgTint } from './ResumeHeader';

export const ResumeAnalyseDrawer: React.FC<{ isOpen: boolean; onClose: () => void; resumeData: any }> = ({ isOpen, onClose, resumeData }) => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const handleCloseDrawer = () => setDrawerOpen(false);
  const handleInviteClick = () => {
    setDrawerOpen(true);
  };
  if (!resumeData) return null;
  const { jobId } = resumeData;

  return (
    <>
      <Drawer isOpen={isOpen} onOpenChange={onClose} size="4xl">
        <DrawerContent>
          <DrawerBody className="space-y-6">
            <ResumeHeader data={resumeData.analysisResults} />
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
