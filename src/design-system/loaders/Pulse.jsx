import React from 'react';

const KEYFRAMES = `
@keyframes quicklo-pulse-ring {
  0%   { transform: scale(1);   opacity: 0.6; }
  100% { transform: scale(2.5); opacity: 0;   }
}
`;

const SIZES   = { sm: 8,  md: 12 };
const COLOURS = {
  brand:   'var(--color-pulse-brand)',
  default: 'var(--color-pulse-default)',
  success: 'var(--color-pulse-success)',
  warning: 'var(--color-pulse-warning)',
  error:   'var(--color-pulse-error)',
};

export function Pulse({ size = 'md', variant = 'default', label = 'Active' }) {
  const dot   = SIZES[size] ?? SIZES.md;
  const color = COLOURS[variant] ?? COLOURS.default;

  return (
    <>
      <style>{KEYFRAMES}</style>
      <span
        role="status"
        aria-label={label}
        style={{
          display: 'inline-block',
          position: 'relative',
          width: `${dot}px`,
          height: `${dot}px`,
        }}
      >
        {/* Radiating ring — expands outward from dot */}
        <span style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'var(--radius-full)',
          background: color,
          animation: `quicklo-pulse-ring var(--duration-pulse) var(--ease-linear) infinite`,
        }} />
        {/* Static dot — on top of ring */}
        <span style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'var(--radius-full)',
          background: color,
        }} />
      </span>
    </>
  );
}
