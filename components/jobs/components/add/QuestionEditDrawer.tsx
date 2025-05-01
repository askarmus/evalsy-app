"use client";

import { Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerContent, Button, Select, SelectItem, Checkbox, Textarea, Input } from "@heroui/react";
import { Formik } from "formik";
import { AddJobSchema } from "@/helpers/schemas";
import { nanoid } from "nanoid";
import { ArraySchema } from "yup";
import RichTextEditor from "../../../shared/RichTextEditor";
import { languages } from "@/config/languages";

interface QuestionEditDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  initialQuestion: any;
  onSave: (question: any) => void;
}

export const QuestionEditDrawer = ({ isOpen, onOpenChange, mode, initialQuestion, onSave }: QuestionEditDrawerProps) => {
  const isEdit = mode === "edit";

  const questionSchema = (AddJobSchema.fields.questions as ArraySchema<any[], any>).innerType;

  const handleCreateNewQuestion = () => ({
    id: nanoid(),
    text: "",
    expectedScore: 20,
    isRandom: true,
    type: "verbal",
    timeLimit: 0,
    language: "",
    starterCode: "",
    explanation: "",
  });

  return (
    <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        {(onClose) => (
          <Formik
            initialValues={initialQuestion || handleCreateNewQuestion()}
            validationSchema={questionSchema}
            onSubmit={(values) => {
              onSave(values);
              onClose();
            }}>
            {({ values, errors, touched, handleChange, setFieldValue, handleSubmit }) => (
              <>
                <DrawerHeader>{isEdit ? "Edit Question" : "Add New Question"}</DrawerHeader>

                <DrawerBody>
                  <div className='flex flex-col gap-4'>
                    {/* Question Type and Randomize */}
                    <div className='flex items-center gap-4'>
                      <div>
                        <label className='block text-sm font-medium mb-1'>Question Type</label>
                        <Select
                          aria-label='Select question type'
                          selectedKeys={[values.type]}
                          onChange={(e) => {
                            const newType = e.target.value;
                            setFieldValue("type", newType);
                            if (newType !== "coding") {
                              setFieldValue("timeLimit", undefined);
                              setFieldValue("language", undefined);
                              setFieldValue("starterCode", undefined);
                            }
                          }}>
                          <SelectItem key='verbal'>Verbal</SelectItem>
                          <SelectItem key='coding'>Coding</SelectItem>
                        </Select>
                      </div>

                      <div className='mt-6'>
                        <Checkbox isSelected={values.isRandom} onChange={(e) => setFieldValue("isRandom", e.target.checked)}>
                          Randomize Question
                        </Checkbox>
                      </div>
                    </div>

                    {/* Question Text */}
                    <div>
                      <label className='block text-sm font-medium mb-1'>Question Text</label>
                      <Textarea variant='bordered' placeholder='Enter your question' value={values.text} isInvalid={Boolean(touched.text) && Boolean(errors.text)} onChange={handleChange("text")} />
                    </div>

                    {/* Explanation */}
                    <div>
                      <label className='block text-sm font-medium mb-1'>Explanation (optional)</label>
                      <RichTextEditor value={values.explanation || ""} onChange={(val) => setFieldValue("explanation", val)} />
                    </div>

                    {/* Coding-specific options */}
                    {values.type === "coding" && (
                      <div className='flex flex-col gap-4'>
                        {/* Time Limit */}
                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-1'>Time Limit (minutes)</label>
                          <Input size='sm' type='number' min={1} value={values.timeLimit?.toString() || ""} placeholder='Enter time limit' isInvalid={Boolean(errors.timeLimit) && Boolean(touched.timeLimit)} onChange={(e) => setFieldValue("timeLimit", Number(e.target.value))} className='max-w-[120px]' />
                        </div>

                        {/* Language */}
                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-1'>Language</label>
                          <Select aria-label='language' selectedKeys={values.language ? [values.language] : []} onChange={(e) => setFieldValue("language", e.target.value)} size='sm' isInvalid={Boolean(errors.language) && Boolean(touched.language)} className='w-48'>
                            {languages.map((lang) => (
                              <SelectItem key={lang.monacoLang}>{lang.label}</SelectItem>
                            ))}
                          </Select>
                        </div>

                        {/* Starter Code */}
                        <div>
                          <label className='block text-sm font-medium mb-1'>Starting Code</label>
                          <Textarea className='w-full' variant='bordered' placeholder='Code' value={values.starterCode || ""} onChange={(e) => setFieldValue("starterCode", e.target.value)} />
                        </div>
                      </div>
                    )}
                  </div>
                </DrawerBody>

                {/* Footer Buttons */}
                <DrawerFooter>
                  <Button variant='light' color='danger' onPress={onClose}>
                    Cancel
                  </Button>
                  <Button color='primary' onPress={() => handleSubmit()}>
                    {isEdit ? "Update Changes" : "Add Question"}
                  </Button>
                </DrawerFooter>
              </>
            )}
          </Formik>
        )}
      </DrawerContent>
    </Drawer>
  );
};
