import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CriarMesaUseCase } from '../application/criar-mesa.use-case';
import { CriarMesaDto } from '../application/dto/criar-mesa.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('mesas')
export class MesaController {
  constructor(private readonly criarMesaUseCase: CriarMesaUseCase) {}

  @Post()
  criar(@Body() criarMesaDto: CriarMesaDto) {
    return this.criarMesaUseCase.executar(criarMesaDto);
  }
}
