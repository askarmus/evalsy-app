import React, { useEffect, useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerBody } from "@heroui/react";
import { Input, Textarea, Button } from "@heroui/react";
import { Formik } from "formik";
import { showToast } from "@/app/utils/toastUtils";
import Image from "next/image";

import { AddInterviewerSchema } from "@/helpers/schemas";
import {
  createInterviewer,
  getInterviewerById,
  updateInterviewer,
} from "@/services/interviwers.service";
import { ToastContainer } from "react-toastify";
import FileUploadWithPreview from "../FileUploadWithPreview";

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
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProfileUrl, setUploadProfileUrl] = useState("");

  const handleClose = () => {
    setUploadProfileUrl("");
    onClose();
  };

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
          setUploadProfileUrl(data.photoUrl || "");
        } catch (error) {}
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
    setIsLoading(true);
    try {
      if (interviewerId) {
        await updateInterviewer(interviewerId, values);
        showToast.success("Interviewer updated successfully!");
        setUploadProfileUrl("");
      } else {
        await createInterviewer(values);
        showToast.success("Interviewer created successfully!");
      }
      onAddSuccess();
      onClose();
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Drawer isOpen={isOpen} onOpenChange={handleClose} size="lg">
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
            {({
              values,
              handleChange,
              handleSubmit,
              errors,
              setFieldValue,
              touched,
            }) => (
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
                <p className="text-sm font-semibold mb-4">Profile photo</p>
                <FileUploadWithPreview
                  onUpload={(blob) => {
                    setFieldValue("photoUrl", blob.data.url);
                    setUploadProfileUrl(blob.data.url);
                  }}
                />
                <div className="mt-2">
                  {uploadProfileUrl && (
                    <Image
                      src={uploadProfileUrl}
                      alt="Profile Preview"
                      className="max-w-full h-auto"
                      width={100}
                      height={50}
                    />
                  )}
                </div>

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
