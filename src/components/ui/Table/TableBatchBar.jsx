'use client';

import React from 'react';
import { IconButton } from '@/components/ui/IconButton/IconButton.jsx';
import { X } from '@/design-system/icons/index.js';
import { cn } from '@/lib/utils';

function readTokenMs(varName, fallback) {
  if (typeof window === 'undefined') return fallback;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  const ms = parseFloat(raw);
  return Number.isFinite(ms) ? ms : fallback;
}

// TableBatchBar — a floating, desktop-only action bar that appears once at
// least one row is selected. Selection itself (the checkbox column, the
// selectable prop) is fully suppressed below md — see Table.jsx — so this
// bar is `hidden md:flex` unconditionally, never rendered at all on mobile.
//
// Mount/unmount animation follows Alert's own entering/resting/exiting state
// machine (Alert.jsx) rather than a CSS-only appear, since the bar needs a
// genuine exit transition before it leaves the DOM (count drops back to 0).
export const TableBatchBar = React.forwardRef(function TableBatchBar(
  { count, bulkActions, onClear, className, ...rest },
  ref
) {
  // Initial status must reflect the initial `count`, not assume the bar is
  // always appearing on mount — otherwise a Table that is selectable but has
  // never had anything selected renders an invisible, inert bar into the DOM
  // from the very first render (status stuck at 'entering', never reaching
  // 'gone', so the `status === 'gone' && !visible` unmount check below never
  // fires). Confirmed live: with zero selections anywhere on a page, every
  // selectable Table's batch bar was already present at opacity 0 before this
  // fix. wasVisibleRef itself still starts false unconditionally, so a rare
  // mount-with-a-pre-existing-selection case still plays its entrance
  // animation via the effect below rather than snapping straight to resting.
  const [status, setStatus] = React.useState(() => (count > 0 ? 'entering' : 'gone'));
  const wasVisibleRef = React.useRef(false);
  const visible = count > 0;

  React.useEffect(() => {
    if (visible && !wasVisibleRef.current) {
      setStatus('entering');
      const raf = requestAnimationFrame(() => setStatus('resting'));
      wasVisibleRef.current = true;
      return () => cancelAnimationFrame(raf);
    }
    if (!visible && wasVisibleRef.current) {
      setStatus('exiting');
      const delay = readTokenMs('--duration-base', 200);
      const timeout = setTimeout(() => {
        setStatus('gone');
        wasVisibleRef.current = false;
      }, delay);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [visible]);

  if (status === 'gone' && !visible) return null;

  const isIn = status === 'resting';

  return (
    <div
      ref={ref}
      {...rest}
      role="toolbar"
      aria-label={`${count} selected`}
      className={cn('hidden md:flex fixed left-1/2 items-center', className)}
      style={{
        gap: 'var(--space-3)',
        bottom: 'var(--space-6)',
        transform: `translateX(-50%) translateY(${isIn ? '0' : '8px'})`,
        opacity: isIn ? 1 : 0,
        transition: [
          `transform var(--duration-base) ${status === 'exiting' ? 'var(--ease-exit)' : 'var(--ease-enter)'}`,
          `opacity var(--duration-base) ${status === 'exiting' ? 'var(--ease-exit)' : 'var(--ease-enter)'}`,
        ].join(', '),
        zIndex: 1000,
        background: 'var(--color-bg-surface)',
        boxShadow: 'var(--elevation-3)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-3) var(--space-4)',
        pointerEvents: isIn ? 'auto' : 'none',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-body-md)',
          lineHeight: '1.25rem',
          color: 'var(--color-text-primary)',
          whiteSpace: 'nowrap',
        }}
      >
        {`${count} selected`}
      </span>

      {bulkActions && (
        <div className="flex items-center" style={{ gap: 'var(--space-2)' }}>
          {bulkActions}
        </div>
      )}

      <IconButton icon={X} variant="plain" size="sm" aria-label="Clear selection" onClick={onClear} />
    </div>
  );
});

TableBatchBar.displayName = 'TableBatchBar';
