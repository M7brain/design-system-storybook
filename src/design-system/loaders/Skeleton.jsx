import React from 'react';

const KEYFRAMES = `
@keyframes quicklo-shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
}
`;

const BASE = {
  display: 'block',
  background: 'linear-gradient(90deg, var(--color-skeleton-base) 25%, var(--color-skeleton-highlight) 50%, var(--color-skeleton-base) 75%)',
  backgroundSize: '200% 100%',
  animation: `quicklo-shimmer var(--duration-skeleton) var(--ease-linear) infinite`,
};

export function Skeleton({ variant = 'line', width, height, lines = 3 }) {
  if (variant === 'paragraph') {
    return (
      <>
        <style>{KEYFRAMES}</style>
        <div aria-hidden="true" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {Array.from({ length: lines }).map((_, i) => (
            <span
              key={i}
              style={{
                ...BASE,
                width: i === lines - 1 ? '66%' : '100%',
                height: '16px',
                borderRadius: 'var(--radius-xs)',
              }}
            />
          ))}
        </div>
      </>
    );
  }

  if (variant === 'card') {
    return (
      <>
        <style>{KEYFRAMES}</style>
        <span
          aria-hidden="true"
          style={{
            ...BASE,
            display: 'block',
            width: width ?? '100%',
            height: height ?? '120px',
            borderRadius: 'var(--radius-md)',
          }}
        />
      </>
    );
  }

  // Circular placeholder — added for Avatar's loading state (circle shape).
  // Identical to 'card' except radius; general-purpose, not Avatar-only.
  if (variant === 'circle') {
    return (
      <>
        <style>{KEYFRAMES}</style>
        <span
          aria-hidden="true"
          style={{
            ...BASE,
            display: 'block',
            width: width ?? '40px',
            height: height ?? '40px',
            borderRadius: 'var(--radius-full)',
          }}
        />
      </>
    );
  }

  return (
    <>
      <style>{KEYFRAMES}</style>
      <span
        aria-hidden="true"
        style={{
          ...BASE,
          width: width ?? '100%',
          height: height ?? '16px',
          borderRadius: 'var(--radius-xs)',
        }}
      />
    </>
  );
}
