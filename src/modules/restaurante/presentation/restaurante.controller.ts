import { Controller, Post, Body } from '@nestjs/common';
import { CriarRestauranteUseCase } from '../application/criar-restaurante.use-case';
import { CriarRestauranteComAdministradorDto } from '../application/dto/criar-restaurante-com-administrador.dto';

@Controller('restaurantes')
export class RestauranteController {
  constructor(private readonly criarRestauranteUseCase: CriarRestauranteUseCase) {}

  @Post()
  async create(@Body() dto: CriarRestauranteComAdministradorDto) {
    const result = await this.criarRestauranteUseCase.execute(dto);
    
    // Ocultar hash da senha no retorno
    const { passwordHash, ...administradorSemHash } = result.administrador;
    
    return {
      restaurante: result.restaurante,
      administrador: administradorSemHash,
    };
  }
}
