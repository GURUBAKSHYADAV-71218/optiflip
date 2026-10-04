import { useId } from 'react';

/** Small brand mark used in the navbar and footer. */
export default function EyeMark({ size = 36 }: { size?: number }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#52d0f5" />
          <stop offset="0.55" stopColor="#8f82ff" />
          <stop offset="1" stopColor="#ff7ab6" />
        </linearGradient>
      </defs>
      <rect x="3" y="12" width="58" height="40" rx="16" fill="none" stroke={`url(#${id}-g)`} strokeWidth="3.5" />
      <path d="M13 32 C22 22 42 22 51 32 C42 42 22 42 13 32 Z" fill="#0f1629" stroke={`url(#${id}-g)`} strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="32" cy="32" r="7.5" fill={`url(#${id}-g)`} />
      <circle cx="32" cy="32" r="3" fill="#05070f" />
    </svg>
  );
}
