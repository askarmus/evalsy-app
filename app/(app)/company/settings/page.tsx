"use client";
import React, { useEffect, useState } from "react";
import {
  Button,
  CardFooter,
  Input,
  Textarea,
  Tabs,
  Tab,
  Card,
  CardBody,
} from "@heroui/react";
import { Formik, Form } from "formik";
import { showToast } from "@/app/utils/toastUtils";
import { ToastContainer } from "react-toastify";
import {
  getCompanySettings,
  saveCompanySettings,
} from "@/services/company.service";
import FileUploadWithPreview from "@/components/FileUploadWithPreview";
import { CompanySettingsSchema } from "@/helpers/schemas";
import { Breadcrumb } from "@/components/bread.crumb";
import Image from "next/image";

export type CompanySettingsFormValues = {
  name: string;
  address?: string;
  website?: string;
  linkedin?: string;
  facebook?: string;
  twitter?: string;
  logo?: string;
  phone?: string;
};

const CompanySettingsPage = () => {
  const [uploadLogoUrl, setUploadLogoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [initialValues, setInitialValues] = useState<CompanySettingsFormValues>(
    {
      name: "",
      address: "",
      website: "",
      linkedin: "",
      facebook: "",
      twitter: "",
      logo: "",
      phone: "",
    }
  );

  useEffect(() => {
    const fetchSettings = async () => {
      const data = await getCompanySettings();
      setInitialValues(data);
      setUploadLogoUrl(data.logo);
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (values: CompanySettingsFormValues) => {
    try {
      setIsLoading(true);
      await saveCompanySettings(values);
      showToast.success("Company settings updated successfully!");
    } catch (error) {
      console.error("Error updating company settings: ", error);
      showToast.error("Failed to update company settings.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="my-10 px-4 lg:px-6 max-w-[90rem] mx-auto w-full flex flex-col gap-4">
      <h3 className="text-xl font-semibold">Settings</h3>
      <Breadcrumb />

      <div className="max-w-[90rem] mx-auto w-full">
        <Tabs aria-label="Options">
          <Tab key="settings" title="Settings">
            <Formik
              enableReinitialize
              initialValues={initialValues}
              validationSchema={CompanySettingsSchema}
              onSubmit={handleSubmit}
            >
              {({ values, errors, touched, setFieldValue, handleChange }) => (
                <Form>
                  <Card className="p-5">
                    <CardBody>
                      <h1 className="text-xl font-semibold mb-4">
                        Company Settings
                      </h1>
                      <div className="flex gap-4">
                        <div className="w-4/5">
                          <div className="grid grid-cols-1 gap-4">
                            <Input
                              label="Company Name"
                              name="name"
                              value={values.name || ""}
                              onChange={handleChange}
                              isInvalid={!!errors.name && !!touched.name}
                              errorMessage={errors.name}
                            />
                            <Textarea
                              label="Address"
                              name="address"
                              value={values.address || ""}
                              onChange={handleChange}
                              isInvalid={!!errors.address && !!touched.address}
                              errorMessage={errors.address}
                            />
                            <div className="grid grid-cols-2 gap-4">
                              <Input
                                label="Website"
                                name="website"
                                value={values.website || ""}
                                onChange={handleChange}
                                isInvalid={
                                  !!errors.website && !!touched.website
                                }
                                errorMessage={errors.website}
                              />
                              <Input
                                label="LinkedIn"
                                name="linkedin"
                                value={values.linkedin || ""}
                                onChange={handleChange}
                                isInvalid={
                                  !!errors.linkedin && !!touched.linkedin
                                }
                                errorMessage={errors.linkedin}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <Input
                                label="Facebook"
                                name="facebook"
                                value={values.facebook || ""}
                                onChange={handleChange}
                                isInvalid={
                                  !!errors.facebook && !!touched.facebook
                                }
                                errorMessage={errors.facebook}
                              />
                              <Input
                                label="Twitter"
                                name="twitter"
                                value={values.twitter || ""}
                                onChange={handleChange}
                                isInvalid={
                                  !!errors.twitter && !!touched.twitter
                                }
                                errorMessage={errors.twitter}
                              />
                            </div>
                            <Input
                              label="Phone"
                              name="phone"
                              value={values.phone || ""}
                              onChange={handleChange}
                              isInvalid={!!errors.phone && !!touched.phone}
                              errorMessage={errors.phone}
                            />
                          </div>
                        </div>
                        <div className="w-1/5">
                          <p className="text-sm font-semibold mb-4">
                            Company Logo
                          </p>
                          <FileUploadWithPreview
                            onUpload={(blob) => {
                              setFieldValue("logo", blob.data.url);
                              setUploadLogoUrl(blob.data.url);
                            }}
                          />
                          <div className="mt-2">
                            {uploadLogoUrl && (
                              <Image
                                src={uploadLogoUrl}
                                alt="Company Logo Preview"
                                className="max-w-full h-auto"
                                width={100}
                                height={50}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                      <ToastContainer />
                    </CardBody>
                    <CardFooter>
                      <Button
                        type="submit"
                        isLoading={isLoading}
                        color="primary"
                      >
                        Save Settings
                      </Button>
                    </CardFooter>
                  </Card>
                </Form>
              )}
            </Formik>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default CompanySettingsPage;
