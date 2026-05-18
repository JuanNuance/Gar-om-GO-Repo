export enum StatusMesa {
  DISPONIVEL = 'DISPONIVEL',
  OCUPADA = 'OCUPADA',
  RESERVADA = 'RESERVADA',
}

export class Mesa {
  constructor(
    public readonly id: string,
    public readonly numero: number,
    public readonly capacidade: number,
    public readonly status: StatusMesa,
    public readonly restauranteId: string,
  ) {}
}
