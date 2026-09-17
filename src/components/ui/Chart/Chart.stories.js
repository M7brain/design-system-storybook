import React, { useState } from 'react';
import { Chart } from './Chart.jsx';

// ─────────────────────────────────────────────────────────────────────────────
// META
// ─────────────────────────────────────────────────────────────────────────────

export default {
  title: 'Components/Chart',
  parameters: {
    layout: 'fullscreen',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS — StoryFrame copied verbatim from Button.stories.jsx's Light/Dark toggle
// ─────────────────────────────────────────────────────────────────────────────

function StoryFrame({ children }) {
  const [isDark, setIsDark] = useState(false);

  return (
    <div
      className={isDark ? 'dark' : ''}
      style={{ background: 'var(--color-bg-primary)', minHeight: '100vh', width: '100%', padding: '32px' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <button
          onClick={() => setIsDark(false)}
          aria-pressed={!isDark}
          style={{
            height: '32px', padding: '0 16px',
            borderRadius: 'var(--radius-sm)',
            border: !isDark ? 'none' : '1px solid var(--color-border-default)',
            background: !isDark ? 'var(--color-brand-btn)' : 'transparent',
            color: !isDark ? 'var(--color-brand-btn-text)' : 'var(--color-text-secondary)',
            fontFamily: 'Inter', fontWeight: 500, fontSize: '0.875rem', cursor: 'pointer',
          }}
        >
          Light
        </button>
        <button
          onClick={() => setIsDark(true)}
          aria-pressed={isDark}
          style={{
            height: '32px', padding: '0 16px',
            borderRadius: 'var(--radius-sm)',
            border: isDark ? 'none' : '1px solid var(--color-border-default)',
            background: isDark ? 'var(--color-brand-btn)' : 'transparent',
            color: isDark ? 'var(--color-brand-btn-text)' : 'var(--color-text-secondary)',
            fontFamily: 'Inter', fontWeight: 500, fontSize: '0.875rem', cursor: 'pointer',
          }}
        >
          Dark
        </button>
      </div>
      <div style={{ borderBottom: '1px solid var(--color-border-default)', marginBottom: '32px' }} />
      {children}
    </div>
  );
}

function Divider() {
  return <div style={{ borderBottom: '1px solid var(--color-border-default)', margin: '48px 0' }} />;
}

function SectionHead({ title, description }) {
  return (
    <div style={{ marginBottom: '32px' }}>
      <h2 style={{
        fontFamily: 'Inter, sans-serif', fontSize: '1.25rem', fontWeight: 600,
        lineHeight: '1.75rem', color: 'var(--color-text-primary)', margin: '0 0 8px 0',
      }}>
        {title}
      </h2>
      {description && (
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 400,
          lineHeight: '1.75rem', color: 'var(--color-text-secondary)', margin: 0,
        }}>
          {description}
        </p>
      )}
    </div>
  );
}

function BlockLabel({ children }) {
  return (
    <div style={{
      fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 500,
      letterSpacing: '0.06em', textTransform: 'uppercase',
      color: 'var(--color-text-secondary)', marginBottom: '12px',
    }}>
      {children}
    </div>
  );
}

function InfoBox({ children, style }) {
  return (
    <div style={{
      background: 'var(--color-bg-surface)',
      border: '1px solid var(--color-border-default)',
      borderRadius: 'var(--radius-md)',
      padding: '24px',
      ...style,
    }}>
      {children}
    </div>
  );
}

function Note({ children }) {
  return (
    <p style={{
      fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
      color: 'var(--color-text-secondary)', margin: '16px 0 0 0',
    }}>
      {children}
    </p>
  );
}

const code = { fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' };

// ─────────────────────────────────────────────────────────────────────────────
// SCAFFOLD — a minimal metric-card shell for the sparkline demos. NOT a real
// product component (MetricCard is a future Pattern, not built yet) — pure
// layout scaffolding, same "InfoBox stand-in" convention Pagination's own
// story already used for Card. The Chart sparkline instance inside it IS
// the real component under test.
// ─────────────────────────────────────────────────────────────────────────────

function MetricCardScaffold({ label, value, children }) {
  return (
    <InfoBox style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', minWidth: '200px' }}>
      <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
        {label}
      </div>
      <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.75rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
        {value}
      </div>
      {children}
    </InfoBox>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DEMO DATA — realistic Quicklo shapes, not lorem ipsum
// ─────────────────────────────────────────────────────────────────────────────

const RESPONSE_TIME_DATA = [
  { label: 'Mon', value: 52 },
  { label: 'Tue', value: 45 },
  { label: 'Wed', value: 61 },
  { label: 'Thu', value: 38 },
  { label: 'Fri', value: 49 },
  { label: 'Sat', value: 41 },
  { label: 'Sun', value: 39 },
];

const LEADS_OVER_TIME_DATA = [
  { label: 'Wk 1', value: 18, comparisonValue: 12 },
  { label: 'Wk 2', value: 24, comparisonValue: 19 },
  { label: 'Wk 3', value: 21, comparisonValue: 20 },
  { label: 'Wk 4', value: 31, comparisonValue: 22 },
  { label: 'Wk 5', value: 27, comparisonValue: 25 },
  { label: 'Wk 6', value: 34, comparisonValue: 28 },
];

const LEADS_BY_DAY_DATA = [
  { label: 'Mon', value: 6, comparisonValue: 4 },
  { label: 'Tue', value: 9, comparisonValue: 7 },
  { label: 'Wed', value: 5, comparisonValue: 6 },
  { label: 'Thu', value: 14, comparisonValue: 8 },
  { label: 'Fri', value: 8, comparisonValue: 9 },
];

const REPLY_CHANNEL_DATA = [
  { label: 'Wk 1', sms: 12, email: 8, missed: 2 },
  { label: 'Wk 2', sms: 15, email: 6, missed: 3 },
  { label: 'Wk 3', sms: 9, email: 10, missed: 1 },
  { label: 'Wk 4', sms: 18, email: 7, missed: 2 },
];

const REPLY_CHANNEL_SERIES = [
  { key: 'sms', label: 'SMS' },
  { key: 'email', label: 'Email' },
  { key: 'missed', label: 'Missed call' },
];

const ENQUIRY_TYPES_DATA = [
  { label: 'Plumbing emergency', value: 38 },
  { label: 'HVAC service', value: 29 },
  { label: 'New installation', value: 24 },
  { label: 'Drain cleaning', value: 17 },
  { label: 'Boiler repair', value: 12 },
];

const SPARKLINE_DATA = [
  { value: 4 }, { value: 7 }, { value: 5 }, { value: 9 }, { value: 8 }, { value: 12 }, { value: 10 },
];

const PLAN_BREAKDOWN_DATA = [
  { key: 'free', label: 'Free', value: 120 },
  { key: 'starter', label: 'Starter', value: 85 },
  { key: 'pro', label: 'Pro', value: 64 },
  { key: 'business', label: 'Business', value: 31 },
];

// ─────────────────────────────────────────────────────────────────────────────
// REFERENCE DATA — props + height scale + states + tokens
// ─────────────────────────────────────────────────────────────────────────────

const PROPS = [
  { name: 'type', type: "'line' | 'bar' | 'barHorizontal' | 'sparkline' | 'radial' | 'donut'", defaultVal: '—', description: 'Required. Selects one of the six variants.' },
  { name: 'data', type: 'Array<Object>', defaultVal: '—', description: 'Shape depends on type — {label,value,comparisonValue?} for line/bar/barHorizontal, {value} for sparkline, {key,label,value} for donut. Ignored by radial (uses value/max instead).' },
  { name: 'height', type: "'sparkline' | 'sm' | 'md' | 'lg'", defaultVal: "'md'", description: 'Plot height: 40/160/240/320px. Ignored by type="sparkline", always 40px.' },
  { name: 'state', type: "'loading' | 'empty' | 'partial' | 'error' | 'populated'", defaultVal: "'populated'", description: 'loading is a Skeleton, never a spinner. empty is a local EmptyState stand-in. partial renders real data honestly, gaps included. error is an inline Alert.' },
  { name: 'headline', type: 'string | number', defaultVal: 'undefined', description: 'The big number — rendered ABOVE the plot for line/bar/barHorizontal, or IN THE CENTRE for radial/donut (with centerTotal).' },
  { name: 'ariaLabel', type: 'string', defaultVal: '—', description: 'Required — the chart’s complete accessible description. For radial/donut this is the ONLY thing a screen reader hears for the centre value.' },
  { name: 'valueFormatter', type: '(value: number) => string', defaultVal: 'undefined', description: 'Formats every rendered value — readout pill, sr-only table, legend, bar-end labels.' },
  { name: 'area', type: 'bool', defaultVal: 'false', description: 'line only. Soft gradient fill under the line.' },
  { name: 'comparison', type: 'bool', defaultVal: 'false', description: 'line/bar only. A second, muted prior-period series.' },
  { name: 'highlightIndex', type: 'number', defaultVal: 'undefined', description: 'bar only, non-stacked. That bar = primary colour, all others = muted.' },
  { name: 'stacked', type: 'bool', defaultVal: 'false', description: 'bar only. Multi-series stacked bars — requires series. Always renders a legend.' },
  { name: 'series', type: 'Array<{key, label}>', defaultVal: 'undefined', description: 'bar (stacked) only. One entry per stacked series, coloured from the categorical ramp in order.' },
  { name: 'form', type: "'line' | 'bar'", defaultVal: "'line'", description: 'sparkline only.' },
  { name: 'value', type: 'number', defaultVal: 'undefined', description: 'radial only. Current value.' },
  { name: 'max', type: 'number', defaultVal: '100', description: 'radial only. Value domain ceiling.' },
  { name: 'gauge', type: 'bool', defaultVal: 'false', description: 'radial only. Half-circle form instead of a full ring.' },
  { name: 'centerTotal', type: 'bool', defaultVal: 'false', description: 'donut only. Shows the segment sum (or headline, if provided) in the hollow centre.' },
  { name: 'className', type: 'string', defaultVal: 'undefined', description: "Appended to the root div's classes." },
];

const HEIGHTS = [
  { name: 'sparkline', value: '40px', usage: 'type="sparkline" always — ignores this prop, forced regardless.' },
  { name: 'sm', value: '160px', usage: 'Compact plots — radial/donut rings, a metric next to other content.' },
  { name: 'md', value: '240px', usage: 'Default — most standalone chart cards.' },
  { name: 'lg', value: '320px', usage: 'Full-width analytics-page charts, the primary chart on a page.' },
];

const STATES = [
  { name: 'loading', usage: 'A Skeleton card cut to the chart’s own height — never a spinner.' },
  { name: 'empty', usage: 'A local ChartEmptyState stand-in — BarChart2 icon + payoff copy — flagged for migration once the real EmptyState component ships.' },
  { name: 'partial', usage: 'Renders the real data as-is with an honest "Showing partial data" caption. Gaps (null values) break the line rather than fabricate a trend across them.' },
  { name: 'error', usage: 'An inline Alert, tone="error".' },
  { name: 'populated', usage: 'The chart, fully interactive.' },
];

const TOKENS = [
  { name: '--color-chart-primary', usage: 'The single-series stroke/fill — line, bar (non-stacked), barHorizontal, sparkline, radial arc.' },
  { name: '--color-chart-primary-muted', usage: 'De-emphasized comparison/ghost fill — non-highlighted bars, the dashed comparison line. Deliberately below 3:1 contrast by design (see docs/DOC-colour-system.md).' },
  { name: '--color-chart-primary-fill-from / -to', usage: 'The line variant’s optional gradient area fill, fading to transparent.' },
  { name: '--color-chart-cat-1..5', usage: 'The categorical ramp — stacked bar and donut segments only.' },
  { name: '--color-chart-grid', usage: 'Horizontal dashed gridlines.' },
  { name: '--color-chart-axis', usage: 'Axis line + the active-point reference line.' },
  { name: '--color-chart-track', usage: 'The radial ring’s unfilled background track.' },
  { name: '--color-chart-readout-bg / -text', usage: 'The custom touch-first readout pill.' },
];

// ─────────────────────────────────────────────────────────────────────────────
// STORY EXPORT — single Overview export, per the style guide.
// ─────────────────────────────────────────────────────────────────────────────

export const Overview = () => (
  <StoryFrame>

    {/* ── Page header ────────────────────────────────────────────────────── */}
    <div style={{ marginBottom: '48px' }}>
      <h1 style={{
        fontFamily: 'Outfit, sans-serif', fontSize: '1.75rem', fontWeight: 700,
        lineHeight: '2.25rem', letterSpacing: '-0.02em',
        color: 'var(--color-text-primary)', margin: '0 0 8px 0',
      }}>
        Chart
      </h1>
      <p style={{
        fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 400,
        lineHeight: '1.75rem', color: 'var(--color-text-secondary)', margin: 0,
      }}>
        Built on Recharts. 6 variants: line, bar, barHorizontal, sparkline, radial, donut.
        Option A palette — one monochromatic brand series plus a small scoped categorical ramp.
        Readout is a custom, touch-first pill, never the Tooltip component.
      </p>
    </div>

    {/* ── 1. Line ───────────────────────────────────────────────────────────── */}
    <SectionHead
      title="Line"
      description="Smooth monotone stroke. Tap or hover a point on either chart below to see the touch-first readout pill — it stays until you tap elsewhere or press Escape."
    />
    <div style={{ marginBottom: '40px', display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      <div>
        <BlockLabel>Plain — Response time (seconds)</BlockLabel>
        <Chart
          type="line"
          data={RESPONSE_TIME_DATA}
          headline="Avg 46s"
          ariaLabel="Response time in seconds, by day, this week"
          valueFormatter={(v) => `${v}s`}
        />
      </div>
      <div>
        <BlockLabel>Area + comparison — Leads over time</BlockLabel>
        <Chart
          type="line"
          data={LEADS_OVER_TIME_DATA}
          area
          comparison
          headline="155 leads"
          ariaLabel="Leads over time, last 6 weeks, versus the prior period"
        />
        <Note>Dashed muted line is the prior period — never competing with the primary stroke.</Note>
      </div>
    </div>

    <Divider />

    {/* ── 2. Bar (vertical) ─────────────────────────────────────────────────── */}
    <SectionHead
      title="Bar — vertical"
      description="Rounded top caps only. Leads by day of week, shown plain, with a highlighted best day, and against the prior period."
    />
    <div style={{ marginBottom: '40px', display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      <div>
        <BlockLabel>Plain</BlockLabel>
        <Chart type="bar" data={LEADS_BY_DAY_DATA} headline="42 leads" ariaLabel="Leads by day of week" />
      </div>
      <div>
        <BlockLabel>highlightIndex — best day called out</BlockLabel>
        <Chart type="bar" data={LEADS_BY_DAY_DATA} highlightIndex={3} headline="Best day: Thursday" ariaLabel="Leads by day of week, Thursday highlighted as the best day" />
      </div>
      <div>
        <BlockLabel>comparison — vs prior week (ghosted)</BlockLabel>
        <Chart type="bar" data={LEADS_BY_DAY_DATA} comparison headline="42 leads (+9 vs last week)" ariaLabel="Leads by day of week, versus the prior week" />
      </div>
      <div>
        <BlockLabel>stacked — Reply channel mix (always shows a legend)</BlockLabel>
        <Chart type="bar" data={REPLY_CHANNEL_DATA} stacked series={REPLY_CHANNEL_SERIES} ariaLabel="Reply channel mix by week — SMS, email, missed call" />
      </div>
    </div>

    <Divider />

    {/* ── 3. Bar horizontal ─────────────────────────────────────────────────── */}
    <SectionHead
      title="Bar — horizontal"
      description="Ranked, rounded end caps, value labelled at the bar end — for long category labels that would rotate or truncate on a vertical axis."
    />
    <div style={{ marginBottom: '40px' }}>
      <BlockLabel>Top enquiry types</BlockLabel>
      <Chart type="barHorizontal" data={ENQUIRY_TYPES_DATA} height="sm" ariaLabel="Top enquiry types this month" />
    </div>

    <Divider />

    {/* ── 4. Sparkline ──────────────────────────────────────────────────────── */}
    <SectionHead
      title="Sparkline"
      description="40px tall always, no axes/grid/legend/readout — bare embed geometry for a MetricCard, shown here inside a scaffold standing in for that future Pattern."
    />
    <div style={{ marginBottom: '40px', display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
      <MetricCardScaffold label="Leads this week" value="55">
        <Chart type="sparkline" data={SPARKLINE_DATA} form="line" ariaLabel="Leads trend, last 7 days" />
      </MetricCardScaffold>
      <MetricCardScaffold label="Leads this week" value="55">
        <Chart type="sparkline" data={SPARKLINE_DATA} form="bar" ariaLabel="Leads trend, last 7 days" />
      </MetricCardScaffold>
    </div>

    <Divider />

    {/* ── 5. Radial ─────────────────────────────────────────────────────────── */}
    <SectionHead
      title="Radial"
      description="Single-value progress ring, rounded arc caps, big Inter-600 value in the centre — never Outfit. No readout: there's only one value, already always visible."
    />
    <div style={{ marginBottom: '40px', display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
      <div>
        <BlockLabel>Ring — Lead-to-reply rate</BlockLabel>
        <Chart type="radial" value={68} max={100} headline="68%" height="sm" ariaLabel="Lead-to-reply rate: 68 percent" />
      </div>
      <div>
        <BlockLabel>Gauge — Replies under 90s</BlockLabel>
        <Chart type="radial" value={82} max={100} gauge headline="82%" height="sm" ariaLabel="Replies under 90 seconds: 82 percent" />
      </div>
    </div>

    <Divider />

    {/* ── 6. Donut ──────────────────────────────────────────────────────────── */}
    <SectionHead
      title="Donut"
      description="Multi-segment, rounded segment caps, categorical ramp. ALWAYS a legend with values. For small fixed sets (≤5 segments) — e.g. an admin plan breakdown."
    />
    <div style={{ marginBottom: '40px' }}>
      <BlockLabel>Plan breakdown</BlockLabel>
      <Chart type="donut" data={PLAN_BREAKDOWN_DATA} centerTotal height="sm" ariaLabel="Plan breakdown by tier — Free, Starter, Pro, Business" />
    </div>

    <Divider />

    {/* ── 7. States ─────────────────────────────────────────────────────────── */}
    <SectionHead
      title="States"
      description="loading, empty, partial, and error, shown on the bar variant as a representative example — every variant shares the same state machine."
    />
    <div style={{ marginBottom: '40px', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <BlockLabel>loading — Skeleton, never a spinner</BlockLabel>
        <Chart type="bar" data={[]} state="loading" ariaLabel="Loading leads by day" />
      </div>
      <div>
        <BlockLabel>empty — local EmptyState stand-in</BlockLabel>
        <Chart type="bar" data={[]} state="empty" ariaLabel="No leads yet" />
      </div>
      <div>
        <BlockLabel>partial — honest gaps, no fabricated trend</BlockLabel>
        <Chart
          type="line"
          data={[{ label: 'Mon', value: 6 }, { label: 'Tue', value: null }, { label: 'Wed', value: null }, { label: 'Thu', value: 9 }, { label: 'Fri', value: 7 }]}
          state="partial"
          ariaLabel="Leads by day, partial data"
        />
      </div>
      <div>
        <BlockLabel>error — inline Alert</BlockLabel>
        <Chart type="bar" data={[]} state="error" ariaLabel="Leads by day" />
      </div>
    </div>

    <Divider />

    {/* ── 8. Usage guide ────────────────────────────────────────────────────── */}
    <SectionHead
      title="Usage guide"
      description="Which variant to reach for on the Analytics screen (see docs/DOC-product-spec.md)."
    />
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
      gap: '16px',
      marginBottom: '40px',
    }}>
      <InfoBox>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
          Response time trend → line
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          A continuous measure over time — is it trending toward or away from the 90-second promise.
        </p>
      </InfoBox>
      <InfoBox>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
          Best day → bar (highlightIndex)
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          A ranked category comparison with one obvious standout — the highlighted bar does the work a legend would otherwise need to.
        </p>
      </InfoBox>
      <InfoBox>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
          Top enquiry types → barHorizontal
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          Long category labels read better ranked horizontally than rotated or truncated on a vertical axis.
        </p>
      </InfoBox>
      <InfoBox>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
          Lead-to-reply / cold-lead rate → radial or MetricCard
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          A single %, no chart at all — a plain MetricCard number is often enough; reach for radial when a visual proportion adds real information at a glance.
        </p>
      </InfoBox>
    </div>

    <Divider />

    {/* ── 9. Reference table ────────────────────────────────────────────────── */}
    <SectionHead
      title="Reference table"
      description="Every prop, the height scale, every state, and every colour token Chart consumes."
    />

    <div style={{ marginBottom: '40px' }}>
      <BlockLabel>Props</BlockLabel>
      <div style={{
        background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-default)',
        borderRadius: 'var(--radius-md)', overflow: 'hidden',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--color-bg-secondary)' }}>
              {['PROP', 'TYPE', 'DEFAULT', 'DESCRIPTION'].map((h) => (
                <th key={h} style={{
                  padding: '12px 16px', textAlign: 'left',
                  fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 500,
                  textTransform: 'uppercase', letterSpacing: '0.04em',
                  color: 'var(--color-text-secondary)',
                  borderBottom: '1px solid var(--color-border-default)',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PROPS.map((prop, i) => (
              <tr key={prop.name} style={{ background: i % 2 === 0 ? 'var(--color-bg-surface)' : 'var(--color-bg-primary)' }}>
                <td style={{
                  padding: '12px 16px', minHeight: '44px',
                  fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem',
                  color: 'var(--color-text-primary)', whiteSpace: 'nowrap',
                  borderBottom: i < PROPS.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                }}>
                  {prop.name}
                </td>
                <td style={{
                  padding: '12px 16px',
                  fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem',
                  color: 'var(--color-text-secondary)',
                  borderBottom: i < PROPS.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                }}>
                  {prop.type}
                </td>
                <td style={{
                  padding: '12px 16px',
                  fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem',
                  color: 'var(--color-text-secondary)', whiteSpace: 'nowrap',
                  borderBottom: i < PROPS.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                }}>
                  {prop.defaultVal}
                </td>
                <td style={{
                  padding: '12px 16px',
                  fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
                  color: 'var(--color-text-primary)',
                  borderBottom: i < PROPS.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                }}>
                  {prop.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <div style={{ marginBottom: '40px' }}>
      <BlockLabel>Height scale</BlockLabel>
      <div style={{
        background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-default)',
        borderRadius: 'var(--radius-md)', overflow: 'hidden',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--color-bg-secondary)' }}>
              {['TOKEN', 'VALUE', 'USAGE'].map((h) => (
                <th key={h} style={{
                  padding: '12px 16px', textAlign: 'left',
                  fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 500,
                  textTransform: 'uppercase', letterSpacing: '0.04em',
                  color: 'var(--color-text-secondary)',
                  borderBottom: '1px solid var(--color-border-default)',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HEIGHTS.map((row, i) => (
              <tr key={row.name} style={{ background: i % 2 === 0 ? 'var(--color-bg-surface)' : 'var(--color-bg-primary)' }}>
                <td style={{ padding: '12px 16px', fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem', color: 'var(--color-text-primary)', borderBottom: i < HEIGHTS.length - 1 ? '1px solid var(--color-border-subtle)' : 'none' }}>{row.name}</td>
                <td style={{ padding: '12px 16px', fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap', borderBottom: i < HEIGHTS.length - 1 ? '1px solid var(--color-border-subtle)' : 'none' }}>{row.value}</td>
                <td style={{ padding: '12px 16px', fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-primary)', borderBottom: i < HEIGHTS.length - 1 ? '1px solid var(--color-border-subtle)' : 'none' }}>{row.usage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <div style={{ marginBottom: '40px' }}>
      <BlockLabel>States</BlockLabel>
      <div style={{
        background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-default)',
        borderRadius: 'var(--radius-md)', overflow: 'hidden',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--color-bg-secondary)' }}>
              {['STATE', 'BEHAVIOUR'].map((h) => (
                <th key={h} style={{
                  padding: '12px 16px', textAlign: 'left',
                  fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 500,
                  textTransform: 'uppercase', letterSpacing: '0.04em',
                  color: 'var(--color-text-secondary)',
                  borderBottom: '1px solid var(--color-border-default)',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {STATES.map((row, i) => (
              <tr key={row.name} style={{ background: i % 2 === 0 ? 'var(--color-bg-surface)' : 'var(--color-bg-primary)' }}>
                <td style={{ padding: '12px 16px', fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem', color: 'var(--color-text-primary)', whiteSpace: 'nowrap', borderBottom: i < STATES.length - 1 ? '1px solid var(--color-border-subtle)' : 'none' }}>{row.name}</td>
                <td style={{ padding: '12px 16px', fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-primary)', borderBottom: i < STATES.length - 1 ? '1px solid var(--color-border-subtle)' : 'none' }}>{row.usage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <div style={{ marginBottom: '40px' }}>
      <BlockLabel>Tokens consumed</BlockLabel>
      <div style={{
        background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-default)',
        borderRadius: 'var(--radius-md)', overflow: 'hidden',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--color-bg-secondary)' }}>
              {['TOKEN', 'USAGE'].map((h) => (
                <th key={h} style={{
                  padding: '12px 16px', textAlign: 'left',
                  fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 500,
                  textTransform: 'uppercase', letterSpacing: '0.04em',
                  color: 'var(--color-text-secondary)',
                  borderBottom: '1px solid var(--color-border-default)',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TOKENS.map((row, i) => (
              <tr key={row.name} style={{ background: i % 2 === 0 ? 'var(--color-bg-surface)' : 'var(--color-bg-primary)' }}>
                <td style={{ padding: '12px 16px', fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem', color: 'var(--color-text-primary)', whiteSpace: 'nowrap', borderBottom: i < TOKENS.length - 1 ? '1px solid var(--color-border-subtle)' : 'none' }}>{row.name}</td>
                <td style={{ padding: '12px 16px', fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-primary)', borderBottom: i < TOKENS.length - 1 ? '1px solid var(--color-border-subtle)' : 'none' }}>{row.usage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <div style={{ marginBottom: '40px' }}>
      <BlockLabel>Accessibility notes</BlockLabel>
      <InfoBox>
        <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <li style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-primary)' }}>
            Each variant&apos;s own root renders <code style={code}>role=&quot;img&quot;</code> <code style={code}>aria-label</code> around ONLY the visual plot — never around a legend or the readout pill, because <code style={code}>role=&quot;img&quot;</code> prunes descendants from the accessibility tree.
          </li>
          <li style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-primary)' }}>
            A visually-hidden (<code style={code}>sr-only</code>) <code style={code}>&lt;table&gt;</code> mirrors the underlying data as a sibling of that plot, per WCAG dataviz guidance that a hover/tap readout is never sufficient alone. Skipped only for sparkline, which has no independent accessible identity beyond its surrounding MetricCard.
          </li>
          <li style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-primary)' }}>
            The readout is a <strong>custom, touch-first pill</strong> — never <code style={code}>src/components/ui/Tooltip</code>, which is hover/focus-only and never fires on tap. Persistent + dismissible (WCAG 1.4.13): stays until Escape or an outside tap. Arrow keys move the active point on a focused chart.
          </li>
          <li style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-primary)' }}>
            Interactive legend chips (stacked bar / donut series toggles) get the standard 44×44 <code style={code}>::before</code> tap-target expansion, same as every other interactive chip in this system.
          </li>
        </ul>
      </InfoBox>
    </div>

  </StoryFrame>
);
