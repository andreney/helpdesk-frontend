import Icon from '@/components/ui/Icon';
import { ALL_STATUSES, SEARCH_MAX_LENGTH, STATUS_META } from '../constants';

export default function TicketFilters({ query, onQueryChange, status, onStatusChange }) {
  return (
    <div className="filters" role="search">
      <label className="search">
        <span aria-hidden="true">
          <Icon name="search" />
        </span>
        <input
          type="search"
          aria-label="Buscar chamados"
          placeholder="Buscar por chamado…"
          maxLength={SEARCH_MAX_LENGTH}
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </label>
      <label className="select-wrap">
        <span aria-hidden="true">
          <Icon name="filter" />
        </span>
        <select aria-label="Filtrar por status" value={status} onChange={(event) => onStatusChange(event.target.value)}>
          <option value={ALL_STATUSES}>Todos os status</option>
          {Object.entries(STATUS_META).map(([value, { filterLabel }]) => (
            <option key={value} value={value}>
              {filterLabel}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
