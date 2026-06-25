import { Body, Controller, Param, Delete, Put, Get, Post, Inject } from '@nestjs/common';
import { CriarRestauranteUseCase } from '../application/criar-restaurante.use-case';
import { CriarRestauranteDto } from '../application/dto/criar-restaurante.dto';
import type { IRestauranteRepository } from '../domain/restaurante.repository.interface';
import { RESTAURANTE_REPOSITORY } from '../domain/restaurante.repository.interface';

@Controller('restaurantes')
export class RestauranteController {
  constructor(
    private readonly criarRestauranteUseCase: CriarRestauranteUseCase,
    @Inject(RESTAURANTE_REPOSITORY) private readonly restauranteRepository: IRestauranteRepository,
  ) {}

  @Post()
  criar(@Body() dto: CriarRestauranteDto) {
    return this.criarRestauranteUseCase.executar(dto);
  }

  @Get()
  listar() {
    return this.restauranteRepository.listarTodos();
  }
  @Put(':id')
  atualizar(@Param('id') id: string, @Body() dados: any) {
    return this.restauranteRepository.atualizar(id, dados);
  }

  @Delete(':id')
  deletar(@Param('id') id: string) {
    return this.restauranteRepository.deletar(id);
  }
}

