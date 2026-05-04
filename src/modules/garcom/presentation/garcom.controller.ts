import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CriarGarcomUseCase } from '../application/criar-garcom.use-case';
import { CriarGarcomDto } from '../application/dto/criar-garcom.dto';
import { JwtAutenticacaoGuard } from '../../../common/guards/jwt-autenticacao.guard';
import { CargosGuard } from '../../../common/guards/cargos.guard';
import { Cargos } from '../../../common/decorators/cargos.decorator';

@Controller('garcom')
export class GarcomController {
  constructor(private readonly criarGarcomUseCase: CriarGarcomUseCase) {}

  @Post()
  @UseGuards(JwtAutenticacaoGuard, CargosGuard)
  @Cargos('ADMIN')
  async criar(@Body() dto: CriarGarcomDto, @Request() req) {
    // O restauranteId vem do payload do token JWT
    const { restauranteId } = req.user;
    
    const result = await this.criarGarcomUseCase.execute(dto, restauranteId);
    
    // Ocultar hash da senha no retorno
    const { passwordHash, ...garcomSemHash } = result;
    return garcomSemHash;
  }
}
