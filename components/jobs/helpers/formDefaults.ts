import { nanoid } from 'nanoid';
import { AddJobFormValues } from '../types';

export const defaultJobFormValues: AddJobFormValues = {
  jobTitle: '',
  totalRandomVerbalQuestion: 0,
  totalRandomCodingQuestion: 0,
  expires: '',
  duration: 15,
  questions: [
    {
      id: nanoid(),
      text: 'Tell me about yourself and your experience',
      expectedScore: 20,
      isRandom: false,
    },
  ],
  experienceLevel: 'beginner',
  description: '',
  fraudDetection: {
    tabSwitch: true,
    rightClick: true,
    devTools: true,
    faceNotDetected: false,
    clipboard: true,
  },
};
