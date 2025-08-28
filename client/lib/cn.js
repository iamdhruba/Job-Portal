// Lightweight className utility with conditional support
// Usage: cn('base', condition && 'active', { 'p-4': size === 'lg' })
export function cn(...inputs) {
  const classes = [];

  inputs.forEach((input) => {
    if (!input) return;
    if (typeof input === 'string') {
      classes.push(input);
    } else if (Array.isArray(input)) {
      classes.push(cn(...input));
    } else if (typeof input === 'object') {
      Object.entries(input).forEach(([key, value]) => {
        if (value) classes.push(key);
      });
    }
  });

  return classes
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}
