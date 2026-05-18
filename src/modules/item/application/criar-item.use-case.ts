import { Injectable, Inject } from '@nestjs/common';
import type { IItemRepository } from '../domain/item.repository.interface';
import { ITEM_REPOSITORY } from '../domain/item.repository.interface';
import { CriarItemDto } from './dto/criar-item.dto';
import { Item } from '../domain/item.entity';
import { gerarId } from '../../../common/utils/gerador-id.util';

@Injectable()
export class CriarItemUseCase {
  constructor(
    @Inject(ITEM_REPOSITORY)
    private readonly itemRepository: IItemRepository,
  ) {}

  async executar(dados: CriarItemDto): Promise<Item> {
    const id = await gerarId();
    const item = new Item(id, dados.nome, dados.descricao || null, dados.preco, dados.categoria, dados.restauranteId);
    return this.itemRepository.criar(item);
  }
}
