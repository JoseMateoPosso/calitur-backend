import { Controller, Post, Body, Get, Param, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('reviews')
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) { }

    // PROTEGIDO: Solo los usuarios con token pueden dejar una opinión
    @UseGuards(AuthGuard)
    @Post()
    createReview(@Request() req, @Body() createReviewDto: CreateReviewDto) {
        // Extraemos el ID del usuario del token de forma segura
        const userId = req.user.sub;

        return this.reviewsService.createReview(userId, createReviewDto);
    }

    // PÚBLICO: Cualquiera puede ver las reseñas de un lugar
    // Ruta: http://localhost:3000/reviews/spot/1
    @Get('spot/:spotId')
    getReviewsBySpot(@Param('spotId', ParseIntPipe) spotId: number) {
        return this.reviewsService.getReviewsBySpot(spotId);
    }
}