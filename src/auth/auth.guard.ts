import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }

    // Método que se ejecuta antes de cada controlador protegido para verificar el token
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException('Acceso denegado: No se proporcionó un token');
        }

        try {
            // Verificamos si el token es real y no ha expirado
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET || 'clave_de_respaldo',
            });

            // Si es válido, incrustamos los datos del usuario en la petición
            // para que el controlador pueda saber quién está haciendo la petición
            request['user'] = payload;
        } catch {
            throw new UnauthorizedException('Acceso denegado: Token inválido o expirado');
        }

        return true;
    }

    // Método auxiliar para sacar el token de la cabecera "Authorization: Bearer <token>"
    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}