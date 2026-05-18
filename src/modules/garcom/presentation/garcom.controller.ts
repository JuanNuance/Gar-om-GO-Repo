import { Body, Controller, Get, Param, Post, UseGuards, Inject } from '@nestjs/common';
import { CriarGarcomUseCase } from '../application/criar-garcom.use-case';
import { CriarGarcomDto } from '../application/dto/criar-garcom.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import type { IGarcomRepository } from '../domain/garcom.repository.interface';
import { GARCOM_REPOSITORY } from '../domain/garcom.repository.interface';

@Controller('garcom')
export class GarcomController {
  constructor(
    private readonly criarGarcomUseCase: CriarGarcomUseCase,
    @Inject(GARCOM_REPOSITORY) private readonly garcomRepository: IGarcomRepository,
  ) {}

  @Post()
  criar(@Body() dto: CriarGarcomDto) {
    return this.criarGarcomUseCase.executar(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('restaurante/:id')
  listar(@Param('id') id: string) {
    return this.garcomRepository.listarPorRestaurante(id);
  }
}
