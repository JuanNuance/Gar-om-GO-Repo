import { Injectable, ConflictException } from '@nestjs/common';
import { IItemRepository } from '../domain/item.repository.interface';
import { CriarItemDto } from './dto/criar-item.dto';
import { Item } from '../domain/item.entity';
import { randomUUID } from 'node:crypto';

@Injectable()
export class CriarItemUseCase {
  constructor(private readonly itemRepo: IItemRepository) {}

  async execute(dto: CriarItemDto, restauranteId: string) {
    const itemExistente = await this.itemRepo.buscarPorNome(dto.nome, restauranteId);
    if (itemExistente) {
      throw new ConflictException(`Item com nome "${dto.nome}" já existe neste restaurante`);
    }

    const item = new Item(
      randomUUID(),
      dto.nome,
      dto.descricao || null,
      dto.preco,
      restauranteId,
    );

    await this.itemRepo.salvar(item);

    return item;
  }
}
