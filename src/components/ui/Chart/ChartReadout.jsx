'use client';

import React from 'react';

// Custom, touch-first datum readout — deliberately NOT src/components/ui/Tooltip
// (hover/focus-only, never fires on tap; this product is mobile-first). Index
// is computed from raw pointer position rather than trusting Recharts' own
// internal activeTooltipIndex/mousemove wiring, which is inconsistent across
// touch browsers — the same "robust math over library/DOM-measurement
// fragility" preference this design system already applies elsewhere
// (Tabs' sliding-pill index math, Pagination's responsive-collapse CSS
// breakpoint instead of measuring). Works identically for mouse, touch, and
// keyboard.

/**
 * @param {number} length - number of data points.
 * @returns {{ activeIndex: number|null, pinned: boolean, setFromRatio: (ratio:number)=>void, setIndex: (i:number)=>void, dismiss: ()=>void, moveBy: (delta:number)=>void }}
 */
export function useChartReadout(length) {
  const [activeIndex, setActiveIndex] = React.useState(null);

  const setFromRatio = React.useCallback(
    (ratio) => {
      if (!length) return;
      const clamped = Math.min(Math.max(ratio, 0), 1);
      const index = Math.round(clamped * (length - 1));
      setActiveIndex(index);
    },
    [length]
  );

  const setIndex = React.useCallback(
    (i) => setActiveIndex(Math.min(Math.max(i, 0), Math.max(length - 1, 0))),
    [length]
  );

  const moveBy = React.useCallback(
    (delta) => setActiveIndex((prev) => {
      const base = prev == null ? 0 : prev;
      return Math.min(Math.max(base + delta, 0), Math.max(length - 1, 0));
    }),
    [length]
  );

  const dismiss = React.useCallback(() => setActiveIndex(null), []);

  return { activeIndex, setFromRatio, setIndex, moveBy, dismiss };
}

/**
 * Pointer handlers for a horizontal plot (line/bar) — nearest index by x
 * position. Pass the returned handlers straight onto the plot's wrapping div.
 */
export function useHorizontalPointerHandlers(setFromRatio) {
  const rectRef = React.useRef(null);

  const handleMove = React.useCallback(
    (clientX) => {
      const rect = rectRef.current;
      if (!rect || rect.width === 0) return;
      setFromRatio((clientX - rect.left) / rect.width);
    },
    [setFromRatio]
  );

  return {
    ref: rectRef,
    onPointerDown: (e) => {
      rectRef.current = e.currentTarget.getBoundingClientRect();
      handleMove(e.clientX);
    },
    onPointerMove: (e) => {
      if (e.buttons === 0 && e.pointerType !== 'touch') return; // desktop: only track while a button/hover triggers via onMouseMove below
      rectRef.current = e.currentTarget.getBoundingClientRect();
      handleMove(e.clientX);
    },
    onMouseMove: (e) => {
      rectRef.current = e.currentTarget.getBoundingClientRect();
      handleMove(e.clientX);
    },
  };
}

/** Same as above, for a vertical plot (barHorizontal) — nearest index by y position. */
export function useVerticalPointerHandlers(setFromRatio) {
  const rectRef = React.useRef(null);

  const handleMove = React.useCallback(
    (clientY) => {
      const rect = rectRef.current;
      if (!rect || rect.height === 0) return;
      setFromRatio((clientY - rect.top) / rect.height);
    },
    [setFromRatio]
  );

  return {
    ref: rectRef,
    onPointerDown: (e) => {
      rectRef.current = e.currentTarget.getBoundingClientRect();
      handleMove(e.clientY);
    },
    onMouseMove: (e) => {
      rectRef.current = e.currentTarget.getBoundingClientRect();
      handleMove(e.clientY);
    },
  };
}

const PILL_STYLE = {
  position: 'absolute',
  pointerEvents: 'none',
  transform: 'translate(-50%, -100%)',
  whiteSpace: 'nowrap',
  background: 'var(--color-chart-readout-bg)',
  color: 'var(--color-chart-readout-text)',
  borderRadius: 'var(--radius-sm)',
  boxShadow: 'var(--elevation-2)',
  padding: 'var(--space-2) var(--space-3)',
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--text-body-sm)',
  lineHeight: '1rem',
  fontWeight: 500,
  transition: `opacity var(--duration-fast) var(--ease-default)`,
  zIndex: 1,
};

/**
 * Anchored readout pill. `x`/`y` are px (or CSS length strings) within the
 * plot's own positioning context (the wrapping div must be position:relative).
 * Pass either `label`+`value` (single-series) or `lines` (an array of
 * {label,value}, for a stacked-bar breakdown at one category).
 */
export function ChartReadoutPill({ x, y, label, value, lines }) {
  if (x == null || y == null) return null;
  return (
    <div style={{ ...PILL_STYLE, left: x, top: Math.max(y - 12, 0) }} role="status" aria-live="polite">
      {lines ? (
        lines.map((line) => (
          <div key={line.label} style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <span style={{ opacity: 'var(--opacity-70)' }}>{line.label}</span>
            <span>{line.value}</span>
          </div>
        ))
      ) : (
        <>
          <span style={{ opacity: 'var(--opacity-70)', marginRight: 'var(--space-2)' }}>{label}</span>
          <span>{value}</span>
        </>
      )}
    </div>
  );
}
