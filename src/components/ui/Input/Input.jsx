'use client';

import React, { useId, useRef, useState } from 'react';
import { Icon } from '@/design-system/icons/Icon.jsx';
import { cn } from '@/lib/utils';

export function Input({
  id: idProp,
  name,
  label,
  hideLabel = false,
  optional = false,
  type = 'text',
  size = 'md',
  value,
  onChange,
  placeholder,
  helperText,
  error,
  disabled = false,
  leadingIcon,
  onClear,
  required = false,
  className,
  ...rest // autoComplete, inputMode, maxLength, aria-label, and all other native input attrs
}) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const messageId = `${id}-msg`;
  const inputRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);

  // Dev-mode warning: hideLabel=true requires an explicit aria-label on the input so
  // screen readers still have a label. Same enforcement pattern as IconButton.
  if (process.env.NODE_ENV !== 'production' && hideLabel && !rest['aria-label']) {
    console.warn(
      `[Input] id="${id}": hideLabel=true requires an explicit aria-label prop for accessibility.`
    );
  }

  // search type locks the leading icon to Search — cannot be overridden via prop
  const resolvedLeadingIcon = type === 'search' ? 'Search' : leadingIcon;

  // password type: toggle switches the native type between 'password' and 'text'
  const resolvedType = type === 'password' && showPassword ? 'text' : type;

  const hasError = Boolean(error);
  const message = error || helperText; // error replaces helperText — never both
  const showClear = type === 'search' && Boolean(value) && typeof onClear === 'function';
  const hasTrailingControl = type === 'password' || showClear;

  // Clicking inside the wrapper's ::before extended hit area (the 2px above/below the
  // 40px visual field) fires a click on the wrapper div but not the input. Forward focus
  // to the input unless the click landed on a button (password toggle, clear).
  const handleWrapperClick = (e) => {
    if (e.target.closest('button')) return;
    inputRef.current?.focus();
  };

  return (
    <div className={cn('flex flex-col w-full', className)} style={{ gap: 'var(--space-2)' }}>

      {/* ── Label ───────────────────────────────────────────────── */}
      <label
        htmlFor={id}
        className={cn(hideLabel && 'sr-only')}
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-body-md)',
          fontWeight: 500,
          // Tight line-height prevents browser-default line-box inflation.
          // Same fix as Button's vertical-centering bug — explicit value matching the
          // defined line-height for body-md (1.25rem), not a unitless multiplier.
          lineHeight: '1.25rem',
          color: 'var(--color-text-primary)',
        }}
      >
        {label}
        {optional && (
          <span
            style={{
              color: 'var(--color-text-tertiary)',
              fontWeight: 400,
              marginLeft: 'var(--space-1)',
            }}
          >
            (optional)
          </span>
        )}
        {required && (
          <span
            aria-hidden="true"
            style={{ color: 'var(--color-status-error)', marginLeft: 'var(--space-px)' }}
          >
            *
          </span>
        )}
      </label>

      {/* ── Field wrapper ────────────────────────────────────────── */}
      <div
        onClick={handleWrapperClick}
        className={cn(
          'relative flex items-center w-full rounded-sm bg-(--color-bg-input)',

          // Resting border — lighter visual weight; contrast vs fill: 1.22:1 light / 1.38:1
          // dark (below WCAG 1.4.11 3:1 — deliberate trade, see DECISIONS.md).
          // --color-border-input (#868686 / #707070) remains in globals.css if compliance
          // is required; this tokens swap is a design call, not an oversight.
          'border border-(--color-border-default)',

          // Hover — pointer devices only, via @media (hover:hover).
          // :not(:focus-within) prevents CSS source-order collision: without it, the hover
          // rule fires even when the field is focused (both have specificity 0,1,0; source
          // order makes hover win). This guard makes hover logically inactive during focus.
          // Suppressed in error and disabled states.
          !hasError && !disabled && '[@media(hover:hover)]:[&:hover:not(:focus-within)]:border-(--color-border-strong)',

          // Focus — border-color only shifts to the focus-ring token; no box-shadow ring.
          // The ring-2 was removed: it added ~3px visual bulk against the lighter border weight.
          'focus-within:border-(--color-focus-ring)',

          // Error — border and hover use --color-status-error-text (red-700 light / red-200
          // dark) — the surface-text token for error states, not the badge-fill token.
          // WCAG AA: 9.10:1 light · 7.69:1 dark (vs bg-surface). Hover also guarded with
          // :not(:focus-within) to avoid the same source-order collision.
          hasError && [
            'border-(--color-status-error-text)',
            '[@media(hover:hover)]:[&:hover:not(:focus-within)]:border-(--color-status-error-text)',
          ],

          // Disabled — opacity only; no colour tokens (per locked system rule)
          disabled && 'opacity-(--opacity-disabled) pointer-events-none',

          // md (40px visual): hit area expanded to 44×44px via ::before, collapsed at lg+.
          // Identical technique to Button sm/md. Decouples 40px visual height from the
          // 44px minimum tap target without changing the visible field size.
          size === 'md' && [
            "before:content-[''] before:absolute before:top-1/2 before:left-1/2",
            'before:-translate-x-1/2 before:-translate-y-1/2',
            'before:min-w-11 before:min-h-11',
            'lg:before:min-w-0 lg:before:min-h-0',
          ],
        )}
        style={{
          height: size === 'lg' ? '48px' : '40px',
          cursor: disabled ? 'not-allowed' : 'text',
          // prefers-reduced-motion handled globally in globals.css — no per-component override needed.
          transition: `border-color var(--duration-base) var(--ease-default)`,
        }}
      >

        {/* Leading icon — decorative, aria-hidden. For search type, locked to Search. */}
        {resolvedLeadingIcon && (
          <span
            aria-hidden="true"
            style={{
              display: 'flex',
              alignItems: 'center',
              flexShrink: 0,
              paddingLeft: 'var(--space-4)',
              color: 'var(--color-text-tertiary)',
            }}
          >
            <Icon name={resolvedLeadingIcon} size="md" />
          </span>
        )}

        {/* Native input */}
        <input
          ref={inputRef}
          id={id}
          name={name}
          type={resolvedType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          aria-invalid={hasError ? 'true' : undefined}
          aria-describedby={message ? messageId : undefined}
          className={cn(
            'flex-1 min-w-0 bg-transparent border-0 outline-none',
            'placeholder:text-(--color-text-tertiary)',
          )}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-body-lg)', // 1rem — meets iOS-zoom minimum rule for inputs
            fontWeight: 400,
            // Tight single-line line-height — prevents browser-default line-height (1.2–1.5×)
            // from inflating the line-box above the rendered glyph cap height and pushing
            // text off-centre inside the fixed-height wrapper. 1rem matches the font-size
            // exactly (button-chrome style: single-line elements don't need reading rhythm).
            lineHeight: '1rem',
            color: 'var(--color-text-primary)',
            paddingLeft: resolvedLeadingIcon ? 'var(--space-2)' : 'var(--space-4)',
            paddingRight: hasTrailingControl ? 'var(--space-2)' : 'var(--space-4)',
            paddingTop: 0,
            paddingBottom: 0,
            height: '100%',
          }}
          {...rest}
        />

        {/* Password visibility toggle — interactive control; needs its own 44×44px hit
            area via ::before (same technique as Button sm/md).
            focus-visible:outline-none suppresses the global default focus outline — the
            parent wrapper's focus-within ring provides the visible focus indicator. */}
        {type === 'password' && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation(); // prevent wrapper click handler from stealing focus
              setShowPassword((v) => !v);
            }}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            disabled={disabled}
            className={cn(
              'relative flex items-center justify-center shrink-0',
              'bg-transparent border-0 cursor-pointer focus-visible:outline-none',
              // ::before expands hit area to 44×44px below lg
              "before:content-[''] before:absolute before:top-1/2 before:left-1/2",
              'before:-translate-x-1/2 before:-translate-y-1/2',
              'before:min-w-11 before:min-h-11',
              'lg:before:min-w-0 lg:before:min-h-0',
            )}
            style={{
              color: 'var(--color-text-tertiary)',
              padding: 0,
              marginRight: 'var(--space-4)',
              width: '20px',
              height: '20px',
            }}
          >
            <Icon name={showPassword ? 'EyeOff' : 'Eye'} size="md" />
          </button>
        )}

        {/* Search clear button — deliberate tap-target exception.
            Every design system surveyed (Shopify Polaris, Material Design) implements
            field-clear as a small inline glyph rather than a full 44px target:
            (1) the action is instantly reversible by retyping,
            (2) stretching it to 44px would visually dominate the right side of narrow
                search fields used in mobile dashboard filters.
            This is the ONLY intentional 44px exception in this component.
            See DECISIONS.md for the explicit rationale. */}
        {showClear && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            aria-label="Clear search"
            disabled={disabled}
            className="flex items-center justify-center shrink-0 bg-transparent border-0 cursor-pointer focus-visible:outline-none rounded-full"
            style={{
              color: 'var(--color-text-tertiary)',
              padding: 'var(--space-1)',
              marginRight: 'var(--space-3)',
              // intentionally NOT expanded to 44px — see comment above
            }}
          >
            <Icon name="X" size="sm" />
          </button>
        )}
      </div>

      {/* ── Helper / error message ───────────────────────────────── */}
      {message && (
        <p
          id={messageId}
          role={hasError ? 'alert' : undefined}
          style={{
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-1)',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-body-sm)',
            fontWeight: 400,
            lineHeight: '1rem',
            color: hasError
              ? 'var(--color-status-error-text)'
              : 'var(--color-text-secondary)',
          }}
        >
          {hasError && (
            <span
              aria-hidden="true"
              style={{
                display: 'flex',
                alignItems: 'center',
                flexShrink: 0,
                color: 'var(--color-status-error-text)',
              }}
            >
              <Icon name="AlertCircle" size="sm" />
            </span>
          )}
          {message}
        </p>
      )}
    </div>
  );
}
