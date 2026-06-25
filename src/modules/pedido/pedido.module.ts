import { Module } from '@nestjs/common';
import { PedidoController } from './presentation/pedido.controller';
import { CriarPedidoUseCase } from './application/criar-pedido.use-case';
import { AdicionarItemPedidoUseCase } from './application/adicionar-item-pedido.use-case';
import { AlterarStatusPedidoUseCase } from './application/alterar-status-pedido.use-case';
import { PgPedidoRepository } from './infrastructure/repositories/pg-pedido.repository';
import { PEDIDO_REPOSITORY } from './domain/pedido.repository.interface';
import { DatabaseService } from '../../common/infrastructure/database/database.service';
import { ItemModule } from '../item/item.module';
import { CozinhaModule } from '../cozinha/cozinha.module';

@Module({
  imports: [ItemModule, CozinhaModule],
  controllers: [PedidoController],
  providers: [
    DatabaseService,
    CriarPedidoUseCase,
    AdicionarItemPedidoUseCase,
    AlterarStatusPedidoUseCase,
    {
      provide: PEDIDO_REPOSITORY,
      useClass: PgPedidoRepository,
    },
  ],
})
export class PedidoModule {}
