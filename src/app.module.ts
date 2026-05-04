import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdministradorModule } from './modules/administrador/administrador.module';
import { RestauranteModule } from './modules/restaurante/restaurante.module';
import { AutenticacaoModule } from './modules/autenticacao/autenticacao.module';
import { GarcomModule } from './modules/garcom/garcom.module';
import { MesaModule } from './modules/mesa/mesa.module';
import { ItemModule } from './modules/item/item.module';
import { PedidoModule } from './modules/pedido/pedido.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AdministradorModule,
    RestauranteModule,
    AutenticacaoModule,
    GarcomModule,
    MesaModule,
    ItemModule,
    PedidoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
