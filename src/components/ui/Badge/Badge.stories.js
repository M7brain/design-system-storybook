import React, { useState } from 'react';
import { Badge } from './Badge.jsx';
import { Chip } from './Chip.jsx';
import { Tabs } from '@/components/ui/Tabs/Tabs.jsx';

// ─────────────────────────────────────────────────────────────────────────────
// META
// ─────────────────────────────────────────────────────────────────────────────

export default {
  title: 'Components/Badge',
  parameters: {
    layout: 'fullscreen',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS — StoryFrame copied from Button.stories.jsx's Light/Dark toggle
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

function Code({ children }) {
  return <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>{children}</code>;
}

// ─────────────────────────────────────────────────────────────────────────────
// SCAFFOLD — a simple avatar-initial circle for the LeadRow/ConnectionCard
// simulations below. NOT the real Avatar component (not built yet) — this is
// layout scaffolding only. The Badge inside each row IS the real component.
// ─────────────────────────────────────────────────────────────────────────────

function AvatarScaffold({ initials }) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: '40px', height: '40px', borderRadius: 'var(--radius-full)',
        background: 'var(--color-bg-secondary)', color: 'var(--color-text-secondary)',
        fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 500, lineHeight: '1.25rem',
        flexShrink: 0,
      }}
    >
      {initials}
    </span>
  );
}

function LeadRow({ initials, name, preview, time, children }) {
  return (
    <div className="flex items-center" style={{ gap: 'var(--space-3)', padding: 'var(--space-3) 0' }}>
      <AvatarScaffold initials={initials} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 500, lineHeight: '1.25rem', color: 'var(--color-text-primary)' }}>
          {name}
        </div>
        <div style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 400, lineHeight: '1.25rem',
          color: 'var(--color-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {preview}
        </div>
      </div>
      <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'var(--color-text-secondary)', flexShrink: 0 }}>
        {time}
      </div>
      {children}
    </div>
  );
}

const LEAD_ROWS = [
  { initials: 'SM', name: 'Sarah Mitchell', preview: 'Hi, do you do same-day plumbing repairs?', time: '2m ago', tone: 'neutral', icon: 'Sparkles', label: 'New' },
  { initials: 'DC', name: 'Dave Chen', preview: 'Following up on my quote request from Tuesday', time: '18m ago', tone: 'warning', icon: 'Clock', label: 'Awaiting' },
  { initials: 'PP', name: 'Priya Patel', preview: 'Thanks, see you Thursday at 10am!', time: '1h ago', tone: 'success', icon: 'Reply', label: 'Replied' },
  { initials: 'TO', name: "Tom O'Brien", preview: 'Booked the AC service for next week', time: '3h ago', tone: 'success', icon: 'Check', label: 'Booked' },
  { initials: 'AC', name: 'Angela Cruz', preview: "Haven't heard back — is anyone available?", time: '2 days ago', tone: 'error', icon: 'AlertTriangle', label: 'Needs attention' },
];

const CONNECTION_ROWS = [
  { name: 'Webflow webhook', tone: 'success', label: 'Active' },
  { name: 'Typeform webhook', tone: 'neutral', label: 'Untested' },
  { name: 'WordPress webhook', tone: 'error', label: 'Failed' },
];

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS — tones gallery + reference tables
// ─────────────────────────────────────────────────────────────────────────────

const TONE_DEMOS = [
  { tone: 'neutral', icon: 'Sparkles', label: 'New' },
  { tone: 'warning', icon: 'Clock', label: 'Awaiting' },
  { tone: 'success', icon: 'Reply', label: 'Replied' },
  { tone: 'success', icon: 'Check', label: 'Booked' },
  { tone: 'error', icon: 'AlertTriangle', label: 'Needs attention' },
  { tone: 'neutral', icon: 'MinusCircle', label: 'Closed' },
  { tone: 'info', icon: 'Link', label: 'Webhook connected' },
];

// Chip — a compact, non-interactive sibling of Badge (2026-07-08), stored in
// this same folder and shown here as a section on the Badge page rather than
// a separate Storybook sidebar entry, per Marko.
const CHIP_STATUS_DEMOS = [
  { tone: 'neutral', icon: 'Sparkles', label: 'New' },
  { tone: 'warning', icon: 'Clock', label: 'Awaiting' },
  { tone: 'success', icon: 'Check', label: 'Booked' },
  { tone: 'error', icon: 'AlertTriangle', label: 'Failed' },
  { tone: 'info', icon: 'Link', label: 'Connected' },
];

const TABLE_ROWS = [
  { lead: 'Sarah Mitchell', source: 'Web', tone: 'error', label: 'Needs attention' },
  { lead: 'Dave Chen', source: 'Phone', tone: 'warning', label: 'Awaiting' },
  { lead: 'Priya Patel', source: 'Web', tone: 'success', label: 'Booked' },
];

const PROPS = [
  {
    name: 'tone',
    type: "'neutral' | 'success' | 'warning' | 'error' | 'info'",
    defaultVal: "'neutral'",
    description: 'Status colour. Drives the soft-tint fill/border pair and the label/icon/dot colour.',
  },
  {
    name: 'icon',
    type: 'string',
    defaultVal: 'undefined',
    description: 'Approved icon name, rendered at size "sm" (16px). Takes precedence over dot when set.',
  },
  {
    name: 'dot',
    type: 'bool',
    defaultVal: 'true',
    description: 'Renders an 8px leading dot when no icon is set. dot={false} with no icon renders a bare label.',
  },
  {
    name: 'pulse',
    type: 'bool',
    defaultVal: 'false',
    description: 'Animates the dot only (scale+opacity breathe). Ignored if an icon is used, dot={false}, or tone is info.',
  },
  {
    name: 'srPrefix',
    type: 'string',
    defaultVal: 'undefined',
    description: 'Visually-hidden prefix (e.g. "Status: ") rendered before the label, for sole-conveyor contexts.',
  },
  {
    name: 'children',
    type: 'ReactNode',
    defaultVal: '—',
    description: 'The label text. REQUIRED — this is the accessible name. 1–2 words, sentence case, never truncated.',
  },
];

const TOKENS = [
  { token: '--color-badge-success-bg', value: '#deede4 / #1d2c22', usage: 'Success pill fill (color-mix, 14%)' },
  { token: '--color-badge-success-border', value: '#b9d9c5 / #1b3b27', usage: 'Success pill border (color-mix, 30%)' },
  { token: '--color-badge-warning-bg', value: '#fef6e0 / #3d351f', usage: 'Warning pill fill (color-mix, 14%)' },
  { token: '--color-badge-warning-border', value: '#feecbd / #604e20', usage: 'Warning pill border (color-mix, 30%)' },
  { token: '--color-badge-error-bg', value: '#f5dfdf / #341e1e', usage: 'Error pill fill (color-mix, 14%)' },
  { token: '--color-badge-error-border', value: '#eabbbb / #4d1d1d', usage: 'Error pill border (color-mix, 30%)' },
  { token: '--color-badge-info-bg', value: '#dceaf2 / #1a2930', usage: 'Info pill fill (color-mix, 14%)' },
  { token: '--color-badge-info-border', value: '#b3d2e3 / #163545', usage: 'Info pill border (color-mix, 30%)' },
  { token: '--color-badge-neutral-bg', value: '#f4f4f4 / #282828', usage: 'Neutral pill fill (color-mix, 8% — reduced from 14% to clear 4.5:1)' },
  { token: '--color-badge-neutral-border', value: '#d4d4d4 / #373737', usage: 'Neutral pill border (color-mix, 30% light / 20% dark — asymmetric so the dark hairline stays proportionate to the much lighter 8% dark fill)' },
  { token: '--color-status-success-text / -warning-text / -error-text / -info-text', value: 'warning: #8a6914 / #fcd46c', usage: 'Label + icon + dot colour for all 4 tones, incl. warning (yellow-800 light — changed from yellow-700, which only cleared 3.27:1 against white)' },
  { token: '--color-status-neutral', value: '#707070 / #9d9d9d', usage: 'Neutral icon + dot colour only (never the label)' },
  { token: '--color-text-secondary', value: '#707070 / #adadad', usage: 'Neutral label colour' },
  { token: '--color-pulse-default / -success / -warning / -error', value: '—', usage: 'Pulse animation colour per tone (info excluded, no token)' },
  { token: '--radius-full', value: '9999px', usage: 'Pill shape' },
  { token: '--text-body-md', value: '0.875rem', usage: 'Label font size' },
  { token: '--space-1 / --space-2 / --space-3', value: '4px / 8px / 12px', usage: 'Pill block padding / indicator→label gap / pill inline padding' },
  { token: '--duration-pulse / --ease-spring', value: '2000ms / spring curve', usage: 'Pulse animation timing' },
];

// ─────────────────────────────────────────────────────────────────────────────
// STORY EXPORT
// ─────────────────────────────────────────────────────────────────────────────

export const Overview = () => (
  <StoryFrame>

    {/* ── Page header ──────────────────────────────────────────────────────── */}
    <div style={{ marginBottom: '48px' }}>
      <h1 style={{
        fontFamily: 'Outfit, sans-serif', fontSize: '1.75rem', fontWeight: 700,
        lineHeight: '2.25rem', letterSpacing: '-0.02em',
        color: 'var(--color-text-primary)', margin: '0 0 8px 0',
      }}>
        Badge
      </h1>
      <p style={{
        fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 400,
        lineHeight: '1.75rem', color: 'var(--color-text-secondary)', margin: 0,
      }}>
        A non-interactive status pill — soft-tinted fill, not a solid grey chip. 5 tones · 1 size ·
        rest-only, no hover/focus/dismiss. The label is always present and is the accessible name;
        colour reinforces status, it never carries it alone.
      </p>
    </div>

    {/* ── 1. Tones ──────────────────────────────────────────────────────────── */}
    <SectionHead
      title="Tones"
      description="All 5 tones, each as an icon badge and as a dot badge, with realistic Quicklo labels."
    />

    <div style={{ marginBottom: '16px' }}>
      <BlockLabel>Icon badges</BlockLabel>
      <InfoBox style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
        {TONE_DEMOS.map((d) => (
          <Badge key={`icon-${d.label}`} tone={d.tone} icon={d.icon}>{d.label}</Badge>
        ))}
      </InfoBox>
    </div>

    <div style={{ marginBottom: '40px' }}>
      <BlockLabel>Dot badges</BlockLabel>
      <InfoBox style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
        {TONE_DEMOS.map((d) => (
          <Badge key={`dot-${d.label}`} tone={d.tone}>{d.label}</Badge>
        ))}
      </InfoBox>
      <Note>
        Icon takes precedence over dot when both would apply — a badge never shows both at once.
        Fill and border are soft tints derived from each tone's status colour via <Code>color-mix</Code>,
        not a flat grey chip.
      </Note>
    </div>

    <Divider />

    {/* ── 2. Pulse ──────────────────────────────────────────────────────────── */}
    <SectionHead
      title="Pulse"
      description="Optional scale+opacity breathe on the dot, for a status that needs attention right now."
    />

    <div style={{ marginBottom: '40px' }}>
      <InfoBox style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        <Badge tone="error" pulse>Needs attention</Badge>
        <Badge tone="error">Needs attention</Badge>
      </InfoBox>
      <Note>
        Left: pulsing. Right: static, for comparison. Toggle "Reduce motion" in your OS accessibility
        settings and reload this canvas to confirm the pulse stops — that's handled globally in
        globals.css, not per component. Pulse is ignored if an icon is used, if <Code>dot={false}</Code>,
        or on the info tone (no <Code>--color-pulse-info</Code> token exists).
      </Note>
    </div>

    <Divider />

    {/* ── 3. In context ─────────────────────────────────────────────────────── */}
    <SectionHead
      title="In context"
      description="Layout simulations — the row is scaffold, but every Badge inside it is the real component."
    />

    <div style={{ marginBottom: '40px' }}>
      <BlockLabel>Leads inbox — LeadRow</BlockLabel>
      <InfoBox style={{ padding: '8px 24px' }}>
        {LEAD_ROWS.map((row, i) => (
          <div key={row.name} style={{ borderTop: i > 0 ? '1px solid var(--color-border-subtle)' : 'none' }}>
            <LeadRow initials={row.initials} name={row.name} preview={row.preview} time={row.time}>
              <Badge tone={row.tone} icon={row.icon}>{row.label}</Badge>
            </LeadRow>
          </div>
        ))}
      </InfoBox>
    </div>

    <div style={{ marginBottom: '40px' }}>
      <BlockLabel>Connections — ConnectionCard</BlockLabel>
      <InfoBox style={{ padding: '8px 24px' }}>
        {CONNECTION_ROWS.map((row, i) => (
          <div
            key={row.name}
            className="flex items-center justify-between"
            style={{ padding: 'var(--space-3) 0', borderTop: i > 0 ? '1px solid var(--color-border-subtle)' : 'none' }}
          >
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 500, lineHeight: '1.25rem', color: 'var(--color-text-primary)' }}>
              {row.name}
            </span>
            <Badge tone={row.tone}>{row.label}</Badge>
          </div>
        ))}
      </InfoBox>
    </div>

    <Divider />

    {/* ── 4. Chip ───────────────────────────────────────────────────────────── */}
    <SectionHead
      title="Chip"
      description="A compact, non-interactive sibling of Badge (2026-07-08) — same soft-tint status language, sized for tight/inline/nested contexts where a full 30px-min-height Badge reads too large. Stored in this same folder, shown here rather than a separate sidebar page."
    />

    <div style={{ marginBottom: '16px' }}>
      <BlockLabel>Status chips — 5 tones, icon and dot forms</BlockLabel>
      <InfoBox style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
        {CHIP_STATUS_DEMOS.map((d) => (
          <Chip key={`chip-icon-${d.label}`} tone={d.tone} icon={d.icon}>{d.label}</Chip>
        ))}
      </InfoBox>
      <InfoBox style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', marginTop: '12px' }}>
        {CHIP_STATUS_DEMOS.map((d) => (
          <Chip key={`chip-dot-${d.label}`} tone={d.tone}>{d.label}</Chip>
        ))}
      </InfoBox>
    </div>

    <div style={{ marginBottom: '16px' }}>
      <BlockLabel>Count chips — neutral and brand</BlockLabel>
      <InfoBox style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Chip variant="count" tone="neutral" srLabel="3 leads need attention">3</Chip>
          <Note>neutral</Note>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Chip variant="count" tone="brand" srLabel="12 unread notifications">12</Chip>
          <Note>brand</Note>
        </div>
      </InfoBox>
      <Note>
        A bare number is ambiguous to screen reader users — <Code>srLabel</Code> (or a direct{' '}
        <Code>aria-label</Code>) supplies the context. Chip dev-warns in development if a count chip has neither.
      </Note>
    </div>

    <div style={{ marginBottom: '40px' }}>
      <BlockLabel>Label chips — no status meaning</BlockLabel>
      <InfoBox style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
        <Chip variant="label">Web</Chip>
        <Chip variant="label">Phone</Chip>
        <Chip variant="label">Beta</Chip>
      </InfoBox>
    </div>

    <div style={{ marginBottom: '40px' }}>
      <BlockLabel>Badge vs Chip — size comparison</BlockLabel>
      <InfoBox style={{ display: 'flex', gap: '32px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
          <Badge tone="success" icon="Check">Booked</Badge>
          <Note>Badge — min-height 30px, standalone row status</Note>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
          <Chip tone="success" icon="Check">Booked</Chip>
          <Note>Chip — min-height 20px, compact inline</Note>
        </div>
      </InfoBox>
    </div>

    <div style={{ marginBottom: '16px' }}>
      <BlockLabel>In context — Tabs trailing slot</BlockLabel>
      <InfoBox>
        <Tabs defaultValue="webhook" variant="line">
          <Tabs.List aria-label="Connections">
            <Tabs.Trigger value="webhook" chip={<Chip tone="error" dot>Failed</Chip>}>Webhook</Tabs.Trigger>
            <Tabs.Trigger value="email">Email forwarding</Tabs.Trigger>
          </Tabs.List>
        </Tabs>
        <Note>The exact case that motivated Chip — a Badge here previously read oversized next to the tab label.</Note>
      </InfoBox>
    </div>

    <div style={{ marginBottom: '40px' }}>
      <BlockLabel>In context — table cell</BlockLabel>
      <InfoBox style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--color-bg-secondary)' }}>
              {['LEAD', 'SOURCE', 'STATUS'].map((h) => (
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
            {TABLE_ROWS.map((row, i) => (
              <tr key={row.lead} style={{ background: i % 2 === 0 ? 'var(--color-bg-surface)' : 'var(--color-bg-primary)' }}>
                <td style={{
                  padding: '12px 16px', fontFamily: 'Inter, sans-serif', fontSize: '0.875rem',
                  color: 'var(--color-text-primary)',
                  borderBottom: i < TABLE_ROWS.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                }}>
                  {row.lead}
                </td>
                <td style={{
                  padding: '12px 16px',
                  borderBottom: i < TABLE_ROWS.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                }}>
                  <Chip variant="label">{row.source}</Chip>
                </td>
                <td style={{
                  padding: '12px 16px',
                  borderBottom: i < TABLE_ROWS.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                }}>
                  <Chip tone={row.tone}>{row.label}</Chip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </InfoBox>
    </div>

    <div style={{ marginBottom: '40px' }}>
      <BlockLabel>Badge vs Chip vs FilterPill</BlockLabel>
      <InfoBox>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          <strong style={{ color: 'var(--color-text-primary)' }}>Badge</strong> — standalone row status (LeadRow,
          ConnectionCard). <strong style={{ color: 'var(--color-text-primary)' }}>Chip</strong> — the same soft-tint
          language, compact and inline/nested (a Tabs trailing slot, a table cell, dense metadata, counts) — never
          interactive. <strong style={{ color: 'var(--color-text-primary)' }}>FilterPill</strong> (Patterns phase,
          not yet built) — interactive, dismissible, multi-select filtering. If it can be tapped to toggle or
          removed, it's a FilterPill, not a Chip.
        </p>
      </InfoBox>
    </div>

    <Divider />

    {/* ── 5. Usage guide ───────────────────────────────────────────────────── */}
    <SectionHead
      title="Usage guide"
      description="What Badge is for, and where its boundaries are."
    />

    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '16px',
      marginBottom: '40px',
    }}>
      <InfoBox>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
          Status, not an action
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          Badge is read-only. It has no hover, focus, active, loading, or dismiss states — there is nothing to interact with.
        </p>
      </InfoBox>

      <InfoBox>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
          Colour is never the only signal
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          The dot/icon is decorative and aria-hidden; the text label is the accessible name and always states the status in words (WCAG 1.4.1).
        </p>
      </InfoBox>

      <InfoBox>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
          1–2 words, sentence case
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          "Awaiting", not "Awaiting owner reply since Tuesday afternoon". The label never truncates — keep it short by design.
        </p>
      </InfoBox>

      <InfoBox>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
          Not a tag — use FilterPill
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          A removable/selectable filter chip is a different component with a different interaction model. Badge never dismisses or selects.
        </p>
      </InfoBox>

      <InfoBox>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
          Not a count
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          An unread/quantity number is a different semantic that changes over time — deferred to NavItem/NotificationItem in Patterns, not built here.
        </p>
      </InfoBox>

      <InfoBox>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
          No interaction states
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          Rest-only by definition — no hover, focus, active, loading, or disabled/dismiss states exist on this component.
        </p>
      </InfoBox>

      <InfoBox>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
          44×44 belongs to the row, not the badge
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          Badge sets pointer-events: none so it can never intercept a parent row's own tap target. If the row is tappable, the row owns the 44×44px minimum.
        </p>
      </InfoBox>
    </div>

    <Divider />

    {/* ── 6. Reference ─────────────────────────────────────────────────────── */}
    <SectionHead
      title="Reference table"
      description="All props accepted by Badge, and the design tokens it consumes."
    />

    <div style={{ marginBottom: '16px' }}>
      <BlockLabel>Props</BlockLabel>
      <div style={{
        background: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border-default)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--color-bg-secondary)' }}>
              {['PROP', 'TYPE', 'DEFAULT', 'DESCRIPTION'].map(h => (
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
      <BlockLabel>Design tokens</BlockLabel>
      <div style={{
        background: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border-default)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--color-bg-secondary)' }}>
              {['TOKEN', 'VALUE', 'USAGE'].map(h => (
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
              <tr key={row.token} style={{ background: i % 2 === 0 ? 'var(--color-bg-surface)' : 'var(--color-bg-primary)' }}>
                <td style={{
                  padding: '12px 16px', minHeight: '44px',
                  fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem',
                  color: 'var(--color-text-primary)', whiteSpace: 'nowrap',
                  borderBottom: i < TOKENS.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                }}>
                  {row.token}
                </td>
                <td style={{
                  padding: '12px 16px',
                  fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem',
                  color: 'var(--color-text-secondary)', whiteSpace: 'nowrap',
                  borderBottom: i < TOKENS.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                }}>
                  {row.value}
                </td>
                <td style={{
                  padding: '12px 16px',
                  fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
                  color: 'var(--color-text-primary)',
                  borderBottom: i < TOKENS.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                }}>
                  {row.usage}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

  </StoryFrame>
);
