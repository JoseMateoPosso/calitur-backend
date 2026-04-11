import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { AuthGuard } from '../auth/auth.guard';
import { AdminGuard } from '../auth/admin.guard'; // 👈 Importamos nuestro nuevo escudo

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    // PÚBLICO: Cualquier persona puede ver las categorías
    @Get()
    findAll() {
        return this.categoriesService.findAll();
    }

    // PROTEGIDO: Solo ADMINS pueden crear
    @UseGuards(AuthGuard, AdminGuard)
    @Post()
    create(@Body() data: { name: string }) {
        return this.categoriesService.create(data);
    }

    // PROTEGIDO: Solo ADMINS pueden editar
    @UseGuards(AuthGuard, AdminGuard)
    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() data: { name: string }
    ) {
        return this.categoriesService.update(id, data);
    }

    // PROTEGIDO: Solo ADMINS pueden borrar
    @UseGuards(AuthGuard, AdminGuard)
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.categoriesService.remove(id);
    }
}