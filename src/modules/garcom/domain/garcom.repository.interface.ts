import { Garcom } from './garcom.entity';

export interface IGarcomRepository {
  criar(garcom: Garcom): Promise<Garcom>;
  listarPorRestaurante(restauranteId: string): Promise<Garcom[]>;
  atualizar(id: string, dados: Partial<Garcom>): Promise<Garcom>;
  deletar(id: string): Promise<void>;
}

export const GARCOM_REPOSITORY = Symbol('GARCOM_REPOSITORY');
