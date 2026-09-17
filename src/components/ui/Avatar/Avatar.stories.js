import React, { useState } from 'react';
import { Avatar } from './Avatar.jsx';
import { Badge } from '@/components/ui/Badge/Badge.jsx';

// ─────────────────────────────────────────────────────────────────────────────
// META
// ─────────────────────────────────────────────────────────────────────────────

export default {
  title: 'Components/Avatar',
  parameters: {
    layout: 'fullscreen',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS — StoryFrame copied from Button.stories.js
// ─────────────────────────────────────────────────────────────────────────────

function StoryFrame({ children }) {
  const [isDark, setIsDark] = useState(false);

  return (
    <div
      className={isDark ? 'dark' : ''}
      style={{ background: 'var(--color-bg-primary)', minHeight: '100vh', width: '100%', padding: '32px' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <button
          onClick={() => setIsDark(false)}
          aria-pressed={!isDark}
          style={{
            height: '32px', padding: '0 16px',
            borderRadius: 'var(--radius-sm)',
            border: !isDark ? 'none' : '1px solid var(--color-border-default)',
            background: !isDark ? 'var(--color-brand-btn)' : 'transparent',
            color: !isDark ? 'var(--color-brand-btn-text)' : 'var(--color-text-secondary)',
            fontFamily: 'Inter', fontWeight: 500, fontSize: '0.875rem', cursor: 'pointer',
          }}
        >
          Light
        </button>
        <button
          onClick={() => setIsDark(true)}
          aria-pressed={isDark}
          style={{
            height: '32px', padding: '0 16px',
            borderRadius: 'var(--radius-sm)',
            border: isDark ? 'none' : '1px solid var(--color-border-default)',
            background: isDark ? 'var(--color-brand-btn)' : 'transparent',
            color: isDark ? 'var(--color-brand-btn-text)' : 'var(--color-text-secondary)',
            fontFamily: 'Inter', fontWeight: 500, fontSize: '0.875rem', cursor: 'pointer',
          }}
        >
          Dark
        </button>
      </div>
      <div style={{ borderBottom: '1px solid var(--color-border-default)', marginBottom: '32px' }} />
      {children}
    </div>
  );
}

function Divider() {
  return <div style={{ borderBottom: '1px solid var(--color-border-default)', margin: '48px 0' }} />;
}

function SectionHead({ title, description }) {
  return (
    <div style={{ marginBottom: '32px' }}>
      <h2 style={{
        fontFamily: 'Inter, sans-serif', fontSize: '1.25rem', fontWeight: 600,
        lineHeight: '1.75rem', color: 'var(--color-text-primary)', margin: '0 0 8px 0',
      }}>
        {title}
      </h2>
      {description && (
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 400,
          lineHeight: '1.75rem', color: 'var(--color-text-secondary)', margin: 0,
        }}>
          {description}
        </p>
      )}
    </div>
  );
}

function BlockLabel({ children }) {
  return (
    <div style={{
      fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 500,
      letterSpacing: '0.06em', textTransform: 'uppercase',
      color: 'var(--color-text-secondary)', marginBottom: '12px',
    }}>
      {children}
    </div>
  );
}

function InfoBox({ children, style }) {
  return (
    <div style={{
      background: 'var(--color-bg-surface)',
      border: '1px solid var(--color-border-default)',
      borderRadius: 'var(--radius-md)',
      padding: '24px',
      ...style,
    }}>
      {children}
    </div>
  );
}

function Note({ children }) {
  return (
    <p style={{
      fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
      color: 'var(--color-text-secondary)', margin: '16px 0 0 0',
    }}>
      {children}
    </p>
  );
}

function Caption({ children }) {
  return (
    <div style={{
      fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 400,
      lineHeight: '1rem', color: 'var(--color-text-secondary)', marginTop: '8px', textAlign: 'center',
    }}>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SAMPLE MEDIA — self-contained inline SVG data URIs so this story has no
// external network dependency. "Photo" is an abstract warm-gradient
// portrait silhouette (safe placeholder content, not a real face); "Logo"
// is a wide, transparent-background abstract mark, deliberately non-square
// so fit="contain"'s backdrop behaviour is visibly necessary, not just
// decorative. "Broken" is an RFC 2606 .invalid domain,
// which always fails DNS resolution deterministically (no flaky network
// dependency), used to exercise the real fallback-on-error path.
// ─────────────────────────────────────────────────────────────────────────────

const SAMPLE_PHOTO = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fcb67c"/>
      <stop offset="1" stop-color="#c2410c"/>
    </linearGradient>
  </defs>
  <rect width="200" height="200" fill="url(#g)"/>
  <circle cx="100" cy="80" r="38" fill="#ffffff" opacity="0.85"/>
  <ellipse cx="100" cy="190" rx="70" ry="60" fill="#ffffff" opacity="0.85"/>
</svg>
`)}`;

const SAMPLE_LOGO = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="320" height="140" viewBox="0 0 320 140">
  <rect x="20" y="30" width="80" height="80" rx="16" fill="#0369a1"/>
  <circle cx="160" cy="70" r="40" fill="#15803d"/>
  <rect x="220" y="45" width="80" height="50" rx="8" fill="#8a6914"/>
</svg>
`)}`;

const BROKEN_SRC = 'https://storage.quicklo.invalid/avatars/broken.jpg';

// ─────────────────────────────────────────────────────────────────────────────
// REFERENCE DATA
// ─────────────────────────────────────────────────────────────────────────────

const PROPS = [
  { name: 'src', type: 'string', defaultVal: 'undefined', description: 'Image URL (e.g. a Supabase storage URL). Avatar never uploads — see FileUpload for that.' },
  { name: 'name', type: 'string', defaultVal: 'undefined', description: 'Used to derive initials and (unless decorative or an explicit aria-label) the accessible label.' },
  { name: 'initials', type: 'string', defaultVal: 'undefined', description: 'Explicit override of the derived initials.' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", defaultVal: "'md'", description: '32px / 40px / 48px on the 4px grid.' },
  { name: 'fit', type: "'cover' | 'contain'", defaultVal: "'cover'", description: 'cover: photos, cropped to fill the (always-circular) frame. contain: a wide business logo — centred on a neutral backdrop, nothing cropped.' },
  { name: 'loading', type: 'bool', defaultVal: 'false', description: 'Renders a circular Skeleton at the avatar’s exact size instead of image/initials/icon.' },
  { name: 'decorative', type: 'bool', defaultVal: 'false', description: 'Whole avatar aria-hidden. Use when a visible name already sits next to it.' },
];

const SIZE_MAPPING = [
  { size: 'sm', dimension: '32px (--space-8)', initialsType: '--text-body-sm / 1rem lh', iconSize: 'sm — 16px' },
  { size: 'md', dimension: '40px (--space-10, default)', initialsType: '--text-body-md / 1.25rem lh', iconSize: 'md — 20px' },
  { size: 'lg', dimension: '48px (--space-12)', initialsType: '--text-body-lg / 1.5rem lh', iconSize: 'lg — 24px' },
];

const TOKENS = [
  { token: '--color-avatar-bg', value: '#fff4ec / #553b26', usage: 'Monogram + icon-fallback disc fill — light unchanged, dark fixed 2026-07-08 (was invisible via --color-brand-tint)' },
  { token: '--color-avatar-fg', value: '#c2410c / #fff4ec', usage: 'Initials/icon colour — 4.78:1 light / 9.50:1 dark AA' },
  { token: '--color-bg-secondary', value: '#dddddd / #171717', usage: "fit=\"contain\" logo backdrop (behind the image)" },
  { token: '--radius-full', value: '9999px', usage: 'Universal avatar shape — circle-only' },
  { token: '--duration-base', value: '200ms', usage: 'Image fade-in on load (paired with --ease-default)' },
];

// ─────────────────────────────────────────────────────────────────────────────
// STORY EXPORT — single Overview export, per the style guide
// ─────────────────────────────────────────────────────────────────────────────

export const Overview = () => (
  <StoryFrame>

    {/* ── Page header ────────────────────────────────────────────────────── */}
    <div style={{ marginBottom: '48px' }}>
      <h1 style={{
        fontFamily: 'Outfit, sans-serif', fontSize: '1.75rem', fontWeight: 700,
        lineHeight: '2.25rem', letterSpacing: '-0.02em',
        color: 'var(--color-text-primary)', margin: '0 0 8px 0',
      }}>
        Avatar
      </h1>
      <p style={{
        fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 400,
        lineHeight: '1.75rem', color: 'var(--color-text-secondary)', margin: 0,
      }}>
        A display-only identity element — a photo, a business logo, initials, or a fallback icon. Avatar never
        handles uploading; that's FileUpload's job.
      </p>
    </div>

    {/* ── 1. Sizes ──────────────────────────────────────────────────────────── */}
    <SectionHead
      title="Sizes"
      description="sm 32px, md 40px (default), lg 48px — monogram content, so the initials type scale is comparable across sizes."
    />
    <div style={{ marginBottom: '40px' }}>
      <InfoBox style={{ display: 'flex', gap: '32px', alignItems: 'flex-end' }}>
        <div style={{ textAlign: 'center' }}>
          <Avatar name="Sarah Chen" size="sm" />
          <Caption>sm — 32px</Caption>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Avatar name="Sarah Chen" size="md" />
          <Caption>md — 40px (default)</Caption>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Avatar name="Sarah Chen" size="lg" />
          <Caption>lg — 48px</Caption>
        </div>
      </InfoBox>
    </div>

    <Divider />

    {/* ── 2. Fit ────────────────────────────────────────────────────────────── */}
    <SectionHead
      title="Fit"
      description="Avatar is circle-only (--radius-full, universal). fit='cover' (default, photos) vs fit='contain' (a wide business logo the owner uploaded) — a prop, not a second shape, see DECISIONS.md (2026-07-08)."
    />
    <div style={{ marginBottom: '40px' }}>
      <InfoBox style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
        <div style={{ textAlign: 'center' }}>
          <Avatar src={SAMPLE_PHOTO} name="Marco Ruiz" size="lg" fit="cover" />
          <Caption>fit="cover" (default) — cropped to fill the circle</Caption>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Avatar src={SAMPLE_LOGO} name="Ruiz Plumbing Co." size="lg" fit="contain" />
          <Caption>fit="contain" — centred on --color-bg-secondary, inside the circle</Caption>
        </div>
      </InfoBox>
      <Note>
        The sample logo is deliberately wide (320×140) so the letterboxing is visible — the neutral backdrop shows
        through above and below the mark, rather than the logo being stretched or cropped to fill the circle.
      </Note>
    </div>

    <Divider />

    {/* ── 3. Content precedence ────────────────────────────────────────────── */}
    <SectionHead
      title="Content precedence"
      description="image → initials → icon. AvatarFallback covers both 'still loading' and 'errored' identically — there is no separate error state."
    />
    <div style={{ marginBottom: '40px' }}>
      <InfoBox style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'center' }}>
          <Avatar src={SAMPLE_PHOTO} name="Mike Torres" size="lg" />
          <Caption>(a) image loads<br />src provided, resolves</Caption>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Avatar name="Priya Patel" size="lg" />
          <Caption>(b) name → initials<br />no src</Caption>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Avatar size="lg" aria-label="Unnamed lead" />
          <Caption>(c) no usable name → icon<br />no src, no name</Caption>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Avatar src={BROKEN_SRC} name="Jordan Lee" size="lg" />
          <Caption>(d) broken src → falls back<br />fallback chain absorbs the error</Caption>
        </div>
      </InfoBox>
      <Note>
        (d) points at an RFC 2606 .invalid domain, which always fails to resolve — watch it settle on the "JL"
        initials monogram exactly like (b), confirming a load failure is visually identical to no image ever
        having been provided.
      </Note>
    </div>

    <Divider />

    {/* ── 4. Initials logic ────────────────────────────────────────────────── */}
    <SectionHead
      title="Initials logic"
      description="Multi-word → first + last initial. Single word → first letter. No usable Latin letters → falls through to the icon."
    />
    <div style={{ marginBottom: '40px' }}>
      <InfoBox style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'center' }}>
          <Avatar name="Sarah Chen" size="lg" />
          <Caption>"Sarah Chen" → SC<br />two-word</Caption>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Avatar name="Mary Jane Watson" size="lg" />
          <Caption>"Mary Jane Watson" → MW<br />first + LAST, not first + second</Caption>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Avatar name="Madonna" size="lg" />
          <Caption>"Madonna" → M<br />single word</Caption>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Avatar name="" size="lg" aria-label="Empty name" />
          <Caption>"" → icon<br />empty/whitespace-only</Caption>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Avatar name="🎉🎉" size="lg" aria-label="Emoji-only name" />
          <Caption>"🎉🎉" → icon<br />no Latin letters</Caption>
        </div>
      </InfoBox>
    </div>

    <Divider />

    {/* ── 5. Loading state ─────────────────────────────────────────────────── */}
    <SectionHead
      title="Loading state"
      description="The Skeleton primitive's circle variant, sized to match exactly. Avatar is circle-only, so there is only one shape to skeleton."
    />
    <div style={{ marginBottom: '40px' }}>
      <InfoBox style={{ display: 'flex', gap: '32px', alignItems: 'flex-end' }}>
        <div style={{ textAlign: 'center' }}>
          <Avatar loading size="sm" />
          <Caption>sm</Caption>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Avatar loading size="md" />
          <Caption>md</Caption>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Avatar loading size="lg" />
          <Caption>lg</Caption>
        </div>
      </InfoBox>
    </div>

    <Divider />

    {/* ── 6. In context ─────────────────────────────────────────────────────── */}
    <SectionHead
      title="In context"
      description="A LeadRow-like line (decorative, next to a visible name) and a Sidebar-like owner row."
    />
    <div style={{ marginBottom: '40px', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div>
        <BlockLabel>Lead row</BlockLabel>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
          padding: 'var(--space-3) var(--space-4)', maxWidth: '480px',
          background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-default)',
          borderRadius: 'var(--radius-md)',
        }}>
          <Avatar name="Jordan Lee" size="md" decorative />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', minWidth: 0, flex: 1 }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-body-md)', fontWeight: 500, lineHeight: '1.25rem', color: 'var(--color-text-primary)' }}>
              Jordan Lee
            </span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-body-sm)', fontWeight: 400, lineHeight: '1rem', color: 'var(--color-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              Asking about emergency plumbing repair
            </span>
          </div>
          <Badge tone="warning" dot>Awaiting</Badge>
        </div>
        <Note>
          <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>decorative</code> is set —
          the avatar is aria-hidden so a screen reader announces "Jordan Lee" once, from the visible text, not
          twice (once from the avatar's own label, once from the name beside it). Lead status lives on the row's{' '}
          <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>Badge</code>, not on the avatar.
        </Note>
      </div>

      <div>
        <BlockLabel>Sidebar owner row</BlockLabel>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
          padding: 'var(--space-3)', maxWidth: '280px',
          background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)',
        }}>
          <Avatar src={SAMPLE_PHOTO} name="Marco Ruiz" size="md" decorative />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', minWidth: 0 }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-body-md)', fontWeight: 500, lineHeight: '1.25rem', color: 'var(--color-text-primary)' }}>
              Marco Ruiz
            </span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-body-sm)', fontWeight: 400, lineHeight: '1rem', color: 'var(--color-text-secondary)' }}>
              Ruiz Plumbing Co.
            </span>
          </div>
        </div>
      </div>
    </div>

    <Divider />

    {/* ── 7. Reference table ────────────────────────────────────────────────── */}
    <SectionHead
      title="Reference table"
      description="Props, the size → initials-type / icon-size mapping, and the tokens Avatar consumes."
    />

    <div style={{ marginBottom: '32px' }}>
      <BlockLabel>Props</BlockLabel>
      <div style={{
        background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-default)',
        borderRadius: 'var(--radius-md)', overflow: 'hidden',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--color-bg-secondary)' }}>
              {['PROP', 'TYPE', 'DEFAULT', 'DESCRIPTION'].map((h) => (
                <th key={h} style={{
                  padding: '12px 16px', textAlign: 'left',
                  fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 500,
                  textTransform: 'uppercase', letterSpacing: '0.04em',
                  color: 'var(--color-text-secondary)',
                  borderBottom: '1px solid var(--color-border-default)',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PROPS.map((prop, i) => (
              <tr key={prop.name} style={{ background: i % 2 === 0 ? 'var(--color-bg-surface)' : 'var(--color-bg-primary)' }}>
                <td style={{ padding: '12px 16px', minHeight: '44px', fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem', color: 'var(--color-text-primary)', whiteSpace: 'nowrap', borderBottom: i < PROPS.length - 1 ? '1px solid var(--color-border-subtle)' : 'none' }}>
                  {prop.name}
                </td>
                <td style={{ padding: '12px 16px', fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem', color: 'var(--color-text-secondary)', borderBottom: i < PROPS.length - 1 ? '1px solid var(--color-border-subtle)' : 'none' }}>
                  {prop.type}
                </td>
                <td style={{ padding: '12px 16px', fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap', borderBottom: i < PROPS.length - 1 ? '1px solid var(--color-border-subtle)' : 'none' }}>
                  {prop.defaultVal}
                </td>
                <td style={{ padding: '12px 16px', fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-primary)', borderBottom: i < PROPS.length - 1 ? '1px solid var(--color-border-subtle)' : 'none' }}>
                  {prop.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <div style={{ marginBottom: '32px' }}>
      <BlockLabel>Size → initials type / icon size</BlockLabel>
      <div style={{
        background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-default)',
        borderRadius: 'var(--radius-md)', overflow: 'hidden',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--color-bg-secondary)' }}>
              {['SIZE', 'DIMENSION', 'INITIALS TYPE', 'ICON SIZE'].map((h) => (
                <th key={h} style={{
                  padding: '12px 16px', textAlign: 'left',
                  fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 500,
                  textTransform: 'uppercase', letterSpacing: '0.04em',
                  color: 'var(--color-text-secondary)',
                  borderBottom: '1px solid var(--color-border-default)',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SIZE_MAPPING.map((row, i) => (
              <tr key={row.size} style={{ background: i % 2 === 0 ? 'var(--color-bg-surface)' : 'var(--color-bg-primary)' }}>
                <td style={{ padding: '12px 16px', minHeight: '44px', fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem', color: 'var(--color-text-primary)', whiteSpace: 'nowrap', borderBottom: i < SIZE_MAPPING.length - 1 ? '1px solid var(--color-border-subtle)' : 'none' }}>
                  {row.size}
                </td>
                <td style={{ padding: '12px 16px', fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: 'var(--color-text-primary)', whiteSpace: 'nowrap', borderBottom: i < SIZE_MAPPING.length - 1 ? '1px solid var(--color-border-subtle)' : 'none' }}>
                  {row.dimension}
                </td>
                <td style={{ padding: '12px 16px', fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap', borderBottom: i < SIZE_MAPPING.length - 1 ? '1px solid var(--color-border-subtle)' : 'none' }}>
                  {row.initialsType}
                </td>
                <td style={{ padding: '12px 16px', fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap', borderBottom: i < SIZE_MAPPING.length - 1 ? '1px solid var(--color-border-subtle)' : 'none' }}>
                  {row.iconSize}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <div style={{ marginBottom: '40px' }}>
      <BlockLabel>Tokens</BlockLabel>
      <div style={{
        background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-default)',
        borderRadius: 'var(--radius-md)', overflow: 'hidden',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--color-bg-secondary)' }}>
              {['TOKEN', 'VALUE (LIGHT / DARK)', 'USAGE'].map((h) => (
                <th key={h} style={{
                  padding: '12px 16px', textAlign: 'left',
                  fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 500,
                  textTransform: 'uppercase', letterSpacing: '0.04em',
                  color: 'var(--color-text-secondary)',
                  borderBottom: '1px solid var(--color-border-default)',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TOKENS.map((row, i) => (
              <tr key={row.token} style={{ background: i % 2 === 0 ? 'var(--color-bg-surface)' : 'var(--color-bg-primary)' }}>
                <td style={{ padding: '12px 16px', minHeight: '44px', fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem', color: 'var(--color-text-primary)', whiteSpace: 'nowrap', borderBottom: i < TOKENS.length - 1 ? '1px solid var(--color-border-subtle)' : 'none' }}>
                  {row.token}
                </td>
                <td style={{ padding: '12px 16px', fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap', borderBottom: i < TOKENS.length - 1 ? '1px solid var(--color-border-subtle)' : 'none' }}>
                  {row.value}
                </td>
                <td style={{ padding: '12px 16px', fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-primary)', borderBottom: i < TOKENS.length - 1 ? '1px solid var(--color-border-subtle)' : 'none' }}>
                  {row.usage}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <Divider />

    {/* ── 8. Do / Don't ─────────────────────────────────────────────────────── */}
    <SectionHead
      title="Do / Don't"
      description="Three real misuse patterns worth flagging with a live example each."
    />
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px',
      marginBottom: '40px',
    }}>
      <InfoBox style={{ borderColor: 'var(--color-status-error-text)' }}>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-status-error-text)', marginBottom: '16px' }}>
          Don't — no decorative beside a visible name
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <Avatar name="Jordan Lee" size="md" />
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-body-md)', color: 'var(--color-text-primary)' }}>Jordan Lee</span>
        </div>
        <Note>
          Without <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>decorative</code>,
          a screen reader announces "Jordan Lee" from the avatar's own label, then "Jordan Lee" again from the
          visible text right next to it.
        </Note>
      </InfoBox>

      <InfoBox style={{ borderColor: 'var(--color-status-success-text)' }}>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-status-success-text)', marginBottom: '16px' }}>
          Do — decorative beside a visible name
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <Avatar name="Jordan Lee" size="md" decorative />
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-body-md)', color: 'var(--color-text-primary)' }}>Jordan Lee</span>
        </div>
        <Note>The avatar is aria-hidden — the name is announced exactly once, from the visible text.</Note>
      </InfoBox>

      <InfoBox style={{ borderColor: 'var(--color-status-error-text)' }}>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-status-error-text)', marginBottom: '16px' }}>
          Don't — bolt on a presence dot
        </div>
        <div style={{ position: 'relative', display: 'inline-flex' }}>
          <Avatar name="Sarah Chen" size="md" decorative />
          <span
            aria-hidden="true"
            style={{
              position: 'absolute', bottom: 0, right: 0,
              width: '10px', height: '10px', borderRadius: 'var(--radius-full)',
              background: 'var(--color-status-success)', border: '2px solid var(--color-bg-surface)',
            }}
          />
        </div>
        <Note>No presence concept exists in a single-owner product — this dot represents nothing real.</Note>
      </InfoBox>

      <InfoBox style={{ borderColor: 'var(--color-status-success-text)' }}>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-status-success-text)', marginBottom: '16px' }}>
          Do — status lives on the row's Badge
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <Avatar name="Sarah Chen" size="md" decorative />
          <Badge tone="success" dot>Booked</Badge>
        </div>
        <Note>A lead's status is a Badge next to the row, never an overlay on the avatar itself.</Note>
      </InfoBox>

      <InfoBox style={{ borderColor: 'var(--color-status-error-text)' }}>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-status-error-text)', marginBottom: '16px' }}>
          Don't — cover-crop a wide logo
        </div>
        <Avatar src={SAMPLE_LOGO} name="Ruiz Plumbing Co." size="lg" fit="cover" />
        <Note>Default fit="cover" crops a wide logo's edges off — the mark is cut in half.</Note>
      </InfoBox>

      <InfoBox style={{ borderColor: 'var(--color-status-success-text)' }}>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-status-success-text)', marginBottom: '16px' }}>
          Do — use fit="contain" for a logo
        </div>
        <Avatar src={SAMPLE_LOGO} name="Ruiz Plumbing Co." size="lg" fit="contain" />
        <Note>fit="contain" shows the whole mark on a neutral backdrop, nothing cropped.</Note>
      </InfoBox>
    </div>

  </StoryFrame>
);
