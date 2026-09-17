'use client';

import React from 'react';
import { Skeleton } from '@/design-system/loaders/index.js';
import { Alert } from '@/components/ui/Alert/Alert.jsx';
import { HEIGHT_PX, HEADLINE_STYLE } from './ChartTokens.js';
import { ChartDataTable } from './ChartDataTable.jsx';
import { ChartEmptyState } from './ChartEmptyState.jsx';
import { ChartLine } from './ChartLine.jsx';
import { ChartBar } from './ChartBar.jsx';
import { ChartBarHorizontal } from './ChartBarHorizontal.jsx';
import { ChartSparkline } from './ChartSparkline.jsx';
import { ChartRadial } from './ChartRadial.jsx';
import { ChartDonut } from './ChartDonut.jsx';

// Chart — base UI component built on Recharts (locked charting lib). One
// dispatcher, six variants (`type`): line, bar, barHorizontal, sparkline,
// radial, donut. Option-A palette: a single monochromatic brand series
// (--color-chart-primary/-muted) for line/bar/radial/barHorizontal/
// sparkline, plus a small scoped categorical ramp (--color-chart-cat-1..5)
// for stacked-bar/donut only — never an open-ended series ramp.
//
// Colours are applied as SVG attributes reading the CSS var directly
// (fill="var(--color-chart-primary)") — dark mode re-themes with zero JS,
// same principle as every token-only component in this system.
//
// Readout is a CUSTOM, touch-first pill (see ChartReadout.jsx) — NOT
// src/components/ui/Tooltip, which is hover/focus-only and never fires on
// tap. Sparkline and radial have no readout: sparkline is bare embed
// geometry with no chrome at all, and radial has only one value, already
// always visible, with nothing further to inspect.
//
// Accessibility: each variant's own root renders role="img" aria-label
// around ONLY its visual plot (never around a legend or readout pill —
// role="img" prunes descendants from the accessibility tree, so anything
// meant to be independently reachable has to sit outside it as a sibling;
// see the long comment in ChartLine.jsx). This component additionally
// renders a sr-only <table> mirroring the data as a further sibling, per
// WCAG dataviz guidance that a hover/tap readout is never sufficient alone
// — skipped only for sparkline (bare embed, no independent accessible
// identity of its own; the surrounding MetricCard already carries one).

/**
 * @typedef {Object} ChartProps
 * @property {'line'|'bar'|'barHorizontal'|'sparkline'|'radial'|'donut'} type - Required.
 * @property {Array<Object>} [data] - Shape depends on `type` — see each variant's own props below.
 * @property {'sparkline'|'sm'|'md'|'lg'} [height='md'] - Plot height: 40/160/240/320px.
 *   Ignored by `type="sparkline"`, which is always 40px regardless.
 * @property {'loading'|'empty'|'partial'|'error'|'populated'} [state='populated']
 * @property {string} [emptyMessage] - Override the default empty-state copy.
 * @property {string} [errorMessage] - Override the default error Alert copy.
 * @property {string|number} [headline] - The big number rendered above the plot for
 *   line/bar/barHorizontal, or IN THE CENTRE for radial/donut (with `centerTotal`).
 * @property {string} ariaLabel - Required. The chart's complete accessible description —
 *   for radial/donut this is the ONLY thing a screen reader gets for the centre value
 *   (role="img" prunes that visual text), so include the value in it, e.g.
 *   "Response rate: 62 percent".
 * @property {(value:number)=>string} [valueFormatter] - Formats every rendered value
 *   (readout pill, sr-only table, legend, bar-end labels, centre total).
 * @property {boolean} [area] - line only. Soft gradient fill under the line.
 * @property {boolean} [comparison] - line/bar only. A second, muted prior-period series.
 * @property {number} [highlightIndex] - bar only, non-stacked. That bar = primary,
 *   all others = muted.
 * @property {boolean} [stacked] - bar only. Multi-series stacked bars; requires `series`.
 *   Always renders a legend.
 * @property {Array<{key:string,label:string}>} [series] - bar (stacked) only.
 * @property {'line'|'bar'} [form='line'] - sparkline only.
 * @property {number} [value] - radial only. Current value.
 * @property {number} [max=100] - radial only. Value domain ceiling.
 * @property {boolean} [gauge] - radial only. Half-circle form instead of full ring.
 * @property {boolean} [centerTotal] - donut only. Shows the segment sum (or `headline`,
 *   if provided) in the donut's hollow centre.
 * @property {string} [className]
 */

/**
 * @param {ChartProps} props
 */
export function Chart({
  type,
  data,
  height = 'md',
  state = 'populated',
  emptyMessage,
  errorMessage,
  headline,
  ariaLabel,
  valueFormatter,
  area,
  comparison,
  highlightIndex,
  stacked,
  series,
  form = 'line',
  value,
  max = 100,
  gauge,
  centerTotal,
  className,
}) {
  if (process.env.NODE_ENV !== 'production' && !ariaLabel) {
    console.warn('[Chart] `ariaLabel` is required — it is the chart\'s only accessible description, and for radial/donut the only place a screen reader hears the value at all.');
  }
  if (process.env.NODE_ENV !== 'production' && type === 'bar' && stacked && !series?.length) {
    console.warn('[Chart] `stacked` bar requires a non-empty `series` array.');
  }

  const heightPx = type === 'sparkline' ? HEIGHT_PX.sparkline : HEIGHT_PX[height] ?? HEIGHT_PX.md;
  const showHeadlineAbove = headline != null && type !== 'radial' && type !== 'donut' && type !== 'sparkline';

  let body = null;
  let dataTable = null;

  if (state === 'loading') {
    body = <Skeleton variant="card" height={`${heightPx}px`} />;
  } else if (state === 'empty') {
    if (type === 'sparkline') {
      // No room for the full empty-state chrome at 40px — a flat muted dash
      // reads as "nothing here yet" without blowing out a MetricCard's layout.
      body = <div style={{ height: heightPx, borderBottom: '2px dashed var(--color-chart-track)', margin: 'auto 0' }} />;
    } else {
      body = <ChartEmptyState height={heightPx} message={emptyMessage ?? 'Your first leads will show here.'} />;
    }
  } else if (state === 'error') {
    if (type === 'sparkline') {
      body = <div style={{ height: heightPx, borderBottom: '2px dashed var(--color-chart-track)', margin: 'auto 0' }} />;
    } else {
      body = <Alert tone="error" title={errorMessage ?? "Couldn't load chart data"} />;
    }
  } else {
    // 'partial' and 'populated' both render the real chart — 'partial' just
    // means the data itself has honest gaps (null values), which Recharts
    // already breaks the line/bars across rather than fabricating a trend
    // through (connectNulls defaults false throughout this component).
    switch (type) {
      case 'line':
        body = <ChartLine data={data} heightPx={heightPx} area={area} comparison={comparison} ariaLabel={ariaLabel} valueFormatter={valueFormatter} />;
        dataTable = (
          <ChartDataTable
            caption={ariaLabel}
            columns={comparison ? ['Label', 'Value', 'Comparison'] : ['Label', 'Value']}
            rows={data.map((d) => (comparison ? [d.label, d.value ?? '—', d.comparisonValue ?? '—'] : [d.label, d.value ?? '—']))}
          />
        );
        break;
      case 'bar':
        body = (
          <ChartBar
            data={data}
            heightPx={heightPx}
            highlightIndex={highlightIndex}
            comparison={comparison}
            stacked={stacked}
            series={series}
            ariaLabel={ariaLabel}
            valueFormatter={valueFormatter}
          />
        );
        dataTable = stacked ? (
          <ChartDataTable
            caption={ariaLabel}
            columns={['Label', ...(series ?? []).map((s) => s.label)]}
            rows={data.map((d) => [d.label, ...(series ?? []).map((s) => d[s.key] ?? '—')])}
          />
        ) : (
          <ChartDataTable
            caption={ariaLabel}
            columns={comparison ? ['Label', 'Value', 'Comparison'] : ['Label', 'Value']}
            rows={data.map((d) => (comparison ? [d.label, d.value ?? '—', d.comparisonValue ?? '—'] : [d.label, d.value ?? '—']))}
          />
        );
        break;
      case 'barHorizontal':
        body = <ChartBarHorizontal data={data} heightPx={heightPx} ariaLabel={ariaLabel} valueFormatter={valueFormatter} />;
        dataTable = <ChartDataTable caption={ariaLabel} columns={['Label', 'Value']} rows={data.map((d) => [d.label, d.value ?? '—'])} />;
        break;
      case 'sparkline':
        body = <ChartSparkline data={data} form={form} ariaLabel={ariaLabel} />;
        break;
      case 'radial':
        body = <ChartRadial value={value} max={max} gauge={gauge} headline={headline} heightPx={heightPx} ariaLabel={ariaLabel} />;
        dataTable = <ChartDataTable caption={ariaLabel} columns={['Value', 'Max']} rows={[[value ?? '—', max]]} />;
        break;
      case 'donut':
        body = (
          <ChartDonut
            data={data}
            centerTotal={centerTotal}
            headline={headline}
            heightPx={heightPx}
            ariaLabel={ariaLabel}
            valueFormatter={valueFormatter}
          />
        );
        dataTable = <ChartDataTable caption={ariaLabel} columns={['Label', 'Value']} rows={data.map((d) => [d.label, d.value ?? '—'])} />;
        break;
      default:
        if (process.env.NODE_ENV !== 'production') console.warn(`[Chart] unknown type "${type}".`);
    }
  }

  return (
    <div className={className}>
      {showHeadlineAbove && <div style={HEADLINE_STYLE}>{headline}</div>}
      {state === 'partial' && (
        <p style={{ margin: '0 0 var(--space-2) 0', fontFamily: 'var(--font-body)', fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>
          Showing partial data
        </p>
      )}
      {body}
      {dataTable}
    </div>
  );
}
