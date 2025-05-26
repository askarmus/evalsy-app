import React, { useEffect, useState, useCallback } from 'react';
import { Button, Input, Radio, RadioGroup, Slider, Textarea } from '@heroui/react';
import { Drawer, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter } from '@heroui/react';
import { Formik } from 'formik';
import { getInvitations, sendInvitation } from '@/services/invitation.service';
import { showToast } from '@/app/utils/toastUtils';
import { Invitation, SentInvitationsTable } from './components/SentInvitationsTable';
import { SendInvitationSchema } from '@/helpers/schemas';
import { useCredits } from '@/context/CreditContext';

interface SendInvitationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string | null;
  name?: string | '';
  email?: string | '';
}

export const SendInvitationDrawer: React.FC<SendInvitationDrawerProps> = ({ isOpen, onClose, jobId, email, name }) => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(false);
  const { credits, refreshCredits } = useCredits();
  const fetchInvitations = useCallback(async () => {
    if (jobId) {
      const result = await getInvitations(jobId);
      setInvitations(result);
    }
  }, [jobId]);

  useEffect(() => {
    if (isOpen) {
      fetchInvitations();
    }
  }, [isOpen, fetchInvitations]);

  const handleSubmit = async (values: any, { resetForm }: any) => {
    if (credits < 2) {
      showToast.error(`You have ${credits} credits remaining. Please purchase more to send invitations.`);
      return;
    }

    setLoading(true);
    try {
      let currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + 1);
      values.expires = currentDate;

      const result = await sendInvitation({ ...values, jobId: jobId! });
      await refreshCredits();

      const newInvitation = {
        ...result,
        sentOn: result.sentOn || new Date().toISOString(),
      };

      setInvitations((prev) => [newInvitation, ...prev].sort((a, b) => new Date(b.sentOn).getTime() - new Date(a.sentOn).getTime()));

      showToast.success('Invitation sent successfully.');
      resetForm({
        values: {
          name: '',
          email: '',
          message: '',
        },
      });
    } catch (error) {
      showToast.error('Failed to send invitation.');
    } finally {
      setLoading(false);
    }
  };
  const initialValues = {
    name: name || '',
    email: email || '',
    message: '',
  };

  return (
    <Drawer size="2xl" isOpen={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <Formik enableReinitialize initialValues={initialValues} validationSchema={SendInvitationSchema} onSubmit={handleSubmit}>
          {({ values, errors, touched, handleChange, handleSubmit, resetForm, setFieldValue }) => (
            <>
              <DrawerHeader>Send Invitation</DrawerHeader>
              <DrawerBody>
                <div className="flex flex-col gap-4 mb-6">
                  <Input label="Name" value={values.name} onChange={handleChange('name')} isInvalid={!!errors.name && !!touched.name} errorMessage={errors.name} />
                  <Input label="Email" value={values.email} onChange={handleChange('email')} isInvalid={!!errors.email && !!touched.email} errorMessage={errors.email} />
                  <Textarea
                    minRows={1}
                    label="Message"
                    classNames={{
                      input: 'resize-y min-h-[30px]',
                    }}
                    value={values.message}
                    onChange={handleChange('message')}
                    isInvalid={!!errors.message && !!touched.message}
                    errorMessage={errors.message}
                  />

                  <div className="mt-6">
                    <Button color="primary" className="mr-2" isLoading={loading} onPress={handleSubmit as any}>
                      Send
                    </Button>
                    <Button
                      color="primary"
                      variant="flat"
                      onPress={() =>
                        resetForm({
                          values: {
                            name: '',
                            email: '',
                            message: '',
                          },
                        })
                      }
                    >
                      Reset
                    </Button>
                  </div>
                </div>

                {/* Table */}
                <SentInvitationsTable invitations={invitations} />
              </DrawerBody>
            </>
          )}
        </Formik>
      </DrawerContent>
    </Drawer>
  );
};
