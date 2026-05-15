import { Item } from './item.entity';

export interface IItemRepository {
  criar(item: Item): Promise<Item>;
  listarPorRestaurante(restauranteId: string): Promise<Item[]>;
  findById(id: string): Promise<Item | null>;
}

export const ITEM_REPOSITORY = Symbol('ITEM_REPOSITORY');
