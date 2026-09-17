import React, { useState } from 'react';

export default { title: 'Foundations/Colours' };

// ─────────────────────────────────────────────────────────────────────────────
// DATA — hex values are story-only display; never use in component code
// ─────────────────────────────────────────────────────────────────────────────

const PRIMITIVE_GROUPS = [
  { name: 'Orange', primaryStops: ['500'], swatches: [
    { stop: '50',  hex: '#fff4ec' }, { stop: '100', hex: '#feddc3' },
    { stop: '200', hex: '#fdcda5' }, { stop: '300', hex: '#fcb67c' },
    { stop: '400', hex: '#fca863' }, { stop: '500', hex: '#fb923c' },
    { stop: '600', hex: '#e48537' }, { stop: '700', hex: '#b2682b' },
    { stop: '800', hex: '#8a5021' }, { stop: '900', hex: '#693d19' },
  ]},
  { name: 'Brick', primaryStops: ['500'], swatches: [
    { stop: '50',  hex: '#f9ece7' }, { stop: '100', hex: '#ecc4b4' },
    { stop: '200', hex: '#e3a88f' }, { stop: '300', hex: '#d6805c' },
    { stop: '400', hex: '#ce673d' }, { stop: '500', hex: '#c2410c' },
    { stop: '600', hex: '#b13b0b' }, { stop: '700', hex: '#8a2e09' },
    { stop: '800', hex: '#6b2407' }, { stop: '900', hex: '#511b05' },
  ]},
  { name: 'Cloud', primaryStops: ['50', '500'], lightFamily: true, swatches: [
    { stop: '50',  hex: '#ffffff' }, { stop: '100', hex: '#fbfbfb' },
    { stop: '200', hex: '#f9f9f9' }, { stop: '300', hex: '#f7f7f7' },
    { stop: '400', hex: '#f5f5f5' }, { stop: '500', hex: '#f3f3f3' },
    { stop: '600', hex: '#dddddd' }, { stop: '700', hex: '#adadad' },
    { stop: '800', hex: '#868686' }, { stop: '900', hex: '#666666' },
  ]},
  { name: 'Charcoal', primaryStops: ['700', '900'], swatches: [
    { stop: '50',  hex: '#eaeaea' }, { stop: '100', hex: '#bdbdbd' },
    { stop: '200', hex: '#9d9d9d' }, { stop: '300', hex: '#707070' },
    { stop: '400', hex: '#555555' }, { stop: '500', hex: '#2a2a2a' },
    { stop: '600', hex: '#262626' }, { stop: '700', hex: '#1e1e1e' },
    { stop: '800', hex: '#171717' }, { stop: '900', hex: '#121212' },
  ]},
  { name: 'Green', primaryStops: ['500'], swatches: [
    { stop: '50',  hex: '#e8f2ec' }, { stop: '100', hex: '#b6d8c3' },
    { stop: '200', hex: '#93c5a6' }, { stop: '300', hex: '#62aa7d' },
    { stop: '400', hex: '#449964' }, { stop: '500', hex: '#15803d' },
    { stop: '600', hex: '#137438' }, { stop: '700', hex: '#0f5b2b' },
    { stop: '800', hex: '#0c4622' }, { stop: '900', hex: '#09361a' },
  ]},
  { name: 'Yellow', primaryStops: ['500'], swatches: [
    { stop: '50',  hex: '#fff9e9' }, { stop: '100', hex: '#feebbb' },
    { stop: '200', hex: '#fde29a' }, { stop: '300', hex: '#fcd46c' },
    { stop: '400', hex: '#fccc50' }, { stop: '500', hex: '#fbbf24' },
    { stop: '600', hex: '#e4ae21' }, { stop: '700', hex: '#b2881a' },
    { stop: '800', hex: '#8a6914' }, { stop: '900', hex: '#69500f' },
  ]},
  { name: 'Blue', primaryStops: ['500'], swatches: [
    { stop: '50',  hex: '#e6f0f6' }, { stop: '100', hex: '#b1d1e2' },
    { stop: '200', hex: '#8bbad4' }, { stop: '300', hex: '#569bc0' },
    { stop: '400', hex: '#3587b4' }, { stop: '500', hex: '#0369a1' },
    { stop: '600', hex: '#036093' }, { stop: '700', hex: '#024b72' },
    { stop: '800', hex: '#023a59' }, { stop: '900', hex: '#012c44' },
  ]},
  { name: 'Red', primaryStops: ['500'], swatches: [
    { stop: '50',  hex: '#f8e8e8' }, { stop: '100', hex: '#e9b9b9' },
    { stop: '200', hex: '#df9797' }, { stop: '300', hex: '#d06767' },
    { stop: '400', hex: '#c74949' }, { stop: '500', hex: '#b91c1c' },
    { stop: '600', hex: '#a81919' }, { stop: '700', hex: '#831414' },
    { stop: '800', hex: '#660f0f' }, { stop: '900', hex: '#4e0c0c' },
  ]},
];

const SEMANTIC_SECTIONS = [
  { title: 'Brand', tokens: [
    { token: '--color-brand-btn',       role: 'Brand button fill',    lhex: '#c2410c', dhex: '#fb923c' },
    { token: '--color-brand-btn-text',  role: 'Text on brand button', lhex: '#ffffff', dhex: '#121212' },
    { token: '--color-brand-tint',      role: 'Active bg / tag bg',   lhex: '#fff4ec', dhex: '#262626' },
    { token: '--color-brand-tint-text', role: 'Text on brand tint',   lhex: '#c2410c', dhex: '#fb923c' },
  ]},
  { title: 'Background', tokens: [
    { token: '--color-bg-primary',   role: 'Page background',      lhex: '#f3f3f3',         dhex: '#121212'          },
    { token: '--color-bg-secondary', role: 'Secondary background',  lhex: '#dddddd',         dhex: '#171717'          },
    { token: '--color-bg-surface',   role: 'Card / panel surface',  lhex: '#ffffff',         dhex: '#1e1e1e'          },
    { token: '--color-bg-overlay',   role: 'Modal overlay',         lhex: 'rgba(0,0,0,0.4)', dhex: 'rgba(0,0,0,0.6)', isOverlay: true },
    { token: '--color-bg-input',     role: 'Input field resting fill — decoupled from bg-primary so it can be tuned independently', lhex: '#f3f3f3', dhex: '#171717' },
  ]},
  { title: 'Text', tokens: [
    { token: '--color-text-primary',                   role: 'Primary text',                             lhex: '#121212', dhex: '#fbfbfb' },
    { token: '--color-text-secondary',                 role: 'Secondary / muted text',                   lhex: '#707070', dhex: '#adadad' },
    { token: '--color-text-tertiary',                  role: 'Placeholder / hint',                       lhex: '#868686', dhex: '#868686' },
    { token: '--color-text-on-interactive-primary',    role: 'Text on primary (brand CTA) fill',         lhex: '#ffffff', dhex: '#121212' },
    { token: '--color-text-on-interactive-secondary',  role: 'Text on secondary fill (aliases --color-text-primary in dark)', lhex: '#555555', dhex: '#ffffff' },
    { token: '--color-text-on-interactive-error',      role: 'Text on destructive fill — always white, mode-invariant', lhex: '#ffffff', dhex: '#ffffff' },
  ]},
  { title: 'Border', tokens: [
    { token: '--color-border-default', role: 'Default border',          lhex: '#dddddd', dhex: '#2a2a2a' },
    { token: '--color-border-subtle',  role: 'Subtle border',           lhex: '#f3f3f3', dhex: '#1e1e1e' },
    { token: '--color-border-strong',  role: 'Strong border / divider', lhex: '#adadad', dhex: '#555555' },
  ]},
  { title: 'Interactive', tokens: [
    { token: '--color-interactive-default',          role: 'CTA / primary button fill',              lhex: '#c2410c', dhex: '#fb923c' },
    { token: '--color-interactive-hover',            role: 'Primary button hover',                   lhex: '#b13b0b', dhex: '#fca863' },
    { token: '--color-interactive-active',           role: 'Primary button pressed',                 lhex: '#8a2e09', dhex: '#e48537' },
    { token: '--color-interactive-secondary',        role: 'Secondary button fill (default)',         lhex: '#eaeaea', dhex: '#555555' },
    { token: '--color-interactive-secondary-hover',  role: 'Secondary button hover (lighter = lift)', lhex: '#dddddd', dhex: '#707070' },
    { token: '--color-interactive-secondary-active', role: 'Secondary button pressed (darker = push)', lhex: '#adadad', dhex: '#2a2a2a' },
    { token: '--color-interactive-error',            role: 'Destructive button fill (same both modes)', lhex: '#b91c1c', dhex: '#b91c1c' },
    { token: '--color-interactive-error-hover',      role: 'Destructive button hover',               lhex: '#a81919', dhex: '#a81919' },
    { token: '--color-interactive-error-active',     role: 'Destructive button pressed',             lhex: '#831414', dhex: '#831414' },
    { token: '--color-focus-ring',                   role: 'Focus ring (alias → interactive-default)', lhex: '#c2410c', dhex: '#fb923c' },
  ]},
  { title: 'Nav', tokens: [
    { token: '--color-nav-inactive', role: 'Inactive nav icons', lhex: '#868686', dhex: '#9d9d9d' },
  ]},
  { title: 'Status', tokens: [
    { token: '--color-status-success',      role: 'Success badge fill',  lhex: '#15803d', dhex: '#15803d' },
    { token: '--color-status-error',        role: 'Error badge fill',    lhex: '#b91c1c', dhex: '#b91c1c' },
    { token: '--color-status-warning',      role: 'Warning badge fill',  lhex: '#fbbf24', dhex: '#fbbf24' },
    { token: '--color-status-info',         role: 'Info badge fill',     lhex: '#0369a1', dhex: '#0369a1' },
    { token: '--color-status-neutral',      role: 'Neutral badge fill — the only status fill with a per-mode override (3:1 dot-vs-chip contrast on --color-bg-secondary in both modes)', lhex: '#707070', dhex: '#9d9d9d' },
    { token: '--color-status-success-text', role: 'Success title text',  lhex: '#0f5b2b', dhex: '#62aa7d' },
    { token: '--color-status-error-text',   role: 'Error title text',    lhex: '#831414', dhex: '#df9797' },
    { token: '--color-status-warning-text', role: 'Warning title text',  lhex: '#8a6914', dhex: '#fcd46c' },
    { token: '--color-status-info-text',    role: 'Info title text',     lhex: '#024b72', dhex: '#569bc0' },
    { token: '--color-status-success-bg',   role: 'Success card tint',   lhex: '#e8f2ec', dhex: '#1e1e1e' },
    { token: '--color-status-error-bg',     role: 'Error card tint',     lhex: '#f8e8e8', dhex: '#1e1e1e' },
    { token: '--color-status-warning-bg',   role: 'Warning card tint',   lhex: '#fff9e9', dhex: '#1e1e1e' },
    { token: '--color-status-info-bg',      role: 'Info card tint',      lhex: '#e6f0f6', dhex: '#1e1e1e' },
  ]},
];

// ─────────────────────────────────────────────────────────────────────────────
// SHARED — button style helper
// ─────────────────────────────────────────────────────────────────────────────

function modeBtn(active) {
  return {
    height: '32px',
    padding: '0 16px',
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.875rem',
    fontWeight: 500,
    cursor: 'pointer',
    outline: 'none',
    borderRadius: 'var(--radius-sm)',
    background: active ? 'var(--color-brand-btn)' : 'transparent',
    color: active ? 'var(--color-brand-btn-text)' : 'var(--color-text-secondary)',
    border: active ? '1px solid transparent' : '1px solid var(--color-border-default)',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// SHARED — reference table
// ─────────────────────────────────────────────────────────────────────────────

function RefTable({ headers, rows }) {
  return (
    <div style={{ background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', overflow: 'hidden', width: '100%' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: 'var(--color-bg-primary)', borderBottom: '2px solid var(--color-border-default)' }}>
            {headers.map((h) => (
              <th key={h} style={{
                padding: '12px 16px',
                textAlign: 'left',
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: 'var(--color-text-secondary)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((cells, i) => (
            <tr
              key={i}
              style={{
                backgroundColor: i % 2 === 1 ? 'var(--color-bg-primary)' : 'var(--color-bg-surface)',
                borderBottom: '1px solid var(--color-border-subtle)',
                minHeight: '44px',
              }}
            >
              {cells.map((cell, ci) => (
                <td key={ci} style={{
                  padding: '12px 16px',
                  fontFamily: ci === 0 ? 'ui-monospace, monospace' : 'Inter, sans-serif',
                  fontSize: '0.875rem',
                  color: 'var(--color-text-primary)',
                  lineHeight: '1.25rem',
                }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const DIVIDER = (
  <div style={{ borderTop: '1px solid var(--color-border-default)', margin: '32px 0' }} />
);

// ─────────────────────────────────────────────────────────────────────────────
// STORY 1 — PRIMITIVES
// ─────────────────────────────────────────────────────────────────────────────

function PrimitivesStory() {
  const [dark, setDark] = useState(false);
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  const q = query.toLowerCase().trim();

  const filtered = PRIMITIVE_GROUPS.map((group) => {
    const nameMatch = group.name.toLowerCase().includes(q);
    const filteredSwatches = q === '' || nameMatch
      ? group.swatches
      : group.swatches.filter((s) => s.stop.includes(q) || s.hex.toLowerCase().includes(q));
    return { ...group, filteredSwatches };
  }).filter((g) => g.filteredSwatches.length > 0);

  const count = filtered.reduce((sum, g) => sum + g.filteredSwatches.length, 0);

  const primitiveRows = PRIMITIVE_GROUPS.flatMap((group) =>
    group.swatches.map((swatch) => [
      `--primitive-${group.name.toLowerCase()}-${swatch.stop}`,
      swatch.hex, /* story-only hex */
      group.name,
    ])
  );

  return (
    <div
      className={dark ? 'dark' : ''}
      style={{ background: 'var(--color-bg-primary)', minHeight: '100vh', padding: '0' }}
    >
      {/* Controls row */}
      <div style={{ background: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border-default)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 24px' }}>
          <button aria-pressed={!dark} onClick={() => setDark(false)} style={modeBtn(!dark)}>Light</button>
          <button aria-pressed={dark}  onClick={() => setDark(true)}  style={modeBtn(dark)}>Dark</button>
          <input
            type="text"
            aria-label="Search colours"
            placeholder="Search colours..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{
              height: '36px',
              padding: '0 12px',
              border: focused ? '1px solid var(--color-brand-btn)' : '1px solid var(--color-border-default)',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--color-bg-surface)',
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem',
              color: 'var(--color-text-primary)',
              outline: 'none',
              width: '220px',
            }}
          />
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 400, color: 'var(--color-text-secondary)', lineHeight: '1.25rem' }}>
            {count} swatches
          </span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '32px 32px 64px 32px' }}>

        {/* Page header */}
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.75rem', fontWeight: 700, lineHeight: '2.25rem', color: 'var(--color-text-primary)', margin: '0 0 8px 0' }}>
          Colour primitives
        </h1>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 400, lineHeight: '1.75rem', color: 'var(--color-text-secondary)', margin: '0 0 32px 0' }}>
          The raw palette — 8 colour families, each with 10 stops from 50 to 900. Components never reference these directly; use semantic tokens instead.
        </p>

        {/* Visual scale — horizontal rows */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0', fontFamily: 'Inter, sans-serif', fontSize: '1rem', color: 'var(--color-text-secondary)' }}>
            No results for "{query}"
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {filtered.map((group) => (
              <div key={group.name} style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: '8px' }}>
                {/* Family label */}
                <div style={{
                  width: '80px',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  height: '52px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: 'var(--color-text-secondary)',
                  lineHeight: '1.25rem',
                }}>
                  {group.name}
                </div>
                {/* Swatches 50 → 900 */}
                {group.filteredSwatches.map((swatch) => {
                  const isPrimary = group.primaryStops.includes(swatch.stop);
                  return (
                    <div key={swatch.stop} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                      <div
                        aria-hidden="true"
                        style={{
                          width: '80px',
                          height: '52px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: swatch.hex, /* story-only hex */
                          outline: isPrimary ? '2px solid var(--color-border-strong)' : 'none',
                          outlineOffset: isPrimary ? '2px' : '0',
                          /* hairline border keeps very-light Cloud swatches visible */
                          border: group.lightFamily ? '1px solid var(--color-border-default)' : 'none',
                        }}
                      />
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 400, color: 'var(--color-text-secondary)', lineHeight: '1rem', textAlign: 'center' }}>
                        {swatch.stop}
                      </span>
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 400, color: 'var(--color-text-secondary)', lineHeight: '1rem', textAlign: 'center' }}>
                        {swatch.hex}
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        {DIVIDER}

        {/* Usage guide */}
        <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.25rem', fontWeight: 600, lineHeight: '1.75rem', color: 'var(--color-text-primary)', margin: '0 0 8px 0' }}>
          Usage
        </h2>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 400, lineHeight: '1.75rem', color: 'var(--color-text-secondary)', margin: '0 0 12px 0' }}>
          Primitives are the raw colour values. They are never used in component code.
        </p>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            ['Use', 'Semantic tokens (--color-*) in all component and page code.'],
            ['Do not use', 'Primitive tokens (--primitive-*) in components — they bypass dark mode.'],
            ['Do not use', 'Hardcoded hex values anywhere outside globals.css.'],
            ['Outlined stops', 'Anchor stops used by semantic tokens — see DOC-colour-system.md.'],
          ].map(([label, rule]) => (
            <li key={label} style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-primary)' }}>
              <strong>{label}:</strong> {rule}
            </li>
          ))}
        </ul>

        {DIVIDER}

        {/* Reference table */}
        <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.25rem', fontWeight: 600, lineHeight: '1.75rem', color: 'var(--color-text-primary)', margin: '0 0 16px 0' }}>
          Reference table
        </h2>
        <RefTable
          headers={['TOKEN', 'HEX', 'GROUP']}
          rows={primitiveRows}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STORY 2 — SEMANTIC TOKENS
// ─────────────────────────────────────────────────────────────────────────────

function SemanticStory() {
  const [dark, setDark] = useState(false);
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  const q = query.toLowerCase().trim();

  const filtered = q === ''
    ? SEMANTIC_SECTIONS
    : SEMANTIC_SECTIONS.map((section) => ({
        ...section,
        tokens: section.tokens.filter((t) =>
          t.token.toLowerCase().includes(q) || t.role.toLowerCase().includes(q)
        ),
      })).filter((s) => s.tokens.length > 0);

  const count = filtered.reduce((sum, s) => sum + s.tokens.length, 0);

  const semanticRows = SEMANTIC_SECTIONS.flatMap((s) =>
    s.tokens.map((t) => [t.token, t.lhex, t.dhex, t.role])
  );

  return (
    <div
      className={dark ? 'dark' : ''}
      style={{ background: 'var(--color-bg-primary)', minHeight: '100vh', padding: '0' }}
    >
      {/* Controls row */}
      <div style={{ background: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border-default)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 24px' }}>
          <button aria-pressed={!dark} onClick={() => setDark(false)} style={modeBtn(!dark)}>Light</button>
          <button aria-pressed={dark}  onClick={() => setDark(true)}  style={modeBtn(dark)}>Dark</button>
          <input
            type="text"
            aria-label="Search tokens"
            placeholder="Search tokens..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{
              height: '36px',
              padding: '0 12px',
              border: focused ? '1px solid var(--color-brand-btn)' : '1px solid var(--color-border-default)',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--color-bg-surface)',
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem',
              color: 'var(--color-text-primary)',
              outline: 'none',
              width: '220px',
            }}
          />
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 400, color: 'var(--color-text-secondary)', lineHeight: '1.25rem' }}>
            {count} tokens
          </span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '32px 32px 64px 32px' }}>

        {/* Page header */}
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.75rem', fontWeight: 700, lineHeight: '2.25rem', color: 'var(--color-text-primary)', margin: '0 0 8px 0' }}>
          Semantic colour tokens
        </h1>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 400, lineHeight: '1.75rem', color: 'var(--color-text-secondary)', margin: '0 0 32px 0' }}>
          Every colour used in components comes from these tokens. Toggle Light/Dark above to verify each token responds correctly to dark mode.
        </p>

        {/* Zero results */}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 0', fontFamily: 'Inter, sans-serif', fontSize: '1rem', color: 'var(--color-text-secondary)' }}>
            No results for "{query}"
          </div>
        )}

        {/* Grouped card grid */}
        {filtered.map((section, si) => (
          <div key={section.title}>
            {si > 0 && DIVIDER}
            <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.25rem', fontWeight: 600, lineHeight: '1.75rem', color: 'var(--color-text-primary)', margin: '0 0 16px 0' }}>
              {section.title}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
              {section.tokens.map((t) => {
                const resolvedHex = dark ? t.dhex : t.lhex;
                return (
                  <div
                    key={t.token}
                    style={{
                      background: 'var(--color-bg-surface)',
                      padding: '16px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border-default)',
                    }}
                  >
                    {/* Colour swatch */}
                    {t.isOverlay ? (
                      <div
                        aria-hidden="true"
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'repeating-conic-gradient(#cccccc 0% 25%, #ffffff 0% 50%) 0 0 / 12px 12px',
                          position: 'relative',
                          overflow: 'hidden',
                        }}
                      >
                        <div style={{ position: 'absolute', inset: 0, background: `var(${t.token})` }} />
                      </div>
                    ) : (
                      <div
                        aria-hidden="true"
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: `var(${t.token})`,
                          border: '1px solid var(--color-border-default)',
                        }}
                      />
                    )}
                    {/* Token name */}
                    <div style={{ marginTop: '8px', fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem', lineHeight: '1.25rem', color: 'var(--color-text-primary)' }}>
                      {t.token}
                    </div>
                    {/* Role */}
                    <div style={{ marginTop: '4px', fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 400, lineHeight: '1.25rem', color: 'var(--color-text-secondary)' }}>
                      {t.role}
                    </div>
                    {/* Resolved hex */}
                    <div style={{ marginTop: '2px', fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 400, lineHeight: '1rem', color: 'var(--color-text-secondary)' }}>
                      {resolvedHex}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {DIVIDER}

        {/* Usage guide */}
        <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.25rem', fontWeight: 600, lineHeight: '1.75rem', color: 'var(--color-text-primary)', margin: '0 0 8px 0' }}>
          Usage
        </h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            ['Always', 'Use --color-* semantic tokens in all component code.'],
            ['Never', 'Reference --primitive-* tokens in components — they break dark mode.'],
            ['Never', 'Hardcode hex values in components, pages, or inline styles outside globals.css.'],
            ['Never', 'Create --color-*-disabled tokens — use opacity: var(--opacity-disabled) instead.'],
            ['Dark mode', 'Add class="dark" to <html> — every semantic token re-themes automatically.'],
          ].map(([label, rule]) => (
            <li key={label} style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-primary)' }}>
              <strong>{label}:</strong> {rule}
            </li>
          ))}
        </ul>

        {DIVIDER}

        {/* Reference table */}
        <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.25rem', fontWeight: 600, lineHeight: '1.75rem', color: 'var(--color-text-primary)', margin: '0 0 16px 0' }}>
          Reference table
        </h2>
        <RefTable
          headers={['TOKEN', 'LIGHT', 'DARK', 'USAGE']}
          rows={semanticRows}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

export const Primitives = { render: () => <PrimitivesStory /> };
export const SemanticTokens = { render: () => <SemanticStory /> };
