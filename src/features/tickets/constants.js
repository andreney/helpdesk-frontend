/** Escopos de visualização da lista de chamados. */
export const TICKET_SCOPES = Object.freeze({ ALL: 'all', MINE: 'mine' });

/** Valor do filtro de status que significa "sem filtro". */
export const ALL_STATUSES = 'ALL';

export const STATUS = Object.freeze({
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  WAITING: 'WAITING',
  CLOSED: 'CLOSED',
});

export const STATUS_META = {
  [STATUS.OPEN]: { label: 'Aberto', filterLabel: 'Abertos', tone: 'blue' },
  [STATUS.IN_PROGRESS]: { label: 'Em atendimento', filterLabel: 'Em atendimento', tone: 'amber' },
  [STATUS.WAITING]: { label: 'Aguardando', filterLabel: 'Aguardando', tone: 'purple' },
  [STATUS.CLOSED]: { label: 'Concluído', filterLabel: 'Concluídos', tone: 'green' },
};

/** Fluxo permitido de status: de onde é possível ir. */
export const STATUS_TRANSITIONS = {
  [STATUS.OPEN]: [STATUS.IN_PROGRESS],
  [STATUS.IN_PROGRESS]: [STATUS.WAITING, STATUS.CLOSED],
  [STATUS.WAITING]: [STATUS.IN_PROGRESS],
  [STATUS.CLOSED]: [],
};

/** Texto do botão que leva o chamado ao status indicado. */
export const STATUS_ACTION_LABELS = {
  [STATUS.IN_PROGRESS]: 'Iniciar atendimento',
  [STATUS.WAITING]: 'Aguardar retorno',
  [STATUS.CLOSED]: 'Concluir chamado',
};

export const PRIORITY = Object.freeze({ LOW: 'LOW', MEDIUM: 'MEDIUM', HIGH: 'HIGH', URGENT: 'URGENT' });

export const PRIORITY_META = {
  [PRIORITY.LOW]: { label: 'Baixa', tone: 'muted' },
  [PRIORITY.MEDIUM]: { label: 'Média', tone: 'blue' },
  [PRIORITY.HIGH]: { label: 'Alta', tone: 'orange' },
  [PRIORITY.URGENT]: { label: 'Urgente', tone: 'red' },
};

export const TITLE_MAX_LENGTH = 150;
