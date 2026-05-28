import { Body, Controller, Post, UseGuards, Inject, Get, Param } from '@nestjs/common';
import { CriarMesaUseCase } from '../application/criar-mesa.use-case';
import { CriarMesaDto } from '../application/dto/criar-mesa.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import type { IMesaRepository } from '../domain/mesa.repository.interface';
import { MESA_REPOSITORY } from '../domain/mesa.repository.interface';

@Controller('mesas')
export class MesaController {
  constructor(
    private readonly criarMesaUseCase: CriarMesaUseCase,
    @Inject(MESA_REPOSITORY) private readonly mesaRepository: IMesaRepository,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  criar(@Body() criarMesaDto: CriarMesaDto) {
    return this.criarMesaUseCase.executar(criarMesaDto);
  }

  @Get('restaurante/:id')
  listarPorRestaurante(@Param('id') id: string) {
    return this.mesaRepository.listarPorRestaurante(id);
  }
}
