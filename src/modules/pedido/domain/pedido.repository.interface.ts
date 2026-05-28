import { Pedido, StatusPedido } from './pedido.entity';

export interface IPedidoRepository {
  criar(pedido: Pedido): Promise<Pedido>;
  adicionarItem(pedidoId: string, itemId: string, quantidade: number, precoUnitario: number): Promise<void>;
  alterarStatus(id: string, status: StatusPedido): Promise<Pedido>;
  listarPorRestaurante(restauranteId: string): Promise<Pedido[]>;
  listarPorMesa(mesaId: string): Promise<Pedido[]>;
  atualizarItem(pedidoId: string, itemId: string, quantidade: number, observacoes?: string): Promise<void>;
  removerItem(pedidoId: string, itemId: string): Promise<void>;
}

export const PEDIDO_REPOSITORY = Symbol('PEDIDO_REPOSITORY');
