import React, { useState } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// META
// ─────────────────────────────────────────────────────────────────────────────

export default {
  title: 'Foundations/Breakpoints',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Six-token mobile-first breakpoint system. All values are min-width thresholds defined in the Tailwind v4 @theme block. xs (375px) is a CSS floor constraint only — it does not generate a Tailwind responsive prefix.',
      },
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// SHARED HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function StoryFrame({ children }) {
  const [isDark, setIsDark] = useState(false);

  return (
    <div
      className={isDark ? 'dark' : ''}
      style={{
        background: 'var(--color-bg-primary)',
        minHeight: '100vh',
        width: '100%',
        padding: '32px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <button
          onClick={() => setIsDark(false)}
          aria-pressed={!isDark}
          style={{
            height: '32px',
            padding: '0 16px',
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
            height: '32px',
            padding: '0 16px',
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

function Page({ children }) {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', color: 'var(--color-text-primary)' }}>
      {children}
    </div>
  );
}

function PageHeader({ title, subtitle }) {
  return (
    <div style={{ marginBottom: '32px' }}>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.75rem', fontWeight: 700, lineHeight: '2.25rem', letterSpacing: '-0.02em', color: 'var(--color-text-primary)', margin: '0 0 8px 0' }}>
        {title}
      </h1>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 400, lineHeight: '1.75rem', color: 'var(--color-text-secondary)', margin: 0 }}>
        {subtitle}
      </p>
    </div>
  );
}

function SectionHead({ title, subtitle }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.375rem', fontWeight: 600, lineHeight: '1.75rem', letterSpacing: '-0.015em', color: 'var(--color-text-primary)', margin: '0 0 8px 0' }}>
        {title}
      </h2>
      {subtitle && (
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 400, lineHeight: '1.5rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

function NoteBlock({ children }) {
  return (
    <div style={{ borderLeft: '3px solid var(--color-border-strong)', background: 'var(--color-bg-secondary)', borderRadius: '0 var(--radius-sm) var(--radius-sm) 0', padding: '12px 16px', marginTop: '24px' }}>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 400, lineHeight: '1.5rem', color: 'var(--color-text-secondary)', margin: 0 }}>
        {children}
      </p>
    </div>
  );
}

function Mono({ children, highlight }) {
  return (
    <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', color: highlight ? 'var(--color-brand-tint-text)' : 'var(--color-text-primary)' }}>
      {children}
    </code>
  );
}

function SkeletonLine({ width = '100%', height = '10px' }) {
  return (
    <div style={{ width, height, background: 'var(--color-border-default)', borderRadius: 'var(--radius-xs)', marginBottom: '6px' }} />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BREAKPOINT DATA
// ─────────────────────────────────────────────────────────────────────────────

const BREAKPOINTS = [
  {
    token: '--breakpoint-xs',
    value: '375px',
    tailwind: 'none (floor only)',
    layout: 'Mobile floor constraint',
    nav: 'Bottom nav',
    tierBg: 'var(--color-bg-secondary)',
    tierText: 'var(--color-text-secondary)',
    floor: true,
  },
  {
    token: '--breakpoint-sm',
    value: '600px',
    tailwind: 'sm:',
    layout: 'Tablet — nav rail',
    nav: 'Nav rail (icon-only, 64px)',
    tierBg: 'var(--color-brand-tint)',
    tierText: 'var(--color-brand-tint-text)',
    floor: false,
  },
  {
    token: '--breakpoint-md',
    value: '768px',
    tailwind: 'md:',
    layout: 'Tablet — detail panel',
    nav: 'Nav rail + side panels',
    tierBg: 'var(--color-brand-tint)',
    tierText: 'var(--color-brand-tint-text)',
    floor: false,
  },
  {
    token: '--breakpoint-lg',
    value: '1024px',
    tailwind: 'lg:',
    layout: 'Desktop — sidebar',
    nav: 'Full sidebar (240px)',
    tierBg: 'var(--color-interactive-default)',
    tierText: 'var(--color-text-on-interactive)',
    floor: false,
  },
  {
    token: '--breakpoint-xl',
    value: '1280px',
    tailwind: 'xl:',
    layout: 'Desktop — expanded',
    nav: 'Sidebar expanded by default',
    tierBg: 'var(--color-interactive-hover)',
    tierText: 'var(--color-text-on-interactive)',
    floor: false,
  },
  {
    token: '--breakpoint-2xl',
    value: '1536px',
    tailwind: '2xl:',
    layout: 'Wide — content cap',
    nav: 'Max-width container cap',
    tierBg: 'var(--color-interactive-active)',
    tierText: 'var(--color-text-on-interactive)',
    floor: false,
  },
];

const SCALE_SEGMENTS = [
  { label: '0 – 599px', sublabel: 'Mobile', bg: 'var(--color-bg-secondary)', text: 'var(--color-text-secondary)', flex: 6 },
  { label: 'sm 600px', sublabel: 'Nav rail', bg: 'var(--color-brand-tint)', text: 'var(--color-brand-tint-text)', flex: 2 },
  { label: 'md 768px', sublabel: 'Detail panel', bg: 'var(--color-brand-tint)', text: 'var(--color-brand-tint-text)', flex: 3, borderLeft: true },
  { label: 'lg 1024px', sublabel: 'Sidebar', bg: 'var(--color-interactive-default)', text: 'var(--color-text-on-interactive)', flex: 3 },
  { label: 'xl 1280px', sublabel: 'Expanded', bg: 'var(--color-interactive-hover)', text: 'var(--color-text-on-interactive)', flex: 3 },
  { label: '2xl 1536px', sublabel: 'Content cap', bg: 'var(--color-interactive-active)', text: 'var(--color-text-on-interactive)', flex: 2 },
];

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 1 — OVERVIEW
// ─────────────────────────────────────────────────────────────────────────────

function OverviewContent() {
  const TH = {
    padding: '12px 16px',
    textAlign: 'left',
    background: 'var(--color-bg-secondary)',
    borderBottom: '2px solid var(--color-border-default)',
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.875rem',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    color: 'var(--color-text-secondary)',
    whiteSpace: 'nowrap',
  };
  function td(extra) {
    return {
      padding: '12px 16px',
      fontFamily: 'Inter, sans-serif',
      fontSize: '0.875rem',
      borderBottom: '1px solid var(--color-border-subtle)',
      color: 'var(--color-text-primary)',
      ...extra,
    };
  }

  return (
    <Page>
      <PageHeader
        title="Breakpoints"
        subtitle="Mobile-first responsive system. Six breakpoints define how layout, navigation, and components adapt from phone to wide desktop. All breakpoints are min-width thresholds."
      />

      {/* Scale bar */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--color-border-default)' }}>
          {SCALE_SEGMENTS.map((seg, i) => (
            <div
              key={i}
              style={{
                flex: seg.flex,
                background: seg.bg,
                padding: '12px 8px',
                textAlign: 'center',
                borderLeft: i > 0 ? '1px solid var(--color-border-default)' : 'none',
              }}
            >
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 600, color: seg.text, marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {seg.label}
              </div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 400, color: seg.text, opacity: 0.8, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {seg.sublabel}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reference table */}
      <div style={{ marginBottom: '24px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Inter, sans-serif' }}>
          <thead>
            <tr>
              <th style={TH}>Token</th>
              <th style={TH}>Value</th>
              <th style={TH}>Tailwind prefix</th>
              <th style={TH}>Layout state</th>
              <th style={TH}>Navigation</th>
            </tr>
          </thead>
          <tbody>
            {BREAKPOINTS.map((bp, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? 'var(--color-bg-primary)' : 'var(--color-bg-surface)' }}>
                <td style={td()}>
                  <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', color: 'var(--color-brand-tint-text)' }}>
                    {bp.token}
                  </code>
                </td>
                <td style={td({ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem', whiteSpace: 'nowrap' })}>
                  {bp.value}
                </td>
                <td style={td({ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' })}>
                  {bp.floor ? (
                    <span style={{ color: 'var(--color-text-tertiary)' }}>{bp.tailwind}</span>
                  ) : (
                    <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem', background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-default)', borderRadius: 'var(--radius-xs)', padding: '2px 6px' }}>
                      {bp.tailwind}
                    </code>
                  )}
                </td>
                <td style={td()}>{bp.layout}</td>
                <td style={td({ color: 'var(--color-text-secondary)' })}>{bp.nav}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <NoteBlock>
        xs (375px) is a CSS custom property floor constraint — it does not generate a Tailwind responsive prefix. Use it in component CSS for minimum-width constraints on bottom nav labels, input widths, and other elements that break below 375px.
      </NoteBlock>
    </Page>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 2 — NAVIGATION STATES
// ─────────────────────────────────────────────────────────────────────────────

function NavigationStatesContent() {
  // Shared spec label style
  function SpecRow({ children }) {
    return (
      <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-text-secondary)', marginTop: '12px' }}>
        {children}
      </div>
    );
  }
  function SpecNote({ children }) {
    return (
      <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 400, color: 'var(--color-text-tertiary)', marginTop: '4px' }}>
        {children}
      </div>
    );
  }

  const NAV_ITEMS = ['Leads', 'Alerts', 'Stats', 'Settings', 'Profile'];

  return (
    <Page>
      <SectionHead
        title="Navigation states across breakpoints"
        subtitle="Three navigation patterns — one per layout tier. The nav pattern switches at sm (600px) and lg (1024px)."
      />

      <div style={{ display: 'flex', gap: '48px', alignItems: 'flex-start', marginBottom: '32px' }}>

        {/* Card 1 — Mobile */}
        <div>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: '12px' }}>
            0 – 599px · bottom nav
          </div>

          {/* Phone schematic */}
          <div style={{ width: '180px', height: '320px', border: '2px solid var(--color-border-default)', borderRadius: '16px', overflow: 'hidden', background: 'var(--color-bg-primary)', display: 'flex', flexDirection: 'column' }}>
            {/* Top header */}
            <div style={{ background: 'var(--color-bg-secondary)', height: '40px', display: 'flex', alignItems: 'center', padding: '0 12px', flexShrink: 0 }}>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
                Leads
              </div>
            </div>

            {/* Content area */}
            <div style={{ flex: 1, padding: '12px', overflow: 'hidden' }}>
              {[80, 65, 75, 55].map((w, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '9999px', background: 'var(--color-border-default)', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <SkeletonLine width={`${w}%`} height="8px" />
                    <SkeletonLine width="60%" height="6px" />
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom nav */}
            <div style={{ background: 'var(--color-bg-surface)', borderTop: '1px solid var(--color-border-default)', height: '56px', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              {NAV_ITEMS.map((label, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    background: i === 0 ? 'var(--color-brand-tint)' : 'transparent',
                  }}
                >
                  <div style={{ width: '16px', height: '16px', background: i === 0 ? 'var(--color-brand-tint-text)' : 'var(--color-border-default)', borderRadius: '3px', marginBottom: '3px', opacity: i === 0 ? 1 : 0.5 }} />
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.4375rem', color: i === 0 ? 'var(--color-brand-tint-text)' : 'var(--color-text-tertiary)', fontWeight: i === 0 ? 600 : 400 }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <SpecRow>Bottom nav · 5 tabs · 56px height · safe-area inset</SpecRow>
          <SpecNote>Touch targets: 44x44px minimum</SpecNote>
        </div>

        {/* Card 2 — Tablet */}
        <div>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: '12px' }}>
            600 – 1023px · nav rail
          </div>

          {/* Tablet schematic */}
          <div style={{ width: '240px', height: '220px', border: '2px solid var(--color-border-default)', borderRadius: '12px', overflow: 'hidden', background: 'var(--color-bg-primary)', display: 'flex' }}>
            {/* Nav rail */}
            <div style={{ width: '56px', background: 'var(--color-bg-secondary)', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '12px', gap: '16px', flexShrink: 0, borderRight: '1px solid var(--color-border-subtle)' }}>
              {NAV_ITEMS.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-sm)',
                    background: i === 0 ? 'var(--color-brand-tint)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div style={{ width: '16px', height: '16px', background: i === 0 ? 'var(--color-brand-tint-text)' : 'var(--color-border-default)', borderRadius: '3px', opacity: i === 0 ? 1 : 0.5 }} />
                </div>
              ))}
            </div>

            {/* Content */}
            <div style={{ flex: 1, padding: '12px' }}>
              {[75, 60, 80, 50].map((w, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '9999px', background: 'var(--color-border-default)', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <SkeletonLine width={`${w}%`} height="8px" />
                    <SkeletonLine width="50%" height="6px" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <SpecRow>Nav rail · icon-only · 64px wide · 44px touch targets</SpecRow>
          <SpecNote>Bottom nav hidden. Full sidebar not yet visible.</SpecNote>
        </div>

        {/* Card 3 — Desktop */}
        <div>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: '12px' }}>
            1024px+ · full sidebar
          </div>

          {/* Desktop schematic */}
          <div style={{ width: '300px', height: '200px', border: '2px solid var(--color-border-default)', borderRadius: '8px', overflow: 'hidden', background: 'var(--color-bg-primary)', display: 'flex' }}>
            {/* Sidebar */}
            <div style={{ width: '96px', background: 'var(--color-bg-secondary)', display: 'flex', flexDirection: 'column', padding: '12px 8px', flexShrink: 0, borderRight: '1px solid var(--color-border-subtle)' }}>
              {/* Logo placeholder */}
              <div style={{ width: '48px', height: '20px', background: 'var(--color-interactive-default)', borderRadius: 'var(--radius-xs)', marginBottom: '16px', opacity: 0.8 }} />
              {/* Nav items */}
              {NAV_ITEMS.map((label, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 8px',
                    borderRadius: 'var(--radius-xs)',
                    marginBottom: '4px',
                    background: i === 0 ? 'var(--color-brand-tint)' : 'transparent',
                  }}
                >
                  <div style={{ width: '12px', height: '12px', background: i === 0 ? 'var(--color-brand-tint-text)' : 'var(--color-border-default)', borderRadius: '2px', flexShrink: 0, opacity: i === 0 ? 1 : 0.5 }} />
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.5625rem', color: i === 0 ? 'var(--color-brand-tint-text)' : 'var(--color-text-tertiary)', fontWeight: i === 0 ? 600 : 400 }}>
                    {label}
                  </div>
                </div>
              ))}
              {/* User row at bottom */}
              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '6px', paddingTop: '8px', borderTop: '1px solid var(--color-border-default)' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '9999px', background: 'var(--color-border-default)', flexShrink: 0 }} />
                <div>
                  <SkeletonLine width="40px" height="6px" />
                </div>
              </div>
            </div>

            {/* Main content */}
            <div style={{ flex: 1, padding: '12px' }}>
              {/* Metric cards row */}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
                {[1, 2, 3].map((i) => (
                  <div key={i} style={{ flex: 1, height: '40px', background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-xs)', padding: '6px 8px' }}>
                    <SkeletonLine width="60%" height="6px" />
                    <SkeletonLine width="80%" height="10px" />
                  </div>
                ))}
              </div>
              {/* Lead list */}
              {[75, 60, 80].map((w, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '9999px', background: 'var(--color-border-default)', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <SkeletonLine width={`${w}%`} height="7px" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <SpecRow>Full sidebar · icon + label · 240px · 36-40px items</SpecRow>
          <SpecNote>Nav rail hidden. Sidebar expanded by default at xl (1280px).</SpecNote>
        </div>
      </div>

      {/* Transition note */}
      <NoteBlock>
        Navigation transitions: bottom nav to nav rail at sm (600px), nav rail to full sidebar at lg (1024px). Never show two navigation patterns simultaneously.
      </NoteBlock>
    </Page>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 3 — GRID SYSTEM
// ─────────────────────────────────────────────────────────────────────────────

const GRID_ROWS = [
  { bp: '< 600px',    cols: 4,  gutter: '16px', padding: '16px', notes: 'Mobile — full bleed content' },
  { bp: 'sm 600px',  cols: 4,  gutter: '16px', padding: '16px', notes: 'Tablet start — nav rail visible' },
  { bp: 'md 768px',  cols: 8,  gutter: '20px', padding: '24px', notes: 'Side panels can appear' },
  { bp: 'lg 1024px', cols: 12, gutter: '24px', padding: '36px', notes: 'Full sidebar; 12-col content grid' },
  { bp: 'xl 1280px', cols: 12, gutter: '24px', padding: '36px', notes: 'Max-content-width: 1200px' },
  { bp: '2xl 1536px',cols: 12, gutter: '24px', padding: '36px', notes: 'Layout unchanged; content stays capped' },
];

const VISUAL_GRIDS = [
  { label: 'Mobile (< 600px)', cols: 4 },
  { label: 'Tablet md (768px+)', cols: 8 },
  { label: 'Desktop lg (1024px+)', cols: 12 },
];

function GridSystemContent() {
  const TH = {
    padding: '12px 16px',
    textAlign: 'left',
    background: 'var(--color-bg-secondary)',
    borderBottom: '2px solid var(--color-border-default)',
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.875rem',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    color: 'var(--color-text-secondary)',
    whiteSpace: 'nowrap',
  };
  function td(extra) {
    return {
      padding: '12px 16px',
      fontFamily: 'Inter, sans-serif',
      fontSize: '0.875rem',
      borderBottom: '1px solid var(--color-border-subtle)',
      color: 'var(--color-text-primary)',
      ...extra,
    };
  }

  return (
    <Page>
      <SectionHead
        title="Grid system"
        subtitle="12-column grid collapses at each breakpoint. Columns, gutters, and page padding change with layout tier."
      />

      {/* Grid reference table */}
      <div style={{ marginBottom: '40px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Inter, sans-serif' }}>
          <thead>
            <tr>
              <th style={TH}>Breakpoint</th>
              <th style={TH}>Columns</th>
              <th style={TH}>Gutter</th>
              <th style={TH}>Page padding</th>
              <th style={TH}>Notes</th>
            </tr>
          </thead>
          <tbody>
            {GRID_ROWS.map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? 'var(--color-bg-primary)' : 'var(--color-bg-surface)' }}>
                <td style={td({ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem', whiteSpace: 'nowrap' })}>{row.bp}</td>
                <td style={td({ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem', textAlign: 'center' })}>{row.cols}</td>
                <td style={td({ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' })}>{row.gutter}</td>
                <td style={td({ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' })}>{row.padding}</td>
                <td style={td({ color: 'var(--color-text-secondary)' })}>{row.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Visual column grids */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {VISUAL_GRIDS.map(({ label, cols }) => (
          <div key={cols}>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
              {label} — {cols} columns
            </div>
            <div style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-default)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '4px' }}>
                {Array.from({ length: cols }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      height: '32px',
                      background: 'var(--color-brand-tint)',
                      borderRadius: 'var(--radius-xs)',
                      border: '1px solid var(--color-border-default)',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Page>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 4 — COMPONENT BEHAVIOR
// ─────────────────────────────────────────────────────────────────────────────

const BEHAVIOR_ROWS = [
  { component: 'Bottom nav',      trigger: '--breakpoint-sm',  triggerLabel: 'hides at sm (600px)',    change: 'Replaced by nav rail' },
  { component: 'Nav rail',        trigger: '--breakpoint-sm',  triggerLabel: 'appears at sm (600px)',  change: 'Icon-only, 64px, replaces bottom nav' },
  { component: 'Nav rail',        trigger: '--breakpoint-lg',  triggerLabel: 'hides at lg (1024px)',   change: 'Replaced by full sidebar' },
  { component: 'Full sidebar',    trigger: '--breakpoint-lg',  triggerLabel: 'appears at lg (1024px)', change: '240px, icon + label nav items' },
  { component: 'Lead detail',     trigger: '--breakpoint-md',  triggerLabel: 'at md (768px)',          change: 'Bottom sheet to persistent side panel' },
  { component: 'Metric cards',    trigger: '--breakpoint-sm',  triggerLabel: 'at sm (600px)',          change: 'Single column to 2-up grid' },
  { component: 'Lead list row',   trigger: '--breakpoint-md',  triggerLabel: 'at md (768px)',          change: 'Compact 2-line to full row with columns' },
  { component: 'Modal / dialog',  trigger: '--breakpoint-sm',  triggerLabel: 'at sm (600px)',          change: 'Full-screen bottom sheet to centred dialog' },
  { component: 'Page padding',    trigger: '--breakpoint-md',  triggerLabel: 'at md (768px)',          change: '16px to 24px' },
  { component: 'Page padding',    trigger: '--breakpoint-lg',  triggerLabel: 'at lg (1024px)',         change: '24px to 36px' },
  { component: 'Content max-w',   trigger: '--breakpoint-xl',  triggerLabel: 'at xl (1280px)',         change: 'Uncapped to max-width 1200px container' },
  { component: 'Analytics charts',trigger: '--breakpoint-lg',  triggerLabel: 'at lg (1024px)',         change: 'Stacked to side-by-side layout' },
];

function ComponentBehaviorContent() {
  return (
    <Page>
      <SectionHead
        title="Component behaviour at breakpoints"
        subtitle="Key components that change layout or presentation at specific breakpoints."
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {BEHAVIOR_ROWS.map((row, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '12px 16px',
              background: i % 2 === 0 ? 'var(--color-bg-surface)' : 'var(--color-bg-primary)',
              borderLeft: '3px solid var(--color-interactive-default)',
              borderBottom: i < BEHAVIOR_ROWS.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
              borderRadius: i === 0 ? 'var(--radius-sm) var(--radius-sm) 0 0' : i === BEHAVIOR_ROWS.length - 1 ? '0 0 var(--radius-sm) var(--radius-sm)' : '0',
            }}
          >
            {/* Component name */}
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', minWidth: '136px', flexShrink: 0 }}>
              {row.component}
            </div>

            {/* Token trigger */}
            <div style={{ minWidth: '196px', flexShrink: 0 }}>
              <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', color: 'var(--color-brand-tint-text)', background: 'var(--color-brand-tint)', borderRadius: 'var(--radius-xs)', padding: '2px 8px' }}>
                {row.triggerLabel}
              </code>
            </div>

            {/* What changes */}
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: 'var(--color-text-secondary)', flex: 1 }}>
              {row.change}
            </div>
          </div>
        ))}
      </div>
    </Page>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STORY EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

export const Overview = {
  render: () => <StoryFrame><OverviewContent /></StoryFrame>,
  parameters: {
    docs: {
      description: {
        story: 'Full reference table for all six breakpoint tokens. Scale bar shows the three navigation tiers (mobile / tablet / desktop). xs (375px) is a floor constraint only — no Tailwind prefix.',
      },
    },
  },
};
Overview.storyName = 'Overview';

export const NavigationStates = {
  render: () => <StoryFrame><NavigationStatesContent /></StoryFrame>,
  parameters: {
    docs: {
      description: {
        story: 'Three navigation patterns one per layout tier. Bottom nav is the mobile default. Nav rail replaces it at sm (600px). Full sidebar replaces the rail at lg (1024px). Never two nav patterns at once.',
      },
    },
  },
};
NavigationStates.storyName = 'Navigation States';

export const GridSystem = {
  render: () => <StoryFrame><GridSystemContent /></StoryFrame>,
  parameters: {
    docs: {
      description: {
        story: '12-column grid collapses to 8-col at md (768px) and 4-col on mobile. Page padding steps from 16px (mobile) to 24px (md) to 36px (lg+). Max-content-width 1200px caps at xl (1280px).',
      },
    },
  },
};
GridSystem.storyName = 'Grid System';

export const ComponentBehavior = {
  render: () => <StoryFrame><ComponentBehaviorContent /></StoryFrame>,
  parameters: {
    docs: {
      description: {
        story: '12 component behaviour changes mapped to their breakpoint trigger. Consult this when implementing responsive behaviour for any pattern or component.',
      },
    },
  },
};
ComponentBehavior.storyName = 'Component Behavior';
