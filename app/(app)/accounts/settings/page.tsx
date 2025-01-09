"use client";
import React, { useEffect, useState } from "react";
import { Button, CardFooter, Input, Textarea } from "@nextui-org/react";
import { Formik } from "formik";
import * as Yup from "yup";
import { showToast } from "@/app/utils/toastUtils";
import { ToastContainer } from "react-toastify";
import {
  getCompanySettings,
  saveCompanySettings,
  uploadLogo,
} from "@/services/company.service";
import { Tabs, Tab, Card, CardBody, Switch } from "@nextui-org/react";
import { HouseIcon } from "@/components/icons/breadcrumb/house-icon";
import Link from "next/link";
import { UsersIcon } from "@/components/icons/breadcrumb/users-icon";
import FileUploadWithPreview from "@/components/FileUploadWithPreview";

// Validation schema using Yup
const CompanySettingsSchema = Yup.object().shape({
  name: Yup.string(),
  address: Yup.string(),
  website: Yup.string().url("Invalid website URL"),
  linkedin: Yup.string().url("Invalid LinkedIn URL"),
  facebook: Yup.string().url("Invalid Facebook URL"),
  twitter: Yup.string().url("Invalid Twitter URL"),
  logo: Yup.string().url("Invalid logo URL"),
  phone: Yup.string(),
});

export type CompanySettingsFormValues = {
  name?: string;
  address?: string;
  website?: string;
  linkedin?: string;
  facebook?: string;
  twitter?: string;
  logo?: string;
  phone?: string;
};

const CompanySettingsPage = () => {
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

  // Fetch company settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getCompanySettings();
        setInitialValues(data);
      } catch (error) {
        console.error("Error fetching company settings:", error);
        showToast.error("Failed to fetch company settings.");
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (values: CompanySettingsFormValues) => {
    try {
      const response = await saveCompanySettings(values);
      showToast.success("Company settings updated successfully!");
    } catch (error) {
      console.error("Error updating company settings: ", error);
      showToast.error("Failed to update company settings.");
    }
  };

  return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <ul className="flex">
        <li className="flex gap-2">
          <HouseIcon />
          <Link href={"/"}>
            <span>Home</span>
          </Link>
          <span> / </span>{" "}
        </li>

        <li className="flex gap-2">
          <UsersIcon />
          <span>Job</span>
          <span> / </span>{" "}
        </li>
        <li className="flex gap-2">
          <span>List</span>
        </li>
      </ul>

      <h3 className="text-xl font-semibold">Settings</h3>

      <div className="max-w-[95rem] mx-auto w-full">
        <div className=" w-full flex flex-col gap-4">
          <div className="max-w-[95rem] mx-auto w-full">
            <Tabs aria-label="Options">
              <Tab key="settings" title="Settings">
                <Card className="p-5">
                  <CardBody>
                    <h1 className="text-1xl font-semibold mb-4">
                      Company Settings
                    </h1>
                    <Formik
                      enableReinitialize
                      initialValues={initialValues}
                      validationSchema={CompanySettingsSchema}
                      onSubmit={handleSubmit}
                    >
                      {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        setFieldValue,
                        handleSubmit,
                      }) => (
                        <form
                          onSubmit={handleSubmit}
                          className="flex flex-col gap-4"
                        >
                          <Input
                            label="Company Name"
                            value={values.name}
                            onChange={handleChange("name")}
                            isInvalid={!!errors.name && !!touched.name}
                            errorMessage={errors.name}
                          />
                          <Textarea
                            label="Address"
                            value={values.address}
                            onChange={handleChange("address")}
                            isInvalid={!!errors.address && !!touched.address}
                            errorMessage={errors.address}
                          />
                          <Input
                            label="Website"
                            value={values.website}
                            onChange={handleChange("website")}
                            isInvalid={!!errors.website && !!touched.website}
                            errorMessage={errors.website}
                          />
                          <Input
                            label="LinkedIn"
                            value={values.linkedin}
                            onChange={handleChange("linkedin")}
                            isInvalid={!!errors.linkedin && !!touched.linkedin}
                            errorMessage={errors.linkedin}
                          />
                          <Input
                            label="Facebook"
                            value={values.facebook}
                            onChange={handleChange("facebook")}
                            isInvalid={!!errors.facebook && !!touched.facebook}
                            errorMessage={errors.facebook}
                          />
                          <Input
                            label="Twitter"
                            value={values.twitter}
                            onChange={handleChange("twitter")}
                            isInvalid={!!errors.twitter && !!touched.twitter}
                            errorMessage={errors.twitter}
                          />
                          <Input
                            label="Phone"
                            value={values.phone}
                            onChange={handleChange("phone")}
                            isInvalid={!!errors.phone && !!touched.phone}
                            errorMessage={errors.phone}
                          />

                          <FileUploadWithPreview
                            onUpload={(url) => setFieldValue("logo", url)} // Set the logo URL
                          />
                        </form>
                      )}
                    </Formik>
                    <ToastContainer />
                  </CardBody>
                  <CardFooter>
                    <Button type="submit" color="primary" className="mt-4">
                      Save Settings
                    </Button>
                  </CardFooter>
                </Card>
              </Tab>
              <Tab key="music" title="Music">
                <Card>
                  <CardBody>
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco
                    laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                    irure dolor in reprehenderit in voluptate velit esse cillum
                    dolore eu fugiat nulla pariatur.
                  </CardBody>
                </Card>
              </Tab>
              <Tab key="videos" title="Videos">
                <Card>
                  <CardBody>
                    Excepteur sint occaecat cupidatat non proident, sunt in
                    culpa qui officia deserunt mollit anim id est laborum.
                  </CardBody>
                </Card>
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanySettingsPage;
