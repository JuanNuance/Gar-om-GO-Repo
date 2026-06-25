import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../../common/infrastructure/database/database.service';
import { IItemRepository } from '../../domain/item.repository.interface';
import { Item, CategoriaItem } from '../../domain/item.entity';

@Injectable()
export class PgItemRepository implements IItemRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  private mapToDomain(row: any): Item {
    return new Item(
      row.id,
      row.nome,
      row.descricao,
      row.preco,
      row.categoria as CategoriaItem,
      row.restauranteid || row.restauranteId,
    );
  }

  async criar(item: Item): Promise<Item> {
    const result = await this.databaseService.query(
      `INSERT INTO item (id, nome, descricao, preco, categoria, restaurante_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [item.id, item.nome, item.descricao, item.preco, item.categoria, item.restauranteId],
    );

    return this.mapToDomain(result.rows[0]);
  }

  async listarPorRestaurante(restauranteId: string): Promise<Item[]> {
    const result = await this.databaseService.query(
      `SELECT * FROM item WHERE restaurante_id = $1 ORDER BY nome ASC`,
      [restauranteId],
    );
    return result.rows.map((row) => this.mapToDomain(row));
  }

  async findById(id: string): Promise<Item | null> {
    const result = await this.databaseService.query(
      `SELECT * FROM item WHERE id = $1`,
      [id],
    );
    return result.rows[0] ? this.mapToDomain(result.rows[0]) : null;
  }
  async atualizar(id: string, dados: Partial<Item>): Promise<Item> {
    const result = await this.databaseService.query(
      `UPDATE item SET nome = COALESCE($1, nome), descricao = COALESCE($2, descricao), preco = COALESCE($3, preco), categoria = COALESCE($4, categoria), restaurante_id = COALESCE($5, restaurante_id) WHERE id = $6 RETURNING *`,
      [dados.nome, dados.descricao, dados.preco, dados.categoria, dados.restauranteId, id],
    );
    return this.mapToDomain(result.rows[0]);
  }

  async deletar(id: string): Promise<void> {
    await this.databaseService.query(
      `DELETE FROM item WHERE id = $1`,
      [id],
    );
  }
}

