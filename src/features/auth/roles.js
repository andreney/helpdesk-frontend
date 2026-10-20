export const ROLES = Object.freeze({ USER: 'USER', AGENT: 'AGENT', ADMIN: 'ADMIN' });

// A API pode devolver o perfil como texto ("admin") ou como código numérico.
const NUMERIC_ROLES = { 1: ROLES.USER, 2: ROLES.AGENT, 3: ROLES.ADMIN };

const ROLE_LABELS = {
  [ROLES.USER]: 'Solicitante',
  [ROLES.AGENT]: 'Agente de suporte',
  [ROLES.ADMIN]: 'Administrador',
};

/** Normaliza o perfil vindo da API. Qualquer valor desconhecido vira `USER` (menor privilégio). */
export function normalizeRole(role) {
  const normalized = typeof role === 'string' ? role.toUpperCase() : NUMERIC_ROLES[role];
  return ROLES[normalized] ?? ROLES.USER;
}

export function getRoleLabel(role) {
  return ROLE_LABELS[normalizeRole(role)];
}

/** Agentes e administradores podem alterar o status dos chamados. */
export function canManageTickets(role) {
  const normalized = normalizeRole(role);
  return normalized === ROLES.ADMIN || normalized === ROLES.AGENT;
}
