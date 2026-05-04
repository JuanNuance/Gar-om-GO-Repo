export abstract class ITokenService {
  abstract gerarToken(payload: any): string;
}
