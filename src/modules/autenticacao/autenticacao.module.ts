import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdministradorModule } from '../administrador/administrador.module';
import { AutenticacaoController } from './presentation/autenticacao.controller';
import { LoginUseCase } from './application/login.use-case';
import { ITokenService } from './domain/token-servico.interface';
import { NestJwtService } from './infrastructure/nest-jwt.service';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { IServicoHash } from '../../common/interfaces/servico-hash.interface';
import { BcryptHashService } from '../../common/infrastructure/seguranca/bcrypt-hash.service';

@Module({
  imports: [
    AdministradorModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'default_secret',
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  controllers: [AutenticacaoController],
  providers: [
    LoginUseCase,
    JwtStrategy,
    {
      provide: ITokenService,
      useClass: NestJwtService,
    },
    {
      provide: IServicoHash,
      useClass: BcryptHashService,
    },
  ],
  exports: [ITokenService],
})
export class AutenticacaoModule {}
