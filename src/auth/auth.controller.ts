import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './auth.guard'; // Importamos a nuestro guardia de autenticación

@Controller('auth') // Ruta base: http://localhost:3000/auth
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login') // Ruta final: http://localhost:3000/auth/login
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto.email, loginDto.password);
    }

    // Ruta protegida: Solo accesible con un token válido
    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Request() request) {
        // Retornamos el payload que el Guardián incrustó en la petición
        return request.user;
    }
}