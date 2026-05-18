import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { CategoriaItem } from '../../domain/item.entity';

export class CriarItemDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsOptional()
  descricao?: string;

  @IsNumber()
  @Min(0)
  preco: number;

  @IsEnum(CategoriaItem)
  @IsNotEmpty()
  categoria: CategoriaItem;

  @IsUUID()
  @IsNotEmpty()
  restauranteId: string;
}
