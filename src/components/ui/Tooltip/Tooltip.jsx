'use client';

// IconButton integration:
//   <Tooltip type="label" content="Close">
//     <IconButton aria-label="Close" ... />
//   </Tooltip>
// type="label"  → aria-labelledby: tooltip IS the accessible name of the trigger
// type="description" (default) → aria-describedby: tooltip supplements the trigger's existing label
// IconButton must forwardRef so Tooltip's triggerRef can attach.

import React, {
  useState,
  useRef,
  useId,
  useCallback,
  useEffect,
  useLayoutEffect,
} from 'react';
import { createPortal } from 'react-dom';

// ─── Module-level singleton ───────────────────────────────────────────────────
// At most one Tooltip is visible at a time. When a new tooltip shows, it calls
// _activeClose() to instantly unmount the previous one (no fade-out wait).
// Normal user-triggered close (cursor leave / Escape / blur) uses the fade path.
let _activeClose = null;

function _register(closeFn) {
  if (_activeClose && _activeClose !== closeFn) _activeClose();
  _activeClose = closeFn;
}

function _unregister(closeFn) {
  if (_activeClose === closeFn) _activeClose = null;
}

// ─── Positioning ──────────────────────────────────────────────────────────────
const EDGE = 32; // px from viewport edge that triggers auto-flip (Material 3 spec)
const GAP = 4;   // gap between caret tip and trigger edge (--space-1)
const CARET = 5; // caret triangle half-width / height (px)

function opposite(pos) {
  return { top: 'bottom', bottom: 'top', left: 'right', right: 'left' }[pos];
}

function hasRoom(tRect, tip, pos) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  switch (pos) {
    case 'top':    return tRect.top - tip.h - CARET - GAP >= EDGE;
    case 'bottom': return tRect.bottom + tip.h + CARET + GAP <= vh - EDGE;
    case 'left':   return tRect.left - tip.w - CARET - GAP >= EDGE;
    case 'right':  return tRect.right + tip.w + CARET + GAP <= vw - EDGE;
    default:       return true;
  }
}

function computeCoords(tRect, tip, pos) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let x, y;

  switch (pos) {
    case 'top':
      x = tRect.left + tRect.width / 2 - tip.w / 2;
      y = tRect.top - tip.h - CARET - GAP;
      break;
    case 'bottom':
      x = tRect.left + tRect.width / 2 - tip.w / 2;
      y = tRect.bottom + CARET + GAP;
      break;
    case 'left':
      x = tRect.left - tip.w - CARET - GAP;
      y = tRect.top + tRect.height / 2 - tip.h / 2;
      break;
    case 'right':
      x = tRect.right + CARET + GAP;
      y = tRect.top + tRect.height / 2 - tip.h / 2;
      break;
    default:
      x = tRect.left;
      y = tRect.top;
  }

  // Clamp to viewport within the edge threshold
  x = Math.max(EDGE, Math.min(x, vw - tip.w - EDGE));
  y = Math.max(EDGE, Math.min(y, vh - tip.h - EDGE));

  return { x, y };
}

function getCaretStyle(pos) {
  const base = { position: 'absolute', width: 0, height: 0, pointerEvents: 'none' };
  switch (pos) {
    case 'top':
      return {
        ...base,
        top: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        borderLeft: `${CARET}px solid transparent`,
        borderRight: `${CARET}px solid transparent`,
        borderTop: `${CARET}px solid var(--color-bg-surface)`,
      };
    case 'bottom':
      return {
        ...base,
        bottom: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        borderLeft: `${CARET}px solid transparent`,
        borderRight: `${CARET}px solid transparent`,
        borderBottom: `${CARET}px solid var(--color-bg-surface)`,
      };
    case 'left':
      return {
        ...base,
        top: '50%',
        left: '100%',
        transform: 'translateY(-50%)',
        borderTop: `${CARET}px solid transparent`,
        borderBottom: `${CARET}px solid transparent`,
        borderLeft: `${CARET}px solid var(--color-bg-surface)`,
      };
    case 'right':
      return {
        ...base,
        top: '50%',
        right: '100%',
        transform: 'translateY(-50%)',
        borderTop: `${CARET}px solid transparent`,
        borderBottom: `${CARET}px solid transparent`,
        borderRight: `${CARET}px solid var(--color-bg-surface)`,
      };
    default:
      return base;
  }
}

// ─── Component ────────────────────────────────────────────────────────────────
export function Tooltip({
  content,
  type = 'description',
  position = 'top',
  maxWidth = 200,
  children,
}) {
  const tooltipId = useId();
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);
  const showTimerRef = useRef(null);
  const hideTimerRef = useRef(null);
  const hoverCheckRef = useRef(null);
  const hoverRef = useRef({ trigger: false, tooltip: false });

  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [resolvedPos, setResolvedPos] = useState(position);

  // Stable refs so that closures in timers and event handlers always call the
  // latest version of these functions without stale-closure issues.
  const closeImmediateRef = useRef(null);
  const closeWithFadeRef = useRef(null);

  // Instant close — used by the singleton when a new tooltip takes over.
  const closeImmediate = useCallback(() => {
    clearTimeout(showTimerRef.current);
    clearTimeout(hideTimerRef.current);
    clearTimeout(hoverCheckRef.current);
    hoverRef.current = { trigger: false, tooltip: false };
    setVisible(false);
    setMounted(false);
    _unregister(closeImmediateRef.current);
  }, []);

  // Fade close — used for cursor leave, Escape, and blur.
  const closeWithFade = useCallback(() => {
    clearTimeout(showTimerRef.current);
    clearTimeout(hideTimerRef.current);
    clearTimeout(hoverCheckRef.current);
    hoverRef.current = { trigger: false, tooltip: false };
    setVisible(false);
    hideTimerRef.current = setTimeout(() => {
      setMounted(false);
      _unregister(closeImmediateRef.current);
    }, 200); // matches --duration-base fade-out
  }, []);

  // Keep refs current on every render so timer callbacks are always fresh.
  closeImmediateRef.current = closeImmediate;
  closeWithFadeRef.current = closeWithFade;

  // ── Position after mount ───────────────────────────────────────────────────
  // useLayoutEffect fires synchronously after DOM mutations so we can measure
  // the tooltip's real size before the first paint.
  useLayoutEffect(() => {
    if (!mounted) return;
    const trigger = triggerRef.current;
    const tooltip = tooltipRef.current;
    if (!trigger || !tooltip) return;

    const tRect = trigger.getBoundingClientRect();
    const tip = { w: tooltip.offsetWidth, h: tooltip.offsetHeight };

    let pos = position;
    if (!hasRoom(tRect, tip, pos)) {
      const flipped = opposite(pos);
      if (hasRoom(tRect, tip, flipped)) pos = flipped;
    }

    setResolvedPos(pos);
    setCoords(computeCoords(tRect, tip, pos));

    // Fade in after position is committed to the DOM.
    requestAnimationFrame(() => setVisible(true));
  }, [mounted, position]);

  // ── Escape key ────────────────────────────────────────────────────────────
  // Close without moving focus — trigger retains focus so the user can keep
  // tabbing. WCAG 1.4.13 requirement for keyboard dismissal.
  useEffect(() => {
    if (!mounted) return;
    const onKey = (e) => {
      if (e.key === 'Escape') closeWithFadeRef.current();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mounted]);

  // ── Close on scroll / resize ───────────────────────────────────────────────
  // The trigger's viewport position changes on scroll; repositioning a visible
  // tooltip on every scroll event is noisy. Instant close is cleaner UX.
  useEffect(() => {
    if (!mounted) return;
    const close = () => closeImmediateRef.current();
    window.addEventListener('scroll', close, { capture: true });
    window.addEventListener('resize', close);
    return () => {
      window.removeEventListener('scroll', close, { capture: true });
      window.removeEventListener('resize', close);
    };
  }, [mounted]);

  // ── Cleanup on unmount ────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      clearTimeout(showTimerRef.current);
      clearTimeout(hideTimerRef.current);
      clearTimeout(hoverCheckRef.current);
      _unregister(closeImmediateRef.current);
    };
  }, []);

  // ── Hover state check ─────────────────────────────────────────────────────
  // Called after cursor leaves the trigger or the tooltip. The 50ms delay
  // allows the cursor to travel from trigger → tooltip (or back) before we
  // decide to close. WCAG 1.4.13: the tooltip must remain open while the
  // cursor is over it.
  const scheduleHideCheck = useCallback(() => {
    clearTimeout(hoverCheckRef.current);
    hoverCheckRef.current = setTimeout(() => {
      if (!hoverRef.current.trigger && !hoverRef.current.tooltip) {
        closeWithFadeRef.current();
      }
    }, 50);
  }, []);

  // ── Show schedule ─────────────────────────────────────────────────────────
  const scheduleShow = useCallback(() => {
    clearTimeout(hideTimerRef.current); // cancel any in-progress fade-out unmount
    clearTimeout(showTimerRef.current);

    if (mounted) {
      // Re-entry while tooltip is fading: reverse the fade immediately.
      setVisible(true);
      return;
    }

    showTimerRef.current = setTimeout(() => {
      if (!hoverRef.current.trigger && !hoverRef.current.tooltip) return;
      // Single-instance: immediately close any other visible tooltip.
      _register(closeImmediateRef.current);
      setMounted(true);
      // visible is set to true inside useLayoutEffect after position is computed.
    }, 500); // --delay-tooltip
  }, [mounted]);

  // ── Merge child's existing ref with our triggerRef ─────────────────────────
  const childRef = children.ref ?? children.props?.ref ?? null;
  const mergedRef = useCallback(
    (node) => {
      triggerRef.current = node;
      if (typeof childRef === 'function') childRef(node);
      else if (childRef && typeof childRef === 'object') childRef.current = node;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [childRef],
  );

  // ── Clone trigger ─────────────────────────────────────────────────────────
  // Attaches the ref, ARIA attribute, and pointer/focus handlers without
  // introducing an extra wrapper element in the DOM.
  const ariaAttr = type === 'label' ? 'aria-labelledby' : 'aria-describedby';
  const clonedTrigger = React.cloneElement(children, {
    ref: mergedRef,
    [ariaAttr]: mounted ? tooltipId : (children.props[ariaAttr] ?? undefined),
    onMouseEnter(e) {
      hoverRef.current.trigger = true;
      clearTimeout(hoverCheckRef.current);
      scheduleShow();
      children.props.onMouseEnter?.(e);
    },
    onMouseLeave(e) {
      hoverRef.current.trigger = false;
      scheduleHideCheck();
      children.props.onMouseLeave?.(e);
    },
    onFocus(e) {
      hoverRef.current.trigger = true;
      clearTimeout(hoverCheckRef.current);
      scheduleShow();
      children.props.onFocus?.(e);
    },
    onBlur(e) {
      // Blur is always an immediate hide — the user tabbed away or clicked elsewhere.
      hoverRef.current.trigger = false;
      closeWithFadeRef.current();
      children.props.onBlur?.(e);
    },
  });

  // ── Portal ────────────────────────────────────────────────────────────────
  // Renders into document.body to escape overflow:hidden parents. Only created
  // on the client (mounted starts false and can only become true via events).
  const portal = mounted
    ? createPortal(
        <div
          id={tooltipId}
          ref={tooltipRef}
          role="tooltip"
          style={{
            position: 'fixed',
            top: coords.y,
            left: coords.x,
            zIndex: 9000,
            maxWidth: `${maxWidth}px`,
            padding: 'var(--space-2) var(--space-3)',
            background: 'var(--color-bg-surface)',
            borderRadius: 'var(--radius-sm)',
            boxShadow: 'var(--elevation-2)',
            color: 'var(--color-text-primary)',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-body-sm)',
            fontWeight: 400,
            lineHeight: '1rem',
            // Initial opacity is 0; fade-in fires in useLayoutEffect via rAF.
            opacity: visible ? 1 : 0,
            transition: visible
              ? `opacity var(--duration-base) var(--ease-default)`
              : `opacity var(--duration-base) var(--ease-exit)`,
            pointerEvents: 'auto', // required for WCAG 1.4.13 hover-on-tooltip
          }}
          onMouseEnter={() => {
            hoverRef.current.tooltip = true;
            clearTimeout(hoverCheckRef.current);
          }}
          onMouseLeave={() => {
            hoverRef.current.tooltip = false;
            scheduleHideCheck();
          }}
        >
          {content}
          <div aria-hidden="true" style={getCaretStyle(resolvedPos)} />
        </div>,
        document.body,
      )
    : null;

  return (
    <>
      {clonedTrigger}
      {portal}
    </>
  );
}
