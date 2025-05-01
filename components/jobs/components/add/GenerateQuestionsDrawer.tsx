"use client";
import { Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, Button, Input, Textarea, Radio, RadioGroup, Select, SelectItem } from "@heroui/react";
import { useState } from "react";
import { nanoid } from "nanoid";
import { generateQuestions } from "@/services/job.service";
import { showToast } from "@/app/utils/toastUtils";
import { languages } from "@/config/languages";
import { Question } from "../../types";

interface GenerateQuestionsDrawerProps {
  isOpen: boolean;
  jobTitle: string;
  description: string;
  onOpenChange: (open: boolean) => void;
  onQuestionsGenerated: (questions: Question[]) => void;
}

export const GenerateQuestionsDrawer = ({ isOpen, jobTitle, description, onOpenChange, onQuestionsGenerated }: GenerateQuestionsDrawerProps) => {
  const [isGenerating, setGenerating] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [selectedType, setSelectedType] = useState<"verbal" | "coding">("verbal");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("javascript");

  const handleGenerateQuestions = async () => {
    if (jobTitle && description) {
      setGenerating(true);

      try {
        const result = await generateQuestions({
          jobTitle: jobTitle,
          expertiseLevel: experienceLevel,
          noOfQuestions: totalQuestions,
          description: description,
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

        onQuestionsGenerated(newQuestions);

        console.log("Generated questions:", newQuestions);

        showToast.success(result.message || "Questions generated successfully");
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

  return (
    <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        {(onClose) => (
          <>
            <DrawerHeader className='flex flex-col gap-1'>Generate Questions using AI</DrawerHeader>
            <DrawerBody>
              <div className='flex flex-col gap-6'>
                <RadioGroup size='sm' label='Select the experience level' orientation='horizontal' value={experienceLevel} onValueChange={(value) => setExperienceLevel(value)}>
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
                <Input size='sm' placeholder='Total questions to generate' label='Total' type='number' min='1' className='w-full text-center' onChange={(e) => setTotalQuestions(Number(e.target.value))} />
              </div>
            </DrawerBody>
            <DrawerFooter>
              <Button color='danger' variant='light' onPress={onClose}>
                Close
              </Button>
              <Button color='primary' isLoading={isGenerating} onPress={handleGenerateQuestions} isDisabled={isGenerating}>
                Generate Questions
              </Button>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
};
