import { Mesa } from './mesa.entity';

export interface IMesaRepository {
  criar(mesa: Mesa): Promise<Mesa>;
  listarTodas(): Promise<Mesa[]>;
  buscarPorId(id: string): Promise<Mesa | null>;
  alterarStatus(id: string, status: string): Promise<Mesa>;
}

export const MESA_REPOSITORY = Symbol('MESA_REPOSITORY');
