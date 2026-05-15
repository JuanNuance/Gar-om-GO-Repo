import { Injectable, Inject } from '@nestjs/common';
import type { IRestauranteRepository } from '../domain/restaurante.repository.interface';
import { RESTAURANTE_REPOSITORY } from '../domain/restaurante.repository.interface';
import { CriarRestauranteDto } from './dto/criar-restaurante.dto';
import { Restaurante } from '../domain/restaurante.entity';
import { gerarId } from '../../../common/utils/gerador-id.util';

@Injectable()
export class CriarRestauranteUseCase {
  constructor(
    @Inject(RESTAURANTE_REPOSITORY)
    private readonly restauranteRepository: IRestauranteRepository,
  ) {}

  async executar(dados: CriarRestauranteDto): Promise<Restaurante> {
    const id = await gerarId();
    const restaurante = new Restaurante(id, dados.nome, dados.cnpj, dados.endereco);
    return this.restauranteRepository.criar(restaurante);
  }
}
