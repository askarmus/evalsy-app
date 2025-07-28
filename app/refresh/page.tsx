'use client';

import { useEffect, useRef, useState } from 'react';

export default function InterviewGuard({ onEnd }: { onEnd?: () => void }) {
  const allowUnloadRef = useRef(false);
  const [showThankYou, setShowThankYou] = useState(false);

  // ✅ 1. Show Thank You if returning after ending interview
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const wasEnded = sessionStorage.getItem('interviewEnded');
      if (wasEnded === 'true') {
        setShowThankYou(true);
        sessionStorage.removeItem('interviewEnded');
      }
    }
  }, []);

  // ✅ 2. Block refresh/close if not allowed
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!allowUnloadRef.current) {
        const message = 'You are in the middle of an interview. Leaving now may result in data loss.';
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // ✅ 3. Prevent refresh with keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isRefresh = (e.key === 'r' && (e.metaKey || e.ctrlKey)) || e.key === 'F5';
      if (isRefresh) {
        e.preventDefault();
        alert('Please use the "End Interview" button to leave safely.');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ✅ 4. Allow safe exit
  const handleEnd = () => {
    allowUnloadRef.current = true;
    sessionStorage.setItem('interviewEnded', 'true');
    window.location.reload(); // simulate reload
  };

  return (
    <>
      {/* Sticky warning */}
      <div className="fixed top-0 left-0 w-full bg-yellow-400 text-black text-center py-2 z-50 shadow-md">⚠️ You are currently in an interview. Do not refresh, close, or navigate away.</div>

      {/* End button */}
      <div className="fixed bottom-4 right-4 z-50">
        <button onClick={handleEnd} className="bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700">
          End Interview
        </button>
      </div>

      {/* ✅ Thank you message after reload */}
      {showThankYou && <div className="fixed bottom-20 right-4 z-50 bg-green-100 text-green-800 border border-green-400 px-4 py-3 rounded shadow">✅ Thank you for taking the interview!</div>}
    </>
  );
}
