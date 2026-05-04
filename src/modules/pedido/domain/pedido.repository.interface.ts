import { Pedido } from './pedido.entity';

export abstract class IPedidoRepository {
  abstract salvar(pedido: Pedido): Promise<void>;
  abstract buscarPorId(id: string): Promise<Pedido | null>;
  abstract buscarTodosPorMesa(mesaId: string): Promise<Pedido[]>;
  abstract buscarTodosPorGarcom(garcomId: string): Promise<Pedido[]>;
}
