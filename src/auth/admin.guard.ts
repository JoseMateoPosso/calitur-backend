import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        // 1. Extraemos la petición
        const request = context.switchToHttp().getRequest();

        // 2. Obtenemos el usuario que el AuthGuard acaba de decodificar
        const user = request.user;

        // 3. Verificamos si existe y si su rol es ADMIN
        if (!user || user.role !== 'ADMIN') {
            throw new ForbiddenException('Acceso denegado: Se requieren privilegios de Administrador');
        }

        return true; // Si es admin, lo dejamos pasar
    }
}