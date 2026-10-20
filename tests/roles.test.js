import { describe, expect, it } from 'vitest';
import { canManageTickets, getRoleLabel, normalizeRole, ROLES } from '@/features/auth/roles';

describe('normalizeRole', () => {
  it('aceita texto em qualquer caixa', () => {
    expect(normalizeRole('admin')).toBe(ROLES.ADMIN);
    expect(normalizeRole('Agent')).toBe(ROLES.AGENT);
  });

  it('aceita códigos numéricos', () => {
    expect(normalizeRole(1)).toBe(ROLES.USER);
    expect(normalizeRole(2)).toBe(ROLES.AGENT);
    expect(normalizeRole(3)).toBe(ROLES.ADMIN);
  });

  it('valores desconhecidos viram USER (menor privilégio)', () => {
    expect(normalizeRole('root')).toBe(ROLES.USER);
    expect(normalizeRole(undefined)).toBe(ROLES.USER);
    expect(normalizeRole(99)).toBe(ROLES.USER);
  });
});

describe('permissões', () => {
  it('apenas agentes e administradores gerenciam chamados', () => {
    expect(canManageTickets('ADMIN')).toBe(true);
    expect(canManageTickets(2)).toBe(true);
    expect(canManageTickets('USER')).toBe(false);
    expect(canManageTickets(null)).toBe(false);
  });

  it('traduz o perfil para exibição', () => {
    expect(getRoleLabel('AGENT')).toBe('Agente de suporte');
  });
});
