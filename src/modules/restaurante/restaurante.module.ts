import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AdministradorModule } from '../administrador/administrador.module';
import { BcryptHashService } from '../../common/infrastructure/seguranca/bcrypt-hash.service';
import { IServicoHash } from '../../common/interfaces/servico-hash.interface';
import { IRestauranteRepository } from './domain/restaurante.repository.interface';
import { PrismaRestauranteRepository } from './infrastructure/repositories/prisma-restaurante.repository';
import { CriarRestauranteUseCase } from './application/criar-restaurante.use-case';
import { RestauranteController } from './presentation/restaurante.controller';

@Module({
  imports: [AdministradorModule],
  controllers: [RestauranteController],
  providers: [
    PrismaService,
    CriarRestauranteUseCase,
    {
      provide: IRestauranteRepository,
      useClass: PrismaRestauranteRepository,
    },
    {
      provide: IServicoHash,
      useClass: BcryptHashService,
    },
  ],
})
export class RestauranteModule {}
