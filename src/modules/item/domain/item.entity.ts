export enum CategoriaItem {
  BEBIDAS = 'BEBIDAS',
  PRATOS = 'PRATOS',
  SOBREMESAS = 'SOBREMESAS',
}

export class Item {
  constructor(
    public readonly id: string,
    public readonly nome: string,
    public readonly descricao: string | null,
    public readonly preco: number,
    public readonly categoria: CategoriaItem,
    public readonly restauranteId: string,
  ) {}
}
