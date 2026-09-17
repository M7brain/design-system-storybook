import React, { useState, useEffect } from 'react';
import { IconButton } from './IconButton.jsx';
import { Tooltip } from '../Tooltip/index.js';
import {
  MoreHorizontal,
  RefreshCw,
  Trash2,
  Pencil,
  Settings,
  X,
} from '@/design-system/icons/index.js';

// ─────────────────────────────────────────────────────────────────────────────
// META
// ─────────────────────────────────────────────────────────────────────────────

export default {
  title: 'Components/Icon button',
  parameters: {
    layout: 'fullscreen',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function StoryFrame({ children }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Tooltip renders via createPortal into document.body, which sits outside
    // this wrapper's .dark class — sync it there too so the portal content
    // (Section 4, Tooltip composition) receives dark-mode token values.
    if (isDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
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

function Row({ children, gap = 16, style }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap, flexWrap: 'wrap', ...style }}>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const TOKENS = [
  // Ghost + Plain
  { token: '--color-text-secondary', value: '#707070 / #adadad', usage: 'Ghost + Plain icon at rest' },
  { token: '--color-text-primary', value: '#121212 / #fbfbfb', usage: 'Ghost + Plain icon on hover; Plain also on focus' },
  { token: '--color-bg-secondary', value: '#dddddd / #171717', usage: 'Ghost background on hover + active only — Plain never uses this token, by design' },
  { token: '--color-interactive-active', value: '#8a2e09 / #e48537', usage: 'Ghost + Plain icon on active/pressed' },
  // Secondary
  { token: '--color-interactive-secondary', value: '#eaeaea / #555555', usage: 'Secondary fill at rest' },
  { token: '--color-interactive-secondary-hover', value: '#dddddd / #707070', usage: 'Secondary fill on hover' },
  { token: '--color-interactive-secondary-active', value: '#adadad / #2a2a2a', usage: 'Secondary fill on active' },
  { token: '--color-text-on-interactive-secondary', value: '#555555 / #fbfbfb', usage: 'Secondary icon colour' },
  // Destructive
  { token: '--color-interactive-error', value: '#b91c1c (both)', usage: 'Destructive fill at rest' },
  { token: '--color-interactive-error-hover', value: '#a81919 (both)', usage: 'Destructive fill on hover' },
  { token: '--color-interactive-error-active', value: '#831414 (both)', usage: 'Destructive fill on active' },
  { token: '--color-text-on-interactive-error', value: '#ffffff (both)', usage: 'Destructive icon colour' },
  // Focus
  { token: '--color-focus-ring', value: '#c2410c / #fb923c', usage: 'Focus ring (via global *:focus-visible)' },
  // Shape + motion
  { token: '--radius-sm', value: '8px', usage: 'Button corner radius' },
  { token: '--opacity-disabled', value: '0.4', usage: 'Disabled opacity' },
  { token: '--duration-base', value: '200ms', usage: 'Hover + colour transitions' },
  { token: '--duration-instant', value: '50ms', usage: 'Active/pressed transition' },
  { token: '--duration-spinner', value: '700ms', usage: 'Loading spinner rotation' },
  { token: '--ease-default', value: 'cubic-bezier(0,0,0.2,1)', usage: 'Default easing' },
];

const PROPS = [
  { name: 'icon', type: 'ComponentType', defaultVal: '—', description: 'Lucide icon component from @/design-system/icons/index.js' },
  { name: 'variant', type: '"ghost" | "plain" | "secondary" | "destructive"', defaultVal: '"ghost"', description: 'Visual style. "plain" is transparent in every state (no hover fill), for contexts already sitting on their own elevated surface.' },
  { name: 'size', type: '"sm" | "md" | "lg"', defaultVal: '"sm"', description: '36 / 40 / 48px visual box' },
  { name: 'loading', type: 'boolean', defaultVal: 'false', description: 'Shows Loader2 spinner, aria-disabled="true", stays in tab order' },
  { name: 'disabled', type: 'boolean', defaultVal: 'false', description: 'Native disabled, removed from tab order, 0.4 opacity' },
  { name: 'aria-label', type: 'string', defaultVal: '— (required)', description: 'Mandatory — dev warning logged if absent' },
  { name: 'onClick', type: 'function', defaultVal: 'undefined', description: 'Suppressed automatically when loading=true' },
  { name: 'className', type: 'string', defaultVal: 'undefined', description: 'Merged via cn() for layout overrides only' },
  { name: 'ref', type: 'React.Ref', defaultVal: 'undefined', description: 'Forwarded to the <button> element (required for Tooltip)' },
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
        Icon button
      </h1>
      <p style={{
        fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 400,
        lineHeight: '1.75rem', color: 'var(--color-text-secondary)', margin: 0,
      }}>
        Square icon-only action button for secondary and destructive actions.
        4 variants · 3 sizes · 6 states. Always paired with a Tooltip and a mandatory aria-label.
      </p>
    </div>

    {/* ── Gallery ──────────────────────────────────────────────────────────── */}
    <SectionHead
      title="Gallery"
      description="Every variant, every size, every state — plus Tooltip composition and real usage context."
    />

    {/* Variants */}
    <div style={{ marginBottom: '40px' }}>
      <BlockLabel>Variants</BlockLabel>
      <InfoBox>
        <Row gap={24}>
          <div>
            <div style={{ marginBottom: '12px', fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
              Ghost (default)
            </div>
            <IconButton icon={MoreHorizontal} variant="ghost" size="md" aria-label="More options" />
          </div>
          <div>
            <div style={{ marginBottom: '12px', fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
              Plain
            </div>
            <IconButton icon={X} variant="plain" size="md" aria-label="Dismiss" />
          </div>
          <div>
            <div style={{ marginBottom: '12px', fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
              Secondary
            </div>
            <IconButton icon={RefreshCw} variant="secondary" size="md" aria-label="Refresh" />
          </div>
          <div>
            <div style={{ marginBottom: '12px', fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
              Destructive
            </div>
            <IconButton icon={Trash2} variant="destructive" size="md" aria-label="Delete" />
          </div>
        </Row>
      </InfoBox>
      <InfoBox style={{ marginTop: '16px' }}>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          <strong style={{ color: 'var(--color-text-primary)' }}>Ghost variant diverges from Button Ghost.</strong>
          {' '}Button Ghost uses brand-coloured text at rest with no background ever. IconButton Ghost uses{' '}
          <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>--color-text-secondary</code> at rest and adds{' '}
          <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>--color-bg-secondary</code> fill on hover. A solo icon
          shifting colour alone is a weak affordance — the background tint provides a stronger hover signal
          without requiring a text label to anchor it. Do not "fix" this to match Button Ghost.
        </p>
      </InfoBox>
      <InfoBox style={{ marginTop: '16px' }}>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          <strong style={{ color: 'var(--color-text-primary)' }}>Plain is transparent in EVERY state — including hover.</strong>
          {' '}Unlike Ghost, hovering a Plain button never shows a background fill — compare the two above by
          hovering each. The icon colour still shifts{' '}
          <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>--color-text-secondary</code> →{' '}
          <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>--color-text-primary</code> on hover AND focus, so the
          control stays legibly interactive — only the background stays inert. Use Plain for contexts that
          already sit on their own surface (a card with its own elevation, like Toast) where a second,
          competing hover box would be clutter.
        </p>
      </InfoBox>
    </div>

    {/* Sizes */}
    <div style={{ marginBottom: '40px' }}>
      <BlockLabel>Sizes — ghost variant</BlockLabel>
      <InfoBox>
        <Row gap={40} style={{ alignItems: 'flex-end' }}>
          {/* sm */}
          <div>
            <div style={{ marginBottom: '12px', fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              sm — 36×36px visual / 44×44px tap target (mobile)
            </div>
            <div style={{ position: 'relative', display: 'inline-flex' }}>
              <IconButton icon={MoreHorizontal} variant="ghost" size="sm" aria-label="More options small" />
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute', top: '50%', left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '44px', height: '44px',
                  border: '1.5px dashed var(--color-status-warning)',
                  borderRadius: '4px', pointerEvents: 'none',
                }}
              />
            </div>
          </div>

          {/* md */}
          <div>
            <div style={{ marginBottom: '12px', fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              md — 40×40px visual / 44×44px tap target (mobile)
            </div>
            <div style={{ position: 'relative', display: 'inline-flex' }}>
              <IconButton icon={MoreHorizontal} variant="ghost" size="md" aria-label="More options medium" />
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute', top: '50%', left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '44px', height: '44px',
                  border: '1.5px dashed var(--color-status-warning)',
                  borderRadius: '4px', pointerEvents: 'none',
                }}
              />
            </div>
          </div>

          {/* lg */}
          <div>
            <div style={{ marginBottom: '12px', fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              lg — 48×48px visual (already ≥ 44px)
            </div>
            <div style={{ position: 'relative', display: 'inline-flex' }}>
              <IconButton icon={MoreHorizontal} variant="ghost" size="lg" aria-label="More options large" />
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute', top: '50%', left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '48px', height: '48px',
                  border: '1.5px solid var(--color-status-success)',
                  borderRadius: '4px', pointerEvents: 'none',
                }}
              />
            </div>
          </div>
        </Row>
      </InfoBox>
      <InfoBox style={{ marginTop: '16px' }}>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          <strong style={{ color: 'var(--color-text-primary)' }}>Touch target annotation legend:</strong>
          {' '}
          <span style={{ color: 'var(--color-status-warning)' }}>— — dashed orange</span>
          {' '}= ::before pseudo-element expands hit area to 44×44px on mobile (collapses at lg+).{' '}
          <span style={{ color: 'var(--color-status-success)' }}>— solid green</span>
          {' '}= visual size already meets the 44px floor; no expansion needed.
        </p>
      </InfoBox>
    </div>

    {/* States */}
    <div style={{ marginBottom: '40px' }}>
      <BlockLabel>States — ghost variant (live interactive)</BlockLabel>
      <p style={{
        fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
        color: 'var(--color-text-secondary)', margin: '0 0 16px 0',
      }}>
        Hover, focus, and active states are live. Tab to each button to trigger the focus ring.
      </p>
      <InfoBox>
        <Row gap={32}>
          <div style={{ textAlign: 'center' }}>
            <IconButton icon={MoreHorizontal} variant="ghost" size="md" aria-label="Default state" />
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '8px' }}>Default</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <IconButton icon={MoreHorizontal} variant="ghost" size="md" aria-label="Hover — hover me" />
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '8px' }}>Hover (hover me)</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <IconButton icon={MoreHorizontal} variant="ghost" size="md" aria-label="Focus — tab to me" />
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '8px' }}>Focus (tab to me)</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <IconButton icon={MoreHorizontal} variant="ghost" size="md" aria-label="Active — click and hold" />
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '8px' }}>Active (hold click)</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <IconButton icon={MoreHorizontal} variant="ghost" size="md" loading aria-label="Loading state" />
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '8px' }}>Loading</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <IconButton icon={MoreHorizontal} variant="ghost" size="md" disabled aria-label="Disabled state" />
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '8px' }}>Disabled</p>
          </div>
        </Row>
      </InfoBox>

      <div style={{ marginTop: '32px' }}>
        <BlockLabel>States — plain variant (live interactive)</BlockLabel>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
          color: 'var(--color-text-secondary)', margin: '0 0 16px 0',
        }}>
          Same four states as Ghost above — hover and focus this row and compare: the icon colour still shifts,
          but the background never fills in, in any state.
        </p>
        <InfoBox>
          <Row gap={32}>
            <div style={{ textAlign: 'center' }}>
              <IconButton icon={X} variant="plain" size="md" aria-label="Default state" />
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '8px' }}>Default</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <IconButton icon={X} variant="plain" size="md" aria-label="Hover — hover me" />
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '8px' }}>Hover (hover me — no fill)</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <IconButton icon={X} variant="plain" size="md" aria-label="Focus — tab to me" />
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '8px' }}>Focus (tab to me — no fill)</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <IconButton icon={X} variant="plain" size="md" disabled aria-label="Disabled state" />
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '8px' }}>Disabled</p>
            </div>
          </Row>
        </InfoBox>
      </div>

      <div style={{ marginTop: '32px' }}>
        <BlockLabel>Loading vs disabled — critical distinction</BlockLabel>
        <InfoBox>
          <Row gap={32}>
            <div>
              <div style={{ marginBottom: '12px', fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                Loading — stays in tab order, full opacity, aria-disabled="true"
              </div>
              <IconButton icon={RefreshCw} variant="secondary" size="md" loading aria-label="Syncing data" />
            </div>
            <div>
              <div style={{ marginBottom: '12px', fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                Disabled — native disabled attr, removed from tab order, 0.4 opacity
              </div>
              <IconButton icon={RefreshCw} variant="secondary" size="md" disabled aria-label="Sync unavailable" />
            </div>
          </Row>
        </InfoBox>
      </div>

      <InfoBox style={{ marginTop: '16px' }}>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          <strong style={{ color: 'var(--color-text-primary)' }}>Focus ring:</strong>
          {' '}Implemented via the global{' '}
          <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>*:focus-visible</code> rule in globals.css (CSS{' '}
          <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>outline</code>, not Tailwind{' '}
          <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>ring-*</code> box-shadow). Matches the convention used
          by Input, Checkbox, and Toggle. Button uses <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>ring-2</code>
          {' '}— IconButton intentionally does not.
        </p>
      </InfoBox>
    </div>

    {/* Tooltip composition (LIVE) */}
    <div style={{ marginBottom: '40px' }}>
      <BlockLabel>Tooltip composition — live interactive</BlockLabel>
      <p style={{
        fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
        color: 'var(--color-text-secondary)', margin: '0 0 16px 0',
      }}>
        Hover each button to verify Tooltip positioning. IconButton is{' '}
        <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>React.forwardRef</code> and spreads{' '}
        <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>...rest</code> — Tooltip's{' '}
        <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>React.cloneElement</code> attaches its ref and event
        handlers automatically with zero adapter code.
      </p>
      <InfoBox>
        <Row gap={40}>
          <div style={{ textAlign: 'center' }}>
            <Tooltip content="Delete connection" type="label" position="top">
              <IconButton icon={Trash2} variant="destructive" size="md" aria-label="Delete connection" />
            </Tooltip>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '12px' }}>
              Destructive + top
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Tooltip content="More options" type="label" position="bottom">
              <IconButton icon={MoreHorizontal} variant="ghost" size="md" aria-label="More options" />
            </Tooltip>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '12px' }}>
              Ghost + bottom
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Tooltip content="Refresh data" type="label" position="right">
              <IconButton icon={RefreshCw} variant="secondary" size="md" aria-label="Refresh data" />
            </Tooltip>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '12px' }}>
              Secondary + right
            </p>
          </div>
        </Row>
      </InfoBox>
      <InfoBox style={{ marginTop: '16px' }}>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          <strong style={{ color: 'var(--color-text-primary)' }}>Use type="label" when wrapping an icon-only button.</strong>
          {' '}The tooltip content becomes the accessible name via{' '}
          <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>aria-labelledby</code>, supplementing the{' '}
          <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>aria-label</code> fallback for when the tooltip has not yet
          appeared. No changes to IconButton are needed — forwardRef + rest spread handles everything.
        </p>
      </InfoBox>
    </div>

    {/* Real usage context */}
    <div style={{ marginBottom: '40px' }}>
      <BlockLabel>Row context — ghost, quiet</BlockLabel>
      <p style={{
        fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
        color: 'var(--color-text-secondary)', margin: '0 0 16px 0',
      }}>
        Secondary actions appear at rest; ghost keeps the row clean.
      </p>

      {/* Simulated lead row */}
      <div
        style={{
          background: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: 'var(--elevation-1)',
          marginBottom: '8px',
        }}
      >
        <div>
          <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-primary)', fontFamily: 'Inter, sans-serif' }}>
            Sarah Mitchell
          </p>
          <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontFamily: 'Inter, sans-serif' }}>
            HVAC repair · 2 min ago
          </p>
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          <Tooltip content="Edit note" type="label" position="top">
            <IconButton icon={Pencil} variant="ghost" size="sm" aria-label="Edit note" />
          </Tooltip>
          <Tooltip content="More options" type="label" position="top">
            <IconButton icon={MoreHorizontal} variant="ghost" size="sm" aria-label="More options" />
          </Tooltip>
        </div>
      </div>

      <div
        style={{
          background: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: 'var(--elevation-1)',
        }}
      >
        <div>
          <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-primary)', fontFamily: 'Inter, sans-serif' }}>
            James Rowe
          </p>
          <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontFamily: 'Inter, sans-serif' }}>
            Plumbing emergency · 8 min ago
          </p>
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          <Tooltip content="Edit note" type="label" position="top">
            <IconButton icon={Pencil} variant="ghost" size="sm" aria-label="Edit note" />
          </Tooltip>
          <Tooltip content="More options" type="label" position="top">
            <IconButton icon={MoreHorizontal} variant="ghost" size="sm" aria-label="More options" />
          </Tooltip>
        </div>
      </div>

      <div style={{ marginTop: '32px' }}>
        <BlockLabel>Header context — secondary, visible boundary</BlockLabel>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
          color: 'var(--color-text-secondary)', margin: '0 0 16px 0',
        }}>
          Secondary variant provides a visible fill for actions placed on the page background.
        </p>

        {/* Simulated panel header */}
        <div
          style={{
            background: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border-default)',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            boxShadow: 'var(--elevation-1)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              borderBottom: '1px solid var(--color-border-default)',
            }}
          >
            <p style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-primary)', fontFamily: 'Inter, sans-serif' }}>
              Connections
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Tooltip content="Refresh connections" type="label" position="top">
                <IconButton icon={RefreshCw} variant="secondary" size="sm" aria-label="Refresh connections" />
              </Tooltip>
              <Tooltip content="Settings" type="label" position="top">
                <IconButton icon={Settings} variant="secondary" size="sm" aria-label="Settings" />
              </Tooltip>
            </div>
          </div>
          <div style={{ padding: '20px', color: 'var(--color-text-secondary)', fontSize: '0.875rem', fontFamily: 'Inter, sans-serif' }}>
            Panel content…
          </div>
        </div>
      </div>
    </div>

    <Divider />

    {/* ── Usage guide ──────────────────────────────────────────────────────── */}
    <SectionHead
      title="Usage guide"
      description="Which variant to reach for first, and the rules that apply to every instance."
    />

    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '16px',
      marginBottom: '40px',
    }}>
      <InfoBox>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <IconButton icon={MoreHorizontal} variant="ghost" size="md" aria-label="Ghost (default)" />
          <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>Ghost (default)</p>
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          Secondary actions embedded in list rows, table rows, and cards. Quiet at rest; hover tint confirms interactivity.
        </p>
      </InfoBox>

      <InfoBox>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <IconButton icon={RefreshCw} variant="secondary" size="md" aria-label="Secondary" />
          <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>Secondary</p>
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          Actions in headers, toolbars, or on plain page backgrounds where a visible filled resting state provides needed affordance.
        </p>
      </InfoBox>

      <InfoBox>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <IconButton icon={Trash2} variant="destructive" size="md" aria-label="Destructive" />
          <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>Destructive</p>
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          Irreversible actions only (delete, remove, disconnect). Always pair with a confirmation modal before execution.
        </p>
      </InfoBox>
    </div>

    <InfoBox style={{ marginBottom: '40px' }}>
      {[
        {
          title: 'aria-label is required on every instance',
          body: 'There is no visible text label. A dev warning is logged in non-production environments when aria-label is missing. Screen readers announce the label; Tooltip\'s aria-labelledby supplements it at runtime.',
        },
        {
          title: 'Always wrap icon-only buttons in Tooltip',
          body: 'A Tooltip with type="label" is the primary disclosure mechanism for the action\'s name. The forwardRef + rest spread pattern means zero adapter code is required.',
        },
        {
          title: '44×44px minimum tap target — always met',
          body: 'sm and md sizes expand their hit area via a ::before pseudo-element on mobile (collapses at lg+). lg (48px) already exceeds the floor. Never suppress or override the ::before classes.',
        },
        {
          title: 'No Primary variant',
          body: 'Use Button (size="md", variant="primary") when you need a primary CTA. IconButton has no primary variant — icon-only primary actions lack text context and degrade accessibility.',
        },
        {
          title: 'Import icons from the design system, not lucide-react directly',
          body: 'Always use: import { Trash2, RefreshCw } from \'@/design-system/icons/index.js\'. Never import from lucide-react directly.',
        },
      ].map(({ title, body }, i, arr) => (
        <div
          key={title}
          style={{
            paddingBottom: i < arr.length - 1 ? '16px' : 0,
            marginBottom: i < arr.length - 1 ? '16px' : 0,
            borderBottom: i < arr.length - 1 ? '1px solid var(--color-border-default)' : 'none',
          }}
        >
          <p style={{ margin: '0 0 4px', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', fontFamily: 'Inter, sans-serif' }}>{title}</p>
          <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-secondary)', fontFamily: 'Inter, sans-serif' }}>{body}</p>
        </div>
      ))}
    </InfoBox>

    <Divider />

    {/* ── Reference table ──────────────────────────────────────────────────── */}
    <SectionHead
      title="Reference table"
      description="All props accepted by the IconButton component, plus every design token it consumes."
    />

    <div style={{ marginBottom: '40px' }}>
      <BlockLabel>Component props</BlockLabel>
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

    <div style={{ marginBottom: '16px' }}>
      <BlockLabel>Design tokens — {TOKENS.length} tokens</BlockLabel>
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
      <p style={{
        fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
        color: 'var(--color-text-secondary)', margin: '16px 0 0 0',
      }}>
        All values sourced from <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>src/design-system/tokens/globals.css</code>.
        Components reference semantic tokens only — never primitives or raw hex.
      </p>
    </div>

  </StoryFrame>
);
