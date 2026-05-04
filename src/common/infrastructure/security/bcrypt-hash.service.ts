import { Injectable } from '@nestjs/common';
import { IHashService } from '../../interfaces/hash-service.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptHashService implements IHashService {
  private readonly saltRounds = 10;

  async hash(payload: string): Promise<string> {
    return bcrypt.hash(payload, this.saltRounds);
  }

  async compare(payload: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(payload, hashed);
  }
}
