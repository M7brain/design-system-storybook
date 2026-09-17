'use client';

import React, { useId, useRef, useEffect, useState } from 'react';
import { Icon } from '@/design-system/icons/Icon.jsx';
import { cn } from '@/lib/utils';

export function Checkbox({
  id: idProp,
  name,
  label,
  hideLabel = false,
  caption,
  checked = false,
  indeterminate = false,
  disabled = false,
  readOnly = false,
  error,
  onChange,
  'aria-label': ariaLabel,
  ...rest
}) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const messageId = `${id}-msg`;
  const checkboxRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isFocusVisible, setIsFocusVisible] = useState(false);

  // Dev-mode warning: hideLabel=true requires aria-label so screen readers still have
  // a label. Same enforcement pattern as Input and IconButton.
  if (process.env.NODE_ENV !== 'production' && hideLabel && !ariaLabel) {
    console.warn(
      `[Checkbox] id="${id}": hideLabel=true requires an explicit aria-label prop for accessibility.`
    );
  }

  // The HTML indeterminate attribute does not exist — must be set via the DOM property.
  // aria-checked="mixed" is set explicitly on the input when indeterminate is true,
  // reverting to the browser-computed value (from checked) when false.
  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = Boolean(indeterminate);
    }
  }, [indeterminate]);

  const hasError = Boolean(error) && !disabled && !readOnly;
  const isActiveHover = isHovering && !disabled && !readOnly;
  const isCheckedOrIndeterminate = checked || indeterminate;

  // Box fill — spring-animated via transition on the visual span
  const boxBg = isCheckedOrIndeterminate
    ? isActiveHover
      ? 'var(--color-interactive-hover)'
      : 'var(--color-interactive-default)'
    : 'var(--color-bg-input)';

  // Box border — focus wins over error wins over state.
  // Resting: --color-border-default (matches Input exactly — Marko's direct comparison call,
  // see DECISIONS.md). Hover: --color-border-strong (also matching Input).
  // Error uses --color-status-error-text (surface token, mode-aware), NOT
  // --color-status-error (badge-fill, mode-invariant). Same lesson as Input fix pass.
  const boxBorder = isFocusVisible
    ? 'var(--color-focus-ring)'
    : hasError
    ? 'var(--color-status-error-text)'
    : isCheckedOrIndeterminate
    ? isActiveHover
      ? 'var(--color-interactive-hover)'
      : 'var(--color-interactive-default)'
    : isActiveHover
    ? 'var(--color-border-strong)'
    : 'var(--color-border-default)';

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
      {/* ── Row: checkbox box + label text ──────────────────────── */}
      <label
        htmlFor={id}
        className={cn(
          'flex items-start',
          !disabled && !readOnly
            ? 'cursor-pointer'
            : disabled
            ? 'cursor-not-allowed'
            : 'cursor-default'
        )}
        style={{ gap: 'var(--space-2)' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Box wrapper — 20×20px visual; ::before expands tap target to 44×44px.
            No breakpoint collapse here (unlike Button/Input) — checkboxes are always
            small, the 44px area is always needed per spec. */}
        <span
          className={cn(
            'relative shrink-0',
            "before:content-[''] before:absolute before:top-1/2 before:left-1/2",
            'before:-translate-x-1/2 before:-translate-y-1/2',
            'before:min-w-11 before:min-h-11'
          )}
          style={{ width: 'var(--space-5)', height: 'var(--space-5)' }}
        >
          {/* Native input — opacity-0, overlays visual box at same size.
              Intercepts clicks within the 20×20px area; clicks on the ::before
              area bubble up through the wrapper span to the label, which routes
              them to the input via htmlFor. No double-toggle: browsers detect that
              the click originated from the associated input and skip re-dispatch. */}
          <input
            ref={checkboxRef}
            type="checkbox"
            id={id}
            name={name}
            checked={checked}
            disabled={disabled}
            aria-checked={indeterminate ? 'mixed' : undefined}
            // Read-only: NOT the disabled attribute (which would make AT announce
            // "dimmed/unavailable"). Instead, aria-readonly="true" + onChange no-op
            // keeps the element fully in the accessibility tree and focusable, while
            // preventing state change. This is the correct semantic distinction.
            aria-readonly={readOnly ? 'true' : undefined}
            aria-invalid={hasError ? 'true' : undefined}
            aria-describedby={hasError ? messageId : undefined}
            aria-label={hideLabel ? ariaLabel : undefined}
            // Read-only onChange: empty function so React doesn't warn about a
            // controlled input without an onChange handler.
            onChange={readOnly ? () => {} : onChange}
            // Prevent click from changing value in read-only mode. preventDefault on
            // click stops the browser from toggling the checkbox, which the onChange
            // no-op alone doesn't fully prevent in all browsers.
            onClick={readOnly ? (e) => e.preventDefault() : undefined}
            onFocus={handleFocus}
            onBlur={() => setIsFocusVisible(false)}
            className={cn(
              'absolute inset-0 w-full h-full m-0 z-10 opacity-0',
              disabled ? 'cursor-not-allowed' : readOnly ? 'cursor-default' : 'cursor-pointer'
            )}
            {...rest}
          />

          {/* Visual box — styled entirely from JS state to avoid inline-style vs
              Tailwind specificity conflicts on border-color.
              bg: --color-interactive-default when checked (spring-animated).
              border: 1px --color-border-default at rest, --color-border-strong on hover
              — matches Input exactly (see DECISIONS.md). */}
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-xs"
            style={{
              border: `1px solid ${boxBorder}`,
              backgroundColor: boxBg,
              // Checkmark colour on checked fill. --color-text-on-interactive-primary
              // flips mode (white light / near-black dark) so it always reads on the
              // brand-coloured fill.
              color: 'var(--color-text-on-interactive-primary)',
              // bg: spring easing matches the locked motion token for checkboxes.
              // border: base duration for hover/focus transitions, matching Input.
              transition: [
                `background-color var(--duration-fast) var(--ease-spring)`,
                `border-color var(--duration-base) var(--ease-default)`,
              ].join(', '),
            }}
          >
            {/* Checkmark — always in DOM; animated between visible and invisible.
                scale(0.5) at rest creates the spring "pop" on appear. */}
            <span
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: checked && !indeterminate ? 1 : 0,
                transform: checked && !indeterminate ? 'scale(1)' : 'scale(0.5)',
                transition: [
                  `opacity var(--duration-fast) var(--ease-spring)`,
                  `transform var(--duration-fast) var(--ease-spring)`,
                ].join(', '),
              }}
            >
              <Icon name="Check" size="sm" />
            </span>

            {/* Indeterminate dash — always in DOM; animated independently of checkmark. */}
            <span
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: indeterminate ? 1 : 0,
                transform: indeterminate ? 'scaleX(1)' : 'scaleX(0)',
                transition: [
                  `opacity var(--duration-fast) var(--ease-spring)`,
                  `transform var(--duration-fast) var(--ease-spring)`,
                ].join(', '),
              }}
            >
              <span
                style={{
                  display: 'block',
                  width: '10px',
                  height: '2px',
                  borderRadius: '1px',
                  backgroundColor: 'currentColor',
                }}
              />
            </span>
          </span>
        </span>

        {/* Label text — sr-only when hideLabel. items-start on the parent label
            ensures the box aligns with the FIRST line of a wrapped label, not the
            vertical centre of the whole block — a real, named failure mode. */}
        <span
          className={cn(hideLabel && 'sr-only')}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-body-md)',
            fontWeight: 400,
            // Explicit line-height matching body-md (1.25rem). Prevents browser-default
            // line-box inflation — same fix applied to Button and Input before this.
            lineHeight: '1.25rem',
            color: 'var(--color-text-primary)',
          }}
        >
          {label}
        </span>
      </label>

      {/* Caption — below the row, indented to align with label text left edge.
          Indent = box width (--space-5, 20px) + gap (--space-2, 8px) = 28px.
          Suppressed when error is active. */}
      {caption && !hasError && (
        <span
          style={{
            display: 'block',
            paddingLeft: 'calc(var(--space-5) + var(--space-2))',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-body-sm)',
            fontWeight: 400,
            lineHeight: '1rem',
            color: 'var(--color-text-secondary)',
          }}
        >
          {caption}
        </span>
      )}

      {/* Error message — standalone checkbox only (see DECISIONS.md for scope rationale).
          role="alert" announces to screen readers on mount.
          Starts flush with the LEFT EDGE of the 20px visual box — same x-position as
          the box, not the label text. The 44×44px ::before hit area does NOT shift
          this; alignment is always against the visual box edge.
          alignItems: flex-start so the icon aligns with the FIRST line of the message
          if text wraps — same first-line rule as items-start on the label row above. */}
      {hasError && (
        <p
          id={messageId}
          role="alert"
          style={{
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
            style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}
          >
            <Icon name="AlertCircle" size="sm" />
          </span>
          {error}
        </p>
      )}
    </div>
  );
}
