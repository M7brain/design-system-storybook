'use client';

import React from 'react';
import { Icon } from '@/design-system/icons/Icon.jsx';
import { cn } from '@/lib/utils';
import { TONE_BG, TONE_BORDER, TONE_LABEL, TONE_INDICATOR } from './Badge.jsx';

// Chip — a compact, non-interactive sibling of Badge, stored in the same
// folder deliberately (a Badge-family variant, not a new top-level
// component). Badge stays the standalone-row-status indicator (LeadRow,
// ConnectionCard); Chip is the same soft-tint status language sized for
// tight/inline/nested contexts where a full 30px-min-height Badge reads too
// large — a Tabs trailing slot, a table cell, dense metadata, counts.
// FilterPill (interactive, dismissible, Patterns phase) is the third point
// on this boundary — Chip is NEVER interactive, that's FilterPill's job.
//
// Reuses Badge's own tone → token maps (exported from Badge.jsx) rather than
// duplicating them, so the two components can never silently drift apart on
// what a given tone resolves to. Same --color-badge-{tone}-bg/-border family.
//
// One new token, added in the 2026-07-09 fix pass: --color-brand-tint-border,
// the brand count Chip's border (see globals.css) — its border previously
// equalled its own fill (--color-brand-tint), which read as no border at all
// against light page backgrounds. Every other colour on this component is
// still a reused, pre-existing token.
//
// Icon size: 12px is smaller than the smallest locked Icon primitive size
// (sm = 16px — see src/design-system/icons/Icon.jsx and CLAUDE.md's Icon
// scale). Rather than adding a new Icon size for one component (the same
// call Alert made for its own icon, landing on the nearest existing step
// instead of inventing one), Chip renders Icon at size="sm" and visually
// scales it to 12px via Tailwind's `scale-75` utility — still the same
// Icon wrapper, still zero new primitives, just rendered smaller.

const CHIP_BASE_STYLE = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 'var(--space-1)',
  minHeight: '20px',
  // Block (top/bottom) is --space-0.5's documented value (2px), unchanged.
  // Inline (left/right) raised to --space-3 (12px) in the 2026-07-09 fix pass
  // so content isn't flush against the pill edge; the min-height and
  // indicator-label gap are unchanged.
  //
  // The block value is written as a literal `2px`, not `var(--space-0\.5)` —
  // verified via computed-style inspection that `--space-0.5` (and its
  // siblings `--space-2.5`/`--space-3.5`) never actually compile into a
  // usable runtime custom property from globals.css's `@theme{}` block
  // (queried via getComputedStyle on :root and by scanning every loaded
  // stylesheet's rules — the property is absent from the compiled output
  // entirely, not just failing to resolve). A `var()` reference to it
  // silently invalidates the WHOLE `padding` shorthand (one unresolvable
  // value invalidates the entire declaration, not just that value), which is
  // why Chip has had NO padding at all — including the previously-shipped
  // block/inline values — since it was first built; this was never visible
  // before because the min-height/gap/border still gave it a plausible
  // silhouette. This is a pre-existing globals.css/Tailwind `@theme` issue,
  // out of scope for this fix pass (which touches Chip only) — flagged in
  // docs/DECISIONS.md rather than fixed at the token-file level here.
  padding: '2px var(--space-3)',
  borderRadius: 'var(--radius-full)',
  pointerEvents: 'none',
};

const CHIP_LABEL_STYLE = {
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--text-body-sm)',
  fontWeight: 500,
  lineHeight: '1rem',
  whiteSpace: 'nowrap',
};

/**
 * @typedef {Object} ChipProps
 * @property {'status'|'count'|'label'} [variant='status'] - status: soft-tint tone pill
 *   with an optional icon/dot (Badge's own tone language, compact scale). count: a numeric
 *   bubble, no dot/icon, tone is 'neutral' | 'brand'. label: a plain neutral compact label
 *   with no status meaning (a lead source tag, a "Beta" marker).
 * @property {'neutral'|'success'|'warning'|'error'|'info'|'brand'} [tone='neutral'] - status
 *   variant: any of the 5 status tones. count variant: 'neutral' or 'brand' only, other
 *   values fall back to 'neutral'. label variant: ignored, always neutral.
 * @property {string} [icon] - status variant only. Approved icon name, rendered at Icon's
 *   size="sm" (16px) visually scaled to 12px, aria-hidden. Takes precedence over `dot`.
 * @property {boolean} [dot=true] - status variant only. Renders a 6px leading dot when no
 *   icon is set. dot={false} with no icon renders a bare label.
 * @property {string} [srLabel] - count variant: extra accessible context when the bare
 *   number is ambiguous (e.g. "3 leads need attention"). An explicit `aria-label` also
 *   satisfies this. Dev-warns if a count Chip has neither.
 * @property {import('react').ReactNode} children - The label/number text. REQUIRED — this
 *   is the accessible name.
 * @property {string} [className]
 */

/**
 * Chip — compact non-interactive status/count/label pill. See the file header
 * for the Badge/Chip/FilterPill boundary. `pointer-events: none`, same as
 * Badge — never intercepts a parent row's own tap target, and the 44×44px
 * minimum does not apply here either.
 * @param {ChipProps} props
 */
export const Chip = React.forwardRef(function Chip(
  { variant = 'status', tone = 'neutral', icon, dot = true, srLabel, children, className, ...rest },
  ref
) {
  const ariaLabel = rest['aria-label'] ?? srLabel;

  if (process.env.NODE_ENV !== 'production' && variant === 'count' && !ariaLabel) {
    console.warn(
      'Chip: a "count" variant should have an accessible-context aria-label or srLabel — a bare number is ambiguous to screen reader users.'
    );
  }

  let bg;
  let border;
  let labelColor;
  let indicatorColor;
  let showIcon = false;
  let showDot = false;

  if (variant === 'count') {
    const countTone = tone === 'brand' ? 'brand' : 'neutral';
    bg = countTone === 'brand' ? 'var(--color-brand-tint)' : TONE_BG.neutral;
    // Brand's border used to equal its own fill (--color-brand-tint), which
    // is indistinguishable from having no border at all — invisible against
    // light page backgrounds (2026-07-09 fix pass). --color-brand-tint-border
    // gives it real, soft parity with the neutral count Chip's own border.
    border = countTone === 'brand' ? 'var(--color-brand-tint-border)' : TONE_BORDER.neutral;
    labelColor = countTone === 'brand' ? 'var(--color-brand-tint-text)' : 'var(--color-text-secondary)';
  } else if (variant === 'label') {
    bg = TONE_BG.neutral;
    border = TONE_BORDER.neutral;
    labelColor = 'var(--color-text-secondary)';
  } else {
    bg = TONE_BG[tone] ?? TONE_BG.neutral;
    border = TONE_BORDER[tone] ?? TONE_BORDER.neutral;
    labelColor = TONE_LABEL[tone] ?? TONE_LABEL.neutral;
    indicatorColor = TONE_INDICATOR[tone] ?? TONE_INDICATOR.neutral;
    showIcon = Boolean(icon);
    showDot = !showIcon && dot;
  }

  return (
    <span
      ref={ref}
      {...rest}
      aria-label={ariaLabel}
      className={cn('inline-flex items-center', className)}
      style={{
        ...CHIP_BASE_STYLE,
        ...(variant === 'count' ? { minWidth: '20px', justifyContent: 'center' } : null),
        background: bg,
        border: `1px solid ${border}`,
      }}
    >
      {showIcon && (
        <span aria-hidden="true" className="inline-flex shrink-0" style={{ color: indicatorColor }}>
          <Icon name={icon} size="sm" className="scale-75" />
        </span>
      )}

      {showDot && (
        <span
          aria-hidden="true"
          style={{
            display: 'inline-block',
            width: '6px',
            height: '6px',
            borderRadius: 'var(--radius-full)',
            background: indicatorColor,
            flexShrink: 0,
          }}
        />
      )}

      <span style={{ ...CHIP_LABEL_STYLE, color: labelColor }}>{children}</span>
    </span>
  );
});
Chip.displayName = 'Chip';
