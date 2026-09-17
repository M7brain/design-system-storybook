import React, { useState } from 'react';
import { Spinner, Skeleton, ProgressBar, Pulse } from '../../design-system/loaders/index.js';
import { Bell } from '../../design-system/icons/index.js';

// ─────────────────────────────────────────────────────────────────────────────
// META
// ─────────────────────────────────────────────────────────────────────────────

export default {
  title: 'Foundations/Loaders',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Foundation-level loader system. Four primitives: Spinner, Skeleton, ProgressBar, Pulse. All animations use motion tokens from globals.css. prefers-reduced-motion is handled at the system level — never per-component. Loader selection rules are in the Usage Guide story.',
      },
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// SHARED HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function StoryFrame({ children }) {
  const [isDark, setIsDark] = useState(false);

  return (
    <div
      className={isDark ? 'dark' : ''}
      style={{
        background: 'var(--color-bg-primary)',
        minHeight: '100vh',
        width: '100%',
        padding: '32px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <button
          onClick={() => setIsDark(false)}
          aria-pressed={!isDark}
          style={{
            height: '32px',
            padding: '0 16px',
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
            height: '32px',
            padding: '0 16px',
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

function Page({ children }) {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', color: 'var(--color-text-primary)' }}>
      {children}
    </div>
  );
}

function SectionHead({ title, description }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.375rem', fontWeight: 600, lineHeight: '1.75rem', letterSpacing: '-0.015em', color: 'var(--color-text-primary)', margin: '0 0 8px 0' }}>
        {title}
      </h2>
      {description && (
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 400, lineHeight: '1.5rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          {description}
        </p>
      )}
    </div>
  );
}

function TokenRow({ items }) {
  return (
    <div style={{
      background: 'var(--color-bg-surface)',
      border: '1px solid var(--color-border-default)',
      borderRadius: 'var(--radius-sm)',
      padding: '12px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      flexWrap: 'wrap',
      marginBottom: '24px',
    }}>
      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginRight: '4px' }}>
        Tokens
      </span>
      {items.map((item, i) => (
        <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-default)', borderRadius: 'var(--radius-xs)', padding: '2px 8px', color: 'var(--color-text-primary)' }}>
            {item.name}
          </code>
          {item.value && (
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
              {item.value}
            </span>
          )}
          {i < items.length - 1 && (
            <span style={{ color: 'var(--color-border-strong)', marginLeft: '4px' }}>·</span>
          )}
        </span>
      ))}
    </div>
  );
}

function DemoBox({ children, style }) {
  return (
    <div style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-default)', borderRadius: 'var(--radius-md)', padding: '24px', ...style }}>
      {children}
    </div>
  );
}

function BlockLabel({ children }) {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
      {children}
    </div>
  );
}

function ItemLabel({ children }) {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '8px', textAlign: 'center' }}>
      {children}
    </div>
  );
}

function InlineCode({ children }) {
  return (
    <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', color: 'var(--color-brand-btn)' }}>
      {children}
    </code>
  );
}

function UsageRules({ use = [], avoid = [] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '32px' }}>
      <div style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-default)', borderRadius: 'var(--radius-md)', padding: '24px' }}>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-status-success)', marginBottom: '12px' }}>
          When to use
        </div>
        {use.map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: '8px', fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: '1.5rem', marginBottom: '4px' }}>
            <span style={{ color: 'var(--color-status-success)', flexShrink: 0, fontWeight: 600 }}>✓</span>
            {item}
          </div>
        ))}
      </div>
      <div style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-default)', borderRadius: 'var(--radius-md)', padding: '24px' }}>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-status-error)', marginBottom: '12px' }}>
          When NOT to use
        </div>
        {avoid.map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: '8px', fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: '1.5rem', marginBottom: '4px' }}>
            <span style={{ color: 'var(--color-status-error)', flexShrink: 0, fontWeight: 600 }}>✗</span>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 1 — SPINNER
// ─────────────────────────────────────────────────────────────────────────────

function SpinnerContent() {
  const sizes = [
    { size: 'sm', label: 'sm (16px)' },
    { size: 'md', label: 'md (24px)' },
    { size: 'lg', label: 'lg (40px)' },
  ];

  const colorVariants = [
    { color: 'var(--color-brand-btn)',      label: 'Default (brand)' },
    { color: 'var(--color-text-secondary)', label: 'Page overlay' },
    { color: 'var(--color-text-tertiary)',  label: 'Modal context' },
    { color: 'var(--color-text-secondary)', label: 'Inline action' },
  ];

  return (
    <Page>
      <SectionHead
        title="Spinner"
        description="Short indeterminate wait. System is doing something and will return in under 2 seconds. Uses the Loader2 icon with a continuous 700ms rotation."
      />

      <TokenRow items={[
        { name: '--duration-spinner', value: '700ms' },
        { name: '--ease-linear', value: 'linear' },
      ]} />

      {/* Sizes */}
      <div style={{ marginBottom: '32px' }}>
        <BlockLabel>Sizes</BlockLabel>
        <DemoBox>
          <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
            {sizes.map(({ size, label }) => (
              <div key={size} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Spinner size={size} />
                <ItemLabel>{label}</ItemLabel>
              </div>
            ))}
          </div>
        </DemoBox>
      </div>

      {/* Colour via prop */}
      <div style={{ marginBottom: '32px' }}>
        <BlockLabel>Colour via prop</BlockLabel>
        <DemoBox>
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}>
            {colorVariants.map(({ color, label }) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Spinner size="md" color={color} />
                <ItemLabel>{label}</ItemLabel>
              </div>
            ))}
          </div>
        </DemoBox>
      </div>

      <UsageRules
        use={[
          'Button loading state (handled at Button component level, not here)',
          'Full-page overlay while session / auth resolves',
          'Modal blocking during async action (regenerate webhook, delete)',
          'Inline row action in progress (Test webhook, manual reply sending)',
        ]}
        avoid={[
          'Content loading where the shape is known → use Skeleton instead',
          'Progress through a known process → use ProgressBar instead',
          'Live / real-time status → use Pulse instead',
          'Waits longer than ~3 seconds — user needs more feedback than a spinner',
        ]}
      />
    </Page>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 2 — SKELETON
// ─────────────────────────────────────────────────────────────────────────────

function SkeletonContent() {
  function LeadRowSkeleton() {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: '1px solid var(--color-border-subtle)' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '9999px', overflow: 'hidden', flexShrink: 0 }}>
          <Skeleton width="40px" height="40px" />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <Skeleton width="60%" height="14px" />
          <Skeleton width="80%" height="12px" />
        </div>
        <div style={{ width: '48px', height: '20px', borderRadius: '9999px', overflow: 'hidden', flexShrink: 0 }}>
          <Skeleton width="48px" height="20px" />
        </div>
      </div>
    );
  }

  function LeadRowLoaded({ name, preview, badge, badgeColor }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: '1px solid var(--color-border-subtle)' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '9999px', background: 'var(--color-bg-secondary)', flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: '2px' }}>{name}</div>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{preview}</div>
        </div>
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 500, padding: '2px 8px', borderRadius: '9999px', background: badgeColor, color: 'var(--color-text-on-interactive)', flexShrink: 0 }}>
          {badge}
        </span>
      </div>
    );
  }

  return (
    <Page>
      <SectionHead
        title="Skeleton"
        description="Content placeholder shown while data is loading. Use when the shape of incoming content is known. Prevents layout shift and gives the user a sense of what is coming. Shimmer uses --duration-skeleton (1500ms) at --ease-linear."
      />

      <TokenRow items={[
        { name: '--duration-skeleton', value: '1500ms' },
        { name: '--ease-linear', value: 'linear' },
        { name: '--color-skeleton-base', value: 'base' },
        { name: '--color-skeleton-highlight', value: 'shimmer peak' },
      ]} />

      {/* Variants */}
      <div style={{ marginBottom: '32px' }}>
        <BlockLabel>Variants</BlockLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <DemoBox>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: '12px' }}>
              <InlineCode>line</InlineCode> — single text line placeholder
            </div>
            <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Skeleton width="100%" height="16px" />
              <Skeleton width="75%" height="16px" />
              <Skeleton width="50%" height="16px" />
            </div>
          </DemoBox>

          <DemoBox>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: '12px' }}>
              <InlineCode>paragraph</InlineCode> — multi-line block placeholder
            </div>
            <div style={{ width: '320px' }}>
              <Skeleton variant="paragraph" />
            </div>
          </DemoBox>

          <DemoBox>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: '12px' }}>
              <InlineCode>card</InlineCode> — card or panel placeholder (with composed content skeletons)
            </div>
            <div style={{ width: '320px', position: 'relative' }}>
              <Skeleton variant="card" height="120px" />
              <div style={{ position: 'absolute', top: '24px', left: '24px', right: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Skeleton width="40%" height="22px" />
                <Skeleton width="70%" height="14px" />
              </div>
            </div>
          </DemoBox>
        </div>
      </div>

      {/* In context */}
      <div style={{ marginBottom: '32px' }}>
        <BlockLabel>In context — lead list</BlockLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <DemoBox>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: '4px' }}>
              Loading
            </div>
            <LeadRowSkeleton />
            <LeadRowSkeleton />
            <LeadRowSkeleton />
          </DemoBox>
          <DemoBox>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: '4px' }}>
              Loaded
            </div>
            <LeadRowLoaded
              name="Mike Hernandez"
              preview="Need a plumber ASAP for burst pipe..."
              badge="New"
              badgeColor="var(--color-status-success)"
            />
            <LeadRowLoaded
              name="Sarah Chen"
              preview="Looking for an estimate on AC replacement..."
              badge="Replied"
              badgeColor="var(--color-interactive-default)"
            />
            <LeadRowLoaded
              name="James Wilson"
              preview="Do you work weekends?"
              badge="New"
              badgeColor="var(--color-status-success)"
            />
          </DemoBox>
        </div>
      </div>

      <UsageRules
        use={[
          'Lead list while data fetches (3–5 row skeletons)',
          'Dashboard metric cards on initial load',
          'Lead detail panel while thread loads',
          'Activity feed, settings form, connection cards, plan cards',
        ]}
        avoid={[
          'Unknown content shape — just show a Spinner',
          'Actions / buttons — use disabled + Spinner instead',
          'Skeleton for more than 4–5 seconds — show an error state',
        ]}
      />
    </Page>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 3 — PROGRESS BAR
// ─────────────────────────────────────────────────────────────────────────────

function ProgressBarContent() {
  const TOTAL = 5;
  const [step, setStep] = useState(2);
  const value = Math.round((step / TOTAL) * 100);

  return (
    <Page>
      <SectionHead
        title="Progress Bar"
        description="Linear progress for known-shape processes. Two modes: determinate (known completion %) and indeterminate (unknown duration). Two sizes: default (8px track) and thin (4px track)."
      />

      <TokenRow items={[
        { name: '--duration-base',                  value: '200ms (determinate transition)' },
        { name: '--duration-progress-indeterminate', value: '1800ms (indeterminate)' },
        { name: '--color-progress-fill',             value: 'fill' },
        { name: '--color-progress-track',            value: 'track' },
      ]} />

      {/* Determinate */}
      <div style={{ marginBottom: '32px' }}>
        <BlockLabel>Determinate</BlockLabel>
        <DemoBox>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[25, 50, 75, 100].map((v) => (
              <div key={v} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', color: 'var(--color-text-secondary)', width: '36px', flexShrink: 0, textAlign: 'right' }}>
                  {v}%
                </span>
                <div style={{ flex: 1 }}>
                  <ProgressBar value={v} label={`${v}%`} />
                </div>
              </div>
            ))}
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'var(--color-text-tertiary)', paddingLeft: '48px' }}>
              100% fills to --color-progress-fill (brand colour) naturally — no extra styling needed.
            </div>
          </div>
        </DemoBox>
      </div>

      {/* Indeterminate */}
      <div style={{ marginBottom: '32px' }}>
        <BlockLabel>Indeterminate</BlockLabel>
        <DemoBox>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
            Page navigation / upload in progress
          </div>
          <ProgressBar size="thin" label="Loading…" />
        </DemoBox>
      </div>

      {/* Interactive */}
      <div style={{ marginBottom: '32px' }}>
        <BlockLabel>Interactive — try it</BlockLabel>
        <DemoBox>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
            Step {step} of {TOTAL}
          </div>
          <div style={{ marginBottom: '16px' }}>
            <ProgressBar value={value} label={`Step ${step} of ${TOTAL}`} showLabel />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              style={{
                border: '1px solid var(--color-border-default)',
                background: 'transparent',
                padding: '8px 16px',
                borderRadius: 'var(--radius-sm)',
                cursor: step === 0 ? 'not-allowed' : 'pointer',
                color: 'var(--color-text-primary)',
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.875rem',
                opacity: step === 0 ? 0.4 : 1,
              }}
            >
              ← Back
            </button>
            <button
              onClick={() => setStep((s) => Math.min(TOTAL, s + 1))}
              disabled={step === TOTAL}
              style={{
                border: '1px solid var(--color-border-default)',
                background: 'transparent',
                padding: '8px 16px',
                borderRadius: 'var(--radius-sm)',
                cursor: step === TOTAL ? 'not-allowed' : 'pointer',
                color: 'var(--color-text-primary)',
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.875rem',
                opacity: step === TOTAL ? 0.4 : 1,
              }}
            >
              Next →
            </button>
          </div>
        </DemoBox>
      </div>

      <UsageRules
        use={[
          'Onboarding wizard step progress (determinate, default size)',
          'Plan usage bar — X of 50 leads used (determinate, default size)',
          'Top-of-page route navigation bar (indeterminate, thin size)',
          'File / screenshot upload feedback (indeterminate, thin size)',
        ]}
        avoid={[
          'Short waits under 1–2 seconds — use Spinner',
          'Real-time status — use Pulse',
          'When the process has no perceivable progress steps',
        ]}
      />
    </Page>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 4 — PULSE
// ─────────────────────────────────────────────────────────────────────────────

function PulseContent() {
  const variants = [
    { variant: 'brand',   label: 'AI processing lead' },
    { variant: 'success', label: 'Webhook active' },
    { variant: 'warning', label: 'Connection idle 7d' },
    { variant: 'error',   label: 'Delivery failed' },
  ];

  return (
    <Page>
      <SectionHead
        title="Pulse"
        description="Persistent animated dot for live and real-time status. NOT a loading indicator — it signals an ongoing state (active, processing, live). Uses --duration-pulse (2000ms) loop. The inner dot is static; the outer ring radiates and fades."
      />

      <TokenRow items={[
        { name: '--duration-pulse',    value: '2000ms' },
        { name: '--ease-linear',       value: 'linear' },
        { name: '--color-pulse-brand', value: 'processing' },
        { name: '--color-pulse-success / warning / error', value: 'status variants' },
      ]} />

      {/* Colour variants */}
      <div style={{ marginBottom: '32px' }}>
        <BlockLabel>Colour variants</BlockLabel>
        <DemoBox>
          <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
            {variants.map(({ variant, label }) => (
              <div key={variant} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Pulse variant={variant} size="md" />
                </div>
                <div style={{ textAlign: 'center', marginTop: '8px' }}>
                  <InlineCode>{variant}</InlineCode>
                  <ItemLabel>{label}</ItemLabel>
                </div>
              </div>
            ))}
          </div>
        </DemoBox>
      </div>

      {/* Size comparison */}
      <div style={{ marginBottom: '32px' }}>
        <BlockLabel>Sizes — sm is the Quicklo default for inline use</BlockLabel>
        <DemoBox>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {['sm', 'md'].map((size) => (
              <div key={size} style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', color: 'var(--color-text-secondary)', width: '20px' }}>
                  {size}
                </span>
                {variants.map(({ variant }) => (
                  <div key={variant} style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Pulse variant={variant} size={size} />
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'var(--color-text-tertiary)', marginTop: '16px' }}>
            Use <InlineCode>sm</InlineCode> for all inline contexts — lead rows, connection cards, notification badges.
            Reserve <InlineCode>md</InlineCode> for elements large enough to need a more visible indicator.
          </div>
        </DemoBox>
      </div>

      {/* In-context demos */}
      <div style={{ marginBottom: '32px' }}>
        <BlockLabel>Where it appears in Quicklo</BlockLabel>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>

          {/* Lead row — pipeline processing */}
          <DemoBox style={{ flex: 1 }}>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: '12px' }}>
              Lead row — pipeline processing
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '9999px', background: 'var(--color-bg-secondary)', flexShrink: 0 }} />
              <div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                  Mike Hernandez
                </div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                  Need a plumber ASAP for a burst pipe...
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                <Pulse variant="brand" size="sm" />
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                  Replying...
                </span>
              </div>
            </div>
          </DemoBox>

          {/* Connection card — webhook live */}
          <DemoBox style={{ flex: 1 }}>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: '12px' }}>
              Connection card — webhook live
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                Contact page form
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Pulse variant="success" size="sm" />
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: 'var(--color-status-success)' }}>
                  Active
                </span>
              </div>
            </div>
          </DemoBox>

          {/* Notification bell — unread alerts */}
          <DemoBox>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: '12px' }}>
              Notification bell — unread alerts
            </div>
            <div style={{ display: 'inline-flex', position: 'relative', padding: '8px' }}>
              <span style={{ color: 'var(--color-text-primary)', display: 'inline-flex' }}>
                <Bell width="1.5rem" height="1.5rem" aria-hidden="true" />
              </span>
              <span style={{ position: 'absolute', top: '4px', right: '4px' }}>
                <Pulse variant="brand" size="sm" label="Unread notifications" />
              </span>
            </div>
          </DemoBox>

        </div>
      </div>

      <UsageRules
        use={[
          'Pipeline processing indicator on a lead row (brand, sm)',
          'Webhook active status on a connection card (success, sm)',
          'Connection warning — no leads in 7 days (warning, sm)',
          'Delivery failure indicator (error, sm)',
          'Unread notification badge on the bell icon (brand, sm)',
        ]}
        avoid={[
          'Loading states — use Spinner or Skeleton',
          'Completed actions — use a CheckCircle icon instead',
          'More than one Pulse visible at the same time in a single UI region',
          'md size unless the UI element is large enough to warrant it',
        ]}
      />
    </Page>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 5 — USAGE GUIDE
// ─────────────────────────────────────────────────────────────────────────────

const GUIDE_ROWS = [
  { situation: 'Button is submitting a form',        loader: 'Spinner',     spec: 'sm — handled at Button level' },
  { situation: 'Page is navigating between routes',  loader: 'ProgressBar', spec: 'thin · indeterminate' },
  { situation: 'Auth / session check on load',       loader: 'Spinner',     spec: 'lg · overlay' },
  { situation: 'Modal action is processing',         loader: 'Spinner',     spec: 'md · centred in modal' },
  { situation: 'Inline row action (Test webhook)',   loader: 'Spinner',     spec: 'sm · inline' },
  { situation: 'Lead list is fetching',              loader: 'Skeleton',    spec: 'lead-row variant × 3–5' },
  { situation: 'Metric cards are loading',           loader: 'Skeleton',    spec: 'card variant × 3' },
  { situation: 'Lead detail thread is loading',      loader: 'Skeleton',    spec: 'paragraph variant' },
  { situation: 'Activity feed is loading',           loader: 'Skeleton',    spec: 'line variant × 4–5' },
  { situation: 'Settings form data loading',         loader: 'Skeleton',    spec: 'line + paragraph' },
  { situation: 'Plan cards (billing page) loading',  loader: 'Skeleton',    spec: 'card variant × 4' },
  { situation: 'Onboarding step progress',           loader: 'ProgressBar', spec: 'default · determinate' },
  { situation: 'Plan usage bar (sidebar)',           loader: 'ProgressBar', spec: 'default · determinate' },
  { situation: 'File / screenshot uploading',        loader: 'ProgressBar', spec: 'thin · indeterminate' },
  { situation: 'Lead is being processed by AI',      loader: 'Pulse',       spec: 'brand · sm' },
  { situation: 'Webhook connection is active',       loader: 'Pulse',       spec: 'success · sm' },
  { situation: 'Connection idle for 7+ days',        loader: 'Pulse',       spec: 'warning · sm' },
  { situation: 'Delivery has failed',                loader: 'Pulse',       spec: 'error · sm' },
  { situation: 'Unread notifications (bell)',        loader: 'Pulse',       spec: 'brand · sm' },
];

const LOADER_COLOURS = {
  Spinner:     { bg: 'var(--color-brand-tint)',        text: 'var(--color-brand-tint-text)' },
  Skeleton:    { bg: 'var(--color-bg-secondary)',      text: 'var(--color-text-secondary)' },
  ProgressBar: { bg: 'var(--color-status-info-bg)',    text: 'var(--color-status-info-text)' },
  Pulse:       { bg: 'var(--color-status-success-bg)', text: 'var(--color-status-success-text)' },
};

const TOKEN_FOOTER = [
  { token: '--duration-spinner',                value: '700ms',  easing: '--ease-linear', use: 'Spinner rotation' },
  { token: '--duration-skeleton',               value: '1500ms', easing: '--ease-linear', use: 'Skeleton shimmer' },
  { token: '--duration-progress-indeterminate', value: '1800ms', easing: '--ease-linear', use: 'Indeterminate bar' },
  { token: '--duration-pulse',                  value: '2000ms', easing: '--ease-linear', use: 'Pulse ring' },
];

const NEVER_LIST = [
  'Never use Spinner for content whose shape is known — that is Skeleton',
  'Never use Pulse for loading — Pulse is status, not loading',
  'Never hardcode animation durations — always use the motion tokens',
  'Never handle prefers-reduced-motion per-component — globals.css handles it at the system level',
  'Never add a loader to a Button directly — that is a Button component concern',
];

function UsageGuideContent() {
  const TH = {
    padding: '12px 16px',
    textAlign: 'left',
    background: 'var(--color-bg-primary)',
    borderBottom: '2px solid var(--color-border-default)',
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.875rem',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    color: 'var(--color-text-secondary)',
    whiteSpace: 'nowrap',
  };

  function td(extra) {
    return {
      padding: '12px 16px',
      fontFamily: 'Inter, sans-serif',
      fontSize: '0.875rem',
      borderBottom: '1px solid var(--color-border-subtle)',
      color: 'var(--color-text-primary)',
      ...extra,
    };
  }

  return (
    <Page>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.75rem', fontWeight: 700, lineHeight: '2.25rem', letterSpacing: '-0.02em', color: 'var(--color-text-primary)', margin: '0 0 8px 0' }}>
          Which loader do I use?
        </h1>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 400, lineHeight: '1.75rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          Follow these rules every time. No exceptions.
        </p>
      </div>

      {/* Decision table */}
      <div style={{ marginBottom: '48px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Inter, sans-serif' }}>
          <thead>
            <tr>
              <th style={TH}>Situation</th>
              <th style={TH}>Loader</th>
              <th style={TH}>Size / variant</th>
            </tr>
          </thead>
          <tbody>
            {GUIDE_ROWS.map((row, i) => {
              const lc = LOADER_COLOURS[row.loader] || {};
              return (
                <tr key={i} style={{ background: i % 2 === 0 ? 'var(--color-bg-primary)' : 'var(--color-bg-surface)' }}>
                  <td style={td()}>{row.situation}</td>
                  <td style={td({ whiteSpace: 'nowrap' })}>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 500, padding: '2px 8px', borderRadius: 'var(--radius-xs)', background: lc.bg, color: lc.text }}>
                      {row.loader}
                    </span>
                  </td>
                  <td style={td({ fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', color: 'var(--color-text-secondary)' })}>
                    {row.spec}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Never do this */}
      <div style={{ marginBottom: '48px' }}>
        <div style={{ borderLeft: '3px solid var(--color-brand-btn)', padding: '12px 16px', background: 'var(--color-bg-secondary)' }}>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-brand-btn)', marginBottom: '8px' }}>
            Never do this
          </div>
          {NEVER_LIST.map((item, i) => (
            <div key={i} style={{ position: 'relative', paddingLeft: '12px', fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: '1.5rem', marginBottom: '4px' }}>
              <span style={{ position: 'absolute', left: 0, color: 'var(--color-brand-btn)', fontWeight: 600 }}>✗</span>
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Token reference footer */}
      <div>
        <BlockLabel>Token reference</BlockLabel>
        <div style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-default)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
          {TOKEN_FOOTER.map((row, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderBottom: i < TOKEN_FOOTER.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                background: i % 2 === 0 ? 'var(--color-bg-surface)' : 'var(--color-bg-primary)',
              }}
            >
              <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', color: 'var(--color-brand-btn)', flex: '0 0 auto', minWidth: '280px' }}>
                {row.token}
              </code>
              <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', color: 'var(--color-text-secondary)', flex: '0 0 64px' }}>
                {row.value}
              </span>
              <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', color: 'var(--color-text-tertiary)', flex: '0 0 auto', minWidth: '120px' }}>
                {row.easing}
              </span>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: 'var(--color-text-secondary)', flex: 1 }}>
                {row.use}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Page>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STORY EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

export const SpinnerStory = {
  render: () => <StoryFrame><SpinnerContent /></StoryFrame>,
  parameters: {
    docs: {
      description: {
        story: 'Three semantic sizes (sm/md/lg) and a color prop. Spins at 700ms using --ease-linear. Use when the system is doing something brief and the content shape is unknown.',
      },
    },
  },
};
SpinnerStory.storyName = 'Spinner';

export const SkeletonStory = {
  render: () => <StoryFrame><SkeletonContent /></StoryFrame>,
  parameters: {
    docs: {
      description: {
        story: 'Three variants: line, paragraph, card. Shimmer uses --duration-skeleton (1500ms). Use when the shape of incoming content is known.',
      },
    },
  },
};
SkeletonStory.storyName = 'Skeleton';

export const ProgressBarStory = {
  render: () => <StoryFrame><ProgressBarContent /></StoryFrame>,
  parameters: {
    docs: {
      description: {
        story: 'Determinate (value prop) and indeterminate (no value). Default (8px) and thin (4px) sizes. Interactive demo shows the smooth width transition in action.',
      },
    },
  },
};
ProgressBarStory.storyName = 'Progress Bar';

export const PulseStory = {
  render: () => <StoryFrame><PulseContent /></StoryFrame>,
  parameters: {
    docs: {
      description: {
        story: 'Five variants: brand, default, success, warning, error. Two sizes: sm (inline default) and md. Signals ongoing status — NOT a loading indicator.',
      },
    },
  },
};
PulseStory.storyName = 'Pulse';

export const UsageGuide = {
  render: () => <StoryFrame><UsageGuideContent /></StoryFrame>,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Decision table for choosing the right loader. 19 situations mapped to loader, size, and variant. Consult this before adding any loader to a component or page.',
      },
    },
  },
};
UsageGuide.storyName = 'Usage Guide';
