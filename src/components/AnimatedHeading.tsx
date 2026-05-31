'use client';

import { useState, useEffect, useRef } from 'react';

interface AnimatedHeadingProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

const CHAR_DELAY = 30;
const INITIAL_DELAY = 200;
const CHAR_DURATION = 500;

export default function AnimatedHeading({ text, className = '', style }: AnimatedHeadingProps) {
  const [started, setStarted] = useState(false);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    const timer = setTimeout(() => setStarted(true), INITIAL_DELAY);
    return () => clearTimeout(timer);
  }, []);

  const lines = text.split('\n');

  return (
    <h1 className={className} style={style}>
      {lines.map((line, lineIndex) => (
        <span key={lineIndex} className="block">
          {line.split('').map((char, i) => {
            const delay = (lineIndex * line.length * CHAR_DELAY) + (i * CHAR_DELAY);
            const isSpace = char === ' ';
            return (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  opacity: started ? 1 : 0,
                  transform: started ? 'translateX(0)' : 'translateX(-18px)',
                  transition: `opacity ${CHAR_DURATION}ms ease-out, transform ${CHAR_DURATION}ms ease-out`,
                  transitionDelay: `${delay}ms`,
                }}
              >
                {isSpace ? '\u00A0' : char}
              </span>
            );
          })}
          {lineIndex < lines.length - 1 && <br />}
        </span>
      ))}
    </h1>
  );
}
