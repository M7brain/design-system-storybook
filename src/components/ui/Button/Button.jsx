'use client';

import React from 'react';
import { cva } from 'class-variance-authority';
import { Slot } from 'radix-ui';
import { cn } from '@/lib/utils';
import { Icon } from '@/design-system/icons/Icon.jsx';

// Keyframes injected inline so the spinner works without a global CSS dependency.
// Uses the same animation token as Spinner.jsx — no new duration introduced.
const SPIN_KF = `@keyframes quicklo-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`;

// Loading icon size per button size, matching Icon wrapper's semantic sizes:
// sm/md → size="sm" (16px), lg → size="md" (20px).
// Does not add a new Spinner size; uses the existing Icon primitive at the right stop.
const LOADING_ICON_SIZE = { sm: 'sm', md: 'sm', lg: 'md' };

const buttonVariants = cva(
  [
    // Layout
    'relative inline-flex items-center justify-center',
    // Typography — Inter 500 (button label rule: font-medium, not the 600 the type scale permits).
    // Deliberate exception: 500 not 600 to avoid visually heavy labels at small sizes.
    'font-[family-name:var(--font-body)] font-medium whitespace-nowrap',
    // Shape
    'rounded-(--radius-sm)',
    // Interaction
    'select-none cursor-pointer',
    // Transitions — base duration for hover; active state overrides to instant below
    'transition-colors duration-(--duration-base) ease-(--ease-default)',
    'active:duration-(--duration-instant)',
    // Focus ring — suppresses global *:focus-visible outline, applies token-based ring
    'focus-visible:outline-none',
    'focus-visible:ring-2 focus-visible:ring-(--color-focus-ring) focus-visible:ring-offset-2',
    // Disabled — opacity only, no colour tokens for disabled state (per system rule)
    'disabled:pointer-events-none disabled:opacity-(--opacity-disabled)',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-(--color-interactive-default) text-(--color-text-on-interactive-primary)',
          'hover:bg-(--color-interactive-hover)',
          'active:bg-(--color-interactive-active)',
        ],
        secondary: [
          'bg-(--color-interactive-secondary) text-(--color-text-on-interactive-secondary)',
          'hover:bg-(--color-interactive-secondary-hover)',
          'active:bg-(--color-interactive-secondary-active)',
        ],
        destructive: [
          'bg-(--color-interactive-error) text-(--color-text-on-interactive-error)',
          'hover:bg-(--color-interactive-error-hover)',
          'active:bg-(--color-interactive-error-active)',
        ],
        // Ghost has no fill. Text sits against the page/surface behind it — not an interactive
        // surface. Uses --color-interactive-default as the default text colour (brand-coloured
        // from the first render) with no underline in any state. Hover darkens to -hover, press
        // to -active. All 12 combinations (3 states × 2 modes × 2 backgrounds) pass AA 4.5:1.
        ghost: [
          'bg-transparent text-(--color-interactive-default)',
          'hover:text-(--color-interactive-hover)',
          'active:text-(--color-interactive-active)',
        ],
      },
      size: {
        // sm (36px): ::before expands hit area to 44×44px below lg (touch/tablet).
        // At lg+ (pointer-assumed desktop) the pseudo-element collapses to 0.
        sm: [
          'h-9 px-(--space-4) text-[length:var(--text-body-md)]',
          "before:content-[''] before:absolute before:top-1/2 before:left-1/2",
          'before:-translate-x-1/2 before:-translate-y-1/2',
          'before:min-w-[44px] before:min-h-[44px]',
          'lg:before:min-w-0 lg:before:min-h-0',
        ],
        // md (40px): same touch-target treatment as sm
        md: [
          'h-10 px-(--space-5) text-[length:var(--text-body-md)]',
          "before:content-[''] before:absolute before:top-1/2 before:left-1/2",
          'before:-translate-x-1/2 before:-translate-y-1/2',
          'before:min-w-[44px] before:min-h-[44px]',
          'lg:before:min-w-0 lg:before:min-h-0',
        ],
        // lg (48px): already ≥44px visually — no hit-area expansion needed
        lg: [
          'h-12 px-(--space-6) text-[length:var(--text-body-md)]',
        ],
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  children,
  asChild = false,
  className,
  ...props
}) {
  const Comp = asChild ? Slot.Root : 'button';
  const spinnerIconSize = LOADING_ICON_SIZE[size];

  // Tight single-line line-height on label + icon spans eliminates the "text sits low"
  // vertical-centering bug. Root cause: default browser line-height (1.2–1.5×) creates
  // a taller line-box than the glyphs, and items-center centres the box not the glyphs.
  // These are button-chrome values (not type-scale tokens): buttons are always single-line,
  // so the line-box should match the rendered cap height, not a reading-text rhythm.
  const labelLeading = size === 'lg' ? 'leading-[1rem]' : 'leading-[0.875rem]';

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {/* Spinner overlay — centered, preserves button width, hidden from AT */}
      {loading && (
        <>
          <style>{SPIN_KF}</style>
          <span
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            aria-hidden="true"
          >
            <span
              style={{
                display: 'inline-flex',
                animation: `quicklo-spin var(--duration-spinner) var(--ease-linear) infinite`,
              }}
            >
              <Icon name="Loader2" size={spinnerIconSize} />
            </span>
          </span>
        </>
      )}

      {/* Content — visibility:hidden when loading preserves layout (no reflow).
          Gap is finalized at --space-2 (8px) between icon and label. */}
      <span
        className={cn('inline-flex items-center', labelLeading, loading && 'invisible')}
        style={{ gap: 'var(--space-2)' }}
      >
        {leftIcon && <Icon name={leftIcon} size="md" />}
        {children}
        {rightIcon && <Icon name={rightIcon} size="md" />}
      </span>
    </Comp>
  );
}

export { Button, buttonVariants };
