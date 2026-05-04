import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { Pedido, ItemPedido } from '../../domain/pedido.entity';
import { IPedidoRepository } from '../../domain/pedido.repository.interface';

@Injectable()
export class PrismaPedidoRepository implements IPedidoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async salvar(pedido: Pedido): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      await tx.pedido.upsert({
        where: { id: pedido.id },
        update: {
          status: pedido.status,
        },
        create: {
          id: pedido.id,
          mesaId: pedido.mesaId,
          garcomId: pedido.garcomId,
          status: pedido.status,
          createdAt: pedido.createdAt,
        },
      });

      // Para simplificar, vamos deletar e recriar os itens (em um cenário real seria mais complexo)
      await tx.itemPedido.deleteMany({
        where: { pedidoId: pedido.id },
      });

      await tx.itemPedido.createMany({
        data: pedido.itens.map((i) => ({
          id: i.id,
          pedidoId: i.pedidoId,
          itemId: i.itemId,
          quantidade: i.quantidade,
        })),
      });
    });
  }

  async buscarPorId(id: string): Promise<Pedido | null> {
    const data = await this.prisma.pedido.findUnique({
      where: { id },
      include: { itens: true },
    });

    if (!data) return null;

    return new Pedido(
      data.id,
      data.mesaId,
      data.garcomId,
      data.status,
      data.itens.map((i) => new ItemPedido(i.id, i.pedidoId, i.itemId, i.quantidade)),
      data.createdAt,
    );
  }

  async buscarTodosPorMesa(mesaId: string): Promise<Pedido[]> {
    const data = await this.prisma.pedido.findMany({
      where: { mesaId },
      include: { itens: true },
    });

    return data.map(
      (d) =>
        new Pedido(
          d.id,
          d.mesaId,
          d.garcomId,
          d.status,
          d.itens.map(
            (i) => new ItemPedido(i.id, i.pedidoId, i.itemId, i.quantidade),
          ),
          d.createdAt,
        ),
    );
  }

  async buscarTodosPorGarcom(garcomId: string): Promise<Pedido[]> {
    const data = await this.prisma.pedido.findMany({
      where: { garcomId },
      include: { itens: true },
    });

    return data.map(
      (d) =>
        new Pedido(
          d.id,
          d.mesaId,
          d.garcomId,
          d.status,
          d.itens.map(
            (i) => new ItemPedido(i.id, i.pedidoId, i.itemId, i.quantidade),
          ),
          d.createdAt,
        ),
    );
  }
}
