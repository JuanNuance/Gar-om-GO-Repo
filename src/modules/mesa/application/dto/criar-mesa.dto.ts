import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CriarMesaDto {
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  numero: number;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  capacidade: number;

  @IsString()
  @IsNotEmpty()
  restauranteId: string;
}
