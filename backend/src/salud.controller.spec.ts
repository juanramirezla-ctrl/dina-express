import { SaludController } from './salud.controller';

describe('SaludController', () => {
  it('responde que la API esta viva', () => {
    expect(new SaludController().estado()).toEqual({ estado: 'ok' });
  });
});