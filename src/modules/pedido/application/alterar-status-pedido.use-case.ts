import { Injectable, Inject } from '@nestjs/common';
import type { IPedidoRepository } from '../domain/pedido.repository.interface';
import { PEDIDO_REPOSITORY } from '../domain/pedido.repository.interface';
import { StatusPedido } from '../domain/pedido.entity';

@Injectable()
export class AlterarStatusPedidoUseCase {
  constructor(
    @Inject(PEDIDO_REPOSITORY)
    private readonly pedidoRepository: IPedidoRepository,
  ) {}

  async executar(id: string, status: StatusPedido) {
    return this.pedidoRepository.alterarStatus(id, status);
  }
}
