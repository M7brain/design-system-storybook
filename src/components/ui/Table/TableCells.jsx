'use client';

import React from 'react';
import { Icon } from '@/design-system/icons/Icon.jsx';
import { IconButton } from '@/components/ui/IconButton/IconButton.jsx';
import { Avatar } from '@/components/ui/Avatar/Avatar.jsx';
import { Badge } from '@/components/ui/Badge/Badge.jsx';
import { Chip } from '@/components/ui/Badge/Chip.jsx';
import { Chart } from '@/components/ui/Chart/Chart.jsx';
import { Copy } from '@/design-system/icons/index.js';
import { cn } from '@/lib/utils';

// Table's cell-renderer library. Every renderer is a plain function
// component consumed as `column.cell={(row) => <SomeCell .../>}` — none of
// them need React.forwardRef (they're render helpers, never a Tooltip child
// or a ref target the way Table/TableBatchBar themselves are).
//
// Text tokens are repeated per-renderer rather than pulled into one shared
// constant object, matching this codebase's existing per-component style
// (Pagination's READOUT_TEXT_STYLE, Alert's TEXT_STYLE_BASE) — each file
// owns its own text styles rather than importing a cross-component one.

const BASE_TEXT = {
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--text-body-md)',
  lineHeight: '1.25rem',
  color: 'var(--color-text-primary)',
};

/** text — the default cell when a column has no `cell` renderer. */
export function TextCell({ value }) {
  return <span style={BASE_TEXT}>{value}</span>;
}

/**
 * primary — two-line: bold primary line + secondary meta line, with an
 * optional leading Avatar (size="sm") or Icon. This is also the renderer
 * columns most often mark `isPrimary: true` (the mobile card header).
 */
export function PrimaryCell({ avatarProps, icon, primary, meta }) {
  return (
    <div className="flex items-center" style={{ gap: 'var(--space-3)' }}>
      {avatarProps && <Avatar size="sm" decorative {...avatarProps} />}
      {!avatarProps && icon && (
        <span aria-hidden="true" style={{ display: 'inline-flex', flexShrink: 0, color: 'var(--color-text-secondary)' }}>
          <Icon name={icon} size="md" />
        </span>
      )}
      {/* 2px literal, not a --space-* token — matches Chip's own documented
          workaround for the broken --space-0\.5 token (see globals.css /
          docs/DECISIONS.md 2026-07-09): this is the natural tight gap
          between a two-line primary/meta stack, smaller than the smallest
          working whole-integer token (--space-1, 4px). */}
      <div className="flex flex-col min-w-0" style={{ gap: '2px' }}>
        <span style={{ ...BASE_TEXT, fontWeight: 500 }} className="truncate">
          {primary}
        </span>
        {meta && (
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-body-sm)',
              lineHeight: '1rem',
              color: 'var(--color-text-secondary)',
            }}
            className="truncate"
          >
            {meta}
          </span>
        )}
      </div>
    </div>
  );
}

/** badge — composes Badge as-is, no restyling. */
export function BadgeCell(props) {
  return <Badge {...props} />;
}

/**
 * chips — composes Chip, wraps onto multiple lines, collapses overflow past
 * `max` into a single trailing neutral "+N" Chip (label variant, not count —
 * it isn't a number that changes, it's a fixed "how many more" summary).
 */
export function ChipsCell({ items = [], max = 3 }) {
  const shown = items.slice(0, max);
  const overflow = items.length - shown.length;
  return (
    <div className="flex flex-wrap items-center" style={{ gap: 'var(--space-1)' }}>
      {shown.map((item, i) => (
        <Chip key={item.key ?? i} variant={item.variant ?? 'status'} tone={item.tone} icon={item.icon} dot={item.dot}>
          {item.label}
        </Chip>
      ))}
      {overflow > 0 && <Chip variant="label">{`+${overflow}`}</Chip>}
    </div>
  );
}

/** numeric — right-aligned, tabular-nums so digit columns stay aligned. */
export function NumericCell({ value, formatter }) {
  const text = formatter ? formatter(value) : value;
  return (
    <span style={{ ...BASE_TEXT, fontVariantNumeric: 'tabular-nums' }} className="block text-right">
      {text}
    </span>
  );
}

/** mono — font-mono, optional trailing plain Copy IconButton (full value is always available via the copy). */
export function MonoCell({ value, copyable = false }) {
  const [copied, setCopied] = React.useState(false);

  return (
    <div className="flex items-center min-w-0" style={{ gap: 'var(--space-2)' }}>
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-body-sm)',
          lineHeight: '1rem',
          color: 'var(--color-text-primary)',
        }}
        className="truncate"
      >
        {value}
      </span>
      {copyable && (
        <IconButton
          icon={Copy}
          variant="plain"
          size="sm"
          aria-label={copied ? 'Copied' : `Copy ${value}`}
          onClick={(e) => {
            e.stopPropagation();
            navigator.clipboard?.writeText(String(value));
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
        />
      )}
    </div>
  );
}

/** time — a relative label with the absolute value in the native `title` tooltip. */
export function TimeCell({ value, label, title }) {
  return (
    <time dateTime={value} title={title} style={BASE_TEXT}>
      {label}
    </time>
  );
}

/** link — text + trailing ExternalLink icon, brand-interactive colour. */
export function LinkCell({ href, children, onClick }) {
  return (
    <a
      href={href}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e);
      }}
      target={href ? '_blank' : undefined}
      rel={href ? 'noopener noreferrer' : undefined}
      className="inline-flex items-center"
      style={{
        gap: 'var(--space-1)',
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--text-body-md)',
        lineHeight: '1.25rem',
        color: 'var(--color-interactive-default)',
      }}
    >
      {children}
      <Icon name="ExternalLink" size="sm" />
    </a>
  );
}

/** avatarStack — overlapping Avatars (size="sm") + a "+N" overflow bubble. */
export function AvatarStackCell({ items = [], max = 4 }) {
  const shown = items.slice(0, max);
  const overflow = items.length - shown.length;
  return (
    <div className="flex items-center" role="img" aria-label={`${items.length} people`}>
      {shown.map((item, i) => (
        <span
          key={item.key ?? i}
          style={{
            marginLeft: i === 0 ? 0 : 'calc(-1 * var(--space-2))',
            border: '2px solid var(--color-bg-surface)',
            borderRadius: 'var(--radius-full)',
            display: 'inline-flex',
          }}
        >
          <Avatar size="sm" decorative {...item} />
        </span>
      ))}
      {overflow > 0 && (
        <span
          aria-hidden="true"
          className="inline-flex items-center justify-center"
          style={{
            marginLeft: 'calc(-1 * var(--space-2))',
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-full)',
            border: '2px solid var(--color-bg-surface)',
            background: 'var(--color-bg-secondary)',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-body-sm)',
            fontWeight: 500,
            lineHeight: '1rem',
            color: 'var(--color-text-secondary)',
          }}
        >
          {`+${overflow}`}
        </span>
      )}
    </div>
  );
}

/** sparkline — composes Chart type="sparkline". Bare embed, no chrome, per Chart's own spec. */
export function SparklineCell({ data, form = 'line', ariaLabel }) {
  return (
    <div style={{ width: '96px' }}>
      <Chart type="sparkline" data={data} form={form} ariaLabel={ariaLabel} />
    </div>
  );
}

/**
 * actions — a slot. Consumer supplies inline IconButtons and/or a trailing
 * ChevronRight (for navigable rows). Not a menu — Dropdown is unbuilt; a
 * future overflow-menu treatment composes Dropdown here once it ships,
 * exactly like DateTimePicker/Pagination's other "local now, migrate later"
 * stand-ins.
 */
export function ActionsCell({ children, align = 'end' }) {
  return (
    <div
      className={cn('flex items-center', align === 'end' ? 'justify-end' : 'justify-start')}
      style={{ gap: 'var(--space-1)' }}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  );
}
