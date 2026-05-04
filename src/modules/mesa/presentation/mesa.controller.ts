import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CriarMesaUseCase } from '../application/criar-mesa.use-case';
import { CriarMesaDto } from '../application/dto/criar-mesa.dto';
import { JwtAutenticacaoGuard } from '../../../common/guards/jwt-autenticacao.guard';
import { CargosGuard } from '../../../common/guards/cargos.guard';
import { Cargos } from '../../../common/decorators/cargos.decorator';

@Controller('mesas')
export class MesaController {
  constructor(private readonly criarMesaUseCase: CriarMesaUseCase) {}

  @Post()
  @UseGuards(JwtAutenticacaoGuard, CargosGuard)
  @Cargos('ADMIN')
  async criar(@Body() dto: CriarMesaDto, @Request() req) {
    const { restauranteId } = req.user;
    return this.criarMesaUseCase.execute(dto, restauranteId);
  }
}
