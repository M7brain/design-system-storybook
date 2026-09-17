import React, { useState } from 'react';
import { Textarea } from './Textarea.jsx';

// ─────────────────────────────────────────────────────────────────────────────
// META
// ─────────────────────────────────────────────────────────────────────────────

export default {
  title: 'Components/Textarea',
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

function TextareaDemo({ initialValue = '', ...props }) {
  const [value, setValue] = useState(initialValue);
  return (
    <Textarea
      value={value}
      onChange={e => setValue(e.target.value)}
      {...props}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const AUTO_GROW_VALUE =
  'When a lead submits their form I want to see the auto-grow in action. Start typing here and watch the textarea expand row by row — up to 8 rows before the internal scrollbar takes over. The native resize handle at the bottom-right stays active the whole time so you can manually extend beyond the cap.';

const COUNTER_UNDER_VALUE =
  'We had three leads this week where replies arrived between 8 and 14 minutes after submission — all on weekday evenings after 6 PM. The dashboard showed no delivery errors, and messages did eventually send. Two of the leads had already emailed us directly before the delayed reply arrived. Can you check whether there is a queue issue during peak evening hours?';

const NEAR_LIMIT_VALUE =
  'When a lead submits a form, Quicklo normally replies within 90 seconds. We had two incidents this week where the reply took 8-12 minutes - both on Thursday evening between 6 and 8 PM PST. No error appeared in the dashboard. Messages were eventually delivered, but not within the 90-second window. Our entire business pitch is built on that reply speed. It\'s the reason we chose Quicklo over three other tools. Can you investigate and let us know whether this is a known queue issue?';

const TOKENS = [
  { token: '--color-bg-input', role: 'Textarea fill — resting and focus states' },
  { token: '--color-border-default', role: 'Border — resting (deliberately lighter than 3:1; accepted trade per DECISIONS.md 2026-06-18)' },
  { token: '--color-border-strong', role: 'Border — hover (pointer devices only; suppressed during focus and in error/disabled states)' },
  { token: '--color-focus-ring', role: 'Border — focus-visible (alias to --color-interactive-default; wins over all other border states)' },
  { token: '--color-status-error-text', role: 'Border and error message — surface-level token (mode-aware: red-700 light / red-200 dark); NOT badge fill --color-status-error' },
  { token: '--color-text-primary', role: 'Typed text and label text' },
  { token: '--color-text-secondary', role: 'Character counter text' },
  { token: '--color-text-tertiary', role: 'Placeholder text' },
  { token: '--opacity-disabled', role: 'Disabled state opacity (0.4) applied directly to the textarea element' },
  { token: '--space-4', role: 'Padding: 16px — all four sides (vertical and horizontal, symmetric)' },
  { token: '--space-2', role: 'Gap — outer wrapper column; helper row between error and counter' },
  { token: '--space-1', role: 'Gap — error icon to error message text' },
  { token: '--radius-sm', role: 'Border radius: 8px (matches Input)' },
  { token: '--font-body', role: 'Font family — textarea text, label, error message, counter (Inter)' },
  { token: '--text-body-lg', role: 'Font size — textarea text: 1rem (iOS-zoom-safe minimum for inputs)' },
  { token: '--text-body-md', role: 'Font size — label: 0.875rem' },
  { token: '--text-body-sm', role: 'Font size — error message and character counter: 0.75rem' },
  { token: '--duration-base', role: 'Border-color transition duration: 200ms' },
  { token: '--ease-default', role: 'Border-color easing: cubic-bezier(0,0,0.2,1)' },
];

const PROPS = [
  {
    name: 'label',
    type: 'string',
    defaultVal: '—',
    description: 'Visible label above the textarea. Always required — Textarea has no hideLabel variant.',
  },
  {
    name: 'value',
    type: 'string',
    defaultVal: 'undefined',
    description: 'Controlled value. Required for the character counter to show an accurate count — always pair with onChange.',
  },
  {
    name: 'onChange',
    type: '(e: ChangeEvent) => void',
    defaultVal: 'undefined',
    description: 'Change handler for controlled usage. Receives the native textarea event — read e.target.value.',
  },
  {
    name: 'placeholder',
    type: 'string',
    defaultVal: 'undefined',
    description: 'Placeholder hint text. Never use as a substitute for a label — placeholder disappears when the field has content.',
  },
  {
    name: 'error',
    type: 'string',
    defaultVal: 'undefined',
    description: 'Error message below the textarea. Sets aria-invalid="true" on the element and role="alert" on the message. Border pins to --color-status-error-text.',
  },
  {
    name: 'disabled',
    type: 'bool',
    defaultVal: 'false',
    description: 'Applies --opacity-disabled (0.4) to the textarea element and sets cursor-not-allowed. No disabled colour token — opacity only.',
  },
  {
    name: 'maxLength',
    type: 'number',
    defaultVal: 'undefined',
    description: 'Passes the native maxLength attribute to the textarea. Required for the character counter to render — showCounter is ignored without it.',
  },
  {
    name: 'showCounter',
    type: 'bool',
    defaultVal: 'false',
    description: 'Shows a "currentLength / maxLength" counter below the textarea. Requires maxLength. Counter is informational — the native maxLength attribute enforces the hard limit.',
  },
  {
    name: 'id',
    type: 'string',
    defaultVal: 'auto',
    description: 'HTML id for the textarea element. Auto-generated with useId() when omitted — label htmlFor is always kept in sync.',
  },
  {
    name: 'name',
    type: 'string',
    defaultVal: 'undefined',
    description: 'Form field name for native form submission and FormData access.',
  },
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
        Textarea
      </h1>
      <p style={{
        fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 400,
        lineHeight: '1.75rem', color: 'var(--color-text-secondary)', margin: 0,
      }}>
        Multi-line text entry. 5 states · optional character counter · capped auto-grow (3-row min, 8-row max) · native resize handle persists as manual override.
        Shares the Input/Checkbox/Toggle token family — no new colour tokens.
        Resting border: --color-border-default · hover: --color-border-strong · focus: --color-focus-ring ·
        error: --color-status-error-text (surface-level, mode-aware — not badge fill --color-status-error).
        Native resize handle is exempt from the 44×44px tap target rule (WCAG User Agent Control exception).
      </p>
    </div>

    {/* ── Gallery ──────────────────────────────────────────────────────────── */}
    <SectionHead
      title="Gallery"
      description="All states and configurations."
    />

    {/* States */}
    <div style={{ marginBottom: '40px' }}>
      <BlockLabel>States — default · hover · focus · error · disabled</BlockLabel>
      <InfoBox>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>

          <div>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
              default — empty
            </div>
            <Textarea
              label="Private note"
              placeholder="Add a private note about this lead — won't be sent"
              value=""
              onChange={() => {}}
            />
          </div>

          <div>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
              default — filled
            </div>
            <Textarea
              label="Private note"
              placeholder="Add a private note about this lead — won't be sent"
              value="Customer called back after receiving our reply. Wants a quote next Tuesday — mention the first-visit discount."
              onChange={() => {}}
            />
          </div>

          <div>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
              hover — interact to see
            </div>
            <TextareaDemo
              label="Private note"
              placeholder="Add a private note about this lead — won't be sent"
            />
          </div>

          <div>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
              focus-visible — tab to see
            </div>
            <TextareaDemo
              label="Private note"
              placeholder="Add a private note about this lead — won't be sent"
            />
          </div>

          <div>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
              error
            </div>
            <Textarea
              label="Describe the issue"
              placeholder="What went wrong?"
              value="Too short."
              onChange={() => {}}
              error="Enter at least 20 characters so we can investigate"
            />
          </div>

          <div>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
              disabled
            </div>
            <Textarea
              label="Private note"
              placeholder="Add a private note about this lead — won't be sent"
              value="Upgrade to Pro to add private notes."
              onChange={() => {}}
              disabled
            />
          </div>

        </div>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
          color: 'var(--color-text-secondary)', margin: '24px 0 0 0',
        }}>
          Hover (border darkens) and focus-visible (border shifts to focus ring) are interaction-driven — interact
          with any textarea above to see them. Disabled applies{' '}
          <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>--opacity-disabled</code>{' '}
          (0.4) to the element — no disabled colour token. Error border + icon use --color-status-error-text
          (mode-aware surface token), not the badge fill --color-status-error.
        </p>
      </InfoBox>
    </div>

    {/* Auto-grow */}
    <div style={{ marginBottom: '40px' }}>
      <BlockLabel>Auto-grow — 3-row min · 8-row cap · resize handle persists</BlockLabel>
      <InfoBox>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px', alignItems: 'flex-start' }}>

          <div>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
              type to see growth · drag handle to go beyond cap
            </div>
            <TextareaDemo
              label="Private note"
              placeholder="Start typing to see auto-grow..."
              initialValue={AUTO_GROW_VALUE}
            />
          </div>

          <div style={{
            display: 'flex', flexDirection: 'column', gap: '12px',
            fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
            color: 'var(--color-text-secondary)',
          }}>
            <div>
              <strong style={{ color: 'var(--color-text-primary)' }}>Grows from 3 rows to 8 rows.</strong>{' '}
              As content wraps past the visible rows the box expands automatically, row by row.
              No scrollbar appears below the 8-row cap — the box grows instead.
            </div>
            <div>
              <strong style={{ color: 'var(--color-text-primary)' }}>Capped at 8 rows.</strong>{' '}
              Once the cap is reached, content scrolls internally. The cap prevents infinite expansion
              (the documented failure mode in Polaris auto-grow bugs #1391 and #104).
            </div>
            <div>
              <strong style={{ color: 'var(--color-text-primary)' }}>Resize handle remains.</strong>{' '}
              The native browser handle at the bottom-right stays active at all times. Users can drag
              past the 8-row cap manually — it is the secondary escape valve, not the primary path.
            </div>
            <div>
              <strong style={{ color: 'var(--color-text-primary)' }}>Instant, no animation.</strong>{' '}
              Height is a layout recalculation, not a CSS transition. No{' '}
              <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>transition: height</code>{' '}
              is applied — the change respects{' '}
              <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>prefers-reduced-motion</code>{' '}
              automatically.
            </div>
          </div>

        </div>
      </InfoBox>
    </div>

    {/* Counter */}
    <div style={{ marginBottom: '40px' }}>
      <BlockLabel>Character counter — under-limit · near-limit</BlockLabel>
      <InfoBox>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>

          <div>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
              showCounter · under-limit
            </div>
            <TextareaDemo
              label="Describe the issue"
              placeholder="What went wrong? Include steps to reproduce if possible."
              initialValue={COUNTER_UNDER_VALUE}
              showCounter
              maxLength={500}
            />
          </div>

          <div>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
              showCounter · near-limit
            </div>
            <TextareaDemo
              label="Describe the issue"
              placeholder="What went wrong? Include steps to reproduce if possible."
              initialValue={NEAR_LIMIT_VALUE}
              showCounter
              maxLength={500}
            />
          </div>

        </div>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
          color: 'var(--color-text-secondary)', margin: '16px 0 0 0',
        }}>
          Counter is informational only — the native{' '}
          <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>maxLength</code>{' '}
          attribute enforces the hard character limit. showCounter requires maxLength — it is silently ignored
          without it. Counter and error message can coexist: the counter stays right-aligned while the error
          fills the left. Both reference the textarea via{' '}
          <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>aria-describedby</code>{' '}
          with space-separated IDs.
        </p>
      </InfoBox>
    </div>

    {/* Resize callout */}
    <div style={{ marginBottom: '40px' }}>
      <BlockLabel>Resize handle — manual override beyond the auto-grow cap</BlockLabel>
      <InfoBox>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px', alignItems: 'flex-start' }}>

          <TextareaDemo
            label="Private note"
            placeholder="Drag the handle at the bottom-right corner to go beyond the 8-row cap"
          />

          <div style={{
            display: 'flex', flexDirection: 'column', gap: '12px',
            fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
            color: 'var(--color-text-secondary)',
          }}>
            <div>
              <strong style={{ color: 'var(--color-text-primary)' }}>resize: vertical only.</strong>{' '}
              Horizontal resize is disabled — it would break grid layouts. The native handle at the bottom-right
              lets users drag past the 8-row auto-grow cap; the width stays locked to the grid column.
            </div>
            <div>
              <strong style={{ color: 'var(--color-text-primary)' }}>min/max-height is token-computed.</strong>{' '}
              min-height: 3 rows · max-height: 8 rows.{' '}
              <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>calc(N * 1.5rem + 2 * var(--space-4))</code>{' '}
              for both — tokens only, no hardcoded px values.
            </div>
            <div>
              <strong style={{ color: 'var(--color-text-primary)' }}>Resize handle is the secondary path.</strong>{' '}
              Auto-grow handles normal use. The resize handle is the manual escape valve when users want more
              than 8 visible rows — not the primary mechanism, so it never disappears.
            </div>
            <div>
              <strong style={{ color: 'var(--color-text-primary)' }}>WCAG exception.</strong>{' '}
              The native resize handle is exempt from the 44×44px tap target rule per the WCAG User Agent
              Control exception (SC 2.5.5). No custom resize handle is needed.
            </div>
          </div>

        </div>
      </InfoBox>
    </div>

    <Divider />

    {/* ── Usage guide ──────────────────────────────────────────────────────── */}
    <SectionHead
      title="Usage guide"
      description="When to reach for Textarea and how to compose it correctly."
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
          Textarea vs Input
        </div>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
          color: 'var(--color-text-secondary)', margin: '0 0 16px 0',
        }}>
          Use <strong>Textarea</strong> when the expected value is a sentence or longer — private notes, bug
          reports, reply templates, address blocks. Use <strong>Input</strong> for single-line values: names,
          emails, phone numbers, URLs. Never put paragraph-length copy into a single-line Input.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <TextareaDemo label="Private note" placeholder="Add a private note about this lead — won't be sent" />
        </div>
      </InfoBox>

      <InfoBox>
        <div style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600,
          color: 'var(--color-text-primary)', marginBottom: '8px',
        }}>
          showCounter + maxLength
        </div>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
          color: 'var(--color-text-secondary)', margin: '0 0 16px 0',
        }}>
          Add <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>showCounter</code>{' '}
          whenever a hard length limit exists and the user benefits from knowing how close they are — bug
          reports, SMS reply templates. Always pair it with{' '}
          <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>maxLength</code> —
          showCounter is silently ignored without it.
        </p>
        <TextareaDemo
          label="Describe the issue"
          placeholder="What went wrong?"
          showCounter
          maxLength={500}
        />
      </InfoBox>

      <InfoBox>
        <div style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600,
          color: 'var(--color-text-primary)', marginBottom: '8px',
        }}>
          error copy
        </div>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
          color: 'var(--color-text-secondary)', margin: '0 0 16px 0',
        }}>
          Write errors in active voice: "Enter at least 20 characters so we can investigate" — not "Text is
          too short." The error announces via{' '}
          <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>role="alert"</code>{' '}
          on mount so screen readers hear it immediately. The component sets{' '}
          <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>aria-invalid="true"</code>{' '}
          automatically.
        </p>
        <Textarea
          label="Describe the issue"
          placeholder="What went wrong?"
          value="Too short."
          onChange={() => {}}
          error="Enter at least 20 characters so we can investigate"
        />
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
          Always provide{' '}
          <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>value</code>{' '}
          and{' '}
          <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>onChange</code>{' '}
          together. An uncontrolled Textarea (no value prop) will not update the character counter correctly
          and breaks the design system convention that all form controls are fully controlled.
        </p>
      </InfoBox>

      <InfoBox>
        <div style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600,
          color: 'var(--color-text-primary)', marginBottom: '8px',
        }}>
          No loading or read-only state
        </div>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
          color: 'var(--color-text-secondary)', margin: 0,
        }}>
          Textarea has no loading or read-only variant — excluded from scope (see DECISIONS.md). For read-only
          display of multi-line text, render the value in a{' '}
          <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>{'<p>'}</code>{' '}
          styled with the paragraph token. For async submission, disable the field and show a Spinner adjacent
          to the submit button.
        </p>
      </InfoBox>

    </div>

    <Divider />

    {/* ── Tokens reference table ────────────────────────────────────────────── */}
    <SectionHead
      title="Tokens"
      description="Every design token consumed by the Textarea component."
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

    {/* ── Props reference table ─────────────────────────────────────────────── */}
    <SectionHead
      title="Props"
      description="All props accepted by the Textarea component."
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

  </StoryFrame>
);
