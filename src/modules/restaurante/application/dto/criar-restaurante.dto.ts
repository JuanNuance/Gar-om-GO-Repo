import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CriarRestauranteDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @Length(14, 14)
  cnpj: string;

  @IsString()
  @IsNotEmpty()
  endereco: string;
}
