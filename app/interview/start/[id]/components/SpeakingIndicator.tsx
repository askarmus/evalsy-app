'use client';

interface SpeakingIndicatorProps {
  isSpeaking: boolean;
}

export default function SpeakingIndicatorSoft({ isSpeaking }: SpeakingIndicatorProps) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-900">
      <div className="flex flex-col items-center">
        <div className="relative w-28 h-28 flex items-center justify-center">
          <div className={`absolute inset-0 rounded-full bg-purple-600 opacity-40 blur-md z-0 transition-all duration-300 ${isSpeaking ? 'animate-pulse-glow' : ''}`} />
          <div className="relative w-28 h-28 rounded-full bg-gray-800 shadow-xl flex items-center justify-center z-10 overflow-hidden">
            <img src="/ai-avatar.png" className="w-full h-full rounded-full object-cover" />
          </div>
        </div>
        <p className="mt-5 text-center text-sm text-gray-300 font-medium">Interviwer</p>
      </div>
    </div>
  );
}
