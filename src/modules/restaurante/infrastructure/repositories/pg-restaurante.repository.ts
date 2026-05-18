import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../../common/infrastructure/database/database.service';
import { IRestauranteRepository } from '../../domain/restaurante.repository.interface';
import { Restaurante } from '../../domain/restaurante.entity';

@Injectable()
export class PgRestauranteRepository implements IRestauranteRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  private mapToDomain(row: any): Restaurante {
    return new Restaurante(row.id, row.nome, row.cnpj, row.endereco);
  }

  async criar(restaurante: Restaurante): Promise<Restaurante> {
    const result = await this.databaseService.query(
      `INSERT INTO restaurante (id, nome, cnpj, endereco)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [restaurante.id, restaurante.nome, restaurante.cnpj, restaurante.endereco],
    );
    return this.mapToDomain(result.rows[0]);
  }

  async listarTodos(): Promise<Restaurante[]> {
    const result = await this.databaseService.query(
      `SELECT * FROM restaurante ORDER BY nome ASC`,
    );
    return result.rows.map((row) => this.mapToDomain(row));
  }
}
