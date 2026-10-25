import Button from '@/components/ui/Button';

/** Navegação entre páginas. Não aparece quando há uma página só. */
export default function Pagination({ page, lastPage, onPageChange }) {
  if (lastPage <= 1) return null;

  return (
    <nav className="pagination" aria-label="Paginação">
      <Button variant="outline" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        Anterior
      </Button>
      <span aria-live="polite">
        Página {page} de {lastPage}
      </span>
      <Button variant="outline" disabled={page >= lastPage} onClick={() => onPageChange(page + 1)}>
        Próxima
      </Button>
    </nav>
  );
}
