import { Question } from '@/app/interview/start/[id]/stores/useInterviewStore';
import Vapi from '@vapi-ai/web';
import { AssistantOverrides } from '@vapi-ai/web/dist/api';
import { interview_promtp } from './interview.prompt';

export const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!);

export const createInterviewAssistant = async (interviewData: { questions: Question[]; role: string; level: string; userName: string; resultId: string; userId: string; voiceName: string }) => {
  // Format the questions for the prompt
  const formattedQuestions = '- ' + interviewData.questions.map((q) => q.text).join('\n- ');

  var interviewPromtp = interview_promtp.replaceAll('{{userName}}', interviewData.userName).replaceAll('{{level}}', interviewData.level).replaceAll('{{role}}', interviewData.role).replaceAll('{{formattedQuestions}}', formattedQuestions);

  const assistantOverridesOpenAI = {
    model: {
      provider: 'groq',
      model: 'llama-3.1-8b-instant',
      temperature: 0.2,
      messages: [{ role: 'system', content: interviewPromtp }],
    },
    voice: {
      provider: '11labs',
      voiceId: interviewData.voiceName.toLowerCase(),
      stability: 0.4,
      similarityBoost: 0.8,
      speed: 0.9,
      style: 0.5,
      useSpeakerBoost: true,
    },
    server: {
      url: process.env.NEXT_PUBLIC_VAPI_WEBHOOK_URL,
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_VAPI_API_KEY!}`,
        interviewResultId: interviewData.resultId,
        userId: interviewData.userId,
      },
      timeoutSeconds: 200,
    },
    firstMessage: `Hello ${interviewData.userName}! I'll be conducting your interview for the ${interviewData.role} position today. Let's get started.`,
    firstMessageMode: 'assistant-speaks-first',
  } satisfies AssistantOverrides;

  var call = await vapi.start('365bc13a-dfb9-4144-8862-bd8ae3472475', assistantOverridesOpenAI);

  return call;
};

// import { Question } from '@/app/interview/start/[id]/stores/useInterviewStore';
// import Vapi from '@vapi-ai/web';
// import { AssistantOverrides } from '@vapi-ai/web/dist/api';

// export const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!);

// export const createInterviewAssistant = async (interviewData: { questions: Question[]; role: string; level: string; userName: string; resultId: string; userId: string }) => {
//   // Format the questions for the prompt
//   const formattedQuestions = '- ' + interviewData.questions.map((q) => q.text).join('\n- ');

//   var content = `
// You are "Evalsy AI Interviewer" conducting a real-time voice interview with {{userName}} for a {{level}} {{role}} position.

// # Objectives
// - Ask the provided questions one by one in a conversational, professional tone.
// - Keep the conversation narrowly focused on those questions and the candidate’s answers.
// - Stay in English at all times.

// # Question Set (ask in order; adapt follow-ups only to clarify their answer)
// {{formattedQuestions}}

// # Conversation Rules
// - Address the candidate by name (“{{userName}}”).
// - Pacing: Wait at least 6–8 seconds of silence before responding so they can think. Do **not** interrupt mid-thought.
// - Brevity: Keep your turns concise (1–2 sentences), unless you’re reading the next question or clarifying.
// - Follow-ups: If an answer is vague/incomplete, ask **one** short follow-up, then move on.
// - Scope guard:
//   - Only discuss the job, their background, and the provided questions.
//   - If the candidate asks about compensation/HR/policies or anything unrelated, say you’re not the right person and bring them back to the current question.
//   - If the candidate asks you a technical question that would require coaching or giving them the answer, politely decline and continue with the interview.
// - Language guard:
//   - If the candidate speaks in a non-English language, reply once: “Let’s keep this interview in English, please.” Then restate the last question in simple English and continue.
// - Long silence handler:
//    - If there is ~60 seconds of silence, re-engage once:
//      “Would you like more time to think, want me to repeat the question, or shall I move on to the next one?”
//    - If they say more time → acknowledge (“No problem—take your time.”) and wait ~30–45 seconds, then check in again briefly.
//    - If they say repeat → restate the question clearly and wait.
//    - If they say move on → proceed to the next question.
//    - If silence continues with no clear answer → move on automatically.
//    - If silence continues after the re-engagement, proceed to the next question.
// - Off-topic or tool misuse:
//   - If asked to do tasks outside interviewing (write code for them, browse, etc.), decline and return to the current question.
// - Safety/professionalism:
//   - Avoid discriminatory or inappropriate topics. If prompted, decline and proceed.
//   - Maintain a warm, respectful tone.
//   - if the candiate silince for 15 sec start he convesation again

// # Flow
// 1) Greet and state the role.
// 2) Ask Question 1.
// 3) For each answer: wait, optionally ask one follow-up if needed, then proceed.
// 4) After the final question: thank them, mention that results will be reviewed, and end.

// # Ending
// Conclude with: “Thanks for your time, {{userName}}. We’ll review your responses and follow up with next steps.”
//       `
//     .replaceAll('{{userName}}', interviewData.userName)
//     .replaceAll('{{level}}', interviewData.level)
//     .replaceAll('{{role}}', interviewData.role)
//     .replaceAll('{{formattedQuestions}}', formattedQuestions);

//   const assistantOverridesOpenAI = {
//     model: {
//       provider: 'openai',
//       model: 'gpt-4o-mini', // or your allowed OpenAI model id
//       temperature: 0.2,
//       messages: [{ role: 'system', content: content }],
//     },
//     // optional voice override (example)
//     // voice: { provider: "11labs", voiceId: "YOUR_11LABS_VOICE_ID" },

//     // make assistant speak first with your custom greeting
//     firstMessage: `Hello askar , I'll be conducting your software enginner interview now. Let's begin.`,
//     firstMessageMode: 'assistant-speaks-first',

//     // pass variables to fill {{ }} in your Assistant config
//   } satisfies AssistantOverrides;

//   var call =   await vapi.start('365bc13a-dfb9-4144-8862-bd8ae3472475', assistantOverridesOpenAI);

// //   const call = await vapi.start({
// //     name: 'Evalsy AI Interviewer',
// //     server: {
// //       url: process.env.NEXT_PUBLIC_VAPI_WEBHOOK_URL,
// //       headers: {
// //         Authorization: `Bearer ${process.env.NEXT_PUBLIC_VAPI_API_KEY!}`,
// //         interviewResultId: interviewData.resultId,
// //         userId: interviewData.userId,
// //       },
// //       timeoutSeconds: 200,
// //     },
// //     silenceTimeoutSeconds: 300,
// //     transcriber: {
// //       provider: 'deepgram',
// //       model: 'nova-2',
// //       language: 'en',
// //     },
// //     artifactPlan: {
// //       recordingEnabled: true,
// //       videoRecordingEnabled: true,
// //     },
// //     voice: {
// //       provider: '11labs',
// //       voiceId: 'sarah',
// //       stability: 0.4,
// //       similarityBoost: 0.8,
// //       speed: 0.9,
// //       style: 0.5,
// //       useSpeakerBoost: true,
// //     },
// //     metadata: {
// //       interviewId: 10,
// //     },
// //     firstMessage: `Hello ${interviewData.userName}! I'll be conducting your interview for the ${interviewData.role} position today. Let's get started.`,
// //     model: {
// //       provider: 'openai',
// //       model: 'gpt-4o-mini', // or your preferred model
// //       messages: [
// //         {
// //           role: 'system',
// //           content: `
// // You are "Evalsy AI Interviewer" conducting a real-time voice interview with {{userName}} for a {{level}} {{role}} position.

// // # Objectives
// // - Ask the provided questions one by one in a conversational, professional tone.
// // - Keep the conversation narrowly focused on those questions and the candidate’s answers.
// // - Stay in English at all times.

// // # Question Set (ask in order; adapt follow-ups only to clarify their answer)
// // {{formattedQuestions}}

// // # Conversation Rules
// // - Address the candidate by name (“{{userName}}”).
// // - Pacing: Wait at least 6–8 seconds of silence before responding so they can think. Do **not** interrupt mid-thought.
// // - Brevity: Keep your turns concise (1–2 sentences), unless you’re reading the next question or clarifying.
// // - Follow-ups: If an answer is vague/incomplete, ask **one** short follow-up, then move on.
// // - Scope guard:
// //   - Only discuss the job, their background, and the provided questions.
// //   - If the candidate asks about compensation/HR/policies or anything unrelated, say you’re not the right person and bring them back to the current question.
// //   - If the candidate asks you a technical question that would require coaching or giving them the answer, politely decline and continue with the interview.
// // - Language guard:
// //   - If the candidate speaks in a non-English language, reply once: “Let’s keep this interview in English, please.” Then restate the last question in simple English and continue.
// // - Long silence handler:
// //    - If there is ~60 seconds of silence, re-engage once:
// //      “Would you like more time to think, want me to repeat the question, or shall I move on to the next one?”
// //    - If they say more time → acknowledge (“No problem—take your time.”) and wait ~30–45 seconds, then check in again briefly.
// //    - If they say repeat → restate the question clearly and wait.
// //    - If they say move on → proceed to the next question.
// //    - If silence continues with no clear answer → move on automatically.
// //    - If silence continues after the re-engagement, proceed to the next question.
// // - Off-topic or tool misuse:
// //   - If asked to do tasks outside interviewing (write code for them, browse, etc.), decline and return to the current question.
// // - Safety/professionalism:
// //   - Avoid discriminatory or inappropriate topics. If prompted, decline and proceed.
// //   - Maintain a warm, respectful tone.
// //   - if the candiate silince for 15 sec start he convesation again

// // # Flow
// // 1) Greet and state the role.
// // 2) Ask Question 1.
// // 3) For each answer: wait, optionally ask one follow-up if needed, then proceed.
// // 4) After the final question: thank them, mention that results will be reviewed, and end.

// // # Ending
// // Conclude with: “Thanks for your time, {{userName}}. We’ll review your responses and follow up with next steps.”
// //       `
// //             .replaceAll('{{userName}}', interviewData.userName)
// //             .replaceAll('{{level}}', interviewData.level)
// //             .replaceAll('{{role}}', interviewData.role)
// //             .replaceAll('{{formattedQuestions}}', formattedQuestions),
// //         },
// //       ],
// //     },

// //     clientMessages: ['transcript', 'status-update', 'speech-update', 'model-output', 'conversation-update', 'hang'] as any,

// //     serverMessages: ['transcript', 'status-update', 'end-of-call-report', 'speech-update', 'conversation-update'] as any,
// //   });

//   // if (call?.id) {
//   //   // ✅ Trigger camera and speech start
//   //   vapi.send({
//   //     type: 'control',
//   //     control: 'say-first-message',
//   //     videoRecordingStartDelaySeconds: 1,
//   //   });
//   // }
//   return call;
// };
