import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
    constructor(private prisma: PrismaService) { }

    // Método para crear una reseña uniendo el ID del usuario seguro
    async createReview(userId: number, data: CreateReviewDto) {
        // Verificamos que el sitio turístico exista
        const spotExists = await this.prisma.touristSpot.findUnique({
            where: {
                id: data.spotId,
            },
        });

        
        if (!spotExists) {
            throw new NotFoundException('El sitio turístico al que intentas hacer la reseña no existe');
        }

        const userAlreadyReviewed = await this.prisma.review.findFirst({
            where: {
                spotId: data.spotId,
                userId: userId,
            },
        });

        if (userAlreadyReviewed) {
            throw new NotFoundException('Ya has hecho una reseña para este sitio turístico');
        }

        return this.prisma.review.create({
            data: {
                text: data.text,
                rating: data.rating,
                spotId: data.spotId,
                userId: userId, // Este ID viene del token, ¡es 100% real!
            },
        });
    }

    // Método para obtener todas las reseñas de un sitio en específico
    async getReviewsBySpot(spotId: number) {
        return this.prisma.review.findMany({
            where: { spotId },
            include: {
                // Prisma: Traemos el nombre del autor de la reseña
                user: {
                    select: { name: true }, // Solo el nombre, por privacidad no enviamos el email ni el password
                },
            },
        });
    }
}