import { IsInt, IsNotEmpty, IsUUID, Min } from 'class-validator';

export class CriarMesaDto {
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  numero: number;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  capacidade: number;

  @IsUUID()
  @IsNotEmpty()
  restauranteId: string;
}
