import React, { useState, useEffect } from 'react';
import { Tooltip } from './Tooltip.jsx';
import { Icon } from '@/design-system/icons/Icon.jsx';

// ─────────────────────────────────────────────────────────────────────────────
// META
// ─────────────────────────────────────────────────────────────────────────────

export default {
  title: 'Components/Tooltip',
  parameters: {
    layout: 'fullscreen',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function StoryFrame({ children }) {
  const [isDark, setIsDark] = useState(false);

  // Tooltip renders via createPortal into document.body, which lives outside
  // this component's .dark wrapper. Sync the class to body so the portal
  // element inherits the correct token values in dark mode.
  useEffect(() => {
    document.body.classList.toggle('dark', isDark);
    return () => document.body.classList.remove('dark');
  }, [isDark]);

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

// forwardRef + ...rest are required: Tooltip's cloneElement attaches ref (for
// positioning) plus onMouseEnter/Leave/Focus/Blur/aria props to its child.
// Without forwardRef the ref never reaches the DOM node; without ...rest the
// event handlers are silently dropped — both break hover detection.
const TriggerBtn = React.forwardRef(function TriggerBtn({ children, style, ...rest }, ref) {
  return (
    <button
      ref={ref}
      style={{
        height: '40px',
        padding: '0 20px',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--color-border-default)',
        background: 'var(--color-bg-surface)',
        color: 'var(--color-text-primary)',
        fontFamily: 'Inter, sans-serif',
        fontSize: '0.875rem',
        fontWeight: 500,
        cursor: 'pointer',
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const PROPS = [
  {
    name: 'content',
    type: 'string',
    defaultVal: '—',
    description: 'Text displayed inside the tooltip bubble.',
  },
  {
    name: 'type',
    type: "'description' | 'label'",
    defaultVal: "'description'",
    description: "ARIA wiring. 'description' → aria-describedby (tooltip supplements an existing label). 'label' → aria-labelledby (tooltip IS the accessible name — use for icon-only triggers).",
  },
  {
    name: 'position',
    type: "'top' | 'bottom' | 'left' | 'right'",
    defaultVal: "'top'",
    description: 'Preferred position. Auto-flips to the opposite side if within 32px of a viewport edge.',
  },
  {
    name: 'maxWidth',
    type: 'number',
    defaultVal: '200',
    description: 'Maximum width in pixels. Increase for Chart data tooltips or multi-line content.',
  },
  {
    name: 'children',
    type: 'ReactElement',
    defaultVal: '—',
    description: 'Single trigger element. Must accept a ref — DOM elements work natively; custom components need forwardRef.',
  },
];

const TOKENS = [
  {
    token: '--delay-tooltip',
    value: '500ms',
    usage: 'Cursor-rest wait before tooltip appears. Collapses to 0ms automatically under prefers-reduced-motion.',
  },
  {
    token: '--duration-base',
    value: '200ms',
    usage: 'Fade-in and fade-out opacity transition duration.',
  },
  {
    token: '--ease-default',
    value: 'cubic-bezier(0,0,0.2,1)',
    usage: 'Easing applied to the fade-in transition.',
  },
  {
    token: '--ease-exit',
    value: 'cubic-bezier(0.4,0,1,1)',
    usage: 'Easing applied to the fade-out transition.',
  },
  {
    token: '--elevation-2',
    value: '0 4px 12px rgba(0,0,0,0.08)',
    usage: 'Tooltip box-shadow. Dark mode embeds a 1px rgba(255,255,255,0.06) inset border in the token — no explicit CSS border required.',
  },
  {
    token: '--radius-sm',
    value: '8px',
    usage: 'Tooltip corner radius.',
  },
  {
    token: '--space-1',
    value: '4px',
    usage: 'Gap between caret tip and trigger edge (GAP constant in Tooltip.jsx).',
  },
  {
    token: '--space-2',
    value: '8px',
    usage: 'Vertical padding inside the tooltip bubble.',
  },
  {
    token: '--space-3',
    value: '12px',
    usage: 'Horizontal padding inside the tooltip bubble.',
  },
  {
    token: '--text-body-sm',
    value: '0.75rem',
    usage: 'Tooltip text size — Inter 400, line-height 1rem.',
  },
  {
    token: '--color-bg-surface',
    value: '#ffffff / #1e1e1e',
    usage: 'Tooltip background fill and caret triangle colour. Flips automatically in dark mode.',
  },
  {
    token: '--color-text-primary',
    value: '#121212 / #fbfbfb',
    usage: 'Tooltip text colour.',
  },
  {
    token: '--font-body',
    value: "'Inter', sans-serif",
    usage: 'Tooltip font family.',
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
        Tooltip
      </h1>
      <p style={{
        fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 400,
        lineHeight: '1.75rem', color: 'var(--color-text-secondary)', margin: 0,
      }}>
        A hover- and focus-triggered label that reveals supplementary text after a 500ms cursor-rest delay.
        Stays open while the cursor travels trigger → tooltip (WCAG 1.4.13 — no auto-expiry timer).
        Portal-rendered into{' '}
        <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}>document.body</code>
        {' '}to escape{' '}
        <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}>overflow:hidden</code>
        {' '}parents. Never shows on tap — touch users rely on visible labels.
      </p>
    </div>

    {/* ──────────────────────────────────────────────────────────────────────── */}
    {/* SECTION 1 — Positions                                                  */}
    {/* ──────────────────────────────────────────────────────────────────────── */}
    <SectionHead
      title="Positions"
      description="All four positions. Hover each trigger — the tooltip appears after the 500ms cursor-rest delay."
    />

    <div style={{ marginBottom: '40px' }}>
      <InfoBox>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '32px',
          justifyItems: 'center',
          padding: '24px 0',
        }}>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
              position="top"
            </div>
            <Tooltip content="Appears above the trigger" position="top">
              <TriggerBtn>Top</TriggerBtn>
            </Tooltip>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
              position="bottom"
            </div>
            <Tooltip content="Appears below the trigger" position="bottom">
              <TriggerBtn>Bottom</TriggerBtn>
            </Tooltip>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
              position="left"
            </div>
            <Tooltip content="Appears to the left" position="left">
              <TriggerBtn>Left</TriggerBtn>
            </Tooltip>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
              position="right"
            </div>
            <Tooltip content="Appears to the right" position="right">
              <TriggerBtn>Right</TriggerBtn>
            </Tooltip>
          </div>

        </div>
      </InfoBox>
    </div>

    <Divider />

    {/* ──────────────────────────────────────────────────────────────────────── */}
    {/* SECTION 2 — Type: label vs description                                 */}
    {/* ──────────────────────────────────────────────────────────────────────── */}
    <SectionHead
      title="Type: label vs description"
      description="Two ARIA wiring modes. Choose based on whether the tooltip IS the trigger's name or supplements it."
    />

    <div style={{ marginBottom: '40px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

        <InfoBox>
          <BlockLabel>type="description" (default)</BlockLabel>
          <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 0 16px' }}>
            <Tooltip
              content="Sends follow-up in 90 seconds"
              type="description"
              position="top"
            >
              <TriggerBtn>Auto-reply</TriggerBtn>
            </Tooltip>
          </div>
          <p style={{
            fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
            color: 'var(--color-text-secondary)', margin: 0,
          }}>
            Applies{' '}
            <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}>aria-describedby</code>
            {' '}when visible. Use when the trigger already has a visible label — the tooltip adds context,
            it does not replace the name. Screen readers announce:{' '}
            <em>"Auto-reply, button — Sends follow-up in 90 seconds"</em>.
          </p>
        </InfoBox>

        <InfoBox>
          <BlockLabel>type="label"</BlockLabel>
          <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 0 16px' }}>
            <Tooltip
              content="Settings"
              type="label"
              position="top"
            >
              <button
                aria-label="Settings"
                style={{
                  width: '40px', height: '40px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border-default)',
                  background: 'var(--color-bg-surface)',
                  color: 'var(--color-text-primary)',
                  cursor: 'pointer',
                }}
              >
                <Icon name="Settings" size="md" />
              </button>
            </Tooltip>
          </div>
          <p style={{
            fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
            color: 'var(--color-text-secondary)', margin: 0,
          }}>
            Applies{' '}
            <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}>aria-labelledby</code>
            {' '}when visible. Use for icon-only triggers — the tooltip content IS the accessible name.
            Keep{' '}
            <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}>aria-label</code>
            {' '}on the button as fallback for when the tooltip is not yet shown.
          </p>
        </InfoBox>

      </div>
    </div>

    <Divider />

    {/* ──────────────────────────────────────────────────────────────────────── */}
    {/* SECTION — Icon-triggered description (common pattern)                  */}
    {/* ──────────────────────────────────────────────────────────────────────── */}
    <SectionHead
      title="Icon-triggered description (common pattern)"
      description="A visible text label sits beside a small info icon. The icon is the Tooltip trigger — hover or focus it for supplementary detail. The visible label is always present; the tooltip adds context it alone does not provide."
    />

    <div style={{ marginBottom: '40px' }}>
      <InfoBox>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 0 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{
              fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 500,
              lineHeight: '1.5rem', color: 'var(--color-text-primary)',
            }}>
              Quiet hours
            </span>
            <Tooltip
              type="description"
              content="Quiet hours block all notifications from 10 PM to 7 AM. Urgent lead alerts still come through."
              position="top"
              maxWidth={240}
            >
              <button
                aria-label="More information about quiet hours"
                style={{
                  width: '44px', height: '44px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: 'var(--radius-full)',
                  color: 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                <Icon name="Info" size="md" />
              </button>
            </Tooltip>
          </div>
        </div>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
          color: 'var(--color-text-secondary)', margin: 0,
        }}>
          Use{' '}
          <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}>type="description"</code>
          {' '}here — "Quiet hours" is always visible and serves as the label for the surrounding context.
          The tooltip supplements it with detail the label alone does not convey.
          The icon button needs its own{' '}
          <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}>aria-label</code>
          {' '}("More information about quiet hours") since it has no visible text.
          This is distinct from the icon-only nav case ({' '}
          <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}>type="label"</code>
          ) where the tooltip IS the only accessible name. Icon used:{' '}
          <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}>Info</code>
          {' '}(ⓘ circle, from the Lead Status icon group) — chosen over{' '}
          <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}>HelpCircle</code>
          {' '}(?) because this is supplementary context, not a help question.
        </p>
      </InfoBox>
    </div>

    <Divider />

    {/* ──────────────────────────────────────────────────────────────────────── */}
    {/* SECTION 3 — Persistent hover behavior (WCAG 1.4.13)                   */}
    {/* ──────────────────────────────────────────────────────────────────────── */}
    <SectionHead
      title="Persistent hover behavior (WCAG 1.4.13)"
      description="The tooltip stays open when the cursor moves from trigger to tooltip — it never closes on a timer. Hover the button, then slowly move the cursor onto the tooltip bubble itself."
    />

    <div style={{ marginBottom: '40px' }}>
      <InfoBox style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', padding: '40px 24px' }}>
        <Tooltip
          content="You can hover onto this bubble — it stays open. No auto-expiry timer."
          position="bottom"
          maxWidth={260}
        >
          <TriggerBtn>Hover me, then move cursor onto the tooltip</TriggerBtn>
        </Tooltip>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
          color: 'var(--color-text-secondary)', margin: 0, maxWidth: '520px', textAlign: 'center',
        }}>
          A 50ms reconciliation delay allows the cursor to travel trigger → tooltip before the hide decision fires.
          The tooltip element has{' '}
          <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}>pointerEvents: 'auto'</code>
          {' '}so cursor events register on the bubble itself.
          Closes on cursor leave from both trigger and tooltip, Escape key (focus stays on trigger), or blur — never on a timer.
        </p>
      </InfoBox>
    </div>

    <Divider />

    {/* ──────────────────────────────────────────────────────────────────────── */}
    {/* SECTION 4 — Auto-flip near viewport edges                              */}
    {/* ──────────────────────────────────────────────────────────────────────── */}
    <SectionHead
      title="Auto-flip near viewport edges"
      description="When the preferred position would place the tooltip within 32px of a viewport edge, it flips to the opposite side automatically. Hover the triggers at the extremes of this row."
    />

    <div style={{ marginBottom: '40px' }}>
      <InfoBox style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', padding: '40px 24px' }}>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '12px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
            position="left" → flips to right
          </div>
          <Tooltip content="No room on the left — auto-flipped to right" position="left">
            <TriggerBtn>Left edge</TriggerBtn>
          </Tooltip>
        </div>

        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
          color: 'var(--color-text-tertiary)', textAlign: 'center', maxWidth: '240px', margin: 0,
        }}>
          Space is checked at show-time against a 32px edge threshold.
          If the preferred side has no room, the opposite is tried.
          If both sides have room, the preferred side always wins.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
            position="right" → flips to left
          </div>
          <Tooltip content="No room on the right — auto-flipped to left" position="right">
            <TriggerBtn>Right edge</TriggerBtn>
          </Tooltip>
        </div>

      </InfoBox>
    </div>

    <Divider />

    {/* ──────────────────────────────────────────────────────────────────────── */}
    {/* SECTION 5 — maxWidth override                                          */}
    {/* ──────────────────────────────────────────────────────────────────────── */}
    <SectionHead
      title="maxWidth override"
      description="Default is 200px — enough for short labels. Increase for Chart data tooltips or multi-line content."
    />

    <div style={{ marginBottom: '40px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

        <InfoBox>
          <BlockLabel>maxWidth={'{200}'} (default)</BlockLabel>
          <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 0 16px' }}>
            <Tooltip
              content="Sends follow-up within 90 seconds of form submit."
              position="bottom"
              maxWidth={200}
            >
              <TriggerBtn>Default width</TriggerBtn>
            </Tooltip>
          </div>
          <p style={{
            fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
            color: 'var(--color-text-secondary)', margin: 0,
          }}>
            200px covers most short labels and action descriptions. Content wraps naturally when it exceeds one line.
          </p>
        </InfoBox>

        <InfoBox>
          <BlockLabel>maxWidth={'{320}'} — Chart use case</BlockLabel>
          <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 0 16px' }}>
            <Tooltip
              content="Week of Jun 9: 24 leads · 18 replied · 6 pending · avg reply time 87s"
              position="bottom"
              maxWidth={320}
            >
              <TriggerBtn>Chart data point</TriggerBtn>
            </Tooltip>
          </div>
          <p style={{
            fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
            color: 'var(--color-text-secondary)', margin: 0,
          }}>
            Wider tooltips keep data-dense chart labels on fewer lines. Pass{' '}
            <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}>maxWidth={'{320}'}</code>
            {' '}for the Chart component integration.
          </p>
        </InfoBox>

      </div>
    </div>

    <Divider />

    {/* ──────────────────────────────────────────────────────────────────────── */}
    {/* SECTION 6 — Light/Dark elevation check                                 */}
    {/* ──────────────────────────────────────────────────────────────────────── */}
    <SectionHead
      title="Light/Dark elevation check"
      description="The tooltip uses --color-bg-surface and --elevation-2, both of which flip in dark mode. Dark mode embeds a 1px rgba(255,255,255,0.06) hairline border inside --elevation-2 — no explicit CSS border is needed."
    />

    <div style={{ marginBottom: '40px' }}>
      <InfoBox>
        <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', alignItems: 'flex-start', padding: '8px 0 20px' }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <BlockLabel>Hover in light mode</BlockLabel>
            <Tooltip content="--elevation-2 in light mode: subtle drop shadow, no border" position="bottom">
              <TriggerBtn>Light mode shadow</TriggerBtn>
            </Tooltip>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <BlockLabel>Switch to dark, then hover</BlockLabel>
            <Tooltip content="--elevation-2 in dark mode: 1px rgba(255,255,255,0.06) hairline embedded in the shadow token" position="bottom">
              <TriggerBtn>Dark mode hairline</TriggerBtn>
            </Tooltip>
          </div>

        </div>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
          color: 'var(--color-text-secondary)', margin: 0,
        }}>
          Use the Light / Dark toggle at the top to switch themes, then hover each button to inspect the tooltip's elevation.
          In dark mode, a 1px{' '}
          <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}>rgba(255,255,255,0.06)</code>
          {' '}hairline border is embedded inside{' '}
          <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}>--elevation-2</code>
          {' '}— no explicit CSS border in the component. The portal tooltip inherits the correct theme because StoryFrame's{' '}
          <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}>useEffect</code>
          {' '}syncs{' '}
          <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}>.dark</code>
          {' '}to{' '}
          <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}>document.body</code>.
        </p>
      </InfoBox>
    </div>

    <Divider />

    {/* ──────────────────────────────────────────────────────────────────────── */}
    {/* SECTION 7 — Reference tables                                           */}
    {/* ──────────────────────────────────────────────────────────────────────── */}
    <SectionHead
      title="Props"
      description="All props accepted by the Tooltip component."
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
                fontFamily: 'var(--font-mono)', fontSize: '0.875rem',
                color: 'var(--color-text-primary)', whiteSpace: 'nowrap',
                borderBottom: i < PROPS.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
              }}>
                {prop.name}
              </td>
              <td style={{
                padding: '12px 16px',
                fontFamily: 'var(--font-mono)', fontSize: '0.875rem',
                color: 'var(--color-text-secondary)',
                borderBottom: i < PROPS.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
              }}>
                {prop.type}
              </td>
              <td style={{
                padding: '12px 16px',
                fontFamily: 'var(--font-mono)', fontSize: '0.875rem',
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

    <SectionHead
      title="Tokens"
      description="Every design token consumed by the Tooltip component."
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
                fontFamily: 'var(--font-mono)', fontSize: '0.875rem',
                color: 'var(--color-text-primary)', whiteSpace: 'nowrap',
                borderBottom: i < TOKENS.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
              }}>
                {row.token}
              </td>
              <td style={{
                padding: '12px 16px',
                fontFamily: 'var(--font-mono)', fontSize: '0.875rem',
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

  </StoryFrame>
);
