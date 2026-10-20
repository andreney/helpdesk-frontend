import { describe, expect, it } from 'vitest';
import { getTokenExpiration } from '@/features/auth/token';

const makeJwt = (payload) => `header.${Buffer.from(JSON.stringify(payload)).toString('base64url')}.signature`;

describe('getTokenExpiration', () => {
  it('lê o exp de um JWT em milissegundos', () => {
    expect(getTokenExpiration(makeJwt({ exp: 1_800_000_000 }))).toBe(1_800_000_000_000);
  });

  it('retorna null para JWT sem exp', () => {
    expect(getTokenExpiration(makeJwt({ sub: '1' }))).toBeNull();
  });

  it('retorna null para tokens opacos ou inválidos', () => {
    expect(getTokenExpiration('1|abcdefghijklmnop')).toBeNull();
    expect(getTokenExpiration('')).toBeNull();
    expect(getTokenExpiration(undefined)).toBeNull();
  });
});
