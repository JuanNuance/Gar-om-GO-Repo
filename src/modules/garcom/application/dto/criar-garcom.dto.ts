import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';

export class CriarGarcomDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
