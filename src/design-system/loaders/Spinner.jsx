import React from 'react';
import { Loader2 } from '../icons/index.js';

const SIZES = { sm: 16, md: 24, lg: 40 };

const KEYFRAMES = `
@keyframes quicklo-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
`;

export function Spinner({ size = 'md', color = 'var(--color-brand-btn)', label = 'Loading…' }) {
  const px = SIZES[size] ?? SIZES.md;
  return (
    <>
      <style>{KEYFRAMES}</style>
      <span
        role="status"
        aria-label={label}
        style={{
          display: 'inline-flex',
          width: `${px}px`,
          height: `${px}px`,
          color,
          animation: `quicklo-spin var(--duration-spinner) var(--ease-linear) infinite`,
        }}
      >
        <Loader2 width={px} height={px} strokeWidth={1.5} aria-hidden="true" />
      </span>
    </>
  );
}
