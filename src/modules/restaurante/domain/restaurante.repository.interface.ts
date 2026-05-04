import { Restaurante } from './restaurante.entity';

export abstract class IRestauranteRepository {
  abstract save(restaurante: Restaurante): Promise<void>;
  abstract findByCnpj(cnpj: string): Promise<Restaurante | null>;
}
