import { Module } from '@nestjs/common';
import { ItemController } from './presentation/item.controller';
import { CriarItemUseCase } from './application/criar-item.use-case';
import { PgItemRepository } from './infrastructure/repositories/pg-item.repository';
import { ITEM_REPOSITORY } from './domain/item.repository.interface';
import { DatabaseService } from '../../common/infrastructure/database/database.service';

@Module({
  controllers: [ItemController],
  providers: [
    DatabaseService,
    CriarItemUseCase,
    {
      provide: ITEM_REPOSITORY,
      useClass: PgItemRepository,
    },
  ],
  exports: [ITEM_REPOSITORY],
})
export class ItemModule {}
