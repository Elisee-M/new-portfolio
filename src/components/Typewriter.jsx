import React, { useState, useEffect, useCallback } from 'react';

const roles = [
  'Full-Stack Developer & Hardware Enthusiast',
  'IoT & Embedded Systems Engineer',
  'React & Node.js Developer',
  'Open Source Contributor',
  'Tech Innovator'
];

export default function Typewriter() {
  const [text, setText] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const tick = useCallback(() => {
    const current = roles[wordIdx];
    if (!deleting) {
      setText(current.slice(0, charIdx + 1));
      setCharIdx(c => c + 1);
      if (charIdx + 1 === current.length) {
        setTimeout(() => setDeleting(true), 1500);
        return;
      }
    } else {
      setText(current.slice(0, charIdx - 1));
      setCharIdx(c => c - 1);
      if (charIdx - 1 === 0) {
        setDeleting(false);
        setWordIdx(w => (w + 1) % roles.length);
        return;
      }
    }
  }, [wordIdx, charIdx, deleting]);

  useEffect(() => {
    const speed = deleting ? 35 : 65;
    const timer = setTimeout(tick, speed);
    return () => clearTimeout(timer);
  }, [tick, deleting, charIdx, wordIdx]);

  return (
    <span>
      {text}
      <span className="inline-block w-[2px] h-[1em] bg-blue-400 ml-0.5 animate-pulse align-middle" />
    </span>
  );
}
