'use client';
import React, { useEffect, useState } from 'react';
import { Button, CardFooter, Input, Textarea, Tabs, Tab, Card, CardBody, CardHeader } from '@heroui/react';
import { Formik, Form } from 'formik';
import { showToast } from '@/app/utils/toastUtils';
import { getCompanySettings, saveCompanySettings } from '@/services/company.service';
import FileUploadWithPreview from '@/components/FileUploadWithPreview';
import { CompanySettingsSchema } from '@/helpers/schemas';

import { AiOutlineCloseCircle } from 'react-icons/ai';
import { Building, Building2, Inbox, LayoutTemplate, Save, Upload } from 'lucide-react';
import EmailInputList from './components/EmailInputList';

export type CompanySettingsFormValues = {
  name: string;
  address?: string;
  invitationTemplate?: string;
  about?: string;
  website?: string;
  linkedin?: string;
  facebook?: string;
  twitter?: string;
  logo?: string;
  phone?: string;
  supportName?: string;
  supportEmail?: string;
  applicationReceiveEmail: string[];
};

const CompanySettings = () => {
  const [uploadLogoUrl, setUploadLogoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [initialValues, setInitialValues] = useState<CompanySettingsFormValues>({
    name: '',
    address: '',
    about: '',
    website: '',
    linkedin: '',
    facebook: '',
    twitter: '',
    logo: '',
    phone: '',
    supportName: '',
    supportEmail: '',
    invitationTemplate: `
    You're invited to the Initial interviews for the <position> role at <company>.
    `,
    applicationReceiveEmail: [],
  });

  const handleRemoveImage = () => {
    setUploadLogoUrl('');
    setInitialValues((prevValues) => ({ ...prevValues, logo: '' }));
  };

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
      showToast.success('Company settings updated successfully!');
    } catch (error) {
      console.error('Error updating company settings: ', error);
      showToast.error('Failed to update company settings.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Formik enableReinitialize initialValues={initialValues} validationSchema={CompanySettingsSchema} onSubmit={handleSubmit}>
      {({ values, errors, touched, setFieldValue, handleChange }) => (
        <Form>
          <Tabs aria-label="Settings">
            <Tab key="company" title="Company">
              <Card className="p-0">
                <CardBody className="p-4">
                  <div className="mb-6 flex items-center gap-[5px] mb-3 md:mb-4 ">
                    <Building className="w-5 h-5 text-xl text-secondary-400" />
                    <h1 className=" text-xl/[24px] font-semibold text-tertiary  md:text-[20px]/[24px]">Company Setting</h1>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-4/5">
                      <div className="grid grid-cols-1 gap-4">
                        <Input variant="bordered" size="sm" label="Company Name" name="name" value={values.name || ''} onChange={handleChange} isInvalid={!!errors.name && !!touched.name} errorMessage={errors.name} />
                        <Textarea variant="bordered" size="sm" minRows={1} label="Address" name="address" value={values.address || ''} onChange={handleChange} isInvalid={!!errors.address && !!touched.address} errorMessage={errors.address} />
                        <Textarea variant="bordered" size="sm" label="About Company" name="about" value={values.about || ''} onChange={handleChange} />

                        <div className="grid grid-cols-2 gap-4">
                          <Input variant="bordered" size="sm" label="Website" name="website" value={values.website || ''} onChange={handleChange} isInvalid={!!errors.website && !!touched.website} errorMessage={errors.website} />
                          <Input variant="bordered" size="sm" label="LinkedIn" name="linkedin" value={values.linkedin || ''} onChange={handleChange} isInvalid={!!errors.linkedin && !!touched.linkedin} errorMessage={errors.linkedin} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <Input variant="bordered" size="sm" label="Facebook" name="facebook" value={values.facebook || ''} onChange={handleChange} isInvalid={!!errors.facebook && !!touched.facebook} errorMessage={errors.facebook} />
                          <Input label="Twitter" name="twitter" value={values.twitter || ''} onChange={handleChange} isInvalid={!!errors.twitter && !!touched.twitter} errorMessage={errors.twitter} />
                        </div>
                        <Input variant="bordered" size="sm" label="Support Phone" name="phone" value={values.phone || ''} onChange={handleChange} isInvalid={!!errors.phone && !!touched.phone} errorMessage={errors.phone} />
                        <Input variant="bordered" size="sm" label="Supporter Name" name="supportName" value={values.supportName || ''} onChange={handleChange} isInvalid={!!errors.supportName && !!touched.supportName} errorMessage={errors.supportName} />
                        <Input variant="bordered" size="sm" label="Support Email" name="supportEmail" value={values.supportEmail || ''} onChange={handleChange} isInvalid={!!errors.supportEmail && !!touched.supportEmail} errorMessage={errors.supportEmail} />
                      </div>
                    </div>
                    <div className="w-1/5">
                      <div className="lg:col-span-1">
                        <Card>
                          <CardHeader>Company Logo</CardHeader>
                          <CardBody>
                            <div className="space-y-4">
                              <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-secondary-200 rounded-lg bg-secondary-50">
                                <div className="text-center">
                                  {uploadLogoUrl && (
                                    <div className="relative inline-block">
                                      <img src={uploadLogoUrl} alt="Company Logo Preview" className="max-w-full h-auto rounded max-w-[80px]" />
                                      <button type="button" onClick={handleRemoveImage} className="absolute -top-3 -right-3">
                                        <AiOutlineCloseCircle />
                                      </button>
                                    </div>
                                  )}
                                  <p className="text-sm text-gray-500">Current Logo</p>
                                </div>
                              </div>

                              <FileUploadWithPreview
                                onUpload={(data) => {
                                  setFieldValue('logo', data.url);
                                  setUploadLogoUrl(data.url);
                                }}
                              />
                              <p className="text-xs text-gray-500 text-center">Supports: JPG, PNG, SVG (Max 2MB)</p>
                            </div>
                          </CardBody>
                        </Card>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Tab>
            <Tab key="template" title="Template">
              <Card>
                <CardBody className="p-4">
                  <div className="mb-6 flex items-center gap-[5px] mb-3 md:mb-4 ">
                    <LayoutTemplate className="w-5 h-5 text-xl text-secondary-400" />
                    <h1 className=" text-xl/[24px] font-semibold text-tertiary  md:text-[20px]/[24px]">Invitation Template</h1>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-4/5">
                      <div className="grid grid-cols-1 gap-4">
                        <Textarea variant="bordered" size="sm" rows={100} label="Invitation Template" name="invitationTemplate" value={values.invitationTemplate || ''} onChange={handleChange} isInvalid={!!errors.invitationTemplate && !!touched.invitationTemplate} errorMessage={errors.invitationTemplate} />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        <strong>Instruction:</strong> Please keep the placeholders <code>&lt;position&gt;</code> and <code>&lt;company&gt;</code> exactly as shown. They will be automatically replaced with the real job title and company name when sending the invitation.
                        <br />
                        <span className="block mt-1 text-gray-400">Example: You&apos;re invited to the Initial interviews for the &lt;position&gt; role at &lt;company&gt;.</span>
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Tab>
            <Tab key="app_emails" title="Application Email">
              <Card>
                <CardBody className="p-4">
                  <div className="mb-6 flex items-center gap-[5px] mb-3 md:mb-4 ">
                    <Inbox className="w-5 h-5 text-xl text-secondary-400" />
                    <h1 className=" text-xl/[24px] font-semibold text-tertiary  md:text-[20px]/[24px]">HR Application Inbox</h1>
                  </div>
                  <EmailInputList value={values.applicationReceiveEmail} onChange={(list) => setFieldValue('applicationReceiveEmail', list)} />
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
          <div>
            <Button type="submit" startContent={<Save />} isLoading={isLoading} color="secondary" variant="flat" radius="full">
              Save Settings
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default CompanySettings;
