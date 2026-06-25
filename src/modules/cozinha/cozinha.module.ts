import { Module } from '@nestjs/common';
import { CozinhaController } from './presentation/cozinha.controller';
import { CozinhaGateway } from './presentation/cozinha.gateway';
import { VisualizarPedidosCozinhaUseCase } from './application/visualizar-pedidos-cozinha.use-case';
import { AlterarStatusPedidoCozinhaUseCase } from './application/alterar-status-pedido-cozinha.use-case';
import { DatabaseService } from '../../common/infrastructure/database/database.service';

@Module({
  controllers: [CozinhaController],
  providers: [
    CozinhaGateway,
    VisualizarPedidosCozinhaUseCase,
    AlterarStatusPedidoCozinhaUseCase,
    DatabaseService,
  ],
  exports: [CozinhaGateway],
})
export class CozinhaModule {}
