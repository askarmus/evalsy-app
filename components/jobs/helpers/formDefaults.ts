import { nanoid } from 'nanoid';
import { AddJobFormValues } from '../types';

export const defaultJobFormValues: AddJobFormValues = {
  jobTitle: '',
  totalRandomVerbalQuestion: 0,
  totalRandomCodingQuestion: 0,
  invitationExpireInDays: 7,
  durationInMinutes: 10,
  questions: [
    {
      id: nanoid(),
      text: 'Tell me about yourself and your experience',
      expectedScore: 20,
      isRandom: false,
    },
    {
      id: nanoid(),
      text: 'Could you please share your current salary along with the currency? Additionally, what are your salary expectations for this role?',
      expectedScore: 20,
      isRandom: false,
    },
  ],
  experienceLevel: '',
  workplaceType: '',
  country: '',
  city: '',
  currency: '',
  minSalary: 0,
  maxSalary: 0,
  showSalaryInDescription: false,

  description: '',
  fraudDetection: {
    tabSwitch: true,
    rightClick: true,
    devTools: true,
    faceNotDetected: false,
    clipboard: true,
  },
};
