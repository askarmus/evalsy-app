'use client';

import React, { useState } from 'react';
import { Button, Card, CardBody, CardFooter, CardHeader, cn, Input, Textarea } from '@heroui/react';
import { Formik, Form } from 'formik';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import * as Yup from 'yup';
import FileUploadWithPreview from '@/components/FileUploadWithPreview';
import { showToast } from '@/app/utils/toastUtils';
import { createJobApplication } from '@/services/jobApplication.service';
import { FaBriefcase, FaUpload } from 'react-icons/fa';

const JobApplicationSchema = Yup.object().shape({
  jobId: Yup.string().required('Job ID is required'),
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  resumeUrl: Yup.string().url('Invalid resume URL').required('Resume is required'),
  coverLetter: Yup.string(),
});

const JobApplicationForm = ({ jobId }: { jobId: string }) => {
  const [uploadResumeUrl, setUploadResumeUrl] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const initialValues = {
    jobId,
    name: '',
    email: '',
    resumeUrl: '',
    coverLetter: '',
  };

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      await createJobApplication(values);
      showToast.success('Application submitted successfully!');
      setIsSubmitted(true);
    } catch (err) {
      showToast.error('Failed to submit application.');
    }
  };

  if (isSubmitted) {
    return (
      <Card shadow="none">
        <CardBody>
          <h2 className="text-xl font-semibold">Thank you for submitting your application!</h2>
          <p className="mt-2 text-gray-600">We will review it shortly and get back to you.</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Formik initialValues={initialValues} validationSchema={JobApplicationSchema} onSubmit={handleSubmit}>
      {({ values, handleChange, setFieldValue, errors, touched }) => (
        <Form>
          <Card className="p-0" shadow="none">
            <CardHeader className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold">Apply for Job</h2>
              <span className="text-sm text-slate-500">Fill out the form below to apply</span>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 gap-4">
                <Input name="name" label="Name" value={values.name} onChange={handleChange} isInvalid={!!errors.name && touched.name} errorMessage={errors.name} />
                <Input name="email" label="Email" value={values.email} onChange={handleChange} isInvalid={!!errors.email && touched.email} errorMessage={errors.email} />
                <Textarea name="coverLetter" label="Tell us why you're a good fit..." value={values.coverLetter} onChange={handleChange} />
                <div className=" ">
                  <label htmlFor="resume" className="text-sm font-medium mb-2">
                    Resume
                  </label>
                  <FileUploadWithPreview
                    onUpload={(fileUrl) => setUploadResumeUrl(fileUrl.url)}
                    acceptedFileTypes={{
                      'application/pdf': [],
                      'application/msword': [], // .doc
                      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [], // .docx
                    }}
                    browseText="Upload your resume (PDF, DOC, DOCX)"
                  />

                  {uploadResumeUrl && (
                    <div className="relative w-full border border-gray-300 rounded-lg p-4 bg-gray-50 mt-2">
                      <div className="flex justify-between items-center">
                        <a href={uploadResumeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-medium hover:underline truncate">
                          View Resume
                        </a>
                        <button
                          type="button"
                          onClick={() => {
                            setUploadResumeUrl('');
                            setFieldValue('resumeUrl', '');
                          }}
                          className="text-red-500 hover:text-red-700 text-xl"
                          title="Remove"
                        >
                          <AiOutlineCloseCircle />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                {errors.resumeUrl && touched.resumeUrl && <p className="text-sm text-red-500">{errors.resumeUrl}</p>}
              </div>
            </CardBody>
            <CardFooter>
              <Button color="primary" type="submit" className="w-full">
                <FaBriefcase className="mr-2 h-4 w-4" /> Submit Application
              </Button>
            </CardFooter>
          </Card>
        </Form>
      )}
    </Formik>
  );
};

export default JobApplicationForm;
