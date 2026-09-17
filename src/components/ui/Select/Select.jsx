'use client';

import React, { useId, useState } from 'react';
import { Icon } from '@/design-system/icons/Icon.jsx';
import { cn } from '@/lib/utils';

// Select is a styled NATIVE <select> — single-select only, no search, no custom
// listbox/popover. Rationale: native <select> gives free OS-native mobile pickers,
// full keyboard support, screen-reader support, and typeahead — Primer and Polaris
// both ship Select as native and reserve custom popovers for a separate
// SelectPanel/Combobox component. Quicklo's user is non-technical, mobile-first,
// often gloved on a job site; the OS picker is the fastest, most robust control we
// can ship. Searchable business-type selection and multi-select are explicitly OUT
// of scope here — they belong to a future Combobox component, not Select.

export const Select = React.forwardRef(function Select(
  {
    id: idProp,
    name,
    label,
    hideLabel = false,
    optional = false,
    options,
    size = 'md',
    value,
    onChange,
    placeholder,
    helperText,
    error,
    disabled = false,
    required = false,
    className,
    ...rest // aria-label and all other native select attrs
  },
  ref
) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const messageId = `${id}-msg`;

  // Dev-mode warning: hideLabel=true requires an explicit aria-label on the select so
  // screen readers still have a label. Same enforcement pattern as Input/IconButton.
  if (process.env.NODE_ENV !== 'production' && hideLabel && !rest['aria-label']) {
    console.warn(
      `[Select] id="${id}": hideLabel=true requires an explicit aria-label prop for accessibility.`
    );
  }

  const hasError = Boolean(error);
  const message = error || helperText; // error replaces helperText — never both

  // Drives placeholder-vs-filled text colour off component state (not :invalid), so it
  // works whether or not `required` is set — the real signal is "has a value been chosen".
  const isPlaceholder = value === '' || value === null || value === undefined;

  // BEST-EFFORT open-state tracking for the chevron rotation. A native <select> exposes
  // no reliable cross-browser open/close event, so this is a heuristic, not a source of
  // truth: mousedown toggles it (a pointer click both opens and closes the native
  // popup), and blur/change/Escape/Enter/Tab reliably mean "closed". ArrowDown/ArrowUp/
  // Space are the standard keys that open a focused native select. The chevron stays
  // aria-hidden throughout — the OS conveys real open state to assistive tech — so any
  // brief desync (e.g. dismissing via an unusual keyboard path, or on some mobile
  // pickers) is a cosmetic, accepted limitation, not a bug to chase.
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseDown = () => setIsOpen((v) => !v);
  const handleBlur = () => setIsOpen(false);
  const handleChange = (e) => {
    setIsOpen(false);
    onChange?.(e);
  };
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === ' ') {
      setIsOpen(true);
    } else if (e.key === 'Escape' || e.key === 'Enter' || e.key === 'Tab') {
      setIsOpen(false);
    }
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
          // Tight line-height prevents browser-default line-box inflation — same fix
          // already applied to Button, Input, and Checkbox.
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
        className={cn(
          'relative flex items-center w-full rounded-sm bg-(--color-bg-input)',

          // Resting border — identical token pair to Input (deliberate relaxed choice,
          // see DECISIONS.md 2026-06-18 Input Fix 2 / 2026-06-20 Checkbox fix pass).
          'border border-(--color-border-default)',

          // Hover — pointer devices only. :not(:focus-within) guard prevents the CSS
          // source-order collision where hover would otherwise win over focus (both
          // rules share specificity 0,1,0) — same fix as Input Fix 1.
          !hasError && !disabled && '[@media(hover:hover)]:[&:hover:not(:focus-within)]:border-(--color-border-strong)',

          // Focus — border-color only shifts to the focus-ring token; no box-shadow ring.
          'focus-within:border-(--color-focus-ring)',

          // Error — uses the surface-level error-text token (not the badge-fill token).
          // WCAG AA: 9.10:1 light / 7.69:1 dark vs bg-surface (cited from Input Fix 4 —
          // not recomputed here, same token pair).
          hasError && [
            'border-(--color-status-error-text)',
            '[@media(hover:hover)]:[&:hover:not(:focus-within)]:border-(--color-status-error-text)',
          ],

          // Disabled — opacity only; no colour tokens (per locked system rule)
          disabled && 'opacity-(--opacity-disabled) pointer-events-none',

          // md (40px visual): hit area expanded to 44×44px via ::before, collapsed at lg+.
          // Identical technique to Button sm/md and Input md.
          size === 'md' && [
            "before:content-[''] before:absolute before:top-1/2 before:left-1/2",
            'before:-translate-x-1/2 before:-translate-y-1/2',
            'before:min-w-11 before:min-h-11',
            'lg:before:min-w-0 lg:before:min-h-0',
          ],
        )}
        style={{
          height: size === 'lg' ? '48px' : '40px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: `border-color var(--duration-base) var(--ease-default)`,
        }}
      >
        {/* Native select — appearance:none strips the OS arrow so our own chevron can
            overlay it. Open/close is best-effort (see isOpen above), so the chevron
            rotates as a heuristic indicator, not a guaranteed-accurate one. */}
        <select
          ref={ref}
          id={id}
          name={name}
          value={value}
          onChange={handleChange}
          onMouseDown={handleMouseDown}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          required={required}
          aria-invalid={hasError ? 'true' : undefined}
          aria-describedby={message ? messageId : undefined}
          className={cn(
            'w-full h-full bg-transparent border-0 outline-none appearance-none',
            'overflow-hidden text-ellipsis whitespace-nowrap',
            // color-scheme is a rendering-mode hint, not a colour value — it tells the
            // browser to paint its OWN native chrome (the option popup, scrollbars
            // inside it) light or dark. Applied declaratively via the same .dark class
            // the rest of the system already uses (see the @custom-variant dark rule in
            // globals.css), so this is not hardcoded theme-specific component logic —
            // it's the standards mechanism for theming native form-control popups.
            // Scoped to this element only; not applied at :root/.dark (that would also
            // re-theme native scrollbars/pickers app-wide — a separate Foundations call).
            'scheme-light dark:scheme-dark',
          )}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-body-lg)', // 1rem — meets iOS-zoom minimum rule for inputs
            fontWeight: 400,
            // Tight single-line line-height — prevents browser-default line-height from
            // inflating the line-box above the rendered glyph cap height. Same fix as Input.
            lineHeight: '1rem',
            color: isPlaceholder ? 'var(--color-text-secondary)' : 'var(--color-text-primary)',
            // Left: --space-4 (16px), matching Input no-icon. Right: --space-4 (16px
            // edge→chevron) + 20px chevron + --space-2 (8px chevron→text) = 44px, so long
            // values truncate before reaching the chevron rather than sliding under it.
            paddingLeft: 'var(--space-4)',
            paddingRight: '44px',
            cursor: 'inherit',
          }}
          {...rest}
        >
          {/* Option colours below are supplementary — Chrome/Firefox on Windows/Linux
              honour <option> styling, but macOS Safari ignores it entirely and relies
              solely on the color-scheme hint above. Token-only, no hardcoded values. */}
          {placeholder && (
            <option
              value=""
              disabled
              hidden
              style={{ backgroundColor: 'var(--color-bg-surface)', color: 'var(--color-text-primary)' }}
            >
              {placeholder}
            </option>
          )}
          {/* options: flat [{ label, value, disabled? }] or grouped
              [{ label: groupLabel, options: [...] }] — grouped renders a native
              <optgroup> (used by the connections platform picker, e.g. "Webhook-native"
              vs "Email-forward"). Option label convention: sentence case, kept short,
              listed in logical or alphabetical order (Polaris/Primer/Carbon convention). */}
          {options.map((opt) =>
            Array.isArray(opt.options) ? (
              <optgroup
                key={opt.label}
                label={opt.label}
                style={{ backgroundColor: 'var(--color-bg-surface)', color: 'var(--color-text-primary)' }}
              >
                {opt.options.map((sub) => (
                  <option
                    key={sub.value}
                    value={sub.value}
                    disabled={sub.disabled}
                    style={{ backgroundColor: 'var(--color-bg-surface)', color: 'var(--color-text-primary)' }}
                  >
                    {sub.label}
                  </option>
                ))}
              </optgroup>
            ) : (
              <option
                key={opt.value}
                value={opt.value}
                disabled={opt.disabled}
                style={{ backgroundColor: 'var(--color-bg-surface)', color: 'var(--color-text-primary)' }}
              >
                {opt.label}
              </option>
            )
          )}
        </select>

        {/* Chevron — overlay, decorative, aria-hidden. Rotates 180deg while isOpen is
            true (best-effort — see the isOpen tracking above); returns to resting on
            close. --duration-fast (100ms, the small-snappy tier) + --ease-default, NOT
            --ease-spring (that curve is reserved for Toggle/Checkbox). */}
        <span
          aria-hidden="true"
          className="absolute pointer-events-none flex items-center"
          style={{
            right: 'var(--space-4)',
            top: '50%',
            transform: isOpen ? 'translateY(-50%) rotate(180deg)' : 'translateY(-50%) rotate(0deg)',
            transition: `transform var(--duration-fast) var(--ease-default)`,
            color: 'var(--color-text-secondary)',
          }}
        >
          <Icon name="ChevronDown" size="md" />
        </span>
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
});

// Excluded states, with reasons:
// - No loading state: a native select has no async lifecycle; options are props, not
//   a fetch result. A screen fetching options renders a Skeleton in place of the field.
// - No open state: the open picker is OS-rendered; we cannot and should not style it —
//   this is why Carbon has an "open" state and Select does not (Carbon is a custom listbox).
// - No readonly state: native <select> has no readonly; disabled covers the need.
// - No valid/success state: no Quicklo screen has a per-field success-confirmation pattern.
