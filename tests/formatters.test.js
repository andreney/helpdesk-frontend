import { describe, expect, it } from 'vitest';
import { formatDate, formatTime, getFirstName, getGreeting, getInitials } from '@/utils/formatters';

describe('getInitials', () => {
  it('usa as iniciais das duas primeiras palavras', () => {
    expect(getInitials('Maria da Silva')).toBe('MD');
    expect(getInitials('  joão   pedro ')).toBe('JP');
  });

  it('usa "U" quando não há nome', () => {
    expect(getInitials('')).toBe('U');
    expect(getInitials(null)).toBe('U');
    expect(getInitials(undefined)).toBe('U');
  });
});

describe('getFirstName', () => {
  it('retorna o primeiro nome ou vazio', () => {
    expect(getFirstName('Maria da Silva')).toBe('Maria');
    expect(getFirstName(undefined)).toBe('');
  });
});

describe('getGreeting', () => {
  it('muda conforme o horário', () => {
    expect(getGreeting(new Date(2026, 0, 1, 8))).toBe('Bom dia');
    expect(getGreeting(new Date(2026, 0, 1, 14))).toBe('Boa tarde');
    expect(getGreeting(new Date(2026, 0, 1, 21))).toBe('Boa noite');
  });
});

describe('formatDate / formatTime', () => {
  it('devolve traço para valores vazios ou inválidos', () => {
    expect(formatDate(null)).toBe('—');
    expect(formatDate('não é data')).toBe('—');
    expect(formatTime(undefined)).toBe('—');
  });

  it('formata datas válidas em pt-BR', () => {
    expect(formatDate(new Date(2026, 9, 16))).toMatch(/16/);
    expect(formatTime(new Date(2026, 9, 16, 9, 5))).toBe('09:05');
  });
});
