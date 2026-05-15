import { IsNotEmpty, IsUUID } from 'class-validator';

export class CriarPedidoDto {
  @IsUUID()
  @IsNotEmpty()
  mesaId: string;

  @IsUUID()
  @IsNotEmpty()
  garcomId: string;
}
