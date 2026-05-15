import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IPedidoRepository } from '../domain/pedido.repository.interface';
import { PEDIDO_REPOSITORY } from '../domain/pedido.repository.interface';
import type { IItemRepository } from '../../item/domain/item.repository.interface';
import { ITEM_REPOSITORY } from '../../item/domain/item.repository.interface';
import { AdicionarItemPedidoDto } from './dto/adicionar-item-pedido.dto';

@Injectable()
export class AdicionarItemPedidoUseCase {
  constructor(
    @Inject(PEDIDO_REPOSITORY)
    private readonly pedidoRepository: IPedidoRepository,
    @Inject(ITEM_REPOSITORY)
    private readonly itemRepository: IItemRepository,
  ) {}

  async executar(dados: AdicionarItemPedidoDto): Promise<void> {
    const item = await this.itemRepository.findById(dados.itemId);
    if (!item) throw new NotFoundException('Item não encontrado');

    await this.pedidoRepository.adicionarItem(dados.pedidoId, dados.itemId, dados.quantidade, item.preco);
  }
}
