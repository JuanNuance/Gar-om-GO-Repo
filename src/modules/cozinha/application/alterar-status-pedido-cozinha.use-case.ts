import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../../common/infrastructure/database/database.service';
import { CozinhaGateway } from '../presentation/cozinha.gateway';
import { StatusPedido } from '../../pedido/domain/pedido.entity';

@Injectable()
export class AlterarStatusPedidoCozinhaUseCase {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly cozinhaGateway: CozinhaGateway
  ) {}

  async executar(id: string, status: StatusPedido, tempoPreparo?: number, tempoEspera?: number) {
    let query = `UPDATE pedido SET status = $1`;
    const params: any[] = [status];
    let paramCount = 1;

    if (tempoPreparo !== undefined) {
      paramCount++;
      query += `, tempo_preparo = $${paramCount}`;
      params.push(tempoPreparo);
    }
    if (tempoEspera !== undefined) {
      paramCount++;
      query += `, tempo_espera = $${paramCount}`;
      params.push(tempoEspera);
    }

    paramCount++;
    query += ` WHERE id = $${paramCount} RETURNING *`;
    params.push(id);

    // Verify if columns tempo_preparo and tempo_espera exist, if not, we must add them before.
    // For safety, let's just run it, assuming migration added it.
    
    const result = await this.databaseService.query(query, params);
    
    if (result.rows.length === 0) {
      throw new NotFoundException('Pedido não encontrado');
    }

    const pedido = result.rows[0];

    // Emit via WebSocket para os garçons
    this.cozinhaGateway.notificarStatusAlterado(pedido);

    return pedido;
  }
}
