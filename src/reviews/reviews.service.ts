import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
    constructor(private prisma: PrismaService) { }

    // Crear reseña
    async createReview(userId: number, data: CreateReviewDto) {
        const spotExists = await this.prisma.touristSpot.findUnique({
            where: { id: data.spotId },
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
                userId: userId,
            },
        });
    }

    // Obtener reseñas de un sitio (Público)
    async getReviewsBySpot(spotId: number) {
        return this.prisma.review.findMany({
            where: { spotId },
            include: {
                user: { select: { name: true } },
            },
        });
    }

    // Listar TODAS las reseñas con paginación (Para Admin)
    async findAll(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            this.prisma.review.findMany({
                skip,
                take: limit,
                include: {
                    user: { select: { name: true, email: true } },
                    spot: { select: { name: true } } // Traemos el nombre del sitio
                },
                orderBy: { createdAt: 'desc' }
            }),
            this.prisma.review.count()
        ]);

        return {
            data,
            meta: {
                total,
                currentPage: page,
                lastPage: Math.ceil(total / limit),
                limit,
            }
        };
    }

    // Eliminar reseña (Moderación)
    async remove(id: number) {
        // Verificamos si existe primero
        const reviewExists = await this.prisma.review.findUnique({ where: { id } });
        if (!reviewExists) throw new NotFoundException('La reseña no existe');

        return this.prisma.review.delete({
            where: { id }
        });
    }
}