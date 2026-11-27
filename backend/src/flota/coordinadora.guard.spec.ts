import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CoordinadoraGuard } from './coordinadora.guard';

const contexto = (clave?: string) =>
  ({
    switchToHttp: () => ({ getRequest: () => ({ headers: { 'x-clave-coordinadora': clave } }) }),
  }) as unknown as ExecutionContext;

const guardia = (configurada?: string) => new CoordinadoraGuard({ get: () => configurada } as unknown as ConfigService);

describe('CoordinadoraGuard (solo la coordinadora cambia la flota)', () => {
  it('deja pasar con la clave correcta', () => {
    expect(guardia('clave-de-prueba').canActivate(contexto('clave-de-prueba'))).toBe(true);
  });

  it.each([
    ['clave-de-prueba', 'otra'],
    ['clave-de-prueba', undefined],
    [undefined, 'cualquiera'],
    ['', ''],
  ])('rechaza: configurada %j, enviada %j', (configurada, enviada) => {
    expect(() => guardia(configurada).canActivate(contexto(enviada))).toThrow(UnauthorizedException);
  });
});
