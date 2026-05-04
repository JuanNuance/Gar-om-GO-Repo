import { Item } from './item.entity';

export abstract class IItemRepository {
  abstract salvar(item: Item): Promise<void>;
  abstract buscarPorNome(nome: string, restauranteId: string): Promise<Item | null>;
  abstract buscarTodosPorRestauranteId(restauranteId: string): Promise<Item[]>;
  abstract buscarPorId(id: string): Promise<Item | null>;
  abstract deletar(id: string): Promise<void>;
}
