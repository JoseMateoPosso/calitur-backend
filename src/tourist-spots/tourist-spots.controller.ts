import { Controller, Get, Post, Body, Param, ParseIntPipe, BadRequestException, Patch, Delete, UseGuards, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { TouristSpotsService } from './tourist-spots.service';
import { CreateTouristSpotDto } from './dto/create-tourist-spot.dto';
import { UpdateTouristSpotDto } from './dto/update-tourist-spot.dto';
import { AuthGuard } from '../auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('tourist-spots')
export class TouristSpotsController {
  constructor(private readonly touristSpotsService: TouristSpotsService) { }

  @UseGuards(AuthGuard)
  @Post()
  createSpot(@Body() data: CreateTouristSpotDto) {
    return this.touristSpotsService.createSpot(data);
  }

  @Get()
  findAllSpots(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('sort') category?: string,
  ) {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 10;

    if (isNaN(pageNumber) || pageNumber < 1) {
      throw new BadRequestException('El número de página debe ser un entero positivo');
    }
    return this.touristSpotsService.findAllSpots(pageNumber, limitNumber, search, category);
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

  @UseGuards(AuthGuard)
  @Post(':id/image')
  @UseInterceptors(FileInterceptor('file')) // Atrapa el archivo que venga con la llave 'file'
  uploadImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    //console.log("📦 Archivo recibido en el controlador:", file);
    if (!file) {
      throw new BadRequestException('Asegúrate de enviar una imagen válida');
    }
    return this.touristSpotsService.uploadSpotImage(id, file);
  }
}