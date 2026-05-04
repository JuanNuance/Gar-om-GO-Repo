import { Injectable, ConflictException } from '@nestjs/common';
import { IRestauranteRepository } from '../domain/restaurante.repository.interface';
import { IAdministradorRepository } from '../../administrador/domain/administrador.repository.interface';
import { IServicoHash } from '../../../common/interfaces/servico-hash.interface';
import { CriarRestauranteComAdministradorDto } from './dto/criar-restaurante-com-administrador.dto';
import { Restaurante } from '../domain/restaurante.entity';
import { Administrador } from '../../administrador/domain/administrador.entity';
import { randomUUID } from 'node:crypto';

@Injectable()
export class CriarRestauranteUseCase {
  constructor(
    private readonly restauranteRepo: IRestauranteRepository,
    private readonly administradorRepo: IAdministradorRepository,
    private readonly hashService: IServicoHash,
  ) {}

  async execute(dto: CriarRestauranteComAdministradorDto) {
    const restauranteExists = await this.restauranteRepo.findByCnpj(dto.cnpj);
    if (restauranteExists) {
      throw new ConflictException('Restaurante com este CNPJ já existe');
    }

    const administradorExists = await this.administradorRepo.findByEmail(dto.emailAdministrador);
    if (administradorExists) {
      throw new ConflictException('Administrador com este email já existe');
    }

    const restauranteId = randomUUID();
    const administradorId = randomUUID();

    const passwordHash = await this.hashService.gerarHash(dto.senhaAdministrador);

    const restaurante = new Restaurante(
      restauranteId,
      dto.nomeRestaurante,
      dto.cnpj,
      dto.endereco,
      new Date(),
    );

    const administrador = new Administrador(
      administradorId,
      dto.nomeAdministrador,
      dto.emailAdministrador,
      passwordHash,
      restauranteId,
    );

    // Persistência
    await this.restauranteRepo.save(restaurante);
    await this.administradorRepo.save(administrador);

    return { restaurante, administrador };
  }
}
