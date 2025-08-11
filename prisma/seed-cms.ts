import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedCMS() {
  try {
    console.log('🌱 Poblando datos del CMS...');

    // Crear bloques de contenido para la página principal
    const contentBlocks = [
      {
        name: 'hero_title',
        title: 'Título Principal',
        content: 'ARTBIDDO',
        type: 'TEXT' as const,
        isActive: true
      },
      {
        name: 'hero_subtitle',
        title: 'Subtítulo Principal',
        content: 'Subastas de Arte Contemporáneo',
        type: 'TEXT' as const,
        isActive: true
      },
      {
        name: 'hero_description',
        title: 'Descripción Principal',
        content: 'Descubre obras únicas de artistas reconocidos en nuestra plataforma de subastas exclusiva.',
        type: 'TEXT' as const,
        isActive: true
      },
      {
        name: 'about_title',
        title: 'Título Sobre Nosotros',
        content: 'Sobre ArtBiddo',
        type: 'TEXT' as const,
        isActive: true
      },
      {
        name: 'about_description',
        title: 'Descripción Sobre Nosotros',
        content: 'ArtBiddo es la plataforma líder en subastas de arte contemporáneo en España. Conectamos a artistas, galerías y coleccionistas en un entorno digital seguro y profesional.',
        type: 'TEXT' as const,
        isActive: true
      },
      {
        name: 'stats_sales',
        title: 'Estadística de Ventas',
        content: '€2.8B',
        type: 'TEXT' as const,
        isActive: true
      },
      {
        name: 'stats_sales_label',
        title: 'Etiqueta Ventas',
        content: 'Ventas Anuales',
        type: 'TEXT' as const,
        isActive: true
      },
      {
        name: 'stats_founded',
        title: 'Año de Fundación',
        content: '2024',
        type: 'TEXT' as const,
        isActive: true
      },
      {
        name: 'stats_founded_label',
        title: 'Etiqueta Fundación',
        content: 'Año de Fundación',
        type: 'TEXT' as const,
        isActive: true
      }
    ];

    // Crear configuraciones del sitio
    const siteSettings = [
      {
        key: 'site_name',
        value: 'ArtBiddo',
        type: 'text',
        description: 'Nombre del sitio web',
        isPublic: true
      },
      {
        key: 'site_description',
        value: 'Plataforma de subastas de arte contemporáneo',
        type: 'text',
        description: 'Descripción del sitio web',
        isPublic: true
      },
      {
        key: 'contact_email',
        value: 'info@artbiddo.com',
        type: 'text',
        description: 'Email de contacto',
        isPublic: true
      },
      {
        key: 'contact_phone',
        value: '+34 91 123 4567',
        type: 'text',
        description: 'Teléfono de contacto',
        isPublic: true
      },
      {
        key: 'contact_address',
        value: 'Madrid, España - Plaza Mayor, 1',
        type: 'text',
        description: 'Dirección de contacto',
        isPublic: true
      },
      {
        key: 'social_facebook',
        value: 'https://facebook.com/artbiddo',
        type: 'text',
        description: 'Facebook',
        isPublic: true
      },
      {
        key: 'social_twitter',
        value: 'https://twitter.com/artbiddo',
        type: 'text',
        description: 'Twitter',
        isPublic: true
      },
      {
        key: 'social_instagram',
        value: 'https://instagram.com/artbiddo',
        type: 'text',
        description: 'Instagram',
        isPublic: true
      }
    ];

    // Crear contenido de páginas
    const pageContent = [
      {
        page: 'home',
        section: 'hero',
        title: 'ARTBIDDO',
        subtitle: 'Subastas de Arte Contemporáneo',
        description: 'Descubre obras únicas de artistas reconocidos',
        content: 'Únete a nuestra comunidad de arte y participa en subastas exclusivas con obras de la más alta calidad.',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=800&fit=crop',
        order: 1,
        isActive: true
      },
      {
        page: 'home',
        section: 'stats',
        title: 'Estadísticas',
        subtitle: 'Nuestros Números',
        description: 'Cifras que hablan por sí solas',
        content: 'Más de 2.8 mil millones en ventas anuales y una tradición de excelencia desde 2024.',
        order: 2,
        isActive: true
      },
      {
        page: 'home',
        section: 'about',
        title: 'Sobre ArtBiddo',
        subtitle: 'Nuestra Historia',
        description: 'Conectando arte y pasión',
        content: 'ArtBiddo es la plataforma líder en subastas de arte contemporáneo en España. Conectamos a artistas, galerías y coleccionistas en un entorno digital seguro y profesional.',
        image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=400&fit=crop',
        order: 3,
        isActive: true
      },
      {
        page: 'home',
        section: 'cta',
        title: 'Únete a ArtBiddo',
        subtitle: 'Comienza tu Viaje',
        description: 'Regístrate hoy y descubre el mundo del arte',
        content: 'Crea tu cuenta gratuita y accede a subastas exclusivas, obras únicas y una comunidad apasionada por el arte.',
        order: 4,
        isActive: true
      }
    ];

    // Insertar bloques de contenido
    for (const block of contentBlocks) {
      await prisma.contentBlock.upsert({
        where: { name: block.name },
        update: block,
        create: block
      });
    }

    // Insertar configuraciones del sitio
    for (const setting of siteSettings) {
      await prisma.siteSettings.upsert({
        where: { key: setting.key },
        update: setting,
        create: setting
      });
    }

    // Insertar contenido de páginas
    for (const content of pageContent) {
      await prisma.pageContent.upsert({
        where: { 
          page_section: {
            page: content.page,
            section: content.section
          }
        },
        update: content,
        create: content
      });
    }

    console.log('✅ Datos del CMS poblados exitosamente');

  } catch (error) {
    console.error('❌ Error poblando datos del CMS:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedCMS();
