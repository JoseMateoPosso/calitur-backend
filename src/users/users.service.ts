import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async createUser(data: Prisma.UserCreateInput) {
    const newUser = await this.prisma.user.create({
      data: data,
    });
    const { passwordHash, ...result } = newUser;
    return result;
  }

  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findAllUsers(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        select: { id: true, name: true, email: true, role: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.user.count()
    ]);

    return {
      data,
      meta: {
        total,
        currentPage: page,
        lastPage: Math.ceil(total / limit),
        limit,
      }
    };
  }

  async updateRole(id: number, role: 'ADMIN' | 'USER') {
    return this.prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, name: true, role: true }
    });
  }

  async remove(id: number) {
    return this.prisma.user.delete({
      where: { id }
    });
  }
}