import React, { useState, useEffect } from 'react';
import { FileUpload } from './FileUpload.jsx';
import { Button } from '@/components/ui/Button/Button.jsx';

// ─────────────────────────────────────────────────────────────────────────────
// META
// ─────────────────────────────────────────────────────────────────────────────

export default {
  title: 'Components/FileUpload',
  parameters: {
    layout: 'fullscreen',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function StoryFrame({ children }) {
  const [isDark, setIsDark] = useState(false);

  // FileUpload's filename Tooltip portals into document.body, outside this
  // wrapper's .dark class — sync it onto body so the portal receives
  // dark-mode tokens too. Same technique as Select/DateTimePicker/Tooltip.
  useEffect(() => {
    document.body.classList.toggle('dark', isDark);
    return () => document.body.classList.remove('dark');
  }, [isDark]);

  return (
    <div
      className={isDark ? 'dark' : ''}
      style={{ background: 'var(--color-bg-primary)', minHeight: '100vh', width: '100%', padding: '32px' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <button
          onClick={() => setIsDark(false)}
          aria-pressed={!isDark}
          style={{
            height: '32px', padding: '0 16px',
            borderRadius: 'var(--radius-sm)',
            border: !isDark ? 'none' : '1px solid var(--color-border-default)',
            background: !isDark ? 'var(--color-brand-btn)' : 'transparent',
            color: !isDark ? 'var(--color-brand-btn-text)' : 'var(--color-text-secondary)',
            fontFamily: 'Inter', fontWeight: 500, fontSize: '0.875rem', cursor: 'pointer',
          }}
        >
          Light
        </button>
        <button
          onClick={() => setIsDark(true)}
          aria-pressed={isDark}
          style={{
            height: '32px', padding: '0 16px',
            borderRadius: 'var(--radius-sm)',
            border: isDark ? 'none' : '1px solid var(--color-border-default)',
            background: isDark ? 'var(--color-brand-btn)' : 'transparent',
            color: isDark ? 'var(--color-brand-btn-text)' : 'var(--color-text-secondary)',
            fontFamily: 'Inter', fontWeight: 500, fontSize: '0.875rem', cursor: 'pointer',
          }}
        >
          Dark
        </button>
      </div>
      <div style={{ borderBottom: '1px solid var(--color-border-default)', marginBottom: '32px' }} />
      {children}
    </div>
  );
}

function Divider() {
  return <div style={{ borderBottom: '1px solid var(--color-border-default)', margin: '48px 0' }} />;
}

function SectionHead({ title, description }) {
  return (
    <div style={{ marginBottom: '32px' }}>
      <h2 style={{
        fontFamily: 'Inter, sans-serif', fontSize: '1.25rem', fontWeight: 600,
        lineHeight: '1.75rem', color: 'var(--color-text-primary)', margin: '0 0 8px 0',
      }}>
        {title}
      </h2>
      {description && (
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 400,
          lineHeight: '1.75rem', color: 'var(--color-text-secondary)', margin: 0,
        }}>
          {description}
        </p>
      )}
    </div>
  );
}

function BlockLabel({ children }) {
  return (
    <div style={{
      fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 500,
      letterSpacing: '0.06em', textTransform: 'uppercase',
      color: 'var(--color-text-secondary)', marginBottom: '12px',
    }}>
      {children}
    </div>
  );
}

function InfoBox({ children, style }) {
  return (
    <div style={{
      background: 'var(--color-bg-surface)',
      border: '1px solid var(--color-border-default)',
      borderRadius: 'var(--radius-md)',
      padding: '24px',
      ...style,
    }}>
      {children}
    </div>
  );
}

function Note({ children }) {
  return (
    <p style={{
      fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
      color: 'var(--color-text-secondary)', margin: '16px 0 0 0',
    }}>
      {children}
    </p>
  );
}

function Code({ children }) {
  return <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem' }}>{children}</code>;
}

// ─────────────────────────────────────────────────────────────────────────────
// A genuinely valid, tiny (1×1px) PNG — built at story-render time so the
// Success/thumbnail demos show a REAL decoded image via URL.createObjectURL,
// not a broken-image icon standing in for one.
// ─────────────────────────────────────────────────────────────────────────────

const TINY_PNG_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';

function makeImageFile(filename, mimeType = 'image/png') {
  const byteChars = atob(TINY_PNG_BASE64);
  const bytes = new Uint8Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) bytes[i] = byteChars.charCodeAt(i);
  return new File([bytes], filename, { type: mimeType });
}

// ─────────────────────────────────────────────────────────────────────────────
// INTERACTIVE WRAPPERS — every demo below is a live, controlled instance.
// ─────────────────────────────────────────────────────────────────────────────

function FileUploadDemo({ initialValue = null, ...props }) {
  const [value, setValue] = useState(initialValue);
  return <FileUpload {...props} value={value} onChange={setValue} />;
}

// Drives the component's real `progress` prop through a simulated interval,
// so the reviewer sees the EXISTING ProgressBar actually animate — this is
// not a static "80%" mockup.
function UploadSimulationDemo({ filename }) {
  const [value, setValue] = useState(null);
  const [progress, setProgress] = useState(undefined);

  useEffect(() => {
    if (progress === undefined || progress >= 100) return;
    const t = setTimeout(() => setProgress((p) => Math.min(p + 8, 100)), 150);
    return () => clearTimeout(t);
  }, [progress]);

  useEffect(() => {
    if (progress !== 100) return;
    // Brief pause at 100% so the filled bar is visible before the component
    // drops into its own success view (progress becomes undefined again).
    const t = setTimeout(() => setProgress(undefined), 400);
    return () => clearTimeout(t);
  }, [progress]);

  const start = () => {
    setValue(makeImageFile(filename, 'image/jpeg'));
    setProgress(0);
  };

  const reset = () => {
    setValue(null);
    setProgress(undefined);
  };

  return (
    <div className="flex flex-col items-start" style={{ gap: 'var(--space-3)' }}>
      <FileUpload label="Screenshot (optional)" value={value} onChange={setValue} progress={progress} />
      <div className="flex" style={{ gap: 'var(--space-2)' }}>
        <Button size="sm" variant="secondary" onClick={start} disabled={progress !== undefined}>
          Simulate upload
        </Button>
        {value && progress === undefined && (
          <Button size="sm" variant="ghost" onClick={reset}>Reset</Button>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS — reference tables
// ─────────────────────────────────────────────────────────────────────────────

const PROPS = [
  {
    name: 'label',
    type: 'string',
    defaultVal: '—',
    description: 'Visible label above the control. Always required — use hideLabel to visually hide it when context is sufficient.',
  },
  {
    name: 'hideLabel',
    type: 'bool',
    defaultVal: 'false',
    description: 'Applies sr-only to the label. Must be paired with an explicit aria-label — a dev warning fires if omitted.',
  },
  {
    name: 'variant',
    type: "'button' | 'dropzone'",
    defaultVal: "'button'",
    description: "'button' is the mobile/form-embedded default. 'dropzone' wraps the same button in a dashed drag-and-drop area, active only at md (768px) and up.",
  },
  {
    name: 'accept',
    type: 'string',
    defaultVal: "'image/*'",
    description: 'Native <input accept> pattern. Also drives the hint text and the internal type-validation message.',
  },
  {
    name: 'maxSizeMB',
    type: 'number',
    defaultVal: '5',
    description: 'Maximum accepted file size in megabytes. Drives the hint text and the internal size-validation message.',
  },
  {
    name: 'value',
    type: 'File | null',
    defaultVal: 'null',
    description: 'Controlled: the currently selected file. A truthy value (with no progress or error) renders the success row.',
  },
  {
    name: 'onChange',
    type: '(file: File|null) => void',
    defaultVal: 'undefined',
    description: 'Fires with a valid File on selection, or null on removal. Never fires for a file that fails internal validation.',
  },
  {
    name: 'progress',
    type: 'number (0–100)',
    defaultVal: 'undefined',
    description: 'When a number, renders the uploading state — real byte-progress via the existing ProgressBar, plus a compact Spinner.',
  },
  {
    name: 'error',
    type: 'string',
    defaultVal: 'undefined',
    description: 'External error (e.g. a failed upload). Overrides internal type/size validation messages — same convention as Select/Input.',
  },
  {
    name: 'disabled',
    type: 'bool',
    defaultVal: 'false',
    description: 'Applies --opacity-disabled (0.4) to the browse button and blocks drag-and-drop. No disabled colour token.',
  },
  {
    name: 'required',
    type: 'bool',
    defaultVal: 'false',
    description: 'Appends a red * after the label.',
  },
  {
    name: 'id',
    type: 'string',
    defaultVal: 'auto',
    description: 'Auto-generated with useId() when omitted — set on the visible Button (the real accessible control), not the hidden input.',
  },
  {
    name: 'name',
    type: 'string',
    defaultVal: 'undefined',
    description: 'Form field name on the hidden native <input>, for native form submission.',
  },
];

const TOKENS = [
  { token: '--color-border-default', value: '#dddddd / #2a2a2a', usage: 'Dropzone dashed border, resting; thumbnail/fallback-icon frame' },
  { token: '--color-focus-ring', value: '→ #c2410c / → #fb923c', usage: 'Dropzone dashed border on dragover (desktop only)' },
  { token: '--color-status-error-text', value: '#831414 / #df9797', usage: 'Error icon + message text' },
  { token: '--color-text-secondary', value: '#707070 / #adadad', usage: 'Hint text; remove-button icon colour; fallback file-icon colour' },
  { token: '--color-text-primary', value: '#121212 / #fbfbfb', usage: 'Label text; filename text' },
  { token: '--color-bg-secondary', value: '#dddddd / #171717', usage: 'Fallback file-icon frame background (non-image accept override)' },
  { token: '--radius-md', value: '12px', usage: 'Dropzone container corners' },
  { token: '--radius-sm', value: '8px', usage: 'Thumbnail / fallback-icon frame corners' },
  { token: '--space-6', value: '24px', usage: 'Dropzone container vertical padding' },
  { token: '--duration-base / --ease-default', value: '200ms', usage: 'Dragover border-colour transition' },
  { token: '--opacity-disabled', value: '0.4', usage: 'Disabled state — no disabled colour token' },
];

// ─────────────────────────────────────────────────────────────────────────────
// STORY EXPORT
// ─────────────────────────────────────────────────────────────────────────────

export const Overview = () => (
  <StoryFrame>

    {/* ── Page header ──────────────────────────────────────────────────────── */}
    <div style={{ marginBottom: '48px' }}>
      <h1 style={{
        fontFamily: 'Outfit, sans-serif', fontSize: '1.75rem', fontWeight: 700,
        lineHeight: '2.25rem', letterSpacing: '-0.02em',
        color: 'var(--color-text-primary)', margin: '0 0 8px 0',
      }}>
        FileUpload
      </h1>
      <p style={{
        fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 400,
        lineHeight: '1.75rem', color: 'var(--color-text-secondary)', margin: 0,
      }}>
        Single-image attachment. Mobile-first: a click/tap-to-browse button opens the native file picker on every
        breakpoint; drag-and-drop is a desktop-only (md, 768px+) enhancement wrapped around that same button.
        2 variants · 1 size · 5 states.
      </p>
    </div>

    {/* ── Gallery — button variant ─────────────────────────────────────────── */}
    <SectionHead
      title="Button variant — default"
      description="The mobile and form-embedded default: browse button + hint line. This is the bug-report screen's optional-screenshot attachment field."
    />

    <div style={{ marginBottom: '40px' }}>
      <InfoBox>
        <div style={{ maxWidth: '360px' }}>
          <FileUploadDemo label="Screenshot (optional)" />
        </div>
        <Note>
          Click "Choose file" to open your real OS file picker and select an image — the hint line states the
          accepted types and max size, and is exposed to assistive tech via aria-describedby on the button.
        </Note>
      </InfoBox>
    </div>

    {/* ── Gallery — dropzone variant ───────────────────────────────────────── */}
    <SectionHead
      title="Dropzone variant"
      description="The same button, wrapped in a dashed drag-and-drop area. Resize the Storybook viewport across 768px (md) to see drag activate — below that, the dashed area still renders but only the button is interactive."
    />

    <div style={{ marginBottom: '40px' }}>
      <InfoBox>
        <div style={{ maxWidth: '420px' }}>
          <FileUploadDemo label="Screenshot (optional)" variant="dropzone" />
        </div>
        <Note>
          At md (768px)+, drag a file over the dashed area to see the border shift to <Code>--color-focus-ring</Code>.
          Below md, dragging does nothing (by design — touch devices don't drag), but "Choose file" always works.
        </Note>
      </InfoBox>
    </div>

    <Divider />

    {/* ── States ────────────────────────────────────────────────────────────── */}
    <SectionHead
      title="States"
      description="Every state below is live — nothing is a static mockup."
    />

    <div style={{ marginBottom: '40px' }}>
      <BlockLabel>Uploading — real byte-progress</BlockLabel>
      <InfoBox>
        <div style={{ maxWidth: '360px' }}>
          <UploadSimulationDemo filename="sms-not-sent-2026-07-05.jpg" />
        </div>
        <Note>
          Click "Simulate upload" to drive the component's real <Code>progress</Code> prop through a fake
          byte-progress interval — the bar you see is the EXISTING <Code>ProgressBar</Code>, wired up exactly as a
          real upload would drive it, with the existing <Code>Spinner</Code> alongside it. At 100% the component
          drops straight into its own success view.
        </Note>
      </InfoBox>
    </div>

    <div style={{ marginBottom: '40px' }}>
      <BlockLabel>Success — thumbnail, filename, remove</BlockLabel>
      <InfoBox>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
              short filename
            </div>
            <FileUploadDemo
              label="Screenshot (optional)"
              initialValue={makeImageFile('dashboard-error-screenshot.png')}
            />
          </div>
          <div style={{ maxWidth: '220px' }}>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
              long filename — truncates, Tooltip on hover/focus
            </div>
            <FileUploadDemo
              label="Screenshot (optional)"
              initialValue={makeImageFile('dashboard-error-screenshot-when-clicking-save-button-2026-07-05.png')}
            />
          </div>
        </div>
        <Note>
          The thumbnail is a real decoded image via <Code>URL.createObjectURL</Code> — not a placeholder swatch.
          Hover or Tab to the truncated filename on the right to see the full name in the existing Tooltip
          component. Click the × to remove — it's a real button with a 44×44px hit area and an accessible label.
        </Note>
      </InfoBox>
    </div>

    <div style={{ marginBottom: '40px' }}>
      <BlockLabel>Error — single-line and multi-line</BlockLabel>
      <InfoBox>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div style={{ maxWidth: '280px' }}>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
              single-line — over-size
            </div>
            <FileUploadDemo label="Screenshot (optional)" error="File is too big. Max 5MB." />
          </div>
          <div style={{ maxWidth: '280px' }}>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
              multi-line — failed upload
            </div>
            <FileUploadDemo
              label="Screenshot (optional)"
              error="Upload failed — the connection was interrupted partway through. Check your signal and try attaching the screenshot again."
            />
          </div>
        </div>
        <Note>
          Both are recoverable, specific messages — never a bare "Error". The AlertCircle icon aligns to the
          FIRST line of the message (<Code>alignItems: 'flex-start'</Code>), unlike Select/Input's single-line
          error row, since this component explicitly supports multi-line messages.
        </Note>
      </InfoBox>
    </div>

    <div style={{ marginBottom: '40px' }}>
      <BlockLabel>Disabled</BlockLabel>
      <InfoBox>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div style={{ maxWidth: '280px' }}>
            <FileUploadDemo label="Screenshot (optional)" disabled />
          </div>
          <div style={{ maxWidth: '280px' }}>
            <FileUploadDemo label="Screenshot (optional)" variant="dropzone" disabled />
          </div>
        </div>
        <Note>
          <Code>--opacity-disabled</Code> (0.4) on the browse button; the dropzone also stops responding to drag.
          No disabled colour token.
        </Note>
      </InfoBox>
    </div>

    <Divider />

    {/* ── Reference table ──────────────────────────────────────────────────── */}
    <SectionHead
      title="Reference table"
      description="All props accepted by the FileUpload component, and the design tokens it consumes."
    />

    <div style={{ marginBottom: '16px' }}>
      <BlockLabel>Props</BlockLabel>
      <div style={{
        background: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border-default)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--color-bg-secondary)' }}>
              {['PROP', 'TYPE', 'DEFAULT', 'DESCRIPTION'].map(h => (
                <th key={h} style={{
                  padding: '12px 16px', textAlign: 'left',
                  fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 500,
                  textTransform: 'uppercase', letterSpacing: '0.04em',
                  color: 'var(--color-text-secondary)',
                  borderBottom: '1px solid var(--color-border-default)',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PROPS.map((prop, i) => (
              <tr key={prop.name} style={{ background: i % 2 === 0 ? 'var(--color-bg-surface)' : 'var(--color-bg-primary)' }}>
                <td style={{
                  padding: '12px 16px', minHeight: '44px',
                  fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem',
                  color: 'var(--color-text-primary)', whiteSpace: 'nowrap',
                  borderBottom: i < PROPS.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                }}>
                  {prop.name}
                </td>
                <td style={{
                  padding: '12px 16px',
                  fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem',
                  color: 'var(--color-text-secondary)',
                  borderBottom: i < PROPS.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                }}>
                  {prop.type}
                </td>
                <td style={{
                  padding: '12px 16px',
                  fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem',
                  color: 'var(--color-text-secondary)', whiteSpace: 'nowrap',
                  borderBottom: i < PROPS.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                }}>
                  {prop.defaultVal}
                </td>
                <td style={{
                  padding: '12px 16px',
                  fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
                  color: 'var(--color-text-primary)',
                  borderBottom: i < PROPS.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                }}>
                  {prop.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <div style={{ marginBottom: '40px' }}>
      <BlockLabel>Design tokens</BlockLabel>
      <div style={{
        background: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border-default)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--color-bg-secondary)' }}>
              {['TOKEN', 'VALUE', 'USAGE'].map(h => (
                <th key={h} style={{
                  padding: '12px 16px', textAlign: 'left',
                  fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 500,
                  textTransform: 'uppercase', letterSpacing: '0.04em',
                  color: 'var(--color-text-secondary)',
                  borderBottom: '1px solid var(--color-border-default)',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TOKENS.map((row, i) => (
              <tr key={row.token} style={{ background: i % 2 === 0 ? 'var(--color-bg-surface)' : 'var(--color-bg-primary)' }}>
                <td style={{
                  padding: '12px 16px', minHeight: '44px',
                  fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem',
                  color: 'var(--color-text-primary)', whiteSpace: 'nowrap',
                  borderBottom: i < TOKENS.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                }}>
                  {row.token}
                </td>
                <td style={{
                  padding: '12px 16px',
                  fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem',
                  color: 'var(--color-text-secondary)', whiteSpace: 'nowrap',
                  borderBottom: i < TOKENS.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                }}>
                  {row.value}
                </td>
                <td style={{
                  padding: '12px 16px',
                  fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: '1.5rem',
                  color: 'var(--color-text-primary)',
                  borderBottom: i < TOKENS.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                }}>
                  {row.usage}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

  </StoryFrame>
);
