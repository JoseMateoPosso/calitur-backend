import { Controller, Get, Post, Body, Param, ParseIntPipe, BadRequestException, Patch, Delete, UseGuards } from '@nestjs/common';
import { TouristSpotsService } from './tourist-spots.service';
import { CreateTouristSpotDto } from './dto/create-tourist-spot.dto';
import { UpdateTouristSpotDto } from './dto/update-tourist-spot.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('tourist-spots')
export class TouristSpotsController {
  constructor(private readonly touristSpotsService: TouristSpotsService) { }

  @UseGuards(AuthGuard)
  @Post()
  createSpot(@Body() data: CreateTouristSpotDto) {
    return this.touristSpotsService.createSpot(data);
  }

  @Get()
  findAllSpots() {
    return this.touristSpotsService.findAllSpots();
  }

  @Get(':id')
  findOneSpot(
    @Param(
      'id',
      new ParseIntPipe({
        exceptionFactory: () =>
          new BadRequestException('El ID del sitio turístico debe ser un número válido'),
      }),
    )
    id: number,
  ) {
    return this.touristSpotsService.findOneSpot(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  updateSpot(
    @Param(
      'id',
      new ParseIntPipe({
        exceptionFactory: () =>
          new BadRequestException('El ID del sitio turístico debe ser un número válido'),
      }),
    )
    id: number,
    @Body() data: UpdateTouristSpotDto, // Reutilizamos el DTO de creación para la actualización
  ) {
    return this.touristSpotsService.updateSpot(id, data);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  deleteSpot(
    @Param(
      'id',
      new ParseIntPipe({
        exceptionFactory: () =>
          new BadRequestException('El ID del sitio turístico debe ser un número válido'),
      }),
    )
    id: number,
  ) {
    return this.touristSpotsService.deleteSpot(id);
  }
}