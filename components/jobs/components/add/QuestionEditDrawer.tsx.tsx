"use client";

import { Drawer, DrawerBody, DrawerFooter, DrawerHeader, Button, Input, Select, SelectItem, Checkbox, Divider, Textarea } from "@heroui/react";
import { nanoid } from "nanoid";
import { CodingQuestionOptions } from "./CodingQuestionOptions";
import RichTextEditor from "../../../shared/RichTextEditor";

interface QuestionEditDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit"; // add or edit
  questionIndex: number | null;
  values: any;
  setFieldValue: (field: string, value: any) => void;
  errors: any;
  touched: any;
}

export const QuestionEditDrawer = ({ isOpen, onClose, mode, questionIndex, values, setFieldValue, errors, touched }: QuestionEditDrawerProps) => {
  const isEdit = mode === "edit";

  const question = isEdit && questionIndex !== null ? values.questions[questionIndex] : null;
  const questionError = questionIndex !== null ? errors.questions?.[questionIndex] : undefined;
  const questionTouched = questionIndex !== null ? touched.questions?.[questionIndex] : undefined;

  const handleAddNewQuestion = () => {
    const newQuestion = {
      id: nanoid(),
      text: "",
      expectedScore: 20,
      isRandom: true,
      type: "verbal",
      timeLimit: 0,
      language: "",
      explanation: "",
    };
    setFieldValue("questions", [newQuestion, ...values.questions]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Drawer isOpen={isOpen} onClose={onClose} size='md'>
      <DrawerHeader>{isEdit ? "Edit Question" : "Add New Question"}</DrawerHeader>

      <DrawerBody>
        {isEdit && question && questionIndex !== null && (
          <div className='flex flex-col gap-4'>
            {/* Question Type */}
            <div>
              <label className='block text-sm font-medium mb-1'>Question Type</label>
              <Select
                selectedKeys={[question.type]}
                onChange={(e) => {
                  const newType = e.target.value;
                  setFieldValue(`questions[${questionIndex}].type`, newType);
                  if (newType !== "coding") {
                    setFieldValue(`questions[${questionIndex}].timeLimit`, undefined);
                    setFieldValue(`questions[${questionIndex}].language`, undefined);
                  }
                }}>
                <SelectItem key='verbal'>Verbal</SelectItem>
                <SelectItem key='coding'>Coding</SelectItem>
              </Select>
            </div>

            {/* Is Random */}
            <div>
              <Checkbox isSelected={question.isRandom} onChange={(e) => setFieldValue(`questions[${questionIndex}].isRandom`, e.target.checked)}>
                Randomize Question
              </Checkbox>
            </div>

            {/* Question Text */}
            <div>
              <label className='block text-sm font-medium mb-1'>Question Text</label>
              <Textarea variant='bordered' placeholder='Enter your question' value={question.text} isInvalid={!!(questionError as any)?.text && (questionTouched as any)?.text} errorMessage={(questionError as any)?.text} onChange={(e) => setFieldValue(`questions[${questionIndex}].text`, e.target.value)} />
            </div>

            {/* Explanation */}
            <div>
              <label className='block text-sm font-medium mb-1'>Explanation (optional)</label>
              <RichTextEditor value={question.explanation || ""} onChange={(val) => setFieldValue(`questions[${questionIndex}].explanation`, val)} />
            </div>

            {/* Coding Specific Fields */}
            {question.type === "coding" && (
              <>
                <Divider />
                <CodingQuestionOptions index={questionIndex} question={question} errors={errors} touched={touched} setFieldValue={setFieldValue} values={values} />
              </>
            )}
          </div>
        )}
      </DrawerBody>

      <DrawerFooter>
        {isEdit ? (
          <Button color='primary' onPress={onClose}>
            Save Changes
          </Button>
        ) : (
          <Button color='success' onPress={handleAddNewQuestion}>
            Add Question
          </Button>
        )}
      </DrawerFooter>
    </Drawer>
  );
};
