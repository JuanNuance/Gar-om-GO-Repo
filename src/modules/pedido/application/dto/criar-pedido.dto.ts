import { IsString, IsArray, ValidateNested, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

class ItemPedidoDto {
  @IsString()
  itemId: string;

  @IsInt()
  @Min(1)
  quantidade: number;
}

export class CriarPedidoDto {
  @IsString()
  mesaId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemPedidoDto)
  itens: ItemPedidoDto[];
}
