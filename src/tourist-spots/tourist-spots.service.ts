import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TouristSpotsService {
    constructor(private prisma: PrismaService) { }

    // Método para crear un sitio
    async createSpot(data: Prisma.TouristSpotCreateInput) {
        return this.prisma.touristSpot.create({
            data,
        });
    }

    // Método para obtener todos los sitios
    async findAllSpots() {
        return this.prisma.touristSpot.findMany();
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
}