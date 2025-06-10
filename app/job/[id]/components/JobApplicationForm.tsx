'use client';

import React, { useState } from 'react';
import { Button, Card, CardBody, CardFooter, CardHeader, Input, Textarea } from '@heroui/react';
import { Formik, Form } from 'formik';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import * as Yup from 'yup';
import FileUploadWithPreview from '@/components/FileUploadWithPreview';
import { showToast } from '@/app/utils/toastUtils';
import { createJobApplication } from '@/services/jobApplication.service';
import { FaBriefcase, FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import FirebaseFileUploader from './FirebaseFileUploader';

const JobApplicationSchema = Yup.object().shape({
  jobId: Yup.string().required('Job ID is required'),
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  resumeUrl: Yup.string().url('Invalid resume URL').required('Resume is required'),
  coverLetter: Yup.string(),
});

const JobApplicationForm = ({ jobId, userId }: { jobId: string; userId: string }) => {
  const [uploadResumeUrl, setUploadResumeUrl] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues = {
    jobId,
    userId,
    name: '',
    email: '',
    resumeUrl: '',
    coverLetter: '',
  };

  const handleSubmit = async (values: typeof initialValues) => {
    setIsSubmitting(true);
    try {
      await createJobApplication(values);
      showToast.success('Application submitted successfully!');
      setIsSubmitted(true);
    } catch (err) {
      showToast.error('Failed to submit application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="self-start">
        <Card className="p-2" shadow="sm" radius="sm">
          <CardBody>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }} className="mb-6 inline-flex justify-center">
              <div className="rounded-full bg-emerald-100 p-2">
                <FaCheckCircle className="h-10 w-10 text-emerald-600" />
              </div>
            </motion.div>
            <h2 className="text-xl font-semibold">Thank you for submitting your application!</h2>
            <p className="mt-2 text-gray-600">We will review it shortly and get back to you.</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <Formik initialValues={initialValues} validationSchema={JobApplicationSchema} onSubmit={handleSubmit}>
      {({ values, handleChange, setFieldValue, errors, touched }) => (
        <Form>
          <Card className="p-2" shadow="sm" radius="sm">
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
                  <div className="text-sm font-medium mb-2">
                    <label htmlFor="resume" className="text-sm font-medium mb-2">
                      Resume
                    </label>
                  </div>

                  <FirebaseFileUploader
                    onUpload={(url) => {
                      setUploadResumeUrl(url);
                      setFieldValue('resumeUrl', url);
                    }}
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
              <Button color="primary" type="submit" className="w-full" isLoading={isSubmitting}>
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
