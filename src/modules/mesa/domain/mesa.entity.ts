export class Mesa {
  constructor(
    public readonly id: string,
    public readonly numero: number,
    public readonly capacidade: number,
    public readonly restauranteId: string,
  ) {}
}
