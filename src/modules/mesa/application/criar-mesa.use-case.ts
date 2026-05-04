import { Injectable, ConflictException } from '@nestjs/common';
import { IMesaRepository } from '../domain/mesa.repository.interface';
import { CriarMesaDto } from './dto/criar-mesa.dto';
import { Mesa } from '../domain/mesa.entity';
import { randomUUID } from 'node:crypto';

@Injectable()
export class CriarMesaUseCase {
  constructor(private readonly mesaRepo: IMesaRepository) {}

  async execute(dto: CriarMesaDto, restauranteId: string) {
    const mesaExistente = await this.mesaRepo.buscarPorNumero(dto.numero, restauranteId);
    if (mesaExistente) {
      throw new ConflictException(`Mesa número ${dto.numero} já existe neste restaurante`);
    }

    const mesa = new Mesa(
      randomUUID(),
      dto.numero,
      dto.capacidade,
      restauranteId,
    );

    await this.mesaRepo.salvar(mesa);

    return mesa;
  }
}
