import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Crear categorías
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Pintura Contemporánea',
        description: 'Obras de arte contemporáneo de artistas emergentes y establecidos',
        image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
        artworkCount: 0
      }
    }),
    prisma.category.create({
      data: {
        name: 'Escultura',
        description: 'Esculturas únicas en diversos materiales y estilos',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
        artworkCount: 0
      }
    }),
    prisma.category.create({
      data: {
        name: 'Fotografía',
        description: 'Fotografía artística y documental de alta calidad',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
        artworkCount: 0
      }
    }),
    prisma.category.create({
      data: {
        name: 'Arte Digital',
        description: 'Arte digital innovador y NFT de artistas digitales',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
        artworkCount: 0
      }
    })
  ]);

  console.log('✅ Categorías creadas');

  // Crear usuarios
  const hashedPassword = await bcrypt.hash('user123', 12);
  const adminPassword = await bcrypt.hash('admin123', 12);

  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'maria.garcia@email.com',
        name: 'María García',
        password: hashedPassword,
        role: 'BUYER',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        phone: '+34 600 123 456',
        address: 'Madrid, España',
        verified: true,
        balance: 25000,
        totalBids: 15,
        totalPurchases: 3
      }
    }),
    prisma.user.create({
      data: {
        email: 'carlos.rodriguez@email.com',
        name: 'Carlos Rodríguez',
        password: hashedPassword,
        role: 'SELLER_REQUEST',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        phone: '+34 600 789 012',
        address: 'Barcelona, España',
        verified: true,
        balance: 15000,
        totalBids: 8,
        totalPurchases: 0
      }
    }),
    prisma.user.create({
      data: {
        email: 'ana.lopez@email.com',
        name: 'Ana López',
        password: hashedPassword,
        role: 'BUYER',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        phone: '+34 600 345 678',
        address: 'Valencia, España',
        verified: false,
        balance: 5000,
        totalBids: 3,
        totalPurchases: 1
      }
    }),
    prisma.user.create({
      data: {
        email: 'admin@artbiddo.com',
        name: 'Administrador Principal',
        password: adminPassword,
        role: 'ADMIN',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        verified: true,
        balance: 0
      }
    }),
    prisma.user.create({
      data: {
        email: 'moderator@artbiddo.com',
        name: 'Moderador de Subastas',
        password: adminPassword,
        role: 'MODERATOR',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        verified: true,
        balance: 0
      }
    })
  ]);

  console.log('✅ Usuarios creados');

  // Crear obras de arte
  const artworks = await Promise.all([
    prisma.artwork.create({
      data: {
        title: 'Abstracción Nocturna',
        artist: 'Elena Martínez',
        description: 'Una obra maestra del expresionismo abstracto que captura la esencia de la noche urbana. Los trazos gestuales y la paleta de colores oscuros crean una atmósfera misteriosa y contemplativa.',
        categoryId: categories[0].id,
        year: 2023,
        medium: 'Óleo sobre lienzo',
        dimensions: '120 x 80 cm',
        image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=400&fit=crop',
        startingPrice: 2500,
        currentPrice: 4200,
        estimatedValue: 6000,
        status: 'ACTIVE',
        endDate: new Date('2024-02-15T20:00:00'),
        totalBids: 8,
        views: 156,
        favorites: 12
      }
    }),
    prisma.artwork.create({
      data: {
        title: 'Mujer en el Espejo',
        artist: 'Carlos Rodríguez',
        description: 'Retrato íntimo que explora la dualidad del ser humano. La técnica mixta combina acrílico y collage para crear texturas únicas que invitan a la reflexión.',
        categoryId: categories[0].id,
        year: 2022,
        medium: 'Acrílico y collage sobre lienzo',
        dimensions: '100 x 100 cm',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
        startingPrice: 1800,
        currentPrice: 3100,
        estimatedValue: 4500,
        status: 'ACTIVE',
        endDate: new Date('2024-02-10T18:00:00'),
        totalBids: 12,
        views: 203,
        favorites: 18
      }
    }),
    prisma.artwork.create({
      data: {
        title: 'Formas Orgánicas',
        artist: 'Ana López',
        description: 'Escultura en bronce que celebra la belleza de las formas naturales. Cada curva y volumen está cuidadosamente trabajado para crear una pieza única.',
        categoryId: categories[1].id,
        year: 2021,
        medium: 'Bronce patinado',
        dimensions: '60 x 40 x 30 cm',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop',
        startingPrice: 3500,
        currentPrice: 5800,
        estimatedValue: 7500,
        status: 'ACTIVE',
        endDate: new Date('2024-02-20T22:00:00'),
        totalBids: 6,
        views: 89,
        favorites: 7
      }
    }),
    prisma.artwork.create({
      data: {
        title: 'Luz Urbana',
        artist: 'Miguel Fernández',
        description: 'Fotografía artística que captura la energía vibrante de la ciudad por la noche. La composición y el juego de luces crean una narrativa visual única.',
        categoryId: categories[2].id,
        year: 2023,
        medium: 'Fotografía digital',
        dimensions: '80 x 60 cm',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
        startingPrice: 1200,
        currentPrice: 2100,
        estimatedValue: 2800,
        status: 'ACTIVE',
        endDate: new Date('2024-02-25T19:00:00'),
        totalBids: 15,
        views: 267,
        favorites: 23
      }
    })
  ]);

  console.log('✅ Obras de arte creadas');

  // Crear algunas pujas de ejemplo
  const bids = await Promise.all([
    prisma.bid.create({
      data: {
        amount: 4200,
        artworkId: artworks[0].id,
        userId: users[0].id, // María García
        status: 'ACTIVE'
      }
    }),
    prisma.bid.create({
      data: {
        amount: 3800,
        artworkId: artworks[0].id,
        userId: users[2].id, // Ana López
        status: 'OUTBID'
      }
    }),
    prisma.bid.create({
      data: {
        amount: 3100,
        artworkId: artworks[1].id,
        userId: users[0].id,
        status: 'ACTIVE'
      }
    }),
    prisma.bid.create({
      data: {
        amount: 2800,
        artworkId: artworks[1].id,
        userId: users[2].id,
        status: 'OUTBID'
      }
    })
  ]);

  console.log('✅ Pujas de ejemplo creadas');

  // Actualizar contadores de categorías
  await Promise.all([
    prisma.category.update({
      where: { id: categories[0].id },
      data: { artworkCount: 2 }
    }),
    prisma.category.update({
      where: { id: categories[1].id },
      data: { artworkCount: 1 }
    }),
    prisma.category.update({
      where: { id: categories[2].id },
      data: { artworkCount: 1 }
    })
  ]);

  console.log('✅ Contadores de categorías actualizados');

  console.log('🎉 Seed completado exitosamente!');
  console.log('');
  console.log('📊 Resumen:');
  console.log(`- ${categories.length} categorías`);
  console.log(`- ${users.length} usuarios`);
  console.log(`- ${artworks.length} obras de arte`);
  console.log(`- ${bids.length} pujas de ejemplo`);
  console.log('');
  console.log('🔑 Credenciales de acceso:');
  console.log('Admin: admin@artbiddo.com / admin123');
  console.log('Moderador: moderator@artbiddo.com / admin123');
  console.log('Comprador: maria.garcia@email.com / user123');
  console.log('Vendedor: carlos.rodriguez@email.com / user123');
  console.log('Comprador: ana.lopez@email.com / user123');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
