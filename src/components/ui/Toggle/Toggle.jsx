'use client';

import React, { useId, useState } from 'react';
import { cn } from '@/lib/utils';

export function Toggle({
  id: idProp,
  name,
  label,
  hideLabel = false,
  description,
  checked = false,
  disabled = false,
  onChange,
  'aria-label': ariaLabel,
  ...rest
}) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const descId = `${id}-desc`;
  const [isHovering, setIsHovering] = useState(false);
  const [isFocusVisible, setIsFocusVisible] = useState(false);

  // Dev-mode warning: hideLabel=true requires aria-label so screen readers still
  // have a label. Same enforcement pattern as Input and Checkbox.
  if (process.env.NODE_ENV !== 'production' && hideLabel && !ariaLabel) {
    console.warn(
      `[Toggle] id="${id}": hideLabel=true requires an explicit aria-label prop for accessibility.`
    );
  }

  const isActiveHover = isHovering && !disabled;

  // Track border — focus wins over all other states.
  // Off-state: --color-border-default (rest) / --color-border-strong (hover, pointer only).
  // On-state: transparent — fill is the primary visual signal; focus ring overrides when
  // the user is navigating by keyboard.
  // Token precedent: direct reuse of 2026-06-20 Checkbox fix (same pair, same rationale).
  const trackBorder = isFocusVisible
    ? '1px solid var(--color-focus-ring)'
    : checked
    ? '1px solid transparent'
    : isActiveHover
    ? '1px solid var(--color-border-strong)'
    : '1px solid var(--color-border-default)';

  // Track fill — transitions at --duration-base for a smooth on/off swap.
  // On hover when checked, shifts to --color-interactive-hover (darkens/lightens the fill).
  const trackBg = checked
    ? (isActiveHover ? 'var(--color-interactive-hover)' : 'var(--color-interactive-default)')
    : 'var(--color-bg-input)';

  // Thumb left offset — 2px inset at rest, 22px inset when checked.
  // Track 44px − thumb 20px − right inset 2px = 22px. Total travel = 20px.
  const thumbLeft = checked ? '22px' : '2px';

  const handleMouseEnter = () => {
    if (typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches) {
      setIsHovering(true);
    }
  };

  const handleFocus = (e) => {
    if (e.target.matches(':focus-visible')) {
      setIsFocusVisible(true);
    }
  };

  return (
    <div
      className={cn('flex flex-col', disabled && 'opacity-(--opacity-disabled)')}
      style={{ gap: 'var(--space-2)' }}
    >
      {/* ── Row: track + label ──────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: description ? 'flex-start' : 'center', gap: 'var(--space-3)' }}>

        {/* Track ────────────────────────────────────────────────────
            role="switch" with aria-checked is the researched-correct semantic for a
            binary on/off live setting. Differs from Checkbox's <input type="checkbox">
            because Toggle triggers an immediate action rather than holding a form
            value pending submission — same distinction Primer and Polaris apply.
            Native <button> gives Space + Enter activation and disabled semantics for
            free; no custom key handlers needed. */}
        <button
          role="switch"
          id={id}
          type="button"
          name={name}
          aria-checked={checked}
          aria-label={hideLabel ? ariaLabel : undefined}
          aria-describedby={description ? descId : undefined}
          disabled={disabled}
          onClick={() => onChange && onChange(!checked)}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={() => setIsHovering(false)}
          onFocus={handleFocus}
          onBlur={() => setIsFocusVisible(false)}
          className={cn(
            'relative shrink-0',
            // focus-visible:outline-none suppresses the browser default focus outline;
            // the border-color shift to --color-focus-ring is our visible focus indicator
            // (border-only, no box-shadow ring — same rule as Input and Checkbox).
            'focus-visible:outline-none',
            // Touch target — always-on ::before expanding 24×44px visual to 44×44px.
            // The track is already 44px wide, so the ::before only needs to guarantee
            // the 44px HEIGHT. No breakpoint collapse: unlike Button/Input (whose visual
            // heights approach 44px at lg), Toggle's 24px track never reaches 44px.
            // Matches Checkbox's always-on technique, NOT Input/Button's breakpoint-gated one.
            "before:content-[''] before:absolute before:top-1/2 before:left-1/2",
            'before:-translate-x-1/2 before:-translate-y-1/2',
            'before:min-w-11 before:min-h-11',
          )}
          style={{
            width: '44px',
            height: '24px',
            borderRadius: 'var(--radius-full)',
            border: trackBorder,
            backgroundColor: trackBg,
            padding: 0,
            cursor: disabled ? 'not-allowed' : 'pointer',
            // bg transitions at base duration (matching Checkbox's fill/border transition);
            // border-color at same rate for a unified feel.
            transition: [
              `background-color var(--duration-base) var(--ease-default)`,
              `border-color var(--duration-base) var(--ease-default)`,
            ].join(', '),
          }}
          {...rest}
        >
          {/* Thumb ──────────────────────────────────────────────────
              Fix pass 2026-06-20: thumb colour is now state-dependent.
              Off-state: --color-border-input (#868686 light / #707070 dark) vs track
              --color-bg-input (#f3f3f3 / #171717) = 3.28:1 light / 3.62:1 dark ✅ WCAG 1.4.11.
              On-state: --color-bg-surface (#ffffff / #1e1e1e) vs --color-interactive-default
              (#c2410c / #fb923c) = 5.17:1 light / 7.36:1 dark ✅ unchanged.
              --elevation-1 shadow retained for visual depth (was previously the sole contrast
              mitigation for the off-state; now supplementary).
              Centering fix pass 2026-06-20: top:50% + translateY(-50%) replaces fixed top:2px.
              Fixed inset left 0px gap at the bottom on a border-box track (22px inner height,
              2px+20px = flush bottom). Transform-based centering is inset-agnostic. */}
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
              left: thumbLeft,
              width: '20px',
              height: '20px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: checked ? 'var(--color-bg-surface)' : 'var(--color-border-input)',
              boxShadow: 'var(--elevation-1)',
              // Both left and background-color transition together so the colour swap
              // and position swap read as one unified motion (same token pair, same timing).
              transition: [
                `left var(--duration-fast) var(--ease-spring)`,
                `background-color var(--duration-fast) var(--ease-spring)`,
              ].join(', '),
            }}
          />
        </button>

        {/* Label ───────────────────────────────────────────────────
            Label text must describe the SETTING or ACTION, never the current state.
            Correct: "Auto-reply to new leads". Wrong: "Auto-reply is on".
            This is a design/copy constraint, not a runtime validation.
            hideLabel hides visually via sr-only but keeps the label in the
            accessibility tree; htmlFor association still works for screen readers. */}
        <label
          htmlFor={id}
          className={cn(hideLabel && 'sr-only')}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-body-md)',
            fontWeight: 400,
            // Explicit tight line-height — same fix as Button/Input to prevent browser
            // default line-box inflation misaligning the label against the track.
            lineHeight: '1.25rem',
            color: 'var(--color-text-primary)',
            cursor: disabled ? 'not-allowed' : 'pointer',
          }}
        >
          {label}
        </label>
      </div>

      {/* Description ────────────────────────────────────────────────
          Indented to align under the LABEL text, not the switch track.
          Indent = track width (44px) + gap (--space-3, 12px) = 56px.
          Same logic as Checkbox caption: subordinate text indented past the
          control to visually attach to the label it qualifies. */}
      {description && (
        <p
          id={descId}
          style={{
            margin: 0,
            paddingLeft: 'calc(44px + var(--space-3))',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-body-sm)',
            fontWeight: 400,
            lineHeight: '1rem',
            color: 'var(--color-text-secondary)',
          }}
        >
          {description}
        </p>
      )}
    </div>
  );
}
