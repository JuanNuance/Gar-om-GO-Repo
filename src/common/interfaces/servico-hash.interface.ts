export abstract class IServicoHash {
  abstract gerarHash(conteudo: string): Promise<string>;
  abstract comparar(conteudo: string, hash: string): Promise<boolean>;
}
