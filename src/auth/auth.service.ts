import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private prisma: PrismaService
    ) { }

    async register(name: string, email: string, pass: string) {
        const existingUser = await this.usersService.findUserByEmail(email);

        if (existingUser) {
            throw new UnauthorizedException('El correo electrónico ya está registrado.');
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(pass, salt);

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
        const user = await this.usersService.findUserByEmail(email);

        if (!user) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        const isMatch = await bcrypt.compare(pass, user.passwordHash);

        if (!isMatch) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        const payload = { email: user.email, sub: user.id, role: user.role };
        const token = this.jwtService.sign(payload);

        const { passwordHash, ...result } = user;

        return {
            message: 'Login exitoso',
            access_token: token,
            user: result,
        };
    }

    // 🎯 1. Solicitar recuperación enviando HTML directo (Sin Template)
    async forgotPassword(email: string) {
        const user = await this.prisma.user.findUnique({ where: { email } });

        if (!user) return { message: 'Si el correo existe, recibirás un enlace de recuperación.' };

        // Generamos token de 32 bytes y expiración de 15 min
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpires = new Date(Date.now() + 15 * 60 * 1000);

        // Guardamos en la base de datos
        await this.prisma.user.update({
            where: { id: user.id },
            data: { resetToken, resetTokenExpires },
        });

        const resetLink = `${process.env.FRONTEND_URL}/resetear-password?token=${resetToken}`;

        // Llamada a la API de Brevo enviando HTML puro
        try {
            const response = await fetch(process.env.BREVO_API_URL!, {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'api-key': process.env.BREVO_API_KEY!,
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    sender: {
                        name: 'CaliTur Soporte',
                        email: process.env.BREVO_SENDER_EMAIL! // 👈 El correo verificado en Brevo
                    },
                    to: [
                        {
                            email: user.email,
                            name: user.name
                        }
                    ],
                    subject: 'Recupera tu contraseña de CaliTur',
                    htmlContent: `
                    <div style="font-family: sans-serif; color: #1c1917; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #fde8e8; border-radius: 12px;">
                        <h2 style="color: #c0392b;">Recuperación de contraseña</h2>
                        <p>Hola <strong>${user.name}</strong>,</p>
                        <p>Hemos recibido una solicitud para restablecer tu contraseña. Haz clic en el botón de abajo para crear una nueva:</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${resetLink}" style="display: inline-block; padding: 14px 28px; background-color: #c0392b; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold;">Restablecer Contraseña</a>
                        </div>
                        <p style="color: #7c3a2e; font-size: 14px;">Este enlace expirará en 15 minutos por tu seguridad.</p>
                        <hr style="border: none; border-top: 1px solid #fde8e8; margin: 20px 0;" />
                        <p style="font-size: 12px; color: #a8a29e;">Si no solicitaste este cambio, puedes ignorar y eliminar este correo de forma segura.</p>
                    </div>
                `
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error enviando HTML desde Brevo:", errorData);
            }
        } catch (error) {
            console.error("Error de red conectando con la API de Brevo:", error);
        }

        return { message: 'Si el correo existe, recibirás un enlace de recuperación.' };
    }
    
    // 🎯 2. Procesar la nueva contraseña
    async resetPassword(token: string, newPassword: string) {
        const user = await this.prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpires: { gt: new Date() }, // Debe ser mayor a la fecha actual
            },
        });

        if (!user) {
            throw new UnauthorizedException('El enlace es inválido o ha expirado. Por favor, solicita uno nuevo.');
        }

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(newPassword, salt);

        // Actualizamos clave y limpiamos tokens
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                passwordHash,
                resetToken: null,
                resetTokenExpires: null,
            },
        });

        return { message: 'Contraseña actualizada correctamente. Ya puedes iniciar sesión.' };
    }
}