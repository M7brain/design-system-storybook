import React, { useState, useEffect } from 'react';
import { ToastProvider } from './ToastProvider.jsx';
import { useToast } from './useToast.js';
import { Toast } from './Toast.jsx';
import { Button } from '@/components/ui/Button/Button.jsx';

// ─────────────────────────────────────────────────────────────────────────────
// META
// ─────────────────────────────────────────────────────────────────────────────

export default {
  title: 'Components/Toast',
  parameters: {
    layout: 'fullscreen',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS — StoryFrame copied from Button.stories.jsx, plus the document.body
// dark-sync used by Tooltip/DateTimePicker/FileUpload/IconButton — required
// here too, since Toast's viewport is a createPortal into document.body,
// outside this file's own .dark wrapper div.
// ─────────────────────────────────────────────────────────────────────────────

function StoryFrame({ children }) {
  const [isDark, setIsDark] = useState(false);

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

function Note({ children }) {
  return (
    <p style={{
      fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
      color: 'var(--color-text-secondary)', margin: '16px 0 0 0',
    }}>
      {children}
    </p>
  );
}

function noop() {}

// ─────────────────────────────────────────────────────────────────────────────
// STATIC DEMO DATA — for sections that render the presentational Toast item
// directly (at rest), rather than firing one through the imperative API.
// ─────────────────────────────────────────────────────────────────────────────

const TONE_DEMOS = [
  { id: 'demo-success', tone: 'success', title: 'Settings saved', status: 'resting' },
  { id: 'demo-error', tone: 'error', title: 'Delivery failed', description: 'SMS + email failed after 3 retries.', status: 'resting' },
  { id: 'demo-info', tone: 'info', title: 'Webhook connected', status: 'resting' },
];

const ANATOMY_TOAST = {
  id: 'anatomy',
  tone: 'error',
  title: 'Delivery failed',
  description: 'SMS + email failed after 3 retries. Contact the lead manually.',
  action: { label: 'Retry', onClick: () => {} },
  status: 'resting',
};

const ANATOMY_PARTS = [
  { label: 'Header row', description: 'Fixed, vertically-centred row: icon, title, optional inline action, close — always share one centreline, regardless of how tall the body underneath grows. This is the fix for the close-X drift on multi-line toasts.' },
  { label: 'Status icon', description: 'DIRECTION 2 — an OUTLINE icon (CheckCircle2 / XCircle / Info), 24px, via the Icon wrapper size "lg". No filled circle, no background box. Stroke colour is --color-status-{tone}-text — the same token the title uses, so icon + title read as one coloured unit.' },
  { label: 'Title', description: '--text-body-lg Inter 500, --color-status-{tone}-text (tone-coloured), the NATURAL 1.5rem line-height — not the tight single-line override used elsewhere, since a title can wrap. flex:1 in the header row.' },
  { label: 'Action', description: 'Optional, single only. Button variant="ghost" size="sm" in its NATIVE brand-orange label colour — no override, reinforcing "orange = clickable". Placement is conditional: inline in the header row (next to the title) when there is no description, or left-aligned in the body below the description when there is one. Presence makes the toast persistent regardless of tone.' },
  { label: 'Close', description: 'Always present, in the header row. IconButton variant="plain" (transparent in every state, no hover box) size="sm" icon={X} aria-label="Dismiss" — the swipe-gesture fallback. "plain" instead of "ghost" so it doesn’t add a second hover-fill box competing with the card’s own elevation.' },
  { label: 'Body', description: 'Renders only when a description is present. Offset margin-left: calc(--space-6 + --space-3) so it aligns under the TITLE, past the icon. Contains the description and, if present, the left-aligned body action.' },
  { label: 'Description', description: 'Optional, one supporting line, lives in the body. --text-body-md Inter 400, --color-text-secondary, clamped to 2 lines mobile / 3 lines total.' },
];

const BEHAVIOUR_NOTES = [
  { title: '5000ms auto-dismiss', description: 'success and info auto-dismiss after --duration-toast (5000ms), read live via getComputedStyle — never hardcoded.' },
  { title: 'Error + action are persistent', description: 'error never auto-dismisses. Any toast with an action is also persistent regardless of tone (Carbon rule) — if there’s something to do about it, it must not disappear first.' },
  { title: 'Pause on hover / focus', description: 'Pointerenter or focusin anywhere in the toast pauses its timer; pointerleave/focusout resumes it. Also paused while the tab is hidden. Remaining time is tracked, never restarted (WCAG 2.2.1).' },
  { title: 'Swipe-to-dismiss', description: 'Drag up on mobile-top, right on desktop. The close button is the always-present fallback for anyone who can’t or doesn’t swipe.' },
  { title: 'role=status vs role=alert', description: 'success/info use role="status" + aria-live="polite" (announced without interrupting). error uses role="alert" + aria-live="assertive" (interrupts).' },
  { title: 'Position', description: 'Mobile (< 600px): top-centre, full width minus 16px gutters. Desktop (≥ 600px): top-right, fixed 400px width.' },
  { title: 'Max 3 + queue', description: 'At most 3 visible at once, newest on top. The rest queue in FIFO arrival order and promote only once an active toast finishes exiting.' },
];

const REFERENCE_ROWS = [
  {
    tone: 'success',
    duration: '5000ms (--duration-toast)',
    role: 'status / polite',
    dismiss: 'Auto after 5000ms (paused on hover/focus/hidden tab) · close button · swipe',
    tokens: '--color-status-success-text (icon + title)',
  },
  {
    tone: 'error',
    duration: 'Persistent — no auto-dismiss',
    role: 'alert / assertive',
    dismiss: 'Manual only — close button or swipe',
    tokens: '--color-status-error-text (icon + title)',
  },
  {
    tone: 'info',
    duration: '5000ms (--duration-toast)',
    role: 'status / polite',
    dismiss: 'Auto after 5000ms (paused on hover/focus/hidden tab) · close button · swipe',
    tokens: '--color-status-info-text (icon + title)',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// LIVE TRIGGERS — the only section that drives real toasts through the
// imperative API. Must be a descendant of <ToastProvider>.
// ─────────────────────────────────────────────────────────────────────────────

function LiveTriggersDemo() {
  const toast = useToast();

  return (
    <InfoBox style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
      <Button size="sm" onClick={() => toast.success('Settings saved')}>
        Show success
      </Button>
      <Button
        size="sm"
        variant="secondary"
        onClick={() => toast.info('Copied', { description: 'Webhook URL copied to clipboard.' })}
      >
        Show info with description
      </Button>
      <Button
        size="sm"
        variant="secondary"
        onClick={() => toast.success('Reply sent', { action: { label: 'Undo', onClick: () => toast.info('Undone') } })}
      >
        Show success with action
      </Button>
      <Button
        size="sm"
        variant="destructive"
        onClick={() =>
          toast.error('Delivery failed', {
            description: 'SMS + email failed after 3 retries. Contact the lead manually.',
            action: { label: 'Retry', onClick: () => toast.info('Retrying…') },
          })
        }
      >
        Show persistent error with description + action
      </Button>
    </InfoBox>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STORY EXPORT
// ─────────────────────────────────────────────────────────────────────────────

export const Overview = () => (
  <StoryFrame>
    <ToastProvider>

      {/* ── Page header ────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: '48px' }}>
        <h1 style={{
          fontFamily: 'Outfit, sans-serif', fontSize: '1.75rem', fontWeight: 700,
          lineHeight: '2.25rem', letterSpacing: '-0.02em',
          color: 'var(--color-text-primary)', margin: '0 0 8px 0',
        }}>
          Toast
        </h1>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 400,
          lineHeight: '1.75rem', color: 'var(--color-text-secondary)', margin: 0,
        }}>
          A transient, floating, auto-dismissing confirmation shown after a user action — not Alert/Banner
          (standing, persistent, built separately). 3 tones only: success, error, info. Imperative API via
          useToast() — ToastProvider wraps the app once, near root. Direction 2: an outline status icon and a
          tone-coloured title on a plain surface, not a filled circle badge.
        </p>
      </div>

      {/* ── 1. Live triggers ──────────────────────────────────────────────────── */}
      <SectionHead
        title="Live triggers"
        description="Fires real toasts through the imperative API — watch them enter, stack, pause on hover/focus, and exit, in both themes."
      />
      <div style={{ marginBottom: '40px' }}>
        <LiveTriggersDemo />
        <Note>
          Hover a toast to pause its auto-dismiss timer, or drag it (up on mobile, right on desktop) to dismiss
          it early. Toggle Light/Dark above before firing — the portal viewport syncs to the same theme.
        </Note>
      </div>

      <Divider />

      {/* ── 2. Tones ──────────────────────────────────────────────────────────── */}
      <SectionHead
        title="Tones"
        description="All 3 tones at rest, rendered directly (not triggered) so every one is visible without waiting."
      />
      <div style={{ marginBottom: '40px' }}>
        <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', maxWidth: '400px' }}>
          {TONE_DEMOS.map((t) => (
            <Toast key={t.id} toast={t} isDesktop onDismiss={noop} onPause={noop} onResume={noop} />
          ))}
        </ol>
        <Note>
          DIRECTION 2: all three are outline icons (no filled circle), stroke-coloured to match their title. The
          info icon in particular is now a single ring — the original filled-circle-inside-a-ring read as
          a confusing double-ring at a glance. This row also shows both single-line shapes (success, info — width
          shrinks to content on desktop) and the multi-line shape (error, with a description — the fixed, centred
          header row (icon · title · close) stays on one line, and the body grows beneath it).
        </Note>
      </div>

      <Divider />

      {/* ── 2.5. Action placement ─────────────────────────────────────────────── */}
      <SectionHead
        title="Action placement"
        description="An action renders in exactly one of two places, never both — inline in the header when there's no description, or left-aligned in the body when there is."
      />
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', maxWidth: '400px' }}>
          <div>
            <BlockLabel>Title only + inline action</BlockLabel>
            <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              <Toast
                toast={{ id: 'action-inline', tone: 'success', title: 'Reply sent', action: { label: 'Undo', onClick: () => {} }, status: 'resting' }}
                isDesktop
                onDismiss={noop}
                onPause={noop}
                onResume={noop}
              />
            </ol>
          </div>
          <div>
            <BlockLabel>Title + description + body action</BlockLabel>
            <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              <Toast
                toast={{
                  id: 'action-body',
                  tone: 'error',
                  title: 'Delivery failed',
                  description: 'SMS + email failed after 3 retries. Contact the lead manually.',
                  action: { label: 'Retry', onClick: () => {} },
                  status: 'resting',
                }}
                isDesktop
                onDismiss={noop}
                onPause={noop}
                onResume={noop}
              />
            </ol>
          </div>
        </div>
        <Note>
          The action is Button variant="ghost" size="sm" in its native brand-orange label colour — no override —
          reinforcing "orange = clickable" across Quicklo. Inline (top): sits between the title and close, on the
          same centred header row. Body (bottom): sits below the description, left-aligned, offset so its label —
          not its padded edge — lines up flush with the title/description text above it. Both forms make the toast
          persistent regardless of tone.
        </Note>
      </div>

      <Divider />

      {/* ── 3. Anatomy ────────────────────────────────────────────────────────── */}
      <SectionHead
        title="Anatomy"
        description="One instance with every optional part present, annotated below."
      />
      <div style={{ marginBottom: '40px' }}>
        <ol style={{ listStyle: 'none', margin: '0 0 16px 0', padding: 0, maxWidth: '400px' }}>
          <Toast toast={ANATOMY_TOAST} isDesktop onDismiss={noop} onPause={noop} onResume={noop} />
        </ol>
        <InfoBox>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {ANATOMY_PARTS.map((p) => (
              <div key={p.label} style={{ display: 'flex', gap: '8px', fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem' }}>
                <strong style={{ color: 'var(--color-text-primary)', flexShrink: 0, whiteSpace: 'nowrap' }}>{p.label}</strong>
                <span style={{ color: 'var(--color-text-secondary)' }}>{p.description}</span>
              </div>
            ))}
          </div>
        </InfoBox>
      </div>

      <Divider />

      {/* ── 4. Behaviour ──────────────────────────────────────────────────────── */}
      <SectionHead
        title="Behaviour"
        description="The rules governing timing, dismissal, and accessibility."
      />
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '16px',
        marginBottom: '40px',
      }}>
        {BEHAVIOUR_NOTES.map((n) => (
          <InfoBox key={n.title}>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
              {n.title}
            </div>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-secondary)', margin: 0 }}>
              {n.description}
            </p>
          </InfoBox>
        ))}
      </div>

      <Divider />

      {/* ── 5. Reference table ────────────────────────────────────────────────── */}
      <SectionHead
        title="Reference table"
        description="Tone, default duration, ARIA role, dismiss behaviour, and the tokens each tone consumes."
      />

      <div style={{ marginBottom: '16px' }}>
        <BlockLabel>Tones</BlockLabel>
        <div style={{
          background: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--color-bg-secondary)' }}>
                {['TONE', 'DEFAULT DURATION', 'ROLE / ARIA-LIVE', 'DISMISS BEHAVIOUR', 'TOKENS USED'].map((h) => (
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
              {REFERENCE_ROWS.map((row, i) => (
                <tr key={row.tone} style={{ background: i % 2 === 0 ? 'var(--color-bg-surface)' : 'var(--color-bg-primary)' }}>
                  <td style={{
                    padding: '12px 16px', minHeight: '44px',
                    fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem',
                    color: 'var(--color-text-primary)', whiteSpace: 'nowrap',
                    borderBottom: i < REFERENCE_ROWS.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                  }}>
                    {row.tone}
                  </td>
                  <td style={{
                    padding: '12px 16px',
                    fontFamily: 'Inter, sans-serif', fontSize: '0.875rem',
                    color: 'var(--color-text-primary)', whiteSpace: 'nowrap',
                    borderBottom: i < REFERENCE_ROWS.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                  }}>
                    {row.duration}
                  </td>
                  <td style={{
                    padding: '12px 16px',
                    fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem',
                    color: 'var(--color-text-primary)', whiteSpace: 'nowrap',
                    borderBottom: i < REFERENCE_ROWS.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                  }}>
                    {row.role}
                  </td>
                  <td style={{
                    padding: '12px 16px',
                    fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
                    color: 'var(--color-text-primary)',
                    borderBottom: i < REFERENCE_ROWS.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                  }}>
                    {row.dismiss}
                  </td>
                  <td style={{
                    padding: '12px 16px',
                    fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem',
                    color: 'var(--color-text-secondary)',
                    borderBottom: i < REFERENCE_ROWS.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                  }}>
                    {row.tokens}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Note>
          Shared, tone-independent tokens: --color-bg-surface (card), --radius-md, --elevation-2, --space-4
          padding on every side when a description is present / --space-3 vertical + --space-4 horizontal when
          it's title-only, --space-3 header-row gap (icon · title · optional inline action · close, all on one
          centred line), --space-6 + --space-3 body offset (aligns the body under the title), --text-body-lg /
          --text-body-md, --color-text-secondary (description), --color-interactive-default (action label — its
          native ghost colour, no override), --color-text-secondary/-primary (close icon), --duration-base +
          --ease-enter / --ease-exit (motion), --duration-toast (persistence timer, excluded from the
          reduced-motion collapse).
        </Note>
      </div>

    </ToastProvider>
  </StoryFrame>
);
