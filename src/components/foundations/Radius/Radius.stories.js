import React, { useState } from 'react';

export default {
  title: 'Foundations/Radius',
  parameters: { layout: 'fullscreen' },
};

// ─────────────────────────────────────────────────────────────────────────────
// TOKEN DATA
// ─────────────────────────────────────────────────────────────────────────────

const RADIUS_TOKENS = [
  { name: '--radius-xs',   cssVar: 'var(--radius-xs)',   value: '4px',    px: 4,    gridUnits: 1,    display: '4px · 1 grid unit',        gridMath: '4 ÷ 4 = 1 unit',   usedOn: 'Tags, chips, tight inline badges' },
  { name: '--radius-sm',   cssVar: 'var(--radius-sm)',   value: '8px',    px: 8,    gridUnits: 2,    display: '8px · 2 grid units',       gridMath: '8 ÷ 4 = 2 units',  usedOn: 'Buttons, inputs, dropdowns, select menus' },
  { name: '--radius-md',   cssVar: 'var(--radius-md)',   value: '12px',   px: 12,   gridUnits: 3,    display: '12px · 3 grid units',      gridMath: '12 ÷ 4 = 3 units', usedOn: 'Cards, content containers, tooltips' },
  { name: '--radius-lg',   cssVar: 'var(--radius-lg)',   value: '16px',   px: 16,   gridUnits: 4,    display: '16px · 4 grid units',      gridMath: '16 ÷ 4 = 4 units', usedOn: 'Panels, sidebars, notification drawers' },
  { name: '--radius-xl',   cssVar: 'var(--radius-xl)',   value: '20px',   px: 20,   gridUnits: 5,    display: '20px · 5 grid units',      gridMath: '20 ÷ 4 = 5 units', usedOn: 'Modals, dialogs, popovers' },
  { name: '--radius-2xl',  cssVar: 'var(--radius-2xl)',  value: '24px',   px: 24,   gridUnits: 6,    display: '24px · 6 grid units',      gridMath: '24 ÷ 4 = 6 units', usedOn: 'Bottom sheets, drawers, landing page hero cards' },
  { name: '--radius-full', cssVar: 'var(--radius-full)', value: '9999px', px: null, gridUnits: null, display: '9999px — pill convention', gridMath: null,                usedOn: 'Badges, status pills, avatars, toggle tracks' },
];

const RULES = [
  'Never apply border-radius using arbitrary px values.',
  'Always use the nearest token. If nothing fits, raise it as a design system discussion — do not add a one-off value.',
  '--radius-full is for circular or pill shapes only. Never use it on rectangular content containers.',
  'Cards always use --radius-md. Modals always use --radius-xl. These are locked conventions.',
];

// ─────────────────────────────────────────────────────────────────────────────
// SHARED HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function modeBtn(active) {
  return {
    height: '32px', padding: '0 16px',
    fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 500,
    cursor: 'pointer', outline: 'none', borderRadius: 'var(--radius-sm)',
    background: active ? 'var(--color-brand-btn)' : 'transparent',
    color: active ? 'var(--color-brand-btn-text)' : 'var(--color-text-secondary)',
    border: active ? '1px solid transparent' : '1px solid var(--color-border-default)',
  };
}

function Callout({ children }) {
  return (
    <div style={{
      borderLeft: '3px solid #C2410C', /* story-only */
      background: 'var(--color-bg-secondary)',
      padding: '12px 16px',
      marginBottom: '24px',
      fontFamily: 'Inter, sans-serif',
      fontSize: '0.875rem',
      fontWeight: 400,
      color: 'var(--color-text-secondary)',
      lineHeight: '1.5rem',
    }}>
      {children}
    </div>
  );
}

function ControlsRow({ dark, setDark }) {
  return (
    <div style={{ background: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border-default)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 24px' }}>
        <button aria-pressed={!dark} onClick={() => setDark(false)} style={modeBtn(!dark)}>Light</button>
        <button aria-pressed={dark}  onClick={() => setDark(true)}  style={modeBtn(dark)}>Dark</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STORY 1 — RADIUS SCALE
// ─────────────────────────────────────────────────────────────────────────────

function RadiusScaleContent() {
  return (
    <div style={{ padding: '32px' }}>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.75rem', fontWeight: 700, lineHeight: '2.25rem', color: 'var(--color-text-primary)', margin: '0 0 8px 0' }}>
        Radius
      </h1>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 400, lineHeight: '1.75rem', color: 'var(--color-text-secondary)', margin: '0 0 32px 0' }}>
        7 tokens on a 4px grid. Cards always --radius-md. Modals always --radius-xl. --radius-full is the pill convention.
      </p>

      <Callout>
        Border-radius tokens use px (fixed geometry — not relative to font size).
        All values are multiples of 4px. --radius-full is the pill convention — intentional exception.
      </Callout>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
        {RADIUS_TOKENS.map((token) => (
          <div
            key={token.name}
            style={{
              background: 'var(--color-bg-primary)',
              border: '1px solid var(--color-border-default)',
              borderRadius: token.cssVar,
              padding: '20px',
            }}
          >
            {/* Demo box */}
            <div style={{
              height: '48px', width: '100%',
              background: 'color-mix(in srgb, var(--color-interactive-default) 15%, transparent)',
              border: '2px solid var(--color-interactive-default)',
              borderRadius: token.cssVar, marginBottom: '12px',
            }} />

            {/* Token name — story-only orange */}
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', fontWeight: 400, color: '#C2410C', /* story-only */ lineHeight: '1rem', marginBottom: '4px' }}>
              {token.name}
            </div>

            {/* Value */}
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 400, color: 'var(--color-text-secondary)', lineHeight: '1rem', marginBottom: '2px' }}>
              {token.display}
            </div>

            {/* Grid units */}
            {token.gridMath && (
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 400, color: 'var(--color-text-tertiary)', lineHeight: '1rem', marginBottom: '4px' }}>
                {token.gridMath}
              </div>
            )}

            {/* Usage */}
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 400, fontStyle: 'italic', color: 'var(--color-text-tertiary)', lineHeight: '1rem' }}>
              {token.usedOn}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STORY 2 — USAGE GUIDE
// ─────────────────────────────────────────────────────────────────────────────

const TABLE_COLS = ['Token', 'Value', 'Grid units', 'Used on'];

function UsageGuideContent() {
  return (
    <div style={{ padding: '32px', background: 'var(--color-bg-primary)' }}>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.75rem', fontWeight: 700, lineHeight: '2.25rem', color: 'var(--color-text-primary)', margin: '0 0 8px 0' }}>
        Reference table
      </h1>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 400, lineHeight: '1.75rem', color: 'var(--color-text-secondary)', margin: '0 0 32px 0' }}>
        All radius tokens, their values, and usage rules.
      </p>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Inter, sans-serif', marginBottom: '32px' }}>
        <thead>
          <tr>
            {TABLE_COLS.map((col) => (
              <th key={col} style={{
                padding: '12px 16px', textAlign: 'left',
                background: 'var(--color-bg-primary)',
                borderBottom: '2px solid var(--color-border-default)',
                fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 500,
                textTransform: 'uppercase', letterSpacing: '0.04em',
                color: 'var(--color-text-secondary)', whiteSpace: 'nowrap',
              }}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {RADIUS_TOKENS.map((token, i) => (
            <tr key={token.name} style={{ background: i % 2 === 1 ? 'var(--color-bg-surface)' : 'var(--color-bg-primary)' }}>
              <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border-subtle)', fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem', color: '#C2410C', /* story-only */ whiteSpace: 'nowrap' }}>
                {token.name}
              </td>
              <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border-subtle)', fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem', color: 'var(--color-text-primary)' }}>
                {token.value}
              </td>
              <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border-subtle)', fontSize: '0.875rem', color: 'var(--color-text-primary)' }}>
                {token.gridUnits !== null ? token.gridUnits : 'n/a'}
              </td>
              <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border-subtle)', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                {token.usedOn}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Rules block */}
      <div style={{ borderLeft: '3px solid #C2410C', /* story-only */ padding: '12px 16px', background: 'var(--color-bg-secondary)' }}>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#C2410C', /* story-only */ marginBottom: '8px' }}>
          Rules
        </div>
        {RULES.map((rule, i) => (
          <div key={i} style={{ position: 'relative', paddingLeft: '12px', fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 400, color: 'var(--color-text-secondary)', lineHeight: '1.5rem' }}>
            <span style={{ position: 'absolute', left: 0, color: '#C2410C' /* story-only */ }}>•</span>
            {rule}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

export const RadiusScale = {
  render: () => {
    function Story() {
      const [dark, setDark] = useState(false);
      return (
        <div className={dark ? 'dark' : ''} style={{ background: 'var(--color-bg-primary)', minHeight: '100vh' }}>
          <ControlsRow dark={dark} setDark={setDark} />
          <RadiusScaleContent />
        </div>
      );
    }
    return React.createElement(Story);
  },
};
RadiusScale.storyName = 'Radius Scale';

export const UsageGuide = {
  render: () => {
    function Story() {
      const [dark, setDark] = useState(false);
      return (
        <div className={dark ? 'dark' : ''} style={{ background: 'var(--color-bg-primary)', minHeight: '100vh' }}>
          <ControlsRow dark={dark} setDark={setDark} />
          <UsageGuideContent />
        </div>
      );
    }
    return React.createElement(Story);
  },
};
UsageGuide.storyName = 'Usage Guide';
