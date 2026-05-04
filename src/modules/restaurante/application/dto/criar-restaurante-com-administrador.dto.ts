import { IsString, IsEmail, MinLength, IsNotEmpty, Matches } from 'class-validator';

export class CriarRestauranteComAdministradorDto {
  @IsString()
  @IsNotEmpty()
  nomeRestaurante: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{14}$/, { message: 'CNPJ deve ter exatamente 14 dígitos' })
  cnpj: string;

  @IsString()
  @IsNotEmpty()
  endereco: string;

  @IsString()
  @IsNotEmpty()
  nomeAdministrador: string;

  @IsEmail()
  emailAdministrador: string;

  @IsString()
  @MinLength(6)
  senhaAdministrador: string;
}
