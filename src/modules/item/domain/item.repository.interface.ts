import { Item } from './item.entity';

export interface IItemRepository {
  criar(item: Item): Promise<Item>;
  listarPorRestaurante(restauranteId: string): Promise<Item[]>;
  findById(id: string): Promise<Item | null>;
  atualizar(id: string, dados: Partial<Item>): Promise<Item>;
  deletar(id: string): Promise<void>;
}

export const ITEM_REPOSITORY = Symbol('ITEM_REPOSITORY');
