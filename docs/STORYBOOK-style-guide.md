# STORYBOOK-style-guide.md — Quicklo

> **What this file is.** The authoritative visual and structural specification for every
> Storybook story in the Quicklo design system — Foundation stories, Component stories,
> and Pattern stories alike. Claude Code reads this file in full before writing or editing
> any `.stories.js` file. No exceptions.
>
> **Scope.** This guide governs how stories look and are structured. It does not govern
> the design tokens, component logic, or product behaviour — those live in CLAUDE.md,
> globals.css, and the relevant docs.
>
> **Rule.** If this guide and another doc conflict on a visual or structural matter for
> Storybook, this guide wins.

---

## 1. Mandatory controls — every story, no exceptions

Every story must include these two controls at the top of the canvas, before any content:

### Light / Dark switcher

- A toggle with two buttons: "Light" and "Dark"
- Light is the default active state
- Toggling applies `class="dark"` to the story's root wrapper element
- Active button style: background `var(--color-brand-btn)`, text `var(--color-brand-btn-text)`,
  border-radius `var(--radius-sm)`
- Inactive button style: background transparent, text `var(--color-text-secondary)`,
  border: 1px solid `var(--color-border-default)`
- Button size: height 32px, padding 0 16px, font Inter 500 0.875rem
- The switcher sits top-left, with 24px margin from the canvas edge

### THE TOGGLE IS PART OF THE STORY, NOT STORYBOOK CONFIGURATION — READ THIS CAREFULLY

This is the single most common point of failure in past sessions, so it is spelled out
explicitly here. **Do not rely on Storybook's own theme/background addon, dark-mode addon,
or `.storybook/preview.js` globals to provide the Light/Dark switcher.** Even if such an
addon is installed, it is NOT a substitute for this rule, because:

- Marko reviews stories with the canvas at default zoom, and an addon toolbar button
  is easy to miss or may not exist depending on addon configuration
- An addon-driven toggle changes a Storybook global, which may or may not actually apply
  `.dark` to the rendered DOM the story produces, depending on how the story is written
- The requirement here is a VISIBLE, IN-CANVAS toggle that is unmistakably part of the
  page content Marko is reviewing — not a tool in Storybook's UI shell

**Required implementation pattern — every story file must follow this exactly:**

Every `.stories.js` file that renders visual content must implement its own local
dark-mode state and wrapper, using this exact pattern:

```jsx
import { useState } from 'react';

function StoryFrame({ children }) {
  const [isDark, setIsDark] = useState(false);

  return (
    <div
      className={isDark ? 'dark' : ''}
      style={{
        background: 'var(--color-bg-primary)',
        minHeight: '100vh',
        width: '100%',
        padding: '32px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <button
          onClick={() => setIsDark(false)}
          aria-pressed={!isDark}
          style={{
            height: '32px',
            padding: '0 16px',
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
            height: '32px',
            padding: '0 16px',
            borderRadius: 'var(--radius-sm)',
            border: isDark ? 'none' : '1px solid var(--color-border-default)',
            background: isDark ? 'var(--color-brand-btn)' : 'transparent',
            color: isDark ? 'var(--color-brand-btn-text)' : 'var(--color-text-secondary)',
            fontFamily: 'Inter', fontWeight: 500, fontSize: '0.875rem', cursor: 'pointer',
          }}
        >
          Dark
        </button>
        {/* Search field, if applicable per this section, renders here in the same row */}
      </div>
      <div style={{ borderBottom: '1px solid var(--color-border-default)', marginBottom: '32px' }} />
      {children}
    </div>
  );
}
```

Every story's render function wraps its entire content in this `StoryFrame` (or an
identical local copy of it — do not import a shared component across foundation files
unless one already exists and is approved; until then, each `.stories.js` file defines
its own `StoryFrame` at the top of the file). The story's actual content goes inside
`{children}` — nothing renders outside `StoryFrame`.

**Non-negotiable consequences of this pattern:**
- `isDark` is local React state, declared with `useState` — never a Storybook global,
  never a context provider reaching outside the file
- The `.dark` class is applied to the OUTERMOST div the story renders — every demo,
  every swatch, every card inside `{children}` must visually respond to this class
  flipping, because they all reference `var(--color-*)` tokens that change under `.dark`
- If a story's content does not visibly change when the toggle is clicked, that is a
  bug — it almost always means something inside the story has a hardcoded colour
  instead of a token reference. Fix the hardcoded value, not the toggle.
- Do NOT set `layout: 'centered'` or `layout: 'padded'` in the story's parameters —
  see Section 2. The toggle row above lives inside the full-width content, not in
  Storybook's own padded/centered canvas chrome.

### Search field
- Include a search field on any story that contains 8 or more named items
  (icons, tokens, swatches, scale steps, etc.)
- Omit search on stories that are primarily prose, table references, or have fewer than 8 items
- Search filters the visible items in real time as the user types — client state only,
  no external dependencies. Implement with a second `useState` in the same story render
  function that defines `isDark` — both live together as local component state.
- Placeholder text: "Search [thing]..." e.g. "Search icons...", "Search tokens..."
- Input style: height 36px, padding 0 12px, border 1px solid `var(--color-border-default)`,
  border-radius `var(--radius-sm)`, background `var(--color-bg-surface)`,
  font Inter 400 0.875rem, color `var(--color-text-primary)`
- Focus state: border-color `var(--color-brand-btn)`, outline none
- Renders in the same row as the Light/Dark switcher, inside `StoryFrame`'s controls row
  (see the `StoryFrame` snippet in this section — the search input slots into the marked
  comment line), with 12px gap from the switcher
- Shows a live item count to the right of the input: e.g. "80 icons" — updates as user searches
- When search yields zero results, show: icon or token name centred in the content area,
  Inter 400 1rem, color `var(--color-text-secondary)`, text: "No results for "[query]""

The switcher + search row has 24px padding on all sides and sits above a 1px divider
using `var(--color-border-default)` before the story content begins. This row and divider
are produced by `StoryFrame` itself — do not duplicate them inside individual story content.

---

## 2. Canvas and layout

- Story canvas background: `var(--color-bg-primary)` — applied to the root wrapper
- **Content is full width — no max-width constraint, no centered column.**
  Content starts from the left edge of the canvas and fills the available width.
- Canvas padding: 32px on all sides — this is the only breathing room between
  the content and the canvas edge. No additional centering wrappers.
- All inline styles use CSS token variables only — never hardcoded hex,
  never hardcoded Tailwind colour classes
- All spacing values are multiples of 4px and use `--space-*` tokens where they exist;
  otherwise use the nearest 4px multiple expressed in px
- **Spacing philosophy:** content must breathe. Use generous vertical spacing between
  sections (minimum 48px). Never stack sections tightly. Padding inside cards and
  info boxes should feel comfortable, not cramped — minimum 20px, prefer 24px.

### REQUIRED story parameters — set these exactly, every story

In the default export of every `.stories.js` file:

```js
export default {
  title: 'Foundations/[Name]', // or 'Components/[Name]', 'Patterns/[Name]'
  parameters: {
    layout: 'fullscreen',
  },
};
```

- `layout: 'fullscreen'` is REQUIRED on every story in this design system, with no
  exceptions, including Usage Guide / reference-only stories.
- `layout: 'centered'` is FORBIDDEN. It constrains Storybook's canvas to a centred,
  width-limited box before the story even renders — this is the single most common
  cause of the "content is centred instead of full width" bug. If you see
  `layout: 'centered'` anywhere in an existing story file, that is a bug — remove it.
- `layout: 'padded'` is also FORBIDDEN for the same reason — it adds Storybook's own
  padding/centering chrome on top of the page's own 32px padding from `StoryFrame`,
  producing inconsistent spacing. The page handles its own padding; Storybook's canvas
  must not add more.
- Do not set `layout` per-individual-story unless intentionally overriding the default
  for a documented reason — and if you do, it must still be `fullscreen`, never
  `centered` or `padded`.

### Single-column stacking — sections run top to bottom, never side-by-side

Aside from small, explicitly-specified side-by-side elements within a single section
(e.g. a grid of icon cards, a row of colour swatches, two info boxes compared
side-by-side per Section 2b), the major sections of a story — Page header, Visual
scale/Gallery, Usage guide, Reference table, Do/Don't — always stack vertically, one
full-width block after another, per the Section 4 order. Do not place two major
sections side-by-side in a two-column page layout. Do not use a CSS `grid` or `flex`
with `flexDirection: row` at the top level of the page to arrange sections — only use
row-based layout *inside* a section, for the specific repeating items that section
contains (swatches, cards, demo variants), never to arrange the sections themselves
against each other.

---

## 2b. Info boxes and content cards

Stories may use bordered content boxes to group related information. These are
encouraged wherever they improve scannability — not mandatory everywhere, but
use them freely when content benefits from visual grouping.

**When to use an info box:**
- Grouping a named concept with its properties (e.g. an elevation level with
  its token name, shadow value, and usage description)
- Side-by-side comparisons (e.g. "Shadow primitives" vs "Elevation tokens")
- Isolating a visual demo from its explanatory text
- Any block of related metadata that would otherwise run as undifferentiated prose

**When NOT to use an info box:**
- Simple single-value rows in a reference table — use the table instead
- The controls row (switcher + search) — this has its own fixed style
- Section headings — these are always bare, never boxed

**Info box visual spec:**
- Background: `var(--color-bg-surface)`
- Border: `1px solid var(--color-border-default)`
- Border-radius: `var(--radius-md)` (12px)
- Padding: 20px (compact content) or 24px (default — prefer this)
- No drop shadow on info boxes — elevation-0, flat
- A box may have an internal title: Inter 600 0.875rem `var(--color-text-primary)`,
  marginBottom 8px, no uppercase
- Body text inside a box: Inter 400 0.875rem `var(--color-text-secondary)`, lineHeight 1.5rem
- Code/token names inside a box: ui-monospace 0.875rem `var(--color-text-primary)`
- Info boxes may be placed in a CSS grid for side-by-side layouts:
  `display: grid; gridTemplateColumns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px`
  or a fixed 2-column layout: `gridTemplateColumns: '1fr 1fr'` — use whichever fits
  the content better. Never force boxes into columns when they'd be too narrow.

**Info box sizing:** boxes should never feel cramped. If content is short,
let the box breathe — do not compress it. Minimum box height: 80px.

---

## 3. Typography — hard minimums, no exceptions

These sizes apply to all rendered text inside story canvases.
The rem values below are the minimum floors — go larger where the hierarchy demands it.

| Role | Font | Weight | Size | Line-height | Colour token |
|---|---|---|---|---|---|
| Page title (top of story) | Outfit | 700 | 1.75rem | 2.25rem | `--color-text-primary` |
| Section title | Inter | 600 | 1.25rem | 1.75rem | `--color-text-primary` |
| Section description | Inter | 400 | 1rem | 1.75rem | `--color-text-secondary` |
| Body / prose | Inter | 400 | 0.875rem | 1.5rem | `--color-text-primary` |
| Table header | Inter | 500 | 0.875rem | 1.25rem | `--color-text-secondary` |
| Table cell | Inter | 400 | 0.875rem | 1.25rem | `--color-text-primary` |
| Token name (monospace) | ui-monospace | 400 | 0.875rem | 1.25rem | `--color-text-primary` |
| Caption / label below swatch or icon | Inter | 400 | 0.75rem | 1rem | `--color-text-secondary` |

**Absolute floor: no rendered text in any story may use a font-size below 0.75rem.**
**No px font sizes ever — rem only, always.**

---

## 4. Story page structure — the standard template

Every story follows this section order. Include only the sections relevant to that
foundation or component. Never invent new section types — if a new one is genuinely
needed, it must be discussed and added to this guide first.

### Section order (top to bottom)

1. **Controls row** — Light/Dark switcher + Search (if applicable). Always present. Always first.

2. **Page header** — Foundation or component name at page-title size (1.75rem Outfit 700),
   followed by a one-sentence description at section-description size. Always present.

3. **Visual scale / Gallery** — The primary visual content for this story. What this contains
   depends on the foundation type — see Section 5 for per-foundation specs.
   Always present.

4. **Usage guide** — When to use, when not to use, written as short labelled rules
   (not prose paragraphs). Format: bold label + colon + one-sentence rule per line.
   Present on all Foundation stories. Optional on Component stories if the variants
   are self-explanatory.

5. **Reference table** — Every token relevant to this foundation, in a structured table.
   **Present on every Foundation story and every Component story. No exceptions.**
   See Section 6 for table format.

6. **Do / Don't** — Optional. Include only when there are concrete misuse patterns worth
   flagging with a visual example. Never add this section just to fill space.

Sections are separated by a full-width 1px divider using `var(--color-border-default)`
with 32px vertical margin above and below the divider.

---

## 5. Per-foundation visual scale specifications

### Colours — Primitives

Display colour families as horizontal rows.

- One row per colour family (Orange, Brick, Charcoal, Cloud, Green, Red, Yellow, Blue)
- Family label on the left: Inter 500, 0.875rem, `var(--color-text-secondary)`, 80px wide,
  vertically centred with the swatches
- Swatches run left to right: 50 → 100 → 200 → 300 → 400 → 500 → 600 → 700 → 800 → 900
- Each swatch: 64px wide × 64px tall, border-radius `var(--radius-sm)`
- Below each swatch: stop number (e.g. "500") at 0.75rem Inter 400 `--color-text-secondary`,
  then hex value at 0.75rem Inter 400 `--color-text-secondary`
- The ★ (star) default stop for each family gets a 2px solid border using
  `var(--color-border-strong)` to visually mark the primary stop
- No contrast ratio badges anywhere on the Primitives story
- Search field: yes — filters by hex value or stop number

### Colours — Semantic Tokens

Display semantic tokens as a labelled grid grouped by category
(Brand, Background, Text, Border, Interactive, Nav, Status).

- Category heading: section-title size (1.25rem Inter 600)
- Each token card: background `var(--color-bg-surface)`, padding 16px,
  border-radius `var(--radius-md)`, border 1px solid `var(--color-border-default)`
- Token card contents: colour swatch (48×48px, border-radius `var(--radius-sm)`),
  token name in monospace 0.875rem, role description in Inter 400 0.875rem,
  resolved hex value in Inter 400 0.75rem `--color-text-secondary`
- No contrast ratio badges anywhere
- Cards sit in a CSS grid: repeat(auto-fill, minmax(240px, 1fr)), gap 16px
- Search field: yes

### Icons — Gallery

- Icons in a CSS grid: repeat(auto-fill, minmax(120px, 1fr)), gap 4px
- Grouped by category with a section-title heading (1.25rem Inter 600) above each group
- Each icon cell: padding 16px, border-radius `var(--radius-md)`,
  background on hover `var(--color-bg-surface)`, centered layout
- Icon rendered at lg size (24px), colour `var(--color-text-primary)`
- Below the icon: display name in Inter 500 0.8125rem `--color-text-primary`
  (e.g. "Phone Call")
- Below that: Lucide component name in monospace 0.75rem `--color-text-secondary`
  (e.g. "PHONECALL") — always present, never omit
- Search field: yes — filters by display name or component name. Shows live count.

### Typography — Type Specimen

- Each token on its own row: token name (monospace 0.875rem left column, 200px wide),
  spec summary (Inter 400 0.875rem secondary colour, 280px wide),
  then a live text sample rendered at that exact token's size, weight, line-height,
  and tracking using the correct font family
- Sample text: use realistic Quicklo copy — not "Lorem ipsum"
- Rows separated by 1px divider `var(--color-border-subtle)`
- No search field needed

### Spacing — Scale

- Each token on its own row: token name (monospace), px value, then a filled bar
  (height 20px, background `var(--color-brand-tint)`, border-radius `var(--radius-xs)`)
  whose width equals the token's px value — visualises the scale
- Below the bar: usage note in caption size
- No search field needed

### Radius — Scale

- Show all 7 radius tokens as a horizontal row of equal-sized squares (64×64px each)
- Each square: background `var(--color-brand-tint)`, border 2px solid `var(--color-brand-btn)`,
  border-radius set to that token
- Token name and px value below each square at caption size
- No search field needed

### Opacity — Scale

- Each step as a row: token name, value percentage, then a swatch showing
  `var(--color-brand-btn)` at that opacity level (48px × 24px rectangle)
- The `--opacity-disabled` semantic alias gets a highlighted row with a label "Semantic alias"
- No search field needed

### Elevation — Scale

- Each level as a card (200px × 80px) showing the shadow on `var(--color-bg-surface)` background
- Token name and usage role below each card
- No search field needed

### Motion — Duration scale, Easing curves, Live demos, Reference table

- Duration scale: table format (token | value | group | usage)
- Easing curves: table format (token | CSS value | when to use) + a small animated
  preview ball for each curve demonstrating the easing on hover/click
- Live demos: brief animated examples showing each easing token in action on a moving element
- Reference table: all motion tokens consolidated
- No search field needed

### Breakpoints

- Visual demo of the 4 breakpoints (sm/md/lg/xl) as labelled vertical bars with
  the px value and a descriptive label
- A live resize demo if feasible
- No search field needed

### Loaders

- Each loader variant (Spinner sm/md/lg, Skeleton line/paragraph/card, Progress bar,
  Pulse dot) shown with its name and the "when to use" rule
- No search field needed

---

## 6. Reference table format

Every Foundation story and every Component story ends with a Reference Table section.
This is non-negotiable — it is the machine-readable record of what a story documents.

Table columns for token/design-value tables:

| TOKEN | VALUE | USAGE |
|---|---|---|
| `--token-name` | resolved value | one-line usage description |

Table columns for component prop tables:

| PROP | TYPE | DEFAULT | DESCRIPTION |
|---|---|---|---|
| propName | type | default | description |

Table visual rules:
- Table background: `var(--color-bg-surface)`
- Header row background: `var(--color-bg-secondary)`, text Inter 500 0.875rem
  `var(--color-text-secondary)`, uppercase, letter-spacing +0.04em
- Body row text: Inter 400 0.875rem `var(--color-text-primary)`
- Token names in body rows: monospace 0.875rem
- Alternating row background: every other row uses `var(--color-bg-primary)` —
  a very subtle stripe
- Row height: minimum 44px
- Cell padding: 12px 16px
- Table is full width within the content container (max 1200px)
- No external borders on the table itself — only internal row dividers using
  `var(--color-border-subtle)`

---

## 7. Inline styles — required for all Foundation stories

Foundation stories (anything under `src/components/foundations/`) must use inline styles only.
No Tailwind classes in Foundation story files.

Component stories (under `src/components/ui/`) may use Tailwind utility classes, but all
colour values must reference CSS token variables, never literal Tailwind colour classes.

Reason: Foundation stories document the tokens themselves, so they must not depend on
those tokens being processed by Tailwind — they must work even if the Tailwind build
changes. Inline CSS token variables are always resolved by the browser.

---

## 8. Accessibility in stories

- Icon cells in galleries: aria-label set to the icon display name
- Decorative swatches: aria-hidden="true"
- Light/Dark toggle buttons: aria-pressed attribute matching current state
- Search inputs: aria-label="Search [content type]"
- Interactive demo elements (motion, loaders): respect `prefers-reduced-motion` via the
  system-level token in globals.css — no per-story motion handling needed

---

## 9. What Claude Code must do before writing any story file

1. Read this file (STORYBOOK-style-guide.md) in full
2. Read docs/CLAUDE-reference.md
3. Read src/design-system/tokens/globals.css to confirm current token names
4. If editing an existing story: read the current story file before making any changes
5. Copy the `StoryFrame` pattern from Section 1 into the file (or confirm it is already
   present and correctly implemented) BEFORE writing any section content
6. After writing or editing a story, run through this exact verification — do not
   skip any line, and do not mark the story done until every line is confirmed:
   - Search the file for the literal string `layout: 'centered'` — if found, this is
     a bug, remove it and replace with `layout: 'fullscreen'`
   - Search the file for the literal string `layout: 'padded'` — if found, this is
     a bug, remove it and replace with `layout: 'fullscreen'`
   - Search the file for `margin: 'auto'` or `margin: '0 auto'` on any top-level
     content wrapper — if found, this is a centering bug, remove it
   - Search the file for any `maxWidth` set on the outermost content wrapper — if
     found and it constrains the page below full canvas width, this is a bug, remove it
   - Confirm a `StoryFrame` function (or equivalently named local wrapper following
     the exact pattern in Section 1) exists in the file and every story's render
     output is wrapped in it
   - Confirm the `isDark` toggle buttons are present in the rendered output of every
     single story export in the file — not just the first one
   - Confirm no hardcoded hex, no px font sizes, no contrast ratio badges
   - Confirm the search field is present where required (8+ items) and absent where
     not required

---

## 10. Quick checklist — before committing any story file

- [ ] `parameters.layout` is `'fullscreen'` — never `'centered'`, never `'padded'`
- [ ] `StoryFrame` wrapper (per Section 1) is present and wraps every story's content
- [ ] Light/Dark switcher renders inside `StoryFrame`, is present and functional on
      EVERY story export in the file, not just one
- [ ] Toggling Dark visibly changes the rendered colours of every demo in the story —
      if something does not change, find and fix the hardcoded value causing it
- [ ] Content fills full canvas width — no centered max-width wrapper, no stray
      `margin: auto`, no constraining `maxWidth` on the outer content container
- [ ] Major sections (header, gallery, usage guide, reference table) stack vertically,
      top to bottom — never arranged side-by-side as page-level columns
- [ ] Spacing between sections is at least 48px — content breathes, nothing stacked tight
- [ ] Search field present (if 8+ items), wired to the same controls row as the toggle
- [ ] Canvas background is `var(--color-bg-primary)`, set on the `StoryFrame` root
- [ ] No font-size below 0.75rem anywhere
- [ ] No font-size in px — rem only
- [ ] No hardcoded hex colour values
- [ ] No contrast ratio badges
- [ ] All spacing multiples of 4px
- [ ] Reference table present
- [ ] Icon cells show both display name and Lucide component name
- [ ] Colour primitive rows are horizontal (50 → 900, left to right)
- [ ] Info boxes used where content benefits from visual grouping
- [ ] Story tested in both Light and Dark mode before marking done — actually click
      the toggle, do not assume it works because the code looks right
