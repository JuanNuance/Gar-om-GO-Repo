import { IsNotEmpty, IsString } from 'class-validator';

export class CriarPedidoDto {
  @IsString()
  @IsNotEmpty()
  mesaId: string;

  @IsString()
  @IsNotEmpty()
  garcomId: string;
}
