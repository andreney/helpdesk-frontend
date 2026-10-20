import { useId, useState } from 'react';
import Button from '@/components/ui/Button';
import ErrorMessage from '@/components/ui/ErrorMessage';
import Modal from '@/components/ui/Modal';
import { getErrorMessage } from '@/services/httpClient';
import { PRIORITY, PRIORITY_META, TITLE_MAX_LENGTH } from '../constants';

const INITIAL_FORM = { category_id: '', title: '', description: '', priority: PRIORITY.MEDIUM };

export default function CreateTicketModal({ onClose, onCreate }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const formId = useId();
  const fieldId = (name) => `${formId}-${name}`;

  const handleChange = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await onCreate({
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        category_id: Number(form.category_id),
      });
    } catch (issue) {
      setError(getErrorMessage(issue));
      setBusy(false);
    }
    // Em caso de sucesso o pai fecha o modal (este componente é desmontado).
  }

  return (
    <Modal
      title="Abrir novo chamado"
      subtitle="Conte o que aconteceu para encaminharmos sua solicitação."
      onClose={onClose}
      footer={
        <>
          <Button variant="quiet" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" form={formId} disabled={busy} icon="arrow-right">
            {busy ? 'Enviando…' : 'Enviar chamado'}
          </Button>
        </>
      }
    >
      <form id={formId} className="stack" onSubmit={handleSubmit}>
        <ErrorMessage>{error}</ErrorMessage>

        <label htmlFor={fieldId('title')}>
          Título
          <input
            id={fieldId('title')}
            maxLength={TITLE_MAX_LENGTH}
            placeholder="Ex.: Não consigo acessar meu e-mail"
            value={form.title}
            onChange={handleChange('title')}
            required
            data-autofocus
          />
        </label>

        <label htmlFor={fieldId('category')}>
          ID da categoria
          <input
            id={fieldId('category')}
            type="number"
            min="1"
            placeholder="Ex.: 1"
            value={form.category_id}
            onChange={handleChange('category_id')}
            aria-describedby={fieldId('category-hint')}
            required
          />
          <small id={fieldId('category-hint')}>Informe o ID de uma categoria cadastrada na API.</small>
        </label>

        <label htmlFor={fieldId('priority')}>
          Prioridade
          <select id={fieldId('priority')} value={form.priority} onChange={handleChange('priority')}>
            {Object.entries(PRIORITY_META).map(([value, { label }]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label htmlFor={fieldId('description')}>
          Descrição
          <textarea
            id={fieldId('description')}
            rows={4}
            placeholder="Descreva os detalhes e o impacto do problema…"
            value={form.description}
            onChange={handleChange('description')}
            required
          />
        </label>
      </form>
    </Modal>
  );
}
