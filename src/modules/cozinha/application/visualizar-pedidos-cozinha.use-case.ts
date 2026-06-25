import { Injectable, Inject } from '@nestjs/common';
import { DatabaseService } from '../../../common/infrastructure/database/database.service';

@Injectable()
export class VisualizarPedidosCozinhaUseCase {
  constructor(private readonly databaseService: DatabaseService) {}

  async executar(restauranteId: string) {
    const result = await this.databaseService.query(
      `SELECT p.*, m.numero as numero_mesa FROM pedido p
       JOIN mesa m ON p.mesa_id = m.id
       WHERE m.restaurante_id = $1 AND p.status IN ('PENDENTE', 'PREPARANDO')
       ORDER BY p.created_at ASC`,
      [restauranteId]
    );
    return result.rows;
  }
}
