import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ITokenService } from '../domain/token-servico.interface';

@Injectable()
export class NestJwtService implements ITokenService {
  constructor(private readonly jwtService: JwtService) {}

  gerarToken(payload: any): string {
    return this.jwtService.sign(payload);
  }
}
