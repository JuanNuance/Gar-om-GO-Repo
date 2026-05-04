import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IItemRepository } from './domain/item.repository.interface';
import { PrismaItemRepository } from './infrastructure/repositories/prisma-item.repository';
import { CriarItemUseCase } from './application/criar-item.use-case';
import { ItemController } from './presentation/item.controller';

@Module({
  controllers: [ItemController],
  providers: [
    PrismaService,
    CriarItemUseCase,
    {
      provide: IItemRepository,
      useClass: PrismaItemRepository,
    },
  ],
  exports: [IItemRepository],
})
export class ItemModule {}
