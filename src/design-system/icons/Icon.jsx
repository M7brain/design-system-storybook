import * as icons from './index.js';

const SIZE_MAP = {
  sm: 16,
  md: 20,
  lg: 24,
};

export function Icon({ name, size = 'md', label, className }) {
  const IconComponent = icons[name];

  if (!IconComponent) {
    console.warn(`[Icon] "${name}" not found in src/design-system/icons/index.js — add it there first.`);
    return null;
  }

  const px = SIZE_MAP[size];

  return (
    <IconComponent
      width={px}
      height={px}
      strokeWidth={1.5}
      aria-hidden={label ? undefined : true}
      aria-label={label || undefined}
      className={className}
    />
  );
}
