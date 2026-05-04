export class ItemPedido {
  constructor(
    public readonly id: string,
    public readonly pedidoId: string,
    public readonly itemId: string,
    public readonly quantidade: number,
  ) {}
}

export class Pedido {
  constructor(
    public readonly id: string,
    public readonly mesaId: string,
    public readonly garcomId: string,
    public readonly status: string, // ABERTO, FECHADO, CANCELADO
    public readonly itens: ItemPedido[],
    public readonly createdAt: Date,
  ) {}
}
