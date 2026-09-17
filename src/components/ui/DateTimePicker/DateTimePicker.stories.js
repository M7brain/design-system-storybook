import React, { useState, useEffect } from 'react';
import { DateRangePicker, TimePicker, TimeRangePicker } from './DateTimePicker.jsx';

// ─────────────────────────────────────────────────────────────────────────────
// META
// ─────────────────────────────────────────────────────────────────────────────

export default {
  title: 'Components/DateTimePicker',
  parameters: {
    layout: 'fullscreen',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function StoryFrame({ children }) {
  const [isDark, setIsDark] = useState(false);

  // The date-range overlay (scrim + sheet/popover) portals into document.body,
  // outside this wrapper's .dark class — sync it onto body so the portal
  // content receives dark-mode tokens too. Same technique as Select/Tooltip/
  // IconButton stories.
  useEffect(() => {
    document.body.classList.toggle('dark', isDark);
    return () => document.body.classList.remove('dark');
  }, [isDark]);

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

function Code({ children }) {
  return <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>{children}</code>;
}

// ─────────────────────────────────────────────────────────────────────────────
// INTERACTIVE WRAPPERS — every demo below is a live, controlled instance.
// ─────────────────────────────────────────────────────────────────────────────

function DateRangeDemo({ initialValue = { start: null, end: null }, ...props }) {
  const [value, setValue] = useState(initialValue);
  return <DateRangePicker value={value} onChange={setValue} {...props} />;
}

function TimeDemo({ initialValue = '', ...props }) {
  const [value, setValue] = useState(initialValue);
  return <TimePicker value={value} onChange={(e) => setValue(e.target.value)} {...props} />;
}

function TimeRangeDemo({ initialValue = { from: '', to: '' }, ...props }) {
  const [value, setValue] = useState(initialValue);
  return <TimeRangePicker value={value} onChange={setValue} {...props} />;
}

// Computed relative to whenever Storybook actually runs, so demos never show a
// stale hardcoded date or accidentally land in the future (which the calendar
// disables). "Today" here is the real system clock, not a fictional date.
function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
}

const LAST_7_DAYS_RANGE = { start: daysAgo(6), end: daysAgo(0) };
// Deliberately excludes today from the selected range, so the calendar's
// distinct "today" ring (unselected) is visible alongside selected/in-range/
// disabled-future days in the same opened month — see States section below.
const STATES_DEMO_RANGE = { start: daysAgo(10), end: daysAgo(3) };

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS — reference tables
// ─────────────────────────────────────────────────────────────────────────────

const PROPS = [
  {
    name: 'variant',
    type: "'date-range' | 'time' | 'time-range'",
    defaultVal: "'date-range'",
    description: "DateTimePicker router only. Dispatches to DateRangePicker, TimePicker, or TimeRangePicker. Import the named variant directly to skip the router.",
  },
  {
    name: 'label',
    type: 'string',
    defaultVal: '—',
    description: 'All variants. Visible label above the field (TimeRangePicker: group label above the From/To pair). Use hideLabel to visually hide it.',
  },
  {
    name: 'value (date-range)',
    type: '{ start: Date|null, end: Date|null }',
    defaultVal: '{ start: null, end: null }',
    description: 'DateRangePicker. Controlled. A complete range (both set) auto-applies and closes the overlay on the second calendar tap.',
  },
  {
    name: 'value (time)',
    type: 'string',
    defaultVal: 'undefined',
    description: 'TimePicker. Controlled, stored as 24h "HH:mm" (e.g. "20:00"), displayed as 12h + AM/PM in the option list.',
  },
  {
    name: 'value (time-range)',
    type: '{ from: string, to: string }',
    defaultVal: "{ from: '', to: '' }",
    description: 'TimeRangePicker. Both "HH:mm" 24h strings. to < from is treated as an overnight range, not an error.',
  },
  {
    name: 'onChange',
    type: '(value) => void',
    defaultVal: 'undefined',
    description: 'All variants. Receives the full updated value for that variant’s shape above.',
  },
  {
    name: 'placeholder',
    type: 'string',
    defaultVal: "'All dates' (date-range only)",
    description: 'DateRangePicker only. Shown in --color-text-tertiary when no range is selected.',
  },
  {
    name: 'size',
    type: "'md' | 'lg'",
    defaultVal: "'md'",
    description: 'All variants. md 40px / lg 48px, identical to Input/Select.',
  },
  {
    name: 'disabled',
    type: 'bool',
    defaultVal: 'false',
    description: 'All variants. --opacity-disabled (0.4) + native disabled/cursor: not-allowed.',
  },
  {
    name: 'error',
    type: 'string',
    defaultVal: 'undefined',
    description: 'time and time-range only (a date-range filter trigger has no error state). time-range also accepts errorField (\'from\'|\'to\') to mark only the offending Select.',
  },
  {
    name: 'helperText',
    type: 'string',
    defaultVal: 'undefined',
    description: 'time and time-range. Hidden on time-range while the overnight hint is showing — the hint takes precedence.',
  },
  {
    name: 'required',
    type: 'bool',
    defaultVal: 'false',
    description: 'date-range and time-range. Appends a red * after the label.',
  },
  {
    name: 'id',
    type: 'string',
    defaultVal: 'auto',
    description: 'All variants. Auto-generated with useId() when omitted.',
  },
  {
    name: 'hideLabel',
    type: 'bool',
    defaultVal: 'false',
    description: 'All variants. sr-only label; dev warning fires if aria-label is missing.',
  },
  {
    name: 'aria-label',
    type: 'string',
    defaultVal: 'undefined',
    description: 'Required whenever hideLabel is true.',
  },
];

const TOKENS = [
  { token: '--color-bg-input', value: '#f3f3f3 / #171717', usage: 'date-range trigger fill; native <input type="date"> fill' },
  { token: '--color-border-default', value: '#dddddd / #2a2a2a', usage: 'date-range trigger + manual-entry input resting border' },
  { token: '--color-border-strong', value: '#adadad / #555555', usage: 'Trigger hover border; unselected "today" day-cell ring' },
  { token: '--color-focus-ring', value: '→ #c2410c / → #fb923c', usage: 'Trigger focus-visible border — no box-shadow ring' },
  { token: '--color-text-tertiary', value: '#868686 (both modes)', usage: 'date-range placeholder ("All dates") — one step lighter than Select’s placeholder token' },
  { token: '--color-interactive-default', value: '#c2410c / #fb923c', usage: 'Selected start/end day-cell fill' },
  { token: '--color-text-on-interactive-primary', value: '#ffffff / #121212', usage: 'Selected start/end day-cell text' },
  { token: '--color-brand-tint', value: '#fff4ec / #262626', usage: 'In-range day-cell fill (paired with aria-selected, never colour-alone)' },
  { token: '--color-bg-surface', value: '#ffffff / #1e1e1e', usage: 'Sheet / dialog surface' },
  { token: '--color-bg-overlay', value: 'rgba(0,0,0,.4) / .6', usage: 'Scrim — both the mobile sheet and the desktop centered dialog now block behind the same scrim' },
  { token: '--radius-2xl', value: '24px', usage: 'Mobile bottom-sheet top corners' },
  { token: '--radius-xl', value: '20px', usage: 'Desktop dialog corners (modal radius — the desktop overlay is a centered dialog, not an anchored popover)' },
  { token: '--radius-sm', value: '8px', usage: 'Trigger, manual-entry input, day-cell corners' },
  { token: '--elevation-3', value: 'modal shadow', usage: 'Both the bottom sheet and the desktop dialog — same elevation, both are now blocking modal-class surfaces' },
  { token: '--duration-slow / --ease-enter', value: '300ms', usage: 'Sheet slide-up / dialog scale+fade-in on open' },
  { token: '--ease-exit', value: '—', usage: 'Sheet / dialog exit — same --duration-slow, reversed easing' },
  { token: '--duration-base', value: '200ms', usage: 'Trigger border-colour transition (hover, focus)' },
  { token: '--text-body-lg', value: '1rem', usage: 'Trigger text, manual-entry input text — iOS-zoom floor' },
  { token: '--text-body-md', value: '0.875rem', usage: 'Day-cell numerals' },
  { token: '--text-body-sm', value: '0.75rem', usage: 'Weekday header row; overnight hint text' },
];

// ─────────────────────────────────────────────────────────────────────────────
// STORY EXPORT
// ─────────────────────────────────────────────────────────────────────────────

export const Overview = () => (
  <StoryFrame>

    {/* ── Page header ──────────────────────────────────────────────────────── */}
    <div style={{ marginBottom: '48px' }}>
      <h1 style={{
        fontFamily: 'Outfit, sans-serif', fontSize: '1.75rem', fontWeight: 700,
        lineHeight: '2.25rem', letterSpacing: '-0.02em',
        color: 'var(--color-text-primary)', margin: '0 0 8px 0',
      }}>
        DateTimePicker
      </h1>
      <p style={{
        fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 400,
        lineHeight: '1.75rem', color: 'var(--color-text-secondary)', margin: 0,
      }}>
        One component, three variants: date-range (Leads inbox filter — bottom sheet on mobile, centered focus-trapped
        modal dialog on desktop), time (digest time — composes Select), and time-range (quiet hours — two time
        Selects, overnight-aware).
      </p>
    </div>

    {/* ── Gallery — date-range ─────────────────────────────────────────────── */}
    <SectionHead
      title="Gallery — date-range"
      description="Filter leads by date. Tab to a trigger to see the focus border, then click to open it — resize the Storybook viewport below 600px to see the mobile bottom sheet instead of the desktop centered dialog."
    />

    <div style={{ marginBottom: '40px' }}>
      <BlockLabel>Empty vs filled</BlockLabel>
      <InfoBox>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
              value={'{ start: null, end: null }'}
            </div>
            <DateRangeDemo label="Filter leads by date" placeholder="All dates" />
          </div>
          <div>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
              value = Last 7 days
            </div>
            <DateRangeDemo label="Filter leads by date" placeholder="All dates" initialValue={LAST_7_DAYS_RANGE} />
          </div>
        </div>
        <Note>
          Open either field — the calendar is always visible, right alongside the three presets (Today / Last 7
          days / Last 30 days); there's no "Custom range" row gating it. Tapping a preset applies immediately and
          closes; picking two dates on the calendar does the same on the second tap. The manual-entry From/To date
          inputs below the calendar are the accessible keyboard/mobile-OS path — try typing a full year (e.g. 2025)
          directly into one, it commits correctly rather than landing on a bogus date. On desktop the whole thing
          is a centered, scrimmed dialog that stays put if you scroll the page behind it; on mobile it's the mobile
          bottom sheet, unchanged.
        </Note>
      </InfoBox>
    </div>

    {/* ── Gallery — time ───────────────────────────────────────────────────── */}
    <SectionHead
      title="Gallery — time"
      description="Daily digest time. A single Select, 30-minute increments, 12h + AM/PM in each option."
    />

    <div style={{ marginBottom: '40px' }}>
      <BlockLabel>md · lg — empty vs filled (8:00 AM)</BlockLabel>
      <InfoBox>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <TimeDemo label="Daily digest time" size="md" placeholder="Select a time" />
          <TimeDemo label="Daily digest time" size="lg" initialValue="08:00" />
        </div>
        <Note>
          Stored as 24h <Code>"08:00"</Code>, displayed as <Code>8:00 AM</Code>. Inherits every Select state —
          nothing reimplemented.
        </Note>
      </InfoBox>
    </div>

    {/* ── Gallery — time-range ─────────────────────────────────────────────── */}
    <SectionHead
      title="Gallery — time-range"
      description="Quiet hours. Two time Selects, From/To — overnight ranges are the primary use case, not an error."
    />

    <div style={{ marginBottom: '40px' }}>
      <BlockLabel>Overnight (the headline case) vs same-day</BlockLabel>
      <InfoBox>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
              10:00 PM → 7:00 AM
            </div>
            <TimeRangeDemo label="Quiet hours" initialValue={{ from: '22:00', to: '07:00' }} />
          </div>
          <div>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
              9:00 AM → 5:00 PM (same day, for contrast)
            </div>
            <TimeRangeDemo label="Quiet hours" initialValue={{ from: '09:00', to: '17:00' }} />
          </div>
        </div>
        <Note>
          The left demo shows the overnight hint — <Code>to &lt; from</Code> renders "Overnight — 10:00 PM to
          7:00 AM next day" instead of an error. The right demo has no hint because 5:00 PM is later than 9:00 AM.
        </Note>
      </InfoBox>
    </div>

    <Divider />

    {/* ── States ────────────────────────────────────────────────────────────── */}
    <SectionHead
      title="States"
      description="Every state is live — nothing below is a static mockup."
    />

    <div style={{ marginBottom: '40px' }}>
      <BlockLabel>date-range trigger — default · disabled · filled</BlockLabel>
      <InfoBox>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
          <DateRangeDemo label="Filter leads by date" placeholder="All dates" />
          <DateRangeDemo label="Filter leads by date" initialValue={LAST_7_DAYS_RANGE} disabled />
          <DateRangeDemo label="Filter leads by date" initialValue={LAST_7_DAYS_RANGE} />
        </div>
        <Note>
          Hover and focus are CSS-driven — Tab to the first field (or click it) to see the border shift to
          <Code>--color-focus-ring</Code>. This uses <Code>:focus-within</Code>, not <Code>:focus-visible</Code>, so
          the border shows for a mouse click as well as keyboard focus — the previous build only showed it for
          keyboard Tab. Disabled applies <Code>--opacity-disabled</Code> (0.4) and <Code>cursor: not-allowed</Code>.
        </Note>
      </InfoBox>
    </div>

    <div style={{ marginBottom: '40px' }}>
      <BlockLabel>Day-cell states — open this field to see them together</BlockLabel>
      <InfoBox>
        <div style={{ maxWidth: '360px' }}>
          <DateRangeDemo label="Filter leads by date" initialValue={STATES_DEMO_RANGE} />
        </div>
        <Note>
          This field's value spans 10 days ago to 3 days ago — deliberately excluding today, so opening it and
          viewing the current month shows every day-cell state at once: <strong>selected start/end</strong>{' '}
          (<Code>--color-interactive-default</Code> fill), <strong>in-range</strong> days between them
          (<Code>--color-brand-tint</Code>), <strong>today</strong> unselected (a <Code>--color-border-strong</Code>{' '}
          ring only, no fill — today ≠ selected), <strong>disabled future</strong> days past today
          (<Code>--opacity-disabled</Code>, untappable), and <strong>outside-month</strong> grey days at the grid's
          edges. Try the arrow keys, Home/End, and PageUp/PageDown once a day cell has focus.
        </Note>
      </InfoBox>
    </div>

    <div style={{ marginBottom: '40px' }}>
      <BlockLabel>time / time-range — default · error · disabled</BlockLabel>
      <InfoBox>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <TimeDemo label="Daily digest time" initialValue="08:00" />
          <TimeDemo label="Daily digest time" placeholder="Select a time" error="Select a digest time" />
          <TimeDemo label="Daily digest time" initialValue="08:00" disabled />
          <TimeRangeDemo
            label="Quiet hours"
            initialValue={{ from: '', to: '07:00' }}
            error="Enter a start time"
            errorField="from"
          />
        </div>
        <Note>
          time and time-range inherit Select's state set wholesale — default / hover / focus-visible / error /
          disabled / placeholder-vs-filled. The time-range error demo marks only the "From" Select, per Carbon's
          multi-field rule — "To" stays unmarked.
        </Note>
      </InfoBox>
    </div>

    <Divider />

    {/* ── Usage guide ──────────────────────────────────────────────────────── */}
    <SectionHead
      title="Usage guide"
      description="When to reach for each variant, and the behaviour decisions behind them."
    />

    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '16px',
      marginBottom: '40px',
    }}>
      <InfoBox>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
          Presets and the calendar coexist — no gate
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          Today / Last 7 days / Last 30 days cover the majority of real filtering, and the calendar is always
          visible right next to them for manual picks — the Stripe/Polaris dashboard-filter norm. There is no
          "Custom range" row: a previous build gated the calendar behind one, but since the calendar was already
          always rendered, that row had no behaviour of its own — it was removed.
        </p>
      </InfoBox>

      <InfoBox>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
          Desktop overlay is a centered dialog, not an anchored popover
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          Picking a date range is a commit-then-return task — the same interaction class a modal is for. A
          previous build anchored the overlay to the trigger's position, which stuck to the bottom of the
          viewport and followed the page as it scrolled. The dialog is now centered, scrimmed, and
          focus-trapped, and does not move when the page behind it scrolls.
        </p>
      </InfoBox>

      <InfoBox>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
          Trigger opens on click, never on focus
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          The date-range trigger is a real <Code>&lt;button&gt;</Code>. Auto-opening a calendar on input focus is
          the exact screen-reader failure mode Atlassian's own redesign removed.
        </p>
      </InfoBox>

      <InfoBox>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
          Overnight time-range is valid, not an error
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          Quiet hours are literally "10pm to 7am". Never apply a generic end-after-start validation rule to
          time-range — it would break the flagship quiet-hours setting.
        </p>
      </InfoBox>

      <InfoBox>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
          Native date input is the accessible manual path
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          The From/To <Code>&lt;input type="date"&gt;</Code> row is always present next to the calendar — it hands
          mobile users the OS date wheel with zero parsing code, and is the MD3/Polaris-mandated keyboard path.
        </p>
      </InfoBox>

      <InfoBox>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
          44×44 tap targets everywhere
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          Day cells are 40×40px visually but expand to 44×44px via <Code>::before</Code>. Preset rows are a full
          44px tall. Nothing in this component falls below the floor.
        </p>
      </InfoBox>

      <InfoBox>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
          date-range vs a future single-date picker
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          Use date-range for every v1 filtering need — no screen selects one bare date. If a future screen needs
          exactly one date, derive it from date-range as <Code>start === end</Code> rather than reaching for a new
          component.
        </p>
      </InfoBox>

      <InfoBox>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
          Not built for dates years away
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          The calendar has no fast year-jump control — only prev/next month and Shift+PageUp/PageDown for ±1 year.
          Polaris flags this pattern as tedious for far-past or far-future dates; it's built for the near-term
          ranges lead filtering actually needs, not a historical archive browser.
        </p>
      </InfoBox>
    </div>

    <Divider />

    {/* ── Reference tables ──────────────────────────────────────────────────── */}
    <SectionHead
      title="Reference table"
      description="Every prop across all three variants, and the design tokens the component consumes."
    />

    <div style={{ marginBottom: '16px' }}>
      <BlockLabel>Props</BlockLabel>
      <div style={{
        background: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border-default)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--color-bg-secondary)' }}>
              {['PROP', 'TYPE', 'DEFAULT', 'DESCRIPTION'].map(h => (
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
    </div>

    <div style={{ marginBottom: '40px' }}>
      <BlockLabel>Design tokens</BlockLabel>
      <div style={{
        background: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border-default)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--color-bg-secondary)' }}>
              {['TOKEN', 'VALUE', 'USAGE'].map(h => (
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
                <td style={{
                  padding: '12px 16px', minHeight: '44px',
                  fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem',
                  color: 'var(--color-text-primary)', whiteSpace: 'nowrap',
                  borderBottom: i < TOKENS.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                }}>
                  {row.token}
                </td>
                <td style={{
                  padding: '12px 16px',
                  fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem',
                  color: 'var(--color-text-secondary)', whiteSpace: 'nowrap',
                  borderBottom: i < TOKENS.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                }}>
                  {row.value}
                </td>
                <td style={{
                  padding: '12px 16px',
                  fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
                  color: 'var(--color-text-primary)',
                  borderBottom: i < TOKENS.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                }}>
                  {row.usage}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <Divider />

    {/* ── Do / Don't ───────────────────────────────────────────────────────── */}
    <SectionHead
      title="Do / Don't"
      description="Two concrete misuse patterns worth a visual."
    />

    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '16px',
      marginBottom: '40px',
    }}>
      <InfoBox>
        <div style={{
          display: 'inline-block',
          fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 500,
          textTransform: 'uppercase', letterSpacing: '0.04em',
          color: 'var(--color-status-error-text)',
          background: 'var(--color-status-error-bg)',
          borderRadius: 'var(--radius-xs)',
          padding: '2px 8px', marginBottom: '12px',
        }}>
          Don't
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          Add an Apply button to a simple range filter. Selecting the end date already applies and closes — a
          mandatory Apply taxes every single use to guard against a mis-tap that costs one redo.
        </p>
      </InfoBox>

      <InfoBox>
        <div style={{
          display: 'inline-block',
          fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 500,
          textTransform: 'uppercase', letterSpacing: '0.04em',
          color: 'var(--color-status-error-text)',
          background: 'var(--color-status-error-bg)',
          borderRadius: 'var(--radius-xs)',
          padding: '2px 8px', marginBottom: '12px',
        }}>
          Don't
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          Treat time-range's <Code>to &lt; from</Code> as a validation error. Quiet hours are overnight by design —
          show the informational hint, never an error message, for this shape of value.
        </p>
      </InfoBox>
    </div>

  </StoryFrame>
);
