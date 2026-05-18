import { Garcom } from './garcom.entity';

export interface IGarcomRepository {
  criar(garcom: Garcom): Promise<Garcom>;
  listarPorRestaurante(restauranteId: string): Promise<Garcom[]>;
}

export const GARCOM_REPOSITORY = Symbol('GARCOM_REPOSITORY');
