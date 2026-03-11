import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginDto {
    @IsEmail({}, { message: 'El correo electrónico no es válido' })
    email: string;

    @IsString()
    @IsNotEmpty({ message: 'La contraseña es obligatoria' })
    password: string;

    @IsString()
    @IsOptional({ message: 'El nombre es obligatorio' })
    name: string;
}