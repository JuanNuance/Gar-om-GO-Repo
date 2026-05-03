import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { GarconsModule } from './garcons/garcons.module';
import { ItensModule } from './itens/itens.module';
import { PedidosModule } from './pedidos/pedidos.module';
import { MesasModule } from './mesas/mesas.module';
import { RestauranteModule } from './restaurante/restaurante.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AdminModule,
    GarconsModule,
    ItensModule,
    PedidosModule,
    MesasModule,
    RestauranteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
