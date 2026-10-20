/** Selo colorido com rótulo. O significado nunca depende só da cor: o texto sempre aparece. */
export default function Badge({ label, tone = 'muted' }) {
  return (
    <span className={`badge badge-${tone}`}>
      <i aria-hidden="true" />
      {label}
    </span>
  );
}
