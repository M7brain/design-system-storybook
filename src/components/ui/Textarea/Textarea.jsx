'use client';

import React, { useId, useRef, useCallback, useEffect } from 'react';
import { Icon } from '@/design-system/icons/Icon.jsx';
import { cn } from '@/lib/utils';

export function Textarea({
  id: idProp,
  name,
  label,
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  maxLength,
  showCounter = false,
  ...rest
}) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const errorId = `${id}-error`;
  const counterId = `${id}-counter`;

  const hasError = Boolean(error);
  const showCounterDisplay = showCounter && maxLength != null;
  const showHelperRow = hasError || showCounterDisplay;
  const currentLength = value?.length ?? 0;

  const ariaDescribedBy = [
    hasError && errorId,
    showCounterDisplay && counterId,
  ].filter(Boolean).join(' ') || undefined;

  const textareaRef = useRef(null);

  const autoGrow = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    // scrollHeight excludes border; border-box height includes it.
    // Adding border (offsetHeight - clientHeight) prevents a spurious 2px scroll.
    const border = el.offsetHeight - el.clientHeight;
    el.style.height = `${el.scrollHeight + border}px`;
  }, []);

  // Grow on mount (pre-filled value) and after every controlled re-render
  useEffect(() => { autoGrow(); }, [value, autoGrow]);

  // Grow on window resize — line-wrapping may change row count at same char count
  useEffect(() => {
    window.addEventListener('resize', autoGrow);
    return () => window.removeEventListener('resize', autoGrow);
  }, [autoGrow]);

  return (
    <div className="flex flex-col w-full" style={{ gap: 'var(--space-2)' }}>

      {/* ── Label ─────────────────────────────────────────────────────── */}
      <label
        htmlFor={id}
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-body-md)',
          fontWeight: 500,
          // Tight line-height prevents browser-default line-box inflation.
          // Same fix applied to Button, Input, Checkbox, Toggle before this.
          lineHeight: '1.25rem',
          color: 'var(--color-text-primary)',
        }}
      >
        {label}
      </label>

      {/* ── Textarea ──────────────────────────────────────────────────── */}
      <textarea
        ref={textareaRef}
        id={id}
        name={name}
        value={value}
        onChange={e => {
          onChange?.(e);
          autoGrow();
        }}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        aria-invalid={hasError ? 'true' : undefined}
        aria-describedby={ariaDescribedBy}
        className={cn(
          // Base layout
          'block w-full rounded-sm bg-(--color-bg-input)',
          'placeholder:text-(--color-text-tertiary)',

          // Resting border — same token pair as Input/Checkbox/Toggle.
          // --color-border-default vs --color-bg-input: 1.22:1 light / 1.25:1 dark.
          // Knowingly below WCAG 1.4.11 3:1 — accepted trade per DECISIONS.md
          // 2026-06-18 Input Fix 2.
          'border border-(--color-border-default)',

          // Hover — pointer-only via @media(hover:hover).
          // :not(:focus) guards against CSS source-order collision where the hover
          // class and focus class share equal specificity and hover would win when
          // both conditions are true. Matches the :not(:focus-within) fix in Input.
          // Suppressed in error and disabled states.
          !hasError && !disabled && '[@media(hover:hover)]:[&:hover:not(:focus)]:border-(--color-border-strong)',

          // Focus — border-color-only shift to focus-ring token; no box-shadow.
          // outline-none suppresses the global *:focus-visible outline from globals.css.
          // Using :focus (not :focus-within) — textarea IS the focusable element.
          'focus:border-(--color-focus-ring) focus:outline-none',

          // Error — border pinned to error-text token in both rest and hover state.
          // --color-status-error-text is the surface-level indicator (mode-aware):
          // red-700 light / red-200 dark. NOT --color-status-error (badge fill,
          // mode-invariant). Same lesson as Input fix pass (DECISIONS.md 2026-06-18).
          hasError && [
            'border-(--color-status-error-text)',
            '[@media(hover:hover)]:[&:hover:not(:focus)]:border-(--color-status-error-text)',
          ],

          // Disabled — opacity only; no dedicated colour tokens per locked system rule.
          disabled && 'opacity-(--opacity-disabled) cursor-not-allowed',
        )}
        style={{
          // min/max-height computed from tokens: rows × line-height + 2 × vertical padding.
          // JS autoGrow sets height via ref on each change; CSS clamps to min/max.
          minHeight: 'calc(3 * 1.5rem + 2 * var(--space-4))',
          maxHeight: 'calc(8 * 1.5rem + 2 * var(--space-4))',
          overflowY: 'auto',
          paddingTop: 'var(--space-4)',
          paddingBottom: 'var(--space-4)',
          paddingLeft: 'var(--space-4)',
          paddingRight: 'var(--space-4)',
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-body-lg)', // 1rem — iOS-zoom-safe minimum for inputs
          fontWeight: 400,
          // Explicit line-height — prevents browser-default line-box inflation.
          // Recurring fix across Button, Input, Checkbox, Toggle. Value is the defined
          // line-height for body-lg (1.5rem per the type scale), not a unitless ratio.
          lineHeight: '1.5rem',
          color: 'var(--color-text-primary)',
          resize: 'vertical',
          // Border-only transition — same duration/easing pair as Input.
          transition: `border-color var(--duration-base) var(--ease-default)`,
        }}
        {...rest}
      />

      {/* ── Helper row: error (left) + character counter (right) ─────── */}
      {showHelperRow && (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 'var(--space-2)',
          }}
        >
          {/* Error message — flush with textarea left edge (no label indent).
              role="alert" announces on mount for screen readers.
              alignItems: flex-start so the icon sits at the first line when
              the message wraps — same first-line rule as Checkbox error row. */}
          {hasError ? (
            <p
              id={errorId}
              role="alert"
              style={{
                flex: '1 1 0%',
                margin: 0,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'var(--space-1)',
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-body-sm)',
                fontWeight: 400,
                lineHeight: '1rem',
                color: 'var(--color-status-error-text)',
              }}
            >
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
              {error}
            </p>
          ) : (
            // Spacer keeps the counter right-aligned when no error is present.
            <span aria-hidden="true" style={{ flex: '1 1 0%' }} />
          )}

          {/* Character counter — right-aligned, visual only.
              Native maxLength attr enforces the hard limit; this is informational.
              id is referenced by aria-describedby on the textarea above. */}
          {showCounterDisplay && (
            <span
              id={counterId}
              style={{
                flexShrink: 0,
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-body-sm)',
                fontWeight: 400,
                lineHeight: '1rem',
                color: 'var(--color-text-secondary)',
              }}
            >
              {currentLength} / {maxLength}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
