import { Controller, Get, Post, Body, Param, ParseIntPipe, BadRequestException, Patch, Delete, UseGuards, Query, UseInterceptors, UploadedFile, Request, Headers } from '@nestjs/common';
import { TouristSpotsService } from './tourist-spots.service';
import { CreateTouristSpotDto } from './dto/create-tourist-spot.dto';
import { UpdateTouristSpotDto } from './dto/update-tourist-spot.dto';
import { AuthGuard } from '../auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtService } from '@nestjs/jwt'; // 👈 Importamos el JwtService

@Controller('tourist-spots')
export class TouristSpotsController {
  // 👈 Inyectamos JwtService en el constructor
  constructor(
    private readonly touristSpotsService: TouristSpotsService,
    private readonly jwtService: JwtService
  ) { }

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
    @Query('category') category?: string,
    @Headers('authorization') authHeader?: string, // 👈 Atrapamos el header de autorización
  ) {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 10;

    if (isNaN(pageNumber) || pageNumber < 1) {
      throw new BadRequestException('El número de página debe ser un entero positivo');
    }

    // 🎯 LÓGICA DE EXTRACCIÓN DEL TOKEN (Silenciosa)
    let userId: number | undefined = undefined;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        // Intentamos decodificar el token para sacar el ID
        const payload = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
        userId = payload.sub;
      } catch (error) {
        // Si el token expiró o está mal formado, no hacemos nada. 
        // El usuario será tratado como visitante (userId = undefined)
      }
    }

    // 👈 Le pasamos el userId al servicio como 5to parámetro
    return this.touristSpotsService.findAllSpots(pageNumber, limitNumber, search, category, userId);
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
    @Headers('authorization') authHeader?: string, // 👈 Atrapamos el token
  ) {
    let userId: number | undefined = undefined;

    // Decodificamos silenciosamente
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const payload = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
        userId = payload.sub;
      } catch (error) {
        // Ignoramos si expiró
      }
    }

    return this.touristSpotsService.findOneSpot(id, userId); // 👈 Pasamos el userId
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
    @Body() data: UpdateTouristSpotDto,
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
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Asegúrate de enviar una imagen válida');
    }
    return this.touristSpotsService.uploadSpotImage(id, file);
  }

  @UseGuards(AuthGuard)
  @Post(':id/favorite')
  async toggleFavorite(
    @Request() req,
    @Param('id') spotId: string,
  ) {
    const userId = req.user.sub;
    return this.touristSpotsService.toggleFavorite(+spotId, userId);
  }
}