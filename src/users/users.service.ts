import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  // Inyectamos Prisma para acceder a la base de datos
  constructor(private prisma: PrismaService) { }

  // Método para crear un nuevo usuario
  async createUser(data: Prisma.UserCreateInput) {
    const saltRounds = 10;
    // Encriptamos la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(data.passwordHash, saltRounds);
    const userData = {
      ...data,
      passwordHash: hashedPassword,
    };

    // Guardamos el usuario en una variable
    const newUser = await this.prisma.user.create({
      data: userData,
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