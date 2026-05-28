import { Injectable, Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import type { IRestauranteRepository } from '../domain/restaurante.repository.interface';
import { RESTAURANTE_REPOSITORY } from '../domain/restaurante.repository.interface';
import { CriarRestauranteComAdministradorDto } from './dto/criar-restaurante-com-administrador.dto';
import { Restaurante } from '../domain/restaurante.entity';
import { gerarId } from '../../../common/utils/gerador-id.util';
import { IAdministradorRepository } from '../../administrador/domain/administrador.repository.interface';
import { Administrador } from '../../administrador/domain/administrador.entity';

@Injectable()
export class CriarRestauranteUseCase {
  constructor(
    @Inject(RESTAURANTE_REPOSITORY)
    private readonly restauranteRepository: IRestauranteRepository,
    @Inject(IAdministradorRepository)
    private readonly administradorRepository: IAdministradorRepository,
  ) {}

  async executar(dados: CriarRestauranteComAdministradorDto): Promise<Restaurante> {
    const restauranteId = await gerarId();
    const restaurante = new Restaurante(restauranteId, dados.nomeRestaurante, dados.cnpj, dados.endereco);
    const restauranteCriado = await this.restauranteRepository.criar(restaurante);

    const administradorId = await gerarId();
    const passwordHash = await bcrypt.hash(dados.senhaAdministrador, 10);
    const administrador = new Administrador(
      administradorId,
      dados.nomeAdministrador,
      dados.emailAdministrador,
      passwordHash,
      restauranteId,
    );

    await this.administradorRepository.save(administrador);

    return restauranteCriado;
  }
}
