import React, { useState, useEffect, useCallback } from 'react';

const defaultRoles = [
  'Full-Stack Developer & Hardware Enthusiast',
  'IoT & Embedded Systems Engineer',
  'React & Node.js Developer',
  'Open Source Contributor',
  'Tech Innovator'
];

export default function Typewriter({ words, typeSpeed, deleteSpeed, loop, showCursor, className, startDelay }) {
  const roles = words || defaultRoles;
  const tSpeed = typeSpeed || 65;
  const dSpeed = deleteSpeed || 35;
  const shouldLoop = loop !== undefined ? loop : true;
  const cursor = showCursor !== undefined ? showCursor : true;

  const [started, setStarted] = useState(!startDelay);
  const [text, setText] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (startDelay) {
      const timer = setTimeout(() => setStarted(true), startDelay);
      return () => clearTimeout(timer);
    }
  }, [startDelay]);

  const tick = useCallback(() => {
    const current = roles[wordIdx];
    if (!deleting) {
      setText(current.slice(0, charIdx + 1));
      setCharIdx(c => c + 1);
      if (charIdx + 1 === current.length) {
        if (shouldLoop) {
          setTimeout(() => setDeleting(true), 1500);
        }
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
  }, [wordIdx, charIdx, deleting, roles, shouldLoop]);

  useEffect(() => {
    if (!started) return;
    const speed = deleting ? dSpeed : tSpeed;
    const timer = setTimeout(tick, speed);
    return () => clearTimeout(timer);
  }, [tick, deleting, charIdx, wordIdx, dSpeed, tSpeed, started]);

  if (!started) {
    return <span className={className}>{'\u00A0'}</span>;
  }

  return (
    <span className={className}>
      {text}
      {cursor && <span className="inline-block w-[2px] h-[1em] bg-blue-400 ml-0.5 animate-pulse align-middle" />}
    </span>
  );
}
