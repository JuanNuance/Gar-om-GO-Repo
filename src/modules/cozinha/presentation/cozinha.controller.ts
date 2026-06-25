import { Controller, Get, Patch, Param, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CargosGuard } from '../../../common/guards/cargos.guard';
import { Cargos } from '../../../common/decorators/cargos.decorator';
import { VisualizarPedidosCozinhaUseCase } from '../application/visualizar-pedidos-cozinha.use-case';
import { AlterarStatusPedidoCozinhaUseCase } from '../application/alterar-status-pedido-cozinha.use-case';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { StatusPedido } from '../../pedido/domain/pedido.entity';

@ApiTags('cozinha')
@ApiBearerAuth()
@Controller('cozinha/pedidos')
@UseGuards(JwtAuthGuard, CargosGuard)
export class CozinhaController {
  constructor(
    private readonly visualizarPedidosUseCase: VisualizarPedidosCozinhaUseCase,
    private readonly alterarStatusUseCase: AlterarStatusPedidoCozinhaUseCase,
  ) {}

  @Get()
  @Cargos('COZINHEIRO')
  @ApiOperation({ summary: 'Visualizar pedidos da cozinha (pendentes e preparando)' })
  async visualizarPedidos(@Req() req: any) {
    const restauranteId = req.user.restauranteId;
    return this.visualizarPedidosUseCase.executar(restauranteId);
  }

  @Patch(':id/status')
  @Cargos('COZINHEIRO')
  @ApiOperation({ summary: 'Mudar status do pedido na cozinha' })
  async alterarStatus(
    @Param('id') id: string,
    @Body('status') status: StatusPedido,
    @Body('tempoPreparo') tempoPreparo?: number,
    @Body('tempoEspera') tempoEspera?: number,
  ) {
    return this.alterarStatusUseCase.executar(id, status, tempoPreparo, tempoEspera);
  }
}
