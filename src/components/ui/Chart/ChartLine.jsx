'use client';

import React from 'react';
import {
  ResponsiveContainer, ComposedChart, Area, Line, CartesianGrid, XAxis, YAxis, ReferenceLine,
} from 'recharts';
import { AXIS_TICK_STYLE, formatValue, readTokenMs, RECHARTS_ENTER_EASING } from './ChartTokens.js';
import { useChartReadout, useHorizontalPointerHandlers, ChartReadoutPill } from './ChartReadout.jsx';

// Custom dot renderer — only the active point gets a visible marker (the
// "active dot" the touch-first readout drives). Recharts calls this per
// point during its own render; reading activeIndex here is a pure render
// decision, never a state mutation mid-render.
function makeDot(activeIndex, color) {
  return function Dot(props) {
    const { cx, cy, index } = props;
    if (index !== activeIndex) return null;
    return <circle cx={cx} cy={cy} r={4} fill={color} stroke="var(--color-bg-surface)" strokeWidth={2} />;
  };
}

export function ChartLine({ data, heightPx, area, comparison, ariaLabel, valueFormatter }) {
  const { activeIndex, setFromRatio, moveBy, dismiss } = useChartReadout(data.length);
  const pointerHandlers = useHorizontalPointerHandlers(setFromRatio);
  const containerRef = React.useRef(null);
  const entranceMs = React.useMemo(() => readTokenMs('--duration-slow', 300), []);

  React.useEffect(() => {
    if (activeIndex == null) return undefined;
    function handleOutsideClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) dismiss();
    }
    document.addEventListener('pointerdown', handleOutsideClick);
    return () => document.removeEventListener('pointerdown', handleOutsideClick);
  }, [activeIndex, dismiss]);

  const active = activeIndex != null ? data[activeIndex] : null;
  const pillX = activeIndex != null ? (activeIndex / Math.max(data.length - 1, 1)) * 100 : null;

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
      {/* role="img" wraps ONLY the visual plot — it must not also wrap the
          readout pill below (role="img" prunes descendants from the a11y
          tree, so anything meant to be independently reachable/announced,
          like the pill's aria-live region, has to sit outside it as a
          sibling instead). */}
      <div role="img" aria-label={ariaLabel}>
      <ResponsiveContainer width="100%" height={heightPx}>
        <ComposedChart
          data={data}
          margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
          onClick={(e) => { if (e?.activeTooltipIndex != null) setFromRatio(e.activeTooltipIndex / Math.max(data.length - 1, 1)); }}
        >
          <title>{ariaLabel}</title>
          <defs>
            <linearGradient id="chart-line-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-chart-primary-fill-from)" />
              <stop offset="100%" stopColor="var(--color-chart-primary-fill-to)" />
            </linearGradient>
          </defs>
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
          {area && (
            <Area
              type="monotone"
              dataKey="value"
              stroke="none"
              fill="url(#chart-line-fill)"
              isAnimationActive
              animationDuration={entranceMs}
              animationEasing={RECHARTS_ENTER_EASING}
              connectNulls={false}
            />
          )}
          {comparison && (
            <Line
              type="monotone"
              dataKey="comparisonValue"
              stroke="var(--color-chart-primary-muted)"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
              connectNulls={false}
              isAnimationActive
              animationDuration={entranceMs}
            />
          )}
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--color-chart-primary)"
            strokeWidth={2}
            dot={makeDot(activeIndex, 'var(--color-chart-primary)')}
            activeDot={false}
            connectNulls={false}
            isAnimationActive
            animationDuration={entranceMs}
            animationEasing={RECHARTS_ENTER_EASING}
          />
        </ComposedChart>
      </ResponsiveContainer>
      </div>
      {active && (
        <ChartReadoutPill
          x={`${pillX}%`}
          y={24}
          label={active.label}
          value={formatValue(active.value, valueFormatter)}
        />
      )}
    </div>
  );
}
