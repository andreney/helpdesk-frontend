import Icon from '@/components/ui/Icon';

function StatCard({ label, value, icon, tone, note }) {
  return (
    <article className="stat-card">
      <div>
        <p>{label}</p>
        <strong>{value ?? '—'}</strong>
      </div>
      <span className={`stat-icon stat-${tone}`}>
        <Icon name={icon} />
      </span>
      <small>{note}</small>
    </article>
  );
}

export default function TicketStats({ stats }) {
  return (
    <section className="stats" aria-label="Resumo dos chamados">
      <StatCard label="Total de chamados" value={stats.total} icon="list" tone="indigo" note="na sua fila" />
      <StatCard label="Abertos" value={stats.open} icon="plus" tone="blue" note="aguardando triagem" />
      <StatCard label="Em atendimento" value={stats.inProgress} icon="clock" tone="amber" note="sendo resolvidos" />
      <StatCard label="Concluídos" value={stats.closed} icon="check" tone="green" note="finalizados" />
    </section>
  );
}
