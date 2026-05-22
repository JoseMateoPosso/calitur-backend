import { Controller, Post, Body, Get, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './auth.guard'; // Importamos a nuestro guardia de autenticación

@Controller('auth') // Ruta base: http://localhost:3000/auth
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async register(@Body() registerDto: { name: string; email: string; password: string }) {
        return this.authService.register(
            registerDto.name,
            registerDto.email,
            registerDto.password
        );
    }

    @Post('login') // Ruta final: http://localhost:3000/auth/login
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto.email, loginDto.password);
    }

    // Ruta protegida: Solo accesible con un token válido
    @UseGuards(AuthGuard)
    @Get('profile')
    async getProfile(@Request() request) {
        // Retornamos el payload que el Guardián incrustó en la petición
        return request.user;
    }

    // Solicitar enlace de recuperación
    @Post('forgot-password')
    @HttpCode(HttpStatus.OK)
    async forgotPassword(@Body('email') email: string) {
        return this.authService.forgotPassword(email);
    }

    // Guardar la nueva contraseña usando el token
    @Post('reset-password')
    @HttpCode(HttpStatus.OK)
    async resetPassword(
        @Body('token') token: string,
        @Body('newPassword') newPassword: string,
    ) {
        return this.authService.resetPassword(token, newPassword);
    }
}