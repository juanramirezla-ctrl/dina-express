import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool, QueryResult, QueryResultRow } from 'pg';

/** Acceso a PostgreSQL. Todas las consultas usan parámetros ($1, $2...). */
@Injectable()
export class BaseDatosService implements OnModuleDestroy {
  private readonly pool: Pool;

  constructor(configuracion: ConfigService) {
    this.pool = new Pool({ connectionString: configuracion.getOrThrow<string>('DATABASE_URL') });
  }

  /**
   * Ejecuta una consulta con parámetros. Nunca se arma el texto con datos del usuario.
   *
   * @param texto Consulta SQL con marcadores ($1, $2...).
   * @param parametros Valores de los marcadores.
   * @returns El resultado de PostgreSQL.
   */
  consultar<T extends QueryResultRow>(texto: string, parametros: unknown[] = []): Promise<QueryResult<T>> {
    return this.pool.query<T>(texto, parametros);
  }

  async onModuleDestroy(): Promise<void> {
    await this.pool.end();
  }
}