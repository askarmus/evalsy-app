'use client';

import React, { useState } from 'react';
import { Button, Card, CardBody, Input, Textarea } from '@heroui/react';
import { Formik, Form } from 'formik';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import * as Yup from 'yup';
import { showToast } from '@/app/utils/toastUtils';
import { createJobApplication } from '@/services/jobApplication.service';
import { FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import FirebaseFileUploader from './FirebaseFileUploader';

import { CheckCircle } from 'lucide-react';
import ClientPortal from './ClientPortal';

const JobApplicationSchema = Yup.object().shape({
  jobId: Yup.string().required('Job ID is required'),
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  resumeUrl: Yup.string().url('Invalid resume URL').required('Resume is required'),
  coverLetter: Yup.string(),
});

const JobApplicationForm = ({ jobId, userId, onCancel }: { jobId: string; userId: string; onCancel }) => {
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
<div className="w-full flex justify-center items-center">
  <Card className="p-6 text-center" radius="lg" shadow="none">
    <CardBody className="flex flex-col items-center justify-center text-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mb-6 flex justify-center"
      >
        <div className="rounded-full bg-emerald-100 p-2">
          <FaCheckCircle className="h-10 w-10 text-emerald-600" />
        </div>
      </motion.div>

      <h2 className="text-xl font-semibold">
        Thank you for submitting your application!
      </h2>

      <p className="mt-2 text-gray-600">
        We will review it shortly and get back to you.
      </p>
    </CardBody>
  </Card>
</div>

    );
  }

  return (
    <Formik initialValues={initialValues} validationSchema={JobApplicationSchema} onSubmit={handleSubmit}>
      {({ values, handleChange, setFieldValue, errors, touched }) => (
        <Form id="jobAppForm">
          <div className="grid grid-cols-1 gap-4">
            <Input name="name" label="Name" variant="bordered" value={values.name} onChange={handleChange} isInvalid={!!errors.name && touched.name} errorMessage={errors.name} />
            <Input name="email" label="Email" variant="bordered" value={values.email} onChange={handleChange} isInvalid={!!errors.email && touched.email} errorMessage={errors.email} />
            <Textarea name="coverLetter" variant="bordered" label="Tell us why you're a good fit..." value={values.coverLetter} onChange={handleChange} />
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
          <ClientPortal>
            <div className="fixed bottom-0 left-0 right-0 z-50   bg-gray-700 dark:bg-gray-900 p-2 flex justify-end">
              <div className="mx-auto flex w-full max-w-[90rem] items-center px-5 xl:px-8 xl2:px-[60px] xl2:!pr-[60px] justify-between">
                <div>
                  <Button className="text-white font-semibold mr-5" form="jobAppForm" color="default" type="submit" radius="full" variant="bordered" size="lg" isLoading={isSubmitting}>
                    <CheckCircle className="mr-2" /> Submit Application
                  </Button>

                  <Button onPress={() => onCancel()} color="default" className="text-white underline" radius="full" type="reset" variant="light">
                    Cancel
                  </Button>
                </div>

                <img src="/final-dark.png" alt={'Logo'} className="h-8 w-auto object-contain" />
              </div>
            </div>
          </ClientPortal>
        </Form>
      )}
    </Formik>
  );
};

export default JobApplicationForm;
