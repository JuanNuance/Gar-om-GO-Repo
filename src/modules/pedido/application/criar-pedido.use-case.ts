import { Injectable, Inject } from '@nestjs/common';
import type { IPedidoRepository } from '../domain/pedido.repository.interface';
import { PEDIDO_REPOSITORY } from '../domain/pedido.repository.interface';
import { CriarPedidoDto } from './dto/criar-pedido.dto';
import { Pedido, StatusPedido } from '../domain/pedido.entity';
import { gerarId } from '../../../common/utils/gerador-id.util';

@Injectable()
export class CriarPedidoUseCase {
  constructor(
    @Inject(PEDIDO_REPOSITORY)
    private readonly pedidoRepository: IPedidoRepository,
  ) {}

  async executar(dados: CriarPedidoDto): Promise<Pedido> {
    const id = await gerarId();
    const pedido = new Pedido(id, StatusPedido.PENDENTE, 0, dados.mesaId, dados.garcomId, new Date());
    return this.pedidoRepository.criar(pedido);
  }
}
