'use client';

import React, { useEffect, useState } from 'react';
import { Icon } from '@/design-system/icons/Icon.jsx';
import { IconButton } from '@/components/ui/IconButton/IconButton.jsx';
import { Button } from '@/components/ui/Button/Button.jsx';
import { X } from '@/design-system/icons/index.js';
import { cn } from '@/lib/utils';

// Alert — a persistent, standing, inline status message. Never auto-dismisses
// — that's the one-line definition versus Toast (transient/floating,
// src/components/ui/Toast/). "Banner" is this same component placed
// full-width at the top of a page; it is NOT a separate component.
//
// Reuses the Toast header-row/body structure (see Toast.jsx, 2026-07-07 fix
// pass) so a dismiss control never drifts against a growing description, and
// the same fix pass's action-colour decision: actions are Button variant
// "ghost" in its NATIVE brand-orange label colour, no className override.

const TONE_ICON = { info: 'Info', success: 'CheckCircle2', warning: 'AlertTriangle', error: 'XCircle' };

// warning/error are unresolved-or-blocking conditions — role="alert" so
// assistive tech interrupts to announce them. info/success are confirmations
// — role="status" so they announce without interrupting. Mirrors Toast.
const ARIA_BY_TONE = {
  info: { role: 'status', live: 'polite' },
  success: { role: 'status', live: 'polite' },
  warning: { role: 'alert', live: 'assertive' },
  error: { role: 'alert', live: 'assertive' },
};

function readTokenMs(varName, fallback) {
  if (typeof window === 'undefined') return fallback;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  const ms = parseFloat(raw);
  return Number.isFinite(ms) ? ms : fallback;
}

function ActionButton({ action }) {
  if (action.href) {
    return (
      <Button variant="ghost" size="sm" asChild>
        <a href={action.href}>{action.label}</a>
      </Button>
    );
  }
  return (
    <Button variant="ghost" size="sm" onClick={action.onClick}>
      {action.label}
    </Button>
  );
}

const TEXT_STYLE_BASE = {
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--text-body-md)',
  lineHeight: '1.25rem', // natural — same value as the token's own line-height, not a tighter override
};

export const Alert = React.forwardRef(function Alert(
  {
    tone = 'info',
    layout = 'block',
    title,
    hideTitle = false,
    description,
    children,
    actions,
    dismissible = false,
    onDismiss,
    icon,
    className,
    ...rest
  },
  ref
) {
  // 'resting' | 'entering' | 'exiting' | 'dismissed'. Non-dismissible alerts
  // never animate — they simply exist or don't, per the consumer's own
  // conditional render — so they start (and stay) at 'resting'.
  const [status, setStatus] = useState(dismissible ? 'entering' : 'resting');

  useEffect(() => {
    if (status !== 'entering') return undefined;
    const raf = requestAnimationFrame(() => setStatus('resting'));
    return () => cancelAnimationFrame(raf);
  }, [status]);

  if (process.env.NODE_ENV !== 'production' && !title && !rest['aria-label']) {
    console.warn('[Alert] a `title` (or `aria-label`) is required — Alert has no other accessible name.');
  }
  if (process.env.NODE_ENV !== 'production' && hideTitle && !rest['aria-label']) {
    console.warn('[Alert] hideTitle=true requires an explicit aria-label prop for accessibility.');
  }
  if (process.env.NODE_ENV !== 'production' && icon && tone !== 'info') {
    console.warn('[Alert] the `icon` override is only supported for tone="info" — every other tone uses its locked status icon.');
  }

  function handleDismiss() {
    setStatus('exiting');
    const delay = readTokenMs('--duration-base', 200);
    setTimeout(() => {
      setStatus('dismissed');
      onDismiss?.();
    }, delay);
  }

  if (status === 'dismissed') return null;

  const iconName = tone === 'info' && icon ? icon : (TONE_ICON[tone] ?? TONE_ICON.info);
  const { role, live } = ARIA_BY_TONE[tone] ?? ARIA_BY_TONE.info;
  const content = description ?? children;
  const hasDescription = Boolean(content);
  const isBlock = layout === 'block';
  const actionList = (actions ?? []).slice(0, isBlock ? 2 : 1);
  const hasActions = actionList.length > 0;
  const collapsed = status === 'entering' || status === 'exiting';
  const ease = status === 'exiting' ? 'var(--ease-exit)' : 'var(--ease-enter)';

  const alertBox = (
    <div
      ref={ref}
      {...rest}
      role={role}
      aria-live={live}
      className={className}
      style={{
        background: `var(--color-alert-${tone}-bg)`,
        border: `1px solid var(--color-alert-${tone}-border)`,
        borderRadius: 'var(--radius-md)',
        padding: isBlock ? 'var(--space-4)' : 'var(--space-3) var(--space-4)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* HEADER ROW — fixed, vertically-centred: icon, title, and (inline
          layout only) description + a flex spacer + a single action, then
          close. Always one centreline, mirroring Toast's header row so the
          close control never drifts against a growing body underneath. */}
      <div
        style={{
          display: 'flex',
          flexWrap: isBlock ? 'nowrap' : 'wrap', // inline: short content only, wraps gracefully rather than overflowing
          alignItems: 'center',
          gap: 'var(--space-3)',
        }}
      >
        <span
          aria-hidden="true"
          style={{ display: 'inline-flex', flexShrink: 0, color: `var(--color-status-${tone}-text)` }}
        >
          <Icon name={iconName} size="md" />
        </span>

        {title && (
          <span
            className={cn(hideTitle && 'sr-only')}
            style={{
              ...TEXT_STYLE_BASE,
              fontWeight: 500,
              color: `var(--color-status-${tone}-text)`,
              flex: isBlock ? 1 : undefined,
              minWidth: 0,
            }}
          >
            {title}
          </span>
        )}

        {!isBlock && hasDescription && (
          <span style={{ ...TEXT_STYLE_BASE, fontWeight: 400, color: 'var(--color-text-secondary)' }}>
            {content}
          </span>
        )}

        {!isBlock && <span style={{ flex: 1, minWidth: 0 }} />}
        {!isBlock && hasActions && <ActionButton action={actionList[0]} />}

        {dismissible && (
          <IconButton
            icon={X}
            variant="plain"
            size="sm"
            aria-label="Dismiss"
            className="shrink-0"
            onClick={handleDismiss}
          />
        )}
      </div>

      {/* BODY — block layout only, rendered when description/children is
          present. Offset to align under the TITLE, past the icon: 20px icon
          width + --space-3 header gap = --space-5 + --space-3. */}
      {isBlock && hasDescription && (
        <div
          style={{
            marginLeft: 'calc(var(--space-5) + var(--space-3))',
            marginTop: 'var(--space-1)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-3)',
          }}
        >
          <div style={{ ...TEXT_STYLE_BASE, fontWeight: 400, color: 'var(--color-text-secondary)' }}>
            {content}
          </div>

          {hasActions && (
            // Offset by the ghost sm button's own horizontal padding
            // (--space-4, see Button.jsx) so the LABEL — not the button's
            // padded box edge — sits flush with the title/description text
            // column above it. Same mechanism as the 2026-07-07 Toast fix
            // pass's body-action offset (fix (c)).
            <div style={{ display: 'flex', gap: 'var(--space-2)', marginLeft: 'calc(-1 * var(--space-4))' }}>
              {actionList.map((action, i) => (
                <ActionButton key={action.label ?? i} action={action} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (!dismissible) return alertBox;

  // Fade + height-collapse via the grid-rows 1fr/0fr technique — no JS
  // height measurement needed, and content below reflows as the row
  // collapses. var(--duration-base) means prefers-reduced-motion (which
  // zeroes every --duration-* token globally in this file) collapses this
  // to instant automatically, no per-component handling.
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateRows: collapsed ? '0fr' : '1fr',
        transition: `grid-template-rows var(--duration-base) ${ease}`,
      }}
    >
      <div style={{ overflow: 'hidden' }}>
        <div style={{ opacity: collapsed ? 0 : 1, transition: `opacity var(--duration-base) ${ease}` }}>
          {alertBox}
        </div>
      </div>
    </div>
  );
});

Alert.displayName = 'Alert';
