'use client';

import { Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerContent, Button, Select, SelectItem, Checkbox, Textarea, Input } from '@heroui/react';
import { Formik, FormikErrors } from 'formik';
import { AddJobSchema } from '@/helpers/schemas';
import { nanoid } from 'nanoid';
import { ArraySchema } from 'yup';
import RichTextEditor from '../../../shared/RichTextEditor';
import { languages } from '@/config/languages';

interface QuestionEditDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'add' | 'edit';
  initialQuestion: any;
  onSave: (question: any) => void;
}

export const QuestionEditDrawer = ({ isOpen, onOpenChange, mode, initialQuestion, onSave }: QuestionEditDrawerProps) => {
  const isEdit = mode === 'edit';

  const questionSchema = (AddJobSchema.fields.questions as ArraySchema<any[], any>).innerType;

  const handleCreateNewQuestion = () => ({
    id: nanoid(),
    text: '',
    expectedScore: 20,
    isRandom: true,
    type: 'verbal',
    timeLimit: 0,
    language: '',
    starterCode: '',
    explanation: '',
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
            }}
          >
            {({ values, errors, touched, handleChange, setFieldValue, handleSubmit }) => (
              <>
                <DrawerHeader>{isEdit ? 'Edit Question' : 'Add New Question'}</DrawerHeader>

                <DrawerBody>
                  <div className="flex flex-col gap-4">
                    {/* Question Text */}
                    <div>
                      <label className="block text-sm font-medium mb-1">Question Text</label>
                      <Textarea variant="bordered" placeholder="Enter your question" value={values.text} isInvalid={Boolean(touched.text) && Boolean(errors.text)} onChange={handleChange('text')} />
                    </div>
                  </div>
                </DrawerBody>

                {/* Footer Buttons */}
                <DrawerFooter>
                  <Button variant="light" color="danger" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button color="primary" onPress={() => handleSubmit()}>
                    {isEdit ? 'Update Changes' : 'Add Question'}
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
