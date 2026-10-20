import { getInitials } from '@/utils/formatters';

export default function Avatar({ name, small = false }) {
  return (
    <span className={small ? 'avatar avatar-small' : 'avatar'} aria-hidden="true">
      {getInitials(name)}
    </span>
  );
}
