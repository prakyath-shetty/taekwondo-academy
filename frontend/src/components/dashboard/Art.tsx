import React from 'react';

/** Stylised taekwondo high-kick silhouette, drawn with strokes so it scales cleanly. */
export function Fighter({ color = '#fff', className, style }: { color?: string; className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 200 200" className={className} style={style} fill="none" stroke={color} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="98" cy="34" r="12" fill={color} stroke="none" />
      <path d="M96 50 L92 100" />
      <path d="M94 62 L58 84" />
      <path d="M94 62 L128 74" />
      <path d="M92 100 L60 150 L52 186" />
      <path d="M92 100 L140 82 L184 44" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 76" className={className} fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="30" cy="12" r="6.5" fill="currentColor" stroke="none" />
      <path d="M29 22 L26 42" />
      <path d="M28 28 L10 38" />
      <path d="M28 28 L44 32" />
      <path d="M26 42 L14 62 L10 74" />
      <path d="M26 42 L44 34 L58 14" />
    </svg>
  );
}

export function Mountains({ className }: { className?: string }) {
  return (
    <svg className={className ?? 'tkd-hero-scene'} viewBox="0 0 1285 207" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="tkd-sky" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0a0d14" />
          <stop offset="0.45" stopColor="#0f1622" />
          <stop offset="1" stopColor="#3b4a63" />
        </linearGradient>
        <linearGradient id="tkd-peak" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8592aa" />
          <stop offset="1" stopColor="#1c2537" />
        </linearGradient>
        <linearGradient id="tkd-fade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0a0d14" stopOpacity="1" />
          <stop offset="0.5" stopColor="#0a0d14" stopOpacity="0.85" />
          <stop offset="1" stopColor="#0a0d14" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="1285" height="207" fill="url(#tkd-sky)" />
      <path d="M560 207 L720 110 L790 150 L900 60 L1010 140 L1090 88 L1285 190 L1285 207Z" fill="url(#tkd-peak)" opacity="0.9" />
      <path d="M700 207 L860 120 L960 170 L1120 100 L1285 170 L1285 207Z" fill="#111827" opacity="0.7" />
      <rect width="640" height="207" fill="url(#tkd-fade)" />
    </svg>
  );
}
