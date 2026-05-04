import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { Garcom } from '../../domain/garcom.entity';
import { IGarcomRepository } from '../../domain/garcom.repository.interface';

@Injectable()
export class PrismaGarcomRepository implements IGarcomRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(garcom: Garcom): Promise<void> {
    await this.prisma.garcom.upsert({
      where: { id: garcom.id },
      update: {
        nome: garcom.nome,
        email: garcom.email,
        passwordHash: garcom.passwordHash,
      },
      create: {
        id: garcom.id,
        nome: garcom.nome,
        email: garcom.email,
        passwordHash: garcom.passwordHash,
        restauranteId: garcom.restauranteId,
        role: garcom.role,
      },
    });
  }

  async findByEmail(email: string): Promise<Garcom | null> {
    const data = await this.prisma.garcom.findUnique({
      where: { email },
    });

    if (!data) return null;

    return new Garcom(
      data.id,
      data.nome,
      data.email,
      data.passwordHash,
      data.restauranteId,
      data.role,
    );
  }

  async findAllByRestauranteId(restauranteId: string): Promise<Garcom[]> {
    const data = await this.prisma.garcom.findMany({
      where: { restauranteId },
    });

    return data.map(
      (item) =>
        new Garcom(
          item.id,
          item.nome,
          item.email,
          item.passwordHash,
          item.restauranteId,
          item.role,
        ),
    );
  }

  async findById(id: string): Promise<Garcom | null> {
    const data = await this.prisma.garcom.findUnique({
      where: { id },
    });

    if (!data) return null;

    return new Garcom(
      data.id,
      data.nome,
      data.email,
      data.passwordHash,
      data.restauranteId,
      data.role,
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.garcom.delete({
      where: { id },
    });
  }
}
