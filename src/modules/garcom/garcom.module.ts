import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BcryptHashService } from '../../common/infrastructure/seguranca/bcrypt-hash.service';
import { IServicoHash } from '../../common/interfaces/servico-hash.interface';
import { IGarcomRepository } from './domain/garcom.repository.interface';
import { PrismaGarcomRepository } from './infrastructure/repositories/prisma-garcom.repository';
import { CriarGarcomUseCase } from './application/criar-garcom.use-case';
import { GarcomController } from './presentation/garcom.controller';

@Module({
  controllers: [GarcomController],
  providers: [
    PrismaService,
    CriarGarcomUseCase,
    {
      provide: IGarcomRepository,
      useClass: PrismaGarcomRepository,
    },
    {
      provide: IServicoHash,
      useClass: BcryptHashService,
    },
  ],
  exports: [IGarcomRepository],
})
export class GarcomModule {}
