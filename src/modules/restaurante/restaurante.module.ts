import { Module } from '@nestjs/common';
import { RestauranteController } from './presentation/restaurante.controller';
import { CriarRestauranteUseCase } from './application/criar-restaurante.use-case';
import { PgRestauranteRepository } from './infrastructure/repositories/pg-restaurante.repository';
import { RESTAURANTE_REPOSITORY } from './domain/restaurante.repository.interface';
import { DatabaseService } from '../../common/infrastructure/database/database.service';

@Module({
  controllers: [RestauranteController],
  providers: [
    DatabaseService,
    CriarRestauranteUseCase,
    {
      provide: RESTAURANTE_REPOSITORY,
      useClass: PgRestauranteRepository,
    },
  ],
})
export class RestauranteModule {}
