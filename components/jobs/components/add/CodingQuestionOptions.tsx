"use client";
import React from "react";
import { Input, Select, SelectItem } from "@heroui/react";
import { FormikErrors } from "formik";
import { languages } from "@/config/languages";
import { Question } from "../../types";
import RichTextEditor from "@/components/shared/RichTextEditor";

interface CodingQuestionOptionsProps {
  index: number;
  question: Question;
  errors: FormikErrors<{ questions: Question[] }>;
  touched: { questions?: any };
  setFieldValue: (field: string, value: any) => void;
  values: { questions: Question[] };
}

export const CodingQuestionOptions = ({ index, question, errors, touched, setFieldValue, values }: CodingQuestionOptionsProps) => {
  return (
    <div>
      <div className='text-sm text-gray-500 mb-2'>Coding Question Options</div>
      <div className='flex flex-wrap gap-6 items-start'>
        {/* Time Limit Input */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Time Limit (minutes)</label>
          <div className='relative'>
            <Input size='sm' type='number' value={question.timeLimit?.toString() || ""} placeholder='Enter time limit' min={1} className='max-w-[120px]' isInvalid={!!(errors.questions?.[index] as FormikErrors<Question>)?.timeLimit && touched.questions?.[index]?.timeLimit} errorMessage={(errors.questions?.[index] as FormikErrors<Question>)?.timeLimit} onChange={(e) => setFieldValue(`questions[${index}].timeLimit`, Number(e.target.value))} />
          </div>
        </div>

        {/* Language Select */}

        {/* Explanation Editor */}
        <div className='flex-1 min-w-[300px]'>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Explanation</label>
          <div className='relative'>
            <RichTextEditor value={question.starterCode || ""} onChange={(newVal) => setFieldValue(`questions[${index}].starterCode`, newVal)} />
          </div>
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Language</label>
          <div className='relative'>
            <Select
              className='w-48'
              selectedKeys={values.questions[index].language ? [values.questions[index].language] : []}
              onChange={(e) => {
                const selectedLanguage = e.target.value;
                setFieldValue(`questions[${index}].language`, selectedLanguage);
              }}
              size='sm'
              isInvalid={!!(errors.questions?.[index] as FormikErrors<Question>)?.language}
              errorMessage={(errors.questions?.[index] as FormikErrors<Question>)?.language}>
              {languages.map((lang) => (
                <SelectItem key={lang.monacoLang}>{lang.label}</SelectItem>
              ))}
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};
