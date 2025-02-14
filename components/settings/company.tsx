"use client";
import React, { useEffect, useState } from "react";
import { Button, CardFooter, Input, Textarea, Tabs, Tab, Card, CardBody } from "@heroui/react";
import { Formik, Form } from "formik";
import { showToast } from "@/app/utils/toastUtils";
import { ToastContainer } from "react-toastify";
import { getCompanySettings, saveCompanySettings } from "@/services/company.service";
import FileUploadWithPreview from "@/components/FileUploadWithPreview";
import { CompanySettingsSchema } from "@/helpers/schemas";

import { AiOutlineCloseCircle } from "react-icons/ai";

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

const CompanySettings = () => {
  const [uploadLogoUrl, setUploadLogoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [initialValues, setInitialValues] = useState<CompanySettingsFormValues>({
    name: "",
    address: "",
    website: "",
    linkedin: "",
    facebook: "",
    twitter: "",
    logo: "",
    phone: "",
  });

  const handleRemoveImage = () => {
    setUploadLogoUrl("");
    setInitialValues((prevValues) => ({ ...prevValues, logo: "" }));
  };

  useEffect(() => {
    const fetchSettings = async () => {
      const data = await getCompanySettings();
      setInitialValues(data);
      setUploadLogoUrl(data.logo);
    };
    fetchSettings();
  }, []);

  const breadcrumbItems = [
    { name: "Dashboard", link: "/" },
    { name: "Company", link: "" },
  ];

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
    <Formik enableReinitialize initialValues={initialValues} validationSchema={CompanySettingsSchema} onSubmit={handleSubmit}>
      {({ values, errors, touched, setFieldValue, handleChange }) => (
        <Form>
          <Card className='p-5'>
            <CardBody>
              <h1 className='text-xl font-semibold mb-4'>Company Settings</h1>
              <div className='flex gap-4'>
                <div className='w-4/5'>
                  <div className='grid grid-cols-1 gap-4'>
                    <Input label='Company Name' name='name' value={values.name || ""} onChange={handleChange} isInvalid={!!errors.name && !!touched.name} errorMessage={errors.name} />
                    <Textarea label='Address' name='address' value={values.address || ""} onChange={handleChange} isInvalid={!!errors.address && !!touched.address} errorMessage={errors.address} />
                    <div className='grid grid-cols-2 gap-4'>
                      <Input label='Website' name='website' value={values.website || ""} onChange={handleChange} isInvalid={!!errors.website && !!touched.website} errorMessage={errors.website} />
                      <Input label='LinkedIn' name='linkedin' value={values.linkedin || ""} onChange={handleChange} isInvalid={!!errors.linkedin && !!touched.linkedin} errorMessage={errors.linkedin} />
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                      <Input label='Facebook' name='facebook' value={values.facebook || ""} onChange={handleChange} isInvalid={!!errors.facebook && !!touched.facebook} errorMessage={errors.facebook} />
                      <Input label='Twitter' name='twitter' value={values.twitter || ""} onChange={handleChange} isInvalid={!!errors.twitter && !!touched.twitter} errorMessage={errors.twitter} />
                    </div>
                    <Input label='Phone' name='phone' value={values.phone || ""} onChange={handleChange} isInvalid={!!errors.phone && !!touched.phone} errorMessage={errors.phone} />
                  </div>
                </div>
                <div className='w-1/5'>
                  <p className='text-sm font-semibold mb-4'>Company Logo</p>

                  <div className='flex items-center space-x-4'>
                    <FileUploadWithPreview
                      onUpload={(blob) => {
                        setFieldValue("logo", blob.data.url);
                        setUploadLogoUrl(blob.data.url);
                      }}
                    />
                    {uploadLogoUrl && (
                      <div className='relative inline-block'>
                        <img src={uploadLogoUrl} alt='Company Logo Preview' className='max-w-full h-auto rounded max-h-[60px]' />
                        <button type='button' onClick={handleRemoveImage} className='absolute -top-3 -right-3'>
                          <AiOutlineCloseCircle />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <ToastContainer />
            </CardBody>
            <CardFooter>
              <Button type='submit' isLoading={isLoading} color='primary'>
                Save Settings
              </Button>
            </CardFooter>
          </Card>
        </Form>
      )}
    </Formik>
  );
};

export default CompanySettings;
