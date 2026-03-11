import { PartialType } from '@nestjs/mapped-types';
import { CreateTouristSpotDto } from './create-tourist-spot.dto';

// Creamos un DTO de actualización que hereda de CreateTouristSpotDto pero con todas las propiedades opcionales
export class UpdateTouristSpotDto extends PartialType(CreateTouristSpotDto) {}