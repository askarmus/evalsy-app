"use client";
import React, { useEffect, useRef, useState } from "react";
import { Accordion, AccordionItem, Button, Card, CardBody, CardFooter, Checkbox, Divider, Input, Pagination, Select, SelectItem, Textarea, useDisclosure } from "@heroui/react";
import { Formik, FormikErrors } from "formik";
import { showToast } from "@/app/utils/toastUtils";
import { createJob, getJobById, updateJob } from "@/services/job.service";
import { AddJobSchema } from "@/helpers/schemas";
import { Breadcrumb } from "../bread.crumb";
import { nanoid } from "nanoid";
import { useParams, useRouter } from "next/navigation";
import { NumberInput } from "@heroui/react";
import { GenerateQuestionsDrawer } from "./components/add/GenerateQuestionsDrawer";
import { QuestionSearchAndFilter } from "./components/add/QuestionSearchAndFilter";
import { QuestionHeaderActions } from "./components/add/QuestionHeaderActions";
import { AddJobFormValues, Question } from "./types";
import { CodingQuestionOptions } from "./components/add/CodingQuestionOptions";
import { QuestionAccordionTitle } from "./components/add/QuestionAccordionTitle";
import RichTextEditor from "../shared/RichTextEditor";

export const AddJob = () => {
  const router = useRouter();
  const { id } = useParams() as { id: string };

  const formRef = useRef<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [totalQuestions, setTotalQuestions] = useState(5);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState<"all" | "verbal" | "coding">("all");

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [initialValues, setInitialValues] = useState<AddJobFormValues>({
    jobTitle: "",
    totalRandomVerbalQuestion: 0,
    totalRandomCodingQuestion: 0,
    questions: [{ id: "shgdysg1222s", text: "Tell me about yourself and your experience", expectedScore: 20, isRandom: false, type: "verbal", timeLimit: 0, language: "", explanation: "", starterCode: "" }],
    experienceLevel: "beginner",
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

  const touchAllFields = async () => {
    if (formRef.current) {
      await formRef.current.setTouched(
        {
          jobTitle: true,
          description: true,
          experienceLevel: true,
          totalRandomVerbalQuestion: true,
          totalRandomCodingQuestion: true,
          questions: formRef.current.values.questions.map(() => ({
            text: true,
            expectedScore: true,
            isRandom: true,
            type: true,
            timeLimit: true,
            language: true,
          })),
        },
        true
      );
    }
  };

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
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbItems = [
    { name: "Dashboard", link: "/" },
    { name: "Job", link: "/job/list" },
    { name: !isEditMode ? "Add" : "Edit", link: "" },
  ];

  return (
    <div>
      <div className='my-10 px-4 lg:px-6 max-w-[82rem] mx-auto w-full flex flex-col gap-4'>
        <Breadcrumb items={breadcrumbItems} />
        <h3 className='text-xl font-semibold'>Add Interview</h3>

        <div className='  mx-auto w-full'>
          <div className=' w-full flex flex-col gap-4'>
            <Formik<AddJobFormValues> innerRef={formRef} enableReinitialize={true} initialValues={initialValues} onSubmit={handleSubmit} validationSchema={AddJobSchema}>
              {({ values, errors, touched, handleChange, setFieldValue, validateForm }) => {
                console.log("Formik Errors:", errors);
                console.log("Formik Touched:", touched);

                const filteredQuestions = values.questions.filter((q) => q.text.toLowerCase().includes(searchTerm.toLowerCase())).filter((q) => selectedTab === "all" || q.type === selectedTab);
                const paginatedQuestions = filteredQuestions.slice((page - 1) * pageSize, page * pageSize);
                const startIndex = (page - 1) * pageSize;

                return (
                  <Card className='p-3'>
                    <CardBody>
                      <div className='grid grid-cols-1 gap-4'>
                        <h1 className='font-semibold'> Interview Details</h1>
                        <div className='flex flex-wraps gap-3 '>
                          <Input label='Title' size='lg' radius='sm' variant='bordered' value={values.jobTitle} isInvalid={!!errors.jobTitle && !!touched.jobTitle} errorMessage={errors.jobTitle} onChange={handleChange("jobTitle")} />
                          <Accordion
                            variant='splitted'
                            className='px-0'
                            itemClasses={{
                              base: "rounded-lg pb-1 shadow-sm border-default-200 border-medium", // Custom border radius and shadow for each item
                            }}>
                            <AccordionItem title='Key Responsibilities'>
                              <Textarea placeholder='Description' variant='bordered' value={values.description} isInvalid={!!errors.description && !!touched.description} errorMessage={errors.description} onChange={handleChange("description")} />
                            </AccordionItem>
                          </Accordion>
                        </div>

                        <QuestionSearchAndFilter
                          searchTerm={searchTerm}
                          setSearchTerm={setSearchTerm}
                          selectedTab={selectedTab}
                          setSelectedTab={setSelectedTab}
                          questionsCount={{
                            all: values.questions.length,
                            verbal: values.questions.filter((j: any) => j?.type === "verbal").length,
                            coding: values.questions.filter((j: any) => j?.type === "coding").length,
                          }}
                        />

                        <QuestionHeaderActions questionCount={filteredQuestions.length} onGenerateAI={onOpen} onAddManual={() => setFieldValue("questions", [{ id: nanoid(), text: "", isRandom: true, expectedScore: 20, type: "verbal", timeLimit: 0, language: "" }, ...values.questions])} />

                        <div className='flex w-full flex-wrap md:flex-nowrap gap-4'>
                          <Accordion
                            variant='splitted'
                            className='px-0 w-full'
                            itemClasses={{
                              base: "rounded-lg shadow-sm border-default-200 border-medium",
                              trigger: "py-2",
                            }}>
                            {paginatedQuestions.map((question, index) => {
                              const hasError = !!(errors.questions?.[index] as FormikErrors<Question>)?.text || !!(errors.questions?.[index] as FormikErrors<Question>)?.timeLimit || !!(errors.questions?.[index] as FormikErrors<Question>)?.language;

                              return (
                                <AccordionItem
                                  key={index}
                                  className={`m-0 rounded-md ${hasError ? "border-2 border-red-500 bg-red-50" : "border-2 border-default-200"}`}
                                  title={
                                    <QuestionAccordionTitle
                                      index={index}
                                      startIndex={startIndex}
                                      question={question}
                                      onDelete={(id) =>
                                        setFieldValue(
                                          "questions",
                                          values.questions.filter((q) => q.id !== id)
                                        )
                                      }
                                    />
                                  }>
                                  <Card shadow='sm' radius='sm'>
                                    <CardBody className='p-4'>
                                      <div className='space-y-4'>
                                        <div className='flex flex-wrap gap-6 items-center'>
                                          <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-1'>Question Type</label>
                                            <div className='relative'>
                                              <Select
                                                aria-label='Question Type'
                                                className='w-48'
                                                selectedKeys={[question.type]}
                                                onChange={(e) => {
                                                  const newType = e.target.value;
                                                  setFieldValue(`questions[${index}].type`, newType);
                                                  if (newType !== "coding") {
                                                    setFieldValue(`questions[${index}].timeLimit`, undefined);
                                                    setFieldValue(`questions[${index}].language`, undefined);
                                                  }
                                                }}
                                                size='sm'>
                                                <SelectItem key='verbal'>Verbal</SelectItem>
                                                <SelectItem key='coding'>Coding</SelectItem>
                                              </Select>
                                            </div>
                                          </div>

                                          <div>
                                            <div>
                                              <label className='block text-sm font-medium text-gray-700 mb-1'>Question Type</label>
                                              <div className='relative'>
                                                <Checkbox isSelected={question.isRandom} onChange={(e) => setFieldValue(`questions[${index}].isRandom`, e.target.checked)} size='sm'>
                                                  {question.isRandom ? "Yes" : "No"}
                                                </Checkbox>
                                              </div>
                                            </div>
                                          </div>
                                        </div>

                                        <div>
                                          <label className='block text-sm font-medium text-gray-700 mb-1'>Question</label>
                                          <div className='relative'>
                                            <Textarea classNames={{ base: "w-full", input: "resize-y min-h-[20px]" }} variant='bordered' value={question.text} isInvalid={!!(errors.questions?.[index] as FormikErrors<Question>)?.text && touched.questions?.[index]?.text} errorMessage={(errors.questions?.[index] as FormikErrors<Question>)?.text || ""} onChange={(e) => setFieldValue(`questions[${index}].text`, e.target.value)} />
                                          </div>
                                        </div>
                                        <div>
                                          <label className='block text-sm font-medium text-gray-700 mb-1'>Explanation</label>
                                          <div className='relative'>
                                            <RichTextEditor value={question.explanation || ""} onChange={(newVal) => setFieldValue(`questions[${startIndex + index}].explanation`, newVal)} />
                                          </div>
                                        </div>

                                        {question.type == "coding" && <CodingQuestionOptions index={index} question={question} errors={errors} touched={touched} setFieldValue={setFieldValue} values={values} />}
                                      </div>
                                    </CardBody>
                                  </Card>
                                </AccordionItem>
                              );
                            })}
                          </Accordion>
                        </div>
                        <div className='flex flex-wrap gap-3 mb-4 mt-2'>
                          <NumberInput size='sm' variant='bordered' label='Total Random Verbal Question' isRequired className='max-w-xs' value={values.totalRandomVerbalQuestion} onValueChange={(value) => setFieldValue("totalRandomVerbalQuestion", value)} isInvalid={!!errors.totalRandomVerbalQuestion && !!touched.totalRandomVerbalQuestion} errorMessage={errors.totalRandomVerbalQuestion} />
                          <NumberInput size='sm' variant='bordered' label='Total Random Coding Question' isRequired className='max-w-xs' value={values.totalRandomCodingQuestion} onValueChange={(value) => setFieldValue("totalRandomCodingQuestion", value)} isInvalid={!!errors.totalRandomCodingQuestion && !!touched.totalRandomCodingQuestion} errorMessage={errors.totalRandomCodingQuestion} />
                        </div>
                        <Divider />

                        <div className='flex justify-center mt-2'>
                          <Pagination total={Math.ceil(filteredQuestions.length / pageSize)} initialPage={1} page={page} onChange={setPage} size='sm' variant='faded' color='primary' />
                        </div>
                      </div>
                    </CardBody>
                    <CardFooter>
                      <div className='flex justify-end w-full'>
                        <Button
                          type='submit'
                          color='primary'
                          isLoading={loading}
                          onPress={async () => {
                            await touchAllFields();
                            formRef.current.handleSubmit();
                          }}>
                          Save Changes
                        </Button>
                        <GenerateQuestionsDrawer isOpen={isOpen} onOpenChange={onOpenChange} prompt={prompt} setPrompt={setPrompt} totalQuestions={totalQuestions} setTotalQuestions={setTotalQuestions} />
                      </div>
                    </CardFooter>
                  </Card>
                );
              }}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};
