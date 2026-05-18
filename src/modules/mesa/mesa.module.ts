import { Module } from '@nestjs/common';
import { MesaController } from './presentation/mesa.controller';
import { CriarMesaUseCase } from './application/criar-mesa.use-case';
import { PgMesaRepository } from './infrastructure/repositories/pg-mesa.repository';
import { MESA_REPOSITORY } from './domain/mesa.repository.interface';
import { DatabaseService } from '../../common/infrastructure/database/database.service';

@Module({
  controllers: [MesaController],
  providers: [
    DatabaseService,
    CriarMesaUseCase,
    {
      provide: MESA_REPOSITORY,
      useClass: PgMesaRepository,
    },
  ],
})
export class MesaModule {}
