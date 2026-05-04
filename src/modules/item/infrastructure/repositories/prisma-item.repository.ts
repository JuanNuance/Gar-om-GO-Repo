import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { Item } from '../../domain/item.entity';
import { IItemRepository } from '../../domain/item.repository.interface';

@Injectable()
export class PrismaItemRepository implements IItemRepository {
  constructor(private readonly prisma: PrismaService) {}

  async salvar(item: Item): Promise<void> {
    await this.prisma.item.upsert({
      where: { id: item.id },
      update: {
        nome: item.nome,
        descricao: item.descricao,
        preco: item.preco,
      },
      create: {
        id: item.id,
        nome: item.nome,
        descricao: item.descricao,
        preco: item.preco,
        restauranteId: item.restauranteId,
      },
    });
  }

  async buscarPorNome(nome: string, restauranteId: string): Promise<Item | null> {
    const data = await this.prisma.item.findFirst({
      where: { nome, restauranteId },
    });

    if (!data) return null;

    return new Item(data.id, data.nome, data.descricao, data.preco, data.restauranteId);
  }

  async buscarTodosPorRestauranteId(restauranteId: string): Promise<Item[]> {
    const data = await this.prisma.item.findMany({
      where: { restauranteId },
    });

    return data.map(
      (d) => new Item(d.id, d.nome, d.descricao, d.preco, d.restauranteId),
    );
  }

  async buscarPorId(id: string): Promise<Item | null> {
    const data = await this.prisma.item.findUnique({
      where: { id },
    });

    if (!data) return null;

    return new Item(data.id, data.nome, data.descricao, data.preco, data.restauranteId);
  }

  async deletar(id: string): Promise<void> {
    await this.prisma.item.delete({
      where: { id },
    });
  }
}
