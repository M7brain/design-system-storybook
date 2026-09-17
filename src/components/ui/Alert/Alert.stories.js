import React, { useState } from 'react';
import { Alert } from './Alert.jsx';

// ─────────────────────────────────────────────────────────────────────────────
// META
// ─────────────────────────────────────────────────────────────────────────────

export default {
  title: 'Components/Alert',
  parameters: {
    layout: 'fullscreen',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS — StoryFrame copied verbatim from Button.stories.jsx / the style
// guide. Alert renders inline (no portal), so unlike Toast this file does NOT
// need the document.body dark-sync hack — StoryFrame's local .dark wrapper
// is sufficient on its own.
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
// LIVE DEMO SUBCOMPONENTS — dismissible alerts need their own local state so
// the X actually removes the instance, with a reset affordance so a reviewer
// can bring it back without reloading the story.
// ─────────────────────────────────────────────────────────────────────────────

function DismissibleDemo() {
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return (
      <div style={{ maxWidth: '640px' }}>
        <button
          onClick={() => setVisible(true)}
          style={{
            height: '36px', padding: '0 16px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border-default)',
            background: 'transparent', color: 'var(--color-text-secondary)',
            fontFamily: 'Inter', fontWeight: 500, fontSize: '0.875rem', cursor: 'pointer',
          }}
        >
          Reset — bring the alert back
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '640px' }}>
      <Alert
        tone="info"
        title="Webhook connected"
        description="New leads from your contact form will now reply within 90 seconds."
        dismissible
        onDismiss={() => setVisible(false)}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STORY EXPORT — single Overview export, per the style guide
// ─────────────────────────────────────────────────────────────────────────────

export const Overview = () => (
  <StoryFrame>

    {/* ── Page header ────────────────────────────────────────────────────── */}
    <div style={{ marginBottom: '48px' }}>
      <h1 style={{
        fontFamily: 'Outfit, sans-serif', fontSize: '1.75rem', fontWeight: 700,
        lineHeight: '2.25rem', letterSpacing: '-0.02em',
        color: 'var(--color-text-primary)', margin: '0 0 8px 0',
      }}>
        Alert
      </h1>
      <p style={{
        fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 400,
        lineHeight: '1.75rem', color: 'var(--color-text-secondary)', margin: 0,
      }}>
        A persistent, inline status message for standing conditions — distinct from Toast, which is transient.
      </p>
    </div>

    {/* ── 1. Tones ──────────────────────────────────────────────────────────── */}
    <SectionHead
      title="Tones"
      description="All four tones — info, success, warning, error — in the default block layout, so the tint/border/icon/title treatment is comparable side by side. Warning lives here and on Badge; Toast never carries it."
    />
    <div style={{ marginBottom: '40px', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', maxWidth: '640px' }}>
      <Alert tone="info" title="Webhook connected" description="New leads from your contact form will now reply within 90 seconds." />
      <Alert tone="success" title="Business profile complete" description="Your AI replies are now personalised with your services, hours, and service area." />
      <Alert tone="warning" title="No leads received in 9 days" description="Your contact form connection looks idle. Confirm it's still pointing at Quicklo." />
      <Alert tone="error" title="Delivery failed" description="SMS and email both failed after 3 retries. Contact this lead manually." />
    </div>

    <Divider />

    {/* ── 2. Layouts ────────────────────────────────────────────────────────── */}
    <SectionHead
      title="Layouts"
      description="The same content, rendered as block (comfortable/stacked) vs inline (compact/single-row) — layout is a shape choice, not a tone choice."
    />
    <div style={{ marginBottom: '40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
      <div>
        <BlockLabel>layout=&quot;block&quot; (default)</BlockLabel>
        <Alert
          tone="warning"
          layout="block"
          title="Approaching your plan limit"
          description="You've used 42 of 50 leads this month on the Starter plan."
          actions={[{ label: 'Upgrade', onClick: noop }]}
        />
      </div>
      <div>
        <BlockLabel>layout=&quot;inline&quot;</BlockLabel>
        <Alert
          tone="warning"
          layout="inline"
          title="Approaching your plan limit"
          description="42 of 50 leads used"
          actions={[{ label: 'Upgrade', onClick: noop }]}
        />
      </div>
    </div>
    <Note>
      Block stacks the description and action below a fixed header row. Inline keeps everything on one row —
      title, a short secondary description, and a single action — wrapping gracefully if it doesn't fit. Inline
      is documented as short-content-only; a second action passed to an inline Alert is silently dropped.
    </Note>

    <Divider />

    {/* ── 3. Content shapes ────────────────────────────────────────────────── */}
    <SectionHead
      title="Content shapes"
      description="One tone (warning), every shape — demonstrates the header-row/body structure and the conditional action placement it reuses from the 2026-07-07 Toast fix pass."
    />
    <div style={{ marginBottom: '40px', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', maxWidth: '640px' }}>
      <div>
        <BlockLabel>Title only</BlockLabel>
        <Alert tone="warning" title="AI is paused" />
      </div>
      <div>
        <BlockLabel>Title + inline action (layout=&quot;inline&quot;)</BlockLabel>
        <Alert tone="warning" layout="inline" title="AI is paused" actions={[{ label: 'Resume', onClick: noop }]} />
      </div>
      <div>
        <BlockLabel>Title + description</BlockLabel>
        <Alert tone="warning" title="AI is paused" description="Replies are not being sent automatically. Resume to start responding within 90 seconds again." />
      </div>
      <div>
        <BlockLabel>Title + description + action</BlockLabel>
        <Alert
          tone="warning"
          title="AI is paused"
          description="Replies are not being sent automatically. Resume to start responding within 90 seconds again."
          actions={[{ label: 'Resume', onClick: noop }]}
        />
      </div>
    </div>

    <Divider />

    {/* ── 4. Dismissible vs non-dismissible ────────────────────────────────── */}
    <SectionHead
      title="Dismissible vs non-dismissible"
      description="Dismiss is opt-in, and the policy is enforced by the consumer, not the component."
    />
    <div style={{ marginBottom: '40px', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <BlockLabel>Dismissible — info, resolved on click</BlockLabel>
        <DismissibleDemo />
        <Note>Click the × — the alert actually removes itself (fade + height-collapse). Use Reset to bring it back.</Note>
      </div>
      <div>
        <BlockLabel>Non-dismissible — error, unresolved condition</BlockLabel>
        <div style={{ maxWidth: '640px' }}>
          <Alert
            tone="error"
            title="Payment failed"
            description="We couldn't charge your card on file. Update your payment method to avoid a service interruption."
            actions={[{ label: 'Update payment method', onClick: noop }]}
          />
        </div>
        <Note>
          No close control. An error or warning representing an unresolved or blocking condition should be
          rendered <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>dismissible={'{false}'}</code> —
          dismissing the message doesn't resolve the condition it describes.
        </Note>
      </div>
    </div>

    <Divider />

    {/* ── 5. In context ─────────────────────────────────────────────────────── */}
    <SectionHead
      title="In context"
      description="Real Quicklo usage — Connections, Billing, and the AI pause switch."
    />
    <div style={{ marginBottom: '40px', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', maxWidth: '640px' }}>
      <div>
        <BlockLabel>Settings → Connections</BlockLabel>
        <Alert
          tone="warning"
          title="No leads received recently"
          description="Your contact form hasn't sent a lead to Quicklo in 9 days. Is it still pointing at Quicklo?"
          actions={[{ label: 'View setup guide', onClick: noop }]}
        />
      </div>
      <div>
        <BlockLabel>Billing — failed payment</BlockLabel>
        <Alert
          tone="error"
          title="Payment failed"
          description="We couldn't charge your card on file for this month's plan. Update your payment method to keep replies going out."
          actions={[{ label: 'Update payment method', onClick: noop }]}
        />
      </div>
      <div>
        <BlockLabel>AI paused (global)</BlockLabel>
        <Alert
          tone="warning"
          title="AI is paused"
          description="New leads won't get an automatic reply until you resume. Reply manually in the meantime."
          actions={[{ label: 'Resume', onClick: noop }]}
        />
      </div>
      <div>
        <BlockLabel>Billing — plan limit</BlockLabel>
        <Alert
          tone="info"
          title="Approaching your plan limit"
          description="You've used 42 of 50 leads this month on the Starter plan. Upgrade to Pro for 200 leads and analytics."
          actions={[{ label: 'Upgrade', onClick: noop }]}
        />
      </div>
    </div>

    <Divider />

    {/* ── 6. Usage guide ────────────────────────────────────────────────────── */}
    <SectionHead
      title="Usage guide"
      description="When to reach for Alert, and how to configure it."
    />
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '16px',
      marginBottom: '40px',
    }}>
      <InfoBox>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
          Alert vs Toast vs NotificationItem
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          <strong>Alert</strong> is standing — it stays until resolved or dismissed. <strong>Toast</strong> is
          transient — it auto-dismisses in 5s unless it's an error or carries an action. <strong>NotificationItem</strong>{' '}
          (Patterns phase) is a feed row representing history, not a live status. Don't use Alert for a one-shot
          confirmation — that's Toast.
        </p>
      </InfoBox>

      <InfoBox>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
          block vs inline
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          Use <strong>block</strong> (default) whenever there's a description — it's the comfortable, stacked
          form. Use <strong>inline</strong> only for short, single-row content that genuinely fits one line;
          it caps at a single action and wraps rather than overflows if content runs long.
        </p>
      </InfoBox>

      <InfoBox>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
          Dismissible policy
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          Dismiss is opt-in (<code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>dismissible</code> defaults
          to false). An error or warning describing an unresolved or blocking condition should stay non-dismissible
          — hiding the message doesn't fix the condition.
        </p>
      </InfoBox>

      <InfoBox>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
          Title carries the meaning
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          The tint and icon reinforce severity — they never carry it alone (WCAG 1.4.1). The title text must
          state the severity in words a screen reader announces regardless of colour.
        </p>
      </InfoBox>

      <InfoBox>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
          Max 2 actions
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          Up to 2 in block layout, primary first; only the first renders in inline layout. More than that and the
          alert is doing too much — split the condition into two alerts or move a secondary action into the page.
        </p>
      </InfoBox>

      <InfoBox>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
          &quot;Banner&quot; is not a separate component
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          A full-width page banner is this same Alert component, rendered at the width of its container. Don't
          build a separate Banner — widen the container instead.
        </p>
      </InfoBox>
    </div>

    <Divider />

    {/* ── 7. Reference table ────────────────────────────────────────────────── */}
    <SectionHead
      title="Reference table"
      description="Every token Alert consumes, plus its two composed controls."
    />
    <div style={{
      background: 'var(--color-bg-surface)',
      border: '1px solid var(--color-border-default)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      marginBottom: '16px',
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'var(--color-bg-secondary)' }}>
            {['TOKEN', 'VALUE (LIGHT / DARK)', 'USAGE'].map((h) => (
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
            <tr key={row.token} style={{ background: i % 2 === 0 ? 'var(--color-bg-surface)' : 'var(--color-bg-primary)' }}>
              <td style={{
                padding: '12px 16px', minHeight: '44px',
                fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem',
                color: 'var(--color-text-primary)', whiteSpace: 'nowrap',
                borderBottom: i < REFERENCE_ROWS.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
              }}>
                {row.token}
              </td>
              <td style={{
                padding: '12px 16px',
                fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem',
                color: 'var(--color-text-secondary)', whiteSpace: 'nowrap',
                borderBottom: i < REFERENCE_ROWS.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
              }}>
                {row.value}
              </td>
              <td style={{
                padding: '12px 16px',
                fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
                color: 'var(--color-text-primary)',
                borderBottom: i < REFERENCE_ROWS.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
              }}>
                {row.usage}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <Note>
      The <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>--color-alert-{'{tone}'}-bg</code>/
      <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>-border</code> family is declared in
      BOTH <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>:root</code> and{' '}
      <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>.dark</code> — a single{' '}
      <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>:root</code>-only color-mix
      declaration bakes in its light-mode inputs and does not re-adapt inside <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>.dark</code> —
      see the 2026-07-06 Badge tint fix pass in DECISIONS.md. Toggle Dark above and confirm every tone still reads
      as visibly tinted, not flat charcoal.
    </Note>

    <Divider />

    {/* ── 8. Do / Don't ─────────────────────────────────────────────────────── */}
    <SectionHead
      title="Do / Don't"
      description="The most common misuse patterns for a status component — colour-only meaning, and blurring Alert with Toast."
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
          Don't — dismissible on a blocking error
        </div>
        <Alert
          tone="error"
          title="Payment failed"
          description="Update your payment method to avoid a service interruption."
          dismissible
          onDismiss={noop}
        />
        <Note>
          Dismissing this hides the warning, but the payment is still failing — the condition is unresolved and
          will keep affecting the account. This tone/severity should not be dismissible.
        </Note>
      </InfoBox>

      <InfoBox style={{ borderColor: 'var(--color-status-success-text)' }}>
        <div style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600,
          color: 'var(--color-status-success-text)', marginBottom: '16px',
        }}>
          Do — non-dismissible, with a resolving action
        </div>
        <Alert
          tone="error"
          title="Payment failed"
          description="Update your payment method to avoid a service interruption."
          actions={[{ label: 'Update payment method', onClick: noop }]}
        />
        <Note>
          No close control, and the action leads directly to resolving the condition — the alert disappears
          naturally (the consumer stops rendering it) once payment succeeds, not because it was dismissed.
        </Note>
      </InfoBox>

      <InfoBox style={{ borderColor: 'var(--color-status-error-text)' }}>
        <div style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600,
          color: 'var(--color-status-error-text)', marginBottom: '16px',
        }}>
          Don't — use Alert for a one-shot confirmation
        </div>
        <Alert tone="success" title="Settings saved" />
        <Note>
          A save confirmation is a transient, one-shot event — it belongs on Toast (<code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>toast.success('Settings saved')</code>),
          not a standing Alert that has to be manually dismissed for something the user already knows happened.
        </Note>
      </InfoBox>

      <InfoBox style={{ borderColor: 'var(--color-status-success-text)' }}>
        <div style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600,
          color: 'var(--color-status-success-text)', marginBottom: '16px',
        }}>
          Do — use Alert for a standing condition
        </div>
        <Alert
          tone="warning"
          title="No leads received recently"
          description="Your contact form hasn't sent a lead to Quicklo in 9 days."
          actions={[{ label: 'View setup guide', onClick: noop }]}
        />
        <Note>
          This condition remains true until the connection is fixed — exactly what Alert is for. It stays
          visible across page loads, unlike a toast that would already be gone.
        </Note>
      </InfoBox>
    </div>

  </StoryFrame>
);

// ─────────────────────────────────────────────────────────────────────────────
// REFERENCE DATA — resolved hex from docs/DOC-colour-system.md's Alert tokens
// section (2026-07-07); kept as a plain array below the story export so the
// large Overview render function above stays scannable.
// ─────────────────────────────────────────────────────────────────────────────

const REFERENCE_ROWS = [
  { token: '--color-alert-success-bg', value: '#eff6f1 / #1d2520', usage: 'Success tone background tint — color-mix 7% success / 24% border' },
  { token: '--color-alert-success-border', value: '#c7e1d0 / #1c3625', usage: 'Success tone border' },
  { token: '--color-alert-error-bg', value: '#fcf4f4 / #261e1e', usage: 'Error tone background tint — color-mix 5% error / 24% border' },
  { token: '--color-alert-error-border', value: '#eec9c9 / #431e1e', usage: 'Error tone border' },
  { token: '--color-alert-warning-bg', value: '#fffbf0 / #2d291e', usage: 'Warning tone background tint — color-mix 7% warning / 24% border' },
  { token: '--color-alert-warning-border', value: '#fef0ca / #53451f', usage: 'Warning tone border' },
  { token: '--color-alert-info-bg', value: '#f0f6f9 / #1c2326', usage: 'Info tone background tint — color-mix 6% info / 24% border' },
  { token: '--color-alert-info-border', value: '#c3dbe8 / #18303d', usage: 'Info tone border' },
  { token: '--color-status-success-text', value: '#0f5b2b / #62aa7d', usage: 'Icon stroke + title colour, success' },
  { token: '--color-status-error-text', value: '#831414 / #df9797', usage: 'Icon stroke + title colour, error' },
  { token: '--color-status-warning-text', value: '#8a6914 / #fcd46c', usage: 'Icon stroke + title colour, warning' },
  { token: '--color-status-info-text', value: '#024b72 / #569bc0', usage: 'Icon stroke + title colour, info' },
  { token: '--color-text-secondary', value: '#707070 / #adadad', usage: 'Description text colour' },
  { token: '--radius-md', value: '12px', usage: 'Container corner radius' },
  { token: '--space-4', value: '16px', usage: 'Block layout padding (all sides); inline layout horizontal padding; also the ghost sm Button’s own horizontal padding, negated (margin-left: calc(-1 * var(--space-4))) on the block-layout action container so the label sits flush with the text column above it' },
  { token: '--space-3', value: '12px', usage: 'Inline layout vertical padding; header-row gap; body content gap' },
  { token: '--space-5 + --space-3', value: '20px + 12px = 36px', usage: 'Body offset — aligns under the title, past the 20px icon' },
  { token: '--space-1', value: '4px', usage: 'Body top margin' },
  { token: '--space-2', value: '8px', usage: 'Gap between multiple block-layout actions' },
  { token: 'Icon size "md"', value: '20px', usage: 'Status icon — one step below Toast’s 24px "lg", still on the locked scale' },
  { token: 'Button variant="ghost" size="sm"', value: '—', usage: 'Composed for actions — native brand-orange label, no override' },
  { token: 'IconButton variant="plain" size="sm"', value: '—', usage: 'Composed for the close control — same as Toast' },
];
