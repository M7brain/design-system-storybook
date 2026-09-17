import React, { useState } from 'react';

export default {
  title: 'Foundations/Spacing',
  parameters: { layout: 'fullscreen' },
};

// ─────────────────────────────────────────────────────────────────────────────
// TOKEN DATA
// ─────────────────────────────────────────────────────────────────────────────

const SPACING_GROUPS = [
  {
    group: 'Micro',
    isMicro: true,
    tokens: [
      { name: '--space-px',  px: 1,  gridUnits: null, usage: 'Hairline borders, 1px dividers, pixel nudges' },
      { name: '--space-0.5', px: 2,  gridUnits: null, usage: 'Fine icon nudges, sub-grid adjustments' },
    ],
  },
  {
    group: 'Core',
    tokens: [
      { name: '--space-1',   px: 4,  gridUnits: 1,   usage: 'Icon gap, tight inline padding, progress bar height' },
      { name: '--space-2',   px: 8,  gridUnits: 2,   usage: 'Badge padding, input icon gap, tight button padding' },
      { name: '--space-2.5', px: 10, gridUnits: 2.5, usage: 'Input vertical padding, medium button padding' },
      { name: '--space-3',   px: 12, gridUnits: 3,   usage: 'Button horizontal padding (sm), list item gap' },
      { name: '--space-4',   px: 16, gridUnits: 4,   usage: 'Card inner padding, row base, mobile page gutter' },
      { name: '--space-5',   px: 20, gridUnits: 5,   usage: 'Button horizontal padding (lg), section padding (sm)' },
      { name: '--space-6',   px: 24, gridUnits: 6,   usage: 'Card vertical padding, section gap (tight)' },
      { name: '--space-7',   px: 28, gridUnits: 7,   usage: 'Comfortable list item padding, medium component gap' },
      { name: '--space-8',   px: 32, gridUnits: 8,   usage: 'Section gaps, sidebar item spacing' },
      { name: '--space-10',  px: 40, gridUnits: 10,  usage: 'Large section gaps, modal padding' },
      { name: '--space-12',  px: 48, gridUnits: 12,  usage: 'Page section margins, hero vertical padding (sm)' },
    ],
  },
  {
    group: 'Large',
    tokens: [
      { name: '--space-14',  px: 56,  gridUnits: 14, usage: 'Nav bar height reference, large component height' },
      { name: '--space-16',  px: 64,  gridUnits: 16, usage: 'Major layout gaps, hero content spacing' },
      { name: '--space-20',  px: 80,  gridUnits: 20, usage: 'Hero section vertical padding, large feature gaps' },
      { name: '--space-24',  px: 96,  gridUnits: 24, usage: 'Page section top/bottom margin, landing padding' },
      { name: '--space-32',  px: 128, gridUnits: 32, usage: 'Maximum section spacing, landing hero height basis' },
    ],
  },
];

const ALL_TOKENS = SPACING_GROUPS.flatMap((g) =>
  g.tokens.map((t) => ({ ...t, group: g.group, isMicro: !!g.isMicro }))
);

const SPACING_RULES = [
  'NEVER use arbitrary px values for padding, margin, gap, height, or width in any component.',
  "If a value isn't in the scale, use the nearest token. If the gap is real, raise it as a design system discussion.",
  'Micro tokens (--space-px, --space-0.5) are for hairlines and nudges only — never structural layout.',
  '--space-2.5 (10px) is the standard vertical padding for inputs and medium buttons.',
  'Large tokens (--space-14 and above) are for page layout and landing page sections — not component internals.',
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

function GroupLabel({ name }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'baseline', gap: '12px',
      padding: '16px 0 8px 0',
      borderBottom: '1px solid var(--color-border-default)',
      marginBottom: '4px',
    }}>
      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-primary)' }}>
        {name}
      </span>
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
// STORY 1 — SPACING SCALE
// ─────────────────────────────────────────────────────────────────────────────

function SpacingScaleContent() {
  return (
    <div style={{ padding: '32px' }}>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.75rem', fontWeight: 700, lineHeight: '2.25rem', color: 'var(--color-text-primary)', margin: '0 0 8px 0' }}>
        Spacing
      </h1>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 400, lineHeight: '1.75rem', color: 'var(--color-text-secondary)', margin: '0 0 32px 0' }}>
        18 tokens across Micro / Core / Large groups, all multiples of 4px. Use Micro tokens only for hairlines and nudges.
      </p>

      <Callout>
        Spacing tokens use px (layout unit — not text-relative). All values are multiples of 4px
        except the Micro tokens (1px, 2px) which are precision tools for hairlines and fine nudges.
        Never use Micro tokens for structural spacing.
      </Callout>

      {SPACING_GROUPS.map((group) => (
        <div key={group.group} style={{ marginBottom: '24px' }}>
          <GroupLabel name={group.group} />

          {group.tokens.map((token) => {
            const barWidth = Math.max(Math.min(token.px, 320), 2);
            const isMicro = group.isMicro;
            const gridLabel = isMicro
              ? `${token.px}px · precision only — not layout`
              : `${token.px}px · ${token.gridUnits} grid ${token.gridUnits === 1 ? 'unit' : 'units'}`;

            return (
              <div
                key={token.name}
                style={{
                  display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '16px',
                  padding: '10px 0', borderBottom: '0.5px solid var(--color-border-default)',
                  /* purple left-border accent for Micro tokens — story-only */
                  borderLeft: isMicro ? '2px solid #7c3aed' : 'none',
                  paddingLeft: isMicro ? '8px' : '0',
                }}
              >
                {/* Left: token meta */}
                <div style={{ width: '220px', flexShrink: 0 }}>
                  <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', fontWeight: 400, color: '#C2410C', /* story-only */ lineHeight: '1rem', marginBottom: '2px' }}>
                    {token.name}
                  </div>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'var(--color-text-tertiary)', lineHeight: '1rem' }}>
                    {gridLabel}
                  </div>
                </div>

                {/* Middle: bar */}
                <div style={{
                  width: `${barWidth}px`, height: '20px',
                  background: 'color-mix(in srgb, var(--color-interactive-default) 20%, transparent)',
                  border: '1px solid var(--color-interactive-default)',
                  borderRadius: 'var(--radius-xs)', flexShrink: 0,
                }} />

                {/* Right: usage */}
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'var(--color-text-secondary)', lineHeight: '1.25rem', flex: 1 }}>
                  {token.usage}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STORY 2 — REFERENCE TABLE
// ─────────────────────────────────────────────────────────────────────────────

const TABLE_COLS = ['Token', 'px', 'Grid units', 'Group', 'Usage'];

function SpacingTableContent() {
  let rowIndex = 0;

  return (
    <div style={{ padding: '32px', background: 'var(--color-bg-primary)' }}>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.75rem', fontWeight: 700, lineHeight: '2.25rem', color: 'var(--color-text-primary)', margin: '0 0 8px 0' }}>
        Reference table
      </h1>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 400, lineHeight: '1.75rem', color: 'var(--color-text-secondary)', margin: '0 0 32px 0' }}>
        All spacing tokens with their pixel values, grid units, and usage guidance.
      </p>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Inter, sans-serif' }}>
        <thead>
          <tr>
            {TABLE_COLS.map((col) => (
              <th key={col} style={{
                padding: '12px 16px', textAlign: 'left',
                background: 'var(--color-bg-primary)',
                borderBottom: '2px solid var(--color-border-default)',
                fontSize: '0.875rem', fontWeight: 500,
                textTransform: 'uppercase', letterSpacing: '0.04em',
                color: 'var(--color-text-secondary)', whiteSpace: 'nowrap',
              }}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SPACING_GROUPS.map((group) => [
            /* Group header row */
            <tr key={`hdr-${group.group}`}>
              <td
                colSpan={5}
                style={{
                  padding: '6px 12px',
                  background: 'var(--color-bg-secondary)',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--color-text-secondary)',
                  borderBottom: '1px solid var(--color-border-default)',
                }}
              >
                {group.group}
              </td>
            </tr>,

            /* Token rows */
            ...group.tokens.map((token) => {
              const isEven = rowIndex % 2 === 1;
              rowIndex++;
              return (
                <tr key={token.name} style={{ background: isEven ? 'var(--color-bg-surface)' : 'var(--color-bg-primary)' }}>
                  <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border-subtle)', fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem', color: '#C2410C', /* story-only */ whiteSpace: 'nowrap' }}>
                    {token.name}
                  </td>
                  <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border-subtle)', fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem', color: 'var(--color-text-primary)' }}>
                    {token.px}px
                  </td>
                  <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border-subtle)', fontSize: '0.875rem', color: 'var(--color-text-primary)' }}>
                    {token.gridUnits !== null ? token.gridUnits : 'n/a'}
                  </td>
                  <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border-subtle)', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                    {group.group}
                  </td>
                  <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border-subtle)', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                    {token.usage}
                  </td>
                </tr>
              );
            }),
          ])}
        </tbody>
      </table>

      <RulesBlock rules={SPACING_RULES} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

export const SpacingScale = {
  render: () => {
    function Story() {
      const [dark, setDark] = useState(false);
      return (
        <div className={dark ? 'dark' : ''} style={{ background: 'var(--color-bg-primary)', minHeight: '100vh' }}>
          <ControlsRow dark={dark} setDark={setDark} />
          <SpacingScaleContent />
        </div>
      );
    }
    return React.createElement(Story);
  },
};
SpacingScale.storyName = 'Spacing Scale';

export const SpacingTable = {
  render: () => {
    function Story() {
      const [dark, setDark] = useState(false);
      return (
        <div className={dark ? 'dark' : ''} style={{ background: 'var(--color-bg-primary)', minHeight: '100vh' }}>
          <ControlsRow dark={dark} setDark={setDark} />
          <SpacingTableContent />
        </div>
      );
    }
    return React.createElement(Story);
  },
};
SpacingTable.storyName = 'Reference Table';
