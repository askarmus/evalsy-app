"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button, Card, CardBody, CardFooter, Divider, Input, Pagination, NumberInput, Chip, Tooltip, Select, SelectItem } from "@heroui/react";
import { Formik, FormikHelpers } from "formik";
import { showToast } from "@/app/utils/toastUtils";
import { createJob, getJobById, updateJob } from "@/services/job.service";
import { AddJobSchema } from "@/helpers/schemas";
import { Breadcrumb } from "../bread.crumb";
import { nanoid } from "nanoid";
import { useParams, useRouter } from "next/navigation";
import { QuestionEditDrawer } from "./components/add/QuestionEditDrawer";
import { AddJobFormValues, Question } from "./types";
import { QuestionSearchAndFilter } from "./components/add/QuestionSearchAndFilter";
import { GenerateQuestionsDrawer } from "./components/add/GenerateQuestionsDrawer";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { QuestionHeaderActions } from "./components/add/QuestionHeaderActions";
import RichTextEditor from "../shared/RichTextEditor";

import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FaGripVertical } from "react-icons/fa";

export const AddJob = () => {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const formRef = useRef<any>(null);

  const sensors = useSensors(useSensor(PointerSensor));

  const [loading, setLoading] = useState(false);
  const [isQuestionDrawerOpen, setQuestionDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"add" | "edit">("add");
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);
  const [isGenerateDrawerOpen, setGenerateDrawerOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState<"all" | "verbal" | "coding">("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = React.useState("5");

  const [initialValues, setInitialValues] = useState<AddJobFormValues>({
    jobTitle: "",
    totalRandomVerbalQuestion: 0,
    totalRandomCodingQuestion: 0,
    questions: [
      {
        id: nanoid(),
        text: "Tell me about yourself and your experience",
        expectedScore: 20,
        isRandom: false,
        type: "verbal",
        timeLimit: 0,
        language: "",
        explanation: "",
        starterCode: "",
      },
    ],
    experienceLevel: "beginner",
    description: "",
  });

  const isEditMode = Boolean(id);

  useEffect(() => {
    if (isEditMode) {
      const fetchJob = async () => {
        const jobData = await getJobById(id);
        setInitialValues(jobData);
      };
      fetchJob();
    }
  }, [id]);

  const handleSubmit = async (values: AddJobFormValues, { resetForm }: FormikHelpers<AddJobFormValues>) => {
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
      }, 3000);
    } catch (error) {
      showToast.error("Error occurred while saving the job. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const pageSizes = [
    { key: 5, label: "5" },
    { key: 10, label: "10" },
    { key: 30, label: "20" },
    { key: 40, label: "30" },
    { key: 50, label: "40" },
    { key: 60, label: "50" },
    { key: 60, label: "60" },
    { key: 70, label: "70" },
  ];

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setPageSize(selected);
    // setPage(1); // reset page if needed
  };
  const breadcrumbItems = [
    { name: "Dashboard", link: "/" },
    { name: "Job", link: "/job/list" },
    { name: !isEditMode ? "Add" : "Edit", link: "" },
  ];

  const SortableQuestionItem = ({ question, index, handleEditQuestion, handleDeleteQuestion }: { question: Question; index: number; handleEditQuestion: (id: string) => void; handleDeleteQuestion: (id: string) => void }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: question.id });
    const style = { transform: CSS.Transform.toString(transform), transition };

    return (
      <div ref={setNodeRef} {...attributes} style={style} className='flex items-center justify-between p-2 border-2 rounded-xl border-gray-300 dark:border-gray-600'>
        <div className='flex items-center text-base min-w-0'>
          <span {...listeners} className='mr-2 cursor-grab text-gray-500 hover:text-gray-800'>
            <FaGripVertical />
          </span>
          <span className='flex items-center justify-center bg-gray-900 text-primary-foreground rounded-full w-7 h-7 mr-3 text-sm font-medium'>{index + 1}</span>
          <span className='truncate font-semibold max-w-[200px] md:max-w-[400px]'>{question.text.length > 80 ? `${question.text.substring(0, 80)}...` : question.text || "New Question"}</span>
        </div>
        <div className='flex items-center gap-2 ml-4 shrink-0'>
          <Chip color={question.type === "coding" ? "secondary" : "primary"} variant='flat' size='sm'>
            {question.type}
          </Chip>
          <Tooltip content='Edit question'>
            <button aria-label='Edit' onClick={() => handleEditQuestion(question.id)} className='p-1 text-gray-600 hover:text-black rounded-full dark:text-gray-300 dark:hover:text-white'>
              <AiOutlineEdit className='h-5 w-5' />
            </button>
          </Tooltip>
          <Tooltip content='Remove question'>
            <button aria-label='Delete' onClick={() => handleDeleteQuestion(question.id)} className='p-1 text-gray-600 hover:text-black rounded-full dark:text-gray-300 dark:hover:text-white'>
              <AiOutlineDelete className='h-5 w-5 text-red-400' />
            </button>
          </Tooltip>
        </div>
      </div>
    );
  };

  return (
    <div className='my-10 px-4 lg:px-6 max-w-[82rem] mx-auto w-full flex flex-col gap-4'>
      <Breadcrumb items={breadcrumbItems} />
      <h3 className='text-xl font-semibold'>{isEditMode ? "Edit Interview" : "Add Interview"}</h3>

      <Formik<AddJobFormValues> innerRef={formRef} enableReinitialize initialValues={initialValues} validationSchema={AddJobSchema} onSubmit={handleSubmit}>
        {({ values, errors, touched, handleChange, setFieldValue }) => {
          const filteredQuestions = values.questions.filter((q) => q.text.toLowerCase().includes(searchTerm.toLowerCase())).filter((q) => selectedTab === "all" || q.type === selectedTab);
          const paginatedQuestions = filteredQuestions.slice((page - 1) * Number(pageSize), page * Number(pageSize));
          const startIndex = (page - 1) * Number(pageSize);

          const handleEditQuestion = (id: string) => {
            const index = values.questions.findIndex((q) => q.id === id);
            if (index === -1) return;
            setDrawerMode("edit");
            setEditingQuestion(values.questions[index]);
            setEditingQuestionIndex(index);
            setQuestionDrawerOpen(true);
          };

          const handleDeleteQuestion = (id: string) => {
            setFieldValue(
              "questions",
              values.questions.filter((q) => q.id !== id)
            );
          };

          const handleAddQuestion = () => {
            setDrawerMode("add");
            setEditingQuestion(null);
            setEditingQuestionIndex(null);
            setQuestionDrawerOpen(true);
          };

          const handleSaveQuestion = (updatedQuestion: Question) => {
            if (drawerMode === "add") {
              setFieldValue("questions", [updatedQuestion, ...values.questions]);
            } else if (drawerMode === "edit" && editingQuestionIndex !== null) {
              const updatedQuestions = [...values.questions];
              updatedQuestions[editingQuestionIndex] = updatedQuestion;
              setFieldValue("questions", updatedQuestions);
            }
          };

          return (
            <Card className='p-4'>
              <CardBody>
                <div className='grid grid-cols-1 gap-4'>
                  <Input label='Job Title' size='sm' radius='sm' variant='bordered' value={values.jobTitle} isInvalid={!!errors.jobTitle && !!touched.jobTitle} errorMessage={errors.jobTitle} onChange={handleChange("jobTitle")} />
                  <RichTextEditor value={values.description} onChange={(val) => setFieldValue("description", val)} />
                </div>

                <div className='mt-6'>
                  <QuestionSearchAndFilter
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    selectedTab={selectedTab}
                    setSelectedTab={setSelectedTab}
                    questionsCount={{
                      all: values.questions.length,
                      verbal: values.questions.filter((q) => q.type === "verbal").length,
                      coding: values.questions.filter((q) => q.type === "coding").length,
                    }}
                  />
                </div>
                <div className='mt-6'>
                  <QuestionHeaderActions onGenerateAI={() => setGenerateDrawerOpen(true)} onAddManual={handleAddQuestion} questionCount={10} />
                </div>

                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={({ active, over }) => {
                    if (!over || active.id === over.id) return;
                    const oldIndex = values.questions.findIndex((q) => q.id === active.id);
                    const newIndex = values.questions.findIndex((q) => q.id === over.id);
                    const reordered = arrayMove(values.questions, oldIndex, newIndex);
                    setFieldValue("questions", reordered);
                  }}>
                  <SortableContext items={values.questions.map((q) => q.id)} strategy={verticalListSortingStrategy}>
                    <div className='flex flex-col gap-2 mt-4'>
                      {paginatedQuestions.map((question, index) => (
                        <SortableQuestionItem key={question.id} question={question} index={startIndex + index} handleEditQuestion={handleEditQuestion} handleDeleteQuestion={handleDeleteQuestion} />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>

                <div className='flex flex-wrap gap-4 mt-4'>
                  <NumberInput size='sm' variant='bordered' label='Total Random Verbal Question' value={values.totalRandomVerbalQuestion} onValueChange={(val) => setFieldValue("totalRandomVerbalQuestion", val)} isInvalid={!!errors.totalRandomVerbalQuestion && !!touched.totalRandomVerbalQuestion} errorMessage={errors.totalRandomVerbalQuestion} className='max-w-xs' />
                  <NumberInput size='sm' variant='bordered' label='Total Random Coding Question' value={values.totalRandomCodingQuestion} onValueChange={(val) => setFieldValue("totalRandomCodingQuestion", val)} isInvalid={!!errors.totalRandomCodingQuestion && !!touched.totalRandomCodingQuestion} errorMessage={errors.totalRandomCodingQuestion} className='max-w-xs' />
                </div>

                <Divider className='my-6' />
                <div className='flex flex-wrap justify-center items-center gap-4 mt-6'>
                  <Pagination color='default' size='sm' total={Math.ceil(filteredQuestions.length / Number(pageSize))} initialPage={1} page={page} onChange={setPage} />

                  <div className='flex items-center gap-2'>
                    <Select className='w-20' size='sm' defaultSelectedKeys={[pageSize]} selectedKeys={[pageSize]} variant='faded' onChange={handlePageSizeChange}>
                      {pageSizes.map((animal) => (
                        <SelectItem key={animal.key}>{animal.label}</SelectItem>
                      ))}
                    </Select>
                  </div>
                </div>
              </CardBody>
              <CardFooter>
                <div className='flex justify-end w-full'>
                  <Button color='primary' isLoading={loading} onPress={() => formRef.current.handleSubmit()}>
                    Save Changes
                  </Button>
                </div>
              </CardFooter>

              <GenerateQuestionsDrawer
                onQuestionsGenerated={(generatedQuestions) => {
                  setFieldValue("questions", [...generatedQuestions, ...values.questions]);
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
          );
        }}
      </Formik>
    </div>
  );
};
