import { IsInt, IsNotEmpty, IsUUID, Min } from 'class-validator';

export class AdicionarItemPedidoDto {
  @IsUUID()
  @IsNotEmpty()
  pedidoId: string;

  @IsUUID()
  @IsNotEmpty()
  itemId: string;

  @IsInt()
  @Min(1)
  quantidade: number;
}
