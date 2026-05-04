import { IsString, IsNumber, IsNotEmpty, IsOptional, Min } from 'class-validator';

export class CriarItemDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsOptional()
  descricao?: string;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  preco: number;
}
