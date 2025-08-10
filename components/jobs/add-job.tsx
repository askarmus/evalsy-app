'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, CardBody, Input, NumberInput, Tooltip, Textarea, RadioGroup, Radio, Slider, Checkbox, Select, SelectItem, Autocomplete, AutocompleteItem } from '@heroui/react';
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
import { FaAsterisk, FaBriefcase, FaCogs, FaGripVertical, FaQuestionCircle, FaShieldAlt } from 'react-icons/fa';
import { FraudDetectionSettings } from './components/add/FraudDetectionSettings';
import { VerticalStepper } from './components/add/VerticalStepper';
import { StepperHeader } from './components/add/StepperHeader';
import { defaultJobFormValues } from './helpers/formDefaults';
import { countryOptions, currencyOptions } from '@/services/currency.service';
import { Briefcase, ChevronLeft, ChevronRight, ClipboardList, Delete, Edit, Forward, GripVertical, MessageCircleQuestion, Save, Settings, Settings2, SettingsIcon, Shield, Sparkle, Trash } from 'lucide-react';
import ResumeCriteriaSettings from './components/add/ResumeCriteriaSettings';

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
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('');

  const stepsData = [
    {
      icon: <Briefcase className="w-5 h-5 text-xl" />,
      title: 'Interview Info',
      description: 'View complete job role details and responsibilities overview.',
    },
    {
      icon: <MessageCircleQuestion className="w-5 h-5 text-xl text-secondary-900" />,
      title: 'Questions',
      description: 'Browse commonly asked questions to prepare effectively.',
    },
    {
      icon: <Settings2 className="w-5 h-5 text-xl text-gray-900" />,
      title: 'Settings',
      description: 'Configure application preferences and system-wide options.',
    },
    {
      icon: <ClipboardList className="w-5 h-5 text-xl text-gray-900" />,
      title: 'Resume Scoring Criteria',
      description: 'Set rules and weights for matching resumes to jobs.',
    },

    {
      icon: <Shield className="w-5 h-5 text-xl text-gray-900" />,
      title: 'Fraud Detection',
      description: 'Track suspicious activity and prevent fraudulent candidate behavior.',
    },
  ];

  const [initialValues, setInitialValues] = useState<AddJobFormValues>(defaultJobFormValues);

  const isEditMode = Boolean(id);
  useEffect(() => {
    if (isEditMode) {
      const fetchJob = async () => {
        const jobData = await getJobById(id);
        setInitialValues(jobData);
        setFormReady(true);
      };
      fetchJob();
    }
  }, [id]);

  const [formReady, setFormReady] = useState(!isEditMode);

  const workplaceOptions = [
    { id: 'onsite', name: 'Onsite' },
    { id: 'remote', name: 'Remote' },
    { id: 'hybrid', name: 'Hybrid' },
  ];

  const experienceOptions = [
    { id: 'beginner', name: 'Beginner' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'expert', name: 'Expert' },
  ];

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

    values.invitationExpireInDays = Number(values.invitationExpireInDays);
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

  const SortableQuestionItem = ({ question, index, handleEditQuestion, handleDeleteQuestion }: { question: Question; index: number; handleEditQuestion: (id: string) => void; handleDeleteQuestion: (id: string) => void }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: question.id });
    const style = { transform: CSS.Transform.toString(transform), transition };

    return (
      <div ref={setNodeRef} {...attributes} style={style} className="flex items-center justify-between p-2 border-2 rounded-full border-secondary-100 ">
        <div className="flex items-center text-base min-w-0">
          <span className={`flex items-center justify-center rounded-full w-5 h-5 mr-3 text-xs font-medium text-primary-foreground ${question.isRandom ? 'bg-blue-600' : 'bg-red-600'}`}>{index + 1}</span>

          <span {...listeners} className="mr-2 cursor-grab  hover:text-gray-800">
            <GripVertical className="text-secondary-200 w-4 h-4" />
          </span>
          <span className="truncate font-semibold max-w-[700px]  ">{question.text.length > 80 ? `${question.text.substring(0, 130)}...` : question.text || 'New Question'}</span>
        </div>
        <div className="flex items-center gap-2 ml-4 shrink-0">
          <Tooltip content="Edit question">
            <button aria-label="Edit" onClick={() => handleEditQuestion(question.id)} className="p-1 text-gray-600 hover:text-black rounded-full dark:text-gray-300 dark:hover:text-white">
              <Edit className="h-4 w-4" />
            </button>
          </Tooltip>
          <Tooltip content="Remove question">
            <button aria-label="Delete" onClick={() => handleDeleteQuestion(question.id)} className="p-1 text-gray-600 hover:text-black rounded-full dark:text-gray-300 dark:hover:text-white">
              <Trash className="h-4 w-4 text-red-400" />
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
              setFieldValue('questions', [...values.questions, updatedQuestion]);
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
                  <Card shadow="sm" radius="md">
                    <CardBody className="p-4">
                      {currentStep === 0 && (
                        <>
                          <div className="space-y-4">
                            <div className="mb-5 flex items-center gap-[5px] mb-3 md:mb-4 ">
                              <Briefcase className="w-5 h-5 text-xl text-secondary-400" />
                              <h1 className=" text-xl/[24px] font-semibold text-tertiary  md:text-[20px]/[24px]">Interview Details</h1>
                            </div>
                            <h1 className="text-sm font-semibold   mb-0">Role Name</h1>
                            <Input variant="bordered" value={values.jobTitle} onChange={handleChange('jobTitle')} isInvalid={!!errors.jobTitle && !!touched.jobTitle} errorMessage={errors.jobTitle} />

                            {/* Workplace Type */}

                            <div className="grid grid-cols-2 gap-3">
                              <Select variant="bordered" label="Workplace Type" items={workplaceOptions} isInvalid={!!errors.workplaceType && !!touched.workplaceType} errorMessage={errors.workplaceType} selectedKeys={[values.workplaceType]} onSelectionChange={(key) => setFieldValue('workplaceType', Array.from(key)[0])}>
                                {(item) => <SelectItem key={item.id}>{item.name}</SelectItem>}
                              </Select>

                              <Select
                                variant="bordered"
                                label="Experience Level"
                                items={experienceOptions}
                                isInvalid={!!errors.experienceLevel && !!touched.experienceLevel}
                                errorMessage={errors.experienceLevel}
                                selectedKeys={values.experienceLevel ? [values.experienceLevel] : []} // <-- handle empty case
                                onSelectionChange={(key) => setFieldValue('experienceLevel', Array.from(key)[0] || '')}
                              >
                                {(item) => <SelectItem key={item.id}>{item.name}</SelectItem>}
                              </Select>
                            </div>

                            <h1 className="text-sm font-semibold">Salary Range(this will help you you narrow down selecton process)</h1>

                            <div className="grid grid-cols-3 gap-3">
                              <Autocomplete
                                label="Currency"
                                placeholder="Select a currency"
                                labelPlacement="outside"
                                isInvalid={!!errors.currency && !!touched.currency}
                                errorMessage={errors.currency}
                                selectedKey={values.currency ?? null}
                                onSelectionChange={(key) => setFieldValue('currency', key)}
                                className="w-full"
                                defaultFilter={(textValue, inputValue) => {
                                  const query = inputValue.toLowerCase();
                                  return textValue.toLowerCase().includes(query);
                                }}
                              >
                                {currencyOptions.map((item: any) => (
                                  <AutocompleteItem
                                    key={item.code}
                                    // combine code + name so both are searchable
                                    textValue={`${item.code} ${item.name}`}
                                  >
                                    {item.code} - {item.name}
                                  </AutocompleteItem>
                                ))}
                              </Autocomplete>

                              <Input variant="bordered" min={0} isInvalid={!!errors.minSalary && !!touched.minSalary} errorMessage={errors.minSalary} label="Min Salary" labelPlacement="outside" placeholder="Min" type="number" value={values.minSalary?.toString() || ''} onChange={handleChange('minSalary')} />

                              <Input variant="bordered" isInvalid={!!errors.maxSalary && !!touched.maxSalary} errorMessage={errors.maxSalary} label="Max Salary" labelPlacement="outside" placeholder="Max" type="number" value={values.maxSalary?.toString() || ''} onChange={handleChange('maxSalary')} />
                            </div>

                            <h1 className="text-sm font-semibold">Location</h1>

                            <div className="grid grid-cols-2 gap-3">
                              <Autocomplete
                                label="Country"
                                placeholder="Select a country"
                                labelPlacement="outside"
                                variant="bordered"
                                isInvalid={!!errors.country && !!touched.country}
                                errorMessage={errors.country}
                                selectedKey={values.country ?? null}
                                onSelectionChange={(key) => {
                                  const selected = key?.toString() || '';
                                  setFieldValue('country', selected);
                                  setFieldValue('city', ''); // Reset city when country changes
                                  setSelectedCountry(selected);
                                }}
                                className="w-full"
                              >
                                {countryOptions.map((item) => (
                                  <AutocompleteItem key={item.id} textValue={item.name}>
                                    {item.name}
                                  </AutocompleteItem>
                                ))}
                              </Autocomplete>

                              <Input variant="bordered" labelPlacement="outside" isInvalid={!!errors.city && !!touched.city} errorMessage={errors.city} label="City" placeholder="city" value={values.city?.toString() || ''} onChange={handleChange('city')} />
                            </div>

                            <Checkbox isSelected={values.showSalaryInDescription} onValueChange={(val) => setFieldValue('showSalaryInDescription', val)}>
                              Show salary range in job description
                            </Checkbox>

                            <div className="mb-5 flex items-center gap-[5px] mb-3 md:mb-4 ">
                              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="none" viewBox="0 0 16 16">
                                <path stroke="currentColor" d="M7 13.5H1.5v-12H10L11.5 3v3M4 4.5h5M4 6.5h4" />
                                <path fill="currentColor" d="m11.5 8 .99 2.51 2.51.99-2.51.99L11.5 15l-.99-2.51L8 11.5l2.51-.99L11.5 8Z" />
                              </svg>
                              <h1 className="text-sm font-semibold ">Use AI to help write the job description</h1>
                            </div>
                            <div className="mb-5 flex items-center   ">
                              <Textarea variant="bordered" placeholder="e.g. Focus on leadership, architecture patterns, or microservices" value={values.prompt} onChange={handleChange('prompt')} className="pr-10" />

                              <Button startContent={<Sparkle />} variant="bordered" radius="full" color="secondary" isDisabled={!values.jobTitle} isLoading={loading} onPress={() => handleGenerateJobDescription(values, setFieldValue, setLoading)}>
                                AI Generate
                              </Button>
                            </div>

                            <RichTextEditor
                              value={values.description}
                              onTextChange={(text) => setFieldValue('descriptionPlain', text)}
                              onChange={(val) => {
                                setFieldValue('description', val);
                                if (!touched.description) {
                                  setTouched({ ...touched, description: true });
                                }
                              }}
                            />
                            {touched.description && errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
                          </div>
                        </>
                      )}
                      {currentStep === 1 && (
                        <>
                          <div className="mb-5 flex items-center justify-between mb-3 md:mb-4">
                            {/* Left section: Icon + Title */}
                            <div className="flex items-center gap-2">
                              <MessageCircleQuestion className="w-5 h-5 text-xl text-secondary-400" />
                              <h1 className="text-xl/[24px] font-semibold text-tertiary md:text-[20px]/[24px]">Manage Questions</h1>
                            </div>

                            {/* Right section: Search and Filter */}
                            <div className="flex-shrink-0">
                              <QuestionSearchAndFilter searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                            </div>
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
                          <div className="mb-5 flex items-center gap-[5px] mb-3 md:mb-4 ">
                            <Settings2 className="w-5 h-5 text-xl text-secondary-400" />
                            <h1 className=" text-xl/[24px] font-semibold text-tertiary  md:text-[20px]/[24px]">Interview Settings</h1>
                          </div>

                          <div className="grid grid-cols-1  gap-6">
                            <div>
                              <h1 className="text-sm font-semibold  mb-0">Total verbal questions ({values.questions.length})</h1>
                              <NumberInput variant="bordered" maxValue={values.questions.length} value={values.totalRandomVerbalQuestion} minValue={0} onValueChange={(val) => setFieldValue('totalRandomVerbalQuestion', val)} />
                              <p className="text-xs text-gray-400 mt-1">Random questions mean picking 5 questions out of 50 that are marked as random.</p>
                            </div>
                            <Slider
                              className="max-w-full"
                              color="secondary"
                              defaultValue={5}
                              value={values.durationInMinutes}
                              label="Duration (Minutes)"
                              maxValue={20}
                              minValue={5}
                              showSteps={true}
                              size="sm"
                              step={5}
                              onChange={(e) =>
                                handleChange({
                                  target: { name: 'durationInMinutes', value: Number(e) },
                                })
                              }
                            />

                            <RadioGroup color="secondary" label="invitation Expire" size="sm" orientation="horizontal" value={values.invitationExpireInDays.toString()} onChange={handleChange('invitationExpireInDays')} isInvalid={!!errors.invitationExpireInDays && !!touched.invitationExpireInDays} errorMessage={errors.invitationExpireInDays}>
                              <Radio value="3">3 Days</Radio>
                              <Radio value="7">One Week</Radio>
                              <Radio value="14">Two Weeks</Radio>
                              <Radio value="30">1 Month</Radio>
                              <Radio value="10000">No Expiry</Radio>
                            </RadioGroup>
                          </div>
                        </>
                      )}

                      {currentStep === 3 && <ResumeCriteriaSettings />}
                      {currentStep === 4 && <FraudDetectionSettings values={values.fraudDetection} setFieldValue={setFieldValue} />}
                    </CardBody>

                    <GenerateQuestionsDrawer
                      onQuestionsGenerated={(generatedQuestions) => {
                        setFieldValue('questions', [...values.questions, ...generatedQuestions]);
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

              <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-secondary-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-2 flex justify-end">
                <div className="mx-auto flex w-full max-w-[90rem] items-center px-5 xl:px-8 xl2:px-[60px] xl2:!pr-[60px] justify-between">
                  {currentStep > 0 ? (
                    <Button startContent={<ChevronLeft />} size="md" color="secondary" radius="full" variant="faded" onPress={() => setCurrentStep(currentStep - 1)}>
                      Previous
                    </Button>
                  ) : (
                    <div></div>
                  )}

                  <div className="flex gap-2">
                    {isEditMode && (
                      <Button color="secondary" startContent={<Save />} variant="flat" radius="full" size="md" onPress={() => formRef.current.handleSubmit()} isLoading={loading}>
                        Save Changes
                      </Button>
                    )}

                    {currentStep < stepsData.length - 1 ? (
                      <Button
                        startContent={<ChevronRight />}
                        color="secondary"
                        variant="flat"
                        radius="full"
                        size="md"
                        onPress={async () => {
                          const valid = await validateStep();
                          if (valid) setCurrentStep(currentStep + 1);
                        }}
                      >
                        Move Next
                      </Button>
                    ) : (
                      !isEditMode && (
                        <Button size="md" className="bg-[#100145] text-white" isLoading={loading} onPress={() => formRef.current.handleSubmit()}>
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
