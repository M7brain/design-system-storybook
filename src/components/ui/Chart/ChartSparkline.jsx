'use client';

import React from 'react';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar } from 'recharts';
import { readTokenMs, RECHARTS_ENTER_EASING } from './ChartTokens.js';

// Sparkline — 40px tall, NO axes/grid/legend/readout, per the component
// brief. For embedding in MetricCard, which already renders its own
// headline number and label alongside this — a sparkline is bare geometry
// only, not a self-contained chart with its own chrome.
export function ChartSparkline({ data, form = 'line', ariaLabel }) {
  const entranceMs = React.useMemo(() => readTokenMs('--duration-slow', 300), []);

  return (
    <div role="img" aria-label={ariaLabel} style={{ height: 40 }}>
      <ResponsiveContainer width="100%" height={40}>
        {form === 'bar' ? (
          <BarChart data={data} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
            <title>{ariaLabel}</title>
            <Bar
              dataKey="value"
              fill="var(--color-chart-primary)"
              radius={[2, 2, 0, 0]}
              isAnimationActive
              animationDuration={entranceMs}
              animationEasing={RECHARTS_ENTER_EASING}
            />
          </BarChart>
        ) : (
          <LineChart data={data} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
            <title>{ariaLabel}</title>
            <Line
              type="monotone"
              dataKey="value"
              stroke="var(--color-chart-primary)"
              strokeWidth={2}
              dot={false}
              connectNulls={false}
              isAnimationActive
              animationDuration={entranceMs}
              animationEasing={RECHARTS_ENTER_EASING}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
