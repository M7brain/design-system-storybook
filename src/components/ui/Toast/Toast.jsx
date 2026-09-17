'use client';

import React, { useRef, useState } from 'react';
import { Icon } from '@/design-system/icons/Icon.jsx';
import { IconButton } from '@/components/ui/IconButton/IconButton.jsx';
import { Button } from '@/components/ui/Button/Button.jsx';
import { X } from '@/design-system/icons/index.js';

// Toast is transient/floating/auto-dismissing — see ToastProvider.jsx for the
// queue, timers, and portal viewport. This file is presentation + gesture
// only; it never talks to the DOM outside its own <li>.
//
// DIRECTION 2 — supersedes the original filled-circle-badge build.
// Anatomy: an OUTLINE status icon (24px, no filled circle, no coloured
// background box) + a tone-COLOURED title, on a plain --color-bg-surface
// card. This is a deliberate, scoped exception to the locked "filled circle
// badge" status-message pattern (DOC-colour-system.md §5) — Badge already has
// its own scoped exception (the soft-tint pill); Toast's is this one. Chosen
// over the original filled-circle glyph because: a filled circle small enough
// to sit inline with a title reads visually busier than an outline glyph at
// the same footprint; the info tone's filled-circle-in-a-ring read as a
// double-ring at a glance; and a bigger (24px vs 16px) icon plus a
// tone-coloured title is a faster "which tone is this" read for a
// distracted, one-handed field user glancing at a phone.

const TONE_ICON = { success: 'CheckCircle2', error: 'XCircle', info: 'Info' };

// Swipe-to-dismiss threshold, in px, before a drag release counts as a
// dismiss rather than a snap-back. Not a design token — this is gesture
// physics, not a spacing/sizing value.
const SWIPE_THRESHOLD = 72;

// The action is a composed Button variant="ghost", rendered with its NATIVE
// label colour (--color-interactive-default, brand orange) — no override.
// Supersedes the original build's --color-text-primary override, which
// treated brand-orange-next-to-a-tone-coloured-title as a clash. Reframed:
// orange is Quicklo's one consistent "this is clickable" signal, and Toast
// is exactly the kind of place that should reinforce it, not suppress it.
// See DECISIONS.md (2026-07-07 entry) for the full reasoning.

export function Toast({ toast, isDesktop, onDismiss, onPause, onResume }) {
  const { id, tone, title, description, action, status } = toast;
  const rootRef = useRef(null);
  const dragState = useRef({ dragging: false, startX: 0, startY: 0, pointerId: null });
  const [dragOffset, setDragOffset] = useState(null); // { x, y } while actively dragging, else null

  const isEdge = status === 'entering' || status === 'exiting';
  const ease = status === 'exiting' ? 'var(--ease-exit)' : 'var(--ease-enter)';

  // Enter/exit offset direction: mobile slides down from -8px Y, desktop
  // slides in from +8px X. isDesktop is passed down from ToastProvider (a
  // single matchMedia source of truth shared with the swipe-axis logic below,
  // so the visual entry direction and the gesture-dismiss axis never disagree).
  const edgeTransform = isDesktop ? 'translate(8px, 0)' : 'translate(0, -8px)';
  const restTransform = 'translate(0, 0)';

  const transform = dragOffset
    ? `translate(${dragOffset.x}px, ${dragOffset.y}px)`
    : isEdge
      ? edgeTransform
      : restTransform;

  const opacity = dragOffset
    ? Math.max(0.2, 1 - Math.max(Math.abs(dragOffset.x), Math.abs(dragOffset.y)) / (SWIPE_THRESHOLD * 2))
    : isEdge
      ? 0
      : 1;

  function handlePointerDown(e) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    dragState.current = { dragging: true, startX: e.clientX, startY: e.clientY, pointerId: e.pointerId };
    rootRef.current?.setPointerCapture(e.pointerId);
    onPause(id, 'drag');
  }

  function handlePointerMove(e) {
    if (!dragState.current.dragging) return;
    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;
    // Desktop dismisses rightward only, mobile dismisses upward only — the
    // disallowed axis/direction is clamped to 0 rather than free-dragged, so
    // the gesture never fights the layout (dragging left on desktop, or down
    // on mobile-top, simply does nothing).
    const x = isDesktop ? Math.max(0, dx) : 0;
    const y = isDesktop ? 0 : Math.min(0, dy);
    setDragOffset({ x, y });
  }

  function endDrag() {
    if (!dragState.current.dragging) return;
    const { pointerId } = dragState.current;
    dragState.current.dragging = false;
    if (pointerId != null) {
      try {
        rootRef.current?.releasePointerCapture(pointerId);
      } catch {
        // pointer capture may already have been released by the browser — safe to ignore
      }
    }
    const offset = dragOffset;
    setDragOffset(null);
    onResume(id, 'drag');
    const distance = offset ? Math.max(Math.abs(offset.x), Math.abs(offset.y)) : 0;
    if (distance >= SWIPE_THRESHOLD) onDismiss(id);
  }

  const iconName = TONE_ICON[tone] ?? TONE_ICON.info;
  const hasDescription = Boolean(description);
  const hasAction = Boolean(action);
  // Only a plain, actionless single-line toast shrinks to its content on
  // desktop — the moment there's an action or a description, the card fills
  // the full (max 400px) column instead. Mobile always fills its available
  // width regardless of content shape.
  const isCompactSingleLine = isDesktop && !hasDescription && !hasAction;
  // The action renders in exactly one of two places, never both: inline in
  // the header (title-only toasts) or left-aligned in the body (toasts with
  // a description). This is a placement choice, not a size/position variant.
  const inlineAction = hasAction && !hasDescription;
  const bodyAction = hasAction && hasDescription;

  function handleActionClick() {
    action.onClick?.();
    onDismiss(id);
  }

  return (
    <li
      ref={rootRef}
      role={tone === 'error' ? 'alert' : 'status'}
      aria-live={tone === 'error' ? 'assertive' : 'polite'}
      style={{
        pointerEvents: 'auto',
        display: 'flex',
        flexDirection: 'column',
        width: isCompactSingleLine ? 'fit-content' : '100%',
        maxWidth: isDesktop ? '400px' : undefined,
        background: 'var(--color-bg-surface)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--elevation-2)',
        // Description present gets the full --space-4 (16px) padding on
        // every side; title-only (with or without an inline action) is more
        // compact: --space-3 (12px) vertical, --space-4 (16px) horizontal.
        padding: hasDescription ? 'var(--space-4)' : 'var(--space-3) var(--space-4)',
        transform,
        opacity,
        transition: dragOffset
          ? 'none'
          : `transform var(--duration-base) ${ease}, opacity var(--duration-base) ${ease}`,
        touchAction: isDesktop ? 'pan-y' : 'pan-x',
      }}
      onPointerEnter={() => onPause(id, 'hover')}
      onPointerLeave={() => onResume(id, 'hover')}
      onFocus={() => onPause(id, 'focus')}
      onBlur={() => onResume(id, 'focus')}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      {/* HEADER ROW — fixed, vertically-centred: icon, title, optional inline
          action, close always share one centreline, regardless of how tall
          the body underneath grows. This replaces the old flex-start +
          icon-nudge approach, which was the source of the close-X drift on
          multi-line toasts. */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        {/* Outline status icon — no filled circle, no background. Stroke
            colour is the AA on-surface token, same one the title uses, so
            icon and title read as one coloured unit. */}
        <span
          aria-hidden="true"
          style={{ display: 'inline-flex', flexShrink: 0, color: `var(--color-status-${tone}-text)` }}
        >
          <Icon name={iconName} size="lg" />
        </span>

        {/* Title uses the type token's NATURAL 1.5rem line-height, not the
            tight single-line override used on Button/Input/Badge labels —
            deliberate: a toast title can wrap to 2 lines, and that override
            assumes single-line content. Tone-coloured (Direction 2). */}
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-body-lg)',
            fontWeight: 500,
            lineHeight: '1.5rem',
            color: `var(--color-status-${tone}-text)`,
            flex: 1,
            minWidth: 0,
          }}
        >
          {title}
        </span>

        {/* Inline action — only when there is no description: the compact
            "Reply sent … Undo ✕" form, trailing between the title and close. */}
        {inlineAction && (
          <Button variant="ghost" size="sm" onClick={handleActionClick}>
            {action.label}
          </Button>
        )}

        <IconButton
          icon={X}
          variant="plain"
          size="sm"
          aria-label="Dismiss"
          className="shrink-0"
          onClick={() => onDismiss(id)}
        />
      </div>

      {/* BODY — only when a description is present. Offset to align under
          the TITLE (past the icon + header gap): --space-6 (icon width) +
          --space-3 (header gap) = 36px. */}
      {hasDescription && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-2)',
            marginLeft: 'calc(var(--space-6) + var(--space-3))',
            marginTop: 'var(--space-1)',
          }}
        >
          <span
            className="line-clamp-2 sm:line-clamp-3"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-body-md)',
              fontWeight: 400,
              lineHeight: '1.25rem',
              color: 'var(--color-text-secondary)',
            }}
          >
            {description}
          </span>

          {/* Body action — left-aligned under the description, never trailing
              next to the title. Offset by the ghost sm button's own
              horizontal padding (--space-4, see Button.jsx) so the LABEL, not
              the button's padded edge, sits flush with the title/description
              text above it. */}
          {bodyAction && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleActionClick}
              style={{ alignSelf: 'flex-start', marginLeft: 'calc(-1 * var(--space-4))' }}
            >
              {action.label}
            </Button>
          )}
        </div>
      )}
    </li>
  );
}
