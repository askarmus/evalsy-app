import { Question } from '@/app/interview/start/[id]/stores/useInterviewStore';
import Vapi from '@vapi-ai/web';

export const vapi = new Vapi(process.env.VAPI_API_KEY!);

export const createInterviewAssistant = async (interviewData: { questions: Question[]; role: string; level: string; userName: string; resultId: string; userId: string }) => {
  // Format the questions for the prompt
  const formattedQuestions = '- ' + interviewData.questions.map((q) => q.text).join('\n- ');

  const call = await vapi.start({
    name: 'Evalsy AI Interviewer',
    server: {
      url: process.env.VAPI_WEBHOOK_URL,
      headers: {
        Authorization: `Bearer ${process.env.VAPI_API_KEY!}`,
        interviewResultId: interviewData.resultId,
        userId: interviewData.userId,
      },
      timeoutSeconds: 200,
    },
    transcriber: {
      provider: 'deepgram',
      model: 'nova-2',
      language: 'en',
    },
    artifactPlan: {
      recordingEnabled: true,
      videoRecordingEnabled: true,
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
    metadata: {
      interviewId: 10,
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
    clientMessages: ['transcript', 'status-update', 'speech-update', 'model-output', 'conversation-update', 'hang'] as any,

    serverMessages: ['transcript', 'status-update', 'end-of-call-report', 'speech-update', 'conversation-update'] as any,
  });

  if (call?.id) {
    // ✅ Trigger camera and speech start
    vapi.send({
      type: 'control',
      control: 'say-first-message',
      videoRecordingStartDelaySeconds: 1,
    });
  }
  return call;
};
