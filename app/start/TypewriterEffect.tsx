import { useEffect, useState } from 'react';

const phrases = ['Save time', 'Save money', 'Standardize evaluations', 'Focus on top candidates'];

export default function TypewriterEffect() {
  const [currentPhrase, setCurrentPhrase] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const fullPhrase = phrases[phraseIndex];
    const typingSpeed = 100;

    let timeout: NodeJS.Timeout;

    if (charIndex < fullPhrase.length) {
      timeout = setTimeout(() => {
        setCurrentPhrase(fullPhrase.slice(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);
      }, typingSpeed);
    } else {
      timeout = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          // Show next phrase
          setPhraseIndex((prev) => (prev + 1) % phrases.length); // loop
          setCharIndex(0);
          setCurrentPhrase('');
          setIsVisible(true);
        }, 500); // hide duration
      }, 1000); // pause after typing
    }

    return () => clearTimeout(timeout);
  }, [charIndex, phraseIndex]);

  return (
    <div className="text-1xl text-blue-400 font-semibold h-6">
      {isVisible && (
        <span>
          {currentPhrase}
          <span className="animate-pulse">|</span>
        </span>
      )}
    </div>
  );
}
