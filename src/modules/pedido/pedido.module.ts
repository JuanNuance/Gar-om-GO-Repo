import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IPedidoRepository } from './domain/pedido.repository.interface';
import { PrismaPedidoRepository } from './infrastructure/repositories/prisma-pedido.repository';
import { CriarPedidoUseCase } from './application/criar-pedido.use-case';
import { PedidoController } from './presentation/pedido.controller';

@Module({
  controllers: [PedidoController],
  providers: [
    PrismaService,
    CriarPedidoUseCase,
    {
      provide: IPedidoRepository,
      useClass: PrismaPedidoRepository,
    },
  ],
  exports: [IPedidoRepository],
})
export class PedidoModule {}
