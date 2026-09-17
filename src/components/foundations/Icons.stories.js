import React, { useState } from 'react';
import { Icon } from '../../design-system/icons/Icon.jsx';

export default { title: 'Foundations/Icons' };

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────

const ICON_GROUPS = [
  {
    label: 'Navigation',
    icons: [
      'LayoutDashboard', 'Settings', 'LogOut', 'Menu', 'X',
      'ChevronDown', 'ChevronRight', 'ChevronLeft', 'ChevronsLeft', 'ChevronsRight', 'ChevronsUpDown',
      'ArrowLeft', 'ArrowRight',
    ],
  },
  {
    label: 'Lead management',
    icons: [
      'MessageSquare', 'Mail', 'Phone', 'PhoneCall', 'PhoneMissed', 'PhoneIncoming',
      'Send', 'Reply', 'Inbox', 'Filter', 'Search', 'MoreHorizontal',
      'Pencil', 'Trash2', 'Copy', 'Clock', 'CalendarClock', 'Tag', 'StickyNote', 'Bookmark',
    ],
  },
  {
    label: 'Lead status',
    icons: [
      'Check', 'CheckCircle', 'XCircle', 'AlertTriangle', 'AlertCircle', 'Info',
      'Circle', 'MinusCircle', 'Loader2',
    ],
  },
  {
    label: 'Connections',
    icons: [
      'Webhook', 'Link', 'Globe', 'Wifi', 'WifiOff', 'RefreshCw', 'Plus',
      'ExternalLink', 'TestTube2',
    ],
  },
  {
    label: 'Settings',
    icons: [
      'User', 'Building2', 'MapPin', 'Briefcase', 'Sliders',
      'Bell', 'BellOff', 'BellDot', 'Moon', 'Sun', 'SunMedium',
      'Zap', 'ZapOff', 'CreditCard', 'Shield', 'Lock', 'Unlock', 'Key',
      'Eye', 'EyeOff',
    ],
  },
  {
    label: 'Analytics',
    icons: ['BarChart2', 'TrendingUp', 'TrendingDown', 'Activity', 'Users', 'Award', 'Calendar'],
  },
  {
    label: 'Auth',
    icons: ['LogIn', 'UserPlus', 'RotateCcw'],
  },
  {
    label: 'Onboarding',
    icons: ['FormInput', 'HelpCircle', 'Sparkles', 'PartyPopper'],
  },
  {
    label: 'Landing page',
    icons: ['Star'],
  },
  {
    label: 'Plan & billing',
    icons: ['Crown'],
  },
  {
    label: 'Error & empty states',
    icons: ['ServerCrash', 'Maximize2', 'Minimize2'],
  },
  {
    label: 'Utility',
    icons: ['Download', 'Upload', 'FileText', 'Code', 'Bug'],
  },
];

const TOTAL_ICONS = ICON_GROUPS.reduce((sum, g) => sum + g.icons.length, 0);

const SIZES = [
  { size: 'sm', px: 16, usage: 'Inline with text, badges, compact metadata'      },
  { size: 'md', px: 20, usage: 'Buttons, inputs, interactive elements (default)'  },
  { size: 'lg', px: 24, usage: 'Standalone nav icons, empty states, section icons' },
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const DISPLAY_NAME_OVERRIDES = {
  X: 'Close / X',
};

function toDisplayName(name) {
  if (DISPLAY_NAME_OVERRIDES[name]) return DISPLAY_NAME_OVERRIDES[name];
  return name.replace(/([A-Z])/g, ' $1').trim();
}

function modeBtn(active) {
  return {
    height: '32px',
    padding: '0 16px',
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.875rem',
    fontWeight: 500,
    cursor: 'pointer',
    outline: 'none',
    borderRadius: 'var(--radius-sm)',
    background: active ? 'var(--color-brand-btn)' : 'transparent',
    color: active ? 'var(--color-brand-btn-text)' : 'var(--color-text-secondary)',
    border: active ? '1px solid transparent' : '1px solid var(--color-border-default)',
  };
}

const DIVIDER = (
  <div style={{ borderTop: '1px solid var(--color-border-default)', margin: '32px 0' }} />
);

// ─────────────────────────────────────────────────────────────────────────────
// STORY COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

function IconsGallery() {
  const [dark, setDark] = useState(false);
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState(null);

  const q = query.toLowerCase();

  const filtered = ICON_GROUPS
    .map((group) => ({
      ...group,
      icons: group.icons.filter(
        (name) =>
          name.toLowerCase().includes(q) ||
          toDisplayName(name).toLowerCase().includes(q)
      ),
    }))
    .filter((group) => group.icons.length > 0);

  const filteredCount = filtered.reduce((sum, g) => sum + g.icons.length, 0);

  return (
    <div
      className={dark ? 'dark' : ''}
      style={{ background: 'var(--color-bg-primary)', minHeight: '100vh', padding: '0' }}
    >
      {/* Controls row */}
      <div style={{ background: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border-default)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 24px' }}>
          <button aria-pressed={!dark} onClick={() => setDark(false)} style={modeBtn(!dark)}>Light</button>
          <button aria-pressed={dark}  onClick={() => setDark(true)}  style={modeBtn(dark)}>Dark</button>
          <input
            type="text"
            aria-label="Search icons"
            placeholder="Search icons..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{
              height: '36px',
              padding: '0 12px',
              border: focused ? '1px solid var(--color-brand-btn)' : '1px solid var(--color-border-default)',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--color-bg-surface)',
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem',
              color: 'var(--color-text-primary)',
              outline: 'none',
              width: '220px',
            }}
          />
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 400, color: 'var(--color-text-secondary)', lineHeight: '1.25rem' }}>
            {filteredCount} icons
          </span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '32px 32px 64px 32px' }}>

        {/* Page header */}
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.75rem', fontWeight: 700, lineHeight: '2.25rem', color: 'var(--color-text-primary)', margin: '0 0 8px 0' }}>
          Icons
        </h1>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 400, lineHeight: '1.75rem', color: 'var(--color-text-secondary)', margin: '0 0 32px 0' }}>
          {TOTAL_ICONS} Lucide icons, curated and re-exported through the Icon wrapper. Always import from <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>src/design-system/icons</code> — never directly from lucide-react.
        </p>

        {/* Gallery */}
        {filtered.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '48px 0', fontFamily: 'Inter, sans-serif', fontSize: '1rem', color: 'var(--color-text-secondary)', lineHeight: '1.75rem' }}>
            No results for "{query}"
          </p>
        ) : (
          filtered.map((group, gi) => (
            <div key={group.label}>
              {gi > 0 && DIVIDER}
              <h2 style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '1.25rem',
                fontWeight: 600,
                lineHeight: '1.75rem',
                color: 'var(--color-text-primary)',
                margin: '0 0 16px 0',
              }}>
                {group.label}
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                gap: '4px',
                marginBottom: '4px',
              }}>
                {group.icons.map((name) => (
                  <div
                    key={name}
                    aria-label={toDisplayName(name)}
                    onMouseEnter={() => setHoveredIcon(name)}
                    onMouseLeave={() => setHoveredIcon(null)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '16px 8px',
                      borderRadius: 'var(--radius-md)',
                      background: hoveredIcon === name ? 'var(--color-bg-surface)' : 'transparent',
                      cursor: 'default',
                    }}
                  >
                    {/* Icon at lg size */}
                    <span style={{ color: 'var(--color-text-primary)' }}>
                      <Icon name={name} size="lg" />
                    </span>

                    {/* Display name */}
                    <span style={{
                      marginTop: '8px',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.8125rem',
                      fontWeight: 500,
                      color: 'var(--color-text-primary)',
                      lineHeight: '1.25rem',
                      textAlign: 'center',
                    }}>
                      {toDisplayName(name)}
                    </span>

                    {/* Lucide component name */}
                    <span style={{
                      marginTop: '2px',
                      fontFamily: 'ui-monospace, monospace',
                      fontSize: '0.75rem',
                      fontWeight: 400,
                      color: 'var(--color-text-secondary)',
                      lineHeight: '1rem',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                    }}>
                      {name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}

        {DIVIDER}

        {/* Sizes */}
        <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.25rem', fontWeight: 600, lineHeight: '1.75rem', color: 'var(--color-text-primary)', margin: '0 0 16px 0' }}>
          Sizes
        </h2>
        <div style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-default)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
          {SIZES.map(({ size, px, usage }, i) => (
            <div
              key={size}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                padding: '16px 20px',
                minHeight: '44px',
                borderTop: i > 0 ? '1px solid var(--color-border-default)' : 'none',
              }}
            >
              <div style={{ width: '96px', flexShrink: 0 }}>
                <span style={{ display: 'block', fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem', fontWeight: 400, color: 'var(--color-text-primary)', lineHeight: '1.25rem' }}>
                  {size} — {px}px
                </span>
                <span style={{ display: 'block', fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 400, color: 'var(--color-text-secondary)', lineHeight: '1rem', marginTop: '2px' }}>
                  {usage}
                </span>
              </div>
              <span style={{ color: 'var(--color-text-primary)' }}>
                <Icon name="Phone" size={size} />
              </span>
              <span style={{ color: 'var(--color-text-primary)' }}>
                <Icon name="CheckCircle" size={size} />
              </span>
            </div>
          ))}
        </div>

        {DIVIDER}

        {/* Usage guide */}
        <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.25rem', fontWeight: 600, lineHeight: '1.75rem', color: 'var(--color-text-primary)', margin: '0 0 8px 0' }}>
          Usage
        </h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            ['Always', 'Import icons from src/design-system/icons — never directly from lucide-react.'],
            ['Always', 'Use the Icon wrapper component with a size prop — never render Lucide icons directly.'],
            ['Always', 'Set aria-label on standalone interactive icons. Decorative icons get aria-hidden automatically.'],
            ['Use sm (16px)', 'Inline with text, badges, compact metadata.'],
            ['Use md (20px)', 'Buttons, inputs, interactive elements — the default size.'],
            ['Use lg (24px)', 'Standalone nav icons, empty states, section icons.'],
            ['Adding icons', 'Add the export to icons/index.js first, then use it.'],
          ].map(([label, rule]) => (
            <li key={label} style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem', color: 'var(--color-text-primary)' }}>
              <strong>{label}:</strong> {rule}
            </li>
          ))}
        </ul>

        {DIVIDER}

        {/* Reference table */}
        <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.25rem', fontWeight: 600, lineHeight: '1.75rem', color: 'var(--color-text-primary)', margin: '0 0 16px 0' }}>
          Reference table
        </h2>
        <div style={{ background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', overflow: 'hidden', width: '100%' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-bg-primary)', borderBottom: '2px solid var(--color-border-default)' }}>
                {['SIZE', 'PX', 'USAGE'].map((h) => (
                  <th key={h} style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: 'var(--color-text-secondary)',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SIZES.map(({ size, px, usage }, i) => (
                <tr
                  key={size}
                  style={{
                    backgroundColor: i % 2 === 1 ? 'var(--color-bg-primary)' : 'var(--color-bg-surface)',
                    borderBottom: '1px solid var(--color-border-subtle)',
                    minHeight: '44px',
                  }}
                >
                  <td style={{ padding: '12px 16px', fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem', color: 'var(--color-text-primary)', lineHeight: '1.25rem' }}>{size}</td>
                  <td style={{ padding: '12px 16px', fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: 'var(--color-text-primary)', lineHeight: '1.25rem' }}>{px}px</td>
                  <td style={{ padding: '12px 16px', fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: 'var(--color-text-primary)', lineHeight: '1.25rem' }}>{usage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

export const Gallery = { render: () => <IconsGallery /> };
