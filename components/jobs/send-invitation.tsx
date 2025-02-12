import React, { useEffect, useState, useCallback } from "react";
import { Button, Input, Radio, RadioGroup, Select, SelectItem, Slider, Textarea } from "@heroui/react";
import { Drawer, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter } from "@heroui/react";
import { ToastContainer } from "react-toastify";
import { Formik } from "formik";
import { getInvitations, sendInvitation } from "@/services/invitation.service";
import { showToast } from "@/app/utils/toastUtils";
import { Invitation, SentInvitationsTable } from "./components/SentInvitationsTable";
import { SendInvitationSchema } from "@/helpers/schemas";
import { getAllInterviewers } from "@/services/interviwers.service";

interface SendInvitationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string | null;
}

export const SendInvitationDrawer: React.FC<SendInvitationDrawerProps> = ({ isOpen, onClose, jobId }) => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(false);
  const [interviewers, setInterviewers] = useState([]);

  const fetchInvitations = useCallback(async () => {
    if (jobId) {
      const result = await getInvitations(jobId);
      setInvitations(result);
    }
  }, [jobId]);

  const fetchInterviewers = useCallback(async () => {
    const result = await getAllInterviewers();
    setInterviewers(result);
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchInvitations();
      fetchInterviewers();
    }
  }, [isOpen, fetchInvitations, fetchInterviewers]);

  const handleSubmit = async (values: any, { resetForm }: any) => {
    setLoading(true);
    try {
      let currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + 1);
      values.expires = currentDate;

      const result = await sendInvitation({ ...values, jobId: jobId! });

      // Manually add 'sentOn' if not provided by the API
      const newInvitation = {
        ...result,
        sentOn: result.sentOn || new Date().toISOString(),
      };

      setInvitations((prev) => [newInvitation, ...prev].sort((a, b) => new Date(b.sentOn).getTime() - new Date(a.sentOn).getTime()));

      showToast.success("Invitation sent successfully.");
      resetForm();
    } catch (error) {
      showToast.error("Failed to send invitation.");
    } finally {
      setLoading(false);
    }
  };
  const initialValues = {
    name: "",
    email: "",
    message: "",
    expires: "",
    interviewerId: "",
    duration: 15,
  };
  return (
    <Drawer size='2xl' isOpen={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <Formik initialValues={initialValues} validationSchema={SendInvitationSchema} onSubmit={handleSubmit}>
          {({ values, errors, touched, handleChange, handleSubmit, resetForm, setFieldValue }) => (
            <>
              <DrawerHeader>Send Invitation</DrawerHeader>
              <DrawerBody>
                <div className='flex flex-col gap-4 mb-6'>
                  <Input label='Name' value={values.name} onChange={handleChange("name")} isInvalid={!!errors.name && !!touched.name} errorMessage={errors.name} />
                  <Input label='Email' value={values.email} onChange={handleChange("email")} isInvalid={!!errors.email && !!touched.email} errorMessage={errors.email} />
                  <Textarea
                    rows={1}
                    label='Message'
                    classNames={{
                      input: "resize-y min-h-[30px]",
                    }}
                    value={values.message}
                    onChange={handleChange("message")}
                    isInvalid={!!errors.message && !!touched.message}
                    errorMessage={errors.message}
                  />
                  <Select placeholder='Choose an interviewer' value={values.interviewerId} onChange={(value) => setFieldValue("interviewerId", value)} isInvalid={!!errors.interviewerId && !!touched.interviewerId} errorMessage={errors.interviewerId}>
                    {interviewers.map((interviewer: any) => (
                      <SelectItem key={interviewer.id} value={interviewer.id}>
                        {interviewer.name}
                      </SelectItem>
                    ))}
                  </Select>
                  <RadioGroup label='Invitation Expires' size='sm' orientation='horizontal' value={values.expires} onChange={handleChange("expires")} isInvalid={!!errors.expires && !!touched.expires} errorMessage={errors.expires}>
                    <Radio value='3'>3 Days</Radio>
                    <Radio value='7'>One Week</Radio>
                    <Radio value='14'>Two Weeks</Radio>
                    <Radio value='30'>1 Month</Radio>
                    <Radio value='10000'>No Expiry</Radio>
                  </RadioGroup>

                  <Slider
                    className='max-w-full'
                    defaultValue={30}
                    value={values.duration}
                    label='Interview Duration (Minutes)'
                    maxValue={120}
                    minValue={15}
                    showSteps={true}
                    size='sm'
                    step={15}
                    onChange={(e) =>
                      handleChange({
                        target: { name: "duration", value: Number(e) },
                      })
                    }
                  />

                  <div className='mt-6'>
                    <Button color='primary' isLoading={loading} onPress={handleSubmit as any}>
                      Send
                    </Button>
                    <Button color='primary' variant='flat' onPress={() => resetForm({ values: initialValues })}>
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
      <ToastContainer />
    </Drawer>
  );
};
