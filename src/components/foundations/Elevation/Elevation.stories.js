import React, { useState } from 'react';

export default {
  title: 'Foundations/Elevation',
  parameters: { layout: 'fullscreen' },
};

// ─────────────────────────────────────────────────────────────────────────────
// TOKEN DATA
// ─────────────────────────────────────────────────────────────────────────────

const SHADOW_PRIMITIVES = [
  { name: '--shadow-none', value: 'none',                                                                         rule: 'Used internally by --elevation-0' },
  { name: '--shadow-sm',   value: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',                      rule: 'Never use in components — use --elevation-* instead' },
  { name: '--shadow-md',   value: '0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',                     rule: 'Never use in components — use --elevation-* instead' },
  { name: '--shadow-lg',   value: '0 16px 40px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06)',                   rule: 'Never use in components — use --elevation-* instead' },
];

const ELEVATION_LEVELS = [
  { name: '--elevation-0', ref: '--shadow-none', level: 0, usage: 'Table rows, flat list items',           usedOn: 'Table rows, flat list items',                         lightShadow: 'none',                                                                    darkShadow: 'none',                                                           hasBorder: true },
  { name: '--elevation-1', ref: '--shadow-sm',   level: 1, usage: 'Cards, content panels',                 usedOn: 'Cards, content panels, form sections',                lightShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',        darkShadow: '0 1px 2px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.04)' },
  { name: '--elevation-2', ref: '--shadow-md',   level: 2, usage: 'Dropdowns, tooltips, sticky headers',  usedOn: 'Dropdowns, tooltips, popovers, sticky headers',       lightShadow: '0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',      darkShadow: '0 4px 12px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.06)' },
  { name: '--elevation-3', ref: '--shadow-lg',   level: 3, usage: 'Modals, dialogs, bottom sheets',       usedOn: 'Modals, dialogs, bottom sheets, command palettes',    lightShadow: '0 16px 40px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06)',   darkShadow: '0 16px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.08)' },
];

const ELEVATION_RULES = [
  'Components ALWAYS use --elevation-* tokens, never --shadow-* directly.',
  "--elevation-0 is not 'no elevation' — it is flush elevation. Use it explicitly on table rows and flat list items.",
  'Never skip levels. Cards are always elevation-1. Modals are always elevation-3.',
  'Dark mode elevation is handled automatically via the .dark token override — no component changes needed.',
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
      marginTop: '24px',
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

function RulesBlock({ rules }) {
  return (
    <div style={{ borderLeft: '3px solid #C2410C', /* story-only */ padding: '12px 16px', background: 'var(--color-bg-secondary)', marginTop: '32px' }}>
      <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#C2410C', /* story-only */ marginBottom: '8px' }}>
        Rules
      </div>
      {rules.map((rule, i) => (
        <div key={i} style={{ position: 'relative', paddingLeft: '12px', fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: '1.5rem' }}>
          <span style={{ position: 'absolute', left: 0, color: '#C2410C' /* story-only */ }}>•</span>
          {rule}
        </div>
      ))}
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
// STORY 1 — ELEVATION SCALE
// ─────────────────────────────────────────────────────────────────────────────

function ElevationCard({ level, tokenName, refToken, usage, shadow, border }) {
  return (
    <div style={{
      background: 'var(--color-bg-surface)',
      border: border || 'none',
      boxShadow: shadow,
      borderRadius: 'var(--radius-md)',
      padding: '20px',
    }}>
      {/* Level badge */}
      <div style={{
        display: 'inline-block',
        fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 600,
        textTransform: 'uppercase', letterSpacing: '0.06em',
        background: 'var(--color-bg-secondary)', color: 'var(--color-text-secondary)',
        padding: '3px 8px', borderRadius: 'var(--radius-xs)', marginBottom: '10px',
      }}>
        Level {level}
      </div>

      {/* Token name — story-only orange */}
      <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem', color: '#C2410C', /* story-only */ lineHeight: '1.25rem', marginBottom: '4px' }}>
        {tokenName}
      </div>

      {/* References */}
      <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'var(--color-text-tertiary)', lineHeight: '1rem', marginBottom: '8px' }}>
        → {refToken}
      </div>

      {/* Usage */}
      <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontStyle: 'italic', color: 'var(--color-text-secondary)', lineHeight: '1.5rem' }}>
        {usage}
      </div>
    </div>
  );
}

function ElevationScaleContent() {
  return (
    <div style={{ padding: '32px' }}>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.75rem', fontWeight: 700, lineHeight: '2.25rem', color: 'var(--color-text-primary)', margin: '0 0 8px 0' }}>
        Elevation
      </h1>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 400, lineHeight: '1.75rem', color: 'var(--color-text-secondary)', margin: '0 0 48px 0' }}>
        4 semantic elevation levels built on shadow primitives. Components always use --elevation-* tokens — never --shadow-* directly.
      </p>

      {/* Elevation levels */}
      <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.25rem', fontWeight: 600, lineHeight: '1.75rem', color: 'var(--color-text-primary)', margin: '0 0 16px 0' }}>
        Elevation levels
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '48px' }}>
        {ELEVATION_LEVELS.map((el) => (
          <ElevationCard
            key={el.name}
            level={el.level}
            tokenName={el.name}
            refToken={el.ref}
            usage={el.usage}
            shadow={`var(${el.name})`}
            border={el.hasBorder ? '1px solid var(--color-border-default)' : undefined}
          />
        ))}
      </div>

      {/* Architecture */}
      <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.25rem', fontWeight: 600, lineHeight: '1.75rem', color: 'var(--color-text-primary)', margin: '0 0 16px 0' }}>
        Architecture
      </h2>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {/* Left: shadow primitives */}
        <div style={{ flex: '1 1 300px', background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-default)', borderRadius: 'var(--radius-md)', padding: '24px' }}>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', lineHeight: '1.25rem', marginBottom: '8px' }}>
            Shadow primitives
          </div>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: '1.5rem', margin: '0 0 16px 0' }}>
            Raw CSS box-shadow values. Defined once, never changed. Never referenced in components.
            Think of these as paint — components don't ask for "the blue paint", they ask for "the primary colour".
          </p>
          {SHADOW_PRIMITIVES.map((s) => (
            <div key={s.name} style={{ marginBottom: '8px' }}>
              <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem', color: '#C2410C' /* story-only */ }}>
                {s.name}
              </span>
              <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', color: 'var(--color-text-tertiary)', lineHeight: '1.25rem', wordBreak: 'break-all' }}>
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {/* Right: elevation tokens */}
        <div style={{ flex: '1 1 300px', background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-default)', borderRadius: 'var(--radius-md)', padding: '24px' }}>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', lineHeight: '1.25rem', marginBottom: '8px' }}>
            Elevation tokens
          </div>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: '1.5rem', margin: '0 0 16px 0' }}>
            Semantic layer that components use. These change in dark mode — shadow primitives don't.
            If the entire product's card shadow needs updating, change --elevation-1 once.
          </p>
          {ELEVATION_LEVELS.map((el) => (
            <div key={el.name} style={{ marginBottom: '8px' }}>
              <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem', color: '#C2410C' /* story-only */ }}>
                {el.name}
              </span>
              <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', color: 'var(--color-text-tertiary)', lineHeight: '1.25rem' }}>
                → {el.ref}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STORY 2 — DARK MODE ELEVATION
// ─────────────────────────────────────────────────────────────────────────────

/* Dark section uses hardcoded values so it always shows dark appearance regardless of toggle */
const DARK_SURFACE     = '#1f1f1f';
const DARK_SECONDARY   = '#a3a3a3';
const DARK_BADGE_BG    = '#2a2a2a';

function DarkModeElevationContent() {
  return (
    <div style={{ padding: '32px' }}>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.75rem', fontWeight: 700, lineHeight: '2.25rem', color: 'var(--color-text-primary)', margin: '0 0 8px 0' }}>
        Dark mode behaviour
      </h1>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 400, lineHeight: '1.75rem', color: 'var(--color-text-secondary)', margin: '0 0 48px 0' }}>
        Dark mode replaces drop shadows with a subtle light border to communicate depth. Toggle above to see the semantic token flips in the light-mode section.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>

        {/* Light mode section */}
        <div>
          <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.25rem', fontWeight: 600, lineHeight: '1.75rem', color: 'var(--color-text-primary)', margin: '0 0 16px 0' }}>
            Light mode
          </h2>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {ELEVATION_LEVELS.map((el) => (
              <div
                key={el.name}
                style={{
                  flex: '1 1 160px',
                  background: 'var(--color-bg-surface)',
                  border: el.hasBorder ? '1px solid var(--color-border-default)' : 'none',
                  boxShadow: el.lightShadow,
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                }}
              >
                <div style={{ display: 'inline-block', fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', background: 'var(--color-bg-secondary)', color: 'var(--color-text-secondary)', padding: '2px 6px', borderRadius: 'var(--radius-xs)', marginBottom: '8px' }}>
                  Level {el.level}
                </div>
                <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem', color: '#C2410C', /* story-only */ lineHeight: '1.25rem' }}>
                  {el.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dark mode section — hardcoded dark colours so it always appears dark */}
        <div>
          <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.25rem', fontWeight: 600, lineHeight: '1.75rem', color: 'var(--color-text-primary)', margin: '0 0 16px 0' }}>
            Dark mode
          </h2>
          <div style={{ background: '#141414', padding: '24px', borderRadius: 'var(--radius-lg)', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {ELEVATION_LEVELS.map((el) => (
              <div
                key={el.name}
                style={{
                  flex: '1 1 160px',
                  background: DARK_SURFACE,
                  border: el.level === 0 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                  boxShadow: el.darkShadow,
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                }}
              >
                <div style={{ display: 'inline-block', fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', background: DARK_BADGE_BG, color: DARK_SECONDARY, padding: '2px 6px', borderRadius: 'var(--radius-xs)', marginBottom: '8px' }}>
                  Level {el.level}
                </div>
                <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem', color: '#fb923c', /* story-only — orange on dark */ lineHeight: '1.25rem' }}>
                  {el.name}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <Callout>
        Dark mode elevation uses reduced drop shadows combined with a subtle light border
        (white at low opacity) to communicate depth. Heavy shadows disappear on dark backgrounds —
        the border provides the visual separation instead.
      </Callout>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STORY 3 — REFERENCE TABLE
// ─────────────────────────────────────────────────────────────────────────────

function ReferenceTableContent() {
  return (
    <div style={{ padding: '32px', background: 'var(--color-bg-primary)' }}>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.75rem', fontWeight: 700, lineHeight: '2.25rem', color: 'var(--color-text-primary)', margin: '0 0 8px 0' }}>
        Reference table
      </h1>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 400, lineHeight: '1.75rem', color: 'var(--color-text-secondary)', margin: '0 0 32px 0' }}>
        Shadow primitives and elevation tokens with their light and dark mode values.
      </p>

      {/* Section 1: Shadow primitives */}
      <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.25rem', fontWeight: 600, lineHeight: '1.75rem', color: 'var(--color-text-primary)', margin: '0 0 12px 0' }}>
        Shadow primitives
      </h2>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Inter, sans-serif', marginBottom: '48px' }}>
        <thead>
          <tr>
            {['Token', 'CSS value', 'Rule'].map((col) => (
              <th key={col} style={{ padding: '8px 12px', textAlign: 'left', borderBottom: '1px solid var(--color-border-default)', fontSize: '0.875rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-secondary)' }}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SHADOW_PRIMITIVES.map((s, i) => (
            <tr key={s.name} style={{ background: i % 2 === 1 ? 'var(--color-bg-secondary)' : 'transparent' }}>
              <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--color-border-default)', fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem', color: '#C2410C', /* story-only */ whiteSpace: 'nowrap' }}>
                {s.name}
              </td>
              <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--color-border-default)', fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', color: 'var(--color-text-tertiary)', wordBreak: 'break-all', maxWidth: '320px' }}>
                {s.value}
              </td>
              <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--color-border-default)', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                {s.rule}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Section 2: Elevation tokens */}
      <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.25rem', fontWeight: 600, lineHeight: '1.75rem', color: 'var(--color-text-primary)', margin: '0 0 12px 0' }}>
        Elevation tokens
      </h2>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Inter, sans-serif' }}>
        <thead>
          <tr>
            {['Token', 'References', 'Level', 'Light mode', 'Dark mode', 'Used on'].map((col) => (
              <th key={col} style={{ padding: '8px 12px', textAlign: 'left', borderBottom: '1px solid var(--color-border-default)', fontSize: '0.875rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ELEVATION_LEVELS.map((el, i) => (
            <tr key={el.name} style={{ background: i % 2 === 1 ? 'var(--color-bg-secondary)' : 'transparent' }}>
              <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--color-border-default)', fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem', color: '#C2410C', /* story-only */ whiteSpace: 'nowrap' }}>
                {el.name}
              </td>
              <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--color-border-default)', fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem', color: 'var(--color-text-tertiary)', whiteSpace: 'nowrap' }}>
                {el.ref}
              </td>
              <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--color-border-default)', fontSize: '0.875rem', color: 'var(--color-text-primary)', textAlign: 'center' }}>
                {el.level}
              </td>
              <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--color-border-default)', fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', color: 'var(--color-text-tertiary)', wordBreak: 'break-all', maxWidth: '200px' }}>
                {el.lightShadow}
              </td>
              <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--color-border-default)', fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', color: 'var(--color-text-tertiary)', wordBreak: 'break-all', maxWidth: '200px' }}>
                {el.darkShadow}
              </td>
              <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--color-border-default)', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                {el.usedOn}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <RulesBlock rules={ELEVATION_RULES} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

export const ElevationScale = {
  render: () => {
    function Story() {
      const [dark, setDark] = useState(false);
      return (
        <div className={dark ? 'dark' : ''} style={{ background: 'var(--color-bg-primary)', minHeight: '100vh' }}>
          <ControlsRow dark={dark} setDark={setDark} />
          <ElevationScaleContent />
        </div>
      );
    }
    return React.createElement(Story);
  },
};
ElevationScale.storyName = 'Elevation Scale';

export const DarkModeElevation = {
  render: () => {
    function Story() {
      const [dark, setDark] = useState(false);
      return (
        <div className={dark ? 'dark' : ''} style={{ background: 'var(--color-bg-primary)', minHeight: '100vh' }}>
          <ControlsRow dark={dark} setDark={setDark} />
          <DarkModeElevationContent />
        </div>
      );
    }
    return React.createElement(Story);
  },
};
DarkModeElevation.storyName = 'Dark Mode Behaviour';

export const ReferenceTable = {
  render: () => {
    function Story() {
      const [dark, setDark] = useState(false);
      return (
        <div className={dark ? 'dark' : ''} style={{ background: 'var(--color-bg-primary)', minHeight: '100vh' }}>
          <ControlsRow dark={dark} setDark={setDark} />
          <ReferenceTableContent />
        </div>
      );
    }
    return React.createElement(Story);
  },
};
ReferenceTable.storyName = 'Reference Table';
