export class Garcom {
  constructor(
    public readonly id: string,
    public readonly nome: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly restauranteId: string,
    public readonly role: string = 'WAITER',
  ) {}
}
