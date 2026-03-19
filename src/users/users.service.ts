import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  // Inyectamos Prisma para acceder a la base de datos
  constructor(private prisma: PrismaService) { }

  // Método para crear un nuevo usuario
  async createUser(data: Prisma.UserCreateInput) {
    const newUser = await this.prisma.user.create({
      data: data,
    });
    // Separamos el passwordHash del resto de los datos (que guardamos en 'result')
    const { passwordHash, ...result } = newUser;

    // Solo devolvemos los datos seguros al frontend
    return result;
  }

  // Método para obtener todos los usuarios registrados
  async findAllUsers() {
    return this.prisma.user.findMany();
  }

  // Método para obtener un usuario por su correo electrónico
  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
}