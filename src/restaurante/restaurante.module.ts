import { Module } from '@nestjs/common';
import { RestauranteController } from './restaurante.controller';
import { RestauranteService } from './restaurante.service';

@Module({
  controllers: [RestauranteController],
  providers: [RestauranteService],
  exports: [RestauranteService],
})
export class RestauranteModule {}
