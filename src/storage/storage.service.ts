import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class StorageService {
    private supabase: SupabaseClient;

    constructor() {
        // Inicializamos la conexión a Supabase usando el .env
        this.supabase = createClient(
            process.env.SUPABASE_URL || '',
            process.env.SUPABASE_KEY || '',
        );
    }

    // Este método recibe el archivo crudo desde el Controlador
    async uploadImage(file: Express.Multer.File): Promise<string> {
        try {
            // Inventamos un nombre único para que no se sobreescriban fotos (ej. 167890123-foto_cristo.jpg)
            const uniqueName = `${Date.now()}-${file.originalname.replace(/\s/g, '_')}`;

            // Subimos la foto al bucket "tourist-spots"
            const { data, error } = await this.supabase.storage
                .from('tourist-spots')
                .upload(uniqueName, file.buffer, {
                    contentType: file.mimetype,
                    upsert: false,
                });

            if (error) {
                throw new InternalServerErrorException('Error de Supabase: ' + error.message);
            }

            // Le pedimos a Supabase que nos devuelva la URL pública de esa foto
            const { data: publicUrlData } = this.supabase.storage
                .from('tourist-spots')
                .getPublicUrl(data.path);

            // Devolvemos solo el texto de la URL (ej. "https://tu-proyecto.../tourist-spots/167890...jpg")
            return publicUrlData.publicUrl;

        } catch (err) {
            // Si el error ya es una excepción nuestra, la dejamos pasar tal cual
            if (err instanceof InternalServerErrorException) {
                throw err;
            }

            console.error('🔥 ERROR DESCONOCIDO:', err);
            throw new InternalServerErrorException(`Fallo crítico: ${err.message}`);
        }
    }
}