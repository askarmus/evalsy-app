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
                    <div className='flex justify-between gap-4'>
                      <div className='flex-1'>
                        <label className='block text-sm font-medium mb-1'>Question Type</label>
                        <Select
                          className='w-full'
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

                      <div className='flex items-end flex-1'>
                        <Checkbox isSelected={values.isRandom} onChange={(e) => setFieldValue("isRandom", e.target.checked)}>
                          Random Only
                        </Checkbox>
                      </div>
                    </div>

                    <div>
                      <label className='block text-sm font-medium mb-1'>Question Text</label>
                      <Textarea variant='bordered' placeholder='Enter your question' value={values.text} isInvalid={Boolean(touched.text) && Boolean(errors.text)} onChange={handleChange("text")} />
                    </div>

                    <div>
                      <label className='block text-sm font-medium mb-1'>Explanation (optional)</label>
                      <RichTextEditor value={values.explanation || ""} onChange={(val) => setFieldValue("explanation", val)} />
                    </div>

                    {values.type === "coding" && (
                      <div className='flex justify-between gap-4'>
                        <div className='flex-1 max-w-[160px]'>
                          <label className='block text-sm font-medium text-gray-700 mb-1'>Time Limit (minutes)</label>
                          <Input size='sm' type='number' min={1} value={values.timeLimit?.toString() || ""} placeholder='Enter time limit' isInvalid={Boolean(errors.timeLimit) && Boolean(touched.timeLimit)} onChange={(e) => setFieldValue("timeLimit", Number(e.target.value))} className='w-full' />
                        </div>

                        <div className='flex-1'>
                          <label className='block text-sm font-medium text-gray-700 mb-1'>Language</label>
                          <Select aria-label='language' selectedKeys={values.language ? [values.language] : []} onChange={(e) => setFieldValue("language", e.target.value)} size='sm' isInvalid={Boolean(errors.language) && Boolean(touched.language)} className='w-full'>
                            {languages.map((lang) => (
                              <SelectItem key={lang.monacoLang}>{lang.label}</SelectItem>
                            ))}
                          </Select>
                        </div>
                      </div>
                    )}
                  </div>
                </DrawerBody>

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
