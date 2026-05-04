import { Injectable } from '@nestjs/common';
import { IServicoHash } from '../../interfaces/servico-hash.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptHashService implements IServicoHash {
  private readonly saltRounds = 10;

  async gerarHash(conteudo: string): Promise<string> {
    return bcrypt.hash(conteudo, this.saltRounds);
  }

  async comparar(conteudo: string, hash: string): Promise<boolean> {
    return bcrypt.compare(conteudo, hash);
  }
}
