import { Injectable, Inject } from '@nestjs/common';
import type { IMesaRepository } from '../domain/mesa.repository.interface';
import { MESA_REPOSITORY } from '../domain/mesa.repository.interface';
import { CriarMesaDto } from './dto/criar-mesa.dto';
import { Mesa, StatusMesa } from '../domain/mesa.entity';
import { gerarId } from '../../../common/utils/gerador-id.util';

@Injectable()
export class CriarMesaUseCase {
  constructor(
    @Inject(MESA_REPOSITORY)
    private readonly mesaRepository: IMesaRepository,
  ) {}

  async executar(dados: CriarMesaDto): Promise<Mesa> {
    const id = await gerarId();
    const mesa = new Mesa(id, dados.numero, dados.capacidade, StatusMesa.DISPONIVEL, dados.restauranteId);
    return this.mesaRepository.criar(mesa);
  }
}
