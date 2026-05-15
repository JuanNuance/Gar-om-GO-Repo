import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';
import { DatabaseService } from '../../../../common/infrastructure/database/database.service';
import { IPedidoRepository } from '../../domain/pedido.repository.interface';
import { Pedido, StatusPedido } from '../../domain/pedido.entity';

@Injectable()
export class PgPedidoRepository implements IPedidoRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  private mapToDomain(row: any): Pedido {
    return new Pedido(
      row.id,
      row.status as StatusPedido,
      row.valortotal || row.valorTotal || 0,
      row.mesaid || row.mesaId,
      row.garcomid || row.garcomId,
      row.createdat || row.createdAt,
    );
  }

  async criar(pedido: Pedido): Promise<Pedido> {
    const result = await this.databaseService.query(
      `INSERT INTO pedido (id, mesa_id, garcom_id, status, valor_total, created_at)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [pedido.id, pedido.mesaId, pedido.garcomId, pedido.status, pedido.valorTotal, pedido.createdAt],
    );

    return this.mapToDomain(result.rows[0]);
  }

  async adicionarItem(pedidoId: string, itemId: string, quantidade: number, precoUnitario: number): Promise<void> {
    await this.databaseService.transaction(async (client: PoolClient) => {
      await client.query(
        `INSERT INTO pedido_item (id, pedido_id, item_id, quantidade, preco_unitario)
         VALUES (gen_random_uuid(), $1, $2, $3, $4)`,
        [pedidoId, itemId, quantidade, precoUnitario],
      );

      const valorAdicional = quantidade * precoUnitario;
      await client.query(
        `UPDATE pedido SET valor_total = valor_total + $1 WHERE id = $2`,
        [valorAdicional, pedidoId],
      );
    });
  }

  async alterarStatus(id: string, status: StatusPedido): Promise<Pedido> {
    const result = await this.databaseService.query(
      `UPDATE pedido SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id],
    );
    return this.mapToDomain(result.rows[0]);
  }

  async listarPorRestaurante(restauranteId: string): Promise<Pedido[]> {
    const result = await this.databaseService.query(
      `SELECT p.* FROM pedido p
       JOIN mesa m ON p.mesa_id = m.id
       WHERE m.restaurante_id = $1
       ORDER BY p.created_at DESC`,
      [restauranteId],
    );
    return result.rows.map((row) => this.mapToDomain(row));
  }
}
