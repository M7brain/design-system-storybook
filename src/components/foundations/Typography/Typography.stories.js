import React, { useState } from 'react';

export default {
  title: 'Foundations/Typography',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Quicklo type scale — 11 tokens across 5 groups. ' +
          'Outfit for Display + H1–H3. Inter for H4 and everything below. ' +
          'All line-heights are multiples of 0.25rem (4px grid). ' +
          'Read the UsageGuide story before using any token in a component.',
      },
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// TOKEN DATA
// ─────────────────────────────────────────────────────────────────────────────

// family: 'heading' → var(--font-heading) / 'body' → var(--font-body)
const TYPE_GROUPS = [
  {
    group: 'Display',
    usage: 'Marketing and landing pages only — never in dashboard UI',
    tokens: [
      { name: '--text-display',    cssVar: 'var(--text-display)',    size: '3rem',     sizePx: 48, lh: '3.5rem',  lhPx: 56, weight: 700, family: 'heading', tracking: '-0.03em',  sample: 'Reply in 90 seconds.' },
      { name: '--text-display-sm', cssVar: 'var(--text-display-sm)', size: '2.25rem',  sizePx: 36, lh: '2.75rem', lhPx: 44, weight: 700, family: 'heading', tracking: '-0.025em', sample: 'Win every job.' },
    ],
  },
  {
    group: 'Heading',
    usage: 'Product UI structure — H1 through H4',
    tokens: [
      { name: '--text-h1', cssVar: 'var(--text-h1)', size: '1.75rem',  sizePx: 28, lh: '2.25rem', lhPx: 36, weight: 700, family: 'heading', tracking: '-0.02em',  sample: 'Your leads, replied.' },
      { name: '--text-h2', cssVar: 'var(--text-h2)', size: '1.375rem', sizePx: 22, lh: '1.75rem', lhPx: 28, weight: 600, family: 'heading', tracking: '-0.015em', sample: 'Lead dashboard' },
      { name: '--text-h3', cssVar: 'var(--text-h3)', size: '1.125rem', sizePx: 18, lh: '1.5rem',  lhPx: 24, weight: 600, family: 'heading', tracking: '-0.01em',  sample: 'Recent activity' },
      {
        // H4 is intentionally larger than H3: Inter 600 for product UI contexts
        // (sidebar labels, settings groups) while H3 uses Outfit 600 for section headings.
        name: '--text-h4', cssVar: 'var(--text-h4)', size: '1.25rem', sizePx: 20, lh: '1.75rem', lhPx: 28, weight: 600, family: 'body', tracking: '0', sample: 'Connections',
      },
    ],
  },
  {
    group: 'Text',
    usage: 'UI body, single-line elements, buttons, inputs, nav',
    tokens: [
      { name: '--text-body-lg', cssVar: 'var(--text-body-lg)', size: '1rem',     sizePx: 16, lh: '1.5rem',  lhPx: 24, weight: 400, family: 'body', tracking: '0', sample: 'Quicklo replied in 47 seconds while you were on the job.' },
      { name: '--text-body-md', cssVar: 'var(--text-body-md)', size: '0.875rem', sizePx: 14, lh: '1.25rem', lhPx: 20, weight: 400, family: 'body', tracking: '0', sample: 'HVAC not working · Submitted 2 hours ago' },
      { name: '--text-body-sm', cssVar: 'var(--text-body-sm)', size: '0.75rem',  sizePx: 12, lh: '1rem',    lhPx: 16, weight: 400, family: 'body', tracking: '0', sample: '47s ago · Plumber · New' },
    ],
  },
  {
    group: 'Paragraph',
    usage: 'Multi-line reading copy only — NOT single-line UI elements',
    tokens: [
      {
        name: '--text-paragraph', cssVar: 'var(--text-paragraph)', size: '1rem', sizePx: 16, lh: '1.75rem', lhPx: 28, weight: 400, family: 'body', tracking: '0', isParagraph: true,
        sample: "Quicklo watches your contact forms and replies to every enquiry within 90 seconds — in your voice, not a robot's.",
      },
    ],
  },
  {
    group: 'Label',
    usage: 'Badges, status chips, eyebrows, nav labels — always uppercase',
    tokens: [
      { name: '--text-label-md', cssVar: 'var(--text-label-md)', size: '0.75rem',    sizePx: 12, lh: '1rem', lhPx: 16, weight: 500, family: 'body', tracking: '0.04em', uppercase: true, sample: 'NEW · REPLIED · COLD' },
      { name: '--text-label-sm', cssVar: 'var(--text-label-sm)', size: '0.6875rem',  sizePx: 11, lh: '1rem', lhPx: 16, weight: 500, family: 'body', tracking: '0.06em', uppercase: true, sample: 'SETTINGS · PLAN · BILLING' },
    ],
  },
];

const ALL_TOKENS = TYPE_GROUPS.flatMap((g) => g.tokens);

// ─────────────────────────────────────────────────────────────────────────────
// SHARED HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function modeBtn(active) {
  return {
    height: '32px', padding: '0 16px',
    fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 500,
    cursor: 'pointer', outline: 'none', borderRadius: 'var(--radius-sm)',
    background: active ? 'var(--color-brand-btn)' : 'transparent',
    color: active ? 'var(--color-brand-btn-text)' : 'var(--color-text-secondary)',
    border: active ? '1px solid transparent' : '1px solid var(--color-border-default)',
  };
}

function ControlsRow({ dark, setDark }) {
  return (
    <div style={{ background: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border-default)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 24px' }}>
        <button aria-pressed={!dark} onClick={() => setDark(false)} style={modeBtn(!dark)}>Light</button>
        <button aria-pressed={dark}  onClick={() => setDark(true)}  style={modeBtn(dark)}>Dark</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STORY 1 — TYPE SPECIMEN
// ─────────────────────────────────────────────────────────────────────────────

function TypeSpecimenContent() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.75rem', fontWeight: 700, lineHeight: '2.25rem', color: 'var(--color-text-primary)', margin: '0 0 8px 0' }}>
        Typography
      </h1>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 400, lineHeight: '1.75rem', color: 'var(--color-text-secondary)', margin: '0 0 48px 0' }}>
        11 tokens across 5 groups. Outfit for Display + H1–H3. Inter for H4 and everything below.
      </p>

      {TYPE_GROUPS.map((group) => (
        <div key={group.group} style={{ marginBottom: '3rem' }}>

          {/* Group header */}
          <div style={{
            display: 'flex', alignItems: 'baseline', gap: '0.75rem',
            paddingBottom: '0.5rem', marginBottom: '0',
            borderBottom: '1px solid var(--color-border-default)',
          }}>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-primary)' }}>
              {group.group}
            </span>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 400, color: 'var(--color-text-secondary)', lineHeight: '1.25rem' }}>
              {group.usage}
            </span>
          </div>

          {/* Token rows */}
          {group.tokens.map((token) => (
            <div
              key={token.name}
              style={{
                display: 'flex', flexDirection: 'row', alignItems: 'flex-start',
                gap: '1.5rem', padding: '1.25rem 0',
                borderBottom: '1px solid var(--color-border-default)',
              }}
            >
              {/* Left column: token meta */}
              <div style={{ width: '220px', flexShrink: 0 }}>
                {/* story-only orange — matches brand Brick-500, display only */}
                <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem', fontWeight: 400, color: '#C2410C', lineHeight: '1.25rem', marginBottom: '0.25rem' }}>
                  {token.name}
                </div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 400, color: 'var(--color-text-secondary)', lineHeight: '1rem' }}>
                  {token.family === 'heading' ? 'Outfit' : 'Inter'} · {token.size} · lh {token.lh} · {token.weight} · {token.tracking !== '0' ? token.tracking : 'normal'}
                </div>
              </div>

              {/* Right column: live sample */}
              <div style={{ flex: 1, minWidth: 0 }}>
                {token.isParagraph ? (
                  <p style={{
                    margin: 0,
                    fontFamily: `var(--font-${token.family})`,
                    fontSize: token.cssVar,
                    lineHeight: token.lh,
                    fontWeight: token.weight,
                    letterSpacing: token.tracking,
                    color: 'var(--color-text-primary)',
                    maxWidth: '480px',
                  }}>
                    {token.sample}
                  </p>
                ) : (
                  <span style={{
                    display: 'block',
                    fontFamily: `var(--font-${token.family})`,
                    fontSize: token.cssVar,
                    lineHeight: token.lh,
                    fontWeight: token.weight,
                    letterSpacing: token.tracking,
                    color: 'var(--color-text-primary)',
                    textTransform: token.uppercase ? 'uppercase' : 'none',
                  }}>
                    {token.sample}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STORY 2 — GRID MATH
// ─────────────────────────────────────────────────────────────────────────────

function GridMathContent() {
  const cols = ['Token', 'Family', 'Size (rem)', 'Size (px)', 'LH (rem)', 'LH (px)', 'LH ÷ 4', 'Grid'];

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.75rem', fontWeight: 700, lineHeight: '2.25rem', color: 'var(--color-text-primary)', margin: '0 0 8px 0' }}>
        Grid math
      </h1>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 400, lineHeight: '1.75rem', color: 'var(--color-text-secondary)', margin: '0 0 32px 0' }}>
        Every line-height is a multiple of 4px (0.25rem), ensuring type always snaps to the 4px grid.
      </p>

      {/* Callout */}
      <div style={{
        background: 'var(--color-bg-secondary)',
        borderLeft: '3px solid #C2410C', /* story-only brand orange */
        padding: '0.75rem 1rem',
        marginBottom: '1.5rem',
        fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 400,
        color: 'var(--color-text-secondary)', lineHeight: '1.5rem',
      }}>
        Every line-height is a multiple of 4px (0.25rem). This ensures type always snaps to the 4px grid regardless of font size or context.
      </div>

      {/* Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Inter, sans-serif' }}>
        <thead>
          <tr>
            {cols.map((col) => (
              <th key={col} style={{
                padding: '12px 16px', textAlign: 'left',
                background: 'var(--color-bg-primary)',
                borderBottom: '2px solid var(--color-border-default)',
                fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 500,
                textTransform: 'uppercase', letterSpacing: '0.04em',
                color: 'var(--color-text-secondary)', whiteSpace: 'nowrap',
              }}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ALL_TOKENS.map((token, i) => {
            const lhDiv = token.lhPx / 4;
            const passes = lhDiv === Math.floor(lhDiv);
            const isEven = i % 2 === 1;

            return (
              <tr key={token.name} style={{ background: isEven ? 'var(--color-bg-surface)' : 'var(--color-bg-primary)' }}>
                {/* Token name — story-only orange */}
                <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border-subtle)', fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem', fontWeight: 400, color: '#C2410C', /* story-only brand orange — display only */ whiteSpace: 'nowrap' }}>
                  {token.name}
                </td>
                <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border-subtle)', fontSize: '0.875rem', fontWeight: 400, color: 'var(--color-text-primary)' }}>
                  {token.family === 'heading' ? 'Outfit' : 'Inter'}
                </td>
                <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border-subtle)', fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem', fontWeight: 400, color: 'var(--color-text-primary)' }}>
                  {token.size}
                </td>
                <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border-subtle)', fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem', fontWeight: 400, color: 'var(--color-text-primary)' }}>
                  {token.sizePx}px
                </td>
                <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border-subtle)', fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem', fontWeight: 400, color: 'var(--color-text-primary)' }}>
                  {token.lh}
                </td>
                <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border-subtle)', fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem', fontWeight: 400, color: 'var(--color-text-primary)' }}>
                  {token.lhPx}px
                </td>
                <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border-subtle)', fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem', fontWeight: 400, color: 'var(--color-text-primary)' }}>
                  {lhDiv}
                </td>
                {/* Grid badge — hardcoded semantic colours, display only */}
                <td style={{ padding: '0.625rem 0.75rem', borderBottom: '1px solid var(--color-border-default)' }}>
                  {passes ? (
                    <span style={{ display: 'inline-block', background: '#f0fdf4', color: '#15803D', border: '1px solid #86efac', fontSize: '0.75rem', fontWeight: 600, fontFamily: 'Inter, sans-serif', padding: '2px 6px', borderRadius: '3px', whiteSpace: 'nowrap' }}>
                      ✓ pass
                    </span>
                  ) : (
                    <span style={{ display: 'inline-block', background: '#fef2f2', color: '#B91C1C', border: '1px solid #fca5a5', fontSize: '0.75rem', fontWeight: 600, fontFamily: 'Inter, sans-serif', padding: '2px 6px', borderRadius: '3px', whiteSpace: 'nowrap' }}>
                      ✗ fail
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STORY 3 — USAGE GUIDE
// ─────────────────────────────────────────────────────────────────────────────

const USAGE_ENTRIES = {
  Display: [
    { token: '--text-display',    desc: 'Hero headlines, landing page above-the-fold only. NEVER in dashboard or product UI.' },
    { token: '--text-display-sm', desc: 'Sub-hero, section openers on marketing pages only.' },
  ],
  Heading: [
    { token: '--text-h1', desc: 'Page title — one per screen. Dashboard screen name.' },
    { token: '--text-h2', desc: 'Section heading inside a page. Card group titles.' },
    { token: '--text-h3', desc: 'Sub-section header, panel header, modal title. Last Outfit token — nothing below this uses Outfit.' },
    { token: '--text-h4', desc: 'Widget label, sidebar section title, settings group header. Inter 600 — NOT Outfit. Intentionally larger than H3.' },
  ],
  Text: [
    { token: '--text-body-lg', desc: 'Primary UI text. Buttons, inputs, nav items, dropdowns. 16px = iOS safe minimum, never go below this for inputs.' },
    { token: '--text-body-md', desc: 'Default UI text. Table cells, list items, timestamps, metadata.' },
    { token: '--text-body-sm', desc: 'Tertiary detail. Compact metadata, inline hints.' },
  ],
  Paragraph: [
    { token: '--text-paragraph', desc: 'Same 1rem size as body-lg — different line-height (1.75rem vs 1.5rem). Use ONLY when text runs to 2+ lines that users actually read: onboarding descriptions, email previews, empty state copy. Never for single-line UI elements.' },
  ],
  Label: [
    { token: '--text-label-md', desc: 'Badge text, status chips, nav inactive labels, table column headers. Always UPPERCASE + positive tracking.' },
    { token: '--text-label-sm', desc: 'Eyebrow text, sidebar section dividers, tight metadata tags. Always UPPERCASE + wider tracking.' },
  ],
};

const HARD_RULES = [
  'Outfit stops at H3. H4 and below → Inter 600. No exceptions.',
  '--text-paragraph ≠ --text-body-lg. Same size, different line-height, different purpose.',
  'Labels always Inter 500. Never Inter 400. Never Outfit.',
  'rem only. No px for font-size or line-height. Ever.',
  'Display tokens are landing-page only. Never in dashboard components.',
  'Minimum story font-size: 0.875rem. Exception: labels may use 0.6875rem minimum.',
];

function UsageGuideContent() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.75rem', fontWeight: 700, lineHeight: '2.25rem', color: 'var(--color-text-primary)', margin: '0 0 8px 0' }}>
        Usage guide
      </h1>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 400, lineHeight: '1.75rem', color: 'var(--color-text-secondary)', margin: '0 0 32px 0' }}>
        When to use each token. Read this before reaching for any type token in a component.
      </p>

      {Object.entries(USAGE_ENTRIES).map(([groupName, entries]) => (
        <div
          key={groupName}
          style={{
            background: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border-default)',
            borderRadius: 'var(--radius-md)',
            padding: '24px',
            marginBottom: '16px',
          }}
        >
          {/* Card header — story-only orange */}
          <div style={{
            fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 600,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            color: '#C2410C', /* story-only brand orange — display only */
            marginBottom: '0.625rem', paddingBottom: '0.625rem',
            borderBottom: '1px solid var(--color-border-default)',
          }}>
            {groupName}
          </div>

          {/* Usage entries */}
          {entries.map((entry) => (
            <div
              key={entry.token}
              style={{
                display: 'flex', gap: '1rem', padding: '12px 0',
                borderBottom: entries[entries.length - 1] === entry ? 'none' : '1px solid var(--color-border-default)',
                alignItems: 'flex-start',
              }}
            >
              <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem', fontWeight: 400, color: '#C2410C', /* story-only brand orange — display only */ lineHeight: '1.5rem', flexShrink: 0, width: '180px' }}>
                {entry.token}
              </span>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 400, color: 'var(--color-text-secondary)', lineHeight: '1.5rem' }}>
                {entry.desc}
              </span>
            </div>
          ))}
        </div>
      ))}

      {/* Hard rules block */}
      <div style={{ borderLeft: '3px solid #C2410C', /* story-only brand orange */ padding: '0.75rem 1rem', background: 'var(--color-bg-secondary)', marginTop: '1.5rem' }}>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#C2410C', /* story-only brand orange — display only */ marginBottom: '0.5rem' }}>
          Hard rules
        </div>
        {HARD_RULES.map((rule, i) => (
          <div key={i} style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 400, color: 'var(--color-text-secondary)', lineHeight: '1.5rem', paddingLeft: '0.75rem', position: 'relative' }}>
            <span style={{ position: 'absolute', left: 0, color: '#C2410C' /* story-only brand orange — display only */ }}>•</span>
            {rule}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

export const TypeSpecimen = {
  render: () => {
    function Story() {
      const [dark, setDark] = useState(false);
      return (
        <div className={dark ? 'dark' : ''} style={{ background: 'var(--color-bg-primary)', minHeight: '100vh' }}>
          <ControlsRow dark={dark} setDark={setDark} />
          <TypeSpecimenContent />
        </div>
      );
    }
    return React.createElement(Story);
  },
};
TypeSpecimen.storyName = 'Type Specimen';

export const GridMath = {
  render: () => {
    function Story() {
      const [dark, setDark] = useState(false);
      return (
        <div className={dark ? 'dark' : ''} style={{ background: 'var(--color-bg-primary)', minHeight: '100vh' }}>
          <ControlsRow dark={dark} setDark={setDark} />
          <GridMathContent />
        </div>
      );
    }
    return React.createElement(Story);
  },
};
GridMath.storyName = 'Grid Math';

export const UsageGuide = {
  render: () => {
    function Story() {
      const [dark, setDark] = useState(false);
      return (
        <div className={dark ? 'dark' : ''} style={{ background: 'var(--color-bg-primary)', minHeight: '100vh' }}>
          <ControlsRow dark={dark} setDark={setDark} />
          <UsageGuideContent />
        </div>
      );
    }
    return React.createElement(Story);
  },
};
UsageGuide.storyName = 'Usage Guide';
