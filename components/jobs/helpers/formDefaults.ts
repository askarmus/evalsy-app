import { nanoid } from 'nanoid';
import { AddJobFormValues } from '../types';

export const defaultJobFormValues: AddJobFormValues = {
  jobTitle: '',
  totalRandomVerbalQuestion: 0,
  totalRandomCodingQuestion: 0,
  questions: [
    {
      id: nanoid(),
      text: 'Tell me about yourself and your experience',
      expectedScore: 20,
      isRandom: false,
      type: 'verbal',
      timeLimit: 0,
      language: '',
      explanation: '',
      starterCode: '',
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
