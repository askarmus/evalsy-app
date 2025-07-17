import React, { useEffect, useState, useCallback } from 'react';
import { Autocomplete, AutocompleteItem, Button, Input, Textarea } from '@heroui/react';
import { Drawer, DrawerContent, DrawerHeader, DrawerBody } from '@heroui/react';
import { Formik } from 'formik';
import { getInvitations, sendInvitation } from '@/services/invitation.service';
import { showToast } from '@/app/utils/toastUtils';
import { Invitation, SentInvitationsTable } from './components/SentInvitationsTable';
import { SendInvitationSchema } from '@/helpers/schemas';
import { useCredits } from '@/context/CreditContext';
import { getAllJobs } from '@/services/job.service';

interface SendInvitationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string | null;
  name?: string | '';
  email?: string | '';
}

export const SendInvitationDrawer: React.FC<SendInvitationDrawerProps> = ({ isOpen, onClose, jobId, email, name }) => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [jobLookup, setJobLookup] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { credits, refreshCredits } = useCredits();
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  useEffect(() => {
    setSelectedJobId(jobId);
  }, [jobId]);

  const fetchInvitations = useCallback(async () => {
    const invitations = await getInvitations(jobId!);
    setInvitations(invitations);

    const jobs = await getAllJobs();
    setJobLookup(jobs);
  }, [jobId]);

  useEffect(() => {
    if (isOpen) {
      fetchInvitations();
    }
  }, [isOpen, fetchInvitations]);

  const handleSubmit = async (values: any, { resetForm }: any) => {
    setLoading(true);
    try {
      let currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + 1);
      values.expires = currentDate;

      const result = await sendInvitation({ ...values, jobId: selectedJobId });
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
    } catch (error: any) {
      const errorMsg = error?.response?.data?.error || error?.message || 'Failed to send invitation due to an unexpected error.';
      showToast.error(errorMsg);
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
                  <Autocomplete
                    label="Select a job"
                    onSelectionChange={async (value) => {
                      if (value) {
                        setInvitations([]);

                        setSelectedJobId(value.toString());
                        setFieldValue('jobId', value);
                        const result = await getInvitations(value.toString());
                        setInvitations(result);
                      }
                    }}
                    selectedKey={selectedJobId ?? undefined}
                    className="w-full"
                  >
                    {jobLookup.map((job) => (
                      <AutocompleteItem key={job.id.toString()}>{job.jobTitle}</AutocompleteItem>
                    ))}
                  </Autocomplete>

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
                    <Button color="primary" className="mr-2 bg-[#100145] text-white" isLoading={loading} onPress={handleSubmit as any}>
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
                {(jobId != '0' || invitations) && <SentInvitationsTable invitations={invitations} />}
              </DrawerBody>
            </>
          )}
        </Formik>
      </DrawerContent>
    </Drawer>
  );
};
