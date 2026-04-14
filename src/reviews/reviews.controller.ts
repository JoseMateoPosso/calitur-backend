import { Controller, Post, Body, Get, Param, ParseIntPipe, UseGuards, Request, Delete, Query, DefaultValuePipe } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { AuthGuard } from '../auth/auth.guard';
import { AdminGuard } from '../auth/admin.guard'; // 👈 Importamos AdminGuard

@Controller('reviews')
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) { }

    // PROTEGIDO: Usuarios con token dejan opinión
    @UseGuards(AuthGuard)
    @Post()
    createReview(@Request() req, @Body() createReviewDto: CreateReviewDto) {
        const userId = req.user.sub;
        return this.reviewsService.createReview(userId, createReviewDto);
    }

    // PÚBLICO: Ver reseñas de un lugar
    @Get('spot/:spotId')
    getReviewsBySpot(@Param('spotId', ParseIntPipe) spotId: number) {
        return this.reviewsService.getReviewsBySpot(spotId);
    }

    // PROTEGIDO: Solo ADMINS ven todas las reseñas paginadas
    @UseGuards(AuthGuard, AdminGuard)
    @Get()
    findAll(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    ) {
        return this.reviewsService.findAll(page, limit);
    }

    // PROTEGIDO: Solo ADMINS pueden borrar (Moderar)
    @UseGuards(AuthGuard, AdminGuard)
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.reviewsService.remove(id);
    }
}