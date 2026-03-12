import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Iniciando el sembrado de sitios turísticos en Cali...');

    const caliSpots = [
        {
            name: 'Cristo Rey',
            description: 'Monumento de 26 metros de altura ubicado en el Cerro de los Cristales. Ofrece la mejor vista panorámica de la ciudad.',
            latitude: 3.4357,
            longitude: -76.5647,
            price: 0,
            schedule: 'Lunes a Domingo: 8:00 AM - 11:00 PM',
        },
        {
            name: 'Bulevar del Río',
            description: 'Hermoso corredor peatonal a orillas del río Cali. Perfecto para caminar, sentir la brisa caleña y tomar algo al atardecer.',
            latitude: 3.4533,
            longitude: -76.5361,
            price: 0,
            schedule: 'Abierto 24 horas',
        },
        {
            name: 'Barrio San Antonio',
            description: 'El barrio colonial más famoso de Cali. Famoso por sus calles empedradas, la capilla en la colina, las macetas y la gastronomía.',
            latitude: 3.4475,
            longitude: -76.5416,
            price: 0,
            schedule: 'Abierto 24 horas',
        },
        {
            name: 'Zoológico de Cali',
            description: 'Considerado uno de los mejores zoológicos de América Latina, enfocado en la conservación de la biodiversidad colombiana.',
            latitude: 3.4497,
            longitude: -76.5575,
            price: 28000,
            schedule: 'Lunes a Domingo: 9:00 AM - 4:30 PM',
        },
        {
            name: 'Cerro de las Tres Cruces',
            description: 'Destino deportivo por excelencia de los caleños. Una caminata exigente con una gran recompensa: jugo de naranja y una vista espectacular.',
            latitude: 3.4688,
            longitude: -76.5463,
            price: 0,
            schedule: 'Lunes a Domingo: 6:00 AM - 1:00 PM',
        },
        {
            name: 'Museo de la Salsa Jairo Varela',
            description: 'Un homenaje al fundador del Grupo Niche. Aquí puedes conocer la historia de la salsa que le dio a Cali su identidad mundial.',
            latitude: 3.4544,
            longitude: -76.5338,
            price: 0,
            schedule: 'Lunes a Sábado: 10:00 AM - 6:00 PM',
        },
        {
            name: 'Ecoparque Río Pance',
            description: 'El plan de domingo tradicional caleño: ir a bañarse al río Pance y comer sancocho de gallina hecho en leña.',
            latitude: 3.3283,
            longitude: -76.5342,
            price: 0,
            schedule: 'Lunes a Domingo: 6:00 AM - 6:00 PM',
        },
        {
            name: 'Galería Alameda',
            description: 'El corazón gastronómico de Cali. Un mercado vibrante donde encuentras mariscos del Pacífico, frutas exóticas y comida típica.',
            latitude: 3.4385,
            longitude: -76.5350,
            price: 0,
            schedule: 'Lunes a Domingo: 5:00 AM - 4:00 PM',
        },
        {
            name: 'Iglesia La Ermita',
            description: 'Iglésia de estilo gótico inspirada en la Catedral de Ulm en Alemania. Uno de los símbolos arquitectónicos más fotografiados de la ciudad.',
            latitude: 3.4528,
            longitude: -76.5323,
            price: 0,
            schedule: 'Lunes a Domingo: 7:00 AM - 6:00 PM',
        },
        {
            name: 'Parque del Perro',
            description: 'Zona rosa en el barrio San Fernando. Epicentro de restaurantes, bares y vida nocturna con una gran oferta gastronómica.',
            latitude: 3.4308,
            longitude: -76.5444,
            price: 0,
            schedule: 'Abierto 24 horas',
        },
        {
            name: 'Monumento a Sebastián de Belalcázar',
            description: 'Estatua de bronce del fundador de la ciudad, ubicada en un mirador ideal para sentir la famosa "brisa caleña".',
            latitude: 3.4477,
            longitude: -76.5432,
            price: 0,
            schedule: 'Abierto 24 horas',
        },
        {
            name: 'Museo La Tertulia',
            description: 'Museo de arte moderno con cinemateca y teatro al aire libre. Un espacio cultural hermoso junto al río Cali.',
            latitude: 3.4519,
            longitude: -76.5445,
            price: 15000,
            schedule: 'Martes a Domingo: 10:00 AM - 7:00 PM',
        }
    ];

    // createMany inserta todo el arreglo de golpe en la base de datos
    const result = await prisma.touristSpot.createMany({
        data: caliSpots,
        skipDuplicates: true, // Si ya existe alguno con el mismo ID, lo ignora para no dar error
    });

    console.log(`✅ ¡Éxito! Se han sembrado ${result.count} sitios turísticos en CaliTur.`);
}

main()
    .catch((e) => {
        console.error('❌ Error sembrando la base de datos:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });