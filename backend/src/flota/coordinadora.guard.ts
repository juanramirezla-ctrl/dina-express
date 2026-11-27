import { createHash, timingSafeEqual } from 'node:crypto';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const resumen = (texto: string): Buffer => createHash('sha256').update(texto).digest();

/**
 * Deja pasar solo a quien envíe la clave de la coordinadora en `x-clave-coordinadora`.
 * Es una protección mínima (una sola clave compartida), no un inicio de sesión con roles.
 * Si no hay clave configurada, no deja pasar a nadie.
 */
@Injectable()
export class CoordinadoraGuard implements CanActivate {
  constructor(private readonly configuracion: ConfigService) {}

  canActivate(contexto: ExecutionContext): boolean {
    const esperada = this.configuracion.get<string>('CLAVE_COORDINADORA');
    const peticion = contexto.switchToHttp().getRequest<{ headers: Record<string, unknown> }>();
    const enviada = peticion.headers['x-clave-coordinadora'];
    if (!esperada || typeof enviada !== 'string' || !timingSafeEqual(resumen(enviada), resumen(esperada))) {
      throw new UnauthorizedException('La clave de la coordinadora no es correcta');
    }
    return true;
  }
}
