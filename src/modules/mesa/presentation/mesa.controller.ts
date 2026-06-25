import { MESA_REPOSITORY } from '../domain/mesa.repository.interface';
import type { IMesaRepository } from '../domain/mesa.repository.interface';
import { Body, Controller, Inject, Param, Delete, Put, Post, UseGuards } from '@nestjs/common';
import { CriarMesaUseCase } from '../application/criar-mesa.use-case';
import { CriarMesaDto } from '../application/dto/criar-mesa.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('mesas')
export class MesaController {
  constructor(
    private readonly criarMesaUseCase: CriarMesaUseCase,
    @Inject(MESA_REPOSITORY) private readonly mesaRepository: IMesaRepository
  ) {}

  @Post()
  criar(@Body() criarMesaDto: CriarMesaDto) {
    return this.criarMesaUseCase.executar(criarMesaDto);
  }
  @Put(':id')
  atualizar(@Param('id') id: string, @Body() dados: any) {
    return this.mesaRepository.atualizar(id, dados);
  }

  @Delete(':id')
  deletar(@Param('id') id: string) {
    return this.mesaRepository.deletar(id);
  }
}

