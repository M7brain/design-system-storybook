# Quicklo Design System

This is the design system layer of a private product repo (Quicklo), shared
here **read-only as a showcase**. It contains the tokens, foundations,
components, and patterns that the product's UI is built from — not the
product itself.

**There is no application code here by design.** No routes, no pages, no
business logic, no data layer. Just the design system and the Storybook
that documents it. If you're looking for the app, you're in the wrong repo
— on purpose.

## What this is

A component library and token system built with React, Tailwind, and
Storybook. Everything in it is designed mobile-first, verified in both
light and dark mode, and documented as a live, interactive Storybook
instance rather than static screenshots or a Figma file. The Storybook
*is* the spec — if a component's behaviour isn't demonstrated live in a
story, it isn't considered done.

## Build order — never out of order

Everything is built in one direction, and nothing skips ahead:

1. **Foundations** — colour tokens, typography, spacing, breakpoints,
   radius, elevation, motion, opacity, icons, loaders
2. **Components** — buttons, inputs, tables, charts, and the rest of
   `src/components/ui`, each composed from foundations only
3. **Patterns** — compositions of multiple components into a reusable
   unit (`src/components/patterns`)
4. **Pages** — screens composed from patterns and components

A component is never built ahead of the foundation it depends on, and a
pattern is never built ahead of the components it composes. If something
doesn't exist yet at the layer below, the layer above waits.

## Absolute rules

These are non-negotiable, no exceptions:

- **Semantic tokens only — never a raw colour value.** Every colour
  reference is a `--color-*` custom property. No hex, rgb, or hsl literals
  in component code.
- **Rem font sizes only — never px.** All typography is sized in `rem`.
- **Every spacing value sits on the 4px grid.** Margins, padding, gaps —
  all multiples of 4px.
- **Storybook before anything else.** A component isn't finished until it
  has a live, interactive story demonstrating its real states — not a
  mockup, not a static render.
- **Light and dark both verified before approval.** Every story ships its
  own in-canvas Light/Dark toggle (not a Storybook addon — see
  `docs/STORYBOOK-style-guide.md`), and both modes are checked before
  anything is signed off.
- **44px minimum touch targets.** Every interactive element — buttons,
  checkboxes, row actions, chevrons — meets or exceeds 44×44px, even
  inside denser desktop layouts.
- **Tested at 390px first.** Mobile is the primary viewport; components
  are verified at 390px before wider breakpoints are considered done.

## What's in `docs/`

- **`DECISIONS.md`** — an append-only, timestamped log of every locked or
  changed design/architecture decision, with the reasoning behind it. The
  source of truth for *why* something is the way it is.
- **`DOC-colour-system.md`** — the full token system: colour roles,
  light/dark values, contrast audits.
- **`DOC-product-spec.md`** — how design system pieces map onto real
  product screens.
- **`STORYBOOK-style-guide.md`** — the authoritative spec for how every
  Storybook story must look and be structured (the Light/Dark toggle
  pattern, layout, required sections).

## Running it locally

```bash
npm install
npm run storybook
```

Storybook starts on [http://localhost:6006](http://localhost:6006). There
is no `.env` to configure and nothing to connect to — this package has no
backend, no API, and no application routes. The `dev`/`build`/`start`
scripts in `package.json` are unused Next.js scaffolding left over from
the template this package was created from; `storybook` is the only
script that matters here.
