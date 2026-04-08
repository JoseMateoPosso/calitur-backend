import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class TouristSpotsService {
    constructor(private prisma: PrismaService, private storageService: StorageService) { }

    // Método para crear un sitio
    async createSpot(data: Prisma.TouristSpotCreateInput) {
        return this.prisma.touristSpot.create({
            data,
        });
    }

    // Método para obtener todos los sitios
    async findAllSpots(page: number = 1, limit: number = 10, search?: string, category?: string) {
        // 1. Matemáticas de paginación
        const skip = (page - 1) * limit;

        // Construimos el filtro de búsqueda si el usuario envió texto y mantiene la búsqueda insensible a mayúsculas/minúsculas
        const where: Prisma.TouristSpotWhereInput = {}

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (category) {
            where.categories = {
                some: {
                    id: Number(category)
                }
            };
        }

        // Hacemos ambas consultas en paralelo: una para obtener los datos paginados y otra para contar el total de resultados que coinciden con el filtro (sin paginar)
        const [data, total] = await Promise.all([
            this.prisma.touristSpot.findMany({
                where: where,
                skip: skip,
                take: limit,
                include: {
                    categories: true, // Incluimos las categorías para que el Frontend pueda mostrar esa información sin hacer consultas adicionales
                },
                orderBy: { id: 'asc' }, // Los ordenamos por ID para que no salten
            }),
            this.prisma.touristSpot.count({ where: where }),
        ]);

        // 4. Calculamos la última página para ayudarle al Frontend
        const lastPage = Math.ceil(total / limit);

        // 5. Devolvemos la información estructurada profesionalmente
        return {
            data,
            meta: {
                total,
                currentPage: page,
                lastPage,
                limit,
            },
        };
    }

    // Método para obtener un sitio por su ID
    async findOneSpot(id: number) {
        const spot = await this.prisma.touristSpot.findUnique({
            where: { id },
        });

        // Si Prisma no encuentra nada, devuelve null. Lanzamos un error 404.
        if (!spot) {
            throw new NotFoundException(`El sitio turístico con ID ${id} no fue encontrado`);
        }

        return spot;
    }

    // Método para actualizar un sitio por su ID
    async updateSpot(id: number, data: Prisma.TouristSpotUpdateInput) {
        // Reutilizamos findOneSpot para comprobar que exista (y lanzar el 404 si no)
        await this.findOneSpot(id);

        return this.prisma.touristSpot.update({
            where: { id },
            data,
        });
    }

    // Método para eliminar un sitio por su ID
    async deleteSpot(id: number) {
        // Reutilizamos findOneSpot para comprobar que exista (y lanzar el 404 si no)
        await this.findOneSpot(id);

        return this.prisma.touristSpot.delete({
            where: { id },
        });
    }

    //Método para subir la imagen y actualizar la base de datos
    async uploadSpotImage(id: number, file: Express.Multer.File) {
        //  Verificamos que el sitio exista
        const spot = await this.prisma.touristSpot.findUnique({ where: { id } });
        if (!spot) throw new NotFoundException('Sitio turístico no encontrado');

        // Subimos el archivo a Supabase usando nuestro helper
        const imageUrl = await this.storageService.uploadImage(file);

        // Actualizamos el sitio en la base de datos con la nueva URL
        return this.prisma.touristSpot.update({
            where: { id },
            data: { imageUrl },
        });
    }
}