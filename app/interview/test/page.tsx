'use client';
import { useEffect, useState } from 'react';
import Vapi from '@vapi-ai/web';
import { AssistantOverrides } from '@vapi-ai/web/dist/api';
// import SpeakingIndicatorSoft from '../start/[id]/components/SpeakingIndicator';
// import UserCamera from '../start/[id]/components/UserCamera';

interface Message {
  time: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
}

function App() {
  const [vapi] = useState(() => new Vapi('bac5fdb0-6065-434c-809f-5e82220e7952'));
  const [connected, setConnected] = useState(false);
  const [assistantIsSpeaking, setAssistantIsSpeaking] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentTime, setCurrentTime] = useState('');
  const [customSayText, setCustomSayText] = useState('');
  const [interruptionsEnabled, setInterruptionsEnabled] = useState(true);
  const [interruptAssistantEnabled, setInterruptAssistantEnabled] = useState(true);
  const [endCallAfterSay, setEndCallAfterSay] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    vapi.on('call-start', () => {
      console.log('Call started');
      setConnected(true);
      addMessage('system', 'Call connected');
    });

    vapi.on('call-end', () => {
      console.log('Call ended');
      setConnected(false);
      setAssistantIsSpeaking(false);
      setVolumeLevel(0);
      addMessage('system', 'Call ended');
    });

    vapi.on('speech-start', () => {
      console.log('Assistant started speaking');
      setAssistantIsSpeaking(true);
    });

    vapi.on('speech-end', () => {
      console.log('Assistant stopped speaking');
      setAssistantIsSpeaking(false);
    });

    vapi.on('volume-level', (volume: number) => {
      setVolumeLevel(volume);
    });

    vapi.on('message', (message: any) => {
      console.log('Received message:', message);
      if (message.type === 'transcript') {
        if (message.transcriptType === 'final') {
          if (message.role === 'user') addMessage('user', message.transcript);
          else if (message.role === 'assistant') addMessage('assistant', message.transcript);
        }
      } else if (message.type === 'function-call') {
        addMessage('system', `Function called: ${message.functionCall?.name ?? 'unknown'}`);
      } else if (message.type === 'hang') {
        addMessage('system', 'Call ended by assistant');
      }
    });

    vapi.on('error', (error: any) => {
      console.error('Vapi error:', error);
      addMessage('system', `Error: ${error?.message || String(error)}`);
    });

    return () => {
      clearInterval(timer);
      vapi.stop();
    };
  }, [vapi]);

  const addMessage = (type: 'user' | 'assistant' | 'system', content: string) => {
    setMessages((prev) => [...prev, { time: new Date().toLocaleTimeString(), type, content }]);
  };

  const systemPrompt = `
You are "Evalsy AI Interviewer" conducting a real-time voice interview with {{userName}} for a {{level}} {{role}} position.

# Objectives
- Ask the provided questions one by one in a conversational, professional tone.
- Keep the conversation narrowly focused on those questions and the candidate’s answers.
- Stay in English at all times.

# Question Set (ask in order; adapt follow-ups only to clarify their answer)
What is OOP?

# Conversation Rules
- Address the candidate by name (“{{userName}}”).
- Pacing: Wait at least 6–8 seconds of silence before responding so they can think. Do **not** interrupt mid-thought.
- Brevity: Keep your turns concise (1–2 sentences), unless you’re reading the next question or clarifying.
- Follow-ups: If an answer is vague/incomplete, ask **one** short follow-up, then move on.
- Scope guard:
  - Only discuss the job, their background, and the provided questions.
  - If the candidate asks about compensation/HR/policies or anything unrelated, say you’re not the right person and bring them back to the current question.
  - If the candidate asks you a technical question that would require coaching or giving them the answer, politely decline and continue with the interview.
- Language guard:
  - If the candidate speaks in a non-English language, reply once: “Let’s keep this interview in English, please.” Then restate the last question in simple English and continue.
- Long silence handler:
   - If there is ~60 seconds of silence, re-engage once:
     “Would you like more time to think, want me to repeat the question, or shall I move on to the next one?”
   - If they say more time → acknowledge (“No problem—take your time.”) and wait ~30–45 seconds, then check in again briefly.
   - If they say repeat → restate the question clearly and wait.
   - If they say move on → proceed to the next question.
   - If silence continues with no clear answer → move on automatically.
   - If silence continues after the re-engagement, proceed to the next question.
- Off-topic or tool misuse:
  - If asked to do tasks outside interviewing (write code for them, browse, etc.), decline and return to the current question.
- Safety/professionalism:
  - Avoid discriminatory or inappropriate topics. If prompted, decline and proceed.
  - Maintain a warm, respectful tone.
  - if the candidate is silent for 15 sec, start the conversation again.

# Flow
1) Greet and state the role.
2) Ask Question 1.
3) For each answer: wait, optionally ask one follow-up if needed, then proceed.
4) After the final question: thank them, mention that results will be reviewed, and end.

# Ending
Conclude with: “Thanks for your time, Askar. We’ll review your responses and follow up with next steps.”
      `;
  const startCall = async () => {
    try {
      const assistantOverridesOpenAI = {
        model: {
          provider: 'openai',
          model: 'gpt-4o-mini', // or your allowed OpenAI model id
          temperature: 0.2,
          messages: [{ role: 'system', content: systemPrompt }],
        },
        // optional voice override (example)
        // voice: { provider: "11labs", voiceId: "YOUR_11LABS_VOICE_ID" },

        // make assistant speak first with your custom greeting
        firstMessage: `Hello askar , I'll be conducting your software enginner interview now. Let's begin.`,
        firstMessageMode: 'assistant-speaks-first',

        // pass variables to fill {{ }} in your Assistant config
      } satisfies AssistantOverrides;

      await vapi.start('365bc13a-dfb9-4144-8862-bd8ae3472475', assistantOverridesOpenAI);

      // 1) Start the call with your Assistant ID
      await vapi.start('365bc13a-dfb9-4144-8862-bd8ae3472475');

      // 2) Optional: greet the user
      const greeting = `Hello Askar, I'll be conducting your interview for the Software Engineer position today. Let's get started.`;
      vapi.send({
        type: 'add-message',
        message: {
          role: 'system',
          content: greeting,
        },
      });

      // 3) Send your structured interview system prompt

      vapi.send({
        type: 'add-message',
        message: {
          role: 'system',
          content: systemPrompt,
        },
      });
    } catch (error) {
      console.error('Error starting call:', error);
      addMessage('system', `Failed to start call: ${String(error)}`);
    }
  };

  const stopCall = () => {
    vapi.stop();
  };

  const toggleMute = () => {
    const newMutedState = !isMuted;
    vapi.setMuted(newMutedState);
    setIsMuted(newMutedState);
    addMessage('system', newMutedState ? 'Microphone muted' : 'Microphone unmuted');
  };

  const sendMessage = () => {
    vapi.send({
      type: 'add-message',
      message: {
        role: 'system',
        content: 'The user has indicated they want to change topics.',
      },
    });
    addMessage('system', 'Background message sent to assistant');
  };

  const handleManualSay = (text: string, endCallAfter = false) => {
    if (!connected || !text.trim()) return;
    const statusParts = [`Manual say: "${text}"`, endCallAfter ? 'end call after' : null, `interrupt user: ${interruptionsEnabled ? 'enabled' : 'disabled'}`, `interrupt assistant: ${interruptAssistantEnabled ? 'enabled' : 'disabled'}`].filter(Boolean);
    addMessage('system', statusParts.join(' | '));
    // If you want TTS injection, use vapi.say(text, { endCallAfter, interruptUser: interruptionsEnabled, interruptAssistant: interruptAssistantEnabled });
  };

  const handleCustomSay = () => {
    if (customSayText.trim()) {
      handleManualSay(customSayText, endCallAfterSay);
      setCustomSayText('');
    }
  };

  const handlePresetSay = (text: string) => {
    handleManualSay(text, endCallAfterSay);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Vapi Voice Assistant</h1>

      {/* Status Panel */}
      <div style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <strong>Status:</strong>
            <span style={{ color: connected ? '#22c55e' : '#ef4444', marginLeft: '8px' }}>{connected ? 'Connected' : 'Disconnected'}</span>
          </div>
          <div>Current Time: {currentTime}</div>
        </div>

        {connected && (
          <div style={{ marginTop: '10px' }}>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div>
                <strong>Assistant:</strong>
                <span style={{ color: assistantIsSpeaking ? '#f59e0b' : '#6b7280', marginLeft: '8px' }}>{assistantIsSpeaking ? 'Speaking' : 'Listening'}</span>
              </div>
              <div>
                <strong>Volume:</strong>
                <span style={{ marginLeft: '8px' }}>{Math.round(volumeLevel * 100)}%</span>
              </div>
              <div>
                <strong>Mic:</strong>
                <span style={{ color: isMuted ? '#ef4444' : '#22c55e', marginLeft: '8px' }}>{isMuted ? 'Muted' : 'Active'}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Control Buttons */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
        <button
          onClick={startCall}
          disabled={connected}
          style={{
            padding: '12px 24px',
            backgroundColor: connected ? '#9ca3af' : '#22c55e',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: connected ? 'not-allowed' : 'pointer',
            fontSize: '16px',
          }}
        >
          Start Call
        </button>

        <button
          onClick={stopCall}
          disabled={!connected}
          style={{
            padding: '12px 24px',
            backgroundColor: !connected ? '#9ca3af' : '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: !connected ? 'not-allowed' : 'pointer',
            fontSize: '16px',
          }}
        >
          Stop Call
        </button>

        <button
          onClick={toggleMute}
          disabled={!connected}
          style={{
            padding: '12px 24px',
            backgroundColor: !connected ? '#9ca3af' : isMuted ? '#f59e0b' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: !connected ? 'not-allowed' : 'pointer',
            fontSize: '16px',
          }}
        >
          {isMuted ? 'Unmute' : 'Mute'}
        </button>

        <button
          onClick={sendMessage}
          disabled={!connected}
          style={{
            padding: '12px 24px',
            backgroundColor: !connected ? '#9ca3af' : '#8b5cf6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: !connected ? 'not-allowed' : 'pointer',
            fontSize: '16px',
          }}
        >
          Send Context
        </button>
      </div>

      {/* Manual Say Controls */}
      <div
        style={{
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '20px',
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#374151' }}>Manual Say Controls</h3>

        <div style={{ display: 'flex', gap: '20px', marginBottom: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input type="checkbox" checked={endCallAfterSay} onChange={(e) => setEndCallAfterSay(e.target.checked)} style={{ cursor: 'pointer' }} />
            <span style={{ color: '#16a34a', fontWeight: 500 }}>End Call After Speaking ✓</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input type="checkbox" checked={interruptionsEnabled} onChange={(e) => setInterruptionsEnabled(e.target.checked)} style={{ cursor: 'pointer' }} />
            <span style={{ color: '#16a34a', fontWeight: 500 }}>User Interruptions Enabled ✓</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input type="checkbox" checked={interruptAssistantEnabled} onChange={(e) => setInterruptAssistantEnabled(e.target.checked)} style={{ cursor: 'pointer' }} />
            <span style={{ color: '#16a34a', fontWeight: 500 }}>Interrupt Assistant ✓</span>
          </label>
        </div>

        <div>
          <h4 style={{ margin: '0 0 10px 0', color: '#6b7280' }}>Quick Preset Messages:</h4>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['Hello, how are you doing today?', 'Let me think about that for a moment.', "That's a great question! Here's what I think:", 'I understand your concern. Let me explain.', 'Thank you for your patience.', 'Is there anything else I can help you with?', 'Our time is up. Thank you for the conversation, goodbye!'].map((preset, index) => (
              <button
                key={index}
                onClick={() => {
                  if (preset.includes('goodbye')) handleManualSay(preset, true);
                  else handlePresetSay(preset);
                }}
                disabled={!connected}
                style={{
                  padding: '8px 12px',
                  backgroundColor: !connected ? '#f3f4f6' : preset.includes('goodbye') ? '#fee2e2' : '#e0e7ff',
                  color: !connected ? '#9ca3af' : preset.includes('goodbye') ? '#dc2626' : '#3730a3',
                  border: `1px solid ${preset.includes('goodbye') ? '#fecaca' : '#c7d2fe'}`,
                  borderRadius: '4px',
                  cursor: !connected ? 'not-allowed' : 'pointer',
                  fontSize: '12px',
                  maxWidth: '200px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                title={preset + (preset.includes('goodbye') ? ' (Will end call)' : '')}
              >
                {preset}
                {preset.includes('goodbye') ? ' 🔚' : ''}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Conversation Display */}
      <div
        style={{
          backgroundColor: '#ffffff',

          padding: '20px',
          maxHeight: '400px',
          overflowY: 'auto',
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Conversation</h3>
        {messages.length === 0 ? (
          <div style={{ color: '#6b7280', textAlign: 'center', padding: '20px' }}>No messages yet. Start a call to begin the conversation.</div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              style={{
                marginBottom: '12px',
                padding: '8px 12px',
                borderRadius: '6px',
                backgroundColor: message.type === 'user' ? '#dbeafe' : message.type === 'assistant' ? '#dcfce7' : '#f3f4f6',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '4px',
                }}
              >
                <span
                  style={{
                    fontWeight: 'bold',
                    color: message.type === 'user' ? '#1d4ed8' : message.type === 'assistant' ? '#16a34a' : '#6b7280',
                  }}
                >
                  {message.type === 'user' ? 'You' : message.type === 'assistant' ? 'Assistant' : 'System'}
                </span>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>{message.time}</span>
              </div>
              <div style={{ color: '#374151' }}>{message.content}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
