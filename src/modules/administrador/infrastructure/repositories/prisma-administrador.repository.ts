import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { Administrador } from '../../domain/administrador.entity';
import { IAdministradorRepository } from '../../domain/administrador.repository.interface';

@Injectable()
export class PrismaAdministradorRepository implements IAdministradorRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(administrador: Administrador): Promise<void> {
    await this.prisma.administrador.create({
      data: {
        id: administrador.id,
        nome: administrador.nome,
        email: administrador.email,
        passwordHash: administrador.passwordHash,
        restauranteId: administrador.restauranteId,
        role: administrador.role,
      },
    });
  }

  async findByEmail(email: string): Promise<Administrador | null> {
    const data = await this.prisma.administrador.findUnique({
      where: { email },
    });

    if (!data) return null;

    return new Administrador(
      data.id,
      data.nome,
      data.email,
      data.passwordHash,
      data.restauranteId,
      data.role,
    );
  }
}
