// Shared constants for the Chart component family — kept out of Chart.jsx to
// keep the dispatcher readable. All colour values are CSS custom properties
// consumed directly as SVG attributes (fill="var(--color-chart-...)"), never
// resolved to hex in JS — dark mode re-themes automatically with zero JS.

// height prop → plot px height. "sparkline" only appears here for reference;
// the sparkline variant hardcodes 40px itself rather than reading this prop
// (see ChartSparkline.jsx) since it's a single-purpose embed size, not a
// scale a consumer should override.
export const HEIGHT_PX = { sparkline: 40, sm: 160, md: 240, lg: 320 };

// Categorical ramp — stacked bar / donut only. Capped at 5: this system's
// scoped categorical palette, not an open-ended series ramp.
export const CATEGORY_TOKENS = [
  'var(--color-chart-cat-1)',
  'var(--color-chart-cat-2)',
  'var(--color-chart-cat-3)',
  'var(--color-chart-cat-4)',
  'var(--color-chart-cat-5)',
];
export const MAX_CATEGORIES = CATEGORY_TOKENS.length;

export const AXIS_TICK_STYLE = {
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--text-body-sm)', // 0.75rem — rem, never px
};

export const HEADLINE_STYLE = {
  fontFamily: 'var(--font-body)', // Inter, NOT Outfit — Outfit is H1-H3 only
  fontWeight: 600,
  fontSize: 'var(--text-h2)',
  lineHeight: '1.75rem',
  color: 'var(--color-text-primary)',
};

export function formatValue(value, formatter) {
  if (value == null) return '—';
  return typeof formatter === 'function' ? formatter(value) : String(value);
}

// Recharts' animationDuration is a plain JS number (its own SVG animation
// engine, not a CSS transition), so it can't consume a var() string directly
// — read the token's live computed value instead, same pattern Alert.jsx
// already uses for its dismiss timing. This also means prefers-reduced-
// motion's global zeroing of --duration-slow (see globals.css) is honoured
// automatically: the computed value already resolves to 0 there.
// Recharts' animationEasing only accepts a fixed named set ('ease' |
// 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear') — it cannot consume a
// raw cubic-bezier() string, so the --ease-* tokens can't be read directly
// the way colour/duration tokens are. --ease-enter's curve, cubic-bezier(0,
// 0, 0.2, 1), IS the standard "decelerate" curve — CSS's own 'ease-out' is
// the closest built-in match, so that's what every entrance animation below
// uses. Never var(--ease-spring) here — locked to toggles/checkboxes/status
// dots only.
export const RECHARTS_ENTER_EASING = 'ease-out';

export function readTokenMs(varName, fallback) {
  if (typeof window === 'undefined') return fallback;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  const ms = parseFloat(raw);
  return Number.isFinite(ms) ? ms : fallback;
}
