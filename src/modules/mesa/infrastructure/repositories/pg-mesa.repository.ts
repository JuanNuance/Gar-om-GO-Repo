import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../../common/infrastructure/database/database.service';
import { IMesaRepository } from '../../domain/mesa.repository.interface';
import { Mesa, StatusMesa } from '../../domain/mesa.entity';

@Injectable()
export class PgMesaRepository implements IMesaRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  private mapToDomain(row: any): Mesa {
    return new Mesa(
      row.id,
      row.numero,
      row.capacidade,
      row.status as StatusMesa,
      row.restauranteid || row.restauranteId,
    );
  }

  async criar(mesa: Mesa): Promise<Mesa> {
    const result = await this.databaseService.query<Mesa>(
      `INSERT INTO mesa (id, numero, capacidade, status, restaurante_id) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [mesa.id, mesa.numero, mesa.capacidade, mesa.status, mesa.restauranteId],
    );

    return this.mapToDomain(result.rows[0]);
  }

  async listarTodas(): Promise<Mesa[]> {
    const result = await this.databaseService.query<Mesa>(
      `SELECT * FROM mesa ORDER BY numero ASC`,
    );
    return result.rows.map((row) => this.mapToDomain(row));
  }

  async buscarPorId(id: string): Promise<Mesa | null> {
    const result = await this.databaseService.query<Mesa>(
      `SELECT * FROM mesa WHERE id = $1`,
      [id],
    );
    return result.rows[0] ? this.mapToDomain(result.rows[0]) : null;
  }

  async alterarStatus(id: string, status: string): Promise<Mesa> {
    const result = await this.databaseService.query<Mesa>(
      `UPDATE mesa SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id],
    );
    return this.mapToDomain(result.rows[0]);
  }
  async atualizar(id: string, dados: Partial<Mesa>): Promise<Mesa> {
    const result = await this.databaseService.query(
      `UPDATE mesa SET numero = COALESCE($1, numero), capacidade = COALESCE($2, capacidade), status = COALESCE($3, status), restaurante_id = COALESCE($4, restaurante_id) WHERE id = $5 RETURNING *`,
      [dados.numero, dados.capacidade, dados.status, dados.restauranteId, id],
    );
    return this.mapToDomain(result.rows[0]);
  }

  async deletar(id: string): Promise<void> {
    await this.databaseService.query(
      `DELETE FROM mesa WHERE id = $1`,
      [id],
    );
  }
}

