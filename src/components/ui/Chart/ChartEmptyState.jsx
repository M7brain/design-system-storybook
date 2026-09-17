import React from 'react';
import { Icon } from '@/design-system/icons/Icon.jsx';

// LOCAL implementation, flagged for migration once the real EmptyState
// component ships (it's on the Approved list but unbuilt) — same "local
// stand-in, migrate later" convention DateTimePicker's overlay already
// established for Modal. Do not treat this as the EmptyState component.
export function ChartEmptyState({ message, height }) {
  return (
    <div
      style={{
        height,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-3)',
        textAlign: 'center',
      }}
    >
      <span aria-hidden="true" style={{ color: 'var(--color-text-tertiary)' }}>
        <Icon name="BarChart2" size="lg" />
      </span>
      <p
        style={{
          margin: 0,
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-body-md)',
          lineHeight: '1.25rem',
          color: 'var(--color-text-secondary)',
          maxWidth: '240px',
        }}
      >
        {message}
      </p>
    </div>
  );
}
