'use client';

import React, { useState, useRef, useEffect, useId, useMemo, useImperativeHandle } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@/design-system/icons/Icon.jsx';
import { IconButton } from '@/components/ui/IconButton/IconButton.jsx';
import { Select } from '@/components/ui/Select/Select.jsx';
import { ChevronLeft, ChevronRight, X } from '@/design-system/icons/index.js';
import { cn } from '@/lib/utils';

// DateTimePicker is ONE approved component providing THREE variants:
//   - date-range  — Leads inbox date-range filter (bottom sheet on mobile, centered
//                   modal dialog on desktop — see the 2026-07-05 fix-pass entry in
//                   DECISIONS.md, which supersedes the original anchored-popover build)
//   - time        — Settings → Notifications daily digest time (composes <Select> directly)
//   - time-range  — Settings → Notifications quiet hours (two <Select> instances, From/To)
//
// TWO variants are deliberately NOT built here (see DECISIONS.md 2026-07-05):
//   - single-date: no v1 screen selects one bare calendar date. Re-derivable from
//     date-range as start === end if a future screen needs it — cutting it removes
//     real state surface for zero current consumer.
//   - combined datetime: no consumer, and per IBM Carbon's own community issue
//     #10186, side-by-side date+time pickers read as overbearing with a visual
//     disconnect. No Quicklo screen needs date and time together in v1.
//
// Zero new colour tokens. Every token used here was already audited for
// Input/Select/Checkbox/Toggle — see the Component sizing reference in CLAUDE.md.
//
// NOTE ON Modal: the desktop overlay below (scrim + centered dialog + focus trap)
// is a local implementation — src/components/ui/Modal/ does not exist yet, even
// though Modal is on the Approved Components list. Once Modal is built, this local
// scrim/dialog/focus-trap should be migrated to compose Modal directly rather than
// maintaining a parallel implementation. Flagged here, not silently forked.

// ─────────────────────────────────────────────────────────────────────────────
// DATE HELPERS — no date library in this project; native Date only.
// ─────────────────────────────────────────────────────────────────────────────

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const MONTH_ABBR = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];
const WEEKDAY_ABBR = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}
function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}
function addMonths(date, n) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + n);
  return d;
}
function isSameDay(a, b) {
  return !!a && !!b
    && a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
}
function isBefore(a, b) {
  return startOfDay(a).getTime() < startOfDay(b).getTime();
}
function isAfter(a, b) {
  return startOfDay(a).getTime() > startOfDay(b).getTime();
}
function formatShort(d) {
  return `${MONTH_ABBR[d.getMonth()]} ${d.getDate()}`;
}
function formatRangeDisplay(start, end) {
  if (!start) return null;
  if (!end || isSameDay(start, end)) return formatShort(start);
  return `${formatShort(start)} – ${formatShort(end)}`;
}
function toISODate(d) {
  if (!d) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
function fromISODate(s) {
  if (!s) return null;
  const [y, m, d] = s.split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}
function isoOf(d) {
  return d ? toISODate(d) : '';
}

// 42-cell (6-week) grid for the month containing viewDate, starting on Sunday.
function getMonthGrid(viewDate) {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const gridStart = addDays(firstOfMonth, -firstOfMonth.getDay());
  return Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
}

function getPresetRange(preset) {
  const today = startOfDay(new Date());
  if (preset === 'today') return { start: today, end: today };
  if (preset === 'last7') return { start: addDays(today, -6), end: today };
  if (preset === 'last30') return { start: addDays(today, -29), end: today };
  return null;
}

// "Custom range" removed (2026-07-05 fix pass) — the calendar is now always
// visible alongside these three, so a row that only "revealed" it had no
// remaining behaviour. See DECISIONS.md.
const PRESETS = [
  { key: 'today', label: 'Today' },
  { key: 'last7', label: 'Last 7 days' },
  { key: 'last30', label: 'Last 30 days' },
];

// ─────────────────────────────────────────────────────────────────────────────
// TIME HELPERS — 30-min increments, 12h + AM/PM label, stored as 24h "HH:mm".
// ─────────────────────────────────────────────────────────────────────────────

function buildTimeOptions() {
  const options = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const value = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      const period = h < 12 ? 'AM' : 'PM';
      let hour12 = h % 12;
      if (hour12 === 0) hour12 = 12;
      const label = `${hour12}:${String(m).padStart(2, '0')} ${period}`;
      options.push({ label, value });
    }
  }
  return options;
}
// Computed once at module load — 48 options, deterministic, no per-render cost.
const TIME_OPTIONS = buildTimeOptions();

function formatTime12(value) {
  if (!value) return '';
  const [hStr, mStr] = value.split(':');
  const h = Number(hStr);
  const period = h < 12 ? 'AM' : 'PM';
  let hour12 = h % 12;
  if (hour12 === 0) hour12 = 12;
  return `${hour12}:${mStr} ${period}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// RESPONSIVE HOOK — bottom sheet (mobile) vs centered modal dialog (desktop) at
// --breakpoint-sm (600px).
// Defaults to false (mobile-first) so first paint favours the mobile layout before
// the media query resolves on mount; this is a brief, harmless flash, not a
// hydration-correctness issue, since neither layout renders server-side content
// a user could act on before JS attaches.
// ─────────────────────────────────────────────────────────────────────────────

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 600px)');
    const handler = () => setIsDesktop(mql.matches);
    handler();
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);
  return isDesktop;
}

// Shared focusable-element query for the simple Tab-wrap focus trap below.
const FOCUSABLE_SELECTOR = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Reads a --duration-* custom property's actual computed value in ms, so the
// JS-side exit delay (close() below needs to know how long to wait before
// unmounting) always matches whatever globals.css defines — including its
// global `prefers-reduced-motion` override, which collapses every
// --duration-* to 0ms. Reading the live computed value here means that
// override is honoured automatically, with no separate matchMedia check to
// keep in sync.
function getDurationMs(varName, fallback) {
  if (typeof window === 'undefined') return fallback;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  const match = /^([\d.]+)ms$/.exec(raw);
  return match ? Number(match[1]) : fallback;
}

// ─────────────────────────────────────────────────────────────────────────────
// SHARED LABEL / TEXT STYLES — mirrors Input/Select's label + line-box-inflation fix
// ─────────────────────────────────────────────────────────────────────────────

const labelStyle = {
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--text-body-md)',
  fontWeight: 500,
  lineHeight: '1.25rem',
  color: 'var(--color-text-primary)',
};

const hintStyle = {
  margin: 0,
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--text-body-sm)',
  fontWeight: 400,
  lineHeight: '1rem',
  color: 'var(--color-text-secondary)',
};

// ═════════════════════════════════════════════════════════════════════════════
// TimePicker — variant "time". A single <Select>, nothing reimplemented.
// Inherits every Select state (default/hover/focus/error/disabled/placeholder-vs-
// filled) wholesale — do not invent a parallel state system.
// ═════════════════════════════════════════════════════════════════════════════

export const TimePicker = React.forwardRef(function TimePicker(props, ref) {
  return <Select ref={ref} options={TIME_OPTIONS} {...props} />;
});

// ═════════════════════════════════════════════════════════════════════════════
// TimeRangePicker — variant "time-range". Two TimePicker Selects, From/To.
// Overnight ranges (end < start, e.g. quiet hours "10pm to 7am") are VALID and
// are the primary v1 use case — never validated as an error.
// ═════════════════════════════════════════════════════════════════════════════

export const TimeRangePicker = React.forwardRef(function TimeRangePicker(
  {
    label,
    hideLabel = false,
    value = { from: '', to: '' },
    onChange,
    size = 'md',
    disabled = false,
    error,
    errorField, // 'from' | 'to' — Carbon rule: mark only the offending Select, never both
    helperText,
    required = false,
    className,
    ...rest
  },
  ref
) {
  const autoId = useId();
  const groupLabelId = `${autoId}-group-label`;

  if (process.env.NODE_ENV !== 'production' && hideLabel && !rest['aria-label']) {
    console.warn(
      `[TimeRangePicker] hideLabel=true requires an explicit aria-label prop for accessibility.`
    );
  }

  const handleFromChange = (e) => onChange?.({ ...value, from: e.target.value });
  const handleToChange = (e) => onChange?.({ ...value, to: e.target.value });

  // String comparison on zero-padded "HH:mm" is chronologically correct within a day.
  const isOvernight = Boolean(value.from) && Boolean(value.to) && value.to < value.from;

  return (
    <div
      ref={ref}
      role="group"
      aria-labelledby={label && !hideLabel ? groupLabelId : undefined}
      aria-label={hideLabel ? rest['aria-label'] : undefined}
      className={cn('flex flex-col w-full', className)}
      style={{ gap: 'var(--space-2)' }}
    >
      {label && (
        <span id={groupLabelId} className={cn(hideLabel && 'sr-only')} style={labelStyle}>
          {label}
          {required && (
            <span aria-hidden="true" style={{ color: 'var(--color-status-error)', marginLeft: 'var(--space-px)' }}>
              *
            </span>
          )}
        </span>
      )}

      <div className="flex w-full" style={{ gap: 'var(--space-3)' }}>
        <TimePicker
          label="From"
          size={size}
          disabled={disabled}
          value={value.from}
          onChange={handleFromChange}
          error={errorField === 'from' ? error : undefined}
          className="flex-1"
        />
        <TimePicker
          label="To"
          size={size}
          disabled={disabled}
          value={value.to}
          onChange={handleToChange}
          error={errorField === 'to' ? error : undefined}
          className="flex-1"
        />
      </div>

      {isOvernight ? (
        <p style={hintStyle}>
          {`Overnight — ${formatTime12(value.from)} to ${formatTime12(value.to)} next day`}
        </p>
      ) : (
        helperText && <p style={hintStyle}>{helperText}</p>
      )}
    </div>
  );
});

// ═════════════════════════════════════════════════════════════════════════════
// ManualDateField — native <input type="date">, used by the From/To manual-entry
// row below.
//
// Fix 4 (2026-07-05), root cause: the field used to be a tightly CONTROLLED
// input driven straight from parsed Date state. Native date inputs report ''
// via `.value` for any incomplete segmented entry (per spec, `.value` is only
// ever a complete valid date or empty string) — so every keystroke while
// typing, say, a year produced an onChange with '', which the old code parsed
// (fromISODate('') → null) and pushed all the way up to the parent, which then
// handed the SAME '' straight back down as the controlled `value`. Forcing the
// DOM's `value` property to '' *during* the browser's own in-progress segmented
// edit is exactly the "apply a mask while typing" mistake MD3 warns against,
// and is what corrupted the browser's internal per-segment editing state,
// producing the "types 2025, lands on 1901" symptom.
//
// Fix: the input is genuinely UNCONTROLLED (`defaultValue`, a ref) while the
// user is typing — nothing writes to it in response to its own onChange. It is
// only ever synced imperatively FROM an external change (calendar tap, preset,
// the other field), via an effect keyed on that external value, so it never
// touches the DOM mid-keystroke. onChange only propagates upward — and thus
// only ever reaches the calendar/trigger — when the browser reports a
// COMPLETE, valid "YYYY-MM-DD". A momentary '' while typing is not treated as
// "the user cleared this field"; only a still-empty value on blur is (blur
// means editing is done, so an empty field at that point is an intentional
// clear, not a typing artifact).
// ═════════════════════════════════════════════════════════════════════════════

function ManualDateField({ label: fieldLabel, value, max, onCommit }) {
  const inputRef = useRef(null);
  const externalIso = isoOf(value);

  useEffect(() => {
    if (inputRef.current && inputRef.current.value !== externalIso) {
      inputRef.current.value = externalIso;
    }
  }, [externalIso]);

  const handleChange = (e) => {
    const raw = e.target.value;
    if (!ISO_DATE_RE.test(raw)) return; // incomplete mid-entry — leave it alone, don't propagate
    if (max && raw > max) {
      // Future date fully typed — reject on commit (not per-keystroke) and
      // revert the display, rather than leaving an accepted-looking future
      // date sitting in the field out of sync with the actual selection.
      e.target.value = externalIso;
      return;
    }
    onCommit(fromISODate(raw));
  };

  const handleBlur = (e) => {
    if (e.target.value === '') onCommit(null); // done editing + empty = intentional clear
  };

  return (
    <label className="flex flex-col flex-1" style={{ gap: 'var(--space-2)' }}>
      <span style={labelStyle}>{fieldLabel}</span>
      <input
        ref={inputRef}
        type="date"
        defaultValue={externalIso}
        max={max}
        onChange={handleChange}
        onBlur={handleBlur}
        className={cn(
          'w-full rounded-sm bg-(--color-bg-input) border border-(--color-border-default) outline-none',
          // Native <input type="date"> popup theming — identical mechanism to
          // Select's fix pass: color-scheme is a rendering-mode hint, not a
          // colour value, keyed off the same .dark class via the
          // @custom-variant dark rule already added to globals.css during the
          // Select fix pass. Verified present — not re-added here.
          'scheme-light dark:scheme-dark',
        )}
        style={{
          height: '40px', padding: '0 var(--space-4)',
          fontFamily: 'var(--font-body)', fontSize: 'var(--text-body-lg)', lineHeight: '1rem',
          color: 'var(--color-text-primary)',
        }}
      />
    </label>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// DateRangePicker — variant "date-range". The trigger is a <button>; the overlay
// opens on click, NEVER on focus of a text field — this is the exact Atlassian
// screen-reader failure mode (auto-open-on-focus) we are avoiding.
// ═════════════════════════════════════════════════════════════════════════════

export const DateRangePicker = React.forwardRef(function DateRangePicker(
  {
    label,
    hideLabel = false,
    value = { start: null, end: null },
    onChange,
    placeholder = 'All dates',
    size = 'md',
    disabled = false,
    id: idProp,
    className,
    ...rest
  },
  ref
) {
  const autoId = useId();
  const id = idProp ?? autoId;

  if (process.env.NODE_ENV !== 'production' && hideLabel && !rest['aria-label']) {
    console.warn(
      `[DateRangePicker] id="${id}": hideLabel=true requires an explicit aria-label prop for accessibility.`
    );
  }

  const buttonRef = useRef(null);
  useImperativeHandle(ref, () => buttonRef.current);
  const overlayRef = useRef(null);
  const dayButtonRefs = useRef(new Map());

  const isDesktop = useIsDesktop();
  const [open, setOpen] = useState(false);
  // entered/closing drive the enter/exit transition: entered flips true one
  // frame after mount (so the initial "closed" transform/opacity is what
  // actually paints first, giving the browser something to transition FROM);
  // closing flips true immediately on close() and holds the dialog mounted
  // for one --duration-slow while it visually exits, matching --ease-exit.
  const [entered, setEntered] = useState(false);
  const [closing, setClosing] = useState(false);
  const [viewMonth, setViewMonth] = useState(startOfDay(value.start || new Date()));
  const [activeDate, setActiveDate] = useState(startOfDay(value.start || new Date()));
  const [announce, setAnnounce] = useState('');

  const hasValue = Boolean(value.start);
  const displayText = hasValue ? formatRangeDisplay(value.start, value.end) : placeholder;

  const close = (returnFocus = true) => {
    setClosing(true);
    window.setTimeout(() => {
      setOpen(false);
      setClosing(false);
      setEntered(false);
      if (returnFocus) buttonRef.current?.focus();
    }, getDurationMs('--duration-slow', 300));
  };

  const openOverlay = () => {
    setViewMonth(startOfDay(value.start || new Date()));
    setActiveDate(startOfDay(value.start || new Date()));
    setEntered(false);
    setClosing(false);
    setOpen(true);
  };

  // Triggers the enter transition one frame after the "closed" starting
  // state has painted.
  useEffect(() => {
    if (!open) return;
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, [open]);

  // Focus management: on open, move focus to the active day cell — the calendar
  // is always visible now (Fix 3), so it's always a valid, present focus target
  // on both mobile and desktop. On close via any path, focus already returned
  // to the trigger inside close() above.
  useEffect(() => {
    if (!open) return;
    dayButtonRefs.current.get(isoOf(activeDate))?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Focus the newly active day cell whenever keyboard navigation moves it.
  useEffect(() => {
    if (!open) return;
    dayButtonRefs.current.get(isoOf(activeDate))?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDate]);

  const applyRange = (start, end) => {
    onChange?.({ start, end });
    setAnnounce(
      end && !isSameDay(start, end)
        ? `Selected ${formatShort(start)} to ${formatShort(end)}`
        : `Selected ${formatShort(start)}`
    );
  };

  const handlePresetClick = (key) => {
    const range = getPresetRange(key);
    applyRange(range.start, range.end);
    close();
  };

  const handleDayClick = (day) => {
    if (isAfter(day, startOfDay(new Date()))) return; // future dates disabled
    setActiveDate(day);
    const complete = value.start && value.end;
    if (!value.start || complete) {
      onChange?.({ start: day, end: null });
      return;
    }
    // Second tap — order chronologically regardless of click order, then
    // auto-apply and close (Polaris: no Apply button for a simple range).
    const start = isBefore(day, value.start) ? day : value.start;
    const end = isBefore(day, value.start) ? value.start : day;
    applyRange(start, end);
    close();
  };

  // Fix 4: manual From/To commits arrive here already validated as complete
  // dates (or null) by ManualDateField — no per-keystroke parsing happens here.
  const handleManualCommit = (field, parsed) => {
    if (parsed && isAfter(parsed, startOfDay(new Date()))) return; // never commit a future date
    const next = { ...value, [field]: parsed };
    if (next.start && next.end && isAfter(next.start, next.end)) {
      // Keep chronological order if manual entry crosses the other bound.
      [next.start, next.end] = [next.end, next.start];
    }
    onChange?.(next);
    if (parsed) setViewMonth(startOfDay(parsed));
  };

  // ── Keyboard navigation inside the calendar grid ────────────────────────
  // Moves activeDate and, in the same event handler (not a derived effect),
  // brings viewMonth along if the move crossed a month boundary.
  const moveActiveDate = (next) => {
    setActiveDate(next);
    if (next.getMonth() !== viewMonth.getMonth() || next.getFullYear() !== viewMonth.getFullYear()) {
      setViewMonth(startOfDay(next));
    }
  };

  const handleGridKeyDown = (e) => {
    const moves = {
      ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7,
    };
    if (e.key in moves) {
      e.preventDefault();
      moveActiveDate(addDays(activeDate, moves[e.key]));
      return;
    }
    if (e.key === 'Home') {
      e.preventDefault();
      moveActiveDate(addDays(activeDate, -activeDate.getDay()));
      return;
    }
    if (e.key === 'End') {
      e.preventDefault();
      moveActiveDate(addDays(activeDate, 6 - activeDate.getDay()));
      return;
    }
    if (e.key === 'PageUp') {
      e.preventDefault();
      moveActiveDate(addMonths(activeDate, e.shiftKey ? -12 : -1));
      return;
    }
    if (e.key === 'PageDown') {
      e.preventDefault();
      moveActiveDate(addMonths(activeDate, e.shiftKey ? 12 : 1));
      return;
    }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleDayClick(activeDate);
    }
  };

  // ── Overlay-level Escape + simple Tab-wrap focus trap ───────────────────
  // Escape / scrim click / the header's close button all just close — there is
  // no separate "cancel a pending change" behaviour to reconcile, because
  // nothing in this dialog is held as an uncommitted draft: presets, calendar
  // taps, and manual-entry commits all call onChange immediately, the same way
  // Select/Input never buffer an uncommitted value either. See DECISIONS.md
  // Fix 3 for why no Apply/Cancel footer was added.
  const handleOverlayKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
      return;
    }
    if (e.key !== 'Tab' || !overlayRef.current) return;
    const focusables = Array.from(overlayRef.current.querySelectorAll(FOCUSABLE_SELECTOR));
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const triggerClasses = cn(
    'relative flex items-center w-full rounded-sm bg-(--color-bg-input) text-left',
    'border border-(--color-border-default)',
    // Fix 1 (2026-07-05): the trigger is a leaf focusable <button> (no inner
    // control to be "within"), so :focus-within here is equivalent to :focus —
    // and critically, unlike :focus-visible, it matches regardless of whether
    // focus came from a mouse click or the keyboard. The previous code used
    // focus-visible:border(...), which Chromium suppresses for mouse-clicked
    // buttons — clicking the trigger (the primary way to open it) produced no
    // border change at all, only Tab-focusing it did. Switching to
    // :focus-within, and suppressing the default outline unconditionally
    // (matching Input's own native <input> treatment, not scoped to
    // focus-visible), fixes this for both input modalities consistently.
    !disabled && '[@media(hover:hover)]:[&:hover:not(:focus-within)]:border-(--color-border-strong)',
    'focus-within:border-(--color-focus-ring) outline-none',
    disabled && 'opacity-(--opacity-disabled) pointer-events-none',
    size === 'md' && [
      "before:content-[''] before:absolute before:top-1/2 before:left-1/2",
      'before:-translate-x-1/2 before:-translate-y-1/2',
      'before:min-w-11 before:min-h-11',
      'lg:before:min-w-0 lg:before:min-h-0',
    ],
  );

  const monthLabel = `${MONTH_NAMES[viewMonth.getMonth()]} ${viewMonth.getFullYear()}`;
  const monthGrid = useMemo(() => getMonthGrid(viewMonth), [viewMonth]);
  const today = startOfDay(new Date());

  const dayCellStyle = {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body-md)',
    fontWeight: 400,
    lineHeight: '1rem',
  };

  // ── Calendar block — always visible now (Fix 3), mobile and desktop alike ──
  const calendarBlock = (
    <div>
      <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-3)' }}>
        <IconButton
          icon={ChevronLeft}
          variant="ghost"
          size="sm"
          aria-label="Previous month"
          onClick={() => setViewMonth((m) => addMonths(m, -1))}
        />
        <span
          style={{
            fontFamily: 'var(--font-body)', fontSize: '1rem', fontWeight: 600,
            lineHeight: '1.5rem', color: 'var(--color-text-primary)',
          }}
        >
          {monthLabel}
        </span>
        <IconButton
          icon={ChevronRight}
          variant="ghost"
          size="sm"
          aria-label="Next month"
          onClick={() => setViewMonth((m) => addMonths(m, 1))}
        />
      </div>

      <div
        role="grid"
        aria-label={monthLabel}
        onKeyDown={handleGridKeyDown}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 40px)', gap: 'var(--space-1)' }}
      >
        {WEEKDAY_ABBR.map((wd) => (
          <div
            key={wd}
            role="columnheader"
            style={{
              width: '40px', textAlign: 'center', fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-body-sm)', lineHeight: '1rem', color: 'var(--color-text-secondary)',
            }}
          >
            {wd}
          </div>
        ))}
        {monthGrid.map((day) => {
          const iso = isoOf(day);
          const isFuture = isAfter(day, today);
          const isToday = isSameDay(day, today);
          const isStart = value.start && isSameDay(day, value.start);
          const isEnd = value.end && isSameDay(day, value.end);
          const isSelected = isStart || isEnd;
          const isInRange = value.start && value.end && isAfter(day, value.start) && isBefore(day, value.end);
          const isOutsideMonth = day.getMonth() !== viewMonth.getMonth();
          const isActive = isSameDay(day, activeDate);

          return (
            <button
              key={iso}
              ref={(node) => {
                if (node) dayButtonRefs.current.set(iso, node);
                else dayButtonRefs.current.delete(iso);
              }}
              type="button"
              role="gridcell"
              tabIndex={isActive ? 0 : -1}
              aria-selected={isSelected || undefined}
              aria-disabled={isFuture || undefined}
              aria-current={isToday ? 'date' : undefined}
              disabled={isFuture}
              onClick={() => handleDayClick(day)}
              className={cn(
                'relative flex items-center justify-center rounded-sm',
                "before:content-[''] before:absolute before:top-1/2 before:left-1/2",
                'before:-translate-x-1/2 before:-translate-y-1/2',
                'before:min-w-11 before:min-h-11',
                !isFuture && !isSelected && '[@media(hover:hover)]:hover:bg-(--color-bg-secondary)',
              )}
              style={{
                width: '40px', height: '40px',
                cursor: isFuture ? 'not-allowed' : 'pointer',
                background: isSelected
                  ? 'var(--color-interactive-default)'
                  : isInRange
                    ? 'var(--color-brand-tint)'
                    : 'transparent',
                border: isToday && !isSelected ? '1px solid var(--color-border-strong)' : '1px solid transparent',
                opacity: isFuture ? 'var(--opacity-disabled)' : 1,
              }}
            >
              <span
                style={{
                  ...dayCellStyle,
                  color: isSelected
                    ? 'var(--color-text-on-interactive-primary)'
                    : isOutsideMonth
                      ? 'var(--color-text-secondary)'
                      : 'var(--color-text-primary)',
                }}
              >
                {day.getDate()}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );

  // ── Manual-entry row: native <input type="date"> — the accessible path ──
  const manualEntryRow = (
    <div className="flex w-full" style={{ gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
      <ManualDateField
        label="From"
        value={value.start}
        max={toISODate(today)}
        onCommit={(parsed) => handleManualCommit('start', parsed)}
      />
      <ManualDateField
        label="To"
        value={value.end}
        max={toISODate(today)}
        onCommit={(parsed) => handleManualCommit('end', parsed)}
      />
    </div>
  );

  // Presets perform an action and close the overlay — menu semantics, not a
  // persisted-selection listbox (no aria-selected to maintain).
  const presetList = (
    <div role="menu" aria-label="Date presets">
      {PRESETS.map((preset) => (
        <button
          key={preset.key}
          type="button"
          role="menuitem"
          onClick={() => handlePresetClick(preset.key)}
          className="w-full flex items-center [@media(hover:hover)]:hover:bg-(--color-bg-secondary)"
          style={{
            height: '44px', padding: '0 var(--space-4)', textAlign: 'left',
            fontFamily: 'var(--font-body)', fontSize: 'var(--text-body-lg)', lineHeight: '1.5rem',
            color: 'var(--color-text-primary)', cursor: 'pointer',
          }}
        >
          {preset.label}
        </button>
      ))}
    </div>
  );

  const trigger = (
    <button
      ref={buttonRef}
      type="button"
      id={id}
      disabled={disabled}
      aria-haspopup="dialog"
      aria-expanded={open}
      onClick={() => (open ? close() : openOverlay())}
      className={triggerClasses}
      style={{
        height: size === 'lg' ? '48px' : '40px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'border-color var(--duration-base) var(--ease-default)',
      }}
      {...rest}
    >
      <span
        style={{
          ...dayCellStyle,
          fontSize: 'var(--text-body-lg)', lineHeight: '1rem',
          paddingLeft: 'var(--space-4)', paddingRight: '44px',
          color: hasValue ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block', width: '100%',
        }}
      >
        {displayText}
      </span>
      <span
        aria-hidden="true"
        className="absolute pointer-events-none flex items-center"
        style={{ right: 'var(--space-4)', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }}
      >
        <Icon name="Calendar" size="md" />
      </span>
    </button>
  );

  if (!open) {
    return (
      <div className={cn('flex flex-col w-full', className)} style={{ gap: 'var(--space-2)' }}>
        {label && (
          <span className={cn(hideLabel && 'sr-only')} style={labelStyle}>{label}</span>
        )}
        {trigger}
      </div>
    );
  }

  // ── OPEN — Fix 2: one scrim, always blocking, always focus-trapped.
  // Desktop centers the dialog in it (flex align-items:center); mobile pins the
  // sheet to the bottom (flex align-items:flex-end). No anchored-popover
  // position math, no scroll-follow, no resize listener — the previous
  // anchored-popover implementation is gone (see DECISIONS.md Fix 2).
  //
  // Motion: entered && !closing is the "settled open" state; the visible
  // transition is between that and each side's own resting-closed transform
  // (slide up from the bottom on mobile, scale+fade on desktop) — in on
  // --duration-slow/--ease-enter, out on the same duration with --ease-exit.
  // Never --ease-spring (reserved for Toggle/Checkbox/status dots). ──
  const isSettled = entered && !closing;
  const overlayContent = (
    <div
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
      style={{
        position: 'fixed', inset: 0, zIndex: 8999,
        background: 'var(--color-bg-overlay)',
        opacity: isSettled ? 1 : 0,
        transition: `opacity var(--duration-slow) ${closing ? 'var(--ease-exit)' : 'var(--ease-enter)'}`,
        display: 'flex',
        alignItems: isDesktop ? 'center' : 'flex-end',
        justifyContent: 'center',
      }}
    >
      <div
        ref={overlayRef}
        role="dialog"
        aria-modal="true"
        aria-label={label || 'Filter by date'}
        onKeyDown={handleOverlayKeyDown}
        onMouseDown={(e) => e.stopPropagation()}
        className="flex flex-col"
        style={
          isDesktop
            ? {
                background: 'var(--color-bg-surface)',
                borderRadius: 'var(--radius-xl)',
                boxShadow: 'var(--elevation-3)',
                width: '90vw', maxWidth: '560px', maxHeight: '85vh', overflowY: 'auto',
                opacity: isSettled ? 1 : 0,
                transform: isSettled ? 'scale(1)' : 'scale(0.96)',
                transition: `opacity var(--duration-slow) ${closing ? 'var(--ease-exit)' : 'var(--ease-enter)'}, transform var(--duration-slow) ${closing ? 'var(--ease-exit)' : 'var(--ease-enter)'}`,
              }
            : {
                width: '100%',
                background: 'var(--color-bg-surface)',
                borderTopLeftRadius: 'var(--radius-2xl)', borderTopRightRadius: 'var(--radius-2xl)',
                boxShadow: 'var(--elevation-3)',
                maxHeight: '85vh', overflowY: 'auto',
                transform: isSettled ? 'translateY(0)' : 'translateY(100%)',
                transition: `transform var(--duration-slow) ${closing ? 'var(--ease-exit)' : 'var(--ease-enter)'}`,
              }
        }
      >
        <div className="flex items-center justify-between" style={{ height: '48px', padding: '0 var(--space-4)' }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', fontWeight: 600, lineHeight: '1.5rem', color: 'var(--color-text-primary)' }}>
            {label || 'Filter by date'}
          </span>
          <IconButton icon={X} variant="ghost" size="sm" aria-label="Close" onClick={() => close()} />
        </div>

        <div style={{ padding: isDesktop ? '0 24px 24px' : '0 var(--space-4) var(--space-4)' }}>
          {isDesktop ? (
            <div className="flex" style={{ gap: '24px' }}>
              <div style={{ minWidth: '160px' }}>{presetList}</div>
              <div>
                {calendarBlock}
                {manualEntryRow}
              </div>
            </div>
          ) : (
            <>
              {presetList}
              <div style={{ marginTop: 'var(--space-4)' }}>{calendarBlock}</div>
              {manualEntryRow}
            </>
          )}
        </div>

        <div aria-live="polite" className="sr-only">{announce}</div>
      </div>
    </div>
  );

  return (
    <div className={cn('flex flex-col w-full', className)} style={{ gap: 'var(--space-2)' }}>
      {label && (
        <span className={cn(hideLabel && 'sr-only')} style={labelStyle}>{label}</span>
      )}
      {trigger}

      {typeof document !== 'undefined' && createPortal(overlayContent, document.body)}
    </div>
  );
});

// ═════════════════════════════════════════════════════════════════════════════
// DateTimePicker — the variant router. Consumers may import this and pass
// variant='date-range' | 'time' | 'time-range', or import the named variant
// components directly.
// ═════════════════════════════════════════════════════════════════════════════

export const DateTimePicker = React.forwardRef(function DateTimePicker({ variant = 'date-range', ...props }, ref) {
  if (variant === 'time') return <TimePicker ref={ref} {...props} />;
  if (variant === 'time-range') return <TimeRangePicker ref={ref} {...props} />;
  return <DateRangePicker ref={ref} {...props} />;
});

// Excluded states, with reasons:
// - No loading state on the date-range trigger: selection is synchronous; a lead
//   list that re-fetches renders a Skeleton in its own place, not inside the picker.
// - No error on the date-range trigger: a list filter cannot be "invalid".
// - No read-only state: no consumer needs it in v1.
// - No valid/success state: no Quicklo screen has a per-field success-confirmation
//   pattern (same call as Input/Select/Checkbox/Toggle).
