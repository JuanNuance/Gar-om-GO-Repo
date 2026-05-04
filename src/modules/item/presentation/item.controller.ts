import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { CriarItemUseCase } from '../application/criar-item.use-case';
import { CriarItemDto } from '../application/dto/criar-item.dto';
import { JwtAutenticacaoGuard } from '../../../common/guards/jwt-autenticacao.guard';
import { CargosGuard } from '../../../common/guards/cargos.guard';
import { Cargos } from '../../../common/decorators/cargos.decorator';
import { IItemRepository } from '../domain/item.repository.interface';

@Controller('itens')
export class ItemController {
  constructor(
    private readonly criarItemUseCase: CriarItemUseCase,
    private readonly itemRepo: IItemRepository,
  ) {}

  @Post()
  @UseGuards(JwtAutenticacaoGuard, CargosGuard)
  @Cargos('ADMIN')
  async criar(@Body() dto: CriarItemDto, @Request() req) {
    const { restauranteId } = req.user;
    return this.criarItemUseCase.execute(dto, restauranteId);
  }

  @Get()
  @UseGuards(JwtAutenticacaoGuard)
  async listarTodos(@Request() req) {
    const { restauranteId } = req.user;
    return this.itemRepo.buscarTodosPorRestauranteId(restauranteId);
  }
}
