import { Injectable, ConflictException } from '@nestjs/common';
import { IGarcomRepository } from '../domain/garcom.repository.interface';
import { IServicoHash } from '../../../common/interfaces/servico-hash.interface';
import { CriarGarcomDto } from './dto/criar-garcom.dto';
import { Garcom } from '../domain/garcom.entity';
import { randomUUID } from 'node:crypto';

@Injectable()
export class CriarGarcomUseCase {
  constructor(
    private readonly garcomRepo: IGarcomRepository,
    private readonly servicoHash: IServicoHash,
  ) {}

  async execute(dto: CriarGarcomDto, restauranteId: string) {
    const garcomExists = await this.garcomRepo.findByEmail(dto.email);
    if (garcomExists) {
      throw new ConflictException('Garçom com este email já existe');
    }

    const passwordHash = await this.servicoHash.gerarHash(dto.password);
    const garcomId = randomUUID();

    const garcom = new Garcom(
      garcomId,
      dto.nome,
      dto.email,
      passwordHash,
      restauranteId,
    );

    await this.garcomRepo.save(garcom);

    return garcom;
  }
}
