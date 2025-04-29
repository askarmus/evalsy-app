export type Question = { id: string; text: string; expectedScore: number; isRandom: boolean; type: string; timeLimit?: number; language?: string; explanation?: string; starterCode?: string };

export interface AddJobFormValues {
  jobTitle: string;
  questions: Question[];
  totalRandomVerbalQuestion: number;
  totalRandomCodingQuestion: number;
  experienceLevel: string;
  description: string;
}
