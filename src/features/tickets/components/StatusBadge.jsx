import Badge from '@/components/ui/Badge';
import { PRIORITY_META, STATUS_META } from '../constants';

const FALLBACK = { label: '—', tone: 'muted' };

export function StatusBadge({ status }) {
  const { label, tone } = STATUS_META[status] ?? FALLBACK;
  return <Badge label={label} tone={tone} />;
}

export function PriorityBadge({ priority }) {
  const { label, tone } = PRIORITY_META[priority] ?? FALLBACK;
  return <Badge label={label} tone={tone} />;
}
