export enum StatusPedido {
  PENDENTE = 'PENDENTE',
  PREPARANDO = 'PREPARANDO',
  ENTREGUE = 'ENTREGUE',
  FINALIZADO = 'FINALIZADO',
  CANCELADO = 'CANCELADO',
}

export class Pedido {
  constructor(
    public readonly id: string,
    public readonly status: StatusPedido,
    public readonly valorTotal: number,
    public readonly mesaId: string,
    public readonly garcomId: string,
    public readonly createdAt: Date,
  ) {}
}
