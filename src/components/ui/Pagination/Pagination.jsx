'use client';

import React from 'react';
import { Button } from '@/components/ui/Button/Button.jsx';
import { IconButton } from '@/components/ui/IconButton/IconButton.jsx';
import { Select } from '@/components/ui/Select/Select.jsx';
import { Input } from '@/components/ui/Input/Input.jsx';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from '@/design-system/icons/index.js';
import { cn } from '@/lib/utils';

// Pagination — composes Button/IconButton/Select/Input wholesale (their own
// sizes, states, focus, and disabled behaviour, never restyled) rather than
// reimplementing any of them. 4 variants: `numbered` (desktop/table-oriented
// page-number row), `prev-next` (compact, the mobile-safe default), `table`
// (a full data-table footer bar), `load-more` (the Leads-inbox variant —
// see docs/DECISIONS.md for why load-more, not numbered pages, was chosen
// there). No self-card, no self-elevation — the "floating bar" look in the
// reference screenshots comes from a consumer wrapping Pagination in a Card;
// baking elevation in here would double it up.
//
// Sizes: md (40px page buttons / Select-Input scale) and lg (48px) only —
// matches Select's own md/lg scale, no sm. Below lg, md-sized controls get
// the same ::before 44×44px tap-target expansion Button/IconButton already
// use (collapsed at lg+, where pointer is assumed).
//
// Responsive collapse (numbered/table only): rather than trying to detect
// "does the reduced-sibling row still fit" — which would need either a
// hardcoded width assumption or DOM measurement, the exact fragility class
// Tabs' own sliding-pill/edge-fade-mask comments already reason about
// avoiding — this component renders BOTH a full desktop row (`hidden
// sm:flex`) and an always-narrow prev-next fallback (`flex sm:hidden`)
// below the `sm` (600px) breakpoint. The fallback is trivially guaranteed to
// fit any viewport ≥375px (it's just two buttons and a short readout), so
// "no 390px overflow" holds unconditionally instead of depending on how many
// digits pageCount happens to have. See docs/DECISIONS.md for the full
// reasoning — this is a deliberate simplification of a two-step
// reduce-then-collapse brief into one robust CSS breakpoint.
//
// Focus note (load-more): Button is not React.forwardRef (see FileUpload's
// identical note), so the DOM node used to restore focus after a load is
// captured via the click event's `currentTarget`, not a ref — same technique
// FileUpload already uses for the same reason.
//
// Zero new colour tokens. DO NOT use --space-0.5/-2.5/-3.5 anywhere in this
// file — confirmed broken (they never compile from globals.css's `@theme{}`
// block into usable runtime custom properties), see docs/DECISIONS.md
// 2026-07-09. Only whole-integer --space-* tokens are used below.

/**
 * Standard boundary/sibling windowing algorithm (the MUI/Carbon-shape
 * "1 … 4 5 [6] 7 8 … 20" pattern). Returns an array mixing page numbers and
 * the literal strings 'ellipsis-start' / 'ellipsis-end' (stable, distinct
 * keys — there can be at most one of each).
 * @param {number} page
 * @param {number} pageCount
 * @param {number} siblingCount
 * @param {number} boundaryCount
 * @returns {(number|'ellipsis-start'|'ellipsis-end')[]}
 */
function getPaginationItems(page, pageCount, siblingCount, boundaryCount) {
  const range = (start, end) => {
    const out = [];
    for (let i = start; i <= end; i += 1) out.push(i);
    return out;
  };

  const startPages = range(1, Math.min(boundaryCount, pageCount));
  const endPages = range(Math.max(pageCount - boundaryCount + 1, boundaryCount + 1), pageCount);

  const siblingsStart = Math.max(
    Math.min(page - siblingCount, pageCount - boundaryCount - siblingCount * 2 - 1),
    boundaryCount + 2
  );
  const siblingsEnd = Math.min(
    Math.max(page + siblingCount, boundaryCount + siblingCount * 2 + 2),
    endPages.length > 0 ? endPages[0] - 2 : pageCount - 1
  );

  const items = [
    ...startPages,
    ...(siblingsStart > boundaryCount + 2
      ? ['ellipsis-start']
      : boundaryCount + 1 < pageCount - boundaryCount
        ? [boundaryCount + 1]
        : []),
    ...range(siblingsStart, siblingsEnd),
    ...(siblingsEnd < pageCount - boundaryCount - 1
      ? ['ellipsis-end']
      : pageCount - boundaryCount > boundaryCount
        ? [pageCount - boundaryCount]
        : []),
    ...endPages,
  ];

  // Small pageCounts / edge sibling-boundary combinations can produce
  // duplicate page numbers (never duplicate ellipses) — dedupe, preserve order.
  const seen = new Set();
  return items.filter((item) => {
    if (typeof item !== 'number') return true;
    if (seen.has(item)) return false;
    seen.add(item);
    return true;
  });
}

/**
 * "1–20 of 87 leads" — en dash, 1-indexed inclusive range.
 * @param {number} page
 * @param {number} pageSize
 * @param {number} total
 * @param {string} itemNoun
 */
function getRangeText(page, pageSize, total, itemNoun) {
  if (!total || !pageSize) return `0 ${itemNoun}`;
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  return `${start}–${end} of ${total} ${itemNoun}`;
}

const READOUT_TEXT_STYLE = {
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--text-body-sm)',
  fontWeight: 400,
  lineHeight: '1rem',
  color: 'var(--color-text-secondary)',
  whiteSpace: 'nowrap',
};

function Readout({ mode, page, pageCount, total, pageSize, itemNoun }) {
  if (!mode) return null;
  // ReactNode override — rendered as-is, no forced live-region wrapping
  // (a consumer-supplied node may already carry its own semantics).
  if (typeof mode !== 'string') return mode;
  const text = mode === 'range' ? getRangeText(page, pageSize, total, itemNoun || 'items') : `Page ${page} of ${pageCount}`;
  return (
    <span aria-live="polite" style={READOUT_TEXT_STYLE}>
      {text}
    </span>
  );
}

// Page-number button box size per size prop — reused for the ellipsis span
// too, so the row never reflows when an ellipsis appears/disappears.
const BOX_PX = { md: 40, lg: 48 };

function PageButton({ pageNum, isActive, size, disabled, onClick }) {
  const box = BOX_PX[size];
  return (
    <li>
      <button
        type="button"
        disabled={disabled}
        aria-current={isActive ? 'page' : undefined}
        onClick={() => onClick(pageNum)}
        className={cn(
          'relative inline-flex items-center justify-center cursor-pointer select-none',
          'font-body',
          'transition-colors duration-(--duration-base) ease-(--ease-default)',
          'disabled:pointer-events-none disabled:opacity-(--opacity-disabled)',
          // Active page is a static neutral chip — no hover restyle (it's the
          // current page, not a navigable target). Inactive pages are bare
          // text at rest, stepping to --color-text-primary on hover only
          // (the IconButton `plain` colour-shift pattern, no fill box).
          isActive
            ? 'rounded-sm border border-(--color-border-strong) bg-(--color-bg-secondary) text-(--color-text-primary) font-semibold'
            : [
                'rounded-sm bg-transparent text-(--color-text-secondary) font-normal',
                '[@media(hover:hover)]:hover:text-(--color-text-primary)',
              ],
          // md: ::before expands the invisible hit area to 44×44px below lg
          // (the Button/IconButton sm/md technique) — lg (48px) needs none.
          size === 'md' && [
            "before:content-[''] before:absolute before:top-1/2 before:left-1/2",
            'before:-translate-x-1/2 before:-translate-y-1/2 before:min-w-11 before:min-h-11',
            'lg:before:min-w-0 lg:before:min-h-0',
          ]
        )}
        style={{
          width: `${box}px`,
          height: `${box}px`,
          fontSize: 'var(--text-body-md)',
          lineHeight: '1.25rem',
        }}
      >
        {pageNum}
      </button>
    </li>
  );
}

function EllipsisItem({ itemKey, size }) {
  const box = BOX_PX[size];
  return (
    <li aria-hidden="true">
      <span
        className="inline-flex items-center justify-center select-none"
        style={{
          width: `${box}px`,
          height: `${box}px`,
          color: 'var(--color-text-tertiary)',
          fontSize: 'var(--text-body-md)',
          lineHeight: '1.25rem',
        }}
      >
        …
      </span>
    </li>
  );
}

function NumberedList({ page, pageCount, onPageChange, siblingCount, boundaryCount, size, disabled }) {
  const items = React.useMemo(
    () => getPaginationItems(page, pageCount, siblingCount, boundaryCount),
    [page, pageCount, siblingCount, boundaryCount]
  );
  return (
    <ul className="flex items-center list-none m-0 p-0" style={{ gap: size === 'lg' ? 'var(--space-2)' : 'var(--space-1)' }}>
      {items.map((item) =>
        typeof item === 'number' ? (
          <PageButton
            key={item}
            pageNum={item}
            isActive={item === page}
            size={size}
            disabled={disabled}
            onClick={onPageChange}
          />
        ) : (
          <EllipsisItem key={item} itemKey={item} size={size} />
        )
      )}
    </ul>
  );
}

function PrevControl({ page, onPageChange, showLabels, size, disabled }) {
  const isDisabled = disabled || page <= 1;
  if (showLabels) {
    return (
      <Button variant="secondary" size={size} leftIcon="ArrowLeft" disabled={isDisabled} onClick={() => onPageChange(page - 1)}>
        Previous
      </Button>
    );
  }
  return (
    <IconButton
      variant="ghost"
      size={size}
      icon={ChevronLeft}
      aria-label="Go to previous page"
      disabled={isDisabled}
      onClick={() => onPageChange(page - 1)}
    />
  );
}

function NextControl({ page, pageCount, onPageChange, showLabels, size, disabled }) {
  const isDisabled = disabled || page >= pageCount;
  if (showLabels) {
    return (
      <Button variant="secondary" size={size} rightIcon="ArrowRight" disabled={isDisabled} onClick={() => onPageChange(page + 1)}>
        Next
      </Button>
    );
  }
  return (
    <IconButton
      variant="ghost"
      size={size}
      icon={ChevronRight}
      aria-label="Go to next page"
      disabled={isDisabled}
      onClick={() => onPageChange(page + 1)}
    />
  );
}

function FirstLastControls({ page, pageCount, onPageChange, size, disabled, position }) {
  if (position === 'first') {
    return (
      <IconButton
        variant="ghost"
        size={size}
        icon={ChevronsLeft}
        aria-label="Go to first page"
        disabled={disabled || page <= 1}
        onClick={() => onPageChange(1)}
      />
    );
  }
  return (
    <IconButton
      variant="ghost"
      size={size}
      icon={ChevronsRight}
      aria-label="Go to last page"
      disabled={disabled || page >= pageCount}
      onClick={() => onPageChange(pageCount)}
    />
  );
}

function RowsPerPage({ pageSize, pageSizeOptions, onPageSizeChange, size, disabled }) {
  return (
    <div className="inline-flex items-center" style={{ gap: 'var(--space-2)' }}>
      <span style={READOUT_TEXT_STYLE}>Rows per page</span>
      <div style={{ width: size === 'lg' ? '88px' : '80px' }}>
        <Select
          label="Rows per page"
          hideLabel
          aria-label="Rows per page"
          size={size}
          disabled={disabled}
          value={String(pageSize)}
          onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
          options={pageSizeOptions.map((n) => ({ label: String(n), value: String(n) }))}
        />
      </div>
    </div>
  );
}

// Uncontrolled-text jump field, synced from the external `page` prop only on
// EXTERNAL change (not on every keystroke) — the same "don't clobber
// in-progress typing" fix DateTimePicker's manual-entry row already applies,
// for the identical underlying reason: reformatting the field's value on
// every keystroke fights the browser's own in-progress editing state.
function JumpToPage({ page, pageCount, onPageChange, size, disabled }) {
  const [text, setText] = React.useState(String(page));
  // Track the external page value and re-sync `text` on a genuine external
  // change, computed directly during render rather than in a useEffect —
  // the same fix Tabs applied to its own controlled-value sync (a setState
  // call inside an effect body is a cascading-render smell; comparing
  // against a previous-value ref during render and adjusting state directly
  // is the React-sanctioned alternative for "derive state from a prop
  // change" — see React's "Adjusting state when a prop changes" guidance).
  const [lastExternalPage, setLastExternalPage] = React.useState(page);
  if (page !== lastExternalPage) {
    setLastExternalPage(page);
    setText(String(page));
  }

  const commit = () => {
    const parsed = parseInt(text, 10);
    if (Number.isFinite(parsed)) {
      const clamped = Math.min(Math.max(parsed, 1), pageCount);
      onPageChange(clamped);
      setText(String(clamped));
    } else {
      setText(String(page));
    }
  };

  return (
    <form
      className="inline-flex items-center"
      style={{ gap: 'var(--space-2)' }}
      onSubmit={(e) => {
        e.preventDefault();
        commit();
      }}
    >
      <span style={READOUT_TEXT_STYLE}>Go to page</span>
      <div style={{ width: size === 'lg' ? '72px' : '64px' }}>
        <Input
          label="Go to page"
          hideLabel
          aria-label="Go to page"
          size={size}
          disabled={disabled}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={commit}
          inputMode="numeric"
        />
      </div>
    </form>
  );
}

function LoadMoreSection({ onLoadMore, loading, hasMore, loadedCount, total, itemNoun, disabled }) {
  // Button is not React.forwardRef (see FileUpload's identical note), so the
  // DOM node needed to restore focus after a load completes is captured via
  // the click event's currentTarget, not a ref.
  const buttonElRef = React.useRef(null);
  const wasLoadingRef = React.useRef(loading);

  React.useEffect(() => {
    if (wasLoadingRef.current && !loading && hasMore) {
      buttonElRef.current?.focus();
    }
    wasLoadingRef.current = loading;
  }, [loading, hasMore]);

  const hasReadout = typeof loadedCount === 'number' && typeof total === 'number';

  return (
    <div className="flex flex-col w-full items-center" style={{ gap: 'var(--space-3)' }}>
      {hasReadout && (
        <span aria-live="polite" style={READOUT_TEXT_STYLE}>
          {`Showing ${loadedCount} of ${total} ${itemNoun || 'items'}`}
        </span>
      )}
      {hasMore ? (
        <Button
          variant="secondary"
          size="lg"
          fullWidth
          loading={loading}
          disabled={disabled}
          onClick={(e) => {
            buttonElRef.current = e.currentTarget;
            onLoadMore?.();
          }}
        >
          Load more
        </Button>
      ) : (
        <p
          aria-live="polite"
          style={{
            margin: 0,
            textAlign: 'center',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-body-sm)',
            fontWeight: 400,
            lineHeight: '1rem',
            color: 'var(--color-text-secondary)',
          }}
        >
          {"You're all caught up"}
        </p>
      )}
    </div>
  );
}

/**
 * @typedef {Object} PaginationProps
 * @property {'numbered'|'prev-next'|'table'|'load-more'} variant - Required.
 * @property {'md'|'lg'} [size='lg'] - No sm. md is desktop/pointer density; lg is the
 *   mobile/touch default (matches Select's own md/lg scale).
 * @property {number} [page] - 1-indexed current page. numbered/prev-next/table.
 * @property {number} [pageCount] - Total page count. numbered/prev-next/table.
 * @property {(page: number) => void} [onPageChange] - numbered/prev-next/table.
 * @property {number} [total] - Total item count, for range-readout math.
 * @property {number} [pageSize] - Items per page, for range-readout math.
 * @property {string} [itemNoun='items'] - e.g. 'leads', 'results'.
 * @property {'range'|'page'|import('react').ReactNode} [readout] - Default 'range' on
 *   table, 'page' elsewhere. numbered's own desktop row shows no readout by default
 *   (the page buttons already convey position) unless explicitly passed.
 * @property {number} [siblingCount=1] - Ellipsis windowing, numbered/table.
 * @property {number} [boundaryCount=1] - Ellipsis windowing, numbered/table.
 * @property {boolean} [showLabels=true] - Labelled Previous/Next vs icon-only chevrons.
 * @property {boolean} [showFirstLast=false] - «/» first/last jump, desktop only.
 * @property {boolean} [showPageSize=false] - Rows-per-page Select, table only, desktop only.
 * @property {number[]} [pageSizeOptions=[10,25,50,100]]
 * @property {(size: number) => void} [onPageSizeChange]
 * @property {boolean} [showJumpToPage=false] - "Go to page" Input, table/numbered, desktop only.
 * @property {() => void} [onLoadMore] - load-more only.
 * @property {boolean} [loading=false] - load-more: drives the Button's own Loader2 state.
 *   numbered/table: dims + disables the whole control set (aria-busy) during a fetch —
 *   no new spinner.
 * @property {boolean} [hasMore] - load-more only. false swaps the button for a quiet
 *   "You're all caught up" line.
 * @property {number} [loadedCount] - load-more only, for the "Showing X of Y" readout.
 * @property {boolean} [disabled=false] - Disables the whole control set.
 * @property {string} [aria-label='Pagination']
 * @property {string} [className]
 */

/**
 * Pagination — see the file header for the variant shapes, the responsive
 * collapse reasoning, and the zero-new-tokens / --space-0.5 landmine notes.
 * @param {PaginationProps} props
 */
export const Pagination = React.forwardRef(function Pagination(
  {
    variant,
    size = 'lg',
    page = 1,
    pageCount = 1,
    onPageChange,
    total,
    pageSize,
    itemNoun = 'items',
    readout,
    siblingCount = 1,
    boundaryCount = 1,
    showLabels = true,
    showFirstLast = false,
    showPageSize = false,
    pageSizeOptions = [10, 25, 50, 100],
    onPageSizeChange,
    showJumpToPage = false,
    onLoadMore,
    loading = false,
    hasMore,
    loadedCount,
    disabled = false,
    className,
    ...rest
  },
  ref
) {
  const ariaLabel = rest['aria-label'] || 'Pagination';
  const isNumberedFamily = variant === 'numbered' || variant === 'table';

  // numbered's own desktop row has no readout by default (the page buttons
  // already convey position) — its mobile prev-next fallback still gets one,
  // same default as the standalone prev-next variant.
  const desktopReadoutMode = readout !== undefined ? readout : variant === 'table' ? 'range' : undefined;
  const compactReadoutMode = readout !== undefined ? readout : 'page';

  // numbered/table only — dims + disables the whole control set during a
  // fetch. Distinct from load-more's own `loading`, which drives the Load
  // more Button's built-in spinner instead.
  const isBusyDimmed = isNumberedFamily && loading;
  const effectiveDisabled = disabled || isBusyDimmed;

  return (
    <nav
      ref={ref}
      {...rest}
      aria-label={ariaLabel}
      aria-busy={isBusyDimmed || undefined}
      className={cn('flex items-center flex-wrap', variant !== 'numbered' && 'w-full', className)}
      style={{
        gap: 'var(--space-4)',
        opacity: isBusyDimmed ? 'var(--opacity-disabled)' : undefined,
        pointerEvents: isBusyDimmed ? 'none' : undefined,
        ...(variant === 'table'
          ? { borderTop: '1px solid var(--color-border-default)', padding: 'var(--space-3) var(--space-4)', justifyContent: 'space-between' }
          : null),
      }}
    >
      {variant === 'load-more' ? (
        <LoadMoreSection
          onLoadMore={onLoadMore}
          loading={loading}
          hasMore={hasMore}
          loadedCount={loadedCount}
          total={total}
          itemNoun={itemNoun}
          disabled={disabled}
        />
      ) : isNumberedFamily ? (
        <>
          {variant === 'table' && showPageSize && (
            <div className="hidden sm:flex items-center">
              <RowsPerPage
                pageSize={pageSize}
                pageSizeOptions={pageSizeOptions}
                onPageSizeChange={onPageSizeChange}
                size={size}
                disabled={effectiveDisabled}
              />
            </div>
          )}

          {/* Desktop (sm/600px+): the full numbered row */}
          <div className="hidden sm:flex items-center" style={{ gap: 'var(--space-2)' }}>
            {showFirstLast && (
              <FirstLastControls position="first" page={page} pageCount={pageCount} onPageChange={onPageChange} size={size} disabled={effectiveDisabled} />
            )}
            <PrevControl page={page} onPageChange={onPageChange} showLabels={showLabels} size={size} disabled={effectiveDisabled} />
            <NumberedList
              page={page}
              pageCount={pageCount}
              onPageChange={onPageChange}
              siblingCount={siblingCount}
              boundaryCount={boundaryCount}
              size={size}
              disabled={effectiveDisabled}
            />
            <NextControl page={page} pageCount={pageCount} onPageChange={onPageChange} showLabels={showLabels} size={size} disabled={effectiveDisabled} />
            {showFirstLast && (
              <FirstLastControls position="last" page={page} pageCount={pageCount} onPageChange={onPageChange} size={size} disabled={effectiveDisabled} />
            )}
            {showJumpToPage && (
              <JumpToPage page={page} pageCount={pageCount} onPageChange={onPageChange} size={size} disabled={effectiveDisabled} />
            )}
          </div>

          {desktopReadoutMode && (
            <div className="hidden sm:block">
              <Readout mode={desktopReadoutMode} page={page} pageCount={pageCount} total={total} pageSize={pageSize} itemNoun={itemNoun} />
            </div>
          )}

          {/* Below sm (600px): always the compact prev-next fallback — see
              the file header for why this collapses directly here rather
              than attempting an intermediate reduced-sibling tier. */}
          <div className="flex sm:hidden items-center w-full" style={{ gap: 'var(--space-2)', justifyContent: 'space-between' }}>
            <PrevControl page={page} onPageChange={onPageChange} showLabels={showLabels} size={size} disabled={effectiveDisabled} />
            <Readout mode={compactReadoutMode} page={page} pageCount={pageCount} total={total} pageSize={pageSize} itemNoun={itemNoun} />
            <NextControl page={page} pageCount={pageCount} onPageChange={onPageChange} showLabels={showLabels} size={size} disabled={effectiveDisabled} />
          </div>
        </>
      ) : (
        // prev-next — always the compact form, no responsive split needed;
        // it's already the mobile-safe default at every breakpoint.
        <div className="flex items-center w-full" style={{ gap: 'var(--space-2)', justifyContent: 'space-between' }}>
          <PrevControl page={page} onPageChange={onPageChange} showLabels={showLabels} size={size} disabled={disabled} />
          <Readout mode={compactReadoutMode} page={page} pageCount={pageCount} total={total} pageSize={pageSize} itemNoun={itemNoun} />
          <NextControl page={page} pageCount={pageCount} onPageChange={onPageChange} showLabels={showLabels} size={size} disabled={disabled} />
        </div>
      )}
    </nav>
  );
});

Pagination.displayName = 'Pagination';
