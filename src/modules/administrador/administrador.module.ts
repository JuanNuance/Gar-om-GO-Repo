import { Module } from '@nestjs/common';
import { DatabaseService } from '../../common/infrastructure/database/database.service';
import { IAdministradorRepository } from './domain/administrador.repository.interface';
import { PgAdministradorRepository } from './infrastructure/repositories/pg-administrador.repository';

@Module({
  providers: [
    DatabaseService,
    {
      provide: IAdministradorRepository,
      useClass: PgAdministradorRepository,
    },
  ],
  exports: [IAdministradorRepository],
})
export class AdministradorModule {}
