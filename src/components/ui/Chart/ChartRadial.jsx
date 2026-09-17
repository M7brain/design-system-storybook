'use client';

import React from 'react';
import { ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts';
import { readTokenMs, RECHARTS_ENTER_EASING } from './ChartTokens.js';

// Single-value progress ring. No readout — there's only one value, already
// always visible in the centre, so there's nothing further to inspect.
export function ChartRadial({ value, max = 100, gauge, headline, heightPx, ariaLabel }) {
  const entranceMs = React.useMemo(() => readTokenMs('--duration-slow', 300), []);
  const chartData = [{ name: 'value', value }];
  // Full circle starts at 12 o'clock, sweeps clockwise (Recharts' own polar
  // convention: 90deg = top, decreasing = clockwise). Gauge is a half-circle
  // sweeping left-to-right across the top, the common meter form.
  const angles = gauge ? { startAngle: 180, endAngle: 0 } : { startAngle: 90, endAngle: -270 };

  return (
    <div role="img" aria-label={ariaLabel} style={{ position: 'relative', height: heightPx }}>
      <ResponsiveContainer width="100%" height={heightPx}>
        <RadialBarChart
          data={chartData}
          innerRadius="70%"
          outerRadius="100%"
          startAngle={angles.startAngle}
          endAngle={angles.endAngle}
          barSize={12}
        >
          <title>{ariaLabel}</title>
          <RadialBar
            dataKey="value"
            domain={[0, max]}
            cornerRadius={6}
            fill="var(--color-chart-primary)"
            background={{ fill: 'var(--color-chart-track)' }}
            isAnimationActive
            animationDuration={entranceMs}
            animationEasing={RECHARTS_ENTER_EASING}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      {headline != null && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            fontFamily: 'var(--font-body)', // Inter, not Outfit
            fontWeight: 600,
            fontSize: 'var(--text-h2)',
            lineHeight: '1.75rem',
            color: 'var(--color-text-primary)',
          }}
        >
          {headline}
        </div>
      )}
    </div>
  );
}
