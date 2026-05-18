export class Restaurante {
  constructor(
    public readonly id: string,
    public readonly nome: string,
    public readonly cnpj: string,
    public readonly endereco: string,
  ) {}
}
