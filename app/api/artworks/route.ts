import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url || '');
    const categoryId = searchParams.get('categoryId');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'ending-soon';
    const limit = parseInt(searchParams.get('limit') || '12');

    // Obras de arte reales con imágenes profesionales
    const mockArtworks = [
      {
        id: '1',
        title: 'Composición en Azul y Verde',
        artist: 'Joan Miró',
        description: 'Serigrafía original numerada y firmada por el artista. Edición limitada de 150 ejemplares. Técnica mixta sobre papel de alta calidad.',
        category: 'Serigrafías Originales',
        categoryId: '1',
        year: 1975,
        medium: 'Serigrafía original',
        dimensions: '65 x 50 cm',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
        startingPrice: 8500,
        currentPrice: 12000,
        estimatedValue: 18000,
        auctionId: '1',
        status: 'active' as const,
        endDate: '2024-02-15T20:00:00.000Z',
        createdAt: '2024-01-15T00:00:00.000Z',
        totalBids: 8,
        views: 156,
        favorites: 12,
        sellerId: 'seller1',
        sellerName: 'Galería de Arte Contemporáneo'
      },
      {
        id: '2',
        title: 'Mujer con Sombrero',
        artist: 'Pablo Picasso',
        description: 'Litografía original firmada por Picasso. Edición limitada de 200 ejemplares. Impresa en el taller Mourlot de París.',
        category: 'Litografías Originales',
        categoryId: '2',
        year: 1962,
        medium: 'Litografía original',
        dimensions: '50 x 40 cm',
        image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=400&fit=crop',
        startingPrice: 15000,
        currentPrice: 22000,
        estimatedValue: 35000,
        auctionId: '1',
        status: 'active' as const,
        endDate: '2024-02-10T18:00:00.000Z',
        createdAt: '2024-01-10T00:00:00.000Z',
        totalBids: 12,
        views: 203,
        favorites: 18,
        sellerId: 'seller1',
        sellerName: 'Galería de Arte Contemporáneo'
      },
      {
        id: '3',
        title: 'Formas Abstractas',
        artist: 'Wassily Kandinsky',
        description: 'Aguafuerte original numerado y firmado. Edición limitada de 100 ejemplares. Impreso en papel de algodón.',
        category: 'Aguafuertes Originales',
        categoryId: '3',
        year: 1923,
        medium: 'Aguafuerte original',
        dimensions: '30 x 25 cm',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
        startingPrice: 25000,
        currentPrice: 38000,
        estimatedValue: 55000,
        auctionId: '2',
        status: 'active' as const,
        endDate: '2024-02-20T22:00:00.000Z',
        createdAt: '2024-01-20T00:00:00.000Z',
        totalBids: 6,
        views: 89,
        favorites: 7,
        sellerId: 'seller1',
        sellerName: 'Galería de Arte Contemporáneo'
      },
      {
        id: '4',
        title: 'Paisaje Mediterráneo',
        artist: 'Salvador Dalí',
        description: 'Serigrafía original con elementos dorados. Edición limitada de 300 ejemplares. Incluye certificado de autenticidad.',
        category: 'Serigrafías Originales',
        categoryId: '1',
        year: 1978,
        medium: 'Serigrafía original con dorado',
        dimensions: '70 x 55 cm',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
        startingPrice: 12000,
        currentPrice: 18000,
        estimatedValue: 28000,
        auctionId: '2',
        status: 'active' as const,
        endDate: '2024-02-25T19:00:00.000Z',
        createdAt: '2024-01-25T00:00:00.000Z',
        totalBids: 15,
        views: 267,
        favorites: 23,
        sellerId: 'seller1',
        sellerName: 'Galería de Arte Contemporáneo'
      },
      {
        id: '5',
        title: 'Composición Geométrica',
        artist: 'Piet Mondrian',
        description: 'Litografía original firmada. Edición limitada de 150 ejemplares. Impresa en papel de alta calidad.',
        category: 'Litografías Originales',
        categoryId: '2',
        year: 1942,
        medium: 'Litografía original',
        dimensions: '45 x 35 cm',
        image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=400&fit=crop',
        startingPrice: 18000,
        currentPrice: 25000,
        estimatedValue: 40000,
        auctionId: '3',
        status: 'active' as const,
        endDate: '2024-02-28T21:00:00.000Z',
        createdAt: '2024-01-28T00:00:00.000Z',
        totalBids: 9,
        views: 134,
        favorites: 15,
        sellerId: 'seller2',
        sellerName: 'Galería de Arte Moderno'
      },
      {
        id: '6',
        title: 'Retrato de Mujer',
        artist: 'Henri Matisse',
        description: 'Aguafuerte original numerado. Edición limitada de 200 ejemplares. Impreso en papel de algodón.',
        category: 'Aguafuertes Originales',
        categoryId: '3',
        year: 1930,
        medium: 'Aguafuerte original',
        dimensions: '25 x 20 cm',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
        startingPrice: 22000,
        currentPrice: 32000,
        estimatedValue: 48000,
        auctionId: '3',
        status: 'active' as const,
        endDate: '2024-03-01T20:00:00.000Z',
        createdAt: '2024-01-30T00:00:00.000Z',
        totalBids: 7,
        views: 98,
        favorites: 11,
        sellerId: 'seller2',
        sellerName: 'Galería de Arte Moderno'
      }
    ];

    // Aplicar filtros
    let filteredArtworks = mockArtworks.filter(artwork => {
      const matchesCategory = !categoryId || categoryId === 'all' || artwork.categoryId === categoryId;
      const matchesSearch = !search || 
        artwork.title.toLowerCase().includes(search.toLowerCase()) ||
        artwork.artist.toLowerCase().includes(search.toLowerCase()) ||
        artwork.description.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    // Aplicar ordenamiento
    filteredArtworks.sort((a, b) => {
      switch (sortBy) {
        case 'ending-soon':
          return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
        case 'price-low':
          return a.currentPrice - b.currentPrice;
        case 'price-high':
          return b.currentPrice - a.currentPrice;
        case 'most-bids':
          return b.totalBids - a.totalBids;
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
      }
    });

    // Aplicar límite
    const artworks = filteredArtworks.slice(0, limit);

    return NextResponse.json({
      artworks,
      pagination: {
        page: 1,
        limit,
        total: filteredArtworks.length,
        totalPages: Math.ceil(filteredArtworks.length / limit)
      }
    });

  } catch (error) {
    console.error('Error al obtener obras de arte:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
