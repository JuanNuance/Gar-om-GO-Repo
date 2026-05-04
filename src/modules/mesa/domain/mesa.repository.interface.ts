import { Mesa } from './mesa.entity';

export abstract class IMesaRepository {
  abstract salvar(mesa: Mesa): Promise<void>;
  abstract buscarPorNumero(numero: number, restauranteId: string): Promise<Mesa | null>;
  abstract buscarTodasPorRestauranteId(restauranteId: string): Promise<Mesa[]>;
  abstract buscarPorId(id: string): Promise<Mesa | null>;
  abstract deletar(id: string): Promise<void>;
}
