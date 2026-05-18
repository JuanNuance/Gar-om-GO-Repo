import { Restaurante } from './restaurante.entity';

export interface IRestauranteRepository {
  criar(restaurante: Restaurante): Promise<Restaurante>;
  listarTodos(): Promise<Restaurante[]>;
}
export const RESTAURANTE_REPOSITORY = Symbol('RESTAURANTE_REPOSITORY');
