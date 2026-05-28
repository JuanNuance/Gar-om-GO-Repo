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

  async atualizarItem(pedidoId: string, itemId: string, quantidade: number, observacoes?: string): Promise<void> {
    await this.databaseService.transaction(async (client: PoolClient) => {
      // Buscar item atual
      const res = await client.query(
        `SELECT quantidade, preco_unitario FROM pedido_item WHERE pedido_id = $1 AND item_id = $2 FOR UPDATE`,
        [pedidoId, itemId],
      );

      if (res.rowCount === 0) {
        throw new Error('Item não encontrado no pedido');
      }

      const atual = res.rows[0];
      const quantidadeAtual = Number(atual.quantidade || 0);
      const precoUnitario = Number(atual.preco_unitario || 0);

      const delta = (quantidade - quantidadeAtual) * precoUnitario;

      await client.query(
        `UPDATE pedido_item SET quantidade = $1${observacoes ? ', observacoes = $4' : ''} WHERE pedido_id = $2 AND item_id = $3`,
        observacoes ? [quantidade, pedidoId, itemId, observacoes] : [quantidade, pedidoId, itemId],
      );

      if (delta !== 0) {
        await client.query(`UPDATE pedido SET valor_total = valor_total + $1 WHERE id = $2`, [delta, pedidoId]);
      }
    });
  }

  async removerItem(pedidoId: string, itemId: string): Promise<void> {
    await this.databaseService.transaction(async (client: PoolClient) => {
      const res = await client.query(
        `SELECT quantidade, preco_unitario FROM pedido_item WHERE pedido_id = $1 AND item_id = $2 FOR UPDATE`,
        [pedidoId, itemId],
      );

      if (res.rowCount === 0) {
        throw new Error('Item não encontrado no pedido');
      }

      const row = res.rows[0];
      const quantidade = Number(row.quantidade || 0);
      const precoUnitario = Number(row.preco_unitario || 0);
      const valorRemover = quantidade * precoUnitario;

      await client.query(`DELETE FROM pedido_item WHERE pedido_id = $1 AND item_id = $2`, [pedidoId, itemId]);

      await client.query(`UPDATE pedido SET valor_total = valor_total - $1 WHERE id = $2`, [valorRemover, pedidoId]);
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

  async listarPorMesa(mesaId: string): Promise<Pedido[]> {
    const result = await this.databaseService.query(
      `SELECT p.* FROM pedido p
       WHERE p.mesa_id = $1
       ORDER BY p.created_at DESC`,
      [mesaId],
    );
    return result.rows.map((row) => this.mapToDomain(row));
  }
}
