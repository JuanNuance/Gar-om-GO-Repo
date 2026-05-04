import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IAdministradorRepository } from './domain/administrador.repository.interface';
import { PrismaAdministradorRepository } from './infrastructure/repositories/prisma-administrador.repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: IAdministradorRepository,
      useClass: PrismaAdministradorRepository,
    },
  ],
  exports: [IAdministradorRepository],
})
export class AdministradorModule {}
