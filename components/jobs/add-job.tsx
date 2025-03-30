"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button, Card, CardBody, CardFooter, Input, Radio, RadioGroup, Select, SelectItem, Tab, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tabs, Textarea } from "@heroui/react";
import { AiFillDelete } from "react-icons/ai";
import { Formik, FormikErrors } from "formik";
import { showToast } from "@/app/utils/toastUtils";
import { createJob, generateQuestions, getJobById, updateJob } from "@/services/job.service";
import { AddJobSchema } from "@/helpers/schemas";
import { Breadcrumb } from "../bread.crumb";
import { nanoid } from "nanoid";
import { useParams, useRouter } from "next/navigation";

export type Question = { id: string; text: string; expectedScore: number };

export interface AddJobFormValues {
  jobTitle: string;
  questions: Question[];
  experienceLevel: string;
}
export interface Criteria {
  id: number;
  name: string;
  description: string;
  scoreRange: string;
}

export const CustomRadio = (props) => {
  const { children, ...otherProps } = props;

  return (
    <Radio
      {...otherProps}
      classNames={{
        base: "inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between flex-row-reverse max-w-[300px] cursor-pointer border-2 border-default rounded-lg gap-2 p-2 data-[selected=true]:border-primary",
      }}>
      {children}
    </Radio>
  );
};

export const AddJob = () => {
  const router = useRouter();
  const { id } = useParams();

  const [isGenerating, setGenerated] = useState(false);
  const formRef = useRef<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [initialValues, setInitialValues] = useState<AddJobFormValues>({
    jobTitle: "",
    questions: [{ id: "shgdysg1222s", text: "", expectedScore: 20 }],
    experienceLevel: "",
  });

  const evaluationCriteria = [
    { id: 1, name: "Relevance", description: "Does the answer correctly address the question?", scoreRange: "1-5" },
    { id: 2, name: "Completeness", description: "Is the response well-explained and detailed?	", scoreRange: "1-5" },
    { id: 3, name: "Clarity", description: "Is the answer structured and easy to understand?	", scoreRange: "1-5" },
    { id: 4, name: "Grammar & Language", description: "Is the language correct, with no major mistakes?	", scoreRange: "1-5" },
    { id: 5, name: "Technical Accuracy", description: "Is the answer factually correct?	", scoreRange: "1-5" },
  ];

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
    } catch {
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
              {({ values, errors, touched, handleChange, setFieldValue, validateForm }) => (
                <Tabs aria-label='Options'>
                  <Tab key='job' title='Job'>
                    <Card shadow='sm' className='p-5'>
                      <CardBody>
                        <div className='grid grid-cols-1 gap-4'>
                          <Input label='Title' variant='bordered' value={values.jobTitle} isInvalid={!!errors.jobTitle && !!touched.jobTitle} errorMessage={errors.jobTitle} onChange={handleChange("jobTitle")} />

                          <div className='flex'>
                            <div className='flex-1 flex'>
                              <RadioGroup size='sm' value={values.experienceLevel} onValueChange={(value) => setFieldValue("experienceLevel", value)} orientation='horizontal' isInvalid={!!errors.experienceLevel && !!touched.experienceLevel} errorMessage={errors.experienceLevel} label='Generate question using AI'>
                                <CustomRadio value='beginner'>Beginner</CustomRadio>
                                <CustomRadio value='intermediate'>Intermediate</CustomRadio>
                                <CustomRadio value='senior'>Senior</CustomRadio>
                                <CustomRadio value='expert'>Expert</CustomRadio>
                              </RadioGroup>
                            </div>
                          </div>
                          <div className='flex gap-4'>
                            <div className='flex-1 flex'>
                              <Textarea
                                placeholder='Prompt'
                                minRows={1}
                                disableAutosize
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                classNames={{
                                  base: "w-full",
                                  input: "resize-y min-h-[20px]",
                                }}
                              />
                            </div>

                            <div className='flex items-center justify-center  gap-4'>
                              <Input placeholder='Total' type='number' min='1' defaultValue={totalQuestions.toString()} onChange={(e) => setTotalQuestions(Number(e.target.value))} className='max-w-[60px]' />

                              <Button
                                color='danger'
                                isLoading={isGenerating}
                                variant='flat'
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
                                <TableColumn width={100}>SCORE RANGES</TableColumn>
                                <TableColumn width={30} align='end'>
                                  <Button color='primary' variant='faded' size='sm' onPress={() => setFieldValue("questions", [...values.questions, { id: nanoid(), text: "" }])}>
                                    Add
                                  </Button>
                                </TableColumn>
                              </TableHeader>
                              <TableBody>
                                {values.questions.map((question, index) => (
                                  <TableRow key={question.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>
                                      <Textarea
                                        disableAnimation
                                        disableAutosize
                                        classNames={{
                                          base: "w-full",
                                          input: "resize-y min-h-[20px]",
                                        }}
                                        variant='bordered'
                                        value={question.text}
                                        isInvalid={!!(errors.questions?.[index] as FormikErrors<Question>)?.text && touched.questions?.[index]?.text}
                                        errorMessage={(errors.questions?.[index] as FormikErrors<Question>)?.text || ""}
                                        onChange={(e) => setFieldValue(`questions[${index}].text`, e.target.value)}
                                      />
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
                            Subbmit
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
                        {evaluationCriteria.map((criterion, index) => (
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
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};
