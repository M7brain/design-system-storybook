import React, { useState } from 'react';
import { Input } from './Input.jsx';

// ─────────────────────────────────────────────────────────────────────────────
// META
// ─────────────────────────────────────────────────────────────────────────────

export default {
  title: 'Components/Inputs',
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

function PasswordDemo(props) {
  const [value, setValue] = useState('');
  return (
    <Input
      type="password"
      value={value}
      onChange={e => setValue(e.target.value)}
      {...props}
    />
  );
}

function SearchDemo(props) {
  const [value, setValue] = useState('');
  return (
    <Input
      type="search"
      value={value}
      onChange={e => setValue(e.target.value)}
      onClear={() => setValue('')}
      {...props}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const SIZES = ['md', 'lg'];
const SIZE_INFO = { md: '40px', lg: '48px' };

const TYPES = ['text', 'email', 'tel', 'password', 'search'];
const TYPE_LABEL = {
  text: 'Full name',
  email: 'Email address',
  tel: 'Phone number',
  password: 'Password',
  search: 'Search leads',
};
const TYPE_PLACEHOLDER = {
  text: 'Enter your name',
  email: 'name@company.com',
  tel: '(555) 000-0000',
  password: 'Enter password',
  search: 'Search leads...',
};

const PROPS = [
  {
    name: 'label',
    type: 'string',
    defaultVal: '—',
    description: 'Visible label above the field. Always required — use hideLabel to visually hide it when context is sufficient.',
  },
  {
    name: 'hideLabel',
    type: 'bool',
    defaultVal: 'false',
    description: 'Applies sr-only to the label element. Must always be paired with an explicit aria-label prop — a dev warning fires if omitted.',
  },
  {
    name: 'optional',
    type: 'bool',
    defaultVal: 'false',
    description: 'Appends "(optional)" in tertiary text after the label. Use when most fields in the form are required.',
  },
  {
    name: 'required',
    type: 'bool',
    defaultVal: 'false',
    description: 'Appends a red * after the label and sets the native required attribute on the input.',
  },
  {
    name: 'type',
    type: "'text' | 'email' | 'tel' | 'password' | 'search'",
    defaultVal: "'text'",
    description: "Underlying input type. 'password' adds a show/hide toggle. 'search' auto-injects the Search leading icon.",
  },
  {
    name: 'size',
    type: "'md' | 'lg'",
    defaultVal: "'md'",
    description: 'Visual height: md 40px · lg 48px. md expands hit area to 44×44px below lg breakpoint (1024px) via ::before on the field wrapper.',
  },
  {
    name: 'value',
    type: 'string',
    defaultVal: 'undefined',
    description: 'Controlled value. Required for the search clear button — it only renders when onClear is defined AND value is truthy.',
  },
  {
    name: 'onChange',
    type: '(e: ChangeEvent) => void',
    defaultVal: 'undefined',
    description: 'Change handler for controlled usage. Receives the native input event — read e.target.value.',
  },
  {
    name: 'placeholder',
    type: 'string',
    defaultVal: 'undefined',
    description: 'Placeholder hint text. Never use as a substitute for a label — placeholder disappears when the field has a value.',
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
    description: 'Error message below the field. Sets aria-invalid="true" on the input and role="alert" on the message element. Replaces helperText.',
  },
  {
    name: 'disabled',
    type: 'bool',
    defaultVal: 'false',
    description: 'Applies --opacity-disabled (0.4) and blocks pointer events on the field wrapper. No disabled colour token — opacity only.',
  },
  {
    name: 'leadingIcon',
    type: 'string',
    defaultVal: 'undefined',
    description: "Approved icon name from icons/index.js. Ignored when type='search' — Search icon is always used in that case.",
  },
  {
    name: 'onClear',
    type: '() => void',
    defaultVal: 'undefined',
    description: "Wires the clear (×) button for type='search'. Button only renders when onClear is defined AND value is truthy.",
  },
  {
    name: 'id',
    type: 'string',
    defaultVal: 'auto',
    description: 'HTML id for the input element. Auto-generated with useId() when omitted — label htmlFor is always kept in sync.',
  },
  {
    name: 'name',
    type: 'string',
    defaultVal: 'undefined',
    description: 'Form field name for native form submission and FormData access.',
  },
  {
    name: 'className',
    type: 'string',
    defaultVal: 'undefined',
    description: 'Appended to the outer flex container div. Use for layout-level overrides — always reference token variables, never hex.',
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
        Input
      </h1>
      <p style={{
        fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 400,
        lineHeight: '1.75rem', color: 'var(--color-text-secondary)', margin: 0,
      }}>
        Single-line text entry. 5 types · 2 sizes · 7 states. Accessible label, error, and helper text built in.
        Resting border: --color-border-default (lighter visual weight — deliberate design trade below WCAG 1.4.11 3:1; see DECISIONS.md). Hover: --color-border-strong, suppressed during focus-within. Error border + icon: --color-status-error-text (surface-level token, not badge fill).
      </p>
    </div>

    {/* ── Gallery ──────────────────────────────────────────────────────────── */}
    <SectionHead
      title="Gallery"
      description="All types, sizes, label variants, states, and interaction patterns."
    />

    {/* Types × Sizes */}
    <div style={{ marginBottom: '40px' }}>
      <BlockLabel>Types × sizes</BlockLabel>
      <InfoBox>
        {/* Column headers */}
        <div style={{
          display: 'grid', gridTemplateColumns: '100px 1fr 1fr',
          gap: '16px', marginBottom: '20px', alignItems: 'center',
        }}>
          <div />
          {SIZES.map(size => (
            <div key={size} style={{
              fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 500,
              textTransform: 'uppercase', letterSpacing: '0.06em',
              color: 'var(--color-text-secondary)',
            }}>
              {size} · {SIZE_INFO[size]}
            </div>
          ))}
        </div>
        {/* Rows */}
        {TYPES.map(type => (
          <div key={type} style={{
            display: 'grid', gridTemplateColumns: '100px 1fr 1fr',
            gap: '16px', marginBottom: '16px', alignItems: 'center',
          }}>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              {type}
            </div>
            {SIZES.map(size => (
              <Input
                key={size}
                type={type}
                size={size}
                label={TYPE_LABEL[type]}
                hideLabel
                aria-label={TYPE_LABEL[type]}
                placeholder={TYPE_PLACEHOLDER[type]}
              />
            ))}
          </div>
        ))}
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
          color: 'var(--color-text-secondary)', margin: '16px 0 0 0',
        }}>
          type="search" auto-injects the Search icon — leadingIcon is ignored. type="password" renders a show/hide toggle button.
          Hover (border darkens) and focus (focus ring + border) are CSS-driven — interact with any field above to see them.
        </p>
      </InfoBox>
    </div>

    {/* States */}
    <div style={{ marginBottom: '40px' }}>
      <BlockLabel>States — default · helperText · error · disabled</BlockLabel>
      <InfoBox>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <Input
            label="Full name"
            placeholder="Enter your name"
          />
          <Input
            label="Business name"
            placeholder="e.g. Acme Plumbing"
            helperText="Used in your outgoing SMS signature"
          />
          <Input
            label="Phone number"
            type="tel"
            placeholder="(555) 000-0000"
            error="Enter a valid US phone number"
          />
          <Input
            label="Email address"
            type="email"
            placeholder="name@company.com"
            disabled
          />
        </div>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
          color: 'var(--color-text-secondary)', margin: '16px 0 0 0',
        }}>
          error replaces helperText — both resolve to the same message slot. Disabled applies{' '}
          <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>--opacity-disabled</code>{' '}
          (0.4) only — no disabled colour token.
        </p>
      </InfoBox>
    </div>

    {/* Label variants */}
    <div style={{ marginBottom: '40px' }}>
      <BlockLabel>Label variants — default · optional · required · hideLabel</BlockLabel>
      <InfoBox>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div>
            <div style={{
              fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem',
              color: 'var(--color-text-secondary)', marginBottom: '8px',
            }}>
              default
            </div>
            <Input label="Business name" placeholder="e.g. Acme Plumbing" />
          </div>
          <div>
            <div style={{
              fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem',
              color: 'var(--color-text-secondary)', marginBottom: '8px',
            }}>
              optional={'{true}'}
            </div>
            <Input label="Website" optional placeholder="https://example.com" />
          </div>
          <div>
            <div style={{
              fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem',
              color: 'var(--color-text-secondary)', marginBottom: '8px',
            }}>
              required={'{true}'}
            </div>
            <Input label="Owner's email" required type="email" placeholder="name@company.com" />
          </div>
          <div>
            <div style={{
              fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem',
              color: 'var(--color-text-secondary)', marginBottom: '8px',
            }}>
              hideLabel={'{true}'} · aria-label required
            </div>
            <Input
              label="Search leads"
              hideLabel
              aria-label="Search leads"
              type="search"
              placeholder="Search leads..."
            />
          </div>
        </div>
      </InfoBox>
    </div>

    {/* Leading icon */}
    <div style={{ marginBottom: '40px' }}>
      <BlockLabel>Leading icon — leadingIcon prop + auto-injected on search</BlockLabel>
      <InfoBox>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <Input label="Phone number" type="tel" leadingIcon="Phone" placeholder="(555) 000-0000" />
          <Input label="Email address" type="email" leadingIcon="Mail" placeholder="name@company.com" />
          <Input label="Business name" leadingIcon="Building2" placeholder="e.g. Acme Plumbing" />
          <Input label="Website" leadingIcon="Globe" placeholder="https://example.com" />
        </div>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
          color: 'var(--color-text-secondary)', margin: '16px 0 0 0',
        }}>
          leadingIcon accepts any approved icon name from{' '}
          <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>src/design-system/icons/index.js</code>.
          type="search" always injects the Search icon — leadingIcon is silently ignored on that type.
        </p>
      </InfoBox>
    </div>

    {/* Password — interactive */}
    <div style={{ marginBottom: '40px' }}>
      <BlockLabel>Password — show/hide toggle (interactive)</BlockLabel>
      <InfoBox>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div>
            <div style={{
              fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem',
              color: 'var(--color-text-secondary)', marginBottom: '8px',
            }}>
              type="password" · md
            </div>
            <PasswordDemo label="Password" placeholder="Enter password" />
          </div>
          <div>
            <div style={{
              fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem',
              color: 'var(--color-text-secondary)', marginBottom: '8px',
            }}>
              type="password" · lg
            </div>
            <PasswordDemo label="Password" size="lg" placeholder="Enter password" />
          </div>
        </div>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
          color: 'var(--color-text-secondary)', margin: '16px 0 0 0',
        }}>
          Type into either field, then click the Eye icon to reveal the value. The toggle's aria-label updates
          between "Show password" and "Hide password". No external prop required — show/hide state is fully internal.
        </p>
      </InfoBox>
    </div>

    {/* Search — interactive */}
    <div style={{ marginBottom: '40px' }}>
      <BlockLabel>Search — clear button (interactive)</BlockLabel>
      <InfoBox>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div>
            <div style={{
              fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem',
              color: 'var(--color-text-secondary)', marginBottom: '8px',
            }}>
              type="search" + onClear · md
            </div>
            <SearchDemo label="Search leads" placeholder="Search leads..." />
          </div>
          <div>
            <div style={{
              fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem',
              color: 'var(--color-text-secondary)', marginBottom: '8px',
            }}>
              type="search" + onClear · lg
            </div>
            <SearchDemo label="Search leads" size="lg" placeholder="Search leads..." />
          </div>
        </div>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
          color: 'var(--color-text-secondary)', margin: '16px 0 0 0',
        }}>
          Type into either field to see the clear button appear. It only renders when{' '}
          <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>onClear</code> is defined
          AND <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>value</code> is truthy —
          search fields must use controlled input with explicit clear handling.
        </p>
      </InfoBox>
    </div>

    <Divider />

    {/* ── Touch target ─────────────────────────────────────────────────────── */}
    <SectionHead
      title="Touch target"
      description="md (40px) expands its hit area to 44×44px below the lg breakpoint (1024px) via a ::before pseudo-element on the field wrapper div — meeting WCAG 2.5.5 AA on mobile. lg (48px) already exceeds 44px natively. The dashed annotations below are always visible in Storybook; the breakpoint collapse is runtime-only."
    />

    <div style={{ marginBottom: '40px' }}>
      <InfoBox style={{ display: 'flex', gap: '64px', alignItems: 'flex-start', flexWrap: 'wrap', padding: '40px 24px' }}>

        {/* md */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <div style={{ position: 'relative', width: '200px' }}>
            <Input
              label="Field label"
              hideLabel
              aria-label="Touch target demo md"
              size="md"
              placeholder="md — 40px"
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
              md — 40px visual
            </div>
            <div style={{
              fontFamily: 'Inter, sans-serif', fontSize: '0.75rem',
              color: 'var(--color-text-secondary)', marginBottom: '4px',
            }}>
              ::before expands hit area to 44×44px
            </div>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'var(--color-status-warning-text)' }}>
              collapses at lg (1024px+)
            </div>
          </div>
        </div>

        {/* lg */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <div style={{ position: 'relative', width: '200px' }}>
            <Input
              label="Field label"
              hideLabel
              aria-label="Touch target demo lg"
              size="lg"
              placeholder="lg — 48px"
            />
            <div aria-hidden="true" style={{
              position: 'absolute',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '48px', height: '48px',
              border: '1.5px solid var(--color-status-success)',
              borderRadius: '4px', pointerEvents: 'none',
            }} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem',
              color: 'var(--color-text-primary)', marginBottom: '4px',
            }}>
              lg — 48px visual
            </div>
            <div style={{
              fontFamily: 'Inter, sans-serif', fontSize: '0.75rem',
              color: 'var(--color-text-secondary)', marginBottom: '4px',
            }}>
              Already ≥44px — no expansion needed
            </div>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'var(--color-status-success-text)' }}>
              WCAG 2.5.5 AA met natively
            </div>
          </div>
        </div>

      </InfoBox>
    </div>

    {/* Search clear exception */}
    <div style={{ marginBottom: '40px' }}>
      <BlockLabel>Search clear button — accepted size exception</BlockLabel>
      <InfoBox>
        <div style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600,
          color: 'var(--color-text-primary)', marginBottom: '8px',
        }}>
          The clear (×) button on search is 24×24px — below the 44px WCAG 2.5.5 minimum.
        </div>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
          color: 'var(--color-text-secondary)', margin: 0,
        }}>
          This is a deliberate, accepted exception. The clear action is low-risk and reversible — accidental taps
          are undone by re-typing. The button sits inside the field wrapper which already provides a 44×44px
          wrapper-level touch area via ::before. Expanding the clear button to 44px would collapse the visible
          input text area, making the field unusable on mobile.
        </p>
      </InfoBox>
    </div>

    <Divider />

    {/* ── Usage guide ──────────────────────────────────────────────────────── */}
    <SectionHead
      title="Usage guide"
      description="When to reach for each size, type, and pattern."
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
          md vs lg
        </div>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
          color: 'var(--color-text-secondary)', margin: '0 0 16px 0',
        }}>
          Use <strong>md</strong> (40px) for all standard dashboard forms. Use <strong>lg</strong> (48px) for
          mobile-first views and onboarding flows where the input is the primary focus of the screen.
          Font size is 1rem on both sizes — never reduce below 1rem on inputs (prevents iOS zoom).
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Input label="md — standard form" size="md" placeholder="Business name" />
          <Input label="lg — prominent / mobile" size="lg" placeholder="Business name" />
        </div>
      </InfoBox>

      <InfoBox>
        <div style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600,
          color: 'var(--color-text-primary)', marginBottom: '8px',
        }}>
          Always use semantic type
        </div>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
          color: 'var(--color-text-secondary)', margin: '0 0 16px 0',
        }}>
          type="email" and type="tel" unlock the correct keyboard on mobile and enable browser autocomplete.
          type="search" activates the clear button pattern and injects the Search icon. Never use type="text"
          for an email field or phone field.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Input label="Owner email" type="email" placeholder="name@company.com" />
          <Input label="Contact phone" type="tel" placeholder="(555) 000-0000" />
        </div>
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
          color: 'var(--color-text-secondary)', margin: '0 0 16px 0',
        }}>
          Use <strong>helperText</strong> for contextual guidance before submission. Use <strong>error</strong> after
          failed validation — it replaces helperText, sets aria-invalid="true", and announces via role="alert".
          Error messages must use active voice ("Enter a valid phone number", not "Phone number is invalid").
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Input label="Business name" helperText="Used in your outgoing SMS signature" placeholder="Acme Plumbing" />
          <Input label="Phone number" type="tel" error="Enter a valid US phone number" placeholder="(555) 000-0000" />
        </div>
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
          Use hideLabel when surrounding context makes the visible label redundant — e.g. a search field inside a
          panel already titled "Search". Always pair with an explicit aria-label prop.
          A dev warning fires if hideLabel is true and aria-label is absent.
        </p>
      </InfoBox>

      <InfoBox>
        <div style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600,
          color: 'var(--color-text-primary)', marginBottom: '8px',
        }}>
          leadingIcon
        </div>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
          color: 'var(--color-text-secondary)', margin: '0 0 16px 0',
        }}>
          Add a leading icon when it reinforces the field's semantic purpose — a Phone icon on a phone field, a
          Mail icon on an email field. Avoid decorative icons that don't add meaning. The icon is rendered at
          size="md" (20px) and is aria-hidden.
        </p>
        <Input label="Contact phone" type="tel" leadingIcon="Phone" placeholder="(555) 000-0000" />
      </InfoBox>

      <InfoBox>
        <div style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600,
          color: 'var(--color-text-primary)', marginBottom: '8px',
        }}>
          required vs optional
        </div>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
          color: 'var(--color-text-secondary)', margin: 0,
        }}>
          Mark required fields with required={'{true}'} — never rely on placeholder text. Use optional={'{true}'}
          only when most fields in the form are required and the exception needs signalling. If all fields are
          required, omit both — marking everything is noise.
        </p>
      </InfoBox>
    </div>

    <Divider />

    {/* ── Reference table ──────────────────────────────────────────────────── */}
    <SectionHead
      title="Reference table"
      description="All props accepted by the Input component."
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

    {/* ── Do / Don't ───────────────────────────────────────────────────────── */}
    <SectionHead
      title="Do / Don't"
      description="Common misuse patterns and their correct counterparts."
    />

    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '16px',
      marginBottom: '40px',
    }}>

      {/* Do: semantic type */}
      <InfoBox>
        <div style={{
          display: 'inline-block',
          fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 500,
          textTransform: 'uppercase', letterSpacing: '0.04em',
          color: 'var(--color-status-success-text)',
          background: 'var(--color-status-success-bg)',
          borderRadius: 'var(--radius-xs)',
          padding: '2px 8px', marginBottom: '12px',
        }}>
          Do
        </div>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
          color: 'var(--color-text-secondary)', margin: '0 0 12px 0',
        }}>
          Use the correct semantic type. Unlocks the right keyboard on mobile and enables browser autocomplete.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Input label="Email" type="email" placeholder="name@company.com" />
          <Input label="Phone" type="tel" placeholder="(555) 000-0000" />
        </div>
      </InfoBox>

      {/* Don't: type="text" for everything */}
      <InfoBox>
        <div style={{
          display: 'inline-block',
          fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 500,
          textTransform: 'uppercase', letterSpacing: '0.04em',
          color: 'var(--color-status-error-text)',
          background: 'var(--color-status-error-bg)',
          borderRadius: 'var(--radius-xs)',
          padding: '2px 8px', marginBottom: '12px',
        }}>
          Don't
        </div>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
          color: 'var(--color-text-secondary)', margin: '0 0 12px 0',
        }}>
          Use type="text" for email or phone fields. Loses mobile keyboard optimisation and autocomplete hints.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Input label="Email" type="text" placeholder="name@company.com" />
          <Input label="Phone" type="text" placeholder="(555) 000-0000" />
        </div>
      </InfoBox>

      {/* Do: descriptive active-voice error */}
      <InfoBox>
        <div style={{
          display: 'inline-block',
          fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 500,
          textTransform: 'uppercase', letterSpacing: '0.04em',
          color: 'var(--color-status-success-text)',
          background: 'var(--color-status-success-bg)',
          borderRadius: 'var(--radius-xs)',
          padding: '2px 8px', marginBottom: '12px',
        }}>
          Do
        </div>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
          color: 'var(--color-text-secondary)', margin: '0 0 12px 0',
        }}>
          Write errors in active voice. Tell the user what to do — not what went wrong.
        </p>
        <Input label="Phone number" type="tel" error="Enter a valid US phone number" placeholder="(555) 000-0000" />
      </InfoBox>

      {/* Don't: vague error */}
      <InfoBox>
        <div style={{
          display: 'inline-block',
          fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 500,
          textTransform: 'uppercase', letterSpacing: '0.04em',
          color: 'var(--color-status-error-text)',
          background: 'var(--color-status-error-bg)',
          borderRadius: 'var(--radius-xs)',
          padding: '2px 8px', marginBottom: '12px',
        }}>
          Don't
        </div>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
          color: 'var(--color-text-secondary)', margin: '0 0 12px 0',
        }}>
          Use single-word errors ("Invalid", "Error") or passive voice ("Phone number was not valid").
          They fail WCAG 3.3.1 and increase support contact rate.
        </p>
        <Input label="Phone number" type="tel" error="Invalid" placeholder="(555) 000-0000" />
      </InfoBox>

      {/* Do: placeholder text is supplementary */}
      <InfoBox>
        <div style={{
          display: 'inline-block',
          fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 500,
          textTransform: 'uppercase', letterSpacing: '0.04em',
          color: 'var(--color-status-success-text)',
          background: 'var(--color-status-success-bg)',
          borderRadius: 'var(--radius-xs)',
          padding: '2px 8px', marginBottom: '12px',
        }}>
          Do
        </div>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
          color: 'var(--color-text-secondary)', margin: '0 0 12px 0',
        }}>
          Use placeholder as a supplementary hint — an example value or format. The label carries the accessible name.
        </p>
        <Input label="Owner email" type="email" placeholder="name@company.com" />
      </InfoBox>

      {/* Don't: placeholder as label */}
      <InfoBox>
        <div style={{
          display: 'inline-block',
          fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 500,
          textTransform: 'uppercase', letterSpacing: '0.04em',
          color: 'var(--color-status-error-text)',
          background: 'var(--color-status-error-bg)',
          borderRadius: 'var(--radius-xs)',
          padding: '2px 8px', marginBottom: '12px',
        }}>
          Don't
        </div>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
          color: 'var(--color-text-secondary)', margin: '0 0 12px 0',
        }}>
          Use hideLabel to replace the label with a placeholder. Placeholder disappears on input — leaving
          filled fields unlabelled and screen-reader-inaccessible.
        </p>
        <Input
          label="Owner email"
          hideLabel
          aria-label="Owner email"
          type="email"
          placeholder="Owner email"
        />
      </InfoBox>

    </div>

  </StoryFrame>
);
