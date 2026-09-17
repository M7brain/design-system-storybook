'use client';

import React from 'react';
import { Icon } from '@/design-system/icons/Icon.jsx';
import { cn } from '@/lib/utils';

// Badge is a non-interactive STATUS indicator — never a tag (a removable/
// selectable filter chip) and never a count (an unread/quantity badge).
// Polaris, Primer, and Atlassian all draw this same three-way line and ship
// them as separate components with separate interaction models; Carbon's own
// guidance is explicit that a read-only status indicator carries NO
// interaction states (no hover, focus, active, loading, or dismiss) because
// there is nothing to interact with — the row it sits in owns any tap target.
// Count (unread/quantity) is deferred to NavItem/NotificationItem in Patterns,
// not built here — a count is a different semantic (a number that changes),
// not a status.
//
// Soft-tint pill — supersedes the earlier grey-chip + filled-glyph-circle
// build. Fill/border come from --color-badge-{tone}-bg/-border (color-mix,
// see globals.css); label/icon/dot colour resolution is per-tone, see
// TONE_LABEL/TONE_INDICATOR below. The label is always present — colour is
// never the sole conveyor of status (WCAG 1.4.1).

// Exported (not just module-local) so Chip.jsx — a compact sibling stored in
// this same folder — reuses the identical tone → token resolution rather
// than duplicating it. Chip.jsx is the only outside consumer.
export const TONE_BG = {
  neutral: 'var(--color-badge-neutral-bg)',
  success: 'var(--color-badge-success-bg)',
  warning: 'var(--color-badge-warning-bg)',
  error: 'var(--color-badge-error-bg)',
  info: 'var(--color-badge-info-bg)',
};

export const TONE_BORDER = {
  neutral: 'var(--color-badge-neutral-border)',
  success: 'var(--color-badge-success-border)',
  warning: 'var(--color-badge-warning-border)',
  error: 'var(--color-badge-error-border)',
  info: 'var(--color-badge-info-border)',
};

// Label colour. Neutral is the one tone where label ≠ indicator: it uses
// --color-text-secondary (safe AA), never --color-status-neutral, which is
// reserved for the dot/icon. Every other tone, including warning, reuses its
// own --color-status-{tone}-text uniformly.
// Warning previously special-cased --color-text-primary here because
// --color-status-warning-text was yellow-700 (#b2881a), which only clears
// 3.27:1 against white — a ceiling no -bg lightening could cross. Fixed at
// the token level instead: --color-status-warning-text is now yellow-800
// (#8a6914) in light mode (dark unchanged, already yellow-300 #fcd46c),
// clearing 4.74:1 light / 8.55:1 dark against the badge's own -bg — so
// warning no longer needs a component-local override.
export const TONE_LABEL = {
  neutral: 'var(--color-text-secondary)',
  success: 'var(--color-status-success-text)',
  warning: 'var(--color-status-warning-text)',
  error: 'var(--color-status-error-text)',
  info: 'var(--color-status-info-text)',
};

// Icon/dot colour. Same as the label for success/warning/error/info; neutral
// uses --color-status-neutral instead (4.50:1 light / 5.44:1 dark against
// --color-badge-neutral-bg — clears the 3:1 WCAG 1.4.11 non-text minimum).
export const TONE_INDICATOR = {
  ...TONE_LABEL,
  neutral: 'var(--color-status-neutral)',
};

// info has no entry — pulse is ignored on the info tone (no --color-pulse-info
// token exists, and info states aren't the kind of "this needs attention"
// signal a pulse is for).
const TONE_PULSE = {
  neutral: 'var(--color-pulse-default)',
  success: 'var(--color-pulse-success)',
  warning: 'var(--color-pulse-warning)',
  error: 'var(--color-pulse-error)',
};

// A dedicated, compact scale+opacity breathe — NOT a reuse of the existing
// loaders/Pulse.jsx primitive. Pulse.jsx's effect is a ring that expands
// outward to 2.5× the dot size, designed for a standalone 8–12px indicator
// with room around it; inside this pill sitting next to a text label, that
// expansion would overflow into (and visually clash with) the label. Badge's
// own animation stays within its own box, using --ease-spring (small, snappy,
// in-place motion — Toggle/Checkbox's curve) rather than Pulse.jsx's
// --ease-linear (a steady ambient radiate).
const PULSE_KEYFRAMES = `
@keyframes quicklo-badge-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.3); opacity: 0.6; }
}
`;

/**
 * @typedef {Object} BadgeProps
 * @property {'neutral'|'success'|'warning'|'error'|'info'} [tone='neutral'] - Status colour.
 *   Drives the tinted fill/border pair and the label/icon/dot colour.
 * @property {string} [icon] - Optional approved icon NAME (via the Icon wrapper, size "sm"
 *   16px, aria-hidden). Takes precedence over `dot` when set.
 * @property {boolean} [dot=true] - Renders an 8px leading dot when no `icon` is set.
 *   `dot={false}` with no icon renders a bare label, no indicator.
 * @property {boolean} [pulse=false] - Animates the DOT only (scale+opacity breathe,
 *   --duration-pulse/--ease-spring). Ignored if an icon is used, if dot={false}, or on
 *   the 'info' tone (no pulse token — info isn't an attention-needed signal).
 * @property {string} [srPrefix] - Optional visually-hidden prefix (e.g. "Status: ") rendered
 *   before the label, for contexts where the badge is the sole conveyor of status.
 * @property {import('react').ReactNode} children - The label text. REQUIRED — this is the
 *   accessible name. Keep it 1–2 words, sentence case. Never truncated.
 * @property {string} [className]
 */

/**
 * Badge — non-interactive status pill. Renders a single <span>; see the file
 * header for the status-vs-tag-vs-count distinction and why there are no
 * interaction states. REST ONLY: no hover, focus, active, loading, or
 * disabled/dismiss states. `pointer-events: none` so it never intercepts a
 * parent row's own tap — the 44×44px tap-target minimum does NOT apply to
 * Badge, that belongs to the row it sits inside.
 * @param {BadgeProps} props
 */
export const Badge = React.forwardRef(function Badge(
  { tone = 'neutral', icon, dot = true, pulse = false, srPrefix, children, className, ...rest },
  ref
) {
  const bg = TONE_BG[tone] ?? TONE_BG.neutral;
  const border = TONE_BORDER[tone] ?? TONE_BORDER.neutral;
  const labelColor = TONE_LABEL[tone] ?? TONE_LABEL.neutral;
  const indicatorColor = TONE_INDICATOR[tone] ?? TONE_INDICATOR.neutral;
  const showIcon = Boolean(icon);
  const showDot = !showIcon && dot;
  const isPulsing = pulse && showDot && tone !== 'info';
  const pulseColor = isPulsing ? TONE_PULSE[tone] : undefined;

  return (
    <span
      ref={ref}
      className={cn('inline-flex items-center', className)}
      style={{
        gap: 'var(--space-2)',
        minHeight: '30px',
        padding: 'var(--space-1) var(--space-3)',
        borderRadius: 'var(--radius-full)',
        background: bg,
        border: `1px solid ${border}`,
        pointerEvents: 'none',
      }}
      {...rest}
    >
      {pulseColor && <style>{PULSE_KEYFRAMES}</style>}

      {showIcon && (
        <span aria-hidden="true" className="inline-flex shrink-0" style={{ color: indicatorColor }}>
          <Icon name={icon} size="sm" />
        </span>
      )}

      {showDot && (
        <span
          aria-hidden="true"
          style={{
            display: 'inline-block',
            width: '8px',
            height: '8px',
            borderRadius: 'var(--radius-full)',
            background: indicatorColor,
            flexShrink: 0,
            animation: pulseColor ? `quicklo-badge-pulse var(--duration-pulse) var(--ease-spring) infinite` : undefined,
          }}
        />
      )}

      {srPrefix && <span className="sr-only">{srPrefix}</span>}

      {/* Tight explicit line-height — the same browser line-box-inflation
          fix already applied to Button/Input/Checkbox/Select labels. */}
      <span
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-body-md)',
          fontWeight: 500,
          lineHeight: '1.25rem',
          color: labelColor,
          whiteSpace: 'nowrap',
        }}
      >
        {children}
      </span>
    </span>
  );
});
