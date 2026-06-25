import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../../common/infrastructure/database/database.service';
import { IGarcomRepository } from '../../domain/garcom.repository.interface';
import { Garcom } from '../../domain/garcom.entity';

@Injectable()
export class PgGarcomRepository implements IGarcomRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  private mapToDomain(row: any): Garcom {
    return new Garcom(
      row.id,
      row.nome,
      row.email,
      row.restauranteid || row.restauranteId,
      row.role,
    );
  }

  async criar(garcom: Garcom): Promise<Garcom> {
    const result = await this.databaseService.query(
      `INSERT INTO garcom (id, nome, email, restaurante_id, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [garcom.id, garcom.nome, garcom.email, garcom.restauranteId, garcom.role],
    );

    return this.mapToDomain(result.rows[0]);
  }

  async listarPorRestaurante(restauranteId: string): Promise<Garcom[]> {
    const result = await this.databaseService.query(
      `SELECT * FROM garcom WHERE restaurante_id = $1 ORDER BY nome ASC`,
      [restauranteId],
    );
    return result.rows.map((row) => this.mapToDomain(row));
  }
  async atualizar(id: string, dados: Partial<Garcom>): Promise<Garcom> {
    const result = await this.databaseService.query(
      `UPDATE garcom SET nome = COALESCE($1, nome), email = COALESCE($2, email), restaurante_id = COALESCE($3, restaurante_id), role = COALESCE($4, role) WHERE id = $5 RETURNING *`,
      [dados.nome, dados.email, dados.restauranteId, dados.role, id],
    );
    return this.mapToDomain(result.rows[0]);
  }

  async deletar(id: string): Promise<void> {
    await this.databaseService.query(
      `DELETE FROM garcom WHERE id = $1`,
      [id],
    );
  }
}

