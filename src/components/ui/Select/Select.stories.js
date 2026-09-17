import React, { useState } from 'react';
import { Select } from './Select.jsx';

// ─────────────────────────────────────────────────────────────────────────────
// META
// ─────────────────────────────────────────────────────────────────────────────

export default {
  title: 'Components/Select',
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
// INTERACTIVE WRAPPER — every demo below is a live, controlled <Select> so the
// Light/Dark toggle and the placeholder→filled colour flip are both real, not mocked.
// ─────────────────────────────────────────────────────────────────────────────

function SelectDemo({ initialValue = '', ...props }) {
  const [value, setValue] = useState(initialValue);
  return <Select value={value} onChange={(e) => setValue(e.target.value)} {...props} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// REALISTIC QUICKLO OPTION DATA
// ─────────────────────────────────────────────────────────────────────────────

const BUSINESS_TYPE_OPTIONS = [
  { label: 'Plumber', value: 'plumber' },
  { label: 'Electrician', value: 'electrician' },
  { label: 'HVAC technician', value: 'hvac' },
  { label: 'Dentist', value: 'dentist' },
  { label: 'Cleaner', value: 'cleaner' },
  { label: 'Gym', value: 'gym' },
  { label: 'Lawyer', value: 'lawyer' },
  { label: 'Other', value: 'other' },
];

const ISSUE_TYPE_OPTIONS = [
  { label: "Something's broken", value: 'broken' },
  { label: "A lead wasn't answered", value: 'missed-lead' },
  { label: 'Billing question', value: 'billing' },
  { label: 'Feature request', value: 'feature-request' },
  { label: 'Other', value: 'other' },
];

const DIGEST_TIME_OPTIONS = [
  { label: '7:00 AM', value: '07:00' },
  { label: '8:00 AM', value: '08:00' },
  { label: '9:00 AM', value: '09:00' },
  { label: '10:00 AM', value: '10:00' },
];

const CHANNEL_OPTIONS = [
  { label: 'SMS only', value: 'sms' },
  { label: 'Email only', value: 'email' },
  { label: 'SMS and email', value: 'sms-email' },
];

const PLATFORM_GROUPED_OPTIONS = [
  {
    label: 'Webhook-native',
    options: [
      { label: 'Webflow', value: 'webflow' },
      { label: 'Typeform', value: 'typeform' },
      { label: 'WordPress (Gravity Forms)', value: 'wordpress-gravity' },
      { label: 'HubSpot', value: 'hubspot' },
    ],
  },
  {
    label: 'Email-forward',
    options: [
      { label: 'Squarespace', value: 'squarespace' },
      { label: 'Wix', value: 'wix' },
      { label: 'GoDaddy', value: 'godaddy' },
      { label: 'Jimdo', value: 'jimdo' },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS — reference tables
// ─────────────────────────────────────────────────────────────────────────────

const PROPS = [
  {
    name: 'label',
    type: 'string',
    defaultVal: '—',
    description: 'Visible label above the field. Always required — use hideLabel to visually hide it when context is sufficient.',
  },
  {
    name: 'options',
    type: '{ label, value, disabled? }[] | { label, options: [...] }[]',
    defaultVal: '—',
    description: 'Flat array renders <option> elements directly. Grouped array (options.options is itself an array) renders native <optgroup> blocks.',
  },
  {
    name: 'value',
    type: 'string',
    defaultVal: 'undefined',
    description: 'Controlled value. An empty string, null, or undefined is treated as "no selection" and drives the placeholder text colour.',
  },
  {
    name: 'onChange',
    type: '(e: ChangeEvent) => void',
    defaultVal: 'undefined',
    description: 'Change handler for controlled usage. Receives the native select event — read e.target.value.',
  },
  {
    name: 'placeholder',
    type: 'string',
    defaultVal: 'undefined',
    description: 'Rendered as a disabled, hidden first <option value="">. Disappears from the list once a real value is chosen.',
  },
  {
    name: 'helperText',
    type: 'string',
    defaultVal: 'undefined',
    description: 'Guidance text below the field. Hidden when error is present — error always takes precedence.',
  },
  {
    name: 'error',
    type: 'string',
    defaultVal: 'undefined',
    description: 'Error message below the field. Sets aria-invalid="true" on the select and role="alert" on the message element. Replaces helperText.',
  },
  {
    name: 'size',
    type: "'md' | 'lg'",
    defaultVal: "'md'",
    description: 'Visual height: md 40px · lg 48px. md expands hit area to 44×44px below the lg breakpoint (1024px) via ::before on the field wrapper.',
  },
  {
    name: 'disabled',
    type: 'bool',
    defaultVal: 'false',
    description: 'Applies --opacity-disabled (0.4) and cursor: not-allowed to the field wrapper, plus the native disabled attribute on the select.',
  },
  {
    name: 'name',
    type: 'string',
    defaultVal: 'undefined',
    description: 'Form field name for native form submission and FormData access.',
  },
  {
    name: 'required',
    type: 'bool',
    defaultVal: 'false',
    description: 'Appends a red * after the label and sets the native required attribute on the select.',
  },
  {
    name: 'id',
    type: 'string',
    defaultVal: 'auto',
    description: 'HTML id for the select element. Auto-generated with useId() when omitted — label htmlFor is always kept in sync.',
  },
  {
    name: 'hideLabel',
    type: 'bool',
    defaultVal: 'false',
    description: 'Applies sr-only to the label element. Must always be paired with an explicit aria-label prop — a dev warning fires if omitted.',
  },
  {
    name: 'aria-label',
    type: 'string',
    defaultVal: 'undefined',
    description: 'Required whenever hideLabel is true — provides the accessible name that the visible label would otherwise supply.',
  },
];

const TOKENS = [
  { token: '--color-bg-input', value: '#f3f3f3 / #171717', usage: 'Field fill, both sizes' },
  { token: '--color-border-default', value: '#dddddd / #2a2a2a', usage: 'Resting border' },
  { token: '--color-border-strong', value: '#adadad / #555555', usage: 'Hover border (pointer devices only, suppressed during focus/error/disabled)' },
  { token: '--color-focus-ring', value: '→ #c2410c / → #fb923c', usage: 'Focus-visible border colour — no box-shadow ring' },
  { token: '--color-status-error-text', value: '#831414 / #df9797', usage: 'Error border, AlertCircle icon, and error message text' },
  { token: '--radius-sm', value: '8px', usage: 'Field corner radius, both sizes' },
  { token: '--text-body-lg', value: '1rem', usage: 'Select value font size — mandatory iOS-zoom prevention floor' },
  { token: '--duration-fast', value: '100ms', usage: 'Chevron rotation on open (best-effort), paired with --ease-default — not --ease-spring, that curve is reserved for Toggle/Checkbox' },
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
        Select
      </h1>
      <p style={{
        fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 400,
        lineHeight: '1.75rem', color: 'var(--color-text-secondary)', margin: 0,
      }}>
        A styled native &lt;select&gt; — single-select only, no search, no custom listbox. 2 sizes · 6 states.
        Shares Input's exact fill, border, focus, and error tokens; the chevron rotates on open (best-effort) and the native option popup now themes dark under this story's Dark toggle.
      </p>
    </div>

    {/* ── Gallery ──────────────────────────────────────────────────────────── */}
    <SectionHead
      title="Gallery"
      description="Sizes, states, the placeholder-vs-filled text colour flip, and grouped options."
    />

    {/* Sizes */}
    <div style={{ marginBottom: '40px' }}>
      <BlockLabel>Sizes — md · lg</BlockLabel>
      <InfoBox>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div>
            <div style={{
              fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem',
              color: 'var(--color-text-secondary)', marginBottom: '8px',
            }}>
              size="md" — 40px
            </div>
            <SelectDemo
              label="Business type"
              size="md"
              placeholder="Select your business type"
              options={BUSINESS_TYPE_OPTIONS}
            />
          </div>
          <div>
            <div style={{
              fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem',
              color: 'var(--color-text-secondary)', marginBottom: '8px',
            }}>
              size="lg" — 48px
            </div>
            <SelectDemo
              label="Business type"
              size="lg"
              placeholder="Select your business type"
              options={BUSINESS_TYPE_OPTIONS}
            />
          </div>
        </div>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
          color: 'var(--color-text-secondary)', margin: '16px 0 0 0',
        }}>
          Hover (border darkens) and focus (focus ring + border) are CSS-driven — interact with either field above to see them.
          Click either field to open its native picker — the chevron rotates 180deg while open (best-effort tracking; a native &lt;select&gt; has no reliable cross-browser open/close event). Switch to Dark above first, then open a field — the option popup itself now renders with dark chrome (background and text) instead of a stray white popup, via the select's color-scheme hint.
        </p>
      </InfoBox>
    </div>

    {/* States */}
    <div style={{ marginBottom: '40px' }}>
      <BlockLabel>States — default · helper text · error · disabled</BlockLabel>
      <InfoBox>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <SelectDemo
            label="Issue type"
            placeholder="Select an issue type"
            options={ISSUE_TYPE_OPTIONS}
          />
          <SelectDemo
            label="Daily digest time"
            placeholder="Select a time"
            options={DIGEST_TIME_OPTIONS}
            helperText="We'll send your daily lead summary at this time"
          />
          <SelectDemo
            label="Issue type"
            placeholder="Select an issue type"
            options={ISSUE_TYPE_OPTIONS}
            error="Select an issue type before submitting"
          />
          <SelectDemo
            label="Notification channel"
            options={CHANNEL_OPTIONS}
            initialValue="sms-email"
            disabled
          />
        </div>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
          color: 'var(--color-text-secondary)', margin: '16px 0 0 0',
        }}>
          error replaces helperText — both resolve to the same message slot. Disabled applies{' '}
          <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>--opacity-disabled</code>{' '}
          (0.4) plus cursor: not-allowed — no disabled colour token.
        </p>
      </InfoBox>
    </div>

    {/* Placeholder vs filled */}
    <div style={{ marginBottom: '40px' }}>
      <BlockLabel>Placeholder vs filled — text colour only</BlockLabel>
      <InfoBox>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div>
            <div style={{
              fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem',
              color: 'var(--color-text-secondary)', marginBottom: '8px',
            }}>
              value="" — placeholder shown
            </div>
            <SelectDemo
              label="Business type"
              placeholder="Select your business type"
              options={BUSINESS_TYPE_OPTIONS}
            />
          </div>
          <div>
            <div style={{
              fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem',
              color: 'var(--color-text-secondary)', marginBottom: '8px',
            }}>
              value="plumber" — filled
            </div>
            <SelectDemo
              label="Business type"
              placeholder="Select your business type"
              options={BUSINESS_TYPE_OPTIONS}
              initialValue="plumber"
            />
          </div>
        </div>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
          color: 'var(--color-text-secondary)', margin: '16px 0 0 0',
        }}>
          Placeholder text uses <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>--color-text-secondary</code>;
          a selected value switches to <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>--color-text-primary</code>.
          The flip is driven by component state (is value empty?), not the CSS <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>:invalid</code> pseudo-class,
          so it works whether or not <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>required</code> is set. Pick a value in the left field to watch it flip.
        </p>
      </InfoBox>
    </div>

    {/* Grouped options */}
    <div style={{ marginBottom: '40px' }}>
      <BlockLabel>Grouped options — native &lt;optgroup&gt;</BlockLabel>
      <InfoBox>
        <div style={{ maxWidth: '360px' }}>
          <SelectDemo
            label="Connect a platform"
            placeholder="Select your platform"
            options={PLATFORM_GROUPED_OPTIONS}
          />
        </div>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
          color: 'var(--color-text-secondary)', margin: '16px 0 0 0',
        }}>
          Passing <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>{'{ label: groupLabel, options: [...] }'}</code> instead
          of <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>{'{ label, value }'}</code> renders a native <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>&lt;optgroup&gt;</code>.
          Used here for the connections platform picker — "Webhook-native" platforms send leads instantly, "Email-forward" platforms route through an inbox first.
        </p>
      </InfoBox>
    </div>

    <Divider />

    {/* ── Usage guide ──────────────────────────────────────────────────────── */}
    <SectionHead
      title="Usage guide"
      description="When to reach for Select, and when a different control fits better."
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
          Native only — no custom popover
        </div>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
          color: 'var(--color-text-secondary)', margin: 0,
        }}>
          Select always renders a real &lt;select&gt;. This gives free OS-native mobile pickers, full keyboard
          support, and typeahead — critical for a non-technical, often-gloved, mobile-first user on a job site.
        </p>
      </InfoBox>

      <InfoBox>
        <div style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600,
          color: 'var(--color-text-primary)', marginBottom: '8px',
        }}>
          Fewer than ~5 options with room to spare: use a radio group or tiles
        </div>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
          color: 'var(--color-text-secondary)', margin: 0,
        }}>
          A Select hides every option behind a tap. When there are roughly fewer than 5 choices and vertical space
          allows it, a radio group or a tile layout (see the Communication tone tiles in onboarding) shows every
          option at once and needs one fewer tap to choose — Polaris, Primer, and Carbon all give this guidance.
        </p>
      </InfoBox>

      <InfoBox>
        <div style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600,
          color: 'var(--color-text-primary)', marginBottom: '8px',
        }}>
          Searchable or free-text: not this component
        </div>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
          color: 'var(--color-text-secondary)', margin: 0,
        }}>
          The onboarding "Business type" field needs search-as-you-type plus a free-text "Other" fallback. That
          behaviour is explicitly out of scope for Select — it belongs to a future Combobox component, not a
          native &lt;select&gt;, which cannot support search.
        </p>
      </InfoBox>

      <InfoBox>
        <div style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600,
          color: 'var(--color-text-primary)', marginBottom: '8px',
        }}>
          Multi-value filtering: use FilterPill
        </div>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
          color: 'var(--color-text-secondary)', margin: 0,
        }}>
          Select is single-select only — choosing a new value replaces the old one. Filtering a list by multiple
          simultaneous criteria (status, date range, tags) is FilterPill's job, not Select's.
        </p>
      </InfoBox>

      <InfoBox>
        <div style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600,
          color: 'var(--color-text-primary)', marginBottom: '8px',
        }}>
          Group related options with optgroup
        </div>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
          color: 'var(--color-text-secondary)', margin: 0,
        }}>
          When options fall into natural categories — like the platform picker's "Webhook-native" vs
          "Email-forward" — pass a grouped options array rather than flattening everything into one list.
        </p>
      </InfoBox>

      <InfoBox>
        <div style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600,
          color: 'var(--color-text-primary)', marginBottom: '8px',
        }}>
          error vs helperText
        </div>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
          color: 'var(--color-text-secondary)', margin: 0,
        }}>
          Use helperText for contextual guidance before submission. Use error after failed validation — it
          replaces helperText, sets aria-invalid="true", and announces via role="alert".
        </p>
      </InfoBox>
    </div>

    <Divider />

    {/* ── Reference table ──────────────────────────────────────────────────── */}
    <SectionHead
      title="Reference table"
      description="All props accepted by the Select component, and the design tokens it consumes."
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
