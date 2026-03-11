import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { Prisma } from '@prisma/client';
//import { ApiExcludeController } from '@nestjs/swagger';

//@ApiExcludeController() // Excluye este controlador de la documentación de Swagger
@Controller('users') // La ruta ahora será http://localhost:3000/users
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Endpoint para registrar un usuario
  @Post()
  createUser(@Body() data: Prisma.UserCreateInput) {
    return this.usersService.createUser(data);
  }

  // Endpoint para listar los usuarios
  @Get()
  findAllUsers() {
    return this.usersService.findAllUsers();
  }
}