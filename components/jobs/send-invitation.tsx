import React, { useEffect, useState } from "react";
import { Button, Input, Textarea } from "@nextui-org/react";
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

  // Fetch invitations on open
  useEffect(() => {
    if (isOpen && jobId) {
      fetchInvitations();
    }
  }, [isOpen, jobId]);

  const fetchInvitations = async () => {
    try {
      const result = await getInvitations(jobId!);
      setInvitations(result);
    } catch {
      showToast.error("Failed to fetch invitations.");
    }
  };

  const handleSubmit = async (values: any, { resetForm }: any) => {
    setLoading(true);
    try {
      const result = await sendInvitation({ ...values, jobId: jobId! });
      setInvitations((prev) => [...prev, result]);
      showToast.success("Invitation sent successfully.");
      resetForm();
    } catch {
      showToast.error("Failed to send invitation.");
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
                    value={values.message}
                    onChange={handleChange("message")}
                    isInvalid={!!errors.message && !!touched.message}
                    errorMessage={errors.message}
                  />
                  <Input
                    label="Expires"
                    type="datetime-local"
                    value={values.expires}
                    onChange={handleChange("expires")}
                    isInvalid={!!errors.expires && !!touched.expires}
                    errorMessage={errors.expires}
                  />
                  <Button
                    isLoading={loading}
                    onPress={handleSubmit as any} // Cast handleSubmit to match onPress type
                  >
                    Send
                  </Button>
                </div>

                {/* Table */}
                <SentInvitationsTable invitations={invitations} />
              </DrawerBody>
              <DrawerFooter>
                <Button onPress={onClose} color="danger">
                  Close
                </Button>
              </DrawerFooter>
            </>
          )}
        </Formik>
      </DrawerContent>
      <ToastContainer />
    </Drawer>
  );
};
