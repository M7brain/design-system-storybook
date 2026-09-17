import React, { useState } from 'react';
import { Toggle } from './Toggle.jsx';

// ─────────────────────────────────────────────────────────────────────────────
// META
// ─────────────────────────────────────────────────────────────────────────────

export default {
  title: 'Components/Toggle',
  parameters: {
    layout: 'fullscreen',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
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

// ─────────────────────────────────────────────────────────────────────────────
// INTERACTIVE WRAPPER
// onChange receives a boolean (not an event) — Toggle calls onChange(!checked)
// ─────────────────────────────────────────────────────────────────────────────

function ToggleDemo({ initialChecked = false, ...props }) {
  const [checked, setChecked] = useState(initialChecked);
  return (
    <Toggle
      checked={checked}
      onChange={setChecked}
      {...props}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const PROPS = [
  {
    name: 'label',
    type: 'string',
    defaultVal: '—',
    description: 'Visible label text. Always required — use hideLabel to visually hide it when surrounding context is sufficient.',
  },
  {
    name: 'hideLabel',
    type: 'bool',
    defaultVal: 'false',
    description: 'Applies sr-only to the label. Must be paired with an explicit aria-label prop — a dev warning fires if omitted.',
  },
  {
    name: 'description',
    type: 'string',
    defaultVal: '—',
    description: 'Supplementary text below the label row, indented to align under the label text (not the track). Used for "why this setting matters" context.',
  },
  {
    name: 'checked',
    type: 'bool',
    defaultVal: 'false',
    description: 'Controlled on/off state. Always pair with onChange for a fully controlled toggle.',
  },
  {
    name: 'disabled',
    type: 'bool',
    defaultVal: 'false',
    description: 'Applies --opacity-disabled (0.4) to the outer wrapper and blocks interaction. No disabled colour token — opacity only.',
  },
  {
    name: 'onChange',
    type: '(checked: boolean) => void',
    defaultVal: 'undefined',
    description: 'Change handler. Receives the new boolean value directly (true = on, false = off) — not a native event. Distinct from Checkbox which passes e.target.checked.',
  },
  {
    name: 'id',
    type: 'string',
    defaultVal: 'auto',
    description: 'HTML id for the switch button. Auto-generated with useId() when omitted — label htmlFor stays in sync.',
  },
  {
    name: 'name',
    type: 'string',
    defaultVal: 'undefined',
    description: 'Native name attribute on the button — for form integration when needed.',
  },
  {
    name: 'aria-label',
    type: 'string',
    defaultVal: 'undefined',
    description: 'Required when hideLabel is true. Provides the accessible name for screen readers when the visual label is hidden.',
  },
];

const TOKENS = [
  { token: '--color-bg-input', role: 'Track fill — off-state resting' },
  { token: '--color-interactive-default', role: 'Track fill — on-state resting' },
  { token: '--color-interactive-hover', role: 'Track fill — on-state hover (pointer devices only)' },
  { token: '--color-border-default', role: 'Track border — off-state resting (same token as Checkbox and Input; see DECISIONS.md)' },
  { token: '--color-border-strong', role: 'Track border — off-state hover (pointer devices only; same token as Checkbox and Input)' },
  { token: '--color-focus-ring', role: 'Track border — focus-visible (wins over all other border states)' },
  { token: '--color-border-input', role: 'Thumb fill — off-state only. #868686 light / #707070 dark vs off-state track: 3.28:1 light / 3.62:1 dark ✅ WCAG 1.4.11. See DECISIONS.md fix pass 2026-06-20.' },
  { token: '--color-bg-surface', role: 'Thumb fill — on-state only. #ffffff / #1e1e1e vs on-state track: 5.17:1 light / 7.36:1 dark ✅ unchanged.' },
  { token: '--elevation-1', role: 'Thumb shadow — visual depth. Was previously the sole off-state contrast mitigation; now supplementary since --color-border-input satisfies WCAG 1.4.11 directly.' },
  { token: '--radius-full', role: 'Track and thumb border-radius (9999px — pill shape)' },
  { token: '--opacity-disabled', role: 'Disabled state opacity (0.4) applied to outer wrapper' },
  { token: '--color-text-primary', role: 'Label text' },
  { token: '--color-text-secondary', role: 'Description text' },
  { token: '--duration-fast', role: 'Thumb left-offset transition duration (100ms)' },
  { token: '--ease-spring', role: 'Thumb left-offset easing — reserved for toggles and checkboxes (small snap)' },
  { token: '--duration-base', role: 'Track fill and border-color transition duration (200ms)' },
  { token: '--ease-default', role: 'Track fill and border-color easing' },
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
        Toggle
      </h1>
      <p style={{
        fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 400,
        lineHeight: '1.75rem', color: 'var(--color-text-secondary)', margin: 0,
      }}>
        An instant binary control for settings that apply immediately — no confirmation needed.
        Track: 44×24px · Thumb: 20px · always 44×44px tap target (no breakpoint collapse).
        Resting border: --color-border-default · hover border: --color-border-strong — matching Input and Checkbox exactly (see DECISIONS.md).
        Markup: <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>{'<button role="switch" aria-checked>'}</code> — immediate-action semantics, not form-field.
      </p>
    </div>

    {/* ── Gallery ──────────────────────────────────────────────────────────── */}
    <SectionHead
      title="Gallery"
      description="All states, label variants, and description layout."
    />

    {/* States */}
    <div style={{ marginBottom: '40px' }}>
      <BlockLabel>States</BlockLabel>
      <InfoBox>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '24px' }}>

          <div>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
              default — off
            </div>
            <Toggle label="Auto-reply to new leads" checked={false} onChange={() => {}} />
          </div>

          <div>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
              checked — on
            </div>
            <Toggle label="Auto-reply to new leads" checked={true} onChange={() => {}} />
          </div>

          <div>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
              hover — interact to see
            </div>
            <ToggleDemo label="Hover me" />
          </div>

          <div>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
              focus-visible — tab to see
            </div>
            <ToggleDemo label="Tab to focus" />
          </div>

          <div>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
              disabled — off
            </div>
            <Toggle label="Auto-reply to new leads" checked={false} disabled onChange={() => {}} />
          </div>

          <div>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
              disabled — on
            </div>
            <Toggle label="Auto-reply to new leads" checked={true} disabled onChange={() => {}} />
          </div>

        </div>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
          color: 'var(--color-text-secondary)', margin: '24px 0 0 0',
        }}>
          Hover (off-state border darkens/lightens) and focus-visible (track border shifts to focus ring) are interaction-driven — interact with any toggle above to see them. Disabled uses{' '}
          <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>--opacity-disabled</code>{' '}
          (0.4) on the outer wrapper — no disabled colour token.
        </p>
      </InfoBox>
    </div>

    {/* Label and description variants */}
    <div style={{ marginBottom: '40px' }}>
      <BlockLabel>Label and description variants</BlockLabel>
      <InfoBox>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '32px' }}>

          <div>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
              with description prop — auto-reply use case
            </div>
            <ToggleDemo
              label="Auto-reply to new leads"
              description="When paused, you'll still get instant notifications — just no AI follow-up is sent."
              initialChecked={true}
            />
          </div>

          <div>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
              without description — notification preference
            </div>
            <ToggleDemo label="Daily digest" initialChecked={true} />
          </div>

          <div>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
              hideLabel={'{true}'} · aria-label required
            </div>
            <ToggleDemo
              label="Auto-reply to new leads"
              hideLabel
              aria-label="Auto-reply to new leads"
            />
            <div style={{
              marginTop: '12px',
              fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', lineHeight: '1rem',
              color: 'var(--color-text-secondary)',
            }}>
              Screen readers receive:{' '}
              <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', color: 'var(--color-text-primary)' }}>
                "Auto-reply to new leads, switch button"
              </code>
            </div>
          </div>

        </div>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
          color: 'var(--color-text-secondary)', margin: '24px 0 0 0',
        }}>
          Description is indented to align under the label text (not the track): <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>paddingLeft: calc(44px + var(--space-3))</code>.
          hideLabel hides visually via sr-only but preserves the label in the accessibility tree — the dev warning fires if hideLabel is true and aria-label is absent.
        </p>
      </InfoBox>
    </div>

    <Divider />

    {/* ── Touch target ─────────────────────────────────────────────────────── */}
    <SectionHead
      title="Touch target"
      description="The 44×44px tap area is always active — no breakpoint collapse. Unlike Button (md) and Input (md), which collapse their ::before expansion at lg (1024px), Toggle's 24px track never approaches 44px and must maintain the expansion at all breakpoints. The track is already 44px wide — the ::before only needs to ensure the 44px height minimum."
    />

    <div style={{ marginBottom: '40px' }}>
      <InfoBox style={{ display: 'flex', gap: '64px', alignItems: 'flex-start', flexWrap: 'wrap', padding: '40px 24px' }}>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '60px' }}>
            <Toggle
              label="Touch target"
              hideLabel
              aria-label="Touch target demo"
              checked={false}
              onChange={() => {}}
            />
            <div aria-hidden="true" style={{
              position: 'absolute',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '44px', height: '44px',
              border: '1.5px dashed var(--color-status-warning)',
              borderRadius: '4px', pointerEvents: 'none',
            }} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem',
              color: 'var(--color-text-primary)', marginBottom: '4px',
            }}>
              44×24px visual · 44×44px hit area
            </div>
            <div style={{
              fontFamily: 'Inter, sans-serif', fontSize: '0.75rem',
              color: 'var(--color-text-secondary)', marginBottom: '4px',
            }}>
              ::before always 44×44px
            </div>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'var(--color-status-success-text)' }}>
              no breakpoint collapse
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '8px', maxWidth: '360px' }}>
          <div style={{
            fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600,
            color: 'var(--color-text-primary)', marginBottom: '4px',
          }}>
            Why always-on, not breakpoint-gated?
          </div>
          <p style={{
            fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
            color: 'var(--color-text-secondary)', margin: 0,
          }}>
            Button (md, 40px tall) and Input (md, 40px tall) use breakpoint-gated expansion because their visual height approaches
            44px at larger viewports — the expansion can safely collapse once the visual itself satisfies the minimum. Toggle's track
            is 24px tall and never reaches 44px at any breakpoint. The{' '}
            <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>::before</code>{' '}
            expansion must remain active everywhere. Technique is identical to Checkbox's always-on approach.
          </p>
        </div>

      </InfoBox>
    </div>

    <Divider />

    {/* ── Usage guide ──────────────────────────────────────────────────────── */}
    <SectionHead
      title="Usage guide"
      description="When to use Toggle, what to exclude, and how to write the label."
    />

    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '16px',
      marginBottom: '40px',
    }}>

      <InfoBox>
        <div style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600,
          color: 'var(--color-text-primary)', marginBottom: '8px',
        }}>
          Toggle vs Checkbox — when to use which
        </div>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
          color: 'var(--color-text-secondary)', margin: 0,
        }}>
          Use <strong>Toggle</strong> for settings that take effect immediately on flip — AI pause,
          notification preferences, business hours. Use <strong>Checkbox</strong> for values that are
          part of a form and submitted together (consent, multi-select filters, settings with a save button).
          If the change requires a confirm step, it is not a Toggle.
        </p>
      </InfoBox>

      <InfoBox>
        <div style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600,
          color: 'var(--color-text-primary)', marginBottom: '8px',
        }}>
          No loading state
        </div>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
          color: 'var(--color-text-secondary)', margin: 0,
        }}>
          The consuming screen is responsible for async handling — use an optimistic update and revert on
          error via Toast. The Toggle itself never models a pending state; building that into the control
          would couple it to the request lifecycle it has no visibility into. Same principle as Checkbox.
        </p>
      </InfoBox>

      <InfoBox>
        <div style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600,
          color: 'var(--color-text-primary)', marginBottom: '8px',
        }}>
          No error state
        </div>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
          color: 'var(--color-text-secondary)', margin: 0,
        }}>
          Toggle is not a form field with validation — it is a live setting. If the setting update fails, revert
          the optimistic update and show a Toast with the error message. Error state on the Toggle itself
          would be semantically incorrect: a live setting either succeeds or rolls back.
        </p>
      </InfoBox>

      <InfoBox>
        <div style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600,
          color: 'var(--color-text-primary)', marginBottom: '8px',
        }}>
          Label phrasing rule
        </div>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
          color: 'var(--color-text-secondary)', margin: 0,
        }}>
          Labels describe the <strong>setting or action</strong>, never the current state. Write "Auto-reply to
          new leads", not "Auto-reply is on" — the current state becomes stale and confusing when
          the toggle changes. The switch's on/off visual already communicates the state; the label need not.
        </p>
      </InfoBox>

      <InfoBox>
        <div style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600,
          color: 'var(--color-text-primary)', marginBottom: '8px',
        }}>
          When to use description
        </div>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
          color: 'var(--color-text-secondary)', margin: 0,
        }}>
          Add a{' '}
          <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>description</code>{' '}
          when the setting's consequence is not self-evident from the label alone — e.g. "When paused, you'll still
          get instant notifications." Omit it for preferences whose effect is obvious from context (e.g.
          "Daily digest" in a notifications list).
        </p>
      </InfoBox>

      <InfoBox>
        <div style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600,
          color: 'var(--color-text-primary)', marginBottom: '8px',
        }}>
          Controlled always
        </div>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
          color: 'var(--color-text-secondary)', margin: 0,
        }}>
          Always provide <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>checked</code>{' '}
          and <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>onChange</code> together.
          Note that <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>onChange</code>{' '}
          receives a boolean directly (not a native event): <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>onChange={'{setChecked}'}</code>.
        </p>
      </InfoBox>

    </div>

    <Divider />

    {/* ── Props reference table ─────────────────────────────────────────────── */}
    <SectionHead
      title="Props"
      description="All props accepted by the Toggle component."
    />

    <div style={{
      background: 'var(--color-bg-surface)',
      border: '1px solid var(--color-border-default)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      marginBottom: '40px',
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

    <Divider />

    {/* ── Sizing reference ──────────────────────────────────────────────────── */}
    <SectionHead
      title="Sizing and touch target"
      description="Track, thumb, and tap area dimensions."
    />

    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '16px',
      marginBottom: '40px',
    }}>
      <InfoBox>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '12px' }}>
          Track
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {[
              ['Width', '44px'],
              ['Height', '24px'],
              ['Border-radius', '--radius-full (9999px)'],
              ['Border', '1px solid (token-driven)'],
            ].map(([label, value], i) => (
              <tr key={label}>
                <td style={{ padding: '6px 0', fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: 'var(--color-text-secondary)', paddingRight: '16px', borderBottom: i < 3 ? '1px solid var(--color-border-subtle)' : 'none' }}>{label}</td>
                <td style={{ padding: '6px 0', fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem', color: 'var(--color-text-primary)', borderBottom: i < 3 ? '1px solid var(--color-border-subtle)' : 'none' }}>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </InfoBox>

      <InfoBox>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '12px' }}>
          Thumb
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {[
              ['Size', '20×20px'],
              ['Vertical centering', 'top: 50% + translateY(-50%)'],
              ['Inset (resting)', '2px from left'],
              ['Inset (checked)', '22px from left (= 44 − 20 − 2)'],
              ['Travel distance', '20px'],
            ].map(([label, value], i) => (
              <tr key={label}>
                <td style={{ padding: '6px 0', fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: 'var(--color-text-secondary)', paddingRight: '16px', borderBottom: i < 3 ? '1px solid var(--color-border-subtle)' : 'none' }}>{label}</td>
                <td style={{ padding: '6px 0', fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem', color: 'var(--color-text-primary)', borderBottom: i < 3 ? '1px solid var(--color-border-subtle)' : 'none' }}>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </InfoBox>

      <InfoBox>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '12px' }}>
          Touch target
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {[
              ['Size', '44×44px (WCAG 2.5.5)'],
              ['Technique', '::before pseudo-element'],
              ['Collapse at lg?', 'No — always-on'],
              ['Precedent', 'Matches Checkbox exactly'],
            ].map(([label, value], i) => (
              <tr key={label}>
                <td style={{ padding: '6px 0', fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: 'var(--color-text-secondary)', paddingRight: '16px', borderBottom: i < 3 ? '1px solid var(--color-border-subtle)' : 'none' }}>{label}</td>
                <td style={{ padding: '6px 0', fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem', color: 'var(--color-text-primary)', borderBottom: i < 3 ? '1px solid var(--color-border-subtle)' : 'none' }}>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </InfoBox>
    </div>

    <Divider />

    {/* ── Tokens reference table ────────────────────────────────────────────── */}
    <SectionHead
      title="Tokens"
      description="Every design token consumed by the Toggle component."
    />

    <div style={{
      background: 'var(--color-bg-surface)',
      border: '1px solid var(--color-border-default)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      marginBottom: '40px',
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'var(--color-bg-secondary)' }}>
            {['TOKEN', 'ROLE'].map(h => (
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
                fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
                color: 'var(--color-text-primary)',
                borderBottom: i < TOKENS.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
              }}>
                {row.role}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <Divider />

    {/* ── Do / Don't ───────────────────────────────────────────────────────── */}
    <SectionHead
      title="Do / Don't"
      description="Label phrasing is the most common misuse pattern — one example covers it."
    />

    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px',
      marginBottom: '40px',
    }}>

      <InfoBox style={{ borderColor: 'var(--color-status-error-text)' }}>
        <div style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600,
          color: 'var(--color-status-error-text)', marginBottom: '16px',
        }}>
          Don't — describe the current state
        </div>
        <Toggle
          label="Auto-reply is on"
          checked={true}
          onChange={() => {}}
        />
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
          color: 'var(--color-text-secondary)', margin: '16px 0 0 0',
        }}>
          "Auto-reply is on" describes the current state, which becomes stale and confusing the moment the toggle
          is flipped. When off, it would read "Auto-reply is on" — the opposite of reality.
        </p>
      </InfoBox>

      <InfoBox style={{ borderColor: 'var(--color-status-success-text)' }}>
        <div style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600,
          color: 'var(--color-status-success-text)', marginBottom: '16px',
        }}>
          Do — describe the setting
        </div>
        <Toggle
          label="Auto-reply to new leads"
          checked={true}
          onChange={() => {}}
        />
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
          color: 'var(--color-text-secondary)', margin: '16px 0 0 0',
        }}>
          "Auto-reply to new leads" names the setting itself — accurate whether the toggle is on or off.
          The switch's visual already communicates the current state; the label need not.
        </p>
      </InfoBox>

    </div>

  </StoryFrame>
);
