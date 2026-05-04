export class Item {
  constructor(
    public readonly id: string,
    public readonly nome: string,
    public readonly descricao: string | null,
    public readonly preco: number,
    public readonly restauranteId: string,
  ) {}
}
