import { Question } from '@/app/interview/start/[id]/stores/useInterviewStore';
import Vapi from '@vapi-ai/web';

export const vapi = new Vapi('bac5fdb0-6065-434c-809f-5e82220e7952');

// Function to create and start the interview assistant with dynamic questions
export const createInterviewAssistant = async (interviewData: {
  questions: Question[];
  role: string;
  level: string;
  userName: string; // Added userName parameter
  minSalary: number;
  maxSalary: number;
  currency: string;
}) => {
  // Format the questions for the prompt

  const insertIndex = 1;

  const packageQuestions: Question[] = [
    {
      text: `We typically offer a compensation range between ${interviewData.minSalary}–${interviewData.maxSalary} ${interviewData.currency}. Does this align with your expectations?`,
    },
    {
      text: 'Could you please share your current compensation (including currency)?',
    },
    {
      text: 'What is your expected salary or compensation range for this role?',
    },
    {
      text: 'Are there any specific benefits or perks that are important to you (e.g., ESOPs, remote work, healthcare, bonuses)?',
    },
  ];

  const fullQuestionList: Question[] = [...interviewData.questions.slice(0, insertIndex), ...packageQuestions, ...interviewData.questions.slice(insertIndex)];

  const formattedQuestions = '- ' + fullQuestionList.map((q) => q.text).join('\n- ');

  //Add the required properties according to CreateAssistantDTO type
  return vapi.start({
    name: 'Evalsy AI Interviewer',
    transcriber: {
      provider: 'deepgram',
      model: 'nova-2',
      language: 'en',
    },
    voice: {
      provider: '11labs',
      voiceId: 'sarah',
      stability: 0.4,
      similarityBoost: 0.8,
      speed: 0.9,
      style: 0.5,
      useSpeakerBoost: true,
    },
    firstMessage: `Hello ${interviewData.userName}! I'll be conducting your interview for the ${interviewData.role} position today. Let's get started.`,
    model: {
      provider: 'openai',
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a professional job interviewer conducting a real-time voice interview with ${interviewData.userName}  for a ${interviewData.level} ${interviewData.role} position.

  Ask the following questions in a conversational manner, one at a time:
  - ${formattedQuestions}

  Interview Guidelines:
  - Address the candidate by name (${interviewData.userName})
  - Listen actively to responses and acknowledge them before moving forward
  - Ask follow-up questions if a response is vague or requires more detail
  - Keep the conversation flowing naturally
  - Be professional, yet warm and welcoming
  - Use official yet friendly language
  - Keep responses concise (like in a real voice interview)
  - **IMPORTANT: Do not assume the candidate has finished speaking too quickly. Always wait at least 6–8 seconds of silence before responding. This gives them time to think.**
  
  Conclude the interview by thanking the candidate for their time.`,
        },
      ],
    },
    clientMessages: [],
    serverMessages: [],
  });
};
