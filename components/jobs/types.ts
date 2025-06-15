export type Question = { id: string; text: string; expectedScore: number; isRandom: boolean };

export interface AddJobFormValues {
  jobTitle: string;
  questions: Question[];
  totalRandomVerbalQuestion: number;
  totalRandomCodingQuestion: number;
  experienceLevel: string;
  description: string;
  prompt?: string;
  invitationExpireInDays: number;
  durationInMinutes: number;
  workplaceType: string;
  country?: string;
  city?: string;
  currency: string;
  minSalary: number;
  maxSalary: number;
  showSalaryInDescription: boolean;

  fraudDetection: {
    tabSwitch: boolean;
    rightClick: boolean;
    devTools: boolean;
    faceNotDetected: boolean;
    clipboard: boolean;
  };
}

export type FraudDetectionSettings = {
  tabSwitch: boolean;
  rightClick: boolean;
  devTools: boolean;
  faceNotDetected: boolean;
  clipboard: boolean;
};
