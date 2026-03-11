import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateTouristSpotDto {
  // Personalizamos los mensajes en español para el frontend
  @IsString({ message: 'El nombre debe ser un texto válido' })
  @IsNotEmpty({ message: 'El nombre del sitio turístico es obligatorio' })
  name: string;

  @IsString({ message: 'La descripción debe ser un texto válido' })
  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  description: string;

  // Para IsNumber, el primer parámetro son opciones (lo dejamos vacío {}) y el segundo es el mensaje
  @IsNumber({}, { message: 'La latitud debe ser un número' })
  @IsOptional()
  latitude?: number;

  @IsNumber({}, { message: 'La longitud debe ser un número' })
  @IsOptional()
  longitude?: number;

  @IsNumber({}, { message: 'El precio debe ser un valor numérico' })
  @IsOptional()
  price?: number;

  @IsString({ message: 'El horario debe ser un texto válido' })
  @IsOptional()
  schedule?: string;
}