"use client";
import { Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, Button, Input, Textarea, Radio, RadioGroup, Select, SelectItem } from "@heroui/react";
import { useFormikContext } from "formik";
import { useState } from "react";
import { nanoid } from "nanoid";
import { generateQuestions } from "@/services/job.service";
import { showToast } from "@/app/utils/toastUtils";
import { AddJobFormValues } from "../../types";
import { languages } from "@/config/languages";
import { time } from "console";

interface GenerateQuestionsDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  prompt: string;
  setPrompt: (prompt: string) => void;
  totalQuestions: number;
  setTotalQuestions: (questions: number) => void;
}

export const GenerateQuestionsDrawer = ({ isOpen, onOpenChange, prompt, setPrompt, totalQuestions, setTotalQuestions }: GenerateQuestionsDrawerProps) => {
  const { values, setFieldValue, validateForm } = useFormikContext<AddJobFormValues>();
  const [isGenerating, setGenerating] = useState(false);
  const [selectedType, setSelectedType] = useState<"verbal" | "coding">("verbal");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("javascript");

  const handleGenerateQuestions = async () => {
    const errors = await validateForm();

    if (!errors.jobTitle && !errors.experienceLevel) {
      setGenerating(true);

      try {
        const result = await generateQuestions({
          jobTitle: values.jobTitle,
          expertiseLevel: values.experienceLevel,
          noOfQuestions: totalQuestions,
          description: values.description,
          prompt: prompt,
          type: selectedType,
          language: selectedType === "coding" ? selectedLanguage : undefined,
        });

        if (!Array.isArray(result.data) || result.data.length === 0) {
          showToast.error("No questions generated. Please try again.");
          return;
        }

        const newQuestions = result.data.map((item: { text: string; timeLimit: number; explanation: number; starterCode: string }) => ({
          id: nanoid(),
          text: item.text,
          expectedScore: 3,
          isRandom: true,
          type: selectedType,
          timeLimit: item.timeLimit,
          language: selectedLanguage,
          explanation: item.explanation,
          starterCode: item.starterCode,
        }));

        console.log("Old questions:", ...values.questions);
        console.log("Generated questions:", newQuestions);

        setFieldValue("questions", [...values.questions, ...newQuestions]);
        showToast.success(result.message || "Questions generated successfully");
        onOpenChange(false); // close drawer
      } catch (error: any) {
        console.error("Error generating questions:", error);
        showToast.error(error.message || "Failed to generate questions. Please try again.");
      } finally {
        setGenerating(false);
      }
    } else {
      showToast.error("Job title and expertise level are required");
    }
  };

  const isButtonDisabled = !values.experienceLevel || totalQuestions <= 0;

  return (
    <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        {(onClose) => (
          <>
            <DrawerHeader className='flex flex-col gap-1'>Generate Questions using AI</DrawerHeader>
            <DrawerBody>
              <div className='flex flex-col gap-6'>
                <RadioGroup size='sm' label='Select the experience level' orientation='horizontal' value={values.experienceLevel} onValueChange={(value) => setFieldValue("experienceLevel", value)}>
                  <Radio value='beginner'>Beginner</Radio>
                  <Radio value='intermediate'>Intermediate</Radio>
                  <Radio value='senior'>Senior</Radio>
                  <Radio value='expert'>Expert</Radio>
                </RadioGroup>

                <Select aria-label='Type' className='w-full' size='sm' selectedKeys={[selectedType]} onChange={(e) => setSelectedType(e.target.value as "verbal" | "coding")}>
                  <SelectItem key='verbal' textValue='Verbal'>
                    Verbal
                  </SelectItem>
                  <SelectItem key='coding' textValue='Coding'>
                    Coding
                  </SelectItem>
                </Select>
                {selectedType === "coding" && (
                  <Select aria-label='Language' className='w-full' size='sm' selectedKeys={[selectedLanguage]} onChange={(e) => setSelectedLanguage(e.target.value)}>
                    {languages.map((lang) => (
                      <SelectItem key={lang.monacoLang} textValue={lang.label}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </Select>
                )}

                <Textarea
                  size='sm'
                  placeholder='Enter your additional prompt here'
                  label='Prompt'
                  minRows={3}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  classNames={{
                    base: "w-full",
                    input: "resize-y min-h-[60px]",
                  }}
                />
                <Input size='sm' placeholder='Total questions to generate' label='Total' type='number' min='1' className='w-full text-center' value={totalQuestions.toString()} onChange={(e) => setTotalQuestions(Number(e.target.value))} />
              </div>
            </DrawerBody>
            <DrawerFooter>
              <Button color='danger' variant='light' onPress={onClose}>
                Close
              </Button>
              <Button
                color='primary'
                isLoading={isGenerating}
                onPress={handleGenerateQuestions}
                isDisabled={isButtonDisabled} // <-- button disabled here!
              >
                Generate Questions
              </Button>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
};
