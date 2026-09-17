import React, { useState } from 'react';
import { Checkbox } from './Checkbox.jsx';

// ─────────────────────────────────────────────────────────────────────────────
// META
// ─────────────────────────────────────────────────────────────────────────────

export default {
  title: 'Components/Checkbox',
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
// INTERACTIVE WRAPPERS
// ─────────────────────────────────────────────────────────────────────────────

function CheckboxDemo({ initialChecked = false, ...props }) {
  const [checked, setChecked] = useState(initialChecked);
  return (
    <Checkbox
      checked={checked}
      onChange={e => setChecked(e.target.checked)}
      {...props}
    />
  );
}

function IndeterminateDemo() {
  const [children, setChildren] = useState([false, true, false]);

  const allChecked = children.every(Boolean);
  const someChecked = children.some(Boolean);
  const indeterminate = someChecked && !allChecked;

  const handleParent = (e) => {
    setChildren(children.map(() => e.target.checked));
  };

  const handleChild = (index) => (e) => {
    const next = [...children];
    next[index] = e.target.checked;
    setChildren(next);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <Checkbox
        label="Select all locations"
        checked={allChecked}
        indeterminate={indeterminate}
        onChange={handleParent}
      />
      <div style={{ paddingLeft: 'calc(var(--space-5) + var(--space-2))', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {['Downtown', 'Westside', 'Airport'].map((name, i) => (
          <Checkbox
            key={name}
            label={name}
            checked={children[i]}
            onChange={handleChild(i)}
          />
        ))}
      </div>
    </div>
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
    description: 'Visible label text. Always required — use hideLabel to visually hide it when context is sufficient.',
  },
  {
    name: 'hideLabel',
    type: 'bool',
    defaultVal: 'false',
    description: 'Applies sr-only to the label span. Must be paired with an explicit aria-label prop — a dev warning fires if omitted.',
  },
  {
    name: 'caption',
    type: 'string',
    defaultVal: '—',
    description: 'Supplementary text below the label row, indented to align with the label. Hidden when error is present.',
  },
  {
    name: 'checked',
    type: 'bool',
    defaultVal: 'false',
    description: 'Controlled checked state. Always pair with onChange for a fully controlled checkbox.',
  },
  {
    name: 'indeterminate',
    type: 'bool',
    defaultVal: 'false',
    description: 'Sets the DOM indeterminate property (via useEffect) and aria-checked="mixed". Used for parent checkboxes in a group where some children are checked.',
  },
  {
    name: 'disabled',
    type: 'bool',
    defaultVal: 'false',
    description: 'Applies --opacity-disabled (0.4) on the outer wrapper and blocks interaction. No disabled colour token — opacity only.',
  },
  {
    name: 'readOnly',
    type: 'bool',
    defaultVal: 'false',
    description: 'Sets aria-readonly="true", suppresses onChange, and prevents click. Full opacity — focusable. AT announces differently from disabled: "read-only" vs "unavailable".',
  },
  {
    name: 'error',
    type: 'string',
    defaultVal: '—',
    description: 'Error message below the checkbox, aligned with the left edge of the visual box (not the label text). Sets aria-invalid="true" and role="alert". Replaces caption. Scoped to standalone consent checkboxes only.',
  },
  {
    name: 'onChange',
    type: '(e: ChangeEvent) => void',
    defaultVal: 'undefined',
    description: 'Change handler for controlled usage. Receives the native input event — read e.target.checked. No-op when readOnly is true.',
  },
  {
    name: 'id',
    type: 'string',
    defaultVal: 'auto',
    description: 'HTML id for the native input. Auto-generated with useId() when omitted — label htmlFor is always kept in sync.',
  },
  {
    name: 'name',
    type: 'string',
    defaultVal: 'undefined',
    description: 'Form field name for native form submission and FormData access.',
  },
  {
    name: 'aria-label',
    type: 'string',
    defaultVal: 'undefined',
    description: 'Required when hideLabel is true. Provides the accessible name for screen readers when the visual label is hidden.',
  },
];

const TOKENS = [
  { token: '--color-bg-input', role: 'Box fill — unchecked resting and read-only' },
  { token: '--color-interactive-default', role: 'Box fill — checked and indeterminate resting' },
  { token: '--color-interactive-hover', role: 'Box fill — checked and indeterminate hover' },
  { token: '--color-border-default', role: 'Box border — unchecked resting (matches Input exactly; see DECISIONS.md for token-swap rationale)' },
  { token: '--color-border-strong', role: 'Box border — unchecked hover (pointer devices only; matches Input)' },
  { token: '--color-focus-ring', role: 'Box border — focus-visible (wins over all other border states)' },
  { token: '--color-status-error-text', role: 'Box border and error message colour — surface-level (mode-aware), not badge fill' },
  { token: '--color-text-primary', role: 'Label text' },
  { token: '--color-text-secondary', role: 'Caption text' },
  { token: '--color-text-on-interactive-primary', role: 'Checkmark and indeterminate dash colour (on filled box)' },
  { token: '--opacity-disabled', role: 'Disabled state opacity (0.4) applied to outer wrapper' },
  { token: '--space-5', role: 'Visual box size: 20×20px' },
  { token: '--space-2', role: 'Gap between box and label; subtracted in caption/error left indent' },
  { token: '--radius-xs', role: 'Box corner radius: 4px' },
  { token: '--duration-fast', role: 'Box fill and checkmark/dash transition duration' },
  { token: '--ease-spring', role: 'Box fill and checkmark/dash easing (small snap)' },
  { token: '--duration-base', role: 'Border-color transition duration' },
  { token: '--ease-default', role: 'Border-color easing' },
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
        Checkbox
      </h1>
      <p style={{
        fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 400,
        lineHeight: '1.75rem', color: 'var(--color-text-secondary)', margin: 0,
      }}>
        Binary selection control. 8 states · label + caption + error · always 44×44px tap target (no breakpoint collapse).
        Resting border: --color-border-default · hover border: --color-border-strong — matching Input exactly (see DECISIONS.md).
        Error border + message: --color-status-error-text (surface-level, mode-aware — not badge fill --color-status-error).
        Error row starts flush with the box left edge, not the label text (fix pass 2026-06-20).
      </p>
    </div>

    {/* ── Gallery ──────────────────────────────────────────────────────────── */}
    <SectionHead
      title="Gallery"
      description="All 8 states, label variants, and multi-line label alignment."
    />

    {/* States */}
    <div style={{ marginBottom: '40px' }}>
      <BlockLabel>States — all 8</BlockLabel>
      <InfoBox>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '24px' }}>

          <div>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
              unchecked
            </div>
            <Checkbox label="Unchecked" checked={false} onChange={() => {}} />
          </div>

          <div>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
              checked
            </div>
            <Checkbox label="Checked" checked={true} onChange={() => {}} />
          </div>

          <div>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
              indeterminate
            </div>
            <Checkbox label="Indeterminate" checked={false} indeterminate={true} onChange={() => {}} />
          </div>

          <div>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
              hover — interact to see
            </div>
            <CheckboxDemo label="Hover me" />
          </div>

          <div>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
              focus-visible — tab to see
            </div>
            <CheckboxDemo label="Tab to focus" />
          </div>

          <div>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
              disabled
            </div>
            <Checkbox label="Disabled" checked={false} disabled onChange={() => {}} />
          </div>

          <div>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
              read-only
            </div>
            <Checkbox label="Read-only" checked={true} readOnly onChange={() => {}} />
          </div>

          <div>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
              error — icon+message at box left edge
            </div>
            <Checkbox label="Consent required" checked={false} error="You must accept to continue" onChange={() => {}} />
          </div>

        </div>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
          color: 'var(--color-text-secondary)', margin: '24px 0 0 0',
        }}>
          Hover (border and fill darken/lighten) and focus-visible (focus ring border) are interaction-driven — interact
          with any checkbox above to see them. Disabled uses{' '}
          <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>--opacity-disabled</code>{' '}
          (0.4) on the outer wrapper — no disabled colour token. Read-only is full opacity,
          focusable, and announces as "read-only" (not "unavailable") to screen readers.
        </p>
      </InfoBox>
    </div>

    {/* Label variants */}
    <div style={{ marginBottom: '40px' }}>
      <BlockLabel>Label variants — default · with caption · hideLabel</BlockLabel>
      <InfoBox>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>

          <div>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
              default
            </div>
            <CheckboxDemo label="Send me weekly tips" />
          </div>

          <div>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
              caption prop
            </div>
            <CheckboxDemo
              label="Enable SMS replies"
              caption="Carrier rates may apply. Reply STOP to opt out."
            />
          </div>

          <div>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
              hideLabel={'{true}'} · aria-label required
            </div>
            <CheckboxDemo
              label="Select item"
              hideLabel
              aria-label="Select item"
            />
          </div>

        </div>
      </InfoBox>
    </div>

    {/* Multi-line label — permanent regression test */}
    <div style={{ marginBottom: '40px' }}>
      <BlockLabel>Multi-line label — first-line alignment regression test</BlockLabel>
      <InfoBox>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
          color: 'var(--color-text-secondary)', margin: '0 0 20px 0',
        }}>
          The checkbox box must align with the <strong>first line</strong> of the label text when the label wraps.
          The label row uses <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>items-start</code>{' '}
          to pin the box to the top. This container is constrained to 280px to force wrapping — verify alignment holds in both themes.
        </p>
        <div style={{ maxWidth: '280px' }}>
          <CheckboxDemo
            label="I agree to receive SMS messages from this business. Standard carrier rates apply. Reply STOP at any time to opt out."
          />
        </div>
      </InfoBox>
    </div>

    {/* Indeterminate — interactive */}
    <div style={{ marginBottom: '40px' }}>
      <BlockLabel>Indeterminate — parent / child group (interactive)</BlockLabel>
      <InfoBox>
        <IndeterminateDemo />
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
          color: 'var(--color-text-secondary)', margin: '20px 0 0 0',
        }}>
          Toggle individual locations to see the parent enter the indeterminate state. Click the parent to
          select or deselect all. The dash animates in with{' '}
          <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>scaleX</code>{' '}
          — the checkmark and dash are always in the DOM with animated opacity + transform,
          so transitions work in both directions.
        </p>
      </InfoBox>
    </div>

    <Divider />

    {/* ── Touch target ─────────────────────────────────────────────────────── */}
    <SectionHead
      title="Touch target"
      description="The 44×44px tap area is always active — no breakpoint collapse. Unlike Button (md) and Input (md), which collapse their ::before expansion at lg (1024px), Checkbox always maintains the minimum 44×44px WCAG 2.5.5 target. The visual box is 20×20px; the ::before pseudo-element on the box wrapper span expands the hit area."
    />

    <div style={{ marginBottom: '40px' }}>
      <InfoBox style={{ display: 'flex', gap: '64px', alignItems: 'flex-start', flexWrap: 'wrap', padding: '40px 24px' }}>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '60px', height: '60px' }}>
            <Checkbox
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
              20px visual · 44px hit area
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

      </InfoBox>
    </div>

    <Divider />

    {/* ── Usage guide ──────────────────────────────────────────────────────── */}
    <SectionHead
      title="Usage guide"
      description="When to use each prop and how to compose checkboxes correctly."
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
          Controlled always
        </div>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
          color: 'var(--color-text-secondary)', margin: 0,
        }}>
          Always provide <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>checked</code> and{' '}
          <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>onChange</code> together.
          An uncontrolled checkbox (no checked prop) will not reflect state changes visually — the design system
          is fully controlled by convention.
        </p>
      </InfoBox>

      <InfoBox>
        <div style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600,
          color: 'var(--color-text-primary)', marginBottom: '8px',
        }}>
          disabled vs read-only
        </div>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
          color: 'var(--color-text-secondary)', margin: 0,
        }}>
          Use <strong>disabled</strong> when the field cannot be interacted with in this context (e.g. locked by plan).
          Use <strong>readOnly</strong> when the value should be visible but not editable — it stays focusable
          and screen readers announce it as "read-only" rather than "unavailable". Never use disabled for display-only values.
        </p>
      </InfoBox>

      <InfoBox>
        <div style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600,
          color: 'var(--color-text-primary)', marginBottom: '8px',
        }}>
          Error scope
        </div>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
          color: 'var(--color-text-secondary)', margin: 0,
        }}>
          The error prop is scoped to <strong>standalone consent checkboxes</strong> only — e.g. "You must accept the
          terms to continue." Do not use error on checkboxes inside a group; surface the group-level error on the
          fieldset legend or a dedicated alert instead.
        </p>
      </InfoBox>

      <InfoBox>
        <div style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600,
          color: 'var(--color-text-primary)', marginBottom: '8px',
        }}>
          caption vs error
        </div>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
          color: 'var(--color-text-secondary)', margin: 0,
        }}>
          Use <strong>caption</strong> for supplementary context that persists regardless of state — e.g. carrier rate
          disclaimers, opt-out instructions. When error is present, caption is hidden and error takes its place.
          The two never render simultaneously.
        </p>
      </InfoBox>

      <InfoBox>
        <div style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600,
          color: 'var(--color-text-primary)', marginBottom: '8px',
        }}>
          Indeterminate
        </div>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
          color: 'var(--color-text-secondary)', margin: 0,
        }}>
          Use <strong>indeterminate</strong> only on parent checkboxes in a select-all pattern, never as a standalone state.
          Derive it from child state: <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>someChecked && !allChecked</code>.
          The DOM property is set via useEffect — there is no HTML attribute equivalent.
        </p>
      </InfoBox>

      <InfoBox>
        <div style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600,
          color: 'var(--color-text-primary)', marginBottom: '8px',
        }}>
          hideLabel + aria-label
        </div>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
          color: 'var(--color-text-secondary)', margin: 0,
        }}>
          Use hideLabel in table row selectors and icon-dense layouts where surrounding context provides the label.
          Always pair with an explicit{' '}
          <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>aria-label</code> prop.
          A dev console warning fires if hideLabel is true and aria-label is absent.
        </p>
      </InfoBox>

    </div>

    <Divider />

    {/* ── Props reference table ─────────────────────────────────────────────── */}
    <SectionHead
      title="Props"
      description="All props accepted by the Checkbox component."
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

    {/* ── Tokens reference table ────────────────────────────────────────────── */}
    <SectionHead
      title="Tokens"
      description="Every design token consumed by the Checkbox component."
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

  </StoryFrame>
);
