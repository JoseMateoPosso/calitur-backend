import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Query, DefaultValuePipe } from '@nestjs/common'; import { UsersService } from './users.service';
import { Prisma } from '@prisma/client';
import { AuthGuard } from '../auth/auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  createUser(@Body() data: Prisma.UserCreateInput) {
    return this.usersService.createUser(data);
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Get()
  findAllUsers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.usersService.findAllUsers(page, limit);
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Patch(':id/role')
  updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body('role') role: 'ADMIN' | 'USER'
  ) {
    return this.usersService.updateRole(id, role);
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}