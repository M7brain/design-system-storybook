'use client';

import React, { useState, useRef, useId, useEffect } from 'react';
import { Button } from '@/components/ui/Button/Button.jsx';
import { Tooltip } from '@/components/ui/Tooltip/Tooltip.jsx';
import { Icon } from '@/design-system/icons/Icon.jsx';
import { ProgressBar, Spinner } from '@/design-system/loaders';
import { cn } from '@/lib/utils';

// FileUpload lets a user attach a single image. It is mobile-first: the
// primary entry point is a click/tap-to-browse BUTTON that opens the native
// file picker, which on iOS/Android surfaces camera + photo library directly.
// Drag-and-drop is a DESKTOP-ONLY progressive enhancement layered around that
// button — never a drag-only zone with no clickable fallback.
//
// Why: Quicklo's user is a non-technical local service business owner,
// usually on a phone on a job site. Drag-and-drop is meaningless on touch;
// the native picker is the least-surprising, one-tap path. The button is
// always present and always works; the dropzone only adds desktop convenience.
//
// Zero new colour tokens, zero new primitives — composes the existing Button,
// Tooltip, ProgressBar, and Spinner rather than reimplementing any of them.

function useMinWidth(px) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${px}px)`);
    const handler = () => setMatches(mql.matches);
    handler();
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [px]);
  return matches;
}

const labelStyle = {
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--text-body-md)',
  fontWeight: 500,
  lineHeight: '1.25rem',
  color: 'var(--color-text-primary)',
};

const hintStyle = {
  margin: 0,
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--text-body-sm)',
  fontWeight: 400,
  lineHeight: '1rem',
  color: 'var(--color-text-secondary)',
};

const filenameStyle = {
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--text-body-md)',
  fontWeight: 400,
  lineHeight: '1.25rem',
  color: 'var(--color-text-primary)',
};

const errorStyle = {
  margin: 0,
  display: 'flex',
  // flex-start (not center): the AlertCircle icon must align with the FIRST
  // line when the error message wraps to multiple lines — this component
  // explicitly supports multi-line messages, unlike Select/Input's single-line
  // error row.
  alignItems: 'flex-start',
  gap: 'var(--space-1)',
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--text-body-sm)',
  fontWeight: 400,
  lineHeight: '1rem',
  color: 'var(--color-status-error-text)',
};

/**
 * Validates a File against an `accept` pattern list — mime wildcards
 * (image/&#42;), exact mimes (image/png), extensions (.pdf), the catch-all
 * wildcard, comma-separated. Mirrors the same matching semantics the browser
 * itself uses for the native file picker's filter.
 * @param {File} file
 * @param {string} accept
 * @returns {boolean}
 */
function isFileTypeAccepted(file, accept) {
  const patterns = accept.split(',').map((s) => s.trim()).filter(Boolean);
  if (patterns.length === 0) return true;
  return patterns.some((pattern) => {
    if (pattern === '*/*') return true;
    if (pattern.endsWith('/*')) return file.type.startsWith(pattern.slice(0, -1));
    if (pattern.startsWith('.')) return file.name.toLowerCase().endsWith(pattern.toLowerCase());
    return file.type === pattern;
  });
}

/**
 * @typedef {Object} FileUploadProps
 * @property {string} label - Visible label above the control. Required unless hideLabel.
 * @property {boolean} [hideLabel=false] - Visually hides the label (sr-only); requires aria-label.
 * @property {'button'|'dropzone'} [variant='button'] - 'button' is the mobile/form default;
 *   'dropzone' wraps the same button in a dashed area that only accepts drag-and-drop at
 *   the md breakpoint (768px) and up — the button remains the sole interaction below that.
 * @property {string} [accept='image/*'] - Native <input accept> pattern. Defaults to images only.
 * @property {number} [maxSizeMB=5] - Maximum accepted file size in megabytes.
 * @property {File|null} [value=null] - Controlled: the currently selected file, or null.
 * @property {(file: File|null) => void} [onChange] - Fires with a valid File on selection,
 *   or null on removal. Never fires for a file that fails internal type/size validation.
 * @property {number} [progress] - 0–100. When a number, renders the uploading state
 *   (real byte-progress via the existing ProgressBar) instead of the button/hint.
 * @property {string} [error] - External error (e.g. a failed upload). Overrides any
 *   internal type/size validation message, exactly like Input/Select's error-replaces-
 *   helperText convention.
 * @property {boolean} [disabled=false]
 * @property {boolean} [required=false] - Appends a red * after the label.
 * @property {string} [id] - Auto-generated via useId() when omitted.
 * @property {string} [name] - Form field name for native form submission.
 * @property {string} [className]
 */

/**
 * FileUpload — single-image attachment control. See file header for the
 * mobile-first / drag-as-enhancement rationale.
 * @param {FileUploadProps} props
 */
export function FileUpload({
  label,
  hideLabel = false,
  variant = 'button',
  accept = 'image/*',
  maxSizeMB = 5,
  value = null,
  onChange,
  progress,
  error,
  disabled = false,
  required = false,
  id: idProp,
  name,
  className,
  ...rest
}) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const hintId = `${id}-hint`;
  const messageId = `${id}-msg`;

  const inputRef = useRef(null);
  const browseButtonRef = useRef(null);

  const [internalError, setInternalError] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [announce, setAnnounce] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);

  // Dropzone drag behaviour is desktop-only (md, 768px+) — below that, the
  // dashed area still renders (visual consistency) but never responds to
  // drag events; the button is the sole interaction, matching the mobile-first
  // rationale (drag-and-drop is meaningless on touch).
  const isMdUp = useMinWidth(768);
  const dropzoneActive = variant === 'dropzone' && isMdUp && !disabled;
  const isUploading = typeof progress === 'number';
  const displayError = error || internalError;

  if (process.env.NODE_ENV !== 'production' && hideLabel && !rest['aria-label']) {
    console.warn(
      `[FileUpload] id="${id}": hideLabel=true requires an explicit aria-label prop for accessibility.`
    );
  }

  // Object URL preview for image files — created/revoked per value to avoid
  // leaking memory. This is a genuine external-system side effect (a browser
  // resource with a matching teardown call), not a derived-state calculation,
  // so useEffect is the correct tool here despite the lint rule's default
  // suspicion of setState-in-effect — creating the URL during render would
  // leak blob URLs on every discarded/duplicate render pass (Strict Mode,
  // concurrent features).
  useEffect(() => {
    if (value && value.type && value.type.startsWith('image/')) {
      const url = URL.createObjectURL(value);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl(null);
    return undefined;
  }, [value]);

  const hint = accept === 'image/*'
    ? `PNG or JPG, up to ${maxSizeMB}MB`
    : `Accepted files, up to ${maxSizeMB}MB`;

  const validate = (file) => {
    if (!isFileTypeAccepted(file, accept)) {
      return accept === 'image/*'
        ? "That file type isn't supported. Use PNG or JPG."
        : "That file type isn't supported.";
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      return `File is too big. Max ${maxSizeMB}MB.`;
    }
    return null;
  };

  const processFile = (file) => {
    const message = validate(file);
    if (message) {
      setInternalError(message);
      setAnnounce(message);
      return;
    }
    setInternalError(null);
    setAnnounce(`${file.name} selected`);
    onChange?.(file);
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = ''; // allow re-selecting the same file after removal
  };

  // Captures the real DOM <button> node via the click event's currentTarget —
  // Button is not React.forwardRef, so a ref prop can't reach its DOM node
  // directly. currentTarget works identically for mouse and keyboard (Enter/
  // Space) activation, since both dispatch a real 'click' event.
  const handleBrowseClick = (e) => {
    browseButtonRef.current = e.currentTarget;
    inputRef.current?.click();
  };

  const handleRemove = () => {
    setInternalError(null);
    setAnnounce('File removed');
    onChange?.(null);
  };

  const handleDragOver = (e) => {
    if (!dropzoneActive) return;
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = () => {
    if (!dropzoneActive) return;
    setIsDragOver(false);
  };
  const handleDrop = (e) => {
    if (!dropzoneActive) return;
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const showHint = !value && !isUploading && !displayError;
  const describedBy = [hintId, displayError ? messageId : null].filter(Boolean).join(' ') || undefined;

  const browseButton = (
    <Button
      id={id}
      type="button"
      size="lg"
      variant="secondary"
      leftIcon="Upload"
      disabled={disabled}
      onClick={handleBrowseClick}
      aria-describedby={describedBy}
      {...rest}
    >
      {value ? 'Choose a different file' : 'Choose file'}
    </Button>
  );

  return (
    <div className={cn('flex flex-col w-full', className)} style={{ gap: 'var(--space-2)' }}>
      {label && (
        <label htmlFor={id} className={cn(hideLabel && 'sr-only')} style={labelStyle}>
          {label}
          {required && (
            <span aria-hidden="true" style={{ color: 'var(--color-status-error)', marginLeft: 'var(--space-px)' }}>
              *
            </span>
          )}
        </label>
      )}

      {/* Hidden native <input> — the real form-participating element. Never
          reached directly by keyboard or AT: the visible Button above is the
          accessible control, opened via inputRef.current.click(). tabIndex=-1
          + aria-hidden keep it out of both the tab order and the a11y tree. */}
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept={accept}
        disabled={disabled}
        tabIndex={-1}
        aria-hidden="true"
        onChange={handleInputChange}
        // Some browsers move focus to the (hidden) input once the native file
        // dialog closes. Redirect it straight back to the visible Button the
        // user actually activated, so focus never lands on an invisible node.
        onFocus={() => browseButtonRef.current?.focus()}
        style={{
          position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px',
          overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0,
        }}
      />

      {variant === 'dropzone' ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            border: `1px dashed ${isDragOver ? 'var(--color-focus-ring)' : 'var(--color-border-default)'}`,
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-6) var(--space-4)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-3)',
            transition: 'border-color var(--duration-base) var(--ease-default)',
          }}
        >
          {browseButton}
          {showHint && <span id={hintId} style={hintStyle}>{hint}</span>}
        </div>
      ) : (
        <div className="flex flex-col items-start" style={{ gap: 'var(--space-2)' }}>
          {browseButton}
          {showHint && <span id={hintId} style={hintStyle}>{hint}</span>}
        </div>
      )}

      {/* uploading — real byte-progress via the existing ProgressBar; Spinner
          is the compact inline indicator alongside it, per spec. Neither is
          reimplemented. */}
      {isUploading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Spinner size="sm" />
          <div style={{ flex: 1 }}>
            <ProgressBar value={progress} label={`Uploading ${value?.name ?? 'file'}`} />
          </div>
        </div>
      )}

      {/* success — selected-file row: thumbnail + filename + remove */}
      {value && !isUploading && (
        <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
          <li className="flex items-center" style={{ gap: 'var(--space-2)' }}>
            {previewUrl ? (
              // next/image is for remote/static assets it can optimize at build
              // or request time; this is a local blob: URL preview of a file the
              // user just picked — there's nothing for next/image to optimize.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt=""
                style={{
                  width: '40px', height: '40px', objectFit: 'cover', flexShrink: 0,
                  borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border-default)',
                }}
              />
            ) : (
              <span
                aria-hidden="true"
                className="flex items-center justify-center"
                style={{
                  width: '40px', height: '40px', flexShrink: 0,
                  borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border-default)',
                  background: 'var(--color-bg-secondary)', color: 'var(--color-text-secondary)',
                }}
              >
                <Icon name="FileText" size="md" />
              </span>
            )}

            <Tooltip content={value.name} type="description">
              <span
                tabIndex={0}
                style={{
                  ...filenameStyle,
                  flex: 1, minWidth: 0,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}
              >
                {value.name}
              </span>
            </Tooltip>

            <button
              type="button"
              onClick={handleRemove}
              disabled={disabled}
              aria-label={`Remove ${value.name}`}
              className={cn(
                'relative inline-flex items-center justify-center rounded-full shrink-0',
                'bg-transparent border-0 cursor-pointer',
                // Always-on 44×44px hit area (same technique as Checkbox/Toggle) —
                // this control is always small, never approaches 44px on its own.
                "before:content-[''] before:absolute before:top-1/2 before:left-1/2",
                'before:-translate-x-1/2 before:-translate-y-1/2',
                'before:min-w-11 before:min-h-11',
              )}
              style={{ color: 'var(--color-text-secondary)' }}
            >
              <Icon name="X" size="sm" />
            </button>
          </li>
        </ul>
      )}

      {/* error — invalid type, over-size, or a failed upload (external `error`) */}
      {displayError && (
        <p id={messageId} role="alert" style={errorStyle}>
          <span aria-hidden="true" style={{ display: 'flex', alignItems: 'center', flexShrink: 0, color: 'var(--color-status-error-text)' }}>
            <Icon name="AlertCircle" size="sm" />
          </span>
          {displayError}
        </p>
      )}

      <div aria-live="polite" className="sr-only">{announce}</div>
    </div>
  );
}
