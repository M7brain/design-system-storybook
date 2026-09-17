'use client';

import React from 'react';
import { ResponsiveContainer, BarChart, Bar, Cell, CartesianGrid, XAxis, YAxis, ReferenceLine } from 'recharts';
import { CATEGORY_TOKENS, AXIS_TICK_STYLE, formatValue, readTokenMs, RECHARTS_ENTER_EASING } from './ChartTokens.js';
import { useChartReadout, useHorizontalPointerHandlers, ChartReadoutPill } from './ChartReadout.jsx';
import { ChartLegend } from './ChartLegend.jsx';

const TOP_RADIUS = [8, 8, 0, 0];

export function ChartBar({ data, heightPx, highlightIndex, comparison, stacked, series, ariaLabel, valueFormatter }) {
  const { activeIndex, setFromRatio, moveBy, dismiss } = useChartReadout(data.length);
  const pointerHandlers = useHorizontalPointerHandlers(setFromRatio);
  const containerRef = React.useRef(null);
  const entranceMs = React.useMemo(() => readTokenMs('--duration-slow', 300), []);
  const [hiddenSeries, setHiddenSeries] = React.useState(() => new Set());

  if (process.env.NODE_ENV !== 'production' && stacked && highlightIndex != null) {
    console.warn('[Chart] `highlightIndex` has no effect when `stacked` is true — stacked bars are coloured per series, not per category.');
  }

  React.useEffect(() => {
    if (activeIndex == null) return undefined;
    function handleOutsideClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) dismiss();
    }
    document.addEventListener('pointerdown', handleOutsideClick);
    return () => document.removeEventListener('pointerdown', handleOutsideClick);
  }, [activeIndex, dismiss]);

  const pillX = activeIndex != null ? (activeIndex / Math.max(data.length - 1, 1)) * 100 : null;
  const activeRow = activeIndex != null ? data[activeIndex] : null;

  const legendItems = stacked
    ? (series ?? []).map((s, i) => ({
        key: s.key,
        label: s.label,
        color: CATEGORY_TOKENS[i % CATEGORY_TOKENS.length],
        value: formatValue(data.reduce((sum, row) => sum + (row[s.key] ?? 0), 0), valueFormatter),
      }))
    : null;

  function toggleSeries(key) {
    setHiddenSeries((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className="outline-none focus-visible:outline-2 focus-visible:outline-(--color-focus-ring) focus-visible:outline-offset-2"
      style={{ position: 'relative' }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') { e.preventDefault(); moveBy(1); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); moveBy(-1); }
        else if (e.key === 'Escape') dismiss();
      }}
      {...pointerHandlers}
    >
      {/* role="img" wraps ONLY the plot — the pill and legend below must stay
          outside it as siblings, or role="img" prunes them from the a11y
          tree (see ChartLine.jsx for the full reasoning). */}
      <div role="img" aria-label={ariaLabel}>
      <ResponsiveContainer width="100%" height={heightPx}>
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }} barGap={4}>
          <title>{ariaLabel}</title>
          <CartesianGrid vertical={false} stroke="var(--color-chart-grid)" strokeDasharray="4 4" />
          <XAxis
            dataKey="label"
            axisLine={{ stroke: 'var(--color-chart-axis)' }}
            tickLine={false}
            tick={{ ...AXIS_TICK_STYLE, fill: 'var(--color-text-tertiary)' }}
          />
          <YAxis hide />
          {activeIndex != null && (
            <ReferenceLine x={data[activeIndex]?.label} stroke="var(--color-chart-axis)" strokeDasharray="2 2" />
          )}

          {stacked
            ? (series ?? []).map((s, i) =>
                hiddenSeries.has(s.key) ? null : (
                  <Bar
                    key={s.key}
                    dataKey={s.key}
                    stackId="stack"
                    fill={CATEGORY_TOKENS[i % CATEGORY_TOKENS.length]}
                    radius={i === series.length - 1 ? TOP_RADIUS : [0, 0, 0, 0]}
                    isAnimationActive
                    animationDuration={entranceMs}
                    animationEasing={RECHARTS_ENTER_EASING}
                  />
                )
              )
            : (
              <>
                {comparison && (
                  <Bar
                    dataKey="comparisonValue"
                    fill="var(--color-chart-primary-muted)"
                    radius={TOP_RADIUS}
                    isAnimationActive
                    animationDuration={entranceMs}
                  />
                )}
                <Bar dataKey="value" radius={TOP_RADIUS} isAnimationActive animationDuration={entranceMs} animationEasing={RECHARTS_ENTER_EASING}>
                  {data.map((_, i) => (
                    <Cell
                      key={i}
                      fill={highlightIndex == null || highlightIndex === i ? 'var(--color-chart-primary)' : 'var(--color-chart-primary-muted)'}
                    />
                  ))}
                </Bar>
              </>
            )}
        </BarChart>
      </ResponsiveContainer>
      </div>

      {activeRow && (
        stacked ? (
          <ChartReadoutPill
            x={`${pillX}%`}
            y={24}
            lines={(series ?? []).map((s) => ({ label: s.label, value: formatValue(activeRow[s.key], valueFormatter) }))}
          />
        ) : (
          <ChartReadoutPill x={`${pillX}%`} y={24} label={activeRow.label} value={formatValue(activeRow.value, valueFormatter)} />
        )
      )}

      {stacked && legendItems && <ChartLegend items={legendItems} onToggle={toggleSeries} hidden={hiddenSeries} />}
    </div>
  );
}
