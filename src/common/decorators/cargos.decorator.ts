import { SetMetadata } from '@nestjs/common';

export const CHAVE_CARGOS = 'cargos';
export const Cargos = (...cargos: string[]) => SetMetadata(CHAVE_CARGOS, cargos);
