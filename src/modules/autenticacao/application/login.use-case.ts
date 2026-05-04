import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IAdministradorRepository } from '../../administrador/domain/administrador.repository.interface';
import { IServicoHash } from '../../../common/interfaces/servico-hash.interface';
import { ITokenService } from '../domain/token-servico.interface';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly administradorRepo: IAdministradorRepository,
    private readonly servicoHash: IServicoHash,
    private readonly tokenService: ITokenService,
  ) {}

  async execute(dto: LoginDto) {
    const administrador = await this.administradorRepo.findByEmail(dto.email);
    if (!administrador) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const senhaCorreta = await this.servicoHash.comparar(
      dto.password,
      administrador.passwordHash,
    );

    if (!senhaCorreta) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const token = this.tokenService.gerarToken({
      sub: administrador.id,
      email: administrador.email,
      role: administrador.role,
      restauranteId: administrador.restauranteId,
    });

    return {
      accessToken: token,
      administrador: {
        id: administrador.id,
        nome: administrador.nome,
        email: administrador.email,
        role: administrador.role,
      },
    };
  }
}
