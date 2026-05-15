import { Module } from '@nestjs/common';
import { GarcomController } from './presentation/garcom.controller';
import { CriarGarcomUseCase } from './application/criar-garcom.use-case';
import { PgGarcomRepository } from './infrastructure/repositories/pg-garcom.repository';
import { GARCOM_REPOSITORY } from './domain/garcom.repository.interface';
import { DatabaseService } from '../../common/infrastructure/database/database.service';

@Module({
  controllers: [GarcomController],
  providers: [
    DatabaseService,
    CriarGarcomUseCase,
    {
      provide: GARCOM_REPOSITORY,
      useClass: PgGarcomRepository,
    },
  ],
})
export class GarcomModule {}
