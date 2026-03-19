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

    async register(name: string, email: string, pass: string) {
        // VALIDACIÓN si el correo ya está registrado (Seguridad ISO 25010)
        const existingUser = await this.usersService.findUserByEmail(email);

        if (existingUser) {
            // Lanzamos un 409 Conflict o 400 Bad Request
            throw new UnauthorizedException('El correo electrónico ya está registrado.');
        }

        // Generamos un salt y encriptamos la contraseña usando bcrypt
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(pass, salt);

        // Creamos el usuario en la base de datos con la contraseña encriptada
        const newUser: any = await this.usersService.createUser({
            name,
            email,
            passwordHash: hashedPassword,
        });

        const { passwordHash, ...result } = newUser;

        return {
            message: 'Usuario registrado exitosamente',
            user: result
        };
    }

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