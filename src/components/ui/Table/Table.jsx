'use client';

import React from 'react';
import { Checkbox } from '@/components/ui/Checkbox/Checkbox.jsx';
import { Icon } from '@/design-system/icons/Icon.jsx';
import { Alert } from '@/components/ui/Alert/Alert.jsx';
import { Skeleton } from '@/design-system/loaders/index.js';
import { TableEmptyState } from './TableEmptyState.jsx';
import { TableBatchBar } from './TableBatchBar.jsx';
import { TextCell } from './TableCells.jsx';
import { cn } from '@/lib/utils';

// Table — a single config-driven component (`columns` + `data`), composing
// Checkbox/Badge/Chip/Avatar/IconButton/Chart(sparkline)/Skeleton/Alert
// wholesale, never reimplemented. Desktop renders a real <table>; below md
// (768px) the SAME <table> DOM restyles into a card stack via CSS alone (no
// markup swap to a <ul>) — the technique from the CSS-Tricks "responsive
// data table" pattern, adapted with explicit ARIA roles wherever a display
// override would otherwise strip the browser's implicit table semantics
// (see the role="row"/"cell"/"rowgroup" notes below).
//
// Row background (zebra/hover/selected) and the mobile ::before
// content:attr(data-label) label technique both live in one injected
// <style> block (TABLE_STYLE) rather than Tailwind utility classes — the
// same "inject scoped CSS for something Tailwind can't cleanly express, or
// where two states have no defined precedence" rationale Tabs' own
// .quicklo-segmented-trigger block and Badge's pulse keyframes already
// established. Source order inside that block IS the precedence: selected
// is declared last so it always wins over hover, which is declared after
// zebra so it always wins over zebra — encoded explicitly rather than left
// to inline-style-vs-class specificity (which would make selected correctly
// win but zebra-vs-hover ambiguous).
//
// sortState/onSortChange follow the same fully-controlled philosophy as
// Pagination — Table never sorts data itself, it only reports the next
// {key, direction} and expects pre-sorted `data` back.
//
// "actions" column convention: a column is treated as the actions cell (full
// width, no label, card-bottom position below md) when `column.key ===
// 'actions'` — a documented convention, not a separate prop, since the brief
// specified `isPrimary` as an explicit flag but not an equivalent for
// actions.

const HEADER_CELL_TEXT = {
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--text-label-md)',
  fontWeight: 500,
  lineHeight: '1rem',
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
};

// md:-gated so column alignment only applies to the desktop table layout —
// at the mobile card layout, alignment is irrelevant (every cell is a
// left-label/right(ish)-value flex row driven by TABLE_STYLE, not text-align).
const ALIGN_CLASS = { start: 'md:text-left', end: 'md:text-right', center: 'md:text-center' };

const TABLE_STYLE = `
.quicklo-table { width: 100%; display: block; border-collapse: collapse; }
.quicklo-table-head {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0;
}
.quicklo-table-header-cell {
  padding: var(--space-3) var(--space-4);
  height: 48px;
  border-bottom: 1px solid var(--color-border-default);
  text-align: left;
}
.quicklo-table-body { display: flex; flex-direction: column; gap: var(--space-3); }
.quicklo-table-row {
  display: flex; flex-direction: column;
  background: var(--color-bg-surface);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-default);
  box-shadow: var(--elevation-1);
  padding: var(--space-4);
}
.quicklo-table-cell {
  display: flex; align-items: flex-start; justify-content: space-between;
  gap: var(--space-3);
  padding: var(--space-1) 0;
}
.quicklo-table-cell::before {
  content: attr(data-label);
  padding-top: 2px;
  font-family: var(--font-body);
  font-size: var(--text-label-sm);
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-text-tertiary);
  flex-shrink: 0;
  text-align: left;
}
.quicklo-table-cell--primary,
.quicklo-table-cell--actions,
.quicklo-table-cell--full {
  display: block; padding: 0; text-align: left;
}
.quicklo-table-cell--primary::before,
.quicklo-table-cell--actions::before,
.quicklo-table-cell--full::before { content: none; }
.quicklo-table-cell--primary { order: -1; margin-bottom: var(--space-2); }
.quicklo-table-cell--actions {
  order: 999; margin-top: var(--space-2); padding-top: var(--space-3);
  border-top: 1px solid var(--color-border-subtle);
}
.quicklo-table-primary-link { all: unset; display: block; width: 100%; cursor: pointer; }

/* Selection column and hideBelow:'md' columns are hidden here, in this same
   authoritative stylesheet, rather than via Tailwind's "hidden"/"md:table-
   cell" utilities. Both those utilities and .quicklo-table-cell's own
   "display" declaration are single-class selectors (equal specificity,
   0,1,0) -- and because this style tag renders inside the component tree,
   AFTER Tailwind's compiled stylesheet in document order, ties resolve in
   THIS stylesheet's favour. A "hidden" class fighting .quicklo-table-cell
   for the "display" property from a lower position in the cascade silently
   loses (confirmed live: the selection checkbox and a hideBelow column both
   stayed visible at 390px before this fix) -- so hiding is done here
   instead, where source order guarantees the win. */
.quicklo-table-cell--select,
.quicklo-table-cell--hide-mobile { display: none; }

@media (min-width: 768px) {
  .quicklo-table-cell--select,
  .quicklo-table-cell--hide-mobile { display: table-cell; }
  .quicklo-table { display: table; }
  .quicklo-table-head {
    position: static; width: auto; height: auto; margin: 0; padding: 0;
    overflow: visible; clip: auto; white-space: normal;
    display: table-header-group;
  }
  .quicklo-table-body { display: table-row-group; gap: 0; }
  .quicklo-table-row {
    display: table-row; background: transparent;
    border-radius: 0; border: none; box-shadow: none; padding: 0;
  }
  .quicklo-table-row.quicklo-table-row--zebra { background: var(--color-bg-primary); }
  .quicklo-table-cell {
    display: table-cell; vertical-align: middle;
    padding: var(--space-3) var(--space-4);
    border-bottom: 1px solid var(--color-border-subtle);
  }
  .quicklo-table-cell::before { content: none; }
  .quicklo-table-row:last-child .quicklo-table-cell { border-bottom: none; }
  .quicklo-table-cell--primary,
  .quicklo-table-cell--actions {
    order: 0; margin: 0; padding: var(--space-3) var(--space-4); border-top: none;
  }
  .quicklo-table-cell--full { display: table-cell; padding: var(--space-12) var(--space-4); text-align: center; }
}
@media (hover: hover) {
  .quicklo-table-row:hover { background: var(--color-table-row-hover); }
}
.quicklo-table-row[aria-selected="true"] { background: var(--color-table-row-selected); }
`;

function HeaderCell({ column, sortState, onSortChange }) {
  const isSorted = sortState?.key === column.key;
  const direction = isSorted ? sortState.direction : undefined;
  const alignClass = ALIGN_CLASS[column.align ?? 'start'];

  const hideMobileClass = column.hideBelow === 'md' && 'quicklo-table-cell--hide-mobile';

  if (!column.sortable) {
    return (
      <th
        scope="col"
        className={cn('quicklo-table-header-cell', alignClass, hideMobileClass)}
        style={{ ...HEADER_CELL_TEXT, color: 'var(--color-text-secondary)', width: column.width }}
      >
        {column.header}
      </th>
    );
  }

  function handleClick() {
    // Heuristic: a right-aligned (numeric/date) column defaults to
    // descending on first click, a left-aligned (text) column to ascending
    // — column.defaultSortDirection always wins when explicitly set.
    const fallback = column.align === 'end' ? 'desc' : 'asc';
    const nextDirection = isSorted ? (direction === 'asc' ? 'desc' : 'asc') : column.defaultSortDirection ?? fallback;
    onSortChange?.({ key: column.key, direction: nextDirection });
  }

  return (
    <th
      scope="col"
      aria-sort={isSorted ? (direction === 'asc' ? 'ascending' : 'descending') : 'none'}
      className={cn('quicklo-table-header-cell', alignClass, hideMobileClass)}
      style={{ width: column.width }}
    >
      <button
        type="button"
        onClick={handleClick}
        className={cn('inline-flex items-center bg-transparent border-0 p-0 cursor-pointer select-none', column.align === 'end' && 'flex-row-reverse')}
        style={{ ...HEADER_CELL_TEXT, gap: 'var(--space-1)', color: isSorted ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}
      >
        {column.header}
        <Icon
          name={isSorted ? 'ChevronDown' : 'ChevronsUpDown'}
          size="sm"
          className={cn(
            'transition-transform duration-(--duration-fast)',
            isSorted ? 'text-(--color-text-primary)' : 'text-(--color-text-tertiary)',
            isSorted && direction === 'asc' && 'rotate-180'
          )}
        />
      </button>
    </th>
  );
}

function LoadingRows({ columns, selectable, count = 5 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <tr key={i} className="quicklo-table-row" aria-hidden="true" role="row">
          {selectable && (
            <td className="quicklo-table-cell quicklo-table-cell--select" role="cell">
              <Skeleton variant="line" width="20px" height="20px" />
            </td>
          )}
          {columns.map((column) => (
            <td
              key={column.key}
              role="cell"
              className={cn('quicklo-table-cell', column.hideBelow === 'md' && 'quicklo-table-cell--hide-mobile')}
            >
              <Skeleton variant="line" width={column.isPrimary ? '70%' : '50%'} height="16px" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

function TableRow({ row, rowIndex, columns, rowId, selectable, isSelected, onToggleSelect, onRowClick, zebra, primaryLabel }) {
  const isDisabled = Boolean(row.disabled);
  const isNavigable = Boolean(onRowClick) && !isDisabled;

  function handleRowClick() {
    if (isNavigable) onRowClick(row);
  }

  return (
    <tr
      role="row"
      className={cn('quicklo-table-row', zebra && rowIndex % 2 === 1 && 'quicklo-table-row--zebra')}
      aria-selected={selectable ? (isSelected ? 'true' : 'false') : undefined}
      aria-disabled={isDisabled || undefined}
      style={isDisabled ? { opacity: 'var(--opacity-disabled)', pointerEvents: 'none' } : undefined}
      onClick={isNavigable ? handleRowClick : undefined}
    >
      {selectable && (
        <td
          role="cell"
          className="quicklo-table-cell quicklo-table-cell--select"
          onClick={(e) => e.stopPropagation()}
        >
          <Checkbox
            hideLabel
            label={`Select ${primaryLabel ?? 'row'}`}
            aria-label={`Select ${primaryLabel ?? 'row'}`}
            checked={isSelected}
            disabled={isDisabled}
            onChange={(e) => onToggleSelect(rowId, e.target.checked)}
          />
        </td>
      )}
      {columns.map((column) => {
        const rendered = column.cell ? column.cell(row) : <TextCell value={row[column.key]} />;
        const isPrimary = Boolean(column.isPrimary);
        const isActions = column.key === 'actions';
        const content =
          isPrimary && isNavigable ? (
            <button type="button" className="quicklo-table-primary-link" onClick={handleRowClick}>
              {rendered}
            </button>
          ) : (
            rendered
          );

        return (
          <td
            key={column.key}
            role="cell"
            data-label={column.header}
            className={cn(
              'quicklo-table-cell',
              isPrimary && 'quicklo-table-cell--primary',
              isActions && 'quicklo-table-cell--actions',
              ALIGN_CLASS[column.align ?? 'start'],
              column.hideBelow === 'md' && 'quicklo-table-cell--hide-mobile'
            )}
            style={{
              width: column.width,
              order: !isPrimary && !isActions ? column.cardOrder : undefined,
            }}
          >
            {content}
          </td>
        );
      })}
    </tr>
  );
}

/**
 * @typedef {Object} TableColumn
 * @property {string} key
 * @property {import('react').ReactNode} header
 * @property {'start'|'end'|'center'} [align='start']
 * @property {boolean} [sortable=false]
 * @property {string} [width]
 * @property {(row: Object) => import('react').ReactNode} [cell]
 * @property {boolean} [isPrimary] - card header below md; the onRowClick navigable target.
 * @property {'md'} [hideBelow] - omit from the mobile card entirely.
 * @property {number} [cardOrder] - mobile card stacking order (ignored on isPrimary/actions columns).
 * @property {'asc'|'desc'} [defaultSortDirection]
 */

/**
 * @typedef {Object} TableProps
 * @property {TableColumn[]} columns
 * @property {Object[]} data
 * @property {(row: Object) => string} getRowId - required when `selectable`.
 * @property {boolean} [selectable=false] - desktop only; fully suppressed below md.
 * @property {string[]} [selectedIds]
 * @property {(ids: string[]) => void} [onSelectionChange]
 * @property {import('react').ReactNode} [bulkActions]
 * @property {{key: string, direction: 'asc'|'desc'}} [sortState]
 * @property {(next: {key: string, direction: 'asc'|'desc'}) => void} [onSortChange]
 * @property {(row: Object) => void} [onRowClick]
 * @property {boolean} [stickyHeader=false]
 * @property {boolean} [zebra=false]
 * @property {'populated'|'loading'|'empty'|'error'} [state='populated']
 * @property {{icon?: string, title: string, description?: string, action?: {label: string, onClick: () => void}}} [emptyState]
 * @property {import('react').ReactNode} [errorContent]
 * @property {import('react').ReactNode} [footer] - typically a `<Pagination variant="table" />`.
 * @property {string} [caption]
 * @property {string} [ariaLabel]
 * @property {string} [className]
 */

/**
 * Table — see the file header for the responsive card-stack mechanism and
 * the row-background precedence rules.
 * @param {TableProps} props
 */
export const Table = React.forwardRef(function Table(
  {
    columns,
    data,
    getRowId,
    selectable = false,
    selectedIds,
    onSelectionChange,
    bulkActions,
    sortState,
    onSortChange,
    onRowClick,
    stickyHeader = false,
    zebra = false,
    state = 'populated',
    emptyState,
    errorContent,
    footer,
    caption,
    ariaLabel,
    className,
    ...rest
  },
  ref
) {
  if (process.env.NODE_ENV !== 'production' && !caption && !ariaLabel) {
    console.warn('[Table] a `caption` or `ariaLabel` is required — Table has no other accessible name.');
  }
  if (process.env.NODE_ENV !== 'production' && selectable && !getRowId) {
    console.warn('[Table] `getRowId` is required when `selectable` is true.');
  }

  const primaryColumn = columns.find((c) => c.isPrimary);
  const totalColumns = columns.length + (selectable ? 1 : 0);

  const resolveId = React.useCallback((row, index) => (getRowId ? getRowId(row) : row.id ?? index), [getRowId]);

  const selectableIds = React.useMemo(
    () => data.filter((row) => !row.disabled).map((row, i) => resolveId(row, i)),
    [data, resolveId]
  );
  const selectedSet = React.useMemo(() => new Set(selectedIds ?? []), [selectedIds]);
  const selectedCount = selectableIds.filter((id) => selectedSet.has(id)).length;
  const allSelected = selectableIds.length > 0 && selectedCount === selectableIds.length;
  const someSelected = selectedCount > 0 && !allSelected;

  function handleSelectAll() {
    if (allSelected) {
      onSelectionChange?.((selectedIds ?? []).filter((id) => !selectableIds.includes(id)));
    } else {
      onSelectionChange?.(Array.from(new Set([...(selectedIds ?? []), ...selectableIds])));
    }
  }

  function handleToggleSelect(id, checked) {
    const next = new Set(selectedIds ?? []);
    if (checked) next.add(id);
    else next.delete(id);
    onSelectionChange?.(Array.from(next));
  }

  return (
    <div
      ref={ref}
      {...rest}
      className={cn(className)}
      style={{
        background: 'var(--color-bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border-default)',
        overflow: 'hidden',
      }}
    >
      <style>{TABLE_STYLE}</style>

      <table className="quicklo-table" role="table">
        <caption className="sr-only">{caption ?? ariaLabel}</caption>

        <thead
          className={cn('quicklo-table-head', stickyHeader && 'md:sticky md:top-0 md:z-10')}
          role="rowgroup"
          style={stickyHeader ? { background: 'var(--color-bg-surface)', boxShadow: 'var(--elevation-2)' } : undefined}
        >
          <tr role="row">
            {selectable && (
              <th scope="col" role="columnheader" className="quicklo-table-header-cell quicklo-table-cell--select" style={{ width: '44px' }}>
                <Checkbox
                  hideLabel
                  label="Select all"
                  aria-label="Select all"
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={handleSelectAll}
                />
              </th>
            )}
            {columns.map((column) => (
              <HeaderCell key={column.key} column={column} sortState={sortState} onSortChange={onSortChange} />
            ))}
          </tr>
        </thead>

        <tbody className="quicklo-table-body" role="rowgroup">
          {state === 'loading' && <LoadingRows columns={columns} selectable={selectable} />}

          {state === 'empty' && (
            <tr className="quicklo-table-row" role="row">
              <td colSpan={totalColumns} role="cell" className="quicklo-table-cell--full">
                <TableEmptyState {...emptyState} />
              </td>
            </tr>
          )}

          {state === 'error' && (
            <tr className="quicklo-table-row" role="row">
              <td colSpan={totalColumns} role="cell" className="quicklo-table-cell--full">
                {errorContent ?? (
                  <Alert
                    tone="error"
                    title="Couldn't load"
                    description="Something went wrong loading this data. Try again."
                  />
                )}
              </td>
            </tr>
          )}

          {state === 'populated' &&
            data.map((row, rowIndex) => (
              <TableRow
                key={resolveId(row, rowIndex)}
                row={row}
                rowIndex={rowIndex}
                columns={columns}
                rowId={resolveId(row, rowIndex)}
                selectable={selectable}
                isSelected={selectedSet.has(resolveId(row, rowIndex))}
                onToggleSelect={handleToggleSelect}
                onRowClick={onRowClick}
                zebra={zebra}
                primaryLabel={primaryColumn ? row[primaryColumn.key] : undefined}
              />
            ))}
        </tbody>
      </table>

      {footer}

      {selectable && (
        <TableBatchBar count={selectedCount} bulkActions={bulkActions} onClear={() => onSelectionChange?.([])} />
      )}
    </div>
  );
});

Table.displayName = 'Table';
