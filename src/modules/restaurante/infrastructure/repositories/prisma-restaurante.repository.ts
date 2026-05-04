import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { Restaurante } from '../../domain/restaurante.entity';
import { IRestauranteRepository } from '../../domain/restaurante.repository.interface';

@Injectable()
export class PrismaRestauranteRepository implements IRestauranteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(restaurante: Restaurante): Promise<void> {
    await this.prisma.restaurante.create({
      data: {
        id: restaurante.id,
        nome: restaurante.nome,
        cnpj: restaurante.cnpj,
        endereco: restaurante.endereco,
        createdAt: restaurante.createdAt,
      },
    });
  }

  async findByCnpj(cnpj: string): Promise<Restaurante | null> {
    const data = await this.prisma.restaurante.findUnique({
      where: { cnpj },
    });

    if (!data) return null;

    return new Restaurante(
      data.id,
      data.nome,
      data.cnpj,
      data.endereco,
      data.createdAt,
    );
  }
}
