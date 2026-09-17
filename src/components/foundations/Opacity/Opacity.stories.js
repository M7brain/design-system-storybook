import React, { useState } from 'react';

export default {
  title: 'Foundations/Opacity',
  parameters: { layout: 'fullscreen' },
};

// ─────────────────────────────────────────────────────────────────────────────
// TOKEN DATA
// ─────────────────────────────────────────────────────────────────────────────

const OPACITY_TOKENS = [
  { name: '--opacity-0',   cssVar: 'var(--opacity-0)',   value: 0,   pct: '0%',   usage: 'Invisible — animation start/end' },
  { name: '--opacity-10',  cssVar: 'var(--opacity-10)',  value: 0.1, pct: '10%',  usage: 'Subtle tint, ghost hover' },
  { name: '--opacity-20',  cssVar: 'var(--opacity-20)',  value: 0.2, pct: '20%',  usage: 'Light overlay, watermark' },
  { name: '--opacity-30',  cssVar: 'var(--opacity-30)',  value: 0.3, pct: '30%',  usage: 'Muted element, de-emphasis' },
  { name: '--opacity-40',  cssVar: 'var(--opacity-40)',  value: 0.4, pct: '40%',  usage: 'Disabled — use --opacity-disabled alias', isDisabledBase: true },
  { name: '--opacity-50',  cssVar: 'var(--opacity-50)',  value: 0.5, pct: '50%',  usage: 'Half-visible, placeholder states' },
  { name: '--opacity-60',  cssVar: 'var(--opacity-60)',  value: 0.6, pct: '60%',  usage: 'Secondary surface overlay' },
  { name: '--opacity-70',  cssVar: 'var(--opacity-70)',  value: 0.7, pct: '70%',  usage: 'Strong overlay, tooltip background' },
  { name: '--opacity-80',  cssVar: 'var(--opacity-80)',  value: 0.8, pct: '80%',  usage: 'Modal scrim, backdrop' },
  { name: '--opacity-90',  cssVar: 'var(--opacity-90)',  value: 0.9, pct: '90%',  usage: 'Near-opaque, loading overlay' },
  { name: '--opacity-100', cssVar: 'var(--opacity-100)', value: 1,   pct: '100%', usage: 'Fully visible — animation start/end' },
];

const OPACITY_ALIAS = {
  name: '--opacity-disabled',
  cssVar: 'var(--opacity-disabled)',
  value: '→ var(--opacity-40)',
  pct: '40%',
  usage: 'Apply to disabled component wrappers. Semantic alias — always use this, never --opacity-40 directly.',
  isAlias: true,
};

const DISABLED_RULES = [
  'Never hardcode opacity: 0.4 in a component. Always use opacity: var(--opacity-disabled).',
  "Apply --opacity-disabled to the component's outer wrapper, not to individual children — one declaration disables everything.",
  'Always pair with pointer-events: none and aria-disabled="true" on the element.',
  'Never use colour changes alone to indicate disabled state — opacity is the system-wide convention.',
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
    <div style={{
      borderLeft: '3px solid #C2410C', /* story-only */
      padding: '12px 16px',
      background: 'var(--color-bg-secondary)',
      marginTop: '32px',
    }}>
      <div style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: '0.75rem',
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: '#C2410C', /* story-only */
        marginBottom: '8px',
      }}>
        Rules
      </div>
      {rules.map((rule, i) => (
        <div
          key={i}
          style={{
            position: 'relative',
            paddingLeft: '12px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.875rem',
            fontWeight: 400,
            color: 'var(--color-text-secondary)',
            lineHeight: '1.5rem',
          }}
        >
          <span style={{ position: 'absolute', left: 0, color: '#C2410C' /* story-only */ }}>•</span>
          {rule}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STORY 1 — OPACITY SCALE
// ─────────────────────────────────────────────────────────────────────────────

function OpacityScaleContent() {
  return (
    <div style={{ padding: '32px' }}>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.75rem', fontWeight: 700, lineHeight: '2.25rem', color: 'var(--color-text-primary)', margin: '0 0 8px 0' }}>
        Opacity
      </h1>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 400, lineHeight: '1.75rem', color: 'var(--color-text-secondary)', margin: '0 0 32px 0' }}>
        11-step unitless scale from 0 to 1. --opacity-disabled is the semantic alias for all disabled component states.
      </p>

      <Callout>
        Opacity tokens are unitless values from 0 to 1. Use only these values across the product — no arbitrary opacity.
        --opacity-disabled is a semantic alias for --opacity-40; always use the alias on disabled component states.
      </Callout>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
        gap: '16px',
      }}>
        {OPACITY_TOKENS.map((token) => (
          <div
            key={token.name}
            style={{
              background: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border-default)',
              borderRadius: 'var(--radius-sm)',
              padding: '20px',
              textAlign: 'center',
            }}
          >
            {/* Swatch */}
            <div style={{
              height: '44px',
              width: '100%',
              borderRadius: 'var(--radius-xs)',
              background: 'var(--color-interactive-default)',
              opacity: token.value,
              border: '1px solid var(--color-border-default)',
            }} />

            {/* Token name — story-only orange */}
            <div style={{
              fontFamily: 'ui-monospace, monospace',
              fontSize: '0.75rem',
              fontWeight: 400,
              color: '#C2410C', /* story-only */
              marginTop: '8px',
              lineHeight: '1rem',
              wordBreak: 'break-all',
            }}>
              {token.name}
            </div>

            {/* Percentage */}
            <div style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.75rem',
              fontWeight: 500,
              color: 'var(--color-text-primary)',
              lineHeight: '1rem',
              marginTop: '2px',
            }}>
              {token.pct}
            </div>

            {/* CSS value */}
            <div style={{
              fontFamily: 'ui-monospace, monospace',
              fontSize: '0.75rem',
              fontWeight: 400,
              color: 'var(--color-text-tertiary)',
              lineHeight: '1rem',
              marginTop: '2px',
            }}>
              {token.value}
            </div>

            {/* Disabled alias badge — shown only on --opacity-40 */}
            {token.isDisabledBase && (
              <div style={{ marginTop: '6px' }}>
                <span style={{
                  display: 'inline-block',
                  /* story-only semantic badge colours */
                  background: '#fffbeb',
                  color: '#b45309',
                  border: '0.5px solid #fcd34d',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  fontFamily: 'Inter, sans-serif',
                  padding: '2px 6px',
                  borderRadius: 'var(--radius-xs)',
                  lineHeight: '1rem',
                }}>
                  disabled alias
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STORY 2 — DISABLED PATTERN
// ─────────────────────────────────────────────────────────────────────────────

function MockButton({ disabled }) {
  return (
    <div
      style={{ opacity: disabled ? 'var(--opacity-disabled)' : 1, pointerEvents: disabled ? 'none' : 'auto' }}
      aria-disabled={disabled}
    >
      <div style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        height: '40px', padding: '0 20px',
        background: 'var(--color-interactive-default)', color: 'var(--color-text-on-interactive)',
        borderRadius: 'var(--radius-sm)', fontFamily: 'Inter, sans-serif',
        fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', userSelect: 'none', width: '100%',
      }}>
        Save changes
      </div>
    </div>
  );
}

function MockInput({ disabled }) {
  return (
    <div
      style={{ opacity: disabled ? 'var(--opacity-disabled)' : 1, pointerEvents: disabled ? 'none' : 'auto' }}
      aria-disabled={disabled}
    >
      <div style={{
        height: '40px', padding: '0 14px',
        background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-default)',
        borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center',
        fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: 'var(--color-text-tertiary)',
      }}>
        Enter your name
      </div>
    </div>
  );
}

function MockToggle({ disabled }) {
  return (
    <div
      style={{ opacity: disabled ? 'var(--opacity-disabled)' : 1, pointerEvents: disabled ? 'none' : 'auto', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
      aria-disabled={disabled}
    >
      <div style={{ position: 'relative', width: '44px', height: '24px', borderRadius: 'var(--radius-full)', background: 'var(--color-interactive-default)', flexShrink: 0 }}>
        <div style={{ position: 'absolute', top: '2px', right: '2px', width: '20px', height: '20px', borderRadius: 'var(--radius-full)', background: 'var(--color-bg-surface)' }} />
      </div>
      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: 'var(--color-text-primary)' }}>Enabled</span>
    </div>
  );
}

function MockCard({ disabled }) {
  return (
    <div
      style={{ opacity: disabled ? 'var(--opacity-disabled)' : 1, pointerEvents: disabled ? 'none' : 'auto' }}
      aria-disabled={disabled}
    >
      <div style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-default)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', lineHeight: '1.25rem', marginBottom: '4px' }}>Pro plan</div>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 400, color: 'var(--color-text-secondary)', lineHeight: '1.25rem' }}>200 leads / month</div>
      </div>
    </div>
  );
}

const EXAMPLE_COMPONENTS = [
  { label: 'Button', Enabled: () => <MockButton disabled={false} />, Disabled: () => <MockButton disabled={true} /> },
  { label: 'Input',  Enabled: () => <MockInput  disabled={false} />, Disabled: () => <MockInput  disabled={true} /> },
  { label: 'Toggle', Enabled: () => <MockToggle disabled={false} />, Disabled: () => <MockToggle disabled={true} /> },
  { label: 'Card',   Enabled: () => <MockCard   disabled={false} />, Disabled: () => <MockCard   disabled={true} /> },
];

function StateLabel({ children, muted }) {
  return (
    <div style={{
      fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 500,
      color: muted ? 'var(--color-text-tertiary)' : 'var(--color-text-secondary)',
      lineHeight: '1rem', marginBottom: '8px',
    }}>
      {children}
    </div>
  );
}

function DisabledPatternContent() {
  return (
    <div style={{ padding: '32px' }}>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.75rem', fontWeight: 700, lineHeight: '2.25rem', color: 'var(--color-text-primary)', margin: '0 0 8px 0' }}>
        Disabled pattern
      </h1>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 400, lineHeight: '1.75rem', color: 'var(--color-text-secondary)', margin: '0 0 32px 0' }}>
        Disabled states use --opacity-disabled (0.4) on the outer wrapper — never colour alone, never hardcoded values.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' }}>
        {EXAMPLE_COMPONENTS.map(({ label, Enabled, Disabled }) => (
          <div key={label}>
            <div style={{
              fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 600,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              color: '#C2410C', /* story-only */
              marginBottom: '16px',
            }}>
              {label}
            </div>
            <StateLabel>Enabled</StateLabel>
            <div style={{ marginBottom: '20px' }}><Enabled /></div>
            <StateLabel muted>Disabled — opacity-disabled (0.4)</StateLabel>
            <Disabled />
          </div>
        ))}
      </div>

      <RulesBlock rules={DISABLED_RULES} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STORY 3 — USAGE GUIDE
// ─────────────────────────────────────────────────────────────────────────────

const ALL_ROWS = [...OPACITY_TOKENS, OPACITY_ALIAS];
const TABLE_COLS = ['Token', 'Value', 'Semantic alias', 'Typical usage'];

function UsageGuideContent() {
  return (
    <div style={{ padding: '32px', background: 'var(--color-bg-primary)' }}>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.75rem', fontWeight: 700, lineHeight: '2.25rem', color: 'var(--color-text-primary)', margin: '0 0 8px 0' }}>
        Reference table
      </h1>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 400, lineHeight: '1.75rem', color: 'var(--color-text-secondary)', margin: '0 0 32px 0' }}>
        All opacity tokens and their semantic aliases.
      </p>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Inter, sans-serif' }}>
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
          {ALL_ROWS.map((token, i) => (
            <tr key={token.name} style={{ background: i % 2 === 1 ? 'var(--color-bg-surface)' : 'var(--color-bg-primary)' }}>
              <td style={{
                padding: '12px 16px', borderBottom: '1px solid var(--color-border-subtle)',
                fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem',
                color: token.isAlias ? 'var(--color-text-secondary)' : '#C2410C', /* story-only for scale tokens */
                whiteSpace: 'nowrap',
              }}>
                {token.name}
              </td>
              <td style={{
                padding: '12px 16px', borderBottom: '1px solid var(--color-border-subtle)',
                fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem', color: 'var(--color-text-primary)',
              }}>
                {token.isAlias ? '→ var(--opacity-40)' : token.value}
              </td>
              <td style={{
                padding: '12px 16px', borderBottom: '1px solid var(--color-border-subtle)',
                fontSize: '0.875rem',
                color: token.isAlias ? 'var(--color-text-secondary)' : 'var(--color-text-tertiary)',
              }}>
                {token.isAlias ? 'semantic alias' : '—'}
              </td>
              <td style={{
                padding: '12px 16px', borderBottom: '1px solid var(--color-border-subtle)',
                fontSize: '0.875rem', color: 'var(--color-text-secondary)',
              }}>
                {token.usage}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

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

export const OpacityScale = {
  render: () => {
    function Story() {
      const [dark, setDark] = useState(false);
      return (
        <div className={dark ? 'dark' : ''} style={{ background: 'var(--color-bg-primary)', minHeight: '100vh' }}>
          <ControlsRow dark={dark} setDark={setDark} />
          <OpacityScaleContent />
        </div>
      );
    }
    return React.createElement(Story);
  },
};
OpacityScale.storyName = 'Opacity Scale';

export const DisabledPattern = {
  render: () => {
    function Story() {
      const [dark, setDark] = useState(false);
      return (
        <div className={dark ? 'dark' : ''} style={{ background: 'var(--color-bg-primary)', minHeight: '100vh' }}>
          <ControlsRow dark={dark} setDark={setDark} />
          <DisabledPatternContent />
        </div>
      );
    }
    return React.createElement(Story);
  },
};
DisabledPattern.storyName = 'Disabled Pattern';

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
