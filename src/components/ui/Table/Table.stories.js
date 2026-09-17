import React, { useState } from 'react';
import { Table } from './Table.jsx';
import {
  TextCell,
  PrimaryCell,
  BadgeCell,
  ChipsCell,
  NumericCell,
  MonoCell,
  TimeCell,
  LinkCell,
  AvatarStackCell,
  SparklineCell,
  ActionsCell,
} from './TableCells.jsx';
import { Pagination } from '@/components/ui/Pagination/Pagination.jsx';
import { Button } from '@/components/ui/Button/Button.jsx';
import { IconButton } from '@/components/ui/IconButton/IconButton.jsx';
import { Pencil, Trash2, Download } from '@/design-system/icons/index.js';

// ─────────────────────────────────────────────────────────────────────────────
// META
// ─────────────────────────────────────────────────────────────────────────────

export default {
  title: 'Components/Table',
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
// SORT HELPER — shared by every Demo* wrapper below. Table itself never sorts
// data (fully controlled, same philosophy as Pagination) — the DEMO owns the
// re-sort, exactly like the real product would.
// ─────────────────────────────────────────────────────────────────────────────

function sortRows(data, sortState, comparators) {
  if (!sortState || !comparators || !comparators[sortState.key]) return data;
  const sorted = [...data].sort(comparators[sortState.key]);
  return sortState.direction === 'desc' ? sorted.reverse() : sorted;
}

// ─────────────────────────────────────────────────────────────────────────────
// LIVE DEMO WRAPPERS — every instance below drives real onSelectionChange /
// onSortChange / onPageChange state via useState, never a static mockup.
// Each wrapper owns its own independent state (a separate component instance
// per mount), the same pattern Pagination.stories.js's Demo* wrappers use.
// ─────────────────────────────────────────────────────────────────────────────

// DemoSortableTable — owns sortState + re-sorts the array itself on header
// click. Reused for both the hero table (section 3) and the focused Sorting
// section (section 6) with different column/data configs.
function DemoSortableTable({ columns, data, comparators, initialSort, getRowId, footerPageCount, footerTotal, ...rest }) {
  const [sortState, setSortState] = useState(initialSort);
  const [page, setPage] = useState(1);
  const sorted = sortRows(data, sortState, comparators);
  return (
    <Table
      {...rest}
      columns={columns}
      data={sorted}
      getRowId={getRowId}
      sortState={sortState}
      onSortChange={setSortState}
      footer={
        footerPageCount ? (
          <Pagination
            variant="table"
            size="md"
            page={page}
            pageCount={footerPageCount}
            onPageChange={setPage}
            total={footerTotal}
            pageSize={data.length}
          />
        ) : undefined
      }
    />
  );
}

// DemoSelectableTable — owns selectedIds + onSelectionChange, drives the
// batch bar. Mounted ONCE in the whole story (section 5) so there is only
// one live floating bar a reviewer can trigger from that section.
function DemoSelectableTable({ columns, data, getRowId, bulkActions, ...rest }) {
  const [selectedIds, setSelectedIds] = useState([]);
  return (
    <Table
      {...rest}
      columns={columns}
      data={data}
      getRowId={getRowId}
      selectable
      selectedIds={selectedIds}
      onSelectionChange={setSelectedIds}
      bulkActions={bulkActions}
    />
  );
}

// DemoBillingTable — owner-facing invoice history. Simple, sortable on Date,
// NOT selectable. Real <Pagination variant="table" /> footer with live page
// state.
function DemoBillingTable() {
  const [sortState, setSortState] = useState({ key: 'date', direction: 'desc' });
  const [page, setPage] = useState(1);
  const sorted = sortRows(BILLING_DATA, sortState, {
    date: (a, b) => new Date(a.date) - new Date(b.date),
    amount: (a, b) => a.amount - b.amount,
  });
  return (
    <Table
      ariaLabel="Invoice and payment history"
      columns={BILLING_COLUMNS}
      data={sorted}
      getRowId={(row) => row.id}
      sortState={sortState}
      onSortChange={setSortState}
      footer={<Pagination variant="table" size="md" page={page} pageCount={2} onPageChange={setPage} total={BILLING_DATA.length} pageSize={BILLING_DATA.length} />}
    />
  );
}

// DemoBugReportTable — admin bug-report queue. Selectable + sortable
// (Timestamp), with a batch-resolve bulkActions slot and a real Pagination
// footer. This is the SECOND selectable table in the story (alongside
// section 5's DemoSelectableTable) — each owns fully independent state, so
// selecting rows here never affects section 5's bar. In the real product
// these two screens (Billing, Admin bug reports) are never mounted on the
// same page at once; this documentation canvas shows every example
// simultaneously, which a single production screen never does.
function DemoBugReportTable() {
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortState, setSortState] = useState({ key: 'timestamp', direction: 'desc' });
  const [page, setPage] = useState(1);
  const sorted = sortRows(BUG_REPORT_DATA, sortState, {
    timestamp: (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
  });
  return (
    <Table
      ariaLabel="Bug reports"
      columns={BUG_REPORT_COLUMNS}
      data={sorted}
      getRowId={(row) => row.id}
      selectable
      selectedIds={selectedIds}
      onSelectionChange={setSelectedIds}
      bulkActions={
        <Button variant="ghost" size="sm" leftIcon="CheckCircle2">
          Mark resolved
        </Button>
      }
      sortState={sortState}
      onSortChange={setSortState}
      footer={<Pagination variant="table" size="md" page={page} pageCount={3} onPageChange={setPage} total={41} pageSize={BUG_REPORT_DATA.length} />}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA — realistic Quicklo copy throughout, never Lorem ipsum
// ─────────────────────────────────────────────────────────────────────────────

const ACCOUNTS_DATA = [
  { id: '1', name: 'Rivera Plumbing & Drain', email: 'owner@riveraplumbing.com', status: 'success', tags: [{ label: 'Web' }, { label: 'Phone' }, { label: 'Referral' }], trend: [{ value: 4 }, { value: 6 }, { value: 5 }, { value: 9 }, { value: 12 }], team: [{ name: 'Ana Rivera' }, { name: 'Beto Cruz' }], leads: 128, hash: 'wh_9f2a1c7b3d', joinedAt: '2026-03-14T10:00:00Z', joinedLabel: '4 months ago' },
  { id: '2', name: 'Coastal HVAC Solutions', email: 'hello@coastalhvac.com', status: 'warning', tags: [{ label: 'Web' }], trend: [{ value: 5 }, { value: 4 }, { value: 5 }, { value: 4 }, { value: 4 }], team: [{ name: 'Eli Foster' }], leads: 42, hash: 'wh_3d8e5a21f0', joinedAt: '2026-04-02T10:00:00Z', joinedLabel: '3 months ago' },
  { id: '3', name: 'Bright Smile Dental', email: 'info@brightsmile.com', status: 'success', tags: [{ label: 'Web' }, { label: 'Phone' }], trend: [{ value: 6 }, { value: 8 }, { value: 7 }, { value: 10 }, { value: 11 }], team: [{ name: 'Grace Han' }, { name: 'Ivan Petrov' }], leads: 96, hash: 'wh_7c1b4f9021', joinedAt: '2026-02-20T10:00:00Z', joinedLabel: '5 months ago' },
  { id: '4', name: 'Ironclad Electric', email: 'contact@ironcladelectric.com', status: 'error', tags: [{ label: 'Phone' }], trend: [{ value: 5 }, { value: 3 }, { value: 3 }, { value: 2 }, { value: 1 }], team: [{ name: 'Kai Lindqvist' }], leads: 15, hash: 'wh_e42a9c3391', joinedAt: '2026-05-11T10:00:00Z', joinedLabel: '2 months ago' },
  { id: '5', name: 'Summit Fitness Studio', email: 'team@summitfitness.com', status: 'neutral', tags: [{ label: 'Web' }], trend: [{ value: 3 }, { value: 4 }, { value: 4 }, { value: 5 }, { value: 5 }], team: [{ name: 'Mona Nasser' }, { name: 'Omar Diallo' }], leads: 63, hash: 'wh_1a7f6d84c2', joinedAt: '2026-01-08T10:00:00Z', joinedLabel: '6 months ago' },
];

const STATUS_LABEL = { success: 'Active', warning: 'Needs attention', error: 'Failing', neutral: 'Paused' };
const STATUS_ICON = { success: 'CheckCircle2', warning: 'AlertTriangle', error: 'XCircle', neutral: 'MinusCircle' };

function accountsColumns({ sortable = true } = {}) {
  return [
    { key: 'name', header: 'Business', isPrimary: true, cell: (row) => <PrimaryCell avatarProps={{ name: row.name }} primary={row.name} meta={row.email} /> },
    { key: 'status', header: 'Status', cell: (row) => <BadgeCell tone={row.status} icon={STATUS_ICON[row.status]}>{STATUS_LABEL[row.status]}</BadgeCell> },
    { key: 'tags', header: 'Source', cell: (row) => <ChipsCell items={row.tags} max={2} /> },
    { key: 'trend', header: 'Trend', cell: (row) => <SparklineCell data={row.trend} ariaLabel={`${row.name} lead trend, last 5 weeks`} /> },
    { key: 'team', header: 'Team', cell: (row) => <AvatarStackCell items={row.team} max={3} /> },
    { key: 'leads', header: 'Leads', align: 'end', sortable, cell: (row) => <NumericCell value={row.leads} /> },
    { key: 'hash', header: 'Webhook', cell: (row) => <MonoCell value={row.hash} copyable /> },
    { key: 'joinedAt', header: 'Joined', hideBelow: 'md', cell: (row) => <TimeCell value={row.joinedAt} label={row.joinedLabel} title={row.joinedAt} /> },
    {
      key: 'actions',
      header: 'Actions',
      align: 'end',
      cell: () => (
        <ActionsCell>
          <IconButton icon={Pencil} variant="ghost" size="sm" aria-label="Edit account" />
          <IconButton icon={Trash2} variant="ghost" size="sm" aria-label="Delete account" />
        </ActionsCell>
      ),
    },
  ];
}

const REVENUE_DATA = [
  { id: '1', region: 'West', revenue: 18400 },
  { id: '2', region: 'Midwest', revenue: 9200 },
  { id: '3', region: 'South', revenue: 24700 },
  { id: '4', region: 'Northeast', revenue: 13950 },
];

const REVENUE_COLUMNS = [
  { key: 'region', header: 'Region', isPrimary: true, cell: (row) => <TextCell value={row.region} /> },
  { key: 'revenue', header: 'Revenue', align: 'end', sortable: true, cell: (row) => <NumericCell value={row.revenue} formatter={(v) => `$${v.toLocaleString()}`} /> },
];

const SELECTABLE_DATA = [
  { id: '1', name: 'Rivera Plumbing & Drain', email: 'owner@riveraplumbing.com', status: 'success', leads: 128 },
  { id: '2', name: 'Coastal HVAC Solutions', email: 'hello@coastalhvac.com', status: 'warning', leads: 42 },
  { id: '3', name: 'Bright Smile Dental', email: 'info@brightsmile.com', status: 'success', leads: 96 },
  { id: '4', name: 'Ironclad Electric', email: 'contact@ironcladelectric.com', status: 'error', leads: 15 },
];

const SELECTABLE_COLUMNS = [
  { key: 'name', header: 'Business', isPrimary: true, cell: (row) => <PrimaryCell avatarProps={{ name: row.name }} primary={row.name} meta={row.email} /> },
  { key: 'status', header: 'Status', cell: (row) => <BadgeCell tone={row.status} icon={STATUS_ICON[row.status]}>{STATUS_LABEL[row.status]}</BadgeCell> },
  { key: 'leads', header: 'Leads', align: 'end', cell: (row) => <NumericCell value={row.leads} /> },
];

const BILLING_DATA = [
  { id: '1', date: '2026-07-01T10:00:00Z', dateLabel: 'Jul 1, 2026', amount: 19, plan: 'Pro', status: 'success' },
  { id: '2', date: '2026-06-01T10:00:00Z', dateLabel: 'Jun 1, 2026', amount: 19, plan: 'Pro', status: 'success' },
  { id: '3', date: '2026-05-01T10:00:00Z', dateLabel: 'May 1, 2026', amount: 19, plan: 'Pro', status: 'error' },
  { id: '4', date: '2026-04-01T10:00:00Z', dateLabel: 'Apr 1, 2026', amount: 9.99, plan: 'Starter', status: 'success' },
];

const BILLING_COLUMNS = [
  { key: 'date', header: 'Date', isPrimary: true, sortable: true, cell: (row) => <TimeCell value={row.date} label={row.dateLabel} title={row.date} /> },
  { key: 'amount', header: 'Amount', align: 'end', cell: (row) => <NumericCell value={row.amount} formatter={(v) => `$${v.toFixed(2)}`} /> },
  { key: 'plan', header: 'Plan', cell: (row) => <TextCell value={row.plan} /> },
  { key: 'status', header: 'Status', cell: (row) => <BadgeCell tone={row.status === 'success' ? 'success' : 'error'}>{row.status === 'success' ? 'Paid' : 'Failed'}</BadgeCell> },
  {
    key: 'actions',
    header: 'Actions',
    align: 'end',
    cell: () => <ActionsCell><IconButton icon={Download} variant="ghost" size="sm" aria-label="Download invoice" /></ActionsCell>,
  },
];

const BUG_REPORT_DATA = [
  { id: '1', plan: 'Pro', description: 'SMS not sent for lead from contact form', timestamp: '2026-07-09T09:12:00Z', timestampLabel: '1 day ago', status: 'warning', statusLabel: 'Open' },
  { id: '2', plan: 'Starter', description: 'Dashboard shows wrong lead count on Analytics tab', timestamp: '2026-07-07T15:40:00Z', timestampLabel: '3 days ago', status: 'info', statusLabel: 'In progress' },
  { id: '3', plan: 'Business', description: 'Missed-call SMS greeting recording failed to save', timestamp: '2026-07-05T08:05:00Z', timestampLabel: '5 days ago', status: 'success', statusLabel: 'Resolved' },
  { id: '4', plan: 'Pro', description: 'Billing page 500s when downloading an old invoice', timestamp: '2026-07-02T12:00:00Z', timestampLabel: '1 week ago', status: 'warning', statusLabel: 'Open' },
];

const BUG_REPORT_COLUMNS = [
  { key: 'description', header: 'Description', isPrimary: true, cell: (row) => <PrimaryCell primary={row.description} meta={`${row.plan} plan`} /> },
  { key: 'timestamp', header: 'Reported', sortable: true, cell: (row) => <TimeCell value={row.timestamp} label={row.timestampLabel} title={row.timestamp} /> },
  { key: 'status', header: 'Status', cell: (row) => <BadgeCell tone={row.status}>{row.statusLabel}</BadgeCell> },
];

// Cell renderer gallery — one row per exported renderer, real live output.
const CELL_GALLERY = [
  { type: 'text', example: <TextCell value="Plain text value" /> },
  { type: 'primary', example: <PrimaryCell avatarProps={{ name: 'Sarah Mitchell' }} primary="Sarah Mitchell" meta="sarah@mitchellhvac.com" /> },
  { type: 'badge', example: <BadgeCell tone="success" icon="CheckCircle2">Booked</BadgeCell> },
  { type: 'chips', example: <ChipsCell items={[{ label: 'Web' }, { label: 'Phone' }, { label: 'Referral' }, { label: 'Email' }]} max={2} /> },
  { type: 'numeric', example: <NumericCell value={2450} formatter={(v) => `$${v.toLocaleString()}`} /> },
  { type: 'mono', example: <MonoCell value="wh_9f2a1c7b3d" copyable /> },
  { type: 'time', example: <TimeCell value="2026-07-08T14:30:00Z" label="2 days ago" title="Jul 8, 2026, 2:30 PM" /> },
  { type: 'link', example: <LinkCell href="https://getquicklo.com/docs">View setup guide</LinkCell> },
  { type: 'avatarStack', example: <AvatarStackCell items={[{ name: 'Alex Kim' }, { name: 'Jamie Lee' }, { name: 'Sam Osei' }, { name: 'Nina Torres' }]} max={3} /> },
  { type: 'sparkline', example: <SparklineCell data={[{ value: 2 }, { value: 5 }, { value: 3 }, { value: 8 }, { value: 6 }]} ariaLabel="Leads trend, last 5 weeks" /> },
  {
    type: 'actions',
    example: (
      <ActionsCell>
        <IconButton icon={Pencil} variant="ghost" size="sm" aria-label="Edit" />
        <IconButton icon={Trash2} variant="ghost" size="sm" aria-label="Delete" />
      </ActionsCell>
    ),
  },
];

const GALLERY_COLUMNS = [
  { key: 'type', header: 'Cell type', isPrimary: true, cell: (row) => <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem', color: 'var(--color-text-primary)' }}>{row.type}</span> },
  { key: 'example', header: 'Example', cell: (row) => row.example },
];

// ─────────────────────────────────────────────────────────────────────────────
// REFERENCE DATA
// ─────────────────────────────────────────────────────────────────────────────

const PROPS = [
  { name: 'columns', type: 'TableColumn[]', defaultVal: '—', description: 'Required. { key, header, align?, sortable?, width?, cell?, isPrimary?, hideBelow?, cardOrder?, defaultSortDirection? }.' },
  { name: 'data', type: 'Object[]', defaultVal: '—', description: 'Required. Row objects — shape is whatever your cell renderers expect.' },
  { name: 'getRowId', type: '(row) => string', defaultVal: 'undefined', description: 'Required when selectable. Used for React keys either way.' },
  { name: 'selectable', type: 'bool', defaultVal: 'false', description: 'Injects a leading Checkbox column + indeterminate select-all + the floating batch bar. DESKTOP ONLY — fully suppressed below md.' },
  { name: 'selectedIds', type: 'string[]', defaultVal: 'undefined', description: 'Controlled selection.' },
  { name: 'onSelectionChange', type: '(ids: string[]) => void', defaultVal: 'undefined', description: 'Fires with the next selected-ids array.' },
  { name: 'bulkActions', type: 'ReactNode', defaultVal: 'undefined', description: 'Rendered inside the floating batch bar — pass Buttons.' },
  { name: 'sortState', type: "{ key: string, direction: 'asc' | 'desc' }", defaultVal: 'undefined', description: 'Controlled sort. Table never sorts `data` itself.' },
  { name: 'onSortChange', type: '(next) => void', defaultVal: 'undefined', description: 'Fires with the next sort state on a sortable header click.' },
  { name: 'onRowClick', type: '(row) => void', defaultVal: 'undefined', description: 'Makes rows navigable — the isPrimary cell becomes a real button/link, never the <tr> itself.' },
  { name: 'stickyHeader', type: 'bool', defaultVal: 'false', description: 'Sticks the header at md+, with --elevation-2 shown once enabled.' },
  { name: 'zebra', type: 'bool', defaultVal: 'false', description: 'Alternates --color-bg-primary on odd rows. Desktop only.' },
  { name: 'state', type: "'populated' | 'loading' | 'empty' | 'error'", defaultVal: "'populated'", description: 'loading renders Skeleton rows; empty renders TableEmptyState; error renders errorContent or a default Alert.' },
  { name: 'emptyState', type: '{ icon?, title, description?, action? }', defaultVal: 'undefined', description: 'Feeds TableEmptyState when state="empty".' },
  { name: 'errorContent', type: 'ReactNode', defaultVal: 'undefined', description: 'Overrides the default error Alert when state="error".' },
  { name: 'footer', type: 'ReactNode', defaultVal: 'undefined', description: 'Typically a <Pagination variant="table" /> — Pagination supplies its own top divider.' },
  { name: 'caption', type: 'string', defaultVal: 'undefined', description: 'Accessible name, rendered as a visually-hidden <caption>. Falls back to ariaLabel.' },
  { name: 'ariaLabel', type: 'string', defaultVal: 'undefined', description: 'Accessible name — a caption or ariaLabel is required.' },
  { name: 'className', type: 'string', defaultVal: 'undefined', description: "Appended to the root container's classes." },
];

const CELL_RENDERERS = [
  { name: 'text', description: 'Default cell when a column has no `cell` renderer. Plain body text.' },
  { name: 'primary', description: 'Two-line: bold name + secondary meta, optional leading Avatar or Icon. Usually the isPrimary column.' },
  { name: 'badge', description: 'Composes Badge as-is — a status pill.' },
  { name: 'chips', description: 'Composes Chip, wraps, collapses overflow into a "+N" Chip.' },
  { name: 'numeric', description: 'Right-aligned, tabular-nums, optional formatter.' },
  { name: 'mono', description: 'Monospace value, optional copy IconButton.' },
  { name: 'time', description: 'Relative label with the absolute value in the native title attribute.' },
  { name: 'link', description: 'Text + trailing ExternalLink icon, brand-interactive colour.' },
  { name: 'avatarStack', description: 'Overlapping Avatars + a "+N" overflow bubble.' },
  { name: 'sparkline', description: 'Composes Chart type="sparkline" — bare embed geometry.' },
  { name: 'actions', description: 'A slot for inline IconButtons and/or a trailing chevron. Not a menu — Dropdown is unbuilt.' },
];

function PropsTable({ rows, columns }) {
  const isCompact = columns.length === 2;
  return (
    <div style={{
      background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-default)',
      borderRadius: 'var(--radius-md)', overflow: 'hidden',
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'var(--color-bg-secondary)' }}>
            {columns.map((h) => (
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
          {rows.map((row, i) => (
            <tr key={row.name} style={{ background: i % 2 === 0 ? 'var(--color-bg-surface)' : 'var(--color-bg-primary)' }}>
              <td style={{
                padding: '12px 16px', minHeight: '44px',
                fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem',
                color: 'var(--color-text-primary)', whiteSpace: 'nowrap',
                borderBottom: i < rows.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
              }}>
                {row.name}
              </td>
              {!isCompact && (
                <>
                  <td style={{
                    padding: '12px 16px',
                    fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem',
                    color: 'var(--color-text-secondary)',
                    borderBottom: i < rows.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                  }}>
                    {row.type}
                  </td>
                  <td style={{
                    padding: '12px 16px',
                    fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem',
                    color: 'var(--color-text-secondary)', whiteSpace: 'nowrap',
                    borderBottom: i < rows.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                  }}>
                    {row.defaultVal}
                  </td>
                </>
              )}
              <td style={{
                padding: '12px 16px',
                fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
                color: 'var(--color-text-primary)',
                borderBottom: i < rows.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
              }}>
                {row.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STORY EXPORT — single Overview export, per the style guide. Table is fully
// controlled (selection, sort, pagination are all external state), so every
// demo below is a live Demo* wrapper, never a static mockup.
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
        Table
      </h1>
      <p style={{
        fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 400,
        lineHeight: '1.75rem', color: 'var(--color-text-secondary)', margin: 0,
      }}>
        A responsive data table for tabular product surfaces — billing history and the admin dashboard —
        that collapses to a card stack below 768px.
      </p>
    </div>

    {/* ── 1. Full table (hero) ──────────────────────────────────────────────── */}
    <SectionHead
      title="Full table"
      description="Sortable Leads column, a status Badge cell, source Chips, a sparkline trend, a team avatar stack, a copyable webhook id, a hideBelow:'md' Joined column, an actions cell, a sticky header, and a live Pagination footer. Click the Leads header to re-sort."
    />
    <div style={{ marginBottom: '40px' }}>
      <DemoSortableTable
        ariaLabel="Connected accounts"
        columns={accountsColumns()}
        data={ACCOUNTS_DATA}
        getRowId={(row) => row.id}
        comparators={{ leads: (a, b) => a.leads - b.leads }}
        initialSort={{ key: 'leads', direction: 'desc' }}
        stickyHeader
        footerPageCount={3}
        footerTotal={27}
      />
    </div>

    <Divider />

    {/* ── 2. Cell renderer gallery ──────────────────────────────────────────── */}
    <SectionHead
      title="Cell renderer gallery"
      description="Every exported cell renderer, with realistic content. The left column names the renderer; the right column is its live output."
    />
    <div style={{ marginBottom: '40px' }}>
      <Table ariaLabel="Cell renderer gallery" columns={GALLERY_COLUMNS} data={CELL_GALLERY} getRowId={(row) => row.type} />
    </div>

    <Divider />

    {/* ── 3. Selection + batch bar ──────────────────────────────────────────── */}
    <SectionHead
      title="Selection + batch bar"
      description="Selection is DESKTOP ONLY — the checkbox column and the floating batch bar are both fully suppressed below md (768px). Select a row or two below to see the bar appear bottom-centre; clear the selection or uncheck everything to see it disappear."
    />
    <div style={{ marginBottom: '40px' }}>
      <DemoSelectableTable
        ariaLabel="Selectable accounts"
        columns={SELECTABLE_COLUMNS}
        data={SELECTABLE_DATA}
        getRowId={(row) => row.id}
        bulkActions={
          <>
            <Button variant="ghost" size="sm">Archive</Button>
            <Button variant="destructive" size="sm" leftIcon="Trash2">Delete</Button>
          </>
        }
      />
      <Note>This is the only selectable table above the &quot;In context&quot; section further down — TableBatchBar is position:fixed, so only one live, actively-selected table is shown at a time here to avoid two bars competing for the same screen position.</Note>
    </div>

    <Divider />

    {/* ── 4. Sorting ─────────────────────────────────────────────────────────── */}
    <SectionHead
      title="Sorting"
      description={'Fully controlled — Table reports { key, direction } via onSortChange and expects pre-sorted data back, the same philosophy as Pagination. Click "Revenue" to toggle: neutral ChevronsUpDown → active-descending ChevronDown → active-ascending ChevronDown rotated 180°. aria-sort reflects the current state.'}
    />
    <div style={{ marginBottom: '40px' }}>
      <DemoSortableTable
        ariaLabel="Revenue by region"
        columns={REVENUE_COLUMNS}
        data={REVENUE_DATA}
        getRowId={(row) => row.id}
        comparators={{ revenue: (a, b) => a.revenue - b.revenue }}
        initialSort={{ key: 'revenue', direction: 'desc' }}
      />
    </div>

    <Divider />

    {/* ── 5. Responsive ─────────────────────────────────────────────────────── */}
    <SectionHead
      title="Responsive"
      description="Below 768px (md), the SAME table DOM restyles into a card stack via CSS alone — no markup swap to a <ul>."
    />
    <div style={{ marginBottom: '40px' }}>
      <DemoSortableTable
        ariaLabel="Connected accounts, responsive demo"
        columns={accountsColumns({ sortable: false })}
        data={ACCOUNTS_DATA}
        getRowId={(row) => row.id}
      />
      <Note>
        Tailwind&apos;s <code style={code}>md:</code> breakpoint (and this component&apos;s own <code style={code}>@media (min-width: 768px)</code> rule) is viewport-based, not container-based — a narrow wrapper div inside this Storybook canvas can&apos;t actually trigger the card-stack CSS, so this section deliberately does not fabricate a fake narrow preview (the same honest approach Pagination&apos;s own story took for its <code style={code}>sm:</code> collapse). Resize the real browser window below 768px to see the table above become a stack of cards: the header becomes screen-reader-only, each row becomes a bordered card, each cell becomes a label:value row, the Business cell becomes the card header, and Actions moves to the card bottom.
      </Note>
    </div>

    <Divider />

    {/* ── 6. States ──────────────────────────────────────────────────────────── */}
    <SectionHead
      title="States"
      description="loading, empty, and error via the state prop — shown live below, not screenshots."
    />
    <div style={{ marginBottom: '40px', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <BlockLabel>loading — 5 Skeleton rows shaped to the columns, no spinner</BlockLabel>
        <Table
          ariaLabel="Loading accounts"
          columns={[
            { key: 'name', header: 'Business', isPrimary: true },
            { key: 'status', header: 'Status' },
            { key: 'leads', header: 'Leads', align: 'end' },
          ]}
          data={[]}
          state="loading"
        />
      </div>
      <div>
        <BlockLabel>empty — TableEmptyState, a local stand-in for the unbuilt EmptyState component</BlockLabel>
        <Table
          ariaLabel="No accounts"
          columns={[
            { key: 'name', header: 'Business', isPrimary: true },
            { key: 'status', header: 'Status' },
            { key: 'leads', header: 'Leads', align: 'end' },
          ]}
          data={[]}
          state="empty"
          emptyState={{
            icon: 'Inbox',
            title: 'No connected accounts yet',
            description: 'New accounts will show up here as soon as a business connects a webhook.',
            action: { label: 'Invite a business', onClick: () => {} },
          }}
        />
      </div>
      <div>
        <BlockLabel>error — errorContent, or the default inline Alert tone=&quot;error&quot;</BlockLabel>
        <Table
          ariaLabel="Accounts failed to load"
          columns={[
            { key: 'name', header: 'Business', isPrimary: true },
            { key: 'status', header: 'Status' },
            { key: 'leads', header: 'Leads', align: 'end' },
          ]}
          data={[]}
          state="error"
        />
        <Note>The default error Alert uses Alert&apos;s own locked XCircle icon — Alert&apos;s icon override is restricted to tone=&quot;info&quot; only, so Table&apos;s default does not attempt a ServerCrash override (it would dev-warn and be silently ignored). Pass errorContent for a fully custom treatment.</Note>
      </div>
    </div>

    <Divider />

    {/* ── 7. In context ──────────────────────────────────────────────────────── */}
    <SectionHead
      title="In context"
      description="Two real Quicklo mounts — the actual shapes this component ships for."
    />
    <div style={{ marginBottom: '40px', display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      <div>
        <BlockLabel>Settings → Billing — invoice &amp; payment history (sortable on Date, not selectable)</BlockLabel>
        <DemoBillingTable />
      </div>
      <div>
        <BlockLabel>Admin → Bug reports (selectable + sortable, batch-resolve)</BlockLabel>
        <DemoBugReportTable />
      </div>
    </div>

    <Divider />

    {/* ── 8. Usage guide ────────────────────────────────────────────────────── */}
    <SectionHead
      title="Usage guide"
      description="When Table is the right shape, and where it deliberately is not used."
    />
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '16px',
      marginBottom: '40px',
    }}>
      <InfoBox>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
          Use Table for: billing &amp; admin
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          Settings → Billing (invoice/payment history) and the admin dashboard (bug reports, users &amp; plans, revenue &amp; payments, scraper stats, Test Lab queue) — bounded, row-per-record datasets.
        </p>
      </InfoBox>
      <InfoBox>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
          Don&apos;t use Table for: Leads inbox
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          The Leads inbox is a <code style={code}>LeadRow</code> list — a different density, avatar-forward layout, and load-more traversal than Table&apos;s dense sortable grid.
        </p>
      </InfoBox>
      <InfoBox>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
          Don&apos;t use Table for: Connections
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          Webhook/email/phone management is <code style={code}>ConnectionCard</code> — a small fixed set of richly-detailed cards, not a row-per-record grid.
        </p>
      </InfoBox>
      <InfoBox>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
          Don&apos;t use Table for: Analytics
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          Every Analytics metric is a <code style={code}>Chart</code> visualisation, never a row-per-record grid.
        </p>
      </InfoBox>
      <InfoBox>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
          The 768px flip
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          The SAME table DOM restyles into a card stack below md (768px) via CSS alone — never a markup swap to a list. See the Responsive section above.
        </p>
      </InfoBox>
      <InfoBox>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
          Selection is desktop-only
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          The checkbox column and the floating batch bar are both fully suppressed below md — there is no mobile bulk-select pattern in this component.
        </p>
      </InfoBox>
      <InfoBox>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
          Status via Badge, never a coloured row
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          A row or record error is conveyed by a status-column Badge cell — Table has no error-row fill, the same locked status-pattern rule every status component in this system follows.
        </p>
      </InfoBox>
    </div>

    <Divider />

    {/* ── 9. Reference table ────────────────────────────────────────────────── */}
    <SectionHead
      title="Reference table"
      description="Every prop accepted by Table, plus the exported cell renderers."
    />
    <div style={{ marginBottom: '24px' }}>
      <BlockLabel>Table props</BlockLabel>
      <PropsTable rows={PROPS} columns={['PROP', 'TYPE', 'DEFAULT', 'DESCRIPTION']} />
    </div>
    <div style={{ marginBottom: '40px' }}>
      <BlockLabel>Cell renderers</BlockLabel>
      <PropsTable rows={CELL_RENDERERS} columns={['RENDERER', 'DESCRIPTION']} />
    </div>

    <Divider />

    {/* ── 10. Do / Don't ─────────────────────────────────────────────────────── */}
    <SectionHead title="Do / Don't" />
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px',
      marginBottom: '40px',
    }}>
      <InfoBox style={{ borderColor: 'var(--color-status-success-text)' }}>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-status-success-text)', marginBottom: '16px' }}>
          Do — a two-line primary cell for identity
        </div>
        <Table
          ariaLabel="Do example"
          columns={[{ key: 'name', header: 'Business', isPrimary: true, cell: (row) => <PrimaryCell avatarProps={{ name: row.name }} primary={row.name} meta={row.email} /> }]}
          data={[{ name: 'Rivera Plumbing & Drain', email: 'owner@riveraplumbing.com' }]}
          getRowId={(row) => row.name}
        />
      </InfoBox>
      <InfoBox style={{ borderColor: 'var(--color-status-error-text)' }}>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-status-error-text)', marginBottom: '16px' }}>
          Don&apos;t — cram identity + meta into one truncated line
        </div>
        <Table
          ariaLabel="Don't example"
          columns={[{ key: 'name', header: 'Business', isPrimary: true, cell: (row) => <TextCell value={`${row.name} — ${row.email}`} /> }]}
          data={[{ name: 'Rivera Plumbing & Drain', email: 'owner@riveraplumbing.com' }]}
          getRowId={(row) => row.name}
        />
      </InfoBox>
      <InfoBox style={{ borderColor: 'var(--color-status-success-text)' }}>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-status-success-text)', marginBottom: '16px' }}>
          Do — a status Badge cell
        </div>
        <Table
          ariaLabel="Do example"
          columns={[{ key: 'name', header: 'Business', isPrimary: true }, { key: 'status', header: 'Status', cell: () => <BadgeCell tone="error" icon="XCircle">Failing</BadgeCell> }]}
          data={[{ name: 'Ironclad Electric' }]}
          getRowId={(row) => row.name}
        />
      </InfoBox>
      <InfoBox style={{ borderColor: 'var(--color-status-error-text)' }}>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-status-error-text)', marginBottom: '16px' }}>
          Don&apos;t — red-fill an error row
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          Table has no error-row fill on purpose — colour is never the sole conveyor of status (WCAG 1.4.1). Use the status-column Badge instead of colouring the whole row.
        </p>
      </InfoBox>
      <InfoBox style={{ borderColor: 'var(--color-status-success-text)' }}>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-status-success-text)', marginBottom: '16px' }}>
          Do — let it become a card stack on mobile
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          Below 768px the same Table restyles into readable, tappable cards automatically — no extra work at the call site.
        </p>
      </InfoBox>
      <InfoBox style={{ borderColor: 'var(--color-status-error-text)' }}>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-status-error-text)', marginBottom: '16px' }}>
          Don&apos;t — horizontal-scroll a table on a phone
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          Don&apos;t wrap Table in a horizontal-scroll container to force the desktop layout on mobile — the built-in card stack is the accessible, tap-friendly answer.
        </p>
      </InfoBox>
    </div>

  </StoryFrame>
);
