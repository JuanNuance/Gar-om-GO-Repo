import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GarconsController } from './garcons/garcons.controller';
import { GarconsService } from './garcons/garcons.service';
import { AdminController } from './admin/admin.controller';
import { AdminService } from './admin/admin.service';
import { ItensController } from './itens/itens.controller';
import { ItensService } from './itens/itens.service';
import { PedidosController } from './pedidos/pedidos.controller';
import { PedidosService } from './pedidos/pedidos.service';
import { MesasController } from './mesas/mesas.controller';
import { MesasService } from './mesas/mesas.service';
import { RestauranteController } from './restaurante/restaurante.controller';
import { RestauranteService } from './restaurante/restaurante.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController, GarconsController, AdminController, ItensController, PedidosController, MesasController, RestauranteController],
  providers: [AppService, GarconsService, AdminService, ItensService, PedidosService, MesasService, RestauranteService],
})
export class AppModule {}
