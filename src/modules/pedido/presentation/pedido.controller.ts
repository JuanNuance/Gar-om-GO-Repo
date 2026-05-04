import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Param,
} from '@nestjs/common';
import { CriarPedidoUseCase } from '../application/criar-pedido.use-case';
import { CriarPedidoDto } from '../application/dto/criar-pedido.dto';
import { JwtAutenticacaoGuard } from '../../../common/guards/jwt-autenticacao.guard';
import { CargosGuard } from '../../../common/guards/cargos.guard';
import { Cargos } from '../../../common/decorators/cargos.decorator';
import { IPedidoRepository } from '../domain/pedido.repository.interface';

@Controller('pedidos')
export class PedidoController {
  constructor(
    private readonly criarPedidoUseCase: CriarPedidoUseCase,
    private readonly pedidoRepo: IPedidoRepository,
  ) {}

  @Post()
  @UseGuards(JwtAutenticacaoGuard, CargosGuard)
  @Cargos('WAITER', 'ADMIN')
  async criar(@Body() dto: CriarPedidoDto, @Request() req) {
    const { sub: garcomId } = req.user; // sub geralmente é o ID do usuário no JWT
    return this.criarPedidoUseCase.execute(dto, garcomId);
  }

  @Get('mesa/:mesaId')
  @UseGuards(JwtAutenticacaoGuard)
  async listarPorMesa(@Param('mesaId') mesaId: string) {
    return this.pedidoRepo.buscarTodosPorMesa(mesaId);
  }
}
