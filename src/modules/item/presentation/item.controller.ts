import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CriarItemUseCase } from '../application/criar-item.use-case';
import { CriarItemDto } from '../application/dto/criar-item.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { Inject } from '@nestjs/common';
import type { IItemRepository } from '../domain/item.repository.interface';
import { ITEM_REPOSITORY } from '../domain/item.repository.interface';

@Controller('itens')
export class ItemController {
  constructor(
    private readonly criarItemUseCase: CriarItemUseCase,
    @Inject(ITEM_REPOSITORY) private readonly itemRepository: IItemRepository
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  criar(@Body() criarItemDto: CriarItemDto) {
    return this.criarItemUseCase.executar(criarItemDto);
  }

  // leitura do cardápio liberada sem JWT
  @Get('restaurante/:id')
  listar(@Param('id') id: string) {
    return this.itemRepository.listarPorRestaurante(id);
  }
}
