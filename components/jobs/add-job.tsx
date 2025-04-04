"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button, Card, CardBody, CardFooter, Checkbox, Input, RadioGroup, Select, SelectItem, Tab, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tabs, Textarea } from "@heroui/react";
import { AiFillDelete } from "react-icons/ai";
import { Formik, FormikErrors } from "formik";
import { showToast } from "@/app/utils/toastUtils";
import { createJob, generateQuestions, getJobById, updateJob } from "@/services/job.service";
import { AddJobSchema } from "@/helpers/schemas";
import { Breadcrumb } from "../bread.crumb";
import { nanoid } from "nanoid";
import { useParams, useRouter } from "next/navigation";
import { NumberInput } from "@heroui/react";
import { evaluationCriteria } from "@/config/rating.config";
import { JobExpereinceLevelOption } from "./components/job.expereince.level.option";

export type Question = { id: string; text: string; expectedScore: number; isRandom: boolean };

export interface AddJobFormValues {
  jobTitle: string;
  questions: Question[];
  totalRandomQuestion: number;
  experienceLevel: string;
  description: string;
}
export interface Criteria {
  id: number;
  name: string;
  description: string;
  scoreRange: string;
}

export const AddJob = () => {
  const router = useRouter();
  const { id } = useParams() as { id: string };

  const [isGenerating, setGenerated] = useState(false);
  const formRef = useRef<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [initialValues, setInitialValues] = useState<AddJobFormValues>({
    jobTitle: "",
    totalRandomQuestion: 0,
    questions: [{ id: "shgdysg1222s", text: "Tell me about yourself and your experience", expectedScore: 20, isRandom: false }],
    experienceLevel: "",
    description: "",
  });

  const isEditMode = Boolean(id);

  useEffect(() => {
    if (isEditMode) {
      const fetchJob = async () => {
        const jobData = await getJobById(id as string);
        setInitialValues(jobData);
      };
      fetchJob();
    }
  }, [id]);

  const handleSubmit = async (values: any, { resetForm }: any) => {
    setLoading(true);
    try {
      if (!isEditMode) {
        await createJob(values);
        showToast.success("Job created successfully.");
        resetForm();
      } else {
        await updateJob(values);
        showToast.success("Job updated successfully.");
      }
      setTimeout(() => {
        router.push("/jobs/list");
      }, 4000);
    } catch (error) {
      showToast.error("Error occurred while creating a job. Please try again.");
      console.error("Error creating job:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQuestions = async (validateForm, values, setFieldValue, prompt, totalQuestions) => {
    const errors = await validateForm();

    if (!errors.title && !errors.experienceLevel) {
      setGenerated(true);

      try {
        const result = await generateQuestions({
          jobTitle: values.jobTitle,
          expertiseLevel: values.experienceLevel,
          noOfQuestions: totalQuestions, // Using total questions input
          prompt: prompt,
        });

        const newQuestions = result.data.map((text) => ({
          id: nanoid(),
          text,
        }));

        setFieldValue("questions", [...values.questions, ...newQuestions]);
        showToast.success(result.message || "Questions generated successfully");
      } catch (error: any) {
        console.error("Error generating questions:", error);
        showToast.error(error.message || "Failed to generate questions. Please try again.");
      } finally {
        setGenerated(false);
      }
    } else {
      showToast.error("Job title, and expertise level are required");
    }
  };
  const breadcrumbItems = [
    { name: "Dashboard", link: "/" },
    { name: "Job", link: "/job/list" },
    { name: !isEditMode ? "Add" : "Edit", link: "" },
  ];
  return (
    <div>
      <div className='my-10 px-4 lg:px-6 max-w-[70rem] mx-auto w-full flex flex-col gap-4'>
        <Breadcrumb items={breadcrumbItems} />

        <h3 className='text-xl font-semibold'>Add Job</h3>
        <div className='flex justify-between flex-wrap gap-4 items-center'>
          <div className='flex flex-row gap-3.5 flex-wrap'></div>
        </div>
        <div className='max-w-[70rem] mx-auto w-full'>
          <div className=' w-full flex flex-col gap-4'>
            <Formik<AddJobFormValues> innerRef={formRef} enableReinitialize={true} initialValues={initialValues} onSubmit={handleSubmit} validationSchema={AddJobSchema}>
              {({ values, errors, touched, handleChange, setFieldValue, validateForm }) => {
                // 🔍 Log validation errors and touched fields during form interaction
                console.log("Formik Errors:", errors);
                console.log("Formik Touched:", touched);

                return (
                  <Tabs aria-label='Options'>
                    <Tab key='job' title='Job'>
                      <Card shadow='sm' className='p-5'>
                        <CardBody>
                          <div className='grid grid-cols-1 gap-4'>
                            <Input label='Title' size='sm' variant='bordered' value={values.jobTitle} isInvalid={!!errors.jobTitle && !!touched.jobTitle} errorMessage={errors.jobTitle} onChange={handleChange("jobTitle")} />

                            <Textarea placeholder='Description' variant='bordered' value={values.description} isInvalid={!!errors.description && !!touched.description} errorMessage={errors.description} onChange={handleChange("description")} />

                            <div className='flex'>
                              <div className='flex-1 flex'>
                                <RadioGroup size='sm' value={values.experienceLevel} onValueChange={(value) => setFieldValue("experienceLevel", value)} orientation='horizontal' isInvalid={!!errors.experienceLevel && !!touched.experienceLevel} errorMessage={errors.experienceLevel} label='Select the experience level'>
                                  <JobExpereinceLevelOption value='beginner'>Beginner</JobExpereinceLevelOption>
                                  <JobExpereinceLevelOption value='intermediate'>Intermediate</JobExpereinceLevelOption>
                                  <JobExpereinceLevelOption value='senior'>Senior</JobExpereinceLevelOption>
                                  <JobExpereinceLevelOption value='expert'>Expert</JobExpereinceLevelOption>
                                </RadioGroup>
                              </div>
                            </div>

                            <div className='flex gap-4'>
                              <div className='flex-1 flex'>
                                <Textarea size='sm' placeholder='Prompt' minRows={1} disableAutosize value={prompt} onChange={(e) => setPrompt(e.target.value)} classNames={{ base: "w-full", input: "resize-y min-h-[20px]" }} />
                              </div>

                              <div className='flex items-center justify-center gap-4'>
                                <Input size='sm' placeholder='Total' type='number' min='1' defaultValue={totalQuestions.toString()} onChange={(e) => setTotalQuestions(Number(e.target.value))} className='max-w-[60px]' />

                                <Button
                                  color='danger'
                                  size='sm'
                                  isLoading={isGenerating}
                                  onPress={async () => {
                                    handleGenerateQuestions(validateForm, values, setFieldValue, prompt, totalQuestions);
                                  }}>
                                  AI Generate
                                </Button>
                              </div>
                            </div>

                            <div className='flex w-full flex-wrap md:flex-nowrap gap-4'>
                              <Table aria-label='Example static collection table'>
                                <TableHeader>
                                  <TableColumn width={5}>#</TableColumn>
                                  <TableColumn>QUESTIONS</TableColumn>
                                  <TableColumn width={30}>RANDOMIZE</TableColumn>
                                  <TableColumn width={100}>MINIMUM SCORE</TableColumn>
                                  <TableColumn width={30} align='end'>
                                    <Button color='primary' variant='faded' size='sm' onPress={() => setFieldValue("questions", [...values.questions, { id: nanoid(), text: "", isRandom: false, expectedScore: 20 }])}>
                                      Add
                                    </Button>
                                  </TableColumn>
                                </TableHeader>
                                <TableBody>
                                  {values.questions.map((question, index) => (
                                    <TableRow key={question.id}>
                                      <TableCell>{index + 1}</TableCell>
                                      <TableCell>
                                        <Textarea disableAnimation disableAutosize classNames={{ base: "w-full", input: "resize-y min-h-[20px]" }} variant='bordered' value={question.text} isInvalid={!!(errors.questions?.[index] as FormikErrors<Question>)?.text && touched.questions?.[index]?.text} errorMessage={(errors.questions?.[index] as FormikErrors<Question>)?.text || ""} onChange={(e) => setFieldValue(`questions[${index}].text`, e.target.value)} />
                                      </TableCell>
                                      <TableCell>
                                        <Checkbox isSelected={question.isRandom} onChange={(e) => setFieldValue(`questions[${index}].isRandom`, e.target.checked)} size='sm'>
                                          {question.isRandom ? "Yes" : "No"}
                                        </Checkbox>
                                      </TableCell>
                                      <TableCell>
                                        <Select defaultSelectedKeys={["2"]} onChange={(e) => setFieldValue(`questions[${index}].expectedScore`, e.target.value)}>
                                          <SelectItem key={1}>15/30</SelectItem>
                                          <SelectItem key={2}>25/30</SelectItem>
                                          <SelectItem key={3}>30/30</SelectItem>
                                        </Select>
                                      </TableCell>
                                      <TableCell align='right'>
                                        <Button
                                          isIconOnly
                                          aria-label='Remove question'
                                          color='warning'
                                          size='sm'
                                          variant='faded'
                                          onPress={() =>
                                            setFieldValue(
                                              "questions",
                                              values.questions.filter((q) => q.id !== question.id)
                                            )
                                          }>
                                          <AiFillDelete />
                                        </Button>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>

                            <NumberInput label='Total Random Question' isRequired className='max-w-xs' value={values.totalRandomQuestion} onValueChange={(value) => setFieldValue("totalRandomQuestion", value)} isInvalid={!!errors.totalRandomQuestion && !!touched.totalRandomQuestion} errorMessage={errors.totalRandomQuestion} />
                          </div>
                        </CardBody>
                        <CardFooter>
                          <div className='flex gap-2'>
                            <Button
                              type='submit'
                              color='primary'
                              isLoading={loading}
                              onPress={() => {
                                formRef.current?.handleSubmit();
                              }}>
                              Submit
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    </Tab>

                    <Tab key='criteria' title='Evaluation Criteria'>
                      <p className='text-sm mb-5'>For each question, score the candidate’s response based on key factors:</p>
                      <Table aria-label='Analysis Criteria Table mb-5'>
                        <TableHeader>
                          <TableColumn>Criteria</TableColumn>
                          <TableColumn>Description</TableColumn>
                          <TableColumn>Score Range</TableColumn>
                        </TableHeader>
                        <TableBody>
                          {evaluationCriteria.map((criterion) => (
                            <TableRow key={criterion.id}>
                              <TableCell>{criterion.name}</TableCell>
                              <TableCell>{criterion.description}</TableCell>
                              <TableCell>{criterion.scoreRange}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Tab>
                  </Tabs>
                );
              }}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};
