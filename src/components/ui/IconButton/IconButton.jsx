'use client';

// Tooltip integration:
// IconButton is designed to work directly as Tooltip's children with zero adapter
// code. Because it is React.forwardRef and spreads {...rest}, Tooltip's
// React.cloneElement can attach its callback ref (for position measurement) plus
// onMouseEnter/Leave/Focus/Blur and aria-labelledby/aria-describedby automatically:
//
//   <Tooltip content="Delete connection" type="label" position="top">
//     <IconButton icon={Trash2} aria-label="Delete connection"
//                 variant="destructive" onClick={handleDelete} />
//   </Tooltip>
//
// Use type="label" when wrapping an icon-only button — the tooltip content becomes
// the accessible name via aria-labelledby, supplementing the aria-label fallback
// for when the tooltip has not yet appeared.

import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from '@/design-system/icons/index.js';

const SPIN_KF = `@keyframes quicklo-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`;

// Matches Icon.jsx's SIZE_MAP — icon size is locked 1:1 to button size, no override.
const SIZE_PX = { sm: 16, md: 20, lg: 24 };

const iconButtonVariants = cva(
  [
    'relative inline-flex items-center justify-center',
    'rounded-(--radius-sm)',
    'select-none cursor-pointer',
    'transition-colors duration-(--duration-base) ease-(--ease-default)',
    'active:duration-(--duration-instant)',
    'disabled:pointer-events-none disabled:opacity-(--opacity-disabled)',
  ],
  {
    variants: {
      variant: {
        // INTENTIONAL DIVERGENCE FROM BUTTON'S GHOST VARIANT:
        // Button Ghost keeps brand-coloured text from first render and never adds
        // a background in any state. IconButton Ghost starts at --color-text-secondary
        // at rest and adds a --color-bg-secondary background tint on hover.
        // A solo icon shifting colour alone is a weak affordance without a text
        // label to anchor it — Carbon (IBM) and Primer (GitHub) both add a
        // background fill specifically for icon-only buttons for this reason.
        // Do NOT "fix" this to match Button Ghost — the divergence is correct.
        ghost: [
          'bg-transparent text-(--color-text-secondary)',
          'hover:bg-(--color-bg-secondary) hover:text-(--color-text-primary)',
          'active:bg-(--color-bg-secondary) active:text-(--color-interactive-active)',
        ],
        // PLAIN — transparent in every state, never just at rest. This is the
        // deliberate difference from `ghost`, which tints in --color-bg-secondary
        // on hover for solo-icon affordance (Carbon/Primer's own reasoning for why
        // icon-only buttons usually need SOME hover fill). `plain` is for contexts
        // that want a clean icon with zero background ever — e.g. Toast's close
        // control, sitting on a card that already has its own elevation and
        // shouldn't gain a second, competing hover box. Icon colour still shifts
        // --color-text-secondary → --color-text-primary on hover AND focus (so it
        // remains discoverable/interactive-looking) — only the background is inert.
        plain: [
          'bg-transparent text-(--color-text-secondary)',
          'hover:bg-transparent hover:text-(--color-text-primary)',
          'focus-visible:text-(--color-text-primary)',
          'active:bg-transparent active:text-(--color-interactive-active)',
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
      },
      size: {
        // sm (36px) and md (40px): ::before expands hit area to 44×44px below lg.
        // Gate collapses at lg+ (same technique as Button sm/md — at pointer-assumed
        // desktop, the visual size is acceptable). Do NOT use the always-on technique
        // (Checkbox/Toggle): those elements never reach 44px; sm/md IconButton already
        // approaches it, and lg (48px) exceeds it without any expansion.
        sm: [
          'h-9 w-9',
          "before:content-[''] before:absolute before:top-1/2 before:left-1/2",
          'before:-translate-x-1/2 before:-translate-y-1/2',
          'before:min-w-[44px] before:min-h-[44px]',
          'lg:before:min-w-0 lg:before:min-h-0',
        ],
        md: [
          'h-10 w-10',
          "before:content-[''] before:absolute before:top-1/2 before:left-1/2",
          'before:-translate-x-1/2 before:-translate-y-1/2',
          'before:min-w-[44px] before:min-h-[44px]',
          'lg:before:min-w-0 lg:before:min-h-0',
        ],
        lg: ['h-12 w-12'],
      },
    },
    defaultVariants: {
      variant: 'ghost',
      size: 'sm',
    },
  }
);

const IconButton = React.forwardRef(function IconButton(
  {
    icon,
    variant = 'ghost',
    size = 'sm',
    loading = false,
    disabled = false,
    onClick,
    className,
    ...rest
  },
  ref
) {
  if (process.env.NODE_ENV !== 'production' && !rest['aria-label']) {
    console.warn(
      '[IconButton] aria-label is required — this button has no visible text. ' +
        'Add aria-label="[action name]" to every IconButton instance.'
    );
  }

  const IconComponent = loading ? Loader2 : icon;
  const px = SIZE_PX[size];

  return (
    <button
      ref={ref}
      type="button"
      className={cn(iconButtonVariants({ variant, size }), className)}
      disabled={disabled}
      aria-disabled={loading ? 'true' : undefined}
      onClick={loading ? undefined : onClick}
      {...rest}
    >
      {loading && <style>{SPIN_KF}</style>}
      <span
        aria-hidden="true"
        style={{
          display: 'inline-flex',
          ...(loading && {
            animation: `quicklo-spin var(--duration-spinner) var(--ease-linear) infinite`,
          }),
        }}
      >
        <IconComponent width={px} height={px} strokeWidth={1.5} />
      </span>
    </button>
  );
});

IconButton.displayName = 'IconButton';

export { IconButton };
