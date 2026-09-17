# Quicklo — Colour System

> **Status:** Locked. This document is the authority for colour decisions, token names, hex values, and usage rules. `src/design-system/tokens/globals.css` *implements* this document. If the two ever disagree, this file describes the intent and globals.css must be corrected to match.
>
> **Maintenance:** When a colour token changes, update (1) `globals.css`, (2) this file, (3) `Colours.stories.js`, and (4) add a `DECISIONS.md` line. All four, same commit.

---

## 1. Two-layer architecture

Quicklo uses a strict two-layer colour system.

- **Layer 1 — Primitives.** The raw palette: every colour that exists, in 8 named groups with numbered stops (50–900). Defined in `@theme {}` inside `globals.css`. Named `--primitive-[group]-[stop]`. **Never referenced directly in components.**
- **Layer 2 — Semantic tokens.** The usage layer: each token's name describes its *role*, not its colour. Defined in `:root` (light) and `.dark` (dark). Named `--color-[group]-[role]`. References primitives via `var(--primitive-*)`. **These are what components use.** Dark mode = swapping semantic values in `.dark`.

```css
/* Layer 1: primitive defined in @theme */
--primitive-brick-500: #c2410c;
--primitive-orange-500: #fb923c;

/* Layer 2: semantic token references primitive */
:root { --color-brand-btn: var(--primitive-brick-500); } /* light */
.dark { --color-brand-btn: var(--primitive-orange-500); } /* dark  */

/* Component uses the semantic token only */
.btn-primary {
  background: var(--color-brand-btn);       /* ✓ correct */
  /* background: #c2410c;                       ✗ NEVER — hardcoded hex */
  /* background: var(--primitive-brick-500);    ✗ NEVER — primitive in component */
}
```

---

## 2. Primitive groups (Layer 1)

8 groups, each with stops 50–900. ★ marks the anchor stop.

| Group | Role in system | Anchor |
|---|---|---|
| **Orange** | Warm brand. Dark-mode interactive + dark-mode brand button. | 500 = `#fb923c` |
| **Brick** | Deep burnt brand. Light-mode interactive + light-mode brand button. | 500 = `#c2410c` |
| **Cloud** | Light neutrals. Page backgrounds, surfaces, subtle borders. | 50 = `#ffffff`, 500 = `#f3f3f3` |
| **Charcoal** | Dark neutrals. Dark-mode backgrounds, surfaces, borders. | 700 = `#1e1e1e`, 900 = `#121212` |
| **Green** | Success. Badge fills, title text, card tints. | 500 = `#15803d` |
| **Red** | Error. Badge fills, title text, card tints. | 500 = `#b91c1c` |
| **Yellow** | Warning. Yellow tones — **NOT** orange. | 500 = `#fbbf24` |
| **Blue** | Info only. **Not a brand colour.** | 500 = `#0369a1` |

### Full primitive scales

**Orange** — 50 `#fff4ec` · 100 `#feddc3` · 200 `#fdcda5` · 300 `#fcb67c` · 400 `#fca863` · **500★ `#fb923c`** · 600 `#e48537` · 700 `#b2682b` · 800 `#8a5021` · 900 `#693d19`

**Brick** — 50 `#f9ece7` · 100 `#ecc4b4` · 200 `#e3a88f` · 300 `#d6805c` · 400 `#ce673d` · **500★ `#c2410c`** · 600 `#b13b0b` · 700 `#8a2e09` · 800 `#6b2407` · 900 `#511b05`

**Cloud** — **50★ `#ffffff`** · 100 `#fbfbfb` · 200 `#f9f9f9` · 300 `#f7f7f7` · 400 `#f5f5f5` · **500★ `#f3f3f3`** · 600 `#dddddd` · 700 `#adadad` · 800 `#868686` · 900 `#666666`

**Charcoal** — 50 `#eaeaea` · 100 `#bdbdbd` · 200 `#9d9d9d` · 300 `#707070` · 400 `#555555` · 500 `#2a2a2a` · 600 `#262626` · **700★ `#1e1e1e`** · 800 `#171717` · **900★ `#121212`**

**Green** — 50 `#e8f2ec` · 100 `#b6d8c3` · 200 `#93c5a6` · 300 `#62aa7d` · 400 `#449964` · **500★ `#15803d`** · 600 `#137438` · 700 `#0f5b2b` · 800 `#0c4622` · 900 `#09361a`

**Red** — 50 `#f8e8e8` · 100 `#e9b9b9` · 200 `#df9797` · 300 `#d06767` · 400 `#c74949` · **500★ `#b91c1c`** · 600 `#a81919` · 700 `#831414` · 800 `#660f0f` · 900 `#4e0c0c`

**Yellow** — 50 `#fff9e9` · 100 `#feebbb` · 200 `#fde29a` · 300 `#fcd46c` · 400 `#fccc50` · **500★ `#fbbf24`** · 600 `#e4ae21` · 700 `#b2881a` · 800 `#8a6914` · 900 `#69500f`

**Blue** — 50 `#e6f0f6` · 100 `#b1d1e2` · 200 `#8bbad4` · 300 `#569bc0` · 400 `#3587b4` · **500★ `#0369a1`** · 600 `#036093` · 700 `#024b72` · 800 `#023a59` · 900 `#012c44`

---

## 3. Semantic tokens (Layer 2)

Light/Dark columns show the **primitive each token references** (and its resolved hex).

### Brand

| Token | Light | Dark | Role |
|---|---|---|---|
| `--color-brand-btn` | brick-500 `#c2410c` | orange-500 `#fb923c` | Brand button fill |
| `--color-brand-btn-text` | cloud-50 `#ffffff` | charcoal-900 `#121212` | Text on brand button |
| `--color-brand-tint` | orange-50 `#fff4ec` | charcoal-600 `#262626` | Active bg / tag bg. Also DateTimePicker's in-range calendar day-cell background (never colour-alone — `aria-selected` also carries the state). **No longer consumed by Avatar** — its dark value here (charcoal-600) is empirically invisible against `--color-bg-surface` dark; Avatar has its own `--color-avatar-bg`/`-fg` pair instead as of 2026-07-08, see the Avatar tokens section below. **No longer consumed by Tabs** — the `segmented`-variant selected-segment fill was reworked 2026-07-08 to a neutral raised pill (`--color-bg-surface` + `--elevation-1`, see that token's row below); see `docs/DECISIONS.md` for the superseding entry. Also Chip's `count` variant, `tone="brand"` fill (2026-07-08) — the same AA-audited pairing this token already had. |
| `--color-brand-tint-text` | brick-500 `#c2410c` | orange-500 `#fb923c` | Text on brand tint. **No longer consumed by Avatar** — see `--color-avatar-fg` below (2026-07-08). **No longer consumed by Tabs** — see `--color-brand-tint`'s row above; superseded by `--color-text-primary` on the new raised pill. Also Chip's `count` variant, `tone="brand"` label colour (2026-07-08) — reuses the same 4.78:1 light / 6.69:1 dark pairing already audited for this token. |
| `--color-brand-tint-border` | → `color-mix(in srgb, var(--color-interactive-default) 60%, var(--color-bg-surface))` = `#da8d6d` | → `var(--color-badge-neutral-border)` = `#373737` | **New 2026-07-09 (Chip fix pass).** Border for Chip's `count` variant, `tone="brand"` ONLY — first and only consumer. Before this token existed, the brand count Chip's border was set to `--color-brand-tint` (the same value as its own fill), which is indistinguishable from having no border at all — it read flat/invisible against light page backgrounds. See below for the full derivation and the reasoning for the light/dark asymmetry. |

### Background

| Token | Light | Dark | Role |
|---|---|---|---|
| `--color-bg-primary` | cloud-500 `#f3f3f3` | charcoal-900 `#121212` | Page background |
| `--color-bg-secondary` | cloud-600 `#dddddd` | charcoal-800 `#171717` | Secondary background. Also Avatar's `fit="contain"` logo backdrop (2026-07-08, previously the `rounded`-shape backdrop — shape was dropped, the backdrop role moved to the `fit` prop) — sits behind an `object-fit: contain` image so a whole (possibly non-square, possibly transparent-PNG) business logo shows without being cropped. Also Tabs' `segmented`-variant track fill (2026-07-08). |
| `--color-bg-surface` | cloud-50 `#ffffff` | charcoal-700 `#1e1e1e` | Card / panel surface. Also Toggle thumb fill. Also Tabs' `segmented`-variant selected-segment (raised pill) fill, paired with `--elevation-1` for the shadow/dark-hairline-border (2026-07-08 redesign, supersedes `--color-brand-tint` — see that token's row above and `docs/DECISIONS.md`). |
| `--color-bg-overlay` | `rgba(0,0,0,0.4)` | `rgba(0,0,0,0.6)` | Modal overlay. Also DateTimePicker's scrim — as of the 2026-07-05 fix pass this covers both the mobile bottom sheet AND the desktop centered dialog (previously mobile-only; the desktop overlay used to be an anchored popover with no scrim). |
| `--color-bg-input` | cloud-500 `#f3f3f3` | charcoal-800 `#171717` | Input field, Checkbox, Toggle off-state resting fill, Textarea fill, Select, and DateTimePicker (trigger fill + native `<input type="date">` fill). Decoupled from `--color-bg-primary` — inputs sit inside a `--color-bg-surface` card, not the page, so this must be tunable independently of both page and surface. Dark mode uses charcoal-800 (#171717) to create a visually recessed field against the card surface (charcoal-700 #1e1e1e, 1.04:1 step). Previously charcoal-950 (#0a0a0a) — too dark, effectively invisible in the card. |

### Text

| Token | Light | Dark | Role |
|---|---|---|---|
| `--color-text-primary` | charcoal-900 `#121212` | cloud-50 `#fbfbfb` | Primary text. Also Tabs' `segmented`-variant selected-segment label (both modes) AND the light-mode unselected-segment label fallback (2026-07-08) — see the measurement note on `--color-text-secondary`'s row below. Light-mode unselected measures 13.79:1 against `--color-bg-secondary`. |
| `--color-text-secondary` | charcoal-300 `#707070` | cloud-700 `#adadad` | Secondary / muted text. Tabs' `segmented`-variant unselected-segment label, **dark mode only** (2026-07-08) — measured 7.99:1 against `--color-bg-secondary` dark, clearing AA. In light mode this token measures only **3.64:1** against `--color-bg-secondary` light (below AA 4.5:1 for text — computed via the same Node WCAG relative-luminance script used for the Badge/Alert/Avatar audits), so light-mode unselected falls back to `--color-text-primary` instead (see that row above); the raised pill + font-weight (400 vs 500) carry the selected/unselected distinction in light mode, where both now read the same colour. |
| `--color-text-tertiary` | cloud-800 `#868686` | cloud-800 `#868686` | Placeholder / hint — same both modes. Also DateTimePicker's date-range trigger placeholder ("All dates") — deliberately one step lighter than Select's `--color-text-secondary` placeholder, since a filter's "unset" state reads as a weaker hint than an unset required field. |
| `--color-text-on-interactive-primary` | cloud-50 `#ffffff` | charcoal-900 `#121212` | Text on primary (brand CTA) fill — flips per mode. Also DateTimePicker's selected calendar day-cell text (start/end). |
| `--color-text-on-interactive-secondary` | charcoal-400 `#555555` | → `--color-text-primary` `#ffffff` | Text on secondary fill. Dark mode aliases to page text so it tracks automatically — white on dark fills; 7.45:1 / 4.96:1 / 14.35:1 (default/hover/active). All AA ✅. |
| `--color-text-on-interactive-error` | cloud-50 `#ffffff` | cloud-50 `#ffffff` | Text on destructive fill — **always white, mode-invariant**. Both modes reference the same primitive. Fixes near-black-on-red in dark mode. |

### Border

| Token | Light | Dark | Role |
|---|---|---|---|
| `--color-border-default` | cloud-600 `#dddddd` | charcoal-500 `#2a2a2a` | Default border. Also Checkbox, Toggle, Textarea, Select, and DateTimePicker (trigger + manual-entry date input) resting border (matching Input — deliberate design call, see DECISIONS.md 2026-06-20). Knowingly below WCAG 1.4.11 vs `--color-bg-input`; same accepted trade as Input Fix 2. |
| `--color-border-subtle` | cloud-500 `#f3f3f3` | charcoal-700 `#1e1e1e` | Subtle / barely-there border |
| `--color-border-strong` | cloud-700 `#adadad` | charcoal-400 `#555555` | Strong border / divider. Also Checkbox, Toggle, Textarea, and Select hover border on pointer devices (matching Input); also DateTimePicker's trigger hover border and the calendar's unselected "today" day-cell ring. |
| `--color-border-input` | cloud-800 `#868686` | charcoal-300 `#707070` | Input field resting border — passes WCAG 1.4.11 (3:1 non-text) vs `--color-bg-primary` in both modes. Light: 3.27:1 vs bg-primary · 3.63:1 vs bg-surface. Dark: 3.78:1 vs bg-primary · 3.37:1 vs bg-surface. Also Toggle off-state thumb fill (fix pass 2026-06-20): #868686 light / #707070 dark vs off-state track `--color-bg-input` = 3.28:1 light / 3.62:1 dark ✅ WCAG 1.4.11 — this is the "potential future use" the token was retained for since the 2026-06-18 Input build. |
| `--color-border-input-hover` | cloud-900 `#666666` | charcoal-200 `#9d9d9d` | Input field hover border (pointer devices only). Light: 5.17:1 vs bg-primary. Dark: 6.91:1 vs bg-primary. Token exists and is unused by any shipped component as of 2026-06-20 — retained for potential future use; removal is Marko's call. |

### Interactive

| Token | Light | Dark | Role |
|---|---|---|---|
| `--color-interactive-default` | brick-500 `#c2410c` | orange-500 `#fb923c` | CTA / primary button fill. Also Toggle on-state track fill, and DateTimePicker's selected calendar day-cell fill (start/end). Also Tabs' `line`-variant active-tab 2px bottom-border indicator (2026-07-08). |
| `--color-interactive-hover` | brick-600 `#b13b0b` | orange-400 `#fca863` | Primary button hover. Also Toggle on-state track hover fill. |
| `--color-interactive-active` | brick-700 `#8a2e09` | orange-600 `#e48537` | Primary button pressed |
| `--color-interactive-secondary` | charcoal-50 `#eaeaea` | charcoal-400 `#555555` | Secondary button fill (resting) — light: muted grey; dark: genuinely dark, recessive fill |
| `--color-interactive-secondary-hover` | cloud-600 `#dddddd` | charcoal-300 `#707070` | Secondary button hover — lighter in both modes ("lift") |
| `--color-interactive-secondary-active` | cloud-700 `#adadad` | charcoal-500 `#2a2a2a` | Secondary button pressed — darker in both modes ("push") |
| `--color-interactive-error` | red-500 `#b91c1c` | red-500 `#b91c1c` | Destructive button fill (same hex both modes, matches `--color-status-error` convention) |
| `--color-interactive-error-hover` | red-600 `#a81919` | red-600 `#a81919` | Destructive button hover (same both modes) |
| `--color-interactive-error-active` | red-700 `#831414` | red-700 `#831414` | Destructive button pressed (same both modes) |
| `--color-focus-ring` | → `#c2410c` | → `#fb923c` | Focus ring colour — alias to `--color-interactive-default`; auto-flips per mode, no new primitive. Consumed by Input, Checkbox, Toggle, Select, and DateTimePicker's trigger as the border-only focus indicator (no box-shadow ring). Also Tabs (2026-07-08) — not redeclared directly in `Tabs.jsx`, but relies on the global `*:focus-visible` rule in `globals.css` (keyed to `--color-brand-btn`, which resolves to the identical primitive as this token in both modes), the same "rely on the global default" pattern Input/Checkbox/Toggle/IconButton already use. |

> **WCAG AA — secondary light mode ladder:**
> `--color-text-on-interactive-secondary` (`charcoal-400 #555555`) on `--color-interactive-secondary` (`charcoal-50 #eaeaea`): **4.67:1** ✅
> `--color-text-on-interactive-secondary` on `--color-interactive-secondary-hover` (`cloud-600 #dddddd`): **3.29:1** ⚠ below AA 4.5:1 — accepted: hover is a transient state, not a resting legibility context.
> `--color-text-on-interactive-secondary` on `--color-interactive-secondary-active` (`cloud-700 #adadad`): **1.68:1** ⚠ — accepted: active/pressed is momentary (50ms), not a readable state.

> **Secondary default vs bg-primary — known, deliberately deferred limitation (light mode):**
> `--color-interactive-secondary` (charcoal-50 `#eaeaea`, L=0.823) vs `--color-bg-primary` (cloud-500 `#f3f3f3`, L=0.896) = **1.08:1** contrast. The secondary button is nearly invisible when placed directly on the page background outside a surface card. **Accepted:** secondary is always used inside cards/modals where the bg-surface background makes it visible. Do not "fix" by darkening the default fill without Marko review.

> **Secondary dark mode ladder — design rationale:**
> Dark mode uses charcoal-400 (default `#555555`) · charcoal-300 (hover `#707070`, lighter = "lift") · charcoal-500 (active `#2a2a2a`, darker = "push"). This mirrors the hover-lightens/active-darkens shape Primary already uses in dark mode (orange-400/500/600). Text aliases to `--color-text-primary` (white, `#ffffff`). White text AA: default 7.45:1 ✅ · hover 4.96:1 ✅ · active 14.35:1 ✅. Fill vs bg-surface: hover 3.36:1 · default 2.24:1 (intentionally recessive) · active 1.16:1 (50ms momentary state only). Design intent: Secondary must read as quiet and recessive relative to Primary's orange in dark mode — dark fills achieve this, where the previously-tried light fills (charcoal-50/100/200) read as a competing bright element.

> **Ghost variant — brand-coloured text, no fill, no underline:**
> Ghost has no fill, so its text sits against the page/surface behind it — not an interactive surface. Ghost uses `--color-interactive-default` as the default text colour (brand-coloured from first render), shifts to `-hover` on hover and `-active` on press. No underline in any state. All 12 combinations (3 states × 2 modes × 2 backgrounds) pass AA: light 5.18:1/5.99:1/8.48:1, dark 7.36:1/8.67:1/6.12:1 (vs bg-surface). Does not use a `--color-text-on-interactive-*` token — that pattern is for buttons with filled backgrounds.
>
> **Clarification (2026-07-07):** clickable running/label text anywhere in the system — not just standalone Ghost buttons — uses `--color-interactive-default` by default. No "orange-as-text is prohibited near status colour" rule exists at the token/system level; a component-local override away from it (e.g. Toast's action label, see `docs/DECISIONS.md`) is a compositional choice made at the point of use, not a colour-system rule.

### Nav

| Token | Light | Dark | Role |
|---|---|---|---|
| `--color-nav-inactive` | cloud-800 `#868686` | charcoal-200 `#9d9d9d` | Inactive nav icons |

### Status — badge fills (identical both modes, no `.dark` override — except neutral, see below)

| Token | Primitive | Hex | Glyph on top |
|---|---|---|---|
| `--color-status-success` | green-500 | `#15803d` | white |
| `--color-status-error` | red-500 | `#b91c1c` | white |
| `--color-status-warning` | yellow-500 | `#fbbf24` | **dark** |
| `--color-status-info` | blue-500 | `#0369a1` | white |
| `--color-status-neutral` | charcoal-300 light / charcoal-200 dark | `#707070` / `#9d9d9d` | white |

`--color-status-neutral` is the ONLY status fill with a per-mode override — needed for 3:1 dot-vs-chip contrast (`--color-status-neutral` vs `--color-bg-secondary`, WCAG 1.4.11) in both light and dark; a single fixed value couldn't clear 3:1 in both modes at once, unlike the other four tones. There is no `--color-status-neutral-text` token: neutral status text reuses `--color-text-secondary` rather than a dedicated status-text token.

### Badge tokens — soft-tint pill fill/border

Badge (the rework superseding its original grey-chip build) does not use `--color-status-*` directly as its fill — it uses a derived family, `--color-badge-{tone}-bg` / `--color-badge-{tone}-border`, computed via CSS `color-mix()` against `--color-bg-surface`:

```css
--color-badge-{tone}-bg:     color-mix(in srgb, var(--color-status-{tone}) 14%, var(--color-bg-surface));
--color-badge-{tone}-border: color-mix(in srgb, var(--color-status-{tone}) 30%, var(--color-bg-surface));
```

> **2026-07-06 fix pass — corrects a bug in the above.** This formula must be declared **separately in both `:root` and `.dark`**, not once in `:root` as originally shipped. The earlier assumption — "both inputs already flip per mode, so one declaration auto-adapts" — is wrong: a custom property's `var()` substitution is baked in at the selector where the property is *declared*, and that already-resolved value is what descendants inherit; it is not re-substituted per descendant using that descendant's own cascade. Confirmed with a minimal repro: `--probe-derived: color-mix(in srgb, var(--probe-input) 50%, white)` declared only at `:root`, with `--probe-input` overridden inside a nested `.probe-dark` div, still resolved using `:root`'s `--probe-input` when read from inside `.probe-dark` — even though `--probe-input` itself, queried directly, correctly showed the overridden value on that same element. This is exactly what was happening to Badge: `--color-bg-surface` read correctly as its dark hex on badges inside a `.dark` canvas, yet the badges' rendered `background-color` stayed frozen at the light-mode result, because `--color-badge-{tone}-bg` was declared only once, at `:root`. **Fix:** the identical formula is now re-declared inside `.dark`, so it bakes fresh there using `.dark`'s own `--color-status-{tone}` / `--color-bg-surface`. Zero new primitives either way.

Percentages are per-tone, not uniform, and (for neutral's border) now differ between light and dark:

| Tone | bg % (light / dark) | border % (light / dark) | `-bg` resolved (light / dark) | `-border` resolved (light / dark) |
|---|---|---|---|---|
| success | 14% / 14% | 30% / 30% | `#deede4` / `#1d2c22` | `#b9d9c5` / `#1b3b27` |
| warning | 14% / 14% | 30% / 30% | `#fef6e0` / `#3d351f` | `#feecbd` / `#604e20` |
| error | 14% / 14% | 30% / 30% | `#f5dfdf` / `#341e1e` | `#eabbbb` / `#4d1d1d` |
| info | 14% / 14% | 30% / 30% | `#dceaf2` / `#1a2930` | `#b3d2e3` / `#163545` |
| neutral | **8%** / **8%** (reduced from 14%) | 30% / **20%** | `#f4f4f4` / `#282828` | `#d4d4d4` / `#373737` |

**Text-on-badge contrast audit (WCAG AA, 4.5:1 minimum, label text `--text-body-md` 14px):**

| Tone | Label/icon/dot colour | Light contrast vs `-bg` | Dark contrast vs `-bg` |
|---|---|---|---|
| success | `--color-status-success-text` | 6.80:1 ✅ | 5.27:1 ✅ |
| warning | `--color-status-warning-text` (yellow-800, changed — see below) | 4.74:1 ✅ | 8.55:1 ✅ |
| error | `--color-status-error-text` | 7.95:1 ✅ | 6.67:1 ✅ |
| info | `--color-status-info-text` | 7.59:1 ✅ | 4.88:1 ✅ |
| neutral (label) | `--color-text-secondary` | 4.50:1 ✅ (at 8%) | 6.57:1 ✅ |
| neutral (icon/dot) | `--color-status-neutral` | 4.50:1 ✅ | 5.44:1 ✅ (non-text 3:1 min, cleared with margin) |

Two tones needed adjustment from the 14%/30% starting values, both unchanged by this fix pass:

- **Neutral:** at the starting 14% `-bg` mix, `--color-text-secondary` (the label colour) fell to 4.15:1 in light mode — below AA. Reducing the `-bg` mix to 8% raised it to 4.50:1. Neutral is also the one tone where label and indicator use *different* tokens: label is `--color-text-secondary` (safe AA, no dedicated status-text token exists for neutral), while the icon/dot uses `--color-status-neutral` — never the reverse, and never `--color-status-neutral` for the label. **New in this fix pass:** neutral's `-border` percentage is now asymmetric — 30% in light (unchanged, approved, `#d4d4d4`) but **20% in dark** (`#373737`, down from 30%'s `#444444`). This isn't a contrast fix (border has no text-contrast requirement); at 30%, the dark border read visibly too heavy against the much-lighter 8% dark fill it surrounds — 20% keeps the two proportionate. Light was left untouched.
- **Warning — token value changed, component override removed.** `--color-status-warning-text` was yellow-700 (`#b2881a`), which only clears **3.27:1** against pure white — a hard ceiling that no amount of `-bg` lightening can cross (verified: even at a 2% mix, contrast only reaches ~3.24:1, converging toward the pure-white value as the mix approaches 0%). The original Badge build worked around this with a component-local override — warning's label/icon/dot used `--color-text-primary` instead of `--color-status-warning-text`. **This fix pass removes that override and fixes the token itself:** `--color-status-warning-text` light is now yellow-800 (`#8a6914`), clearing 4.74:1 against the badge's own warning `-bg` (and 5.11:1 against pure white); dark is unchanged (yellow-300, `#fcd46c`, already 8.55:1). Warning now follows the exact same "reuse `-text` for label+icon+dot" pattern as success/error/info — no per-tone exception left in the component. The token's other consumers (a couple of Storybook annotation callouts in `Button.stories.jsx`/`Input.stories.jsx`, not a built product component) are unaffected in intent — they still read as a dark-amber warning colour, just very slightly darker.

> **Colours.stories.jsx maintenance-rule compliance:** `--color-status-warning-text`'s light swatch (`lhex`) was updated to `#8a6914` in the same pass as the token change, per the Maintenance rule's "same commit" requirement. The `--color-badge-*` family itself still has no separate swatch entry — it has no independent visual identity outside the Badge component, whose own Storybook token reference table documents the resolved hex instead.

**Also consumed by Chip (2026-07-08).** Chip's `status` variant reuses this exact `--color-badge-{tone}-bg`/`-border` family (all 5 tones) plus `--color-status-{tone}-text`/`--color-status-neutral` for its label/icon/dot — zero new colour tokens, and zero duplicated resolution logic: Chip imports Badge's own tone → token maps directly from `Badge.jsx` rather than re-deriving them. Chip's `count` variant additionally reuses `--color-brand-tint`/`-text` (its `tone="brand"`) — see that token's row in the Brand table above.

### Pagination — consumed tokens (2026-07-10 fix pass, ZERO new tokens — supersedes the 2026-07-09 build below)

Pagination adds **no new colour token** — every colour it uses is an existing, already-audited token reused from another component's own precedent:

- **Active page (2026-07-10 — replaces the original orange-fill treatment):** a neutral contained chip — `--color-bg-secondary` fill / 1px `--color-border-strong` border / `--color-text-primary` text, Inter 600, always `--radius-sm`. No longer uses `--color-interactive-default` or `--color-text-on-interactive-primary` — the active page reads too aggressive as a brand-fill element and is now visually static (no hover restyle; it's the current page, not a navigable target).
- Inactive page (rest): `--color-text-secondary`. Inactive page (hover): text-only shifts to `--color-text-primary`, no fill — the `IconButton` `plain` colour-shift pattern (changed from the original `ghost`-style hover-fill, so the active chip stays the only filled element in the row).
- Ellipsis: `--color-text-tertiary` (decorative, `aria-hidden`).
- `table` variant's top divider: `--color-border-default`.
- Disabled (bounds, or the whole set): `--opacity-disabled` — never a colour token, per the locked "no `--color-*-disabled` token" rule.
- Range/page readout text: `--color-text-secondary`.
- Focus: the global `*:focus-visible` rule — not redeclared, same as Input/Checkbox/Toggle/IconButton/Tabs.

No `Pagination`-specific token family exists (unlike Badge/Alert/Avatar, which each needed a derived `color-mix()` family) — this component's whole colour surface is composed controls (`Button`/`IconButton`/`Select`/`Input`) plus the reused tokens above.

### Chip tokens — brand count border (2026-07-09 fix pass)

`--color-brand-tint-border` is a new token, added specifically to fix a real visibility bug: the brand count Chip's border was set to `--color-brand-tint` — the exact same value as its own fill — which is indistinguishable from having no border at all, and read flat/invisible against light page backgrounds. The neutral count Chip already had a real border (`--color-badge-neutral-border`); brand had none in practice.

```css
/* :root — light */
--color-brand-tint-border: color-mix(in srgb, var(--color-interactive-default) 60%, var(--color-bg-surface));

/* .dark — NOT a re-mixed orange; see below for why */
--color-brand-tint-border: var(--color-badge-neutral-border);
```

**Light: a soft, desaturated `color-mix()`, not a raw primitive stop.** The brief called for "a light orange border... clearly visible but soft," ~2–3:1 non-text contrast. A raw, full-strength primitive (even `--primitive-orange-500`, which happens to measure 2.26:1 against `--color-bg-surface`) was rejected because contrast ratio alone doesn't capture "loudness" — a fully-saturated orange at that ratio still reads as vivid/bold (it's literally the same hue used for the brand button), which fights the "soft hairline" intent. Mixing `--color-interactive-default` (brick-500 light) into `--color-bg-surface` desaturates it toward the surface colour, giving a genuinely muted, pastel border. Percentages tried (all via the same Node WCAG relative-luminance script used for every other colour audit in this file, checked against BOTH `--color-bg-surface` and `--color-bg-primary` since a Chip can sit on either):

| Mix % | Resolved hex | Contrast vs `--color-bg-surface` | Contrast vs `--color-bg-primary` |
|---|---|---|---|
| 30% | `#edc6b6` | 1.57:1 | 1.42:1 |
| 50% | `#e0a086` | 2.19:1 | 1.98:1 |
| **60%** | **`#da8d6d`** | **2.62:1** ✅ | **2.36:1** ✅ |

30% and 50% both landed under the 2:1 floor of the target range in at least one background context; 60% clears 2:1 against both, and lands centrally in the requested ~2–3:1 band rather than right at its edge — chosen over pushing higher (which starts to reapproach the "loud, full-strength orange" look the mix was meant to avoid). This is a non-text hairline, so the stricter WCAG 1.4.11 3:1 non-text-UI-component minimum doesn't strictly apply (that's for meaningful UI boundaries/controls; a Chip's border is decorative reinforcement, the same footing as `--color-badge-neutral-border`, which itself measures a softer ~1.3–1.5:1 by design) — 60% was picked to be genuinely visible per the brief's explicit ask, without chasing a 3:1 non-text-component threshold this decorative use doesn't require.

**Dark: deliberately grey, not a re-mixed orange.** Marko's call: orange-on-dark reads too hot for a border/hairline role (as opposed to a fill, where dark-mode orange is already the established brand colour everywhere else). Rather than invent a second dark-mode mixing formula, `--color-brand-tint-border` aliases directly to `--color-badge-neutral-border` in `.dark` — this guarantees the brand and neutral count Chips render an *identical* grey hairline in dark mode (not just a similar one), and automatically stays in sync if `--color-badge-neutral-border`'s dark value ever changes. This is a different mechanism from the color-mix "must re-declare in both `:root` and `.dark`" rule documented throughout this file (Badge/Alert/Avatar) — that rule applies when the *same* `color-mix()` formula needs to resolve differently per mode; here, dark isn't a `color-mix()` at all, it's a plain `var()` alias, so there's nothing to re-bake. (The alias itself still needs writing inside `.dark`, same as any other per-mode token — see `--color-focus-ring`'s identical "alias, not a mix, declared per mode" shape in the Interactive table above.)

**First and only consumer:** Chip's `count` variant, `tone="brand"` border. No other component uses this token.

### Alert tokens — tone-tinted surface fill/border (2026-07-07)

Alert (the persistent/standing status component — see `docs/DOC-product-architecture.md`) does not use `--color-status-*` or the legacy `--color-status-*-bg` tint directly as its fill. Like Badge, it uses its own derived family via `color-mix()`, same formula shape as the Badge tokens above:

```css
--color-alert-{tone}-bg:     color-mix(in srgb, var(--color-status-{tone}) {P}%, var(--color-bg-surface));
--color-alert-{tone}-border: color-mix(in srgb, var(--color-status-{tone}) 24%, var(--color-bg-surface));
```

**Declared separately in both `:root` and `.dark`, same as Badge** — not "defined once, no `.dark` override needed" (an earlier build brief's stated assumption for this exact token family, which conflicts with the empirically-confirmed `color-mix()` baking behaviour documented in the Badge section above and in `CLAUDE.md`'s Badge sizing row; the Badge fix pass is the reason this project knows single-declaration color-mix doesn't auto-adapt to `.dark`, and Alert deliberately does not repeat that bug). Only one of the two `color-mix()` operands actually differs by mode for these four tones (`--color-bg-surface` flips; `--color-status-{tone}` itself is the same hex both modes for success/error/warning/info — only `--color-status-neutral`, which Alert doesn't use, has a per-mode override) — but the baking-in behaviour applies regardless of how many operands change, so the re-declaration is required either way.

**Percentages are per-tone, not uniform** — this is a large surface (a full alert card, not a small pill), so it must read visibly subtler than Badge's 14%/30%. Computed via the same Node WCAG relative-luminance script used for the Badge audit (not eyeballed), checking both the title (`--color-status-{tone}-text`) and the description (`--color-text-secondary`) against the resulting `-bg`, in both modes — description is the tighter constraint in every tone, exactly as it was for Badge's neutral case:

| Tone | bg % | border % | `-bg` resolved (light / dark) | `-border` resolved (light / dark) | Title contrast (light / dark) | Description contrast (light / dark) |
|---|---|---|---|---|---|---|
| success | 7% | 24% | `#eff6f1` / `#1d2520` | `#c7e1d0` / `#1c3625` | 7.50:1 / 5.66:1 | 4.51:1 / 7.00:1 |
| error | 5% | 24% | `#fcf4f4` / `#261e1e` | `#eec9c9` / `#431e1e` | 9.31:1 / 7.01:1 | 4.56:1 / 7.28:1 |
| warning | 7% | 24% | `#fffbf0` / `#2d291e` | `#fef0ca` / `#53451f` | 4.92:1 / 10.16:1 | 4.77:1 / 6.44:1 |
| info | 6% | 24% | `#f0f6f9` / `#1c2326` | `#c3dbe8` / `#18303d` | 8.55:1 / 5.21:1 | 4.54:1 / 7.13:1 |

All 8 cells clear WCAG AA 4.5:1 for text (title and description alike) in both modes — description is the binding constraint everywhere (title always clears with margin, since it's a shorter/bolder run and the same token already cleared 4.5:1+ against pure `--color-bg-surface` per the surface-level table above). Icon contrast is identical to title contrast (same `--color-status-{tone}-text` token), so it clears the WCAG 1.4.11 3:1 non-text minimum with the same margin. Border is a flat 24% for all four tones — no text sits on a border, so no contrast minimum applies there; 24% was chosen to read visibly stronger than the bg tint without approaching Badge's 30%, appropriate for a large card rather than a small pill.

Two tones needed a lower percentage than the 7% starting point to keep the description at 4.5:1 in light mode specifically (the tightest cell in every case): **error** — 7% put light-mode description at 4.40:1, just under AA; 5% clears 4.56:1. **info** — 7% put light-mode description at 4.47:1; 6% clears 4.54:1. Success and warning held at the 7% starting point without adjustment.

### Avatar tokens — monogram/icon-fallback disc fill + text (2026-07-08)

`--color-avatar-bg`/`--color-avatar-fg` are Avatar's monogram-disc fill and initials/icon colour. **This SUPERSEDES the original 2026-07-07 Avatar build's decision to reuse `--color-brand-tint`/`--color-brand-tint-text` directly (see the Brand table above and `docs/DECISIONS.md`).** Review confirmed a real legibility failure: `--color-brand-tint`'s dark value is charcoal-600 (`#262626`), which resolves to only **~1.1:1** luminance separation against `--color-bg-surface` dark (charcoal-700, `#1e1e1e`) — the disc was empirically invisible in dark mode, leaving only the orange initials floating with nothing visibly behind them.

```css
--color-avatar-bg: var(--primitive-orange-50);                                            /* light — unchanged appearance */
--color-avatar-fg: var(--primitive-brick-500);                                             /* light — unchanged appearance */

/* .dark block — REQUIRED re-declaration, same color-mix baking rule as Badge/Alert */
--color-avatar-bg: color-mix(in srgb, var(--color-interactive-default) 25%, var(--color-bg-surface));
--color-avatar-fg: var(--primitive-orange-50);
```

**Light is deliberately unchanged in appearance** — `--color-avatar-bg`/`-fg` resolve to the exact same hex the old `--color-brand-tint`/`-text` pairing already did in light mode (orange-50 `#fff4ec` / brick-500 `#c2410c`), so the previously-approved light-mode look carries over pixel-for-pixel; only dark actually changes.

**Dark is a warm, on-brand disc, not a flat colour-mix guess.** `--color-avatar-bg` mixes `--color-interactive-default` (orange-500 in dark) into `--color-bg-surface` at 25% — chosen after comparing several percentages for luminance separation against the surface:

| Mix % | Resolved hex (dark) | Separation vs `--color-bg-surface` dark |
|---|---|---|
| 15% | `#3f2f23` | 1.31:1 |
| 20% | `#4a3524` | 1.45:1 |
| **25%** | **`#553b26`** | **1.62:1** ✅ (chosen — clears the ~1.5:1 target with comfortable margin) |
| 30% | `#604127` | 1.81:1 |

`--color-avatar-fg` (dark) is `--primitive-orange-50` — a deliberate LIGHT warm tone on a DARK disc, the inverse of light mode's dark-tone-on-light-disc pairing. This is the same "which end is light vs dark flips per mode" pattern `--color-text-on-interactive-primary` already uses, not a novel mechanism.

**Contrast, both modes (WCAG relative-luminance script, same method as the Badge/Alert audits):**

| Mode | `-bg` resolved | `-fg` resolved | Contrast | AA 4.5:1 (initials are small text)? |
|---|---|---|---|---|
| Light | `#fff4ec` | `#c2410c` | **4.78:1** | ✅ |
| Dark | `#553b26` | `#fff4ec` | **9.50:1** | ✅ |

Both clear AA with real margin — dark clears it by a very large margin specifically because the fg/bg luminance gap was tuned for the disc-vs-surface separation first (25% mix), and a light-warm fg against that resulting dark-warm disc happens to land far above the 4.5:1 floor as a consequence, not by additional tuning. No `--color-border-subtle` definition ring was needed — 1.62:1 separation was judged sufficient for the disc to read as a distinct object, matching this fix pass's own ~1.5:1 target.

**Declared separately in both `:root` and `.dark`, like Badge and Alert — not `:root`-only.** Same reasoning: a `color-mix()` custom property bakes in its `var()` inputs at its declaring selector and does not re-substitute per descendant, so a single `:root` declaration would freeze dark mode at the light-mode result. See the Badge tokens section above for the original repro that established this rule.

### Chart tokens — Chart component (2026-07-10)

`--color-chart-*` is a new family for the `Chart` component (`src/components/ui/Chart/`), built on Recharts. Option-A palette: a single monochromatic brand series (`primary`/`primary-muted`) for line/bar/radial/barHorizontal/sparkline, plus a small scoped categorical ramp (`cat-1..5`) for stacked-bar/donut only. **Zero new primitives** — every stop below already exists in Layer 1.

```css
/* :root — light */
--color-chart-primary:           var(--primitive-brick-500);
--color-chart-primary-muted:     color-mix(in srgb, var(--primitive-brick-500) 22%, var(--color-bg-surface));
--color-chart-primary-fill-from: color-mix(in srgb, var(--primitive-brick-500) 24%, transparent);
--color-chart-primary-fill-to:   color-mix(in srgb, var(--primitive-brick-500) 0%, transparent);
--color-chart-cat-1..5:          brick-500 / charcoal-900 / green-500 / yellow-700 / cloud-900
--color-chart-grid:              var(--primitive-cloud-600);
--color-chart-axis:              var(--primitive-cloud-700);
--color-chart-track:             var(--primitive-cloud-500);
--color-chart-readout-bg:        var(--primitive-charcoal-900);
--color-chart-readout-text:      var(--primitive-cloud-50);

/* .dark — REQUIRED re-declaration, same color-mix baking rule as Badge/Alert/Avatar above:
   a color-mix() custom property bakes in its var() inputs at its declaring selector and
   does not re-substitute per descendant, so a :root-only declaration would freeze dark
   mode at the light-mode mix. */
--color-chart-primary:           var(--primitive-orange-500);
--color-chart-primary-muted:     color-mix(in srgb, var(--primitive-orange-500) 22%, var(--color-bg-surface));
--color-chart-primary-fill-from: color-mix(in srgb, var(--primitive-orange-500) 24%, transparent);
--color-chart-primary-fill-to:   color-mix(in srgb, var(--primitive-orange-500) 0%, transparent);
--color-chart-cat-1..5:          orange-500 / cloud-600 / green-300 / yellow-500 / charcoal-200
--color-chart-grid:              var(--primitive-charcoal-500);
--color-chart-axis:              var(--primitive-charcoal-300);
--color-chart-track:             var(--primitive-charcoal-600);
--color-chart-readout-bg:        var(--primitive-charcoal-500);
--color-chart-readout-text:      var(--primitive-cloud-100);
```

**WCAG 1.4.11 audit (Node relative-luminance script, ≥3:1 required for graphical fills, checked against `--color-bg-surface` in both modes):**

| Token | Light resolved | Light vs surface | Dark resolved | Dark vs surface |
|---|---|---|---|---|
| `chart-primary` | `#c2410c` | **5.18:1** ✅ | `#fb923c` | **7.37:1** ✅ |
| `cat-1` (= primary) | `#c2410c` | 5.18:1 ✅ | `#fb923c` | 7.37:1 ✅ |
| `cat-2` | `#121212` | **18.73:1** ✅ | `#dddddd` | **12.27:1** ✅ |
| `cat-3` | `#15803d` | **5.02:1** ✅ | `#62aa7d` | **6.01:1** ✅ |
| `cat-4` | `#b2881a` | **3.27:1** ✅ | `#fbbf24` | **9.99:1** ✅ |
| `cat-5` | `#666666` | **5.74:1** ✅ | `#9d9d9d` | **6.15:1** ✅ |
| `primary-muted` (22% mix) | `#f2d5ca` | **1.39:1** ❌ | `#4f3825` | **1.53:1** ❌ |

Every stop the original build brief flagged as a likely risk (`yellow-700`/`cat-4`, and the grey `cat-2`/`cat-5` stops) actually **passes** ≥3:1 in both modes with real margin — no stop substitution was needed anywhere in the primary/categorical set.

**`--color-chart-primary-muted` is the one deliberate, documented exception** — it fails 3:1 by design, and was left as-is rather than "fixed": this token exists specifically to render a de-emphasized ghost/comparison fill (muted bars, the prior-period dashed line) that must **never compete with the primary** per the component's own brief. Reaching 3:1 would require a 68% (light) / 54% (dark) mix — visually near-indistinguishable from the full-strength primary, which would defeat the token's entire purpose. WCAG 1.4.11 exempts graphical objects not required to understand the content: the muted fill is always a supplementary/secondary layer, never the sole carrier of a value, and `Chart`'s own visually-hidden `<table>` data mirror (plus direct value labels on `barHorizontal`/legend rows) keeps every underlying number accessible regardless of this fill's contrast. See `docs/DECISIONS.md` (2026-07-10) for the full reasoning.

`--color-chart-primary-fill-from`/`-to` (the `line` variant's optional area-gradient fill) are not contrast-checked — they're a decorative gradient wash under the line stroke, from a 24% mix down to fully transparent, never carrying a value on their own (the line stroke itself does that, at full `chart-primary` contrast).

`--color-chart-grid`/`-axis`/`-track` are structural/decorative (gridlines, axis rule, radial track background), not data-bearing fills, so they're out of this check's scope — the same treatment `--color-border-subtle` and other structural hairlines already get elsewhere in this system.

`--color-chart-readout-bg`/`-text` (the custom touch-first readout pill, not the Tooltip component) is a self-contained pairing: light `#121212`/`#ffffff` = 18.73:1, dark `#2a2a2a`/`#fbfbfb` = 13.87:1 — both clear AA with very large margin.

### Table tokens — row interaction fills (2026-07-10)

`--color-table-row-hover`/`--color-table-row-selected` are a new pair for the `Table` component (`src/components/ui/Table/`). Table is a flush (`--elevation-0`) container — unlike Card's raised `--elevation-1` surface, a table row has no shadow of its own to signal interactivity, so row hover/selection needs a dedicated background fill rather than reusing a card-level token.

```css
/* :root — light */
--color-table-row-hover:     var(--primitive-cloud-500);
--color-table-row-selected:  color-mix(in srgb, var(--color-interactive-default) 8%, var(--color-bg-surface));

/* .dark — REQUIRED re-declaration for -selected, same color-mix baking rule as
   Badge/Alert/Avatar/Chart above (a color-mix() custom property bakes in its
   var() inputs at its declaring selector and does not re-substitute per
   descendant; a :root-only declaration would freeze dark mode at the
   light-mode mix). -hover is a plain var, not a color-mix, but is still
   re-declared per mode like every other per-mode token in this file
   (--color-focus-ring, --color-brand-tint-border). */
--color-table-row-hover:     var(--primitive-charcoal-600);
--color-table-row-selected:  color-mix(in srgb, var(--color-interactive-default) 14%, var(--color-bg-surface));
```

`-hover` is a plain per-mode primitive reference (light `cloud-500 #f3f3f3`, a subtle lift over the white `cloud-50` surface; dark `charcoal-600 #262626`, a lift over the `#1e1e1e` dark surface) — decorative only, nothing functional depends on it (WCAG has no contrast requirement for a hover-only, pointer-only decorative fill).

`-selected` is a `color-mix()` derivation, and the LIGHT and DARK percentages are deliberately asymmetric — 8% light / 14% dark, not the same number in both modes. This mirrors the same reasoning Badge's neutral border gave for its own light/dark asymmetry (30%/20%): the same percentage mix reads at very different visual weights against a near-white surface (light `cloud-50 #ffffff`) versus a near-black one (dark `charcoal-700 #1e1e1e`), so matching *visual* prominence, not matching *percentage*, is the correct goal — 14% was needed in dark mode to read as a comparably visible lift.

**WCAG audit (Node relative-luminance script, same method as every other color-mix audit in this file) — `--color-text-primary` as body text over the resolved `-selected` fill:**

| Mode | Mix | Resolved hex | `--color-text-primary` | Contrast |
|---|---|---|---|---|
| Light | 8% of `brick-500` into `cloud-50` | `#faf0ec` | `#121212` | **16.71:1** ✅ (AA 4.5:1) |
| Dark | 14% of `orange-500` into `charcoal-700` | `#3d2e22` | `#fbfbfb` | **12.59:1** ✅ (AA 4.5:1) |

Both clear AA with very large margin — selection is decorative/reinforcing here, not the sole conveyor of the selected state (the row's `Checkbox` and `aria-selected="true"` both also carry it, per WCAG 1.4.1), but the large margin means body text inside a selected row is never at legibility risk regardless.

**Precedence — selected always wins over hover, hover always wins over `zebra`.** `Table.jsx` encodes this via CSS source order inside its own injected `<style>` block (a `.quicklo-table-row[aria-selected="true"]` rule declared after the `@media (hover:hover)` hover rule, which is itself declared after the `.quicklo-table-row--zebra` rule) rather than inline-style-vs-class specificity — the same "two states have no defined cascade precedence, write plain CSS" rationale Tabs' own `.quicklo-segmented-trigger` block already established (see that component's entry in `docs/DECISIONS.md`). `zebra` (`--color-bg-primary`) is desktop-only in the same stylesheet — a mobile card already has its own border/shadow, so alternating tint would look wrong stacked on top of that.

### Status — surface-level text and indicators (per mode)

Use these tokens for any status-state element rendered **on a surface**: title text, error borders, inline icons. Never use on badge fills (those use `--color-status-*`). WCAG AA for text: `--color-status-error-text` light (#831414, L=0.026) vs bg-surface (#ffffff, L=1.0) = 9.10:1 ✅; dark (#df9797, L=0.312) vs bg-surface dark (#1e1e1e, L=0.013) = 7.69:1 ✅. `--color-status-error-text` is consumed as the error border + message token by Input, standalone Checkbox, Textarea, and Select.

| Token | Light | Dark |
|---|---|---|
| `--color-status-success-text` | green-700 `#0f5b2b` | green-300 `#62aa7d` |
| `--color-status-error-text` | red-700 `#831414` | red-200 `#df9797` |
| `--color-status-warning-text` | yellow-800 `#8a6914` | yellow-300 `#fcd46c` |
| `--color-status-info-text` | blue-700 `#024b72` | blue-300 `#569bc0` |

### Status — card background tints (optional subtle backgrounds only)

| Token | Light | Dark |
|---|---|---|
| `--color-status-success-bg` | green-50 `#e8f2ec` | charcoal-700 `#1e1e1e` |
| `--color-status-error-bg` | red-50 `#f8e8e8` | charcoal-700 `#1e1e1e` |
| `--color-status-warning-bg` | yellow-50 `#fff9e9` | charcoal-700 `#1e1e1e` |
| `--color-status-info-bg` | blue-50 `#e6f0f6` | charcoal-700 `#1e1e1e` |

---

## 4. Absolute rules — never break these

1. **No hardcoded hex in components.** Never `#c2410c`, `rgb()`, or `hsl()` in a component file. Hex exists only in `globals.css` as primitive definitions.
2. **No primitive tokens in components.** Never `var(--primitive-brick-500)` in a component. Components reference semantic tokens only.
3. **No Tailwind literal colour classes.** Never `bg-white`, `text-gray-900`, `bg-orange-600`. Always token-mapped: `bg-[--color-bg-surface]`, `text-[--color-text-primary]`.
4. **No blue in Quicklo brand UI.** Blue exists for info status only — never for brand, interactive, or decorative elements.
5. **No disabled tokens.** Disabled states always use `opacity: 0.4` (`var(--opacity-disabled)`). Never create a `--color-*-disabled` token.

---

## 5. Status pattern rule (rewritten 2026-07-07 — describes the system as actually shipped)

> **This section previously described a "surface + filled-circle badge + coloured title, never a coloured background box" rule with two scoped exceptions (Badge, Toast).** As of the Alert build (2026-07-07), that original rule has **no remaining consumers** — Alert was its last one, and Alert now uses a tone-tinted surface like Badge does. Rather than carry a rule with zero consumers plus two "exceptions" that were actually the norm, this section is rewritten to describe what the system actually does. See `docs/DECISIONS.md` (2026-07-07) for the full superseding entry.

**The actual pattern, current state:** status is conveyed by two things together, never colour alone (WCAG 1.4.1) — an outline tone icon (`--color-status-{tone}-text` stroke) and a tone-coloured title (same token). What differs between components is only the SURFACE those two sit on:

- **Badge** — a soft tone-tint pill, `--color-badge-{tone}-bg`/`-border` (`color-mix()` against `--color-bg-surface`, 14%/30%). Small, compact, always-labelled inline indicator.
- **Alert** — a soft tone-tint card, `--color-alert-{tone}-bg`/`-border` (`color-mix()` against `--color-bg-surface`, per-tone %s — see the Alert tokens section above). Persistent/standing status message; "Banner" is the same component full-width.
- **Toast** — a plain `--color-bg-surface` card, no tint at all. Transient/floating confirmation — see the Direction 2 rationale below.

None of the three ever uses a filled circle indicator or a flat, non-tinted `--color-status-{tone}` background box — that combination is what the original rule actually forbade, and it still holds: colour is reinforcement (icon + title), never the sole conveyor, and a status surface is never a hard, saturated colour block.

**Why Badge and Alert tint their surface but Toast doesn't:** Badge and Alert are both persistent/semi-persistent — a badge sits in a row the user scans repeatedly, an alert stands on a page until dismissed or resolved — so a subtle surface tint reinforces "this is a status container" at a glance without re-reading the icon/title every time. Toast is transient (auto-dismisses in 5 seconds, or is a one-shot confirmation the user acts on immediately) — it doesn't need the same at-a-glance reinforcement, and Direction 2's reasoning for dropping Toast's original filled-circle indicator (visual weight, the info-tone double-ring problem) applies just as much to a tinted card: less "chrome" reads faster for something that's gone in five seconds anyway.

**Toast, Direction 2 (2026-07-07 fix pass context, unchanged by the Alert build).** Toast uses an OUTLINE status icon (`CheckCircle2` / `XCircle` / `Info`, 24px) in `--color-status-{tone}-text`, with a tone-coloured title, on a plain `--color-bg-surface` card — no filled circle, no tint. This superseded Toast's original build, which used a filled-circle indicator with a white glyph (`--color-text-on-interactive-error`, reused for its mode-invariant white); that token is no longer used by Toast. Full reasoning in `docs/DECISIONS.md` (2026-07-07).

**Legacy tokens.** `--color-status-{tone}-bg` (the flat/non-mixed card tint family, listed in the Status — card background tints table above) is not consumed by Badge, Alert, or Toast — all three use their own `color-mix()` derived family instead. It remains defined in case a future non-status card background need arises, but carries no current consumer and is not part of this pattern.

---

## 6. Dark mode

Adding `class="dark"` to `<html>` triggers all `.dark` overrides. Every component using semantic tokens re-themes automatically with zero component changes. Components that hardcode colours will NOT respond to dark mode — which is why Rule 1 is absolute.

**Native form-control popups (no colour token involved).** Semantic tokens re-theme anything *we* paint, but a native `<select>`'s open option list is OS-rendered chrome — outside our CSS entirely. Select uses the CSS `color-scheme` property (`scheme-light dark:scheme-dark` on the `<select>`) as a rendering-mode hint so the browser paints that popup light or dark to match. This is not a colour value and adds no token; it's applied per-element (not at `:root`/`.dark`, which would also re-theme native scrollbars/pickers app-wide). It relies on Tailwind's `dark:` variant tracking the `.dark` class via the `@custom-variant dark` rule in globals.css, rather than the OS-level `prefers-color-scheme` Tailwind defaults to.

---

## 7. How to add a new colour

1. Decide: a new stop in an existing primitive group, or a brand-new group?
2. Add the primitive to `globals.css` inside `@theme {}` as `--primitive-[group]-[stop]`.
3. Create a semantic token in `:root` and `.dark` that references the new primitive.
4. Document the new token in this file under the correct semantic group.
5. Add it to `Colours.stories.js` so it shows in Storybook.
6. Add a `DECISIONS.md` line if the addition has a reason worth remembering.

---

## 8. Storybook colour-story rules

- Foundation stories use inline styles only — no Tailwind classes.
- Primitive swatches use hardcoded hex for *display only* — comment marks them story-only.
- Semantic swatches use `var(--token-name)` so they respond to the light/dark toggle.
- Contrast ratios are computed at render time via the WCAG relative-luminance formula — never hardcoded.
- Minimum font size in stories: `0.875rem`. WCAG badges may use `0.75rem` minimum.

---

> The complete CSS implementation lives in `src/design-system/tokens/globals.css`. This document is the human-readable authority; globals.css is the machine implementation of it.
