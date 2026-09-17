import React from 'react';
import { useState } from 'react';
import { Tabs } from './Tabs.jsx';
import { Chip } from '@/components/ui/Badge/Chip.jsx';

// ─────────────────────────────────────────────────────────────────────────────
// META
// ─────────────────────────────────────────────────────────────────────────────

export default {
  title: 'Components/Tabs',
  parameters: {
    layout: 'fullscreen',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS — StoryFrame copied from Avatar.stories.js / Alert.stories.js
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

function PanelBody({ children }) {
  return (
    <p style={{
      fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
      color: 'var(--color-text-secondary)', margin: 'var(--space-4) 0 0 0',
    }}>
      {children}
    </p>
  );
}

const code = { fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' };

// ─────────────────────────────────────────────────────────────────────────────
// REFERENCE DATA
// ─────────────────────────────────────────────────────────────────────────────

const TABS_PROPS = [
  { name: 'variant', type: "'line' | 'segmented'", defaultVal: "'line'", description: 'line: in-content section switch. segmented: mutually-exclusive view/filter switch.' },
  { name: 'size', type: "'md' | 'lg'", defaultVal: "'md'", description: 'No sm. segmented on any touch context must use lg — md is a desktop/pointer-dense-only density.' },
  { name: 'value', type: 'string', defaultVal: 'undefined', description: 'Controlled active tab value.' },
  { name: 'defaultValue', type: 'string', defaultVal: 'undefined', description: 'Uncontrolled initial active tab value.' },
  { name: 'onValueChange', type: '(value: string) => void', defaultVal: 'undefined', description: 'Fires on every tab change, controlled or uncontrolled.' },
  { name: 'fitted', type: 'bool', defaultVal: 'true', description: 'segmented only: equal-width segments, auto-degrading to content-width on overflow. line is always content-width.' },
  { name: 'activationMode', type: "'automatic' | 'manual'", defaultVal: "'automatic'", description: 'automatic: arrow-key focus switches the panel immediately. Pass manual for a genuinely expensive panel.' },
];

const TRIGGER_PROPS = [
  { name: 'value', type: 'string', defaultVal: '—', description: 'Required. Matches the corresponding Tabs.Panel value.' },
  { name: 'icon', type: 'string', defaultVal: 'undefined', description: 'Leading icon name (16px, aria-hidden). All-or-nothing across one tab set — never mix icon and text-only triggers.' },
  { name: 'hideLabel', type: 'bool', defaultVal: 'false', description: 'segmented only: visually hides the label (sr-only) so only the icon shows — the compact icon-only view-switcher mode. Requires aria-label.' },
  { name: 'chip', type: 'ReactNode', defaultVal: 'undefined', description: 'Trailing slot — pass an already-built <Chip>. Composition, not a Tabs state. Renamed from badge — a full Badge read oversized at a tab\'s scale.' },
  { name: 'disabled', type: 'bool', defaultVal: 'false', description: 'Skipped by arrow-key nav, removed from the tab order (Radix roving tabindex). Real case: a plan-gated tab.' },
];

const TOKENS = [
  { token: '--color-text-primary', value: '#121212 / #fbfbfb', usage: 'segmented: selected label + unselected label (light mode fallback — see Note below). line: hover + active label colour.' },
  { token: '--color-text-secondary', value: '#707070 / #adadad', usage: 'line: default (inactive) label colour. segmented: unselected label, DARK MODE ONLY (light mode falls back to --color-text-primary — measured contrast below).' },
  { token: '--color-border-default', value: '#dddddd / #2a2a2a', usage: "line variant's Tabs.List bottom border" },
  { token: '--color-interactive-default', value: '#c2410c / #fb923c', usage: 'line variant active-tab 2px indicator' },
  { token: '--color-bg-secondary', value: '#dddddd / #171717', usage: 'segmented track fill (recessed)' },
  { token: '--color-bg-surface', value: '#ffffff / #1e1e1e', usage: 'segmented selected-segment (raised pill) fill — 2026-07-08 redesign, supersedes --color-brand-tint' },
  { token: '--elevation-1', value: 'shadow-sm / dark hairline', usage: 'segmented selected-segment (raised pill) shadow — dark mode\'s built-in hairline border gives the raised edge' },
  { token: '--color-focus-ring', value: '#c2410c / #fb923c', usage: "focus-visible — not redeclared in Tabs.jsx, inherited from globals.css's global *:focus-visible rule" },
  { token: '--opacity-disabled', value: '0.4', usage: 'Disabled trigger, both variants' },
  { token: '--space-1', value: '4px', usage: 'segmented track inner padding + sliding-pill inset' },
  { token: '--space-2', value: '8px', usage: 'Icon-to-label gap' },
  { token: '--space-3', value: '12px', usage: 'line vertical padding' },
  { token: '--space-4', value: '16px', usage: 'Horizontal padding, both variants' },
  { token: '--radius-md', value: '12px', usage: 'segmented track corner radius (2026-07-08: was --radius-sm)' },
  { token: '--radius-sm', value: '8px', usage: 'segmented selected-segment corner radius, nests inside --radius-md (2026-07-08: was --radius-xs)' },
  { token: '--duration-base', value: '200ms', usage: 'Label colour transitions + the fitted-mode sliding-pill transform, paired with --ease-default' },
];

const SEGMENTED_CONTRAST_NOTE =
  'Measured (Node WCAG relative-luminance script): unselected label --color-text-secondary on --color-bg-secondary is 3.64:1 in light mode — below AA 4.5:1 for text — but 7.99:1 in dark mode. Light mode falls back to --color-text-primary (13.79:1); dark mode keeps --color-text-secondary. The raised pill + font-weight (400 vs 500) still carry the selected/unselected distinction even where both read the same colour in light mode.';

function ReferenceTable({ columns, rows, rowKey }) {
  return (
    <div style={{
      background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-default)',
      borderRadius: 'var(--radius-md)', overflow: 'hidden',
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'var(--color-bg-secondary)' }}>
            {columns.map((h) => (
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
          {rows.map((row, i) => (
            <tr key={row[rowKey]} style={{ background: i % 2 === 0 ? 'var(--color-bg-surface)' : 'var(--color-bg-primary)' }}>
              {Object.keys(row).map((key, ci) => (
                <td key={key} style={{
                  padding: '12px 16px',
                  fontFamily: ci === columns.length - 1 ? 'Inter, sans-serif' : 'ui-monospace, monospace',
                  fontSize: '0.875rem', lineHeight: ci === columns.length - 1 ? '1.5rem' : undefined,
                  color: ci === 0 ? 'var(--color-text-primary)' : ci === columns.length - 1 ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                  whiteSpace: ci === columns.length - 1 ? undefined : 'nowrap',
                  borderBottom: i < rows.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                }}>
                  {row[key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STORY EXPORT — single Overview export, per the style guide
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
        Tabs
      </h1>
      <p style={{
        fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 400,
        lineHeight: '1.75rem', color: 'var(--color-text-secondary)', margin: 0,
      }}>
        A compound component (Tabs / Tabs.List / Tabs.Trigger / Tabs.Panel) built on radix-ui's Tabs primitive.
        Two variants only — line (in-content section switch) and segmented (mutually-exclusive view/filter switch).
      </p>
    </div>

    {/* ── 1. Variants ───────────────────────────────────────────────────────── */}
    <SectionHead
      title="Variants"
      description="line (default) — an in-content section switch, left-aligned, unchanged in this pass. segmented — a mutually-exclusive view/filter switch, redesigned 2026-07-08 to a neutral raised pill (bg-surface + elevation-1 on a recessed track) rather than a brand-tint fill."
    />
    <div style={{ marginBottom: '40px', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <BlockLabel>line</BlockLabel>
        <Tabs defaultValue="conversation" variant="line">
          <Tabs.List aria-label="Lead detail sections">
            <Tabs.Trigger value="conversation">Conversation</Tabs.Trigger>
            <Tabs.Trigger value="details">Details</Tabs.Trigger>
            <Tabs.Trigger value="notes">Notes</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Panel value="conversation">
            <PanelBody>Original enquiry, AI reply sent, customer replies, and owner replies, in order.</PanelBody>
          </Tabs.Panel>
          <Tabs.Panel value="details">
            <PanelBody>Original form submission, delivery status, and timestamps for every message.</PanelBody>
          </Tabs.Panel>
          <Tabs.Panel value="notes">
            <PanelBody>Private notes the owner has added to this lead. Never shown to the customer.</PanelBody>
          </Tabs.Panel>
        </Tabs>
      </div>
      <div>
        <BlockLabel>segmented — raised pill (2026-07-08 redesign)</BlockLabel>
        <div style={{ maxWidth: '400px' }}>
          <Tabs defaultValue="new" variant="segmented" size="lg">
            <Tabs.List aria-label="Lead status filter">
              <Tabs.Trigger value="all">All</Tabs.Trigger>
              <Tabs.Trigger value="new">New</Tabs.Trigger>
              <Tabs.Trigger value="replied">Replied</Tabs.Trigger>
              <Tabs.Trigger value="booked">Booked</Tabs.Trigger>
            </Tabs.List>
          </Tabs>
        </div>
        <Note>
          The selected segment now slides — click any option and watch the raised pill animate to it
          (index math over equal-width segments, no measurement). {SEGMENTED_CONTRAST_NOTE}
        </Note>
      </div>
    </div>

    <Divider />

    {/* ── 2. Sizes ──────────────────────────────────────────────────────────── */}
    <SectionHead
      title="Sizes"
      description="md and lg only — no sm. segmented md is a desktop/pointer-dense-only density; lg is the mobile/touch default."
    />
    <div style={{ marginBottom: '40px', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <BlockLabel>line — md (44px row)</BlockLabel>
        <Tabs defaultValue="a" variant="line" size="md">
          <Tabs.List aria-label="Example">
            <Tabs.Trigger value="a">Conversation</Tabs.Trigger>
            <Tabs.Trigger value="b">Details</Tabs.Trigger>
            <Tabs.Trigger value="c">Notes</Tabs.Trigger>
          </Tabs.List>
        </Tabs>
      </div>
      <div>
        <BlockLabel>line — lg (48px row)</BlockLabel>
        <Tabs defaultValue="a" variant="line" size="lg">
          <Tabs.List aria-label="Example">
            <Tabs.Trigger value="a">Conversation</Tabs.Trigger>
            <Tabs.Trigger value="b">Details</Tabs.Trigger>
            <Tabs.Trigger value="c">Notes</Tabs.Trigger>
          </Tabs.List>
        </Tabs>
      </div>
      <div>
        <BlockLabel>segmented — md (40px track, desktop only)</BlockLabel>
        <div style={{ maxWidth: '360px' }}>
          <Tabs defaultValue="a" variant="segmented" size="md">
            <Tabs.List aria-label="Example">
              <Tabs.Trigger value="a">7 days</Tabs.Trigger>
              <Tabs.Trigger value="b">30 days</Tabs.Trigger>
              <Tabs.Trigger value="c">90 days</Tabs.Trigger>
            </Tabs.List>
          </Tabs>
        </div>
      </div>
      <div>
        <BlockLabel>segmented — lg (48px track, mobile default)</BlockLabel>
        <div style={{ maxWidth: '360px' }}>
          <Tabs defaultValue="a" variant="segmented" size="lg">
            <Tabs.List aria-label="Example">
              <Tabs.Trigger value="a">7 days</Tabs.Trigger>
              <Tabs.Trigger value="b">30 days</Tabs.Trigger>
              <Tabs.Trigger value="c">90 days</Tabs.Trigger>
            </Tabs.List>
          </Tabs>
        </div>
      </div>
    </div>

    <Divider />

    {/* ── 3. States ─────────────────────────────────────────────────────────── */}
    <SectionHead
      title="States"
      description="default, active/selected, and disabled are shown live below. Hover and focus-visible are CSS-driven states — hover any trigger, or Tab to it, to see them."
    />
    <div style={{ marginBottom: '40px', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <BlockLabel>line — with a disabled, plan-gated tab</BlockLabel>
        <Tabs defaultValue="inbox" variant="line">
          <Tabs.List aria-label="Dashboard sections">
            <Tabs.Trigger value="inbox">Inbox</Tabs.Trigger>
            <Tabs.Trigger value="connections">Connections</Tabs.Trigger>
            <Tabs.Trigger value="analytics" disabled>Analytics</Tabs.Trigger>
          </Tabs.List>
        </Tabs>
        <Note>"Analytics" is disabled — a real Free/Starter-plan case, since Analytics is Pro+ only.</Note>
      </div>
      <div>
        <BlockLabel>segmented — with a disabled segment</BlockLabel>
        <div style={{ maxWidth: '420px' }}>
          <Tabs defaultValue="new" variant="segmented" size="lg">
            <Tabs.List aria-label="Example">
              <Tabs.Trigger value="all">All</Tabs.Trigger>
              <Tabs.Trigger value="new">New</Tabs.Trigger>
              <Tabs.Trigger value="cold" disabled>Cold</Tabs.Trigger>
            </Tabs.List>
          </Tabs>
        </div>
      </div>
    </div>

    <Divider />

    {/* ── 4. Overflow ───────────────────────────────────────────────────────── */}
    <SectionHead
      title="Overflow"
      description="Tabs.List never wraps — it scrolls horizontally, with a hidden scrollbar and an edge fade. The active trigger scrolls into view on mount and on every change."
    />
    <div style={{ marginBottom: '40px' }}>
      <InfoBox style={{ maxWidth: '280px' }}>
        <Tabs defaultValue="cold" variant="segmented" size="lg" fitted={false}>
          <Tabs.List aria-label="Lead status filter, overflowing">
            <Tabs.Trigger value="all">All</Tabs.Trigger>
            <Tabs.Trigger value="new">New</Tabs.Trigger>
            <Tabs.Trigger value="replied">Replied</Tabs.Trigger>
            <Tabs.Trigger value="booked">Booked</Tabs.Trigger>
            <Tabs.Trigger value="closed">Closed</Tabs.Trigger>
            <Tabs.Trigger value="cold">Cold</Tabs.Trigger>
          </Tabs.List>
        </Tabs>
      </InfoBox>
      <Note>
        This instance mounts with <code style={code}>defaultValue="cold"</code> — the LAST segment — inside a
        280px container. On load, the track is already scrolled so "Cold" is visible, proving the
        scroll-into-view-on-mount behaviour; click "All" to see it scroll back the other way. It also sets{' '}
        <code style={code}>fitted={'{false}'}</code> deliberately — this is a genuinely content-width/scrollable
        set, not an equal-width one that happens to overflow, so it skips the shared sliding-pill layer (which
        needs equal-width segments for its index math) and gives the selected segment its own direct
        surface+elevation background instead.
      </Note>
    </div>

    <Divider />

    {/* ── 5. With icons ─────────────────────────────────────────────────────── */}
    <SectionHead
      title="With icons"
      description="An optional leading icon per Trigger, 16px, aria-hidden — all-or-nothing across one tab set. segmented also supports an icon-only mode for compact view-switchers via hideLabel."
    />
    <div style={{ marginBottom: '40px', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <BlockLabel>line — icon + label</BlockLabel>
        <Tabs defaultValue="profile" variant="line">
          <Tabs.List aria-label="Settings sections">
            <Tabs.Trigger value="profile" icon="User">Profile</Tabs.Trigger>
            <Tabs.Trigger value="billing" icon="CreditCard">Billing</Tabs.Trigger>
            <Tabs.Trigger value="notifications" icon="Bell">Notifications</Tabs.Trigger>
          </Tabs.List>
        </Tabs>
      </div>
      <div>
        <BlockLabel>segmented — icon-only view-switcher</BlockLabel>
        <div style={{ maxWidth: '160px' }}>
          <Tabs defaultValue="grid" variant="segmented" size="lg">
            <Tabs.List aria-label="Leads view">
              <Tabs.Trigger value="grid" icon="LayoutDashboard" hideLabel aria-label="Grid view">Grid</Tabs.Trigger>
              <Tabs.Trigger value="list" icon="Inbox" hideLabel aria-label="List view">List</Tabs.Trigger>
              <Tabs.Trigger value="columns" icon="BarChart2" hideLabel aria-label="Columns view">Columns</Tabs.Trigger>
            </Tabs.List>
          </Tabs>
        </div>
        <Note>
          Each trigger still renders a real (sr-only) label — <code style={code}>hideLabel</code> visually hides
          it, it doesn't remove it — so <code style={code}>aria-label</code> is required and dev-warned if absent.
        </Note>
      </div>
    </div>

    <Divider />

    {/* ── 6. With Chip slot ─────────────────────────────────────────────────── */}
    <SectionHead
      title="With Chip slot"
      description="An optional trailing chip slot composes the new compact Chip component — not a Tabs state. Renamed from Badge (2026-07-08): a full-size Badge read oversized at a tab's scale; Chip reads correctly here."
    />
    <div style={{ marginBottom: '40px' }}>
      <Tabs defaultValue="webhook" variant="line">
        <Tabs.List aria-label="Connections">
          <Tabs.Trigger value="webhook" chip={<Chip tone="error" dot>Failed</Chip>}>
            Webhook
          </Tabs.Trigger>
          <Tabs.Trigger value="email">Email forwarding</Tabs.Trigger>
          <Tabs.Trigger value="phone">Phone number</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Panel value="webhook">
          <PanelBody>URL, status, leads received count, "Test webhook" button, setup guide link.</PanelBody>
        </Tabs.Panel>
        <Tabs.Panel value="email">
          <PanelBody>Forwarding address, status, leads parsed, "Send test email" button.</PanelBody>
        </Tabs.Panel>
        <Tabs.Panel value="phone">
          <PanelBody>Twilio number, status, missed calls handled, "Test call" button.</PanelBody>
        </Tabs.Panel>
      </Tabs>
    </div>

    <Divider />

    {/* ── 7. In context ─────────────────────────────────────────────────────── */}
    <SectionHead
      title="In context"
      description="Three real Quicklo mounts."
    />
    <div style={{ marginBottom: '40px', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <BlockLabel>Leads inbox — status filter (segmented, lg)</BlockLabel>
        <div style={{ maxWidth: '480px' }}>
          <Tabs defaultValue="all" variant="segmented" size="lg">
            <Tabs.List aria-label="Filter leads by status">
              <Tabs.Trigger value="all">All</Tabs.Trigger>
              <Tabs.Trigger value="new">New</Tabs.Trigger>
              <Tabs.Trigger value="replied">Replied</Tabs.Trigger>
              <Tabs.Trigger value="booked">Booked</Tabs.Trigger>
              <Tabs.Trigger value="closed">Closed</Tabs.Trigger>
              <Tabs.Trigger value="cold">Cold</Tabs.Trigger>
            </Tabs.List>
          </Tabs>
        </div>
      </div>
      <div>
        <BlockLabel>Lead detail — section switch (line)</BlockLabel>
        <InfoBox>
          <Tabs defaultValue="conversation" variant="line">
            <Tabs.List aria-label="Lead detail sections">
              <Tabs.Trigger value="conversation">Conversation</Tabs.Trigger>
              <Tabs.Trigger value="details">Details</Tabs.Trigger>
              <Tabs.Trigger value="notes">Notes</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Panel value="conversation">
              <PanelBody>
                <strong style={{ color: 'var(--color-text-primary)' }}>Jordan Lee</strong> — "Hi, do you handle
                emergency plumbing repairs on weekends?" Sent Sat 9:14am.
              </PanelBody>
            </Tabs.Panel>
            <Tabs.Panel value="details">
              <PanelBody>Submitted via contact form. Delivered: SMS ✓, Email ✓. Response time: 47 seconds.</PanelBody>
            </Tabs.Panel>
            <Tabs.Panel value="notes">
              <PanelBody>No notes yet.</PanelBody>
            </Tabs.Panel>
          </Tabs>
        </InfoBox>
      </div>
      <div>
        <BlockLabel>Analytics — time range (segmented, md — desktop density)</BlockLabel>
        <div style={{ maxWidth: '360px' }}>
          <Tabs defaultValue="30" variant="segmented" size="md">
            <Tabs.List aria-label="Analytics time range">
              <Tabs.Trigger value="7">7 days</Tabs.Trigger>
              <Tabs.Trigger value="30">30 days</Tabs.Trigger>
              <Tabs.Trigger value="90">90 days</Tabs.Trigger>
            </Tabs.List>
          </Tabs>
        </div>
        <Note>
          Shown at <code style={code}>size="md"</code> deliberately — Analytics is a Pro+/Business, typically
          desktop-viewed dashboard section. On any touch context this same filter must switch to{' '}
          <code style={code}>size="lg"</code>.
        </Note>
      </div>
    </div>

    <Divider />

    {/* ── 8. Usage guide ────────────────────────────────────────────────────── */}
    <SectionHead
      title="Usage guide"
      description="line vs segmented vs FilterPill — three different jobs."
    />
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '16px',
      marginBottom: '24px',
    }}>
      <InfoBox>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
          line
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          An in-content section switch between distinct content areas the user reads one at a time — Lead detail,
          Connections. Never for filtering a list.
        </p>
      </InfoBox>
      <InfoBox>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
          segmented
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          A mutually-exclusive, single-select view or filter switch over a small fixed option set — the Leads
          status filter, an Analytics time range. The user is in exactly one state at a time.
        </p>
      </InfoBox>
      <InfoBox>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
          FilterPill instead of Tabs
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          Reach for <code style={code}>FilterPill</code> (Patterns phase, not yet built) whenever more than one
          option can be true at once — Leads source (web/phone) or group (A/B). A lead can match more than one, so
          multi-select, dismissible chips are correct; forcing that into single-select Tabs would be a real
          behaviour regression, not just a visual one.
        </p>
      </InfoBox>
    </div>

    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '16px',
      marginBottom: '40px',
    }}>
      <InfoBox style={{ borderColor: 'var(--color-status-error-text)' }}>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-status-error-text)', marginBottom: '16px' }}>
          Don't — segmented for content sections
        </div>
        <div style={{ maxWidth: '320px' }}>
          <Tabs defaultValue="conversation" variant="segmented" size="lg">
            <Tabs.List aria-label="Example">
              <Tabs.Trigger value="conversation">Conversation</Tabs.Trigger>
              <Tabs.Trigger value="details">Details</Tabs.Trigger>
              <Tabs.Trigger value="notes">Notes</Tabs.Trigger>
            </Tabs.List>
          </Tabs>
        </div>
        <Note>The raised-pill shape reads as "pick a view/filter," not "read this section" — the wrong signal for content the user is meant to read in full.</Note>
      </InfoBox>

      <InfoBox style={{ borderColor: 'var(--color-status-success-text)' }}>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-status-success-text)', marginBottom: '16px' }}>
          Do — line for content sections
        </div>
        <Tabs defaultValue="conversation" variant="line">
          <Tabs.List aria-label="Example">
            <Tabs.Trigger value="conversation">Conversation</Tabs.Trigger>
            <Tabs.Trigger value="details">Details</Tabs.Trigger>
            <Tabs.Trigger value="notes">Notes</Tabs.Trigger>
          </Tabs.List>
        </Tabs>
        <Note>The underline shape reads as "you're viewing one section of several" — the correct signal.</Note>
      </InfoBox>

      <InfoBox style={{ borderColor: 'var(--color-status-error-text)' }}>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-status-error-text)', marginBottom: '16px' }}>
          Don't — Tabs for a multi-select filter
        </div>
        <div style={{ maxWidth: '280px' }}>
          <Tabs defaultValue="web" variant="segmented" size="lg">
            <Tabs.List aria-label="Example">
              <Tabs.Trigger value="web">Web</Tabs.Trigger>
              <Tabs.Trigger value="phone">Phone</Tabs.Trigger>
            </Tabs.List>
          </Tabs>
        </div>
        <Note>Tabs enforce single-select. An owner who wants "web AND phone leads" simply can't express that here.</Note>
      </InfoBox>

      <InfoBox style={{ borderColor: 'var(--color-status-success-text)' }}>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-status-success-text)', marginBottom: '16px' }}>
          Do — FilterPill for multi-select
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          Not yet built (Patterns phase) — independently toggleable chips, so "Web" and "Phone" can both be active,
          each dismissible on its own.
        </p>
      </InfoBox>
    </div>

    <Divider />

    {/* ── 9. Reference table ────────────────────────────────────────────────── */}
    <SectionHead
      title="Reference table"
      description="Tabs props, Tabs.Trigger props, and every token this component consumes."
    />

    <div style={{ marginBottom: '32px' }}>
      <BlockLabel>Tabs props</BlockLabel>
      <ReferenceTable columns={['PROP', 'TYPE', 'DEFAULT', 'DESCRIPTION']} rows={TABS_PROPS} rowKey="name" />
    </div>

    <div style={{ marginBottom: '32px' }}>
      <BlockLabel>Tabs.Trigger props</BlockLabel>
      <ReferenceTable columns={['PROP', 'TYPE', 'DEFAULT', 'DESCRIPTION']} rows={TRIGGER_PROPS} rowKey="name" />
    </div>

    <div style={{ marginBottom: '40px' }}>
      <BlockLabel>Tokens</BlockLabel>
      <ReferenceTable columns={['TOKEN', 'VALUE (LIGHT / DARK)', 'USAGE']} rows={TOKENS} rowKey="token" />
    </div>

  </StoryFrame>
);
