import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
    constructor(private prisma: PrismaService) { }

    // Obtiene todas las categorías
    async findAll() {
        return this.prisma.category.findMany({
            orderBy: { name: 'asc' },
        });
    }

    // Crea una nueva categoría
    async create(data: { name: string }) {
        return this.prisma.category.create({
            data: { name: data.name },
        });
    }

    // Actualiza una categoría existente
    async update(id: number, data: { name: string }) {
        const categoryExists = await this.prisma.category.findUnique({ where: { id } });
        if (!categoryExists) {
            throw new NotFoundException(`La categoría con ID ${id} no existe.`);
        }

        return this.prisma.category.update({
            where: { id },
            data: { name: data.name },
        });
    }

    // Elimina una categoría
    async remove(id: number) {
        const categoryExists = await this.prisma.category.findUnique({ where: { id } });
        if (!categoryExists) {
            throw new NotFoundException(`La categoría con ID ${id} no existe.`);
        }

        return this.prisma.category.delete({
            where: { id },
        });
    }
}