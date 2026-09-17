import React, { useState, useEffect } from 'react';

export default {
  title: 'Foundations/Motion',
  parameters: { layout: 'fullscreen' },
};

// ─────────────────────────────────────────────────────────────────────────────
// TOKEN DATA
// ─────────────────────────────────────────────────────────────────────────────

const TRANSITION_TOKENS = [
  { name: '--duration-instant',  value: '50ms',   pct: 2.5,  usage: 'Focus rings, active press states' },
  { name: '--duration-fast',     value: '100ms',  pct: 5,    usage: 'Toggle, checkbox, badge state change' },
  { name: '--duration-base',     value: '200ms',  pct: 10,   usage: 'Hover, focus, colour transitions — default' },
  { name: '--duration-slow',     value: '300ms',  pct: 15,   usage: 'Modal open, drawer slide, panel expand' },
  { name: '--duration-slower',   value: '400ms',  pct: 20,   usage: 'Page transitions, onboarding step changes' },
];

const ANIMATION_TOKENS = [
  { name: '--duration-skeleton', value: '1500ms', pct: 75,   usage: 'Skeleton shimmer — use with ease-linear' },
  { name: '--duration-pulse',    value: '2000ms', pct: 100,  usage: 'Pulse/breathe on avatars, status dots' },
];

const EASING_TOKENS = [
  {
    name: '--ease-default',
    css: 'cubic-bezier(0, 0, 0.2, 1)',
    usage: 'Standard UI transitions — the safe default for anything not covered below.',
    cp: { x1: 0, y1: 0, x2: 0.2, y2: 1 },
    overshoot: false,
  },
  {
    name: '--ease-enter',
    css: 'cubic-bezier(0, 0, 0.2, 1)',
    usage: 'Elements entering the screen — fast deceleration feels confident and immediate.',
    cp: { x1: 0, y1: 0, x2: 0.2, y2: 1 },
    overshoot: false,
  },
  {
    name: '--ease-exit',
    css: 'cubic-bezier(0.4, 0, 1, 1)',
    usage: 'Elements leaving the screen — fast acceleration feels snappy, not abrupt.',
    cp: { x1: 0.4, y1: 0, x2: 1, y2: 1 },
    overshoot: false,
  },
  {
    name: '--ease-spring',
    css: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    usage: 'Toggle, checkbox, success badge — subtle overshoot. Never on modals or drawers.',
    cp: { x1: 0.34, y1: 1.56, x2: 0.64, y2: 1 },
    overshoot: true,
  },
  {
    name: '--ease-linear',
    css: 'linear',
    usage: 'Progress bars, shimmer animations — any continuous loop that needs constant velocity.',
    cp: null,
    overshoot: false,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SHARED HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function modeBtn(active) {
  return {
    height: '32px', padding: '0 16px',
    fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 500,
    cursor: 'pointer', outline: 'none', borderRadius: 'var(--radius-sm)',
    background: active ? 'var(--color-brand-btn)' : 'transparent',
    color: active ? 'var(--color-brand-btn-text)' : 'var(--color-text-secondary)',
    border: active ? '1px solid transparent' : '1px solid var(--color-border-default)',
  };
}

function ControlsRow({ dark, setDark }) {
  return (
    <div style={{ background: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border-default)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 24px' }}>
        <button aria-pressed={!dark} onClick={() => setDark(false)} style={modeBtn(!dark)}>Light</button>
        <button aria-pressed={dark}  onClick={() => setDark(true)}  style={modeBtn(dark)}>Dark</button>
      </div>
    </div>
  );
}

function Callout({ children }) {
  return (
    <div style={{
      borderLeft: '3px solid #C2410C', /* story-only */
      background: 'var(--color-bg-secondary)',
      padding: '12px 16px',
      marginBottom: '24px',
      fontFamily: 'Inter, sans-serif',
      fontSize: '0.875rem',
      color: 'var(--color-text-secondary)',
      lineHeight: '1.5rem',
    }}>
      {children}
    </div>
  );
}

function RulesBlock({ rules }) {
  return (
    <div style={{ borderLeft: '3px solid #C2410C', /* story-only */ padding: '12px 16px', background: 'var(--color-bg-secondary)', marginTop: '32px' }}>
      <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#C2410C', /* story-only */ marginBottom: '8px' }}>
        Rules
      </div>
      {rules.map((rule, i) => (
        <div key={i} style={{ position: 'relative', paddingLeft: '12px', fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: '1.5rem' }}>
          <span style={{ position: 'absolute', left: 0, color: '#C2410C' /* story-only */ }}>•</span>
          {rule}
        </div>
      ))}
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'baseline', gap: '12px',
      padding: '16px 0 8px 0',
      borderBottom: '1px solid var(--color-border-default)',
      marginBottom: '4px',
    }}>
      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-primary)' }}>
        {children}
      </span>
    </div>
  );
}

function ReducedMotionBadge() {
  return (
    <div style={{
      padding: '6px 10px',
      background: 'var(--color-bg-secondary)',
      border: '1px solid var(--color-border-default)',
      borderRadius: 'var(--radius-sm)',
      fontFamily: 'Inter, sans-serif',
      fontSize: '0.75rem',
      color: 'var(--color-text-secondary)',
      textAlign: 'center',
    }}>
      Reduced motion active
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EASING SVG CURVE
// ─────────────────────────────────────────────────────────────────────────────

function EasingCurveSVG({ token }) {
  // SVG coordinate space: (0,0) top-left, (80,60) bottom-right
  // Bezier: from bottom-left (0,60) to top-right (80,0)

  if (token.name === '--ease-linear' || !token.cp) {
    return (
      <svg viewBox="0 0 80 60" width="100%" height="60" style={{ display: 'block' }}>
        <line x1="0" y1="0" x2="80" y2="0" stroke="var(--color-border-default)" strokeWidth="0.5" />
        <line x1="0" y1="60" x2="80" y2="60" stroke="var(--color-border-default)" strokeWidth="0.5" />
        <path d="M 0 60 L 80 0" stroke="#C2410C" /* story-only */ strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    );
  }

  const { x1, y1, x2, y2 } = token.cp;
  const cp1x = x1 * 80;
  const cp1y = (1 - y1) * 60;
  const cp2x = x2 * 80;
  const cp2y = (1 - y2) * 60;

  const guides = [
    { x1: 0, y1: 60, x2: cp1x, y2: cp1y },
    { x1: 80, y1: 0, x2: cp2x, y2: cp2y },
  ];

  return (
    <svg viewBox="0 0 80 60" width="100%" height="60" style={{ display: 'block', overflow: 'visible' }}>
      {guides.map((g, i) => (
        <line key={i} x1={g.x1} y1={g.y1} x2={g.x2} y2={g.y2} stroke="var(--color-border-default)" strokeWidth="0.75" strokeDasharray="2,2" />
      ))}
      <circle cx={cp1x} cy={cp1y} r="2" fill="var(--color-border-strong)" />
      <circle cx={cp2x} cy={cp2y} r="2" fill="var(--color-border-strong)" />
      <path d={`M 0 60 C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, 80 0`} stroke="#C2410C" /* story-only */ strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STORY 1 — DURATION SCALE
// ─────────────────────────────────────────────────────────────────────────────

function DurationRow({ token, animated }) {
  const [width, setWidth] = useState('0%');

  useEffect(() => {
    if (animated) {
      const t = setTimeout(() => setWidth(token.pct + '%'), 50);
      return () => clearTimeout(t);
    }
  }, [animated, token.pct]);

  return (
    <div style={{
      display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '16px',
      padding: '10px 0', borderBottom: '0.5px solid var(--color-border-default)',
    }}>
      {/* Left: token meta */}
      <div style={{ width: '200px', flexShrink: 0 }}>
        <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem', color: '#C2410C', /* story-only */ lineHeight: '1rem', marginBottom: '2px' }}>
          {token.name}
        </div>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'var(--color-text-tertiary)', lineHeight: '1rem' }}>
          {token.value}
        </div>
      </div>

      {/* Middle: progress bar track */}
      <div style={{ flex: 1, height: '8px', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: width,
          background: '#C2410C', /* story-only */
          borderRadius: 'var(--radius-full)',
          transition: 'width var(--duration-base) var(--ease-enter)',
        }} />
      </div>

      {/* Right: usage */}
      <div style={{ width: '240px', flexShrink: 0, fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'var(--color-text-secondary)', lineHeight: '1.25rem' }}>
        {token.usage}
      </div>
    </div>
  );
}

function DurationScaleContent() {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ padding: '32px' }}>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.75rem', fontWeight: 700, lineHeight: '2.25rem', color: 'var(--color-text-primary)', margin: '0 0 8px 0' }}>
        Duration
      </h1>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 400, lineHeight: '1.75rem', color: 'var(--color-text-secondary)', margin: '0 0 32px 0' }}>
        Two groups — transitions (UI state changes) and animations (continuous loops). All durations collapse to 0ms under prefers-reduced-motion.
      </p>

      <Callout>
        Duration tokens split into two groups: Transitions (UI state changes) and Animations (continuous loops).
        All durations collapse to 0ms when prefers-reduced-motion is active — this is automatic via the globals.css media query.
      </Callout>

      <SectionLabel>Transition durations</SectionLabel>
      {TRANSITION_TOKENS.map((token) => (
        <DurationRow key={token.name} token={token} animated={animated} />
      ))}

      <div style={{ marginTop: '32px' }}>
        <SectionLabel>Animation durations</SectionLabel>
        {ANIMATION_TOKENS.map((token) => (
          <DurationRow key={token.name} token={token} animated={animated} />
        ))}
        <div style={{ marginTop: '12px', fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontStyle: 'italic', color: 'var(--color-text-secondary)', lineHeight: '1.5rem' }}>
          Animation duration tokens drive continuous loops — skeleton shimmer, pulse.
          Never use these for state transitions. Never use transition tokens for animations.
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STORY 2 — EASING CURVES
// ─────────────────────────────────────────────────────────────────────────────

function EasingCard({ token }) {
  const [isRight, setIsRight] = useState(false);
  const prefersReduced = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  return (
    <div style={{
      background: 'var(--color-bg-surface)',
      border: '1px solid var(--color-border-default)',
      borderRadius: 'var(--radius-md)',
      padding: '16px',
      display: 'flex', flexDirection: 'column', gap: '8px',
    }}>
      {/* Token name */}
      <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem', color: '#C2410C', /* story-only */ lineHeight: '1rem' }}>
        {token.name}
      </div>

      {/* SVG curve */}
      <EasingCurveSVG token={token} />

      {/* CSS value */}
      <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', color: 'var(--color-text-tertiary)', lineHeight: '1rem', wordBreak: 'break-all' }}>
        {token.css}
      </div>

      {/* Usage */}
      <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontStyle: 'italic', color: 'var(--color-text-secondary)', lineHeight: '1.5rem', flex: 1 }}>
        {token.usage}
      </div>

      {/* Demo strip */}
      {prefersReduced ? (
        <ReducedMotionBadge />
      ) : (
        <div>
          <div
            onClick={() => setIsRight((v) => !v)}
            style={{
              height: '44px',
              background: 'var(--color-bg-secondary)',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
              position: 'relative',
              cursor: 'pointer',
            }}
          >
            <div style={{
              width: '24px', height: '24px',
              background: '#C2410C', /* story-only */
              borderRadius: 'var(--radius-full)',
              position: 'absolute', top: '50%',
              transform: 'translateY(-50%)',
              left: isRight ? 'calc(100% - 34px)' : '10px',
              transition: `left 600ms ${token.css}`,
            }} />
          </div>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'var(--color-text-tertiary)', marginTop: '4px', textAlign: 'center' }}>
            click to preview
          </div>
        </div>
      )}
    </div>
  );
}

function EasingCurvesContent() {
  return (
    <div style={{ padding: '32px' }}>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.75rem', fontWeight: 700, lineHeight: '2.25rem', color: 'var(--color-text-primary)', margin: '0 0 8px 0' }}>
        Easing
      </h1>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 400, lineHeight: '1.75rem', color: 'var(--color-text-secondary)', margin: '0 0 32px 0' }}>
        5 easing tokens named by usage intent. Click any card to preview the curve live. ease-enter and ease-default share the same curve.
      </p>

      <Callout>
        Easing tokens are named by usage intent — enter, exit, spring, linear — not by CSS property names.
        This tells you exactly which to reach for without checking documentation.
        ease-enter and ease-default share the same curve: fast deceleration that feels confident and immediate.
      </Callout>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        {EASING_TOKENS.map((token) => (
          <EasingCard key={token.name} token={token} />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STORY 3 — LIVE DEMOS
// ─────────────────────────────────────────────────────────────────────────────

function useKeyframes() {
  useEffect(() => {
    if (document.getElementById('motion-story-keyframes')) return;
    const style = document.createElement('style');
    style.id = 'motion-story-keyframes';
    style.textContent = `
      @keyframes shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
      @keyframes pulse-opacity {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
      }
    `;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);
}

function DemoCell({ label, subLabel, children }) {
  return (
    <div style={{
      background: 'var(--color-bg-surface)',
      border: '1px solid var(--color-border-default)',
      borderRadius: 'var(--radius-md)',
      padding: '20px',
      display: 'flex', flexDirection: 'column', gap: '12px',
    }}>
      {children}
      <div>
        <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', color: '#C2410C', /* story-only */ lineHeight: '1rem', marginBottom: '2px' }}>
          {label}
        </div>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'var(--color-text-secondary)', lineHeight: '1.25rem' }}>
          {subLabel}
        </div>
      </div>
    </div>
  );
}

function Cell1HoverTransition({ prefersReduced }) {
  const [hovered, setHovered] = useState(false);

  return (
    <DemoCell label="--duration-base + --ease-default" subLabel="Hover me">
      {prefersReduced ? <ReducedMotionBadge /> : (
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            width: '40px', height: '40px',
            borderRadius: 'var(--radius-md)',
            background: '#C2410C', /* story-only */
            transform: hovered ? 'scale(1.08)' : 'scale(1)',
            opacity: hovered ? 0.85 : 1,
            transition: [
              'transform var(--duration-base) var(--ease-default)',
              'opacity var(--duration-base) var(--ease-default)',
            ].join(', '),
            cursor: 'pointer',
          }}
        />
      )}
    </DemoCell>
  );
}

function Cell2ToggleSpring({ prefersReduced }) {
  const [on, setOn] = useState(true);

  return (
    <DemoCell label="--duration-fast + --ease-spring" subLabel="Click to toggle">
      {prefersReduced ? <ReducedMotionBadge /> : (
        <div
          onClick={() => setOn((v) => !v)}
          style={{
            width: '44px', height: '24px',
            borderRadius: 'var(--radius-full)',
            background: on ? '#C2410C' : 'var(--color-text-tertiary)', /* story-only for orange */
            position: 'relative',
            cursor: 'pointer',
            transition: 'background-color var(--duration-fast) var(--ease-default)',
            flexShrink: 0,
          }}
        >
          <div style={{
            width: '20px', height: '20px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--color-bg-surface)',
            position: 'absolute', top: '2px',
            left: on ? 'calc(100% - 22px)' : '2px',
            transition: 'left var(--duration-fast) var(--ease-spring)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          }} />
        </div>
      )}
    </DemoCell>
  );
}

function Cell3ModalEnter({ prefersReduced }) {
  const [visible, setVisible] = useState(false);

  return (
    <DemoCell label="--duration-slow + --ease-enter/exit" subLabel="Click to enter / exit">
      {prefersReduced ? <ReducedMotionBadge /> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={() => setVisible((v) => !v)}
            style={{
              height: '32px', padding: '0 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border-default)',
              background: 'var(--color-bg-secondary)',
              color: 'var(--color-text-primary)',
              fontFamily: 'Inter, sans-serif', fontSize: '0.75rem',
              cursor: 'pointer',
            }}
          >
            {visible ? 'Exit' : 'Enter'}
          </button>
          <div style={{
            height: '40px', borderRadius: 'var(--radius-sm)',
            background: '#C2410C', /* story-only */
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(8px)',
            transition: visible
              ? 'opacity var(--duration-slow) var(--ease-enter), transform var(--duration-slow) var(--ease-enter)'
              : 'opacity var(--duration-slow) var(--ease-exit), transform var(--duration-slow) var(--ease-exit)',
          }} />
        </div>
      )}
    </DemoCell>
  );
}

function Cell4Skeleton({ prefersReduced }) {
  const lines = [
    { width: '100%', height: '12px' },
    { width: '100%', height: '12px' },
    { width: '70%',  height: '8px' },
  ];

  return (
    <DemoCell label="--duration-skeleton + --ease-linear" subLabel="Skeleton shimmer">
      {prefersReduced ? <ReducedMotionBadge /> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {lines.map((l, i) => (
            <div
              key={i}
              style={{
                width: l.width, height: l.height,
                borderRadius: 'var(--radius-xs)',
                background: 'linear-gradient(90deg, var(--color-bg-secondary) 25%, var(--color-bg-primary) 50%, var(--color-bg-secondary) 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer var(--duration-skeleton) var(--ease-linear) infinite',
              }}
            />
          ))}
        </div>
      )}
    </DemoCell>
  );
}

function Cell5Pulse({ prefersReduced }) {
  return (
    <DemoCell label="--duration-pulse" subLabel="Pulse animation">
      {prefersReduced ? <ReducedMotionBadge /> : (
        <div style={{
          width: '40px', height: '40px',
          borderRadius: 'var(--radius-full)',
          background: '#C2410C', /* story-only */
          animation: 'pulse-opacity var(--duration-pulse) var(--ease-linear) infinite',
        }} />
      )}
    </DemoCell>
  );
}

function Cell6StaggerList({ prefersReduced }) {
  const [items, setItems] = useState([]);
  const [played, setPlayed] = useState(false);

  function play() {
    setItems([]);
    setPlayed(false);
    setTimeout(() => {
      setItems([0, 1, 2, 3]);
      setTimeout(() => setPlayed(true), 50);
    }, 50);
  }

  return (
    <DemoCell label="--delay-stagger + --duration-base" subLabel="Staggered list entry">
      {prefersReduced ? <ReducedMotionBadge /> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={play}
            style={{
              height: '32px', padding: '0 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border-default)',
              background: 'var(--color-bg-secondary)',
              color: 'var(--color-text-primary)',
              fontFamily: 'Inter, sans-serif', fontSize: '0.75rem',
              cursor: 'pointer',
            }}
          >
            Play
          </button>
          {items.map((_, i) => (
            <div
              key={i}
              style={{
                height: '10px',
                background: '#C2410C', /* story-only */
                borderRadius: 'var(--radius-xs)',
                opacity: played ? 0.7 : 0,
                transform: played ? 'translateX(0)' : 'translateX(-12px)',
                transition: [
                  'opacity var(--duration-base) var(--ease-enter)',
                  'transform var(--duration-base) var(--ease-enter)',
                ].join(', '),
                transitionDelay: `${i * 50}ms`, /* = index * --delay-stagger (50ms) */
              }}
            />
          ))}
        </div>
      )}
    </DemoCell>
  );
}

function LiveDemosContent() {
  useKeyframes();

  const prefersReduced = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  return (
    <div style={{ padding: '32px' }}>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.75rem', fontWeight: 700, lineHeight: '2.25rem', color: 'var(--color-text-primary)', margin: '0 0 8px 0' }}>
        Live demos
      </h1>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 400, lineHeight: '1.75rem', color: 'var(--color-text-secondary)', margin: '0 0 32px 0' }}>
        Interactive demonstrations of each duration and easing pairing. Cells show reduced-motion badge if system preference is active.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
        <Cell1HoverTransition prefersReduced={prefersReduced} />
        <Cell2ToggleSpring prefersReduced={prefersReduced} />
        <Cell3ModalEnter prefersReduced={prefersReduced} />
        <Cell4Skeleton prefersReduced={prefersReduced} />
        <Cell5Pulse prefersReduced={prefersReduced} />
        <Cell6StaggerList prefersReduced={prefersReduced} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STORY 4 — REFERENCE TABLE
// ─────────────────────────────────────────────────────────────────────────────

const DURATION_TABLE_GROUPS = [
  {
    group: 'Transition',
    tokens: [
      { name: '--duration-instant',  value: '50ms',    usage: 'Focus rings, active press states' },
      { name: '--duration-fast',     value: '100ms',   usage: 'Toggle, checkbox, badge state change' },
      { name: '--duration-base',     value: '200ms',   usage: 'Hover, focus, colour transitions — default' },
      { name: '--duration-slow',     value: '300ms',   usage: 'Modal open, drawer slide, panel expand' },
      { name: '--duration-slower',   value: '400ms',   usage: 'Page transitions, onboarding step changes' },
    ],
  },
  {
    group: 'Animation',
    tokens: [
      { name: '--duration-skeleton', value: '1500ms',  usage: 'Skeleton shimmer — use with ease-linear' },
      { name: '--duration-pulse',    value: '2000ms',  usage: 'Pulse/breathe on avatars, status dots' },
    ],
  },
  {
    group: 'Delay',
    tokens: [
      { name: '--delay-stagger',     value: '50ms',    usage: 'Per-item increment for staggered list entry' },
    ],
  },
  {
    group: 'Persistence',
    tokens: [
      { name: '--duration-toast',    value: '5000ms',  usage: 'Toast auto-dismiss (success/info) — EXCLUDED from the reduced-motion collapse below: this is a display-persistence timer, not motion, so it does not zero out under prefers-reduced-motion' },
    ],
  },
  {
    group: 'A11y',
    tokens: [
      { name: '--duration-reduced',  value: '0ms',     usage: 'Overrides all durations when prefers-reduced-motion is active (via @media in globals.css)' },
    ],
  },
];

const EASING_TABLE = [
  { name: '--ease-default', css: 'cubic-bezier(0, 0, 0.2, 1)',        when: 'Standard UI transitions — the safe default' },
  { name: '--ease-enter',   css: 'cubic-bezier(0, 0, 0.2, 1)',        when: 'Elements entering the screen' },
  { name: '--ease-exit',    css: 'cubic-bezier(0.4, 0, 1, 1)',        when: 'Elements leaving the screen' },
  { name: '--ease-spring',  css: 'cubic-bezier(0.34, 1.56, 0.64, 1)', when: 'Toggle, checkbox, success badge — subtle overshoot only' },
  { name: '--ease-linear',  css: 'linear',                             when: 'Progress bars, shimmer, any continuous loop' },
];

const MOTION_RULES = [
  'Never hardcode a duration or easing value in a component. Always use var(--duration-*) and var(--ease-*).',
  'Transition tokens and animation tokens are different mental models. Skeleton shimmer uses --duration-skeleton (loop), not --duration-base (state change).',
  'ease-enter and ease-exit are not opposites of the same thing — they are different curves. Enter decelerates (feels welcoming), exit accelerates (feels fast). Always use the right one.',
  '--ease-spring is for small, snappy UI elements only: toggles, checkboxes, notification dots. Never on modals, drawers, or page transitions.',
  'The @media (prefers-reduced-motion) block in globals.css automatically collapses all durations to 0ms. You do not need to handle this in every component — it is system-level.',
];

const TH_STYLE = {
  padding: '8px 12px',
  textAlign: 'left',
  borderBottom: '1px solid var(--color-border-default)',
  fontSize: '0.875rem',
  fontWeight: 500,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: 'var(--color-text-secondary)',
  whiteSpace: 'nowrap',
  fontFamily: 'Inter, sans-serif',
};

const GROUP_HDR_STYLE = {
  padding: '6px 12px',
  background: 'var(--color-bg-secondary)',
  fontFamily: 'Inter, sans-serif',
  fontSize: '0.75rem',
  fontWeight: 500,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: 'var(--color-text-secondary)',
  borderBottom: '1px solid var(--color-border-default)',
};

function ReferenceTableContent() {
  let rowIndex = 0;

  return (
    <div style={{ padding: '32px' }}>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.75rem', fontWeight: 700, lineHeight: '2.25rem', color: 'var(--color-text-primary)', margin: '0 0 8px 0' }}>
        Reference table
      </h1>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 400, lineHeight: '1.75rem', color: 'var(--color-text-secondary)', margin: '0 0 32px 0' }}>
        All motion tokens: durations, delays, and easing curves with usage guidance.
      </p>

      {/* Section 1: Duration tokens */}
      <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.25rem', fontWeight: 600, lineHeight: '1.75rem', color: 'var(--color-text-secondary)', margin: '0 0 12px 0' }}>
        Duration tokens
      </h2>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Inter, sans-serif', marginBottom: '48px' }}>
        <thead>
          <tr>
            {['Token', 'Value', 'Group', 'Usage'].map((col) => (
              <th key={col} style={TH_STYLE}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {DURATION_TABLE_GROUPS.map((group) => [
            <tr key={`hdr-${group.group}`}>
              <td colSpan={4} style={GROUP_HDR_STYLE}>{group.group}</td>
            </tr>,
            ...group.tokens.map((token) => {
              const isEven = rowIndex % 2 === 1;
              rowIndex++;
              return (
                <tr key={token.name} style={{ background: isEven ? 'var(--color-bg-secondary)' : 'transparent' }}>
                  <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--color-border-default)', fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem', color: '#C2410C', /* story-only */ whiteSpace: 'nowrap' }}>
                    {token.name}
                  </td>
                  <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--color-border-default)', fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem', color: 'var(--color-text-primary)', whiteSpace: 'nowrap' }}>
                    {token.value}
                  </td>
                  <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--color-border-default)', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                    {group.group}
                  </td>
                  <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--color-border-default)', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                    {token.usage}
                  </td>
                </tr>
              );
            }),
          ])}
        </tbody>
      </table>

      {/* Section 2: Easing tokens */}
      <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.25rem', fontWeight: 600, lineHeight: '1.75rem', color: 'var(--color-text-secondary)', margin: '0 0 12px 0' }}>
        Easing tokens
      </h2>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Inter, sans-serif' }}>
        <thead>
          <tr>
            {['Token', 'CSS value', 'When to use'].map((col) => (
              <th key={col} style={TH_STYLE}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {EASING_TABLE.map((row, i) => (
            <tr key={row.name} style={{ background: i % 2 === 1 ? 'var(--color-bg-secondary)' : 'transparent' }}>
              <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--color-border-default)', fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem', color: '#C2410C', /* story-only */ whiteSpace: 'nowrap' }}>
                {row.name}
              </td>
              <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--color-border-default)', fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', color: 'var(--color-text-tertiary)', wordBreak: 'break-all', maxWidth: '260px' }}>
                {row.css}
              </td>
              <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--color-border-default)', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                {row.when}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <RulesBlock rules={MOTION_RULES} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

export const DurationScale = {
  render: () => {
    function Story() {
      const [dark, setDark] = useState(false);
      return (
        <div className={dark ? 'dark' : ''} style={{ background: 'var(--color-bg-primary)', minHeight: '100vh' }}>
          <ControlsRow dark={dark} setDark={setDark} />
          <DurationScaleContent />
        </div>
      );
    }
    return React.createElement(Story);
  },
};
DurationScale.storyName = 'Duration Scale';

export const EasingCurves = {
  render: () => {
    function Story() {
      const [dark, setDark] = useState(false);
      return (
        <div className={dark ? 'dark' : ''} style={{ background: 'var(--color-bg-primary)', minHeight: '100vh' }}>
          <ControlsRow dark={dark} setDark={setDark} />
          <EasingCurvesContent />
        </div>
      );
    }
    return React.createElement(Story);
  },
};
EasingCurves.storyName = 'Easing Curves';

export const LiveDemos = {
  render: () => {
    function Story() {
      const [dark, setDark] = useState(false);
      return (
        <div className={dark ? 'dark' : ''} style={{ background: 'var(--color-bg-primary)', minHeight: '100vh' }}>
          <ControlsRow dark={dark} setDark={setDark} />
          <LiveDemosContent />
        </div>
      );
    }
    return React.createElement(Story);
  },
};
LiveDemos.storyName = 'Live Demos';

export const ReferenceTable = {
  render: () => {
    function Story() {
      const [dark, setDark] = useState(false);
      return (
        <div className={dark ? 'dark' : ''} style={{ background: 'var(--color-bg-primary)', minHeight: '100vh' }}>
          <ControlsRow dark={dark} setDark={setDark} />
          <ReferenceTableContent />
        </div>
      );
    }
    return React.createElement(Story);
  },
};
ReferenceTable.storyName = 'Reference Table';
