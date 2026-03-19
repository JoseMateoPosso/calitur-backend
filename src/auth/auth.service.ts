import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    async login(email: string, pass: string) {
        // Buscamos si el usuario existe en la base de datos
        const user = await this.usersService.findUserByEmail(email);

        // Si no existe, lanzamos un error 401 (No autorizado)
        if (!user) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        // Comparamos la contraseña encriptada
        const isMatch = await bcrypt.compare(pass, user.passwordHash);

        if (!isMatch) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        // Creamos el payload para el JWT (puede contener cualquier información que queramos, pero no debe ser sensible)
        const payload = { email: user.email, sub: user.id, role: user.role };

        // Firmamos el JWT con la clave secreta y lo devolvemos
        const token = this.jwtService.sign(payload);

        // Si todo está bien, quitamos la contraseña y devolvemos el usuario
        const { passwordHash, ...result } = user;

        return {
            message: 'Login exitoso',
            access_token: token,
            user: result,
        };
    }
}