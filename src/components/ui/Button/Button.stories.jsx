import React, { useState } from 'react';
import { Button } from './Button.jsx';

// ─────────────────────────────────────────────────────────────────────────────
// META
// ─────────────────────────────────────────────────────────────────────────────

export default {
  title: 'Components/Buttons',
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
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const VARIANTS = ['primary', 'secondary', 'destructive', 'ghost'];
const SIZES = ['sm', 'md', 'lg'];

const VARIANT_LABEL = {
  primary: 'Save changes',
  secondary: 'Cancel',
  destructive: 'Delete account',
  ghost: 'Learn more',
};

const SIZE_INFO = {
  sm: '36px',
  md: '40px',
  lg: '48px',
};

const PROPS = [
  {
    name: 'variant',
    type: "'primary' | 'secondary' | 'destructive' | 'ghost'",
    defaultVal: "'primary'",
    description: 'Visual style and semantic role. Use one primary per view maximum.',
  },
  {
    name: 'size',
    type: "'sm' | 'md' | 'lg'",
    defaultVal: "'md'",
    description: 'Visual height: sm 36px · md 40px · lg 48px. sm and md expand hit area to 44×44px below lg (1024px) via ::before.',
  },
  {
    name: 'loading',
    type: 'bool',
    defaultVal: 'false',
    description: 'Spinner replaces label (content becomes visibility:hidden, width preserved). Sets disabled and aria-busy.',
  },
  {
    name: 'disabled',
    type: 'bool',
    defaultVal: 'false',
    description: 'Applies --opacity-disabled (0.4) and blocks pointer events. No disabled colour token — opacity only.',
  },
  {
    name: 'fullWidth',
    type: 'bool',
    defaultVal: 'false',
    description: 'Stretches to fill its container (w-full). Use for mobile bottom sheets and full-bleed form footers.',
  },
  {
    name: 'leftIcon',
    type: 'string',
    defaultVal: 'undefined',
    description: 'Approved icon name from icons/index.js. Renders at size="md" (20px) to the left of children. Gap between icon and label: 8px (--space-2).',
  },
  {
    name: 'rightIcon',
    type: 'string',
    defaultVal: 'undefined',
    description: 'Approved icon name from icons/index.js. Renders at size="md" (20px) to the right of children. Gap between icon and label: 8px (--space-2).',
  },
  {
    name: 'asChild',
    type: 'bool',
    defaultVal: 'false',
    description: 'Merges all props onto the immediate child via Radix Slot.Root. Use with Next.js Link for accessible anchor buttons.',
  },
  {
    name: 'children',
    type: 'ReactNode',
    defaultVal: '—',
    description: 'Button label. Hidden with visibility:hidden during loading so button width does not collapse.',
  },
  {
    name: 'className',
    type: 'string',
    defaultVal: 'undefined',
    description: 'Appended to the CVA class list. Use for one-off overrides — always reference token variables, never hex.',
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
        Button
      </h1>
      <p style={{
        fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 400,
        lineHeight: '1.75rem', color: 'var(--color-text-secondary)', margin: 0,
      }}>
        Interactive trigger for primary, secondary, destructive, and ghost actions.
        4 variants · 3 sizes · 6 states. Built on class-variance-authority with Radix Slot support.
      </p>
    </div>

    {/* ── Gallery ──────────────────────────────────────────────────────────── */}
    <SectionHead
      title="Gallery"
      description="Every variant at every size, with icon combinations and all controllable states."
    />

    {/* Variants × Sizes */}
    <div style={{ marginBottom: '40px' }}>
      <BlockLabel>Variants × sizes</BlockLabel>
      <InfoBox>
        {/* Column headers */}
        <div style={{ display: 'grid', gridTemplateColumns: '120px repeat(3, 1fr)', gap: '16px', marginBottom: '16px', alignItems: 'center' }}>
          <div />
          {SIZES.map(size => (
            <div key={size} style={{
              fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 500,
              textTransform: 'uppercase', letterSpacing: '0.06em',
              color: 'var(--color-text-secondary)',
              display: 'flex', justifyContent: 'center',
            }}>
              {size} · {SIZE_INFO[size]}
            </div>
          ))}
        </div>
        {/* Rows */}
        {VARIANTS.map(variant => (
          <div key={variant} style={{
            display: 'grid', gridTemplateColumns: '120px repeat(3, 1fr)',
            gap: '16px', marginBottom: '12px', alignItems: 'center',
          }}>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              {variant}
            </div>
            {SIZES.map(size => (
              <div key={size} style={{ display: 'flex', justifyContent: 'center' }}>
                <Button variant={variant} size={size}>
                  {VARIANT_LABEL[variant]}
                </Button>
              </div>
            ))}
          </div>
        ))}
      </InfoBox>
    </div>

    {/* With icons — finalized 8px gap */}
    <div style={{ marginBottom: '40px' }}>
      <BlockLabel>With icons — 8px gap (--space-2, finalized)</BlockLabel>
      <InfoBox style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
        <Button leftIcon="Send">Send reply</Button>
        <Button rightIcon="ArrowRight">Next step</Button>
        <Button variant="secondary" leftIcon="Plus">Add connection</Button>
        <Button variant="destructive" leftIcon="Trash2">Delete lead</Button>
        <Button variant="ghost" rightIcon="ExternalLink">View docs</Button>
        <Button leftIcon="RefreshCw" rightIcon="ArrowRight">Retry &amp; advance</Button>
      </InfoBox>
    </div>

    {/* Secondary on surface vs page background — visibility check (item 4) */}
    <div style={{ marginBottom: '40px' }}>
      <BlockLabel>Secondary — surface vs page background (light mode)</BlockLabel>
      <p style={{
        fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
        color: 'var(--color-text-secondary)', marginBottom: '16px',
      }}>
        Light mode: secondary default fill charcoal-50 <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>#eaeaea</code> vs both backgrounds.
        Known limitation: charcoal-50 vs bg-primary is 1.08:1 — nearly invisible outside a surface card.
        Secondary is always used inside cards/modals so this is an accepted, deliberately deferred constraint.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={{
          background: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 'var(--radius-md)',
          padding: '24px',
          display: 'flex', flexDirection: 'column', gap: '12px',
        }}>
          <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
            --color-bg-surface (#ffffff) — inside a card
          </div>
          <Button variant="secondary">Cancel</Button>
        </div>
        <div style={{
          background: 'var(--color-bg-primary)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 'var(--radius-md)',
          padding: '24px',
          display: 'flex', flexDirection: 'column', gap: '12px',
        }}>
          <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
            --color-bg-primary (#f3f3f3) — on page background
          </div>
          <Button variant="secondary">Cancel</Button>
        </div>
      </div>
    </div>

    {/* Secondary dark mode — surface vs page background visibility check */}
    <div style={{ marginBottom: '40px' }}>
      <BlockLabel>Secondary — surface vs page background (dark mode)</BlockLabel>
      <p style={{
        fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
        color: 'var(--color-text-secondary)', marginBottom: '16px',
      }}>
        Dark mode: dark fills with light text — charcoal-400 (default) · charcoal-300 hover (lighter = lift) · charcoal-500 active (darker = push).
        Text uses <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>--color-text-primary</code> (white in dark mode). Text AA: default 7.45:1 · hover 4.96:1 · active 14.35:1.
        Toggle Dark above to see Secondary reading as quiet and recessive next to Primary's orange.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div className="dark" style={{
          background: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 'var(--radius-md)',
          padding: '24px',
          display: 'flex', flexDirection: 'column', gap: '12px',
        }}>
          <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
            bg-surface dark (#1e1e1e) — inside a card
          </div>
          <Button variant="secondary">Cancel</Button>
        </div>
        <div className="dark" style={{
          background: 'var(--color-bg-primary)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 'var(--radius-md)',
          padding: '24px',
          display: 'flex', flexDirection: 'column', gap: '12px',
        }}>
          <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
            bg-primary dark (#121212) — on page background
          </div>
          <Button variant="secondary">Cancel</Button>
        </div>
      </div>
    </div>

    {/* States grid */}
    <div style={{ marginBottom: '40px' }}>
      <BlockLabel>States — default · loading · disabled · full-width</BlockLabel>
      <InfoBox style={{ overflowX: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '120px repeat(4, 1fr)', gap: '12px', marginBottom: '16px', alignItems: 'center' }}>
          <div />
          {['Default', 'Loading', 'Disabled', 'fullWidth'].map(h => (
            <div key={h} style={{
              fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 500,
              textTransform: 'uppercase', letterSpacing: '0.06em',
              color: 'var(--color-text-secondary)',
              display: 'flex', justifyContent: h === 'fullWidth' ? 'flex-start' : 'center',
            }}>
              {h}
            </div>
          ))}
        </div>
        {VARIANTS.map(variant => (
          <div key={variant} style={{
            display: 'grid', gridTemplateColumns: '120px repeat(4, 1fr)',
            gap: '12px', marginBottom: '12px', alignItems: 'center',
          }}>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              {variant}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button variant={variant}>{VARIANT_LABEL[variant]}</Button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button variant={variant} loading>{VARIANT_LABEL[variant]}</Button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button variant={variant} disabled>{VARIANT_LABEL[variant]}</Button>
            </div>
            <div>
              <Button variant={variant} fullWidth>{VARIANT_LABEL[variant]}</Button>
            </div>
          </div>
        ))}
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
          color: 'var(--color-text-secondary)', margin: '16px 0 0 0',
        }}>
          Hover, active (pressed), and focus-visible are CSS-driven states — interact with any button above to see them. Focus ring uses <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>--color-focus-ring</code>, which resolves to brick-500 in light and orange-500 in dark.
          Ghost renders brand-coloured text (<code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>--color-interactive-default</code>) in all states; hover darkens to <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>-hover</code>, press to <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>-active</code>. No underline, no fill.
        </p>
      </InfoBox>
    </div>

    <Divider />

    {/* ── Touch-target demo ────────────────────────────────────────────────── */}
    <SectionHead
      title="Touch target"
      description="sm (36px) and md (40px) expand their hit area to 44×44px below the lg breakpoint (1024px) via a ::before pseudo-element — meeting WCAG 2.5.5 AA on mobile. lg (48px) already exceeds 44px natively. The dashed annotations below are always visible in Storybook; the breakpoint collapse is runtime-only."
    />

    <div style={{ marginBottom: '40px' }}>
      <InfoBox style={{ display: 'flex', gap: '64px', alignItems: 'flex-end', flexWrap: 'wrap', padding: '40px 24px' }}>

        {/* sm */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <div style={{ position: 'relative', display: 'inline-flex' }}>
            <Button size="sm">Save</Button>
            <div aria-hidden="true" style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '44px', height: '44px',
              border: '1.5px dashed var(--color-status-warning)',
              borderRadius: '4px', pointerEvents: 'none',
            }} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem', color: 'var(--color-text-primary)', marginBottom: '4px' }}>
              sm — 36px visual
            </div>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
              ::before expands hit area to 44×44px
            </div>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'var(--color-status-warning-text)' }}>
              collapses at lg (1024px+)
            </div>
          </div>
        </div>

        {/* md */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <div style={{ position: 'relative', display: 'inline-flex' }}>
            <Button size="md">Save</Button>
            <div aria-hidden="true" style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '44px', height: '44px',
              border: '1.5px dashed var(--color-status-warning)',
              borderRadius: '4px', pointerEvents: 'none',
            }} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem', color: 'var(--color-text-primary)', marginBottom: '4px' }}>
              md — 40px visual
            </div>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
              ::before expands hit area to 44×44px
            </div>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'var(--color-status-warning-text)' }}>
              collapses at lg (1024px+)
            </div>
          </div>
        </div>

        {/* lg */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <div style={{ position: 'relative', display: 'inline-flex' }}>
            <Button size="lg">Save</Button>
            <div aria-hidden="true" style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '48px', height: '48px',
              border: '1.5px solid var(--color-status-success)',
              borderRadius: '4px', pointerEvents: 'none',
            }} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem', color: 'var(--color-text-primary)', marginBottom: '4px' }}>
              lg — 48px visual
            </div>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
              Already ≥44px — no expansion needed
            </div>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'var(--color-status-success-text)' }}>
              WCAG 2.5.5 AA met natively
            </div>
          </div>
        </div>

      </InfoBox>
    </div>

    <Divider />

    {/* ── Usage guide ──────────────────────────────────────────────────────── */}
    <SectionHead
      title="Usage guide"
      description="Which variant to reach for first, and when to reconsider."
    />

    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '16px',
      marginBottom: '40px',
    }}>
      <InfoBox>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
          Primary
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-secondary)', margin: '0 0 16px 0' }}>
          The single most important action on a screen. Limit to one per view — never two primary buttons side-by-side.
        </p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Button size="sm">Save changes</Button>
          <Button size="sm" leftIcon="Webhook">Connect</Button>
        </div>
      </InfoBox>

      <InfoBox>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
          Secondary
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-secondary)', margin: '0 0 16px 0' }}>
          Paired with Primary in modal footers or form toolbars. The escape hatch — "Cancel", "Keep editing".
        </p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Button size="sm" variant="secondary">Cancel</Button>
          <Button size="sm" variant="secondary">Keep editing</Button>
        </div>
      </InfoBox>

      <InfoBox>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
          Destructive
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-secondary)', margin: '0 0 16px 0' }}>
          Irreversible actions only. Always inside a confirmation modal — never inline in a list row without a confirm step.
        </p>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button size="sm" variant="destructive" leftIcon="Trash2">Delete account</Button>
        </div>
      </InfoBox>

      <InfoBox>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
          Ghost
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-secondary)', margin: '0 0 16px 0' }}>
          Tertiary actions, navigation-like triggers, or controls adjacent to text where a filled background would feel heavy.
          Renders brand-coloured text in all states — hover darkens, press darkens further. No underline, no fill.
        </p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Button size="sm" variant="ghost" rightIcon="ExternalLink">View docs</Button>
          <Button size="sm" variant="ghost" leftIcon="ArrowLeft">Back</Button>
        </div>
      </InfoBox>

      <InfoBox>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
          Secondary vs ghost
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          Use <strong>secondary</strong> when the action needs a persistent, visible affordance (modal footers, toolbars).
          Use <strong>ghost</strong> when the button is in flowing content or the affordance should stay quiet until hovered.
        </p>
      </InfoBox>

      <InfoBox>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
          Why no outline variant?
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          Outline buttons rely on border colour to signal interactivity. On dark surfaces that border must be hand-tuned per background — brittle across themes. Filled secondary achieves the same "less prominent" hierarchy with better legibility in both light and dark mode.
        </p>
      </InfoBox>

      <InfoBox>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
          sm and md on mobile
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          Both sm (36px) and md (40px) are visually below the 44px WCAG 2.5.5 minimum. A{' '}
          <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>::before</code>{' '}
          pseudo-element expands the hit area to 44×44px below the lg breakpoint. It collapses at 1024px+ where pointer input is assumed.
        </p>
      </InfoBox>
    </div>

    <Divider />

    {/* ── Reference table ──────────────────────────────────────────────────── */}
    <SectionHead
      title="Reference table"
      description="All props accepted by the Button component."
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
