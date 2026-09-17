import React from 'react';

// Custom legend — not Recharts' built-in <Legend/>, so swatch/label
// typography stays on this system's own tokens and each chip gets the
// standard 44×44 tap-target expansion (the Button/IconButton sm/md
// ::before technique) rather than Recharts' default unstyled markup.
// Always renders label + value (never colour alone) — used by stacked bar
// and donut, both of which must "always render a legend with values".
export function ChartLegend({ items, onToggle, hidden }) {
  return (
    <ul
      className="flex flex-wrap items-center list-none m-0 p-0"
      style={{ gap: 'var(--space-4)', marginTop: 'var(--space-3)' }}
    >
      {items.map((item) => {
        const isHidden = hidden?.has(item.key);
        const interactive = typeof onToggle === 'function';
        const Tag = interactive ? 'button' : 'div';
        return (
          <li key={item.key}>
            <Tag
              type={interactive ? 'button' : undefined}
              onClick={interactive ? () => onToggle(item.key) : undefined}
              aria-pressed={interactive ? !isHidden : undefined}
              className={interactive ? 'relative inline-flex items-center cursor-pointer select-none' : 'inline-flex items-center'}
              style={{
                gap: 'var(--space-2)',
                opacity: isHidden ? 'var(--opacity-disabled)' : 1,
                background: 'transparent',
                border: 'none',
                padding: 0,
                font: 'inherit',
              }}
            >
              {interactive && (
                <span
                  aria-hidden="true"
                  style={{ position: 'absolute', inset: '50%', transform: 'translate(-50%,-50%)', width: '44px', height: '44px' }}
                />
              )}
              <span
                aria-hidden="true"
                style={{ width: '10px', height: '10px', borderRadius: 'var(--radius-full)', background: item.color, flexShrink: 0 }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-body-sm)',
                  lineHeight: '1rem',
                  color: 'var(--color-text-secondary)',
                }}
              >
                {item.label}
                {item.value != null && (
                  <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}> {item.value}</span>
                )}
              </span>
            </Tag>
          </li>
        );
      })}
    </ul>
  );
}
