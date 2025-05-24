import React, { useEffect, useState } from 'react';
import { useInterviewStore } from '../stores/useInterviewStore';
import UserCamera from './UserCamera';
import InterviewNavbar from './InterviewNavbar';
import { Button, Card, CardBody } from '@heroui/react';
import CandidateInfo from './CandidateInfo';
import PoweredBy from './PoweredBy';
import { AntiCheat } from './AntiCheat';
import ConfirmDialog from '@/components/ConfirmDialog';
import Image from 'next/image';
import { createInterviewAssistant, vapi } from '@/lib/data/vapi.sdk';
import { updateVapiCallId } from '@/services/interview.service';

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

const InterviewNavigator: React.FC = () => {
  const { questions, invitationId, micDeviceId, candidate, job, company, endInterview, isLoading } = useInterviewStore();
  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false);
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

  const handleEndClick = () => {
    setConfirmDialogOpen(true);
  };

  const handleConfirmEnd = async () => {
    try {
      console.log('📴 Disconnecting call...');
      try {
        setCallStatus(CallStatus.FINISHED);
        await vapi.stop();
      } catch (error) {
        console.error('❌ Error stopping interview:', error);
      }
      await endInterview();
      setConfirmDialogOpen(false);
    } catch (error) {
      console.error('Error ending interview', error);
    }
  };

  const handleCancelEnd = () => {
    setConfirmDialogOpen(false);
  };

  const isCallInactiveOrFinished = callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED;
  return (
    <div className="min-h-screen flex items-center justify-center  ">
      <div className="w-full max-w-screen-lg mx-auto px-6 py-8">
        <InterviewNavbar company={company} />
        <AntiCheat invitationId={invitationId} fraudDetection={job.fraudDetection} />
        <Card className="w-full p-0 mt-6  ">
          <CardBody className="p-0">
            <CandidateInfo candidate={candidate} job={job} company={company} questions={questions} invitationId={invitationId} />
            <div className="grid md:grid-cols-6 gap-0">
              <div className="md:col-span-3   p-4 border-l border-gray-200 dark:border-gray-900 flex items-center justify-center">
                <div className="card-interviewer">
                  <div className="avatar">
                    <Image src="/ai-avatar.png" alt="vapi" width={65} height={54} className="object-cover" />
                    {isSpeaking && <span className="animate-speak" />}
                  </div>
                  <h3>AI Interviewer</h3>
                </div>
              </div>

              <div className="md:col-span-3  ">
                <UserCamera height="500" hideRecLabel={false} invitationId={invitationId} />
              </div>
            </div>
            <div className="p-6 flex items-center justify-center  rounded-b-xl border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-3">
              <div className="flex items-center gap-2">
                <>
                  <div className="w-full flex justify-center">
                    {callStatus !== 'ACTIVE' && (
                      <Button onPress={handleEndClick} isDisabled={isLoading} isLoading={isLoading} color="danger" size="lg" variant="shadow" radius="full">
                        End Interview
                      </Button>
                    )}
                  </div>
                </>
              </div>
              <ConfirmDialog isOpen={isConfirmDialogOpen} onClose={handleCancelEnd} title="End Interview" description="Are you sure you want to end the interview?" onConfirm={handleConfirmEnd} confirmButtonText="End" cancelButtonText="Cancel" />
            </div>
          </CardBody>
        </Card>
        <PoweredBy />
      </div>
    </div>
  );
};

export default InterviewNavigator;
