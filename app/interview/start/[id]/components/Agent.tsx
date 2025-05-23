'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { createInterviewAssistant, vapi } from '@/lib/data/vapi.sdk';
import { interviewer } from '@/constants';

enum CallStatus {
  INACTIVE = 'INACTIVE',
  CONNECTING = 'CONNECTING',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
}

interface SavedMessage {
  role: 'user' | 'system' | 'assistant';
  content: string;
}

const Agent = ({ userName, userId, type, interviewId, questions }: AgentProps) => {
  const router = useRouter();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);

  useEffect(() => {
    console.log('🎬 Setting up Vapi event listeners...');

    const onCallStart = () => {
      console.log('🔔 Call started');
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      console.log('🔕 Call ended');
      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = async (message: Message) => {
      console.log('📨 Received message from Vapi:', message);

      if (message.type === 'transcript' && message.transcriptType === 'final') {
        console.log('✅ Final transcript:', message.transcript);

        const userInput = message.transcript;
        const newMessage = { role: message.role, content: userInput };
        setMessages((prev) => [...prev, newMessage]);

        try {
          console.log('↩️ Sending user message to assistant...');
          await vapi.send({
            type: 'add-message',
            message: {
              role: 'user',
              content: userInput,
            },
          });
        } catch (err) {
          console.error('❌ Failed to send user message:', err);
        }
      }
    };

    const onSpeechStart = () => {
      console.log('🎙️ Speech started');
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      console.log('🔇 Speech ended');
      setIsSpeaking(false);
    };

    const onError = (error: Error) => {
      console.error('🚨 Vapi error:', error);
    };

    vapi.on('call-start', onCallStart);
    vapi.on('call-end', onCallEnd);
    vapi.on('message', onMessage);
    vapi.on('speech-start', onSpeechStart);
    vapi.on('speech-end', onSpeechEnd);
    vapi.on('error', onError);

    return () => {
      vapi.off('call-start', onCallStart);
      vapi.off('call-end', onCallEnd);
      vapi.off('message', onMessage);
      vapi.off('speech-start', onSpeechStart);
      vapi.off('speech-end', onSpeechEnd);
      vapi.off('error', onError);
    };
  }, []);

  const handleCall = async () => {
    console.log('📞 Call initiated');

    try {
      setCallStatus(CallStatus.CONNECTING);

      if (!userId) {
        console.error('⚠️ Missing userId – cannot start interview');
        setCallStatus(CallStatus.INACTIVE);
        return;
      }

      const baseInterviewData = {
        userName,
        userId,
        role: 'Full Stack Developer',
        level: 'Mid-level',
        techstack: ['React', 'TypeScript', 'Node.js'],
      };

      console.log('🚀 Starting assistant for type:', type);

      if (type === 'generate') {
        console.log('🧠 Using default generated questions');
        await createInterviewAssistant({
          ...baseInterviewData,
          questions: ['Tell me about your experience with web development', 'How do you approach learning new technologies?', "Can you describe a challenging project you've worked on recently?", 'What are your strengths as a developer?', 'Do you have any questions about the position?'],
        });
      } else {
        if (!questions || questions.length === 0) {
          console.error('⚠️ No questions provided for interview');
          setCallStatus(CallStatus.INACTIVE);
          return;
        }

        console.log('🧾 Using custom provided questions:', questions);

        const interviewerConfig = JSON.parse(JSON.stringify(interviewer));

        if (interviewerConfig.model.messages && interviewerConfig.model.messages.length > 0) {
          const systemPrompt = interviewerConfig.model.messages[0].content;
          const formattedQuestions = questions.join('\n- ');
          interviewerConfig.model.messages[0].content = systemPrompt.replace('{{questions}}', `- ${formattedQuestions}`);
        }

        interviewerConfig.firstMessage = `Hello ${userName}! Thank you for taking the time to speak with me today. I'm excited to learn more about you and your experience as a ${baseInterviewData.role}.`;

        await createInterviewAssistant({
          ...baseInterviewData,
          questions,
        });
      }
    } catch (error) {
      console.error('❌ Error starting interview:', error);
      setCallStatus(CallStatus.INACTIVE);
    }
  };

  const handleDisconnect = async () => {
    console.log('📴 Disconnecting call...');
    try {
      setCallStatus(CallStatus.FINISHED);
      await vapi.stop();
    } catch (error) {
      console.error('❌ Error stopping interview:', error);
    }
  };

  const latestMessage = messages[messages.length - 1]?.content || '';

  const isCallInactiveOrFinished = callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED;

  return (
    <>
      <div className="card-interviewer">
        <div className="avatar">
          <Image src="/ai-avatar.png" alt="vapi" width={65} height={54} className="object-cover" />
          {isSpeaking && <span className="animate-speak" />}
        </div>
        <h3>AI Interviewer</h3>
      </div>

      {/* <div className="w-full flex justify-center">
        {callStatus !== 'ACTIVE' ? (
          <button className="relative btn-call" onClick={handleCall}>
            <span className={cn('absolute animate-ping rounded-full opacity-75', callStatus !== 'CONNECTING' && 'hidden')} />
            <span>{isCallInactiveOrFinished ? 'Call' : '. . .'}</span>
          </button>
        ) : (
          <button className="btn-disconnect" onClick={handleDisconnect}>
            End
          </button>
        )}
      </div> */}
    </>
  );
};

export default Agent;
