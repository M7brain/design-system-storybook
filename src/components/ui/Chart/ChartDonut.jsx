'use client';

import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { CATEGORY_TOKENS, MAX_CATEGORIES, formatValue, readTokenMs, RECHARTS_ENTER_EASING } from './ChartTokens.js';
import { ChartLegend } from './ChartLegend.jsx';

// Multi-segment donut — for small fixed sets (≤5 segments), e.g. an admin
// plan breakdown. No floating readout pill: the always-on legend already
// shows every label + value, and a tap only needs to emphasize which
// segment is selected (stroke highlight + bold legend row), not surface a
// number nothing else already displays.
export function ChartDonut({ data, centerTotal, headline, heightPx, ariaLabel, valueFormatter }) {
  const entranceMs = React.useMemo(() => readTokenMs('--duration-slow', 300), []);
  const [activeIndex, setActiveIndex] = React.useState(null);
  const [hiddenKeys, setHiddenKeys] = React.useState(() => new Set());

  if (process.env.NODE_ENV !== 'production' && data.length > MAX_CATEGORIES) {
    console.warn(`[Chart] donut supports up to ${MAX_CATEGORIES} segments — received ${data.length}, extra segments will be dropped.`);
  }

  const segments = data.slice(0, MAX_CATEGORIES).filter((d) => !hiddenKeys.has(d.key));
  const total = data.reduce((sum, d) => sum + (hiddenKeys.has(d.key) ? 0 : d.value), 0);
  const centerContent = headline ?? (centerTotal ? formatValue(total, valueFormatter) : null);

  function toggleSeries(key) {
    setHiddenKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
    setActiveIndex(null);
  }

  const legendItems = data.map((d, i) => ({
    key: d.key,
    label: d.label,
    color: CATEGORY_TOKENS[i % MAX_CATEGORIES],
    value: formatValue(d.value, valueFormatter),
  }));

  return (
    <div
      tabIndex={0}
      className="outline-none focus-visible:outline-2 focus-visible:outline-(--color-focus-ring) focus-visible:outline-offset-2"
      style={{ position: 'relative' }}
      onKeyDown={(e) => {
        if (!segments.length) return;
        if (e.key === 'ArrowRight') { e.preventDefault(); setActiveIndex((i) => ((i ?? -1) + 1) % segments.length); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); setActiveIndex((i) => ((i ?? 0) - 1 + segments.length) % segments.length); }
        else if (e.key === 'Escape') setActiveIndex(null);
      }}
    >
      {/* role="img" wraps ONLY the plot — the legend below must stay outside
          it as a sibling, or role="img" prunes its interactive toggle
          buttons from the a11y tree (see ChartLine.jsx for the full
          reasoning). */}
      <div role="img" aria-label={ariaLabel} style={{ position: 'relative', height: heightPx }}>
        <ResponsiveContainer width="100%" height={heightPx}>
          <PieChart>
            <title>{ariaLabel}</title>
            <Pie
              data={segments}
              dataKey="value"
              nameKey="label"
              innerRadius="60%"
              outerRadius="90%"
              cornerRadius={6}
              paddingAngle={2}
              isAnimationActive
              animationDuration={entranceMs}
              animationEasing={RECHARTS_ENTER_EASING}
              onClick={(_, i) => setActiveIndex(i)}
            >
              {segments.map((seg, i) => {
                const originalIndex = data.findIndex((d) => d.key === seg.key);
                return (
                  <Cell
                    key={seg.key}
                    fill={CATEGORY_TOKENS[originalIndex % MAX_CATEGORIES]}
                    stroke={i === activeIndex ? 'var(--color-bg-surface)' : 'none'}
                    strokeWidth={i === activeIndex ? 3 : 0}
                  />
                );
              })}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {centerContent != null && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
              fontFamily: 'var(--font-body)',
              fontWeight: 600,
              fontSize: 'var(--text-h2)',
              lineHeight: '1.75rem',
              color: 'var(--color-text-primary)',
            }}
          >
            {centerContent}
          </div>
        )}
      </div>
      <ChartLegend items={legendItems} onToggle={toggleSeries} hidden={hiddenKeys} />
    </div>
  );
}
