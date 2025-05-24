'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, CardBody, Input, Pagination, NumberInput, Chip, Tooltip, Select, SelectItem, Textarea } from '@heroui/react';
import { Formik, FormikHelpers } from 'formik';
import { showToast } from '@/app/utils/toastUtils';
import { createJob, generateJobDescriptionFromAI, getJobById, updateJob } from '@/services/job.service';
import { AddJobSchema } from '@/helpers/schemas';
import { useParams, useRouter } from 'next/navigation';
import { QuestionEditDrawer } from './components/add/QuestionEditDrawer';
import { AddJobFormValues, Question } from './types';
import { QuestionSearchAndFilter } from './components/add/QuestionSearchAndFilter';
import { GenerateQuestionsDrawer } from './components/add/GenerateQuestionsDrawer';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import { QuestionHeaderActions } from './components/add/QuestionHeaderActions';
import RichTextEditor from '../shared/RichTextEditor';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FaBriefcase, FaCogs, FaGripVertical, FaQuestionCircle, FaShieldAlt } from 'react-icons/fa';
import { FraudDetectionSettings } from './components/add/FraudDetectionSettings';
import { VerticalStepper } from './components/add/VerticalStepper';
import { StepperHeader } from './components/add/StepperHeader';
import { defaultJobFormValues } from './helpers/formDefaults';

export const AddJob = () => {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const formRef = useRef<any>(null);
  const sensors = useSensors(useSensor(PointerSensor));

  const [loading, setLoading] = useState(false);
  const [isQuestionDrawerOpen, setQuestionDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'add' | 'edit'>('add');
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);
  const [isGenerateDrawerOpen, setGenerateDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState<'all' | 'verbal'>('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState('1000');
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [invalidSteps, setInvalidSteps] = useState<number[]>([]);

  const stepsData = [
    {
      icon: <FaBriefcase className="w-5 h-5 text-xl text-primary-300" />,
      title: 'Job Info',
      description: 'Overview of job roles and responsibilities',
    },
    {
      icon: <FaQuestionCircle className="w-5 h-5 text-xl text-primary-300" />,
      title: 'Questions',
      description: 'Common questions related to job applications',
    },
    {
      icon: <FaCogs className="w-5 h-5 text-xl text-primary-300" />,
      title: 'Random Settings',
      description: 'Miscellaneous configurations and settings',
    },
    {
      icon: <FaShieldAlt className="w-5 h-5 text-xl text-primary-300" />,
      title: 'Fraud Detection',
      description: 'Monitor and prevent fraudulent activities',
    },
  ];

  const [initialValues, setInitialValues] = useState<AddJobFormValues>(defaultJobFormValues);

  const isEditMode = Boolean(id);
  useEffect(() => {
    if (isEditMode) {
      const fetchJob = async () => {
        const jobData = await getJobById(id);
        setInitialValues(jobData);
        setFormReady(true); // ✅ now validation can be trusted
      };
      fetchJob();
    }
  }, [id]);

  const [formReady, setFormReady] = useState(!isEditMode);

  useEffect(() => {
    if (isEditMode) {
      const fetchJob = async () => {
        const jobData = await getJobById(id);
        setInitialValues(jobData);
        setFormReady(true);

        // ✅ Validate all steps once form is ready
        try {
          await AddJobSchema.validate(jobData, { abortEarly: false });
          setCompletedSteps(stepsData.map((_, index) => index)); // all steps passed
        } catch {
          // do nothing — user will need to fix form
        }
      };
      fetchJob();
    }
  }, [id]);

  const handleGenerateJobDescription = async (values: AddJobFormValues, setFieldValue: FormikHelpers<AddJobFormValues>['setFieldValue'], setLoading: (loading: boolean) => void) => {
    try {
      setLoading(true);
      const jobDescription = await generateJobDescriptionFromAI({
        jobTitle: values.jobTitle,
        focusPrompt: values.prompt,
      });
      setFieldValue('description', jobDescription);
      showToast.success('Job description generated!');
    } catch (err) {
      showToast.error('Failed to generate job description.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: AddJobFormValues, { resetForm }: FormikHelpers<AddJobFormValues>) => {
    setLoading(true);
    try {
      if (!isEditMode) {
        await createJob(values);
        showToast.success('Job created successfully.');
        resetForm();
      } else {
        await updateJob(values);
        showToast.success('Job updated successfully.');
      }
      setTimeout(() => router.push('/interviews/list'), 3000);
    } catch (error) {
      showToast.error('Error occurred while saving the job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const pageSizes = [5, 10, 20, 30, 40, 50, 60, 70];

  const SortableQuestionItem = ({ question, index, handleEditQuestion, handleDeleteQuestion }: { question: Question; index: number; handleEditQuestion: (id: string) => void; handleDeleteQuestion: (id: string) => void }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: question.id });
    const style = { transform: CSS.Transform.toString(transform), transition };

    return (
      <div ref={setNodeRef} {...attributes} style={style} className="flex items-center justify-between p-2 border-2 rounded-xl border-gray-300 dark:border-gray-600">
        <div className="flex items-center text-base min-w-0">
          <span {...listeners} className="mr-2 cursor-grab  hover:text-gray-800">
            <FaGripVertical />
          </span>
          <span className="flex items-center justify-center bg-gray-900 text-primary-foreground rounded-full w-7 h-7 mr-3 text-sm font-medium">{index + 1}</span>
          <span className="truncate font-semibold max-w-[200px] md:max-w-[400px]">{question.text.length > 80 ? `${question.text.substring(0, 80)}...` : question.text || 'New Question'}</span>
        </div>
        <div className="flex items-center gap-2 ml-4 shrink-0">
          <Tooltip content="Edit question">
            <button aria-label="Edit" onClick={() => handleEditQuestion(question.id)} className="p-1 text-gray-600 hover:text-black rounded-full dark:text-gray-300 dark:hover:text-white">
              <AiOutlineEdit className="h-5 w-5" />
            </button>
          </Tooltip>
          <Tooltip content="Remove question">
            <button aria-label="Delete" onClick={() => handleDeleteQuestion(question.id)} className="p-1 text-gray-600 hover:text-black rounded-full dark:text-gray-300 dark:hover:text-white">
              <AiOutlineDelete className="h-5 w-5 text-red-400" />
            </button>
          </Tooltip>
        </div>
      </div>
    );
  };

  return (
    <div className="my-10 px-4 lg:px-6 max-w-[82rem] mx-auto w-full flex flex-col gap-4">
      <StepperHeader isEditMode={isEditMode} currentStep={currentStep} stepsData={stepsData} completedSteps={completedSteps} invalidSteps={invalidSteps} />
      <Formik innerRef={formRef} enableReinitialize validationSchema={AddJobSchema} initialValues={initialValues} onSubmit={handleSubmit} validateOnChange={true} validateOnBlur={true}>
        {({ values, errors, touched, handleChange, setFieldValue, setErrors, setTouched }) => {
          const filteredQuestions = values.questions.filter((q) => q.text.toLowerCase().includes(searchTerm.toLowerCase())).filter((q) => selectedTab === 'all');
          const paginatedQuestions = filteredQuestions.slice((page - 1) * Number(pageSize), page * Number(pageSize));
          const startIndex = (page - 1) * Number(pageSize);

          console.log('errors', errors);
          const validateStep = async () => {
            try {
              await AddJobSchema.validate(values, { abortEarly: false });

              if (!completedSteps.includes(currentStep)) {
                setCompletedSteps((prev) => [...prev, currentStep]);
              }
              if (invalidSteps.includes(currentStep)) {
                setInvalidSteps((prev) => prev.filter((step) => step !== currentStep));
              }

              return true;
            } catch (err: any) {
              if (err?.inner) {
                const errObj = err.inner.reduce((acc: any, curr: any) => {
                  acc[curr.path] = curr.message;
                  return acc;
                }, {});

                const touchedObj = Object.keys(errObj).reduce((acc: any, key) => {
                  acc[key] = true;
                  return acc;
                }, {});

                setErrors(errObj);
                setTouched(touchedObj);
              }

              if (!invalidSteps.includes(currentStep)) {
                setInvalidSteps((prev) => [...prev, currentStep]);
              }

              if (completedSteps.includes(currentStep)) {
                setCompletedSteps((prev) => prev.filter((step) => step !== currentStep));
              }
              return false;
            }
          };

          const handleEditQuestion = (id: string) => {
            const index = values.questions.findIndex((q) => q.id === id);
            if (index === -1) return;
            setDrawerMode('edit');
            setEditingQuestion(values.questions[index]);
            setEditingQuestionIndex(index);
            setQuestionDrawerOpen(true);
          };

          const handleDeleteQuestion = (id: string) => {
            setFieldValue(
              'questions',
              values.questions.filter((q) => q.id !== id)
            );
          };

          const handleAddQuestion = () => {
            setDrawerMode('add');
            setEditingQuestion(null);
            setEditingQuestionIndex(null);
            setQuestionDrawerOpen(true);
          };

          const handleSaveQuestion = (updatedQuestion: Question) => {
            if (drawerMode === 'add') {
              setFieldValue('questions', [updatedQuestion, ...values.questions]);
            } else if (drawerMode === 'edit' && editingQuestionIndex !== null) {
              const updatedQuestions = [...values.questions];
              updatedQuestions[editingQuestionIndex] = updatedQuestion;
              setFieldValue('questions', updatedQuestions);
            }
          };

          return (
            <div className="pb-16">
              <div className="grid md:grid-cols-[1.5fr_4fr] gap-6">
                <div>
                  <VerticalStepper
                    steps={stepsData}
                    currentStep={currentStep}
                    formReady={formReady}
                    onStepChange={async (index) => {
                      const valid = await validateStep();
                      if (valid) setCurrentStep(index);
                      return valid;
                    }}
                  />
                </div>
                <div>
                  <Card shadow="sm" className="p-2">
                    <CardBody>
                      {currentStep === 0 && (
                        <>
                          <div className="space-y-4">
                            <div className="mb-5 flex items-center gap-[5px] mb-3 md:mb-4 ">
                              <FaBriefcase className="w-5 h-5 text-xl text-primary-400" />
                              <h1 className=" text-xl/[24px] font-semibold text-tertiary  md:text-[20px]/[24px]">Job Details</h1>
                            </div>
                            <h1 className="text-sm font-semibold   mb-0">Role Name</h1>
                            <Input variant="bordered" value={values.jobTitle} onChange={handleChange('jobTitle')} isInvalid={!!errors.jobTitle && !!touched.jobTitle} errorMessage={errors.jobTitle} />

                            <div className="mb-5 flex items-center gap-[5px] mb-3 md:mb-4 ">
                              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="none" viewBox="0 0 16 16">
                                <path stroke="currentColor" d="M7 13.5H1.5v-12H10L11.5 3v3M4 4.5h5M4 6.5h4" />
                                <path fill="currentColor" d="m11.5 8 .99 2.51 2.51.99-2.51.99L11.5 15l-.99-2.51L8 11.5l2.51-.99L11.5 8Z" />
                              </svg>
                              <h1 className="text-sm font-semibold ">Use AI to help write the job description</h1>
                            </div>
                            <div className="mb-5 flex items-center   ">
                              <Textarea variant="bordered" placeholder="e.g. Focus on leadership, architecture patterns, or microservices" value={values.prompt} onChange={handleChange('prompt')} className="pr-10" />

                              <Button
                                endContent={
                                  <svg xmlns="http://www.w3.org/2000/svg" width="4em" height="4em" fill="none" viewBox="0 0 18 18" className="text-lg">
                                    <path stroke="#53B43B" stroke-linecap="round" stroke-linejoin="round" d="M2.623 15.373a1.59 1.59 0 0 0 2.25 0l9.75-9.75a1.59 1.59 0 0 0 0-2.25 1.59 1.59 0 0 0-2.25 0l-9.75 9.75a1.59 1.59 0 0 0 0 2.25M13.508 6.742l-2.25-2.25M6.375 1.83 7.5 1.5l-.33 1.125.33 1.125-1.125-.33-1.125.33.33-1.125L5.25 1.5zM3.375 6.33 4.5 6l-.33 1.125.33 1.125-1.125-.33-1.125.33.33-1.125L2.25 6zM14.625 10.08l1.125-.33-.33 1.125.33 1.125-1.125-.33L13.5 12l.33-1.125-.33-1.125z"></path>
                                  </svg>
                                }
                                variant="bordered"
                                radius="full"
                                isDisabled={!values.jobTitle}
                                isLoading={loading}
                                onPress={() => handleGenerateJobDescription(values, setFieldValue, setLoading)}
                              >
                                Generate
                              </Button>
                            </div>

                            <h1 className="text-sm font-semibold ">Job description</h1>
                            <RichTextEditor value={values.description} onChange={(val) => setFieldValue('description', val)} />
                          </div>
                        </>
                      )}
                      {currentStep === 1 && (
                        <>
                          <div className="mb-3">
                            <QuestionSearchAndFilter searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                          </div>
                          <QuestionHeaderActions onGenerateAI={() => setGenerateDrawerOpen(true)} onAddManual={handleAddQuestion} questionCount={values.questions.length} />

                          {touched.questions && typeof errors.questions === 'string' && <div className="text-sm text-red-500 mt-2">{errors.questions}</div>}

                          <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={({ active, over }) => {
                              if (!over || active.id === over.id) return;
                              const oldIndex = values.questions.findIndex((q) => q.id === active.id);
                              const newIndex = values.questions.findIndex((q) => q.id === over.id);
                              setFieldValue('questions', arrayMove(values.questions, oldIndex, newIndex));
                            }}
                          >
                            <SortableContext items={values.questions.map((q) => q.id)} strategy={verticalListSortingStrategy}>
                              <div className="flex flex-col gap-2 mt-4">
                                {paginatedQuestions.map((question, index) => (
                                  <SortableQuestionItem key={question.id} question={question} index={startIndex + index} handleEditQuestion={handleEditQuestion} handleDeleteQuestion={handleDeleteQuestion} />
                                ))}
                              </div>
                            </SortableContext>
                          </DndContext>
                        </>
                      )}
                      {currentStep === 2 && (
                        <>
                          <div className="mb-5">
                            <h1 className=" text-xl/[24px] font-semibold text-tertiary  md:text-[20px]/[24px]">Random Settings</h1>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h1 className="text-sm font-semibold  mb-0">Total verbal questions ({values.questions.length})</h1>
                              <NumberInput variant="bordered" maxValue={values.questions.length} value={values.totalRandomVerbalQuestion} onValueChange={(val) => setFieldValue('totalRandomVerbalQuestion', val)} />
                              <p className="text-xs text-gray-400 mt-1">Random questions mean picking 5 questions out of 50 that are marked as random.</p>
                            </div>
                          </div>
                        </>
                      )}
                      {currentStep === 3 && <FraudDetectionSettings values={values.fraudDetection} setFieldValue={setFieldValue} />}
                    </CardBody>

                    <GenerateQuestionsDrawer
                      onQuestionsGenerated={(generatedQuestions) => {
                        setFieldValue('questions', [...generatedQuestions, ...values.questions]);
                        setGenerateDrawerOpen(false);
                      }}
                      onOpenChange={(open) => setGenerateDrawerOpen(open)}
                      isOpen={isGenerateDrawerOpen}
                      description={values.description}
                      jobTitle={values.jobTitle}
                    />
                    <QuestionEditDrawer
                      isOpen={isQuestionDrawerOpen}
                      onOpenChange={(open) => {
                        if (!open) {
                          setEditingQuestion(null);
                          setEditingQuestionIndex(null);
                          setQuestionDrawerOpen(false);
                        }
                      }}
                      mode={drawerMode}
                      initialQuestion={editingQuestion}
                      onSave={handleSaveQuestion}
                    />
                  </Card>
                </div>
              </div>

              <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-2 flex justify-end mt-8">
                <div className="mx-auto flex w-full max-w-[90rem] items-center px-5 xl:px-8 xl2:px-[60px] xl2:!pr-[60px] justify-between">
                  {currentStep > 0 ? <Button onPress={() => setCurrentStep(currentStep - 1)}>Previous</Button> : <div></div>}

                  <div className="flex gap-2">
                    {isEditMode && (
                      <Button color="primary" size="lg" onPress={() => formRef.current.handleSubmit()} isLoading={loading}>
                        Save
                      </Button>
                    )}

                    {currentStep < stepsData.length - 1 ? (
                      <Button
                        size="lg"
                        variant="solid"
                        color="primary"
                        onPress={async () => {
                          const valid = await validateStep();
                          if (valid) setCurrentStep(currentStep + 1);
                        }}
                      >
                        Next
                      </Button>
                    ) : (
                      !isEditMode && (
                        <Button color="primary" size="lg" isLoading={loading} onPress={() => formRef.current.handleSubmit()}>
                          Save & Activate
                        </Button>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        }}
      </Formik>
    </div>
  );
};
