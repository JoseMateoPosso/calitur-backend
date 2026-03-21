import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
    constructor(private prisma: PrismaService) { }

    // Obtiene todas las categorías ordenadas alfabéticamente
    async findAll() {
        return this.prisma.category.findMany({
            orderBy: { name: 'asc' },
        });
    }
}