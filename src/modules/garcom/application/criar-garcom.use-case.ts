import { Injectable, Inject } from '@nestjs/common';
import type { IGarcomRepository } from '../domain/garcom.repository.interface';
import { GARCOM_REPOSITORY } from '../domain/garcom.repository.interface';
import { CriarGarcomDto } from './dto/criar-garcom.dto';
import { Garcom } from '../domain/garcom.entity';
import * as bcrypt from 'bcrypt';
import { gerarId } from '../../../common/utils/gerador-id.util';

@Injectable()
export class CriarGarcomUseCase {
  constructor(
    @Inject(GARCOM_REPOSITORY)
    private readonly garcomRepository: IGarcomRepository,
  ) {}

  async executar(dados: CriarGarcomDto): Promise<Garcom> {
    const id = await gerarId();
    const garcom = new Garcom(id, dados.nome, dados.email, dados.restauranteId, 'GARCOM');
    return this.garcomRepository.criar(garcom);
  }
}
