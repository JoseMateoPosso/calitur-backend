import { IsString, IsInt, Min, Max, IsNotEmpty } from 'class-validator';

export class CreateReviewDto {
    // El texto de la opinión
    @IsString({ message: 'La reseña debe ser un texto' })
    @IsNotEmpty({ message: 'El texto de la reseña no puede estar vacío' })
    text: string;

    // Calificación: Obligatorio que sea un número entero entre 1 y 5
    @IsInt({ message: 'La calificación debe ser un número entero' })
    @Min(1, { message: 'La calificación mínima es 1 estrella' })
    @Max(5, { message: 'La calificación máxima es 5 estrellas' })
    rating: number;

    // El ID del sitio turístico al que se le hace la reseña
    @IsInt({ message: 'El ID del sitio turístico debe ser un número' })
    @IsNotEmpty({ message: 'Debes especificar a qué sitio le haces la reseña' })
    spotId: number;

    // ¡OJO! No pedimos el userId aquí, lo sacaremos del Token de forma segura.
}