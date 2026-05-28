import { Body, Controller, Get, Param, Patch, Post, Inject, Delete } from '@nestjs/common';
import { CriarPedidoUseCase } from '../application/criar-pedido.use-case';
import { AdicionarItemPedidoUseCase } from '../application/adicionar-item-pedido.use-case';
import { AlterarStatusPedidoUseCase } from '../application/alterar-status-pedido.use-case';
import { CriarPedidoDto } from '../application/dto/criar-pedido.dto';
import { AdicionarItemPedidoDto } from '../application/dto/adicionar-item-pedido.dto';
import { StatusPedido } from '../domain/pedido.entity';
import type { IPedidoRepository } from '../domain/pedido.repository.interface';
import { PEDIDO_REPOSITORY } from '../domain/pedido.repository.interface';

@Controller('pedidos')
export class PedidoController {
  constructor(
    private readonly criarPedidoUseCase: CriarPedidoUseCase,
    private readonly adicionarItemUseCase: AdicionarItemPedidoUseCase,
    private readonly alterarStatusUseCase: AlterarStatusPedidoUseCase,
    @Inject(PEDIDO_REPOSITORY) private readonly pedidoRepository: IPedidoRepository,
  ) {}

  @Post()
  criar(@Body() criarPedidoDto: CriarPedidoDto) {
    return this.criarPedidoUseCase.executar(criarPedidoDto);
  }

  @Post('item')
  adicionarItem(@Body() dto: AdicionarItemPedidoDto) {
    return this.adicionarItemUseCase.executar(dto);
  }

  @Patch(':id/status')
  alterarStatus(@Param('id') id: string, @Body('status') status: StatusPedido) {
    return this.alterarStatusUseCase.executar(id, status);
  }

  @Get('restaurante/:id')
  listarPorRestaurante(@Param('id') id: string) {
    return this.pedidoRepository.listarPorRestaurante(id);
  }

  @Patch(':pedidoId/item/:itemId')
  atualizarItem(
    @Param('pedidoId') pedidoId: string,
    @Param('itemId') itemId: string,
    @Body() dto: any,
  ) {
    const quantidade = dto.quantidade as number;
    const observacoes = dto.observacoes as string | undefined;
    return this.pedidoRepository.atualizarItem(pedidoId, itemId, quantidade, observacoes);
  }

  @Delete(':pedidoId/item/:itemId')
  removerItem(@Param('pedidoId') pedidoId: string, @Param('itemId') itemId: string) {
    return this.pedidoRepository.removerItem(pedidoId, itemId);
  }

  @Get('mesa/:mesaId')
  listarPorMesa(@Param('mesaId') mesaId: string) {
    return this.pedidoRepository.listarPorMesa(mesaId);
  }
}
