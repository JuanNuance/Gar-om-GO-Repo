import { Restaurante } from './restaurante.entity';

export interface IRestauranteRepository {
  criar(restaurante: Restaurante): Promise<Restaurante>;
  listarTodos(): Promise<Restaurante[]>;
  atualizar(id: string, dados: Partial<Restaurante>): Promise<Restaurante>;
  deletar(id: string): Promise<void>;
}
export const RESTAURANTE_REPOSITORY = Symbol('RESTAURANTE_REPOSITORY');
