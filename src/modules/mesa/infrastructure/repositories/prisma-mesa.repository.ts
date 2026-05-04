import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { Mesa } from '../../domain/mesa.entity';
import { IMesaRepository } from '../../domain/mesa.repository.interface';

@Injectable()
export class PrismaMesaRepository implements IMesaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async salvar(mesa: Mesa): Promise<void> {
    await this.prisma.mesa.upsert({
      where: { id: mesa.id },
      update: {
        numero: mesa.numero,
        capacidade: mesa.capacidade,
      },
      create: {
        id: mesa.id,
        numero: mesa.numero,
        capacidade: mesa.capacidade,
        restauranteId: mesa.restauranteId,
      },
    });
  }

  async buscarPorNumero(numero: number, restauranteId: string): Promise<Mesa | null> {
    const data = await this.prisma.mesa.findFirst({
      where: { numero, restauranteId },
    });

    if (!data) return null;

    return new Mesa(data.id, data.numero, data.capacidade, data.restauranteId);
  }

  async buscarTodasPorRestauranteId(restauranteId: string): Promise<Mesa[]> {
    const data = await this.prisma.mesa.findMany({
      where: { restauranteId },
    });

    return data.map((t) => new Mesa(t.id, t.numero, t.capacidade, t.restauranteId));
  }

  async buscarPorId(id: string): Promise<Mesa | null> {
    const data = await this.prisma.mesa.findUnique({
      where: { id },
    });

    if (!data) return null;

    return new Mesa(data.id, data.numero, data.capacidade, data.restauranteId);
  }

  async deletar(id: string): Promise<void> {
    await this.prisma.mesa.delete({
      where: { id },
    });
  }
}
