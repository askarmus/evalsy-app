import React, { useEffect, useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from "@heroui/react";
import { Input, Textarea, Button, Spinner } from "@heroui/react";
import { Formik } from "formik";
import { showToast } from "@/app/utils/toastUtils";

import { AddInterviewerSchema } from "@/helpers/schemas";
import {
  createInterviewer,
  getInterviewerById,
  updateInterviewer,
} from "@/services/interviwers.service";
import { ToastContainer } from "react-toastify";

interface AddInterviewerProps {
  isOpen: boolean;
  onClose: () => void;
  interviewerId?: string | null;
  onAddSuccess;
}

export const AddInterviewer: React.FC<AddInterviewerProps> = ({
  isOpen,
  onClose,
  interviewerId,
  onAddSuccess,
}) => {
  const [initialValues, setInitialValues] = useState({
    name: "",
    jobTitle: "",
    biography: "",
    photoUrl: "",
  });
  const [isLoading, setIsLoading] = useState(false); // Loading state

  useEffect(() => {
    if (interviewerId) {
      const fetchInterviewer = async () => {
        try {
          const data = await getInterviewerById(interviewerId);
          setInitialValues({
            name: data.name || "",
            jobTitle: data.jobTitle || "",
            biography: data.biography || "",
            photoUrl: data.photoUrl || "",
          });
        } catch (error) {
          console.error("Error fetching interviewer data:", error);
          showToast.error("Failed to fetch interviewer data.");
        }
      };
      fetchInterviewer();
    } else {
      setInitialValues({
        name: "",
        jobTitle: "",
        biography: "",
        photoUrl: "",
      });
    }
  }, [interviewerId]);

  const handleSubmit = async (values: typeof initialValues) => {
    setIsLoading(true); // Start loading
    try {
      if (interviewerId) {
        await updateInterviewer(interviewerId, values);
        showToast.success("Interviewer updated successfully!");
      } else {
        await createInterviewer(values);
        showToast.success("Interviewer created successfully!");
      }
      onAddSuccess();
      // onClose();
    } catch (error) {
      console.error("Error saving interviewer:", error);
      showToast.error("Failed to save interviewer.");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <Drawer isOpen={isOpen} onOpenChange={onClose} size="lg">
      <DrawerContent>
        <DrawerHeader>
          {interviewerId ? "Edit Interviewer" : "Add Interviewer"}
        </DrawerHeader>
        <DrawerBody>
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={AddInterviewerSchema}
            enableReinitialize
          >
            {({ values, handleChange, handleSubmit, errors, touched }) => (
              <>
                <Input
                  label="Name"
                  value={values.name}
                  onChange={handleChange("name")}
                  isInvalid={!!errors.name && !!touched.name}
                  errorMessage={errors.name}
                />
                <Input
                  label="Job Title"
                  value={values.jobTitle}
                  onChange={handleChange("jobTitle")}
                  isInvalid={!!errors.jobTitle && !!touched.jobTitle}
                  errorMessage={errors.jobTitle}
                />
                <Textarea
                  label="Biography"
                  value={values.biography}
                  onChange={handleChange("biography")}
                  isInvalid={!!errors.biography && !!touched.biography}
                  errorMessage={errors.biography}
                />
                <Input
                  label="Photo URL"
                  value={values.photoUrl}
                  onChange={handleChange("photoUrl")}
                  isInvalid={!!errors.photoUrl && !!touched.photoUrl}
                  errorMessage={errors.photoUrl}
                />
                <Button
                  className="w-auto"
                  color="primary"
                  onPress={() => handleSubmit()}
                  isLoading={isLoading}
                >
                  {interviewerId ? "Update" : "Create"}
                </Button>
              </>
            )}
          </Formik>
        </DrawerBody>
      </DrawerContent>
      <ToastContainer />
    </Drawer>
  );
};
