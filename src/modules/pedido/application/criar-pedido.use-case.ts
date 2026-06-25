import { Injectable, Inject } from '@nestjs/common';
import type { IPedidoRepository } from '../domain/pedido.repository.interface';
import { PEDIDO_REPOSITORY } from '../domain/pedido.repository.interface';
import { CriarPedidoDto } from './dto/criar-pedido.dto';
import { Pedido, StatusPedido } from '../domain/pedido.entity';
import { gerarId } from '../../../common/utils/gerador-id.util';

import { CozinhaGateway } from '../../cozinha/presentation/cozinha.gateway';

@Injectable()
export class CriarPedidoUseCase {
  constructor(
    @Inject(PEDIDO_REPOSITORY)
    private readonly pedidoRepository: IPedidoRepository,
    private readonly cozinhaGateway: CozinhaGateway,
  ) {}

  async executar(dados: CriarPedidoDto): Promise<Pedido> {
    const id = await gerarId();
    const pedido = new Pedido(id, StatusPedido.PENDENTE, 0, dados.mesaId, dados.garcomId, new Date());
    const pedidoCriado = await this.pedidoRepository.criar(pedido);
    
    // Emitir via WebSocket para a cozinha
    this.cozinhaGateway.notificarNovoPedido(pedidoCriado);
    
    return pedidoCriado;
  }
}
