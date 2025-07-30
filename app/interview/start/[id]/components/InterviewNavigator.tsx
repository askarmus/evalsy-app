import React, { useEffect, useState } from 'react';
import { useInterviewStore } from '../stores/useInterviewStore';
import UserCamera from './UserCamera';
import { Avatar, Button, Card, CardBody, Divider, Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, Tooltip, useDisclosure } from '@heroui/react';
import CandidateInfo from './CandidateInfo';
import PoweredBy from './PoweredBy';
import { AntiCheat } from './AntiCheat';
import ConfirmDialog from '@/components/ConfirmDialog';
import { vapi } from '@/lib/data/vapi.sdk';
import SpeakingIndicatorSoft from './SpeakingIndicator';
import { FaHistory, FaMicrophone, FaMicrophoneSlash, FaTimes, FaVideo, FaVideoSlash } from 'react-icons/fa';
import { Bot, User } from 'lucide-react';
import clsx from 'clsx';

enum CallStatus {
  INACTIVE = 'INACTIVE',
  CONNECTING = 'CONNECTING',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
}

interface Message {
  time: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
}

const InterviewNavigator: React.FC = () => {
  const { questions, invitationId, micDeviceId, phase, candidate, job, company, endInterview, isLoading } = useInterviewStore();
  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [volumeLevel, setVolumeLevel] = useState(0);

  const addMessage = (type: 'user' | 'assistant' | 'system', content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        time: new Date().toLocaleTimeString(),
        type,
        content,
      },
    ]);
  };

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = async (message: any) => {
      // Handle different message types
      if (message.type === 'transcript') {
        if (message.transcriptType === 'final') {
          if (message.role === 'user') {
            addMessage('user', message.transcript);
          } else if (message.role === 'assistant') {
            addMessage('assistant', message.transcript);
          }
        }
      } else if (message.type === 'function-call') {
        addMessage('system', `Function called: ${message.functionCall.name}`);
      } else if (message.type === 'hang') {
        addMessage('system', 'Call ended by assistant');
      }
    };

    const onSpeechStart = () => {
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      setIsSpeaking(false);
    };

    const onError = async (error: Error) => {
      console.error('🚨 Vapi error:', error);
      await handleConfirmEnd();
    };

    vapi.on('call-start', onCallStart);
    vapi.on('call-end', onCallEnd);
    vapi.on('message', onMessage);
    vapi.on('speech-start', onSpeechStart);
    vapi.on('speech-end', onSpeechEnd);
    vapi.on('error', onError);
    vapi.on('volume-level', (volume) => {
      setVolumeLevel(volume);
    });
    return () => {
      vapi.off('call-start', onCallStart);
      vapi.off('call-end', onCallEnd);
      vapi.off('message', onMessage);
      vapi.off('speech-start', onSpeechStart);
      vapi.off('speech-end', onSpeechEnd);
      vapi.off('error', onError);
      vapi.on('volume-level', (volume) => {
        setVolumeLevel(volume);
      });
    };
  }, []);

  const handleEndClick = () => {
    setConfirmDialogOpen(true);
  };
  const handleMute = () => {
    vapi.setMuted(!vapi.isMuted());
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
  const lastMsg = messages[messages.length - 1];

  return (
    <div className="min-h-screen flex items-center justify-center  ">
      <div className="w-full max-w-screen-lg mx-auto px-6 py-8">
        <AntiCheat invitationId={invitationId} fraudDetection={job.fraudDetection} />
        <Card shadow="none" className="w-full p-0 mt-4  ">
          <CardBody className="p-0">
            <CandidateInfo candidate={candidate} job={job} company={company} questions={questions} invitationId={invitationId} />
            <div className="grid md:grid-cols-6 gap-0">
              <div className="md:col-span-3   h-[350px] ">
                <UserCamera isCameraOn={isCameraOn} hideRecLabel={false} invitationId={invitationId} />
              </div>
              <div className="md:col-span-3  bg-gray-900       flex items-center justify-center">
                <SpeakingIndicatorSoft isSpeaking={isSpeaking} />
              </div>
            </div>

            <div
              className="p-4 rounded-b-xl bg-white
                flex flex-col sm:flex-row gap-3
                items-stretch sm:items-center justify-between"
            >
              <div className="flex-1 flex items-start gap-2 min-w-0">
                <div className={clsx('w-10 h-10 shrink-0 flex items-center justify-center rounded-full border-2', lastMsg?.type === 'assistant' ? 'bg-violet-100 border-violet-200' : 'bg-purple-100 border-purple-200')}>{lastMsg?.type === 'assistant' ? <Bot className="w-5 h-5 text-violet-600" /> : <User className="w-5 h-5 text-purple-600" />}</div>

                <p className="text-sm leading-5 break-words whitespace-pre-wrap text-black dark:text-gray-900">{lastMsg?.content ? lastMsg.content : <span className="text-gray-500 dark:text-gray-400">Starting conversation...</span>}</p>
              </div>

              {phase === 'in-progress' && (
                <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
                  <Tooltip content="Conversation History">
                    <Button onPress={onOpen} variant="bordered" radius="full" isIconOnly>
                      <FaHistory color="#1e232fff" />
                    </Button>
                  </Tooltip>

                  <Tooltip content="End Call">
                    <Button onPress={handleEndClick} isDisabled={isLoading} isLoading={isLoading} color="danger" variant="bordered" radius="full" isIconOnly>
                      <FaTimes color="#1e232fff" />
                    </Button>
                  </Tooltip>

                  <Tooltip content={vapi.isMuted() ? 'Unmute' : 'Mute'}>
                    <Button onPress={handleMute} isDisabled={isLoading} isLoading={isLoading} variant="bordered" radius="full" isIconOnly>
                      {vapi.isMuted() ? <FaMicrophoneSlash color="#1e232fff" /> : <FaMicrophone color="#1e232fff" />}
                    </Button>
                  </Tooltip>

                  <Tooltip content={isCameraOn ? 'Turn Off Camera' : 'Turn On Camera'}>
                    <Button onPress={() => setIsCameraOn((prev) => !prev)} isDisabled={isLoading} isLoading={isLoading} variant="bordered" radius="full" isIconOnly>
                      {isCameraOn ? <FaVideo color="#1e232fff" /> : <FaVideoSlash color="#1e232fff" />}
                    </Button>
                  </Tooltip>
                </div>
              )}

              <ConfirmDialog isOpen={isConfirmDialogOpen} onClose={handleCancelEnd} title="End Interview" description="Are you sure you want to end the interview?" onConfirm={handleConfirmEnd} confirmButtonText="End" cancelButtonText="Cancel" />
            </div>
          </CardBody>
        </Card>
        <PoweredBy />
        <Drawer isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
          <DrawerContent>
            {(onClose) => (
              <>
                <DrawerHeader className="flex flex-col gap-1">Conversation History</DrawerHeader>
                <DrawerBody>
                  <div>
                    {messages.length === 0 ? (
                      <div style={{ color: '#6b7280', textAlign: 'center', padding: '20px' }}>No messages yet. Start a call to begin the conversation.</div>
                    ) : (
                      messages.map((message, index) => (
                        <div key={index} className={`flex gap-4 mb-2 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                          <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${message.type === 'assistant' ? 'bg-violet-100 border-violet-200' : 'bg-purple-100 border-purple-200'}`}>{message.type === 'assistant' ? <Bot className="w-5 h-5 text-violet-600" /> : <User className="w-5 h-5 text-purple-600" />}</div>

                          <div className={`flex-1 max-w-[80%] ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                            <div className={`inline-block px-4 py-3 rounded-2xl shadow-sm ${message.type === 'assistant' ? 'bg-violet-50 border border-violet-100 text-violet-900' : 'bg-purple-50 border border-purple-100 text-purple-900'}`}>
                              <p className="text-sm leading-relaxed">{message.content}</p>
                            </div>
                            <div className={`mt-1 text-xs text-slate-500 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                              <span className="capitalize font-medium">{message.type === 'assistant' ? 'AI Assistant' : 'You'}</span>
                              <span>{message.time}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </DrawerBody>
                <DrawerFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                </DrawerFooter>
              </>
            )}
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};

export default InterviewNavigator;
