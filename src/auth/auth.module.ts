import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true, // Disponible en todo el backend
      secret: process.env.JWT_SECRET || 'clave_de_respaldo', // Leemos la clave del .env
      signOptions: { expiresIn: '1d' }, // El pase VIP caduca en 1 día
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}