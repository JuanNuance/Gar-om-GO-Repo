import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class AdicionarItemPedidoDto {
  @IsString()
  @IsNotEmpty()
  pedidoId: string;

  @IsString()
  @IsNotEmpty()
  itemId: string;

  @IsInt()
  @Min(1)
  quantidade: number;
}
