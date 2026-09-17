'use client';

import React, {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { Toast } from './Toast.jsx';

// Toast is the first imperative/queued component in this repo: every other
// component so far is purely declarative (render props → JSX in place), but
// a toast is fired from anywhere — a save handler, a copy-to-clipboard click
// — with no natural spot in the tree to hold its JSX. So, matching the
// DateTimePicker precedent (a hand-rolled scrim/dialog rather than reaching
// for a UI library because this repo builds its own primitives), this is a
// local queue + portal implementation, not Radix Toast or any other
// third-party toast library — one fewer dependency, and it stays consistent
// with how every other overlay (Tooltip, DateTimePicker) is built here.

export const ToastContext = createContext(null);

const MAX_VISIBLE = 3;
const BREAKPOINT_SM = 600; // matches --breakpoint-sm in globals.css

function readTokenMs(varName, fallback) {
  if (typeof window === 'undefined') return fallback;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  const ms = parseFloat(raw);
  return Number.isFinite(ms) ? ms : fallback;
}

// Plain module-level factory, deliberately OUTSIDE any component/hook body —
// attaching .success/.error/.info/.dismiss to the callable base function is
// an ordinary "static methods on a function" JS pattern, but React's newer
// compiler-oriented lint rules flag ANY property mutation on a value defined
// inside a component's render body (see Tooltip.jsx for the same category of
// findings on an already-shipped, approved component). Building it here
// avoids that false positive without changing the public shape at all.
function createToastApi(addToast, dismissFn) {
  const fn = (input) => addToast(input);
  fn.success = (title, opts = {}) => addToast({ ...opts, tone: 'success', title });
  fn.error = (title, opts = {}) => addToast({ ...opts, tone: 'error', title });
  fn.info = (title, opts = {}) => addToast({ ...opts, tone: 'info', title });
  fn.dismiss = (id) => dismissFn(id);
  return fn;
}

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= BREAKPOINT_SM : false
  );
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${BREAKPOINT_SM}px)`);
    const onChange = () => setIsDesktop(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return isDesktop;
}

let idCounter = 0;

/**
 * ToastProvider — wraps the app once, near root. Holds the toast queue in
 * state and renders the portal viewport into document.body.
 *
 * Queue model: `toasts` is stored in strict arrival order (FIFO, oldest at
 * index 0 — appended, never unshifted). The first MAX_VISIBLE entries are
 * "active" (rendered + timed); everything past that is queued, inert, and
 * promoted only once a slot actually frees up (an active toast finishes
 * exiting and is spliced out). Within the active set, "newest on top" is a
 * RENDER-ORDER concern only — the active slice itself stays oldest-first for
 * fair FIFO promotion, and is reversed just before mapping to <Toast>
 * elements so the most-recently-shown one renders at the top of the stack.
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  // id -> { timeoutId, remainingMs, startedAt, pauseReasons: Set<string> }
  const timerData = useRef(new Map());
  const isDesktop = useIsDesktop();

  const clearTimerEntry = useCallback((id) => {
    const data = timerData.current.get(id);
    if (data?.timeoutId) clearTimeout(data.timeoutId);
    timerData.current.delete(id);
  }, []);

  const beginExit = useCallback(
    (id) => {
      clearTimerEntry(id);
      setToasts((current) =>
        current.map((t) => (t.id === id && t.status !== 'exiting' ? { ...t, status: 'exiting' } : t))
      );
      // Read live, same convention as DateTimePicker's scrim close delay —
      // this also means prefers-reduced-motion's global collapse of
      // --duration-base to 0ms is honoured automatically, no special-casing.
      const delay = readTokenMs('--duration-base', 200);
      setTimeout(() => {
        setToasts((current) => current.filter((t) => t.id !== id));
      }, delay);
    },
    [clearTimerEntry]
  );

  const dismiss = useCallback((id) => beginExit(id), [beginExit]);

  const startTimer = useCallback(
    (id, ms) => {
      // If a toast is promoted while the tab is already backgrounded, don't
      // start ticking at all — start it pre-paused for 'visibility', same as
      // if it had been paused after the fact. Otherwise a toast promoted
      // during a hidden tab would silently burn down its whole timer before
      // the user ever saw it.
      const hiddenNow = typeof document !== 'undefined' && document.visibilityState === 'hidden';
      timerData.current.set(id, {
        timeoutId: hiddenNow ? null : setTimeout(() => beginExit(id), ms),
        remainingMs: ms,
        startedAt: Date.now(),
        pauseReasons: hiddenNow ? new Set(['visibility']) : new Set(),
      });
      if (hiddenNow) {
        setToasts((current) =>
          current.map((t) => (t.id === id && t.status === 'resting' ? { ...t, status: 'paused' } : t))
        );
      }
    },
    [beginExit]
  );

  // Pause/resume use a reason-set per toast (not a single boolean) so hover,
  // focus, drag, and tab-visibility can overlap freely — the timer only
  // actually restarts once every reason has cleared. WCAG 2.2.1 Timing
  // Adjustable: track remaining time on pause so resume continues counting
  // down, never restarts the full duration.
  const pause = useCallback((id, reason) => {
    const data = timerData.current.get(id);
    if (!data) return; // persistent toasts have no timer entry — nothing to pause
    const wasAlreadyPaused = data.pauseReasons.size > 0;
    data.pauseReasons.add(reason);
    if (wasAlreadyPaused) return;
    if (data.timeoutId) {
      clearTimeout(data.timeoutId);
      data.remainingMs = Math.max(0, data.remainingMs - (Date.now() - data.startedAt));
      data.timeoutId = null;
    }
    setToasts((current) =>
      current.map((t) => (t.id === id && t.status === 'resting' ? { ...t, status: 'paused' } : t))
    );
  }, []);

  const resume = useCallback(
    (id, reason) => {
      const data = timerData.current.get(id);
      if (!data) return;
      data.pauseReasons.delete(reason);
      if (data.pauseReasons.size > 0) return;
      data.startedAt = Date.now();
      data.timeoutId = setTimeout(() => beginExit(id), data.remainingMs);
      setToasts((current) =>
        current.map((t) => (t.id === id && t.status === 'paused' ? { ...t, status: 'resting' } : t))
      );
    },
    [beginExit]
  );

  const addToast = useCallback((input) => {
    const { tone = 'info', title, description, action, duration } = input ?? {};
    // error is always persistent; any toast with an action is persistent
    // regardless of tone (Carbon rule: action ⇒ stays until dismissed);
    // duration: 0 is an explicit opt-out of auto-dismiss for success/info.
    const persistent = tone === 'error' || Boolean(action) || duration === 0;
    const id = `toast-${++idCounter}`;
    setToasts((current) => [
      ...current,
      { id, tone, title, description, action, duration, persistent, status: 'queued' },
    ]);
    return id;
  }, []);

  // Promote queued toasts into the active (first MAX_VISIBLE) window:
  // queued -> entering -> resting, and start the auto-dismiss timer for
  // non-persistent tones. Re-runs on every `toasts` change; the `status ===
  // 'queued'` guard makes it a no-op once a toast has already been promoted,
  // so it converges instead of looping.
  useEffect(() => {
    const activeIds = toasts.slice(0, MAX_VISIBLE).map((t) => t.id);
    const toPromote = toasts.filter((t) => activeIds.includes(t.id) && t.status === 'queued');
    if (toPromote.length === 0) return undefined;

    setToasts((current) =>
      current.map((t) => (activeIds.includes(t.id) && t.status === 'queued' ? { ...t, status: 'entering' } : t))
    );

    const raf = requestAnimationFrame(() => {
      setToasts((current) =>
        current.map((t) => (activeIds.includes(t.id) && t.status === 'entering' ? { ...t, status: 'resting' } : t))
      );
      toPromote.forEach((t) => {
        if (!t.persistent) {
          const ms = typeof t.duration === 'number' ? t.duration : readTokenMs('--duration-toast', 5000);
          startTimer(t.id, ms);
        }
      });
    });
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toasts]);

  // Escape dismisses the most-recently-shown toast — the one rendered at the
  // top of the active stack (last element of the oldest-first active slice).
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key !== 'Escape') return;
      const active = toasts.slice(0, MAX_VISIBLE);
      const newest = active[active.length - 1];
      if (newest && newest.status !== 'exiting') dismiss(newest.id);
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [toasts, dismiss]);

  // Pause every non-persistent timer while the tab is hidden (WCAG 2.2.1) —
  // a backgrounded tab shouldn't burn down a toast's countdown before the
  // user has had any chance to see it.
  useEffect(() => {
    function onVisibility() {
      const reason = 'visibility';
      if (document.visibilityState === 'hidden') {
        toasts.forEach((t) => {
          if (!t.persistent) pause(t.id, reason);
        });
      } else {
        toasts.forEach((t) => {
          if (!t.persistent) resume(t.id, reason);
        });
      }
    }
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [toasts, pause, resume]);

  useEffect(() => {
    const timers = timerData.current;
    return () => {
      timers.forEach((data) => data.timeoutId && clearTimeout(data.timeoutId));
      timers.clear();
    };
  }, []);

  const toast = createToastApi(addToast, dismiss);

  const active = toasts.slice(0, MAX_VISIBLE);
  const stacked = [...active].reverse(); // newest-of-active renders first (top of stack)

  const viewport =
    typeof document !== 'undefined'
      ? createPortal(
          <ol
            style={{
              position: 'fixed',
              // Deliberately above Tooltip's 9000 — a confirmation must never
              // be hidden behind a tooltip. Informal z-scale: Tooltip 9000 <
              // Toast 9500.
              zIndex: 9500,
              top: 'calc(var(--space-4) + env(safe-area-inset-top))',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-3)',
              margin: 0,
              padding: 0,
              listStyle: 'none',
              pointerEvents: 'none',
              left: isDesktop ? 'auto' : 'var(--space-4)',
              right: isDesktop ? 'calc(var(--space-4) + env(safe-area-inset-right))' : 'var(--space-4)',
              width: isDesktop ? '400px' : 'auto',
              alignItems: isDesktop ? 'flex-end' : 'center',
            }}
          >
            {stacked.map((t) => (
              <Toast key={t.id} toast={t} isDesktop={isDesktop} onDismiss={dismiss} onPause={pause} onResume={resume} />
            ))}
          </ol>,
          document.body
        )
      : null;

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {viewport}
    </ToastContext.Provider>
  );
}
