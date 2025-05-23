import Vapi from '@vapi-ai/web';

export const vapi = new Vapi('bac5fdb0-6065-434c-809f-5e82220e7952');

// Function to fetch interview questions from your Gemini-powered API using axios

// Function to create and start the interview assistant with dynamic questions
export const createInterviewAssistant = async (interviewData: {
  questions: string[];
  role: string;
  level: string;
  techstack: string[];
  userName: string; // Added userName parameter
  userId: string; // Added userId parameter
}) => {
  // Format the questions for the prompt
  const formattedQuestions = interviewData.questions.join('\n- ');

  console.log('Formatted Questions:', formattedQuestions);
  // Add the required properties according to CreateAssistantDTO type
  return vapi.start({
    name: 'PrepWise AI Interviewer',
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
          content: `You are a professional job interviewer conducting a real-time voice interview with ${interviewData.userName} (user ID: ${interviewData.userId}) for a ${interviewData.level} ${interviewData.role} position.

The required tech stack includes: ${interviewData.techstack.join(', ')}.

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

Conclude the interview by thanking the candidate for their time.`,
        },
      ],
    },
    clientMessages: [],
    serverMessages: [],
  });
};
