import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from "@nextui-org/react";
import { ToastContainer } from "react-toastify";
import { Formik } from "formik";
import { getInvitations, sendInvitation } from "@/services/invitation.service";
import { showToast } from "@/app/utils/toastUtils";
import {
  Invitation,
  SentInvitationsTable,
} from "./components/SentInvitationsTable";
import { SendInvitationSchema } from "@/helpers/schemas";
import { getAllInterviewers } from "@/services/interviwers.service";

interface SendInvitationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string | null;
}

export const SendInvitationDrawer: React.FC<SendInvitationDrawerProps> = ({
  isOpen,
  onClose,
  jobId,
}) => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(false);
  const [interviewers, setInterviewers] = useState([]);

  // Fetch invitations on open
  useEffect(() => {
    if (isOpen && jobId) {
      fetchInvitations();
      fetchInterviewers();
    }
  }, [isOpen, jobId]);

  const fetchInvitations = async () => {
    const result = await getInvitations(jobId!);
    setInvitations(result);
  };

  const fetchInterviewers = async () => {
    const result = await getAllInterviewers();
    setInterviewers(result);
  };

  const handleSubmit = async (values: any, { resetForm }: any) => {
    setLoading(true);
    try {
      const result = await sendInvitation({ ...values, jobId: jobId! });
      setInvitations((prev) => [...prev, result]);
      showToast.success("Invitation sent successfully.");
      resetForm();
    } catch {
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer size="2xl" isOpen={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <Formik
          initialValues={{
            name: "",
            email: "",
            message: "",
            expires: "",
            interviewerId: "",
          }}
          validationSchema={SendInvitationSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleSubmit,
            setFieldValue,
          }) => (
            <>
              <DrawerHeader>Send Invitation</DrawerHeader>
              <DrawerBody>
                {/* Form */}
                <div className="flex flex-col gap-4 mb-6">
                  <Input
                    label="Name"
                    value={values.name}
                    onChange={handleChange("name")}
                    isInvalid={!!errors.name && !!touched.name}
                    errorMessage={errors.name}
                  />
                  <Input
                    label="Email"
                    value={values.email}
                    onChange={handleChange("email")}
                    isInvalid={!!errors.email && !!touched.email}
                    errorMessage={errors.email}
                  />
                  <Textarea
                    label="Message"
                    classNames={{
                      input: "resize-y min-h-[30px]",
                    }}
                    value={values.message}
                    onChange={handleChange("message")}
                    isInvalid={!!errors.message && !!touched.message}
                    errorMessage={errors.message}
                  />
                  <Select
                    placeholder="Choose an interviewer"
                    value={values.interviewerId}
                    onChange={handleChange("interviewerId")}
                    isInvalid={
                      !!errors.interviewerId && !!touched.interviewerId
                    }
                    errorMessage={errors.interviewerId}
                  >
                    {interviewers.map((interviewer: any) => (
                      <SelectItem key={interviewer.id} value={interviewer.id}>
                        {interviewer.name}
                      </SelectItem>
                    ))}
                  </Select>
                  <RadioGroup
                    label="Invitation Expires"
                    orientation="horizontal"
                    value={values.expires}
                    onChange={handleChange("expires")}
                    isInvalid={!!errors.expires && !!touched.expires}
                    errorMessage={errors.expires}
                  >
                    <Radio value="3">3 Days</Radio>
                    <Radio value="7">One Week</Radio>
                    <Radio value="14">Tow Week</Radio>
                    <Radio value="30">1 Month</Radio>
                    <Radio value="10000">No Expiary</Radio>
                  </RadioGroup>

                  <Button
                    color="primary"
                    variant="bordered"
                    isLoading={loading}
                    onPress={handleSubmit as any}
                  >
                    Send
                  </Button>
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
