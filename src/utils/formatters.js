const LOCALE = 'pt-BR';
const EMPTY = '—';

// Intl.DateTimeFormat é caro de instanciar: criamos uma vez por formato.
const dateFormat = new Intl.DateTimeFormat(LOCALE, { day: '2-digit', month: 'short', year: 'numeric' });
const dateTimeFormat = new Intl.DateTimeFormat(LOCALE, {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
});
const timeFormat = new Intl.DateTimeFormat(LOCALE, { hour: '2-digit', minute: '2-digit' });
const longDateFormat = new Intl.DateTimeFormat(LOCALE, { dateStyle: 'long' });

function toDate(value) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatWith(formatter) {
  return (value) => {
    const date = toDate(value);
    return date ? formatter.format(date) : EMPTY;
  };
}

export const formatDate = formatWith(dateFormat);
export const formatDateTime = formatWith(dateTimeFormat);
export const formatTime = formatWith(timeFormat);
export const formatLongDate = formatWith(longDateFormat);

/** Iniciais (até 2 letras) para avatares. */
export function getInitials(name) {
  const parts = String(name ?? '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return 'U';
  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export function getFirstName(name) {
  return String(name ?? '').trim().split(/\s+/)[0] || '';
}

export function getGreeting(date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}
