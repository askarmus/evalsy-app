'use client';

import { Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerContent, Button, Select, SelectItem, Checkbox, Textarea, Input } from '@heroui/react';
import { Formik } from 'formik';
import { AddJobSchema } from '@/helpers/schemas';
import { nanoid } from 'nanoid';
import { ArraySchema } from 'yup';

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
  });

  return (
    <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        {(onClose) => (
          <Formik
            initialValues={initialQuestion || handleCreateNewQuestion()}
            validationSchema={questionSchema}
            onSubmit={(values, { resetForm }) => {
              onSave(values);

              if (!isEdit) {
                resetForm({ values: handleCreateNewQuestion() }); // Clear form for next question
              }
            }}
          >
            {({ values, errors, touched, handleChange, setFieldValue, handleSubmit }) => (
              <>
                <DrawerHeader>{isEdit ? 'Edit Question' : 'Add New Question'}</DrawerHeader>

                <DrawerBody>
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between gap-4">
                      <div className="flex items-end flex-1">
                        <Checkbox isSelected={values.isRandom} onChange={(e) => setFieldValue('isRandom', e.target.checked)}>
                          Optional Question
                        </Checkbox>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Question Text</label>
                      <Textarea variant="bordered" placeholder="Enter your question" value={values.text} isInvalid={Boolean(touched.text) && Boolean(errors.text)} onChange={handleChange('text')} />
                    </div>
                  </div>
                </DrawerBody>

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
