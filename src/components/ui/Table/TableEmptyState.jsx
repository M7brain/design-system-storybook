import React from 'react';
import { Icon } from '@/design-system/icons/Icon.jsx';
import { Button } from '@/components/ui/Button/Button.jsx';

// LOCAL implementation, flagged for migration once the real EmptyState
// component ships (it's on the Approved list but unbuilt) — the same
// "local stand-in, migrate later" convention Chart's ChartEmptyState and
// DateTimePicker's overlay-instead-of-Modal already established. Do not
// treat this as the EmptyState component.
export function TableEmptyState({ icon = 'Inbox', title, description, action }) {
  return (
    <div
      className="flex flex-col items-center text-center"
      style={{ gap: 'var(--space-3)', padding: 'var(--space-12) var(--space-4)' }}
    >
      <span aria-hidden="true" style={{ color: 'var(--color-text-tertiary)' }}>
        <Icon name={icon} size="lg" />
      </span>
      <div className="flex flex-col" style={{ gap: 'var(--space-1)' }}>
        <p
          style={{
            margin: 0,
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-body-lg)',
            fontWeight: 500,
            lineHeight: '1.5rem',
            color: 'var(--color-text-primary)',
          }}
        >
          {title}
        </p>
        {description && (
          <p
            style={{
              margin: 0,
              maxWidth: '320px',
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-body-md)',
              lineHeight: '1.25rem',
              color: 'var(--color-text-secondary)',
            }}
          >
            {description}
          </p>
        )}
      </div>
      {action && (
        <Button variant="secondary" size="md" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
