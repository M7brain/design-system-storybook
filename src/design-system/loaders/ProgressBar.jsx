import React from 'react';

const KEYFRAMES = `
@keyframes quicklo-progress-slide {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(433%); }
}
`;

const HEIGHT = { thin: 4, default: 8 };

export function ProgressBar({
  value,
  size = 'default',
  label = 'Loading…',
  showLabel = false,
}) {
  const indeterminate = value === undefined || value === null;
  const h = HEIGHT[size] ?? HEIGHT.default;
  const clamped = indeterminate ? 0 : Math.min(Math.max(value, 0), 100);

  return (
    <div>
      {indeterminate && <style>{KEYFRAMES}</style>}
      <div
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : Math.round(clamped)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        aria-busy={indeterminate || undefined}
        style={{
          width: '100%',
          height: `${h}px`,
          background: 'var(--color-progress-track)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {indeterminate ? (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '30%',
            height: '100%',
            background: 'var(--color-progress-fill)',
            borderRadius: 'var(--radius-full)',
            animation: `quicklo-progress-slide var(--duration-progress-indeterminate) var(--ease-linear) infinite`,
          }} />
        ) : (
          <div style={{
            width: `${clamped}%`,
            height: '100%',
            background: 'var(--color-progress-fill)',
            borderRadius: 'var(--radius-full)',
            transition: `width var(--duration-base) var(--ease-enter)`,
          }} />
        )}
      </div>
      {showLabel && (
        <div style={{
          marginTop: '4px',
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.75rem',
          color: 'var(--color-text-secondary)',
          lineHeight: '1rem',
        }}>
          {indeterminate ? label : `${Math.round(clamped)}%`}
        </div>
      )}
    </div>
  );
}
