import React, { useState } from 'react';
import { Pagination } from './Pagination.jsx';

// ─────────────────────────────────────────────────────────────────────────────
// META
// ─────────────────────────────────────────────────────────────────────────────

export default {
  title: 'Components/Pagination',
  parameters: {
    layout: 'fullscreen',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS — StoryFrame copied from Button.stories.jsx's Light/Dark toggle
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

const code = { fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' };

// ─────────────────────────────────────────────────────────────────────────────
// LIVE DEMO WRAPPERS — every instance below drives real onPageChange/
// onLoadMore state via useState, never a static mockup. Each wrapper owns
// its own independent state (a separate component instance per mount), so
// dozens of live demos can coexist on one canvas without name collisions.
// ─────────────────────────────────────────────────────────────────────────────

function DemoPagination({ initialPage = 1, ...props }) {
  const [page, setPage] = useState(initialPage);
  return <Pagination {...props} page={page} onPageChange={setPage} />;
}

function DemoTablePagination({ initialPage = 1, initialPageSize = 10, ...props }) {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  return (
    <Pagination
      {...props}
      page={page}
      onPageChange={setPage}
      pageSize={pageSize}
      onPageSizeChange={(n) => {
        setPageSize(n);
        setPage(1);
      }}
    />
  );
}

// The full load-more lifecycle, live: click "Load more" → loading (900ms,
// simulating a real fetch) → loadedCount advances → eventually hasMore
// becomes false and the button is replaced by the "all caught up" line.
function DemoLoadMore({ total = 42, pageSize = 10, itemNoun = 'leads' }) {
  const [loadedCount, setLoadedCount] = useState(pageSize);
  const [loading, setLoading] = useState(false);
  const hasMore = loadedCount < total;

  const handleLoadMore = () => {
    setLoading(true);
    setTimeout(() => {
      setLoadedCount((c) => Math.min(c + pageSize, total));
      setLoading(false);
    }, 900);
  };

  return (
    <Pagination
      variant="load-more"
      loadedCount={loadedCount}
      total={total}
      itemNoun={itemNoun}
      loading={loading}
      hasMore={hasMore}
      onLoadMore={handleLoadMore}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCAFFOLD — a tiny lead-row list for the "In context" load-more demo. NOT a
// real product component (LeadRow is a future Pattern, not built yet) — pure
// layout scaffolding. The Pagination instance below it IS the real component.
// ─────────────────────────────────────────────────────────────────────────────

function LeadRowScaffold({ name, preview }) {
  return (
    <div style={{ padding: 'var(--space-3) 0', borderTop: '1px solid var(--color-border-subtle)' }}>
      <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 500, lineHeight: '1.25rem', color: 'var(--color-text-primary)' }}>
        {name}
      </div>
      <div style={{
        fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 400, lineHeight: '1.25rem',
        color: 'var(--color-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {preview}
      </div>
    </div>
  );
}

const SAMPLE_LEADS = [
  { name: 'Sarah Mitchell', preview: 'Hi, do you do same-day plumbing repairs?' },
  { name: 'Dave Chen', preview: 'Following up on my quote request from Tuesday' },
  { name: 'Priya Patel', preview: 'Thanks, see you Thursday at 10am!' },
];

// ─────────────────────────────────────────────────────────────────────────────
// REFERENCE DATA
// ─────────────────────────────────────────────────────────────────────────────

const PROPS = [
  { name: 'variant', type: "'numbered' | 'prev-next' | 'table' | 'load-more'", defaultVal: '—', description: 'Required. Selects one of the four shapes — see the Usage guide for which to reach for.' },
  { name: 'size', type: "'md' | 'lg'", defaultVal: "'lg'", description: "No sm. md is desktop/pointer density (40px page buttons); lg is the mobile/touch default (48px) — matches Select's own md/lg scale." },
  { name: 'page', type: 'number', defaultVal: '1', description: '1-indexed current page. numbered/prev-next/table.' },
  { name: 'pageCount', type: 'number', defaultVal: '1', description: 'Total page count. numbered/prev-next/table.' },
  { name: 'onPageChange', type: '(page: number) => void', defaultVal: 'undefined', description: 'Fires with the new 1-indexed page. numbered/prev-next/table.' },
  { name: 'total', type: 'number', defaultVal: 'undefined', description: 'Total item count — feeds the range readout ("1–20 of 87 leads") and the load-more "Showing X of Y" readout.' },
  { name: 'pageSize', type: 'number', defaultVal: 'undefined', description: 'Items per page — feeds the range-readout math.' },
  { name: 'itemNoun', type: 'string', defaultVal: "'items'", description: "e.g. 'leads', 'results' — used in the range and load-more readouts." },
  { name: 'readout', type: "'range' | 'page' | ReactNode", defaultVal: 'undefined', description: "Default 'range' on table, 'page' elsewhere. numbered's own desktop row shows none by default (the page buttons already convey position)." },
  { name: 'siblingCount', type: 'number', defaultVal: '1', description: 'Ellipsis windowing — pages shown either side of the current page. numbered/table.' },
  { name: 'boundaryCount', type: 'number', defaultVal: '1', description: 'Ellipsis windowing — pages always shown at each end. numbered/table.' },
  { name: 'showLabels', type: 'bool', defaultVal: 'true', description: 'Labelled "Previous"/"Next" Buttons vs icon-only chevron IconButtons.' },
  { name: 'showFirstLast', type: 'bool', defaultVal: 'false', description: '«/» first/last jump. Desktop only — hidden in the mobile prev-next fallback.' },
  { name: 'showPageSize', type: 'bool', defaultVal: 'false', description: 'A "Rows per page" Select. table only, desktop only.' },
  { name: 'pageSizeOptions', type: 'number[]', defaultVal: '[10, 25, 50, 100]', description: 'Options for the rows-per-page Select.' },
  { name: 'onPageSizeChange', type: '(size: number) => void', defaultVal: 'undefined', description: 'Fires with the newly chosen page size.' },
  { name: 'showJumpToPage', type: 'bool', defaultVal: 'false', description: 'A "Go to page" Input. table/numbered, desktop only.' },
  { name: 'onLoadMore', type: '() => void', defaultVal: 'undefined', description: 'load-more only.' },
  { name: 'loading', type: 'bool', defaultVal: 'false', description: "load-more: drives the Load more Button's own Loader2 state. numbered/table: dims + disables the whole control set (aria-busy) during a fetch." },
  { name: 'hasMore', type: 'bool', defaultVal: 'undefined', description: 'load-more only. false swaps the button for a quiet "You’re all caught up" line.' },
  { name: 'loadedCount', type: 'number', defaultVal: 'undefined', description: 'load-more only — feeds the "Showing X of Y" readout together with total.' },
  { name: 'disabled', type: 'bool', defaultVal: 'false', description: 'Disables the whole control set — --opacity-disabled, aria-disabled.' },
  { name: 'aria-label', type: 'string', defaultVal: "'Pagination'", description: 'Accessible name for the root nav element.' },
  { name: 'className', type: 'string', defaultVal: 'undefined', description: "Appended to the root nav's classes." },
];

function ReferenceTable() {
  return (
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
              <td style={{
                padding: '12px 16px', minHeight: '44px',
                fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem',
                color: 'var(--color-text-primary)', whiteSpace: 'nowrap',
                borderBottom: i < PROPS.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
              }}>
                {prop.name}
              </td>
              <td style={{
                padding: '12px 16px',
                fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem',
                color: 'var(--color-text-secondary)',
                borderBottom: i < PROPS.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
              }}>
                {prop.type}
              </td>
              <td style={{
                padding: '12px 16px',
                fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem',
                color: 'var(--color-text-secondary)', whiteSpace: 'nowrap',
                borderBottom: i < PROPS.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
              }}>
                {prop.defaultVal}
              </td>
              <td style={{
                padding: '12px 16px',
                fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
                color: 'var(--color-text-primary)',
                borderBottom: i < PROPS.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
              }}>
                {prop.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STORY EXPORT — single Overview export, per the style guide. Overview is a
// real function component (not a bare arrow-returning-JSX) because Pagination
// is fully controlled — every demo below needs its own live page/loading
// state, supplied via the Demo* wrapper components above.
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
        Pagination
      </h1>
      <p style={{
        fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 400,
        lineHeight: '1.75rem', color: 'var(--color-text-secondary)', margin: 0,
      }}>
        Composes Button / IconButton / Select / Input wholesale — never restyled, never reimplemented.
        4 variants: numbered, prev-next, table, load-more. No self-card, no self-elevation.
      </p>
    </div>

    {/* ── 1. Variants ───────────────────────────────────────────────────────── */}
    <SectionHead
      title="Variants"
      description="Every demo below is live — click through pages, toggle rows-per-page, or trigger Load more to see real state changes, not a static picture."
    />

    <div style={{ marginBottom: '40px', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <BlockLabel>numbered — desktop/table-oriented</BlockLabel>
        <DemoPagination variant="numbered" pageCount={10} initialPage={4} />
      </div>

      <div>
        <BlockLabel>prev-next — labelled (the mobile-safe default)</BlockLabel>
        <DemoPagination variant="prev-next" pageCount={10} initialPage={4} />
      </div>

      <div>
        <BlockLabel>prev-next — icon-only (showLabels=false)</BlockLabel>
        <DemoPagination variant="prev-next" pageCount={10} initialPage={4} showLabels={false} />
      </div>

      <div>
        <BlockLabel>table — with rows-per-page</BlockLabel>
        <DemoTablePagination variant="table" pageCount={10} initialPage={3} total={87} showPageSize />
      </div>

      <div>
        <BlockLabel>table — without rows-per-page</BlockLabel>
        <DemoTablePagination variant="table" pageCount={10} initialPage={3} total={87} />
      </div>

      <div>
        <BlockLabel>load-more — idle / loading / all caught up (fixed, for comparison)</BlockLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ maxWidth: '400px' }}>
            <Pagination variant="load-more" loadedCount={10} total={42} itemNoun="leads" hasMore onLoadMore={() => {}} />
          </div>
          <div style={{ maxWidth: '400px' }}>
            <Pagination variant="load-more" loadedCount={10} total={42} itemNoun="leads" hasMore loading onLoadMore={() => {}} />
          </div>
          <div style={{ maxWidth: '400px' }}>
            <Pagination variant="load-more" loadedCount={42} total={42} itemNoun="leads" hasMore={false} onLoadMore={() => {}} />
          </div>
        </div>
        <Note>Top to bottom: idle, loading (Button's own Loader2 state), and hasMore=false ("You're all caught up"). See "In context" below for the full live lifecycle, click-by-click.</Note>
      </div>
    </div>

    <Divider />

    {/* ── 2. Sizes ──────────────────────────────────────────────────────────── */}
    <SectionHead
      title="Sizes"
      description="md and lg only — no sm. md is desktop/pointer-dense density; lg is the mobile/touch default, matching Select's own scale."
    />
    <div style={{ marginBottom: '40px', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <BlockLabel>md — 40px page buttons (desktop)</BlockLabel>
        <DemoPagination variant="numbered" size="md" pageCount={10} initialPage={4} />
      </div>
      <div>
        <BlockLabel>lg — 48px page buttons (mobile default)</BlockLabel>
        <DemoPagination variant="numbered" size="lg" pageCount={10} initialPage={4} />
      </div>
    </div>

    <Divider />

    {/* ── 3. States ─────────────────────────────────────────────────────────── */}
    <SectionHead
      title="States"
      description="default, disabled-at-bounds, whole-set disabled, loading, and active-page are shown live below. Hover and focus-visible are CSS-driven — hover or Tab to any control above to see them."
    />
    <div style={{ marginBottom: '40px', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <BlockLabel>Disabled at bounds — first page (Previous disabled)</BlockLabel>
        <DemoPagination variant="prev-next" pageCount={10} initialPage={1} />
      </div>
      <div>
        <BlockLabel>Disabled at bounds — last page (Next disabled)</BlockLabel>
        <DemoPagination variant="prev-next" pageCount={10} initialPage={10} />
      </div>
      <div>
        <BlockLabel>Whole control set disabled (disabled prop)</BlockLabel>
        <Pagination variant="prev-next" page={4} pageCount={10} onPageChange={() => {}} disabled />
      </div>
      <div>
        <BlockLabel>Loading — numbered/table dims + disables the set (aria-busy), no new spinner</BlockLabel>
        <Pagination variant="table" page={3} pageCount={10} total={87} onPageChange={() => {}} loading />
      </div>
      <div>
        <BlockLabel>Active page — aria-current="page", neutral contained chip</BlockLabel>
        <DemoPagination variant="numbered" pageCount={5} initialPage={3} />
        <Note>The active page is a neutral --radius-sm square chip — fill --color-bg-secondary, 1px --color-border-strong border, text --color-text-primary Inter 600. Inactive pages are bare text with a plain hover colour-shift, no fill.</Note>
      </div>
    </div>

    <Divider />

    {/* ── 4. Ellipsis behaviour ─────────────────────────────────────────────── */}
    <SectionHead
      title="Ellipsis behaviour"
      description="Standard boundary/sibling windowing. Click through the pages below — the ellipsis position shifts as the current page moves away from either boundary."
    />
    <div style={{ marginBottom: '40px' }}>
      <BlockLabel>pageCount=20, siblingCount=1 (default), boundaryCount=1 (default)</BlockLabel>
      <DemoPagination variant="numbered" pageCount={20} initialPage={10} />
      <Note>
        Try page 1, page 20, and a middle page like 10 — the algorithm never hides a single page behind an
        ellipsis (e.g. page 2 renders as a real number, not "1 … 3").
      </Note>
    </div>
    <div style={{ marginBottom: '40px' }}>
      <BlockLabel>Responsive collapse — resize this browser window below 600px width</BlockLabel>
      <DemoPagination variant="numbered" pageCount={20} initialPage={10} />
      <Note>
        Below the <code style={code}>sm</code> (600px) breakpoint, numbered/table always collapse to the compact
        prev-next form shown below — not a reduced-sibling numbered row. This is a deliberate simplification
        (see docs/DECISIONS.md): detecting "does a reduced row still fit" needs either a hardcoded width
        assumption or DOM measurement, the exact fragility class this design system avoids elsewhere. The
        fallback is trivially guaranteed to fit any phone viewport:
      </Note>
      <div style={{ marginTop: 'var(--space-3)', maxWidth: '360px' }}>
        <DemoPagination variant="prev-next" pageCount={20} initialPage={10} />
      </div>
    </div>

    <Divider />

    {/* ── 5. In context ─────────────────────────────────────────────────────── */}
    <SectionHead
      title="In context"
      description="Two real Quicklo mounts."
    />
    <div style={{ marginBottom: '40px', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <BlockLabel>Admin data table — numbered inside a card (the "floating bar" look)</BlockLabel>
        <InfoBox>
          <div style={{ marginBottom: 'var(--space-4)', fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
            Bug reports table would render here.
          </div>
        </InfoBox>
        <div style={{ marginTop: 'var(--space-2)' }}>
          <DemoTablePagination variant="table" pageCount={12} initialPage={2} total={116} itemNoun="reports" showPageSize />
        </div>
        <Note>
          Pagination itself has no card/elevation of its own — the "floating bar" look in the reference
          screenshots comes entirely from the surrounding Card surface. table's own 1px top divider is the
          only chrome it adds, so it sits flush directly under the table body above.
        </Note>
      </div>

      <div>
        <BlockLabel>Leads inbox — load-more, full lifecycle (click it)</BlockLabel>
        <InfoBox style={{ padding: '8px 24px', maxWidth: '480px' }}>
          {SAMPLE_LEADS.map((lead) => (
            <LeadRowScaffold key={lead.name} name={lead.name} preview={lead.preview} />
          ))}
        </InfoBox>
        <div style={{ marginTop: 'var(--space-4)', maxWidth: '480px' }}>
          <DemoLoadMore total={42} pageSize={10} itemNoun="leads" />
        </div>
        <Note>
          Click "Load more" repeatedly — it shows a real 900ms loading state (simulating a fetch), advances the
          "Showing X of Y" readout, and swaps to "You're all caught up" once every lead has loaded. Focus
          returns to the button after each load.
        </Note>
      </div>
    </div>

    <Divider />

    {/* ── 6. Usage guide ────────────────────────────────────────────────────── */}
    <SectionHead
      title="Usage guide"
      description="Four variants, four different jobs — and two defaults worth calling out explicitly."
    />
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '16px',
      marginBottom: '24px',
    }}>
      <InfoBox>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
          Leads inbox → load-more
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          A mobile-first, one-handed, dirty-hands product with typically small filtered lead lists — a single
          tap-to-load button beats numbered page math every time. See docs/DECISIONS.md for the full reasoning.
        </p>
      </InfoBox>
      <InfoBox>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
          Admin / desktop tables → table or numbered
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          Bounded, mouse-driven, desktop-only datasets (bug reports, users & plans) — jumping directly to an
          arbitrary page is the more useful shape there.
        </p>
      </InfoBox>
      <InfoBox>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
          Rows-per-page &amp; jump-to-page: desktop-only, default off
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          Real escape hatches for a many-page desktop admin table, but a non-technical one-handed phone user has
          little use for "jump to page 47" — enable per instance via showPageSize/showJumpToPage, never on by default.
        </p>
      </InfoBox>
      <InfoBox>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
          No numbered paging on mobile
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          numbered/table always collapse to the compact prev-next form below the sm (600px) breakpoint —
          structurally guaranteed, not just usually true.
        </p>
      </InfoBox>
    </div>

    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px',
      marginBottom: '40px',
    }}>
      <InfoBox style={{ borderColor: 'var(--color-status-success-text)' }}>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-status-success-text)', marginBottom: '16px' }}>
          Do — wrap it in a Card for the floating-bar look
        </div>
        <InfoBox style={{ padding: '16px' }}>
          <Pagination variant="prev-next" page={2} pageCount={5} onPageChange={() => {}} />
        </InfoBox>
        <Note>Pagination has no self-card or self-elevation on purpose — the surrounding surface supplies it.</Note>
      </InfoBox>

      <InfoBox style={{ borderColor: 'var(--color-status-error-text)' }}>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-status-error-text)', marginBottom: '16px' }}>
          Don't — numbered on a mobile-primary screen
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          numbered always collapses to prev-next below 600px anyway — reaching for it on a screen that's mobile
          by design (the Leads inbox) just adds unused desktop-only code paths. Use prev-next or load-more directly.
        </p>
      </InfoBox>

      <InfoBox style={{ borderColor: 'var(--color-status-error-text)' }}>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-status-error-text)', marginBottom: '16px' }}>
          Don't — add an error state
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          A failed fetch is the surrounding list's concern — render an Alert or EmptyState there. Pagination
          itself has no error state, on purpose.
        </p>
      </InfoBox>

      <InfoBox style={{ borderColor: 'var(--color-status-error-text)' }}>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-status-error-text)', marginBottom: '16px' }}>
          Don't — hardcode elevation into a custom pager
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          Only the table variant's 1px top divider is baked in. A shadow/card look belongs to the wrapping
          surface, never to Pagination itself — otherwise it doubles up the moment someone wraps it in a Card.
        </p>
      </InfoBox>
    </div>

    <Divider />

    {/* ── 7. Reference table ────────────────────────────────────────────────── */}
    <SectionHead
      title="Reference table"
      description="Every prop accepted by Pagination."
    />
    <div style={{ marginBottom: '40px' }}>
      <ReferenceTable />
    </div>

  </StoryFrame>
);
