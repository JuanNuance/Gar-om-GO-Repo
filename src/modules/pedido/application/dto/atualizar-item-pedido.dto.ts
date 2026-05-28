import { IsInt, IsNotEmpty, IsOptional, Min, IsString } from 'class-validator';

export class AtualizarItemPedidoDto {
  @IsInt()
  @Min(0)
  quantidade: number;

  @IsOptional()
  @IsString()
  observacoes?: string;
}
