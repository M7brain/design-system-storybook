'use client';

import React from 'react';
import { Tabs as TabsPrimitive } from 'radix-ui';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Icon } from '@/design-system/icons/Icon.jsx';

// Tabs — built on Radix Tabs (Root/List/Trigger/Content) for ARIA (role
// tablist/tab/tabpanel, aria-selected/-controls/-labelledby), roving
// tabindex, and keyboard nav (Left/Right move+activate, Home/End first/last,
// Tab into the panel) — not hand-rolled. Same precedent as Avatar being
// built on radix-ui's Avatar primitive. `Content` is exposed as `Tabs.Panel`
// to match this repo's own vocabulary (Alert calls its content area a
// "body", Toast a "card" — never "content").
//
// Two variants only, both considered against alternatives and cut — see
// docs/DECISIONS.md: `pill` was cut because it collides visually and
// semantically with FilterPill (Patterns phase — multi-select/dismissible
// filter chips; a different job, a different component). `vertical` was cut
// because it has no mobile-first home in this product — every Quicklo
// screen is narrow-viewport-first, and a vertical tablist needs a wide aside
// to make sense.
//
// activationMode="automatic" by default (arrow-key focus switches the panel
// immediately, no separate Enter/Space step) — removes a step for a
// non-technical owner tapping through tabs on a phone. A consumer with a
// genuinely expensive panel (e.g. one that triggers a fetch on activation)
// can override this per instance: <Tabs activationMode="manual">.
//
// Zero new colour tokens, zero new primitives.

const TabsConfigContext = React.createContext({ variant: 'line', size: 'md', fitted: true });
const TabsActiveValueContext = React.createContext(undefined);

function useTabsConfig() {
  return React.useContext(TabsConfigContext);
}

export const Tabs = React.forwardRef(function Tabs(
  {
    value,
    defaultValue,
    onValueChange,
    variant = 'line',
    size = 'md',
    fitted = true,
    activationMode = 'automatic',
    className,
    children,
    ...rest
  },
  ref
) {
  // Parallel tracking of the active value, independent of whether the
  // consumer runs Tabs controlled or uncontrolled — Radix owns the real
  // controlled/uncontrolled state machine untouched below (value/
  // defaultValue passed straight through); this local copy exists only to
  // drive Tabs.List's scroll-active-trigger-into-view effect, since Radix
  // calls onValueChange in both modes. Standard controlled-or-uncontrolled
  // derivation — resolved directly during render, no sync effect needed.
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const activeValue = value !== undefined ? value : internalValue;

  function handleValueChange(next) {
    if (value === undefined) setInternalValue(next);
    onValueChange?.(next);
  }

  const config = React.useMemo(() => ({ variant, size, fitted }), [variant, size, fitted]);

  return (
    <TabsConfigContext.Provider value={config}>
      <TabsActiveValueContext.Provider value={activeValue}>
        <TabsPrimitive.Root
          ref={ref}
          {...rest}
          value={value}
          defaultValue={defaultValue}
          onValueChange={handleValueChange}
          activationMode={activationMode}
          className={cn('flex flex-col', className)}
        >
          {children}
        </TabsPrimitive.Root>
      </TabsActiveValueContext.Provider>
    </TabsConfigContext.Provider>
  );
});
Tabs.displayName = 'Tabs';

// ─────────────────────────────────────────────────────────────────────────
// List
// ─────────────────────────────────────────────────────────────────────────

// Static edge-fade mask, applied unconditionally rather than only when the
// list is actually overflowing. This is deliberately NOT the JS-measured
// "only show the fade if content overflows" technique — that would need a
// ResizeObserver watching both the track and its content, the exact
// fragility class (continuous measurement + resize listeners) that caused
// the DateTimePicker anchored-popover bug (see DECISIONS.md). A static mask
// is harmless when nothing overflows (it just fades the last ~24px of
// already-fully-visible content) and correct when something does.
const EDGE_FADE_MASK =
  'linear-gradient(to right, transparent, black 24px, black calc(100% - 24px), transparent)';

// segmented's unselected-label colour needs a per-mode fallback (2026-07-08
// raised-pill redesign): --color-text-secondary on --color-bg-secondary
// measures ~3.64:1 in light mode — below AA 4.5:1 for text — but ~7.99:1 in
// dark mode (see DECISIONS.md for the full Node relative-luminance figures).
// Rather than ship failing light-mode text, light unselected falls back to
// --color-text-primary; the raised pill (bg-surface + --elevation-1) plus the
// selected/unselected FONT-WEIGHT difference (400 vs 500) still carry the
// distinction even when both read the same colour in light mode. Written as
// a small injected <style> block — like Badge's own PULSE_KEYFRAMES — rather
// than stacked Tailwind `dark:`/`data-[state=active]:` utility variants,
// because those two variants have no defined precedence relative to each
// other and getting this backwards would be a silent, hard-to-notice
// contrast regression, not a visual bug someone would immediately catch.
const SEGMENTED_LABEL_CSS = `
.quicklo-segmented-trigger { color: var(--color-text-primary); }
.dark .quicklo-segmented-trigger:not([data-state="active"]) { color: var(--color-text-secondary); }
@media (hover: hover) {
  .quicklo-segmented-trigger:not([data-state="active"]):hover { color: var(--color-text-primary); }
}
`;

export const List = React.forwardRef(function List({ className, style, children, ...rest }, ref) {
  const { variant, size, fitted } = useTabsConfig();
  const activeValue = React.useContext(TabsActiveValueContext);
  const listRef = React.useRef(null);

  const setRefs = React.useCallback(
    (node) => {
      listRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    [ref]
  );

  // Scroll the active trigger into view on mount + on every value change —
  // one native scrollIntoView call reacting to a discrete state change, not
  // a continuous measurement loop. See the EDGE_FADE_MASK comment above for
  // why this is a different (safe) fragility class than a sliding indicator.
  React.useEffect(() => {
    const active = listRef.current?.querySelector('[data-state="active"]');
    active?.scrollIntoView({ inline: 'nearest', block: 'nearest' });
  }, [activeValue]);

  const isLine = variant === 'line';
  const isSegmented = !isLine;

  // Sliding selected-pill layer — fitted (equal-width) segmented sets only.
  // Index math over the ordered list of child values, computed at render
  // time from props — NOT a DOM measurement and NOT a ResizeObserver. This
  // is exactly why it's safe: fitted segments are equal-width by
  // construction (flex: 1 1 0%), so "segment N's position" is pure
  // arithmetic (N * 100%) rather than something that has to be measured.
  // `fitted={false}` (a deliberately content-width/scrollable set, e.g. the
  // Overflow demo) skips this layer entirely — see the Trigger-level
  // fallback below, which gives each selected segment its own direct
  // surface+elevation background instead.
  const showSlidingPill = isSegmented && fitted;
  const childArray = React.useMemo(
    () => (showSlidingPill ? React.Children.toArray(children).filter(React.isValidElement) : []),
    [showSlidingPill, children]
  );
  const selectedIndex = showSlidingPill
    ? childArray.findIndex((child) => child.props.value === activeValue)
    : -1;

  return (
    <TabsPrimitive.List
      ref={setRefs}
      {...rest}
      className={cn(
        // Never wraps — overflow always scrolls, never stacks to a second row.
        'flex flex-nowrap items-stretch overflow-x-auto w-full',
        'scrollbar-none',
        isLine && 'border-b border-(--color-border-default)',
        isSegmented && 'relative',
        className
      )}
      style={{
        maskImage: EDGE_FADE_MASK,
        WebkitMaskImage: EDGE_FADE_MASK,
        ...(isLine
          ? undefined
          : {
              background: 'var(--color-bg-secondary)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-1)',
              height: size === 'lg' ? '48px' : '40px',
            }),
        ...style,
      }}
    >
      {isSegmented && <style>{SEGMENTED_LABEL_CSS}</style>}

      {selectedIndex !== -1 && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 'var(--space-1)',
            bottom: 'var(--space-1)',
            left: 'var(--space-1)',
            width: `calc((100% - 2 * var(--space-1)) / ${childArray.length})`,
            transform: `translateX(calc(${selectedIndex} * 100%))`,
            background: 'var(--color-bg-surface)',
            borderRadius: 'var(--radius-sm)',
            boxShadow: 'var(--elevation-1)',
            transition: 'transform var(--duration-base) var(--ease-default)',
            pointerEvents: 'none',
          }}
        />
      )}

      {children}
    </TabsPrimitive.List>
  );
});
List.displayName = 'Tabs.List';

// ─────────────────────────────────────────────────────────────────────────
// Trigger
// ─────────────────────────────────────────────────────────────────────────

// `line` focus-visible is deliberately NOT re-declared here — it relies on
// the global `*:focus-visible { outline: 2px solid var(--color-brand-btn);
// outline-offset: 2px; }` rule in globals.css, which every other outline-
// convention component (Input/Checkbox/Toggle/IconButton) also relies on
// without redeclaring. `--color-brand-btn` and `--color-focus-ring` resolve
// to the identical primitive in both modes (both alias brick-500 light /
// orange-500 dark), so the global rule already matches this component's
// spec (2px solid var(--color-focus-ring)-equivalent, 2px offset) exactly.
const lineTriggerVariants = cva(
  [
    'relative inline-flex shrink-0 items-center cursor-pointer select-none',
    'font-[family-name:var(--font-body)] font-normal whitespace-nowrap',
    'text-(--color-text-secondary)',
    'border-b-2 border-transparent -mb-px',
    'transition-colors duration-(--duration-base) ease-(--ease-default)',
    '[@media(hover:hover)]:[&:hover]:text-(--color-text-primary)',
    'data-[state=active]:text-(--color-text-primary) data-[state=active]:font-semibold data-[state=active]:border-(--color-interactive-default)',
    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-(--opacity-disabled)',
  ],
  {
    variants: {
      size: {
        md: 'gap-(--space-2) px-(--space-4) py-(--space-3) text-[length:var(--text-body-md)] leading-[1.25rem]',
        lg: 'gap-(--space-2) px-(--space-4) py-(--space-3) text-[length:var(--text-body-lg)] leading-[1.5rem]',
      },
    },
    defaultVariants: { size: 'md' },
  }
);

// `segmented` needs the same always-on 44×44px `::before` tap-target
// expansion Checkbox/Toggle use (not the breakpoint-gated Button/IconButton
// technique) — even at `lg` (48px track, --space-1 padding on every side)
// the visible pill is only ~40px tall, under the 44px floor. The pill's
// VISUAL size stays token-accurate; only the invisible hit area is expanded.
//
// 2026-07-08 raised-pill redesign: text colour is deliberately NOT part of
// this cva string any more (see SEGMENTED_LABEL_CSS above and the
// `.quicklo-segmented-trigger` className applied in Trigger) — keeping
// colour out of the Tailwind utility soup here avoids relying on undefined
// precedence between stacked `dark:`/`data-[state=active]:` variants for
// something as load-bearing as text contrast. The `fitted` variant below
// controls only the SELECTED-segment background: `fitted=true` renders no
// background here at all (the shared sliding pill in Tabs.List supplies it
// instead); `fitted=false` (a deliberately content-width/scrollable set)
// gives the selected segment its own direct surface+elevation background,
// since there's no shared equal-width layer to slide in that case.
const segmentedTriggerVariants = cva(
  [
    'relative inline-flex items-center justify-center cursor-pointer select-none',
    'font-[family-name:var(--font-body)] font-normal whitespace-nowrap',
    'transition-colors duration-(--duration-base) ease-(--ease-default)',
    'data-[state=active]:font-medium',
    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-(--opacity-disabled)',
    "before:content-[''] before:absolute before:top-1/2 before:left-1/2",
    'before:-translate-x-1/2 before:-translate-y-1/2 before:min-w-11 before:min-h-11',
  ],
  {
    variants: {
      size: {
        md: 'px-(--space-4) text-[length:var(--text-body-md)] leading-[1.25rem] rounded-(--radius-sm)',
        lg: 'px-(--space-4) text-[length:var(--text-body-md)] leading-[1.25rem] rounded-(--radius-sm)',
      },
      fitted: {
        true: '',
        false: 'data-[state=active]:bg-(--color-bg-surface) data-[state=active]:shadow-[var(--elevation-1)]',
      },
    },
    defaultVariants: { size: 'md', fitted: true },
  }
);

/**
 * @typedef {Object} TabsTriggerProps
 * @property {string} value - Required, matches the corresponding Tabs.Panel's `value`.
 * @property {string} [icon] - Optional leading icon NAME (via the Icon wrapper, 16px,
 *   aria-hidden). All-or-nothing across a tab set — Material's rule: never mix icon-only
 *   and text-only triggers in the same list.
 * @property {boolean} [hideLabel=false] - segmented only: visually hides the label
 *   (sr-only, not removed) so only the leading `icon` shows — the compact icon-only
 *   view-switcher mode (grid/list/columns). REQUIRES an `aria-label` since the visible
 *   label is gone; dev-warns if absent. `line` triggers always show their label.
 * @property {import('react').ReactNode} [chip] - Optional trailing slot — pass an
 *   already-built <Chip> instance (e.g. a small error-tone status Chip for a Connections
 *   tab with a failed webhook). Composition, not a component state — see the file header
 *   for why Tabs has no `error` state of its own. Renamed from `badge` (2026-07-08) —
 *   Tabs' trailing slot now composes the new compact Chip, a full-size Badge read
 *   oversized at a tab's scale.
 * @property {boolean} [disabled=false] - Real case: a plan-gated Analytics tab. Skipped by
 *   arrow-key nav and removed from the tab order — Radix's own roving-tabindex behaviour,
 *   not reimplemented here.
 */

export const Trigger = React.forwardRef(function Trigger(
  { value, icon, hideLabel, chip, disabled, className, style, children, ...rest },
  ref
) {
  const { variant, size, fitted } = useTabsConfig();
  const isLine = variant === 'line';
  const isSegmented = !isLine;
  const variants = isLine ? lineTriggerVariants : segmentedTriggerVariants;

  if (process.env.NODE_ENV !== 'production' && hideLabel && !rest['aria-label']) {
    console.warn('Tabs.Trigger: hideLabel requires an aria-label — the visible label is gone, so this is now the trigger\'s only accessible name.');
  }

  return (
    <TabsPrimitive.Trigger
      ref={ref}
      value={value}
      disabled={disabled}
      {...rest}
      className={cn(variants({ size, fitted }), isSegmented && 'quicklo-segmented-trigger', className)}
      style={{
        ...(isLine
          ? undefined
          : {
              position: 'relative',
              zIndex: 1,
              flex: fitted ? '1 1 0%' : '0 0 auto',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--space-2)',
            }),
        ...style,
      }}
    >
      {icon && <Icon name={icon} size="sm" />}
      {hideLabel ? <span className="sr-only">{children}</span> : children}
      {chip}
    </TabsPrimitive.Trigger>
  );
});
Trigger.displayName = 'Tabs.Trigger';

// ─────────────────────────────────────────────────────────────────────────
// Panel
// ─────────────────────────────────────────────────────────────────────────

/**
 * @typedef {Object} TabsPanelProps
 * @property {string} value - Required, matches the corresponding Tabs.Trigger's `value`.
 */

export const Panel = React.forwardRef(function Panel({ value, className, children, ...rest }, ref) {
  return (
    <TabsPrimitive.Content ref={ref} value={value} {...rest} className={className}>
      {children}
    </TabsPrimitive.Content>
  );
});
Panel.displayName = 'Tabs.Panel';

// Panel loading: a tab doesn't load — the PANEL does. Render the existing
// Skeleton/Spinner (src/design-system/loaders/) INSIDE a Tabs.Panel while
// its data is fetching, exactly like any other content area. There is no
// `loading` prop on Tabs.Trigger or Tabs.Panel.
//
// Panel error: tabs don't error either — a section error is an Alert
// rendered inside the panel, same as any other content area.

Tabs.List = List;
Tabs.Trigger = Trigger;
Tabs.Panel = Panel;
