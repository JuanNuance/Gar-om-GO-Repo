import { Injectable } from '@nestjs/common';
import { IPedidoRepository } from '../domain/pedido.repository.interface';
import { CriarPedidoDto } from './dto/criar-pedido.dto';
import { Pedido, ItemPedido } from '../domain/pedido.entity';
import { randomUUID } from 'node:crypto';

@Injectable()
export class CriarPedidoUseCase {
  constructor(private readonly pedidoRepo: IPedidoRepository) {}

  async execute(dto: CriarPedidoDto, garcomId: string) {
    const pedidoId = randomUUID();
    
    const itens = dto.itens.map(
      (i) => new ItemPedido(randomUUID(), pedidoId, i.itemId, i.quantidade),
    );

    const pedido = new Pedido(
      pedidoId,
      dto.mesaId,
      garcomId,
      'ABERTO',
      itens,
      new Date(),
    );

    await this.pedidoRepo.salvar(pedido);

    return pedido;
  }
}
