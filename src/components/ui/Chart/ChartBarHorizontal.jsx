'use client';

import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, LabelList } from 'recharts';
import { AXIS_TICK_STYLE, formatValue, readTokenMs, RECHARTS_ENTER_EASING } from './ChartTokens.js';
import { useChartReadout, useVerticalPointerHandlers, ChartReadoutPill } from './ChartReadout.jsx';

// Ranked horizontal bars, rounded END caps only — for long category labels
// (Top enquiry types, etc.) where a vertical bar's label would need to
// rotate or truncate. Single series, direct value labels at the bar end —
// no separate readout pill needed for the value (it's always visible), the
// touch-first readout here just highlights the row for a mixed-pointer/
// keyboard-inspection affordance, matching the other variants' interaction
// model rather than adding a second way to see the same number.
export function ChartBarHorizontal({ data, heightPx, ariaLabel, valueFormatter }) {
  const { activeIndex, setFromRatio, moveBy, dismiss } = useChartReadout(data.length);
  const pointerHandlers = useVerticalPointerHandlers(setFromRatio);
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

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className="outline-none focus-visible:outline-2 focus-visible:outline-(--color-focus-ring) focus-visible:outline-offset-2"
      style={{ position: 'relative' }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowDown') { e.preventDefault(); moveBy(1); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); moveBy(-1); }
        else if (e.key === 'Escape') dismiss();
      }}
      {...pointerHandlers}
    >
      {/* role="img" wraps ONLY the plot — see ChartLine.jsx for why the pill
          below must stay outside it as a sibling. */}
      <div role="img" aria-label={ariaLabel}>
      <ResponsiveContainer width="100%" height={heightPx}>
        <BarChart data={data} layout="vertical" margin={{ top: 8, right: 48, bottom: 0, left: 8 }}>
          <title>{ariaLabel}</title>
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="label"
            axisLine={false}
            tickLine={false}
            width={120}
            tick={{ ...AXIS_TICK_STYLE, fill: 'var(--color-text-secondary)' }}
          />
          <Bar
            dataKey="value"
            radius={[0, 8, 8, 0]}
            fill="var(--color-chart-primary)"
            isAnimationActive
            animationDuration={entranceMs}
            animationEasing={RECHARTS_ENTER_EASING}
          >
            <LabelList
              dataKey="value"
              position="right"
              formatter={(v) => formatValue(v, valueFormatter)}
              style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-body-sm)', fill: 'var(--color-text-primary)' }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      </div>
      {activeIndex != null && data[activeIndex] && (
        <ChartReadoutPill
          x="50%"
          y={Math.round(((activeIndex + 0.5) / data.length) * heightPx) + 12}
          label={data[activeIndex].label}
          value={formatValue(data[activeIndex].value, valueFormatter)}
        />
      )}
    </div>
  );
}
