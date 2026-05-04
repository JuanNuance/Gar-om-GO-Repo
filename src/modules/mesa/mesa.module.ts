import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IMesaRepository } from './domain/mesa.repository.interface';
import { PrismaMesaRepository } from './infrastructure/repositories/prisma-mesa.repository';
import { CriarMesaUseCase } from './application/criar-mesa.use-case';
import { MesaController } from './presentation/mesa.controller';

@Module({
  controllers: [MesaController],
  providers: [
    PrismaService,
    CriarMesaUseCase,
    {
      provide: IMesaRepository,
      useClass: PrismaMesaRepository,
    },
  ],
  exports: [IMesaRepository],
})
export class MesaModule {}
