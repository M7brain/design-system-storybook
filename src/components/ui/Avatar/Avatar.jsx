'use client';

import React from 'react';
import { Avatar as AvatarPrimitive } from 'radix-ui';
import { Icon } from '@/design-system/icons/Icon.jsx';
import { Skeleton } from '@/design-system/loaders';
import { cn } from '@/lib/utils';

// Avatar is presentational only — it DISPLAYS a person's photo, a business
// logo, initials, or a fallback icon. It never handles uploading; that is
// FileUpload's job, Avatar just consumes a `src` string (e.g. a Supabase
// storage URL). Built on the shadcn/ui Avatar (radix-ui's Avatar primitive,
// already in the stack) — Root/Image/Fallback, not reimplemented.
//
// Content precedence: image -> initials -> icon. AvatarImage renders nothing
// until it has actually loaded; AvatarFallback covers both the "still
// loading" and the "errored" cases, so no separate error state exists (see
// the file-level state list below). delayMs on Fallback is a load-flash
// guard, not an animation.

const SIZE_PX = { sm: 32, md: 40, lg: 48 };
const INITIALS_SIZE = { sm: 'var(--text-body-sm)', md: 'var(--text-body-md)', lg: 'var(--text-body-lg)' };
// Explicit rem line-heights, matching each token's own natural value — never
// unitless, per the line-box-inflation bug already fixed on Button/Input/
// Checkbox/Badge.
const INITIALS_LINE_HEIGHT = { sm: '1rem', md: '1.25rem', lg: '1.5rem' };

// Deliberately Latin-only, not full Unicode \p{L} — Quicklo's market is
// US-only local service businesses, so lead/owner names are expected to be
// Latin-script; this keeps the "no letters, fall through to the icon" check
// simple and matches the actual product's name space. Includes the Latin-1
// Supplement accented range (José, François, Renée) alongside plain A-Z.
const LATIN_LETTER = /[A-Za-zÀ-ÖØ-öø-ÿ]/;

/**
 * Multi-word name -> first + last initial; single word -> first letter;
 * uppercased locale-aware. Returns null (falls through to the icon) when the
 * name is empty/whitespace-only or the derived initials contain no Latin
 * letters at all (emoji-only names, etc.).
 * @param {string|undefined} name
 * @returns {string|null}
 */
function deriveInitials(name) {
  if (!name) return null;
  const trimmed = name.trim();
  if (!trimmed) return null;
  const words = trimmed.split(/\s+/).filter(Boolean);
  const raw = words.length === 1
    ? words[0].charAt(0)
    : words[0].charAt(0) + words[words.length - 1].charAt(0);
  if (!LATIN_LETTER.test(raw)) return null;
  return raw.toLocaleUpperCase();
}

/**
 * @typedef {Object} AvatarProps
 * @property {string} [src] - Image URL (e.g. a Supabase storage URL). When present and it
 *   loads, the image renders. Avatar never uploads — see FileUpload for that.
 * @property {string} [name] - Used to derive initials AND (unless `decorative` or an explicit
 *   `aria-label` is passed) the accessible label.
 * @property {string} [initials] - Explicit override of the derived initials.
 * @property {'sm'|'md'|'lg'} [size='md'] - 32px / 40px / 48px (4px grid).
 * @property {'cover'|'contain'} [fit='cover'] - Image fit inside the (always-circular) frame.
 *   'cover': photos — cropped to fill the circle. 'contain': a wide/non-square business logo
 *   the owner uploaded — centred, on a --color-bg-secondary backdrop, so the whole mark shows
 *   without being cropped. Avatar is circle-only (`--radius-full` universal) — `fit` covers the
 *   logo case without a second shape. See DECISIONS.md (2026-07-08).
 * @property {boolean} [loading=false] - Renders a circular Skeleton at the avatar's exact size
 *   instead of image/initials/icon.
 * @property {boolean} [decorative=false] - When true, the whole avatar is aria-hidden — use
 *   when a visible name already sits next to it (LeadRow, Sidebar user row), so AT doesn't
 *   announce the initials AND the name.
 * @property {string} [className]
 */

/**
 * Avatar — presentational identity element. Circle-only (`--radius-full`
 * universal — see DECISIONS.md 2026-07-08, superseding the earlier `rounded`
 * shape deviation). Content precedence image -> initials -> icon; exactly
 * two states (default, loading) — see the file header. `React.forwardRef` so
 * Avatar can be a Tooltip child or sit inside an interactive wrapper; the
 * wrapper owns any tap target, hover, and focus ring, the same principle as
 * IconButton's own "row owns the tap target" convention. Zero new primitives.
 * @param {AvatarProps} props
 */
export const Avatar = React.forwardRef(function Avatar(
  {
    src,
    name,
    initials,
    size = 'md',
    fit = 'cover',
    loading = false,
    decorative = false,
    className,
    ...rest
  },
  ref
) {
  const px = SIZE_PX[size] ?? SIZE_PX.md;
  const isContain = fit === 'contain';
  const resolvedInitials = initials || deriveInitials(name);
  const trimmedName = name?.trim() || undefined;

  if (process.env.NODE_ENV !== 'production' && !decorative && !trimmedName && !rest['aria-label']) {
    console.warn(
      '[Avatar] no accessible name — pass `name` or `aria-label`, or set `decorative` if a visible label already sits next to it.'
    );
  }

  const sizeStyle = {
    width: `${px}px`,
    height: `${px}px`,
    flexShrink: 0,
  };

  if (loading) {
    return (
      <span ref={ref} {...rest} aria-hidden="true" className={className} style={sizeStyle}>
        <Skeleton variant="circle" width={`${px}px`} height={`${px}px`} />
      </span>
    );
  }

  const ariaLabel = rest['aria-label'] || trimmedName;

  return (
    <AvatarPrimitive.Root
      ref={ref}
      {...rest}
      role={decorative ? undefined : 'img'}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : ariaLabel}
      className={cn('inline-flex overflow-hidden', className)}
      style={{
        ...sizeStyle,
        borderRadius: 'var(--radius-full)',
        // Backdrop for a contain-fit logo (letterboxing / transparent PNGs) —
        // cover-fit never letterboxes (it always fills the circle), so it
        // needs no backdrop of its own; the Fallback below supplies its own
        // full-bleed background when it's the one showing.
        background: isContain ? 'var(--color-bg-secondary)' : undefined,
      }}
    >
      <AvatarPrimitive.Image
        src={src}
        alt=""
        style={{
          width: '100%',
          height: '100%',
          objectFit: isContain ? 'contain' : 'cover',
          transition: `opacity var(--duration-base) var(--ease-default)`,
        }}
      />
      <AvatarPrimitive.Fallback
        delayMs={600}
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--color-avatar-bg)',
        }}
      >
        {resolvedInitials ? (
          <span
            aria-hidden="true"
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 500,
              fontSize: INITIALS_SIZE[size],
              lineHeight: INITIALS_LINE_HEIGHT[size],
              color: 'var(--color-avatar-fg)',
            }}
          >
            {resolvedInitials}
          </span>
        ) : (
          <span aria-hidden="true" style={{ display: 'inline-flex', color: 'var(--color-avatar-fg)' }}>
            <Icon name="User" size={size} />
          </span>
        )}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
});

Avatar.displayName = 'Avatar';
