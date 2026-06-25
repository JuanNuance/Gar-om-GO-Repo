import { Mesa } from './mesa.entity';

export interface IMesaRepository {
  criar(mesa: Mesa): Promise<Mesa>;
  listarTodas(): Promise<Mesa[]>;
  buscarPorId(id: string): Promise<Mesa | null>;
  alterarStatus(id: string, status: string): Promise<Mesa>;
  atualizar(id: string, dados: Partial<Mesa>): Promise<Mesa>;
  deletar(id: string): Promise<void>;
}

export const MESA_REPOSITORY = Symbol('MESA_REPOSITORY');
