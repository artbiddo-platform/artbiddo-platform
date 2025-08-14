'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowRight, Filter, Search } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  artworkCount: number;
  totalValue: number;
  popularArtworks: {
    id: string;
    title: string;
    artist: string;
    image: string;
    currentPrice: number;
  }[];
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Mock data para desarrollo
  const mockCategories: Category[] = [
    {
      id: '1',
      name: 'Arte Contemporáneo',
      description: 'Obras de artistas contemporáneos que definen el arte actual',
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=400&fit=crop',
      artworkCount: 45,
      totalValue: 1250000,
      popularArtworks: [
        {
          id: '1',
          title: 'Composición Abstracta',
          artist: 'María García',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
          currentPrice: 2500
        },
        {
          id: '2',
          title: 'Paisaje Urbano',
          artist: 'Carlos López',
          image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=200&fit=crop',
          currentPrice: 1800
        }
      ]
    },
    {
      id: '2',
      name: 'Arte Clásico',
      description: 'Obras maestras de períodos históricos significativos',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
      artworkCount: 32,
      totalValue: 2800000,
      popularArtworks: [
        {
          id: '3',
          title: 'Retrato Clásico',
          artist: 'Ana Martínez',
          image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=200&fit=crop',
          currentPrice: 4500
        }
      ]
    },
    {
      id: '3',
      name: 'Impresionismo',
      description: 'Obras que capturan la luz y el movimiento del siglo XIX',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
      artworkCount: 28,
      totalValue: 3200000,
      popularArtworks: [
        {
          id: '4',
          title: 'Jardín en Primavera',
          artist: 'Luis Rodríguez',
          image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=200&fit=crop',
          currentPrice: 3800
        }
      ]
    },
    {
      id: '4',
      name: 'Arte Abstracto',
      description: 'Expresiones artísticas que van más allá de la representación figurativa',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
      artworkCount: 38,
      totalValue: 1800000,
      popularArtworks: [
        {
          id: '5',
          title: 'Formas Dinámicas',
          artist: 'Elena Sánchez',
          image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=200&fit=crop',
          currentPrice: 2200
        }
      ]
    },
    {
      id: '5',
      name: 'Fotografía',
      description: 'Imágenes que capturan momentos únicos y perspectivas únicas',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
      artworkCount: 52,
      totalValue: 950000,
      popularArtworks: [
        {
          id: '6',
          title: 'Serie Urbana',
          artist: 'David Fernández',
          image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=200&fit=crop',
          currentPrice: 1200
        }
      ]
    },
    {
      id: '6',
      name: 'Escultura',
      description: 'Obras tridimensionales que transforman el espacio',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
      artworkCount: 25,
      totalValue: 2100000,
      popularArtworks: [
        {
          id: '7',
          title: 'Forma Orgánica',
          artist: 'Sofía Martín',
          image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=200&fit=crop',
          currentPrice: 5500
        }
      ]
    }
  ];

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setCategories(mockCategories);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando categorías...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-light mb-6 tracking-tight">
              Categorías de Arte
            </h1>
            <p className="text-xl sm:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
              Explora nuestra colección especializada en diferentes técnicas, períodos y estilos artísticos
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Buscar categorías..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCategories.map((category) => (
              <div key={category.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300">
                {/* Category Image */}
                <div className="relative h-64">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                  <div className="absolute top-4 right-4 bg-white bg-opacity-90 px-3 py-1 rounded-full">
                    <span className="text-sm font-medium text-gray-900">
                      {category.artworkCount} obras
                    </span>
                  </div>
                </div>

                {/* Category Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {category.description}
                  </p>
                  
                  {/* Stats */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Valor total</p>
                      <p className="text-lg font-semibold text-gray-900">
                        €{category.totalValue.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Obras activas</p>
                      <p className="text-lg font-semibold text-blue-600">
                        {category.artworkCount}
                      </p>
                    </div>
                  </div>

                  {/* Popular Artworks Preview */}
                  {category.popularArtworks.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Obras destacadas:</p>
                      <div className="flex space-x-2">
                        {category.popularArtworks.slice(0, 3).map((artwork) => (
                          <div key={artwork.id} className="relative w-16 h-16 rounded-lg overflow-hidden">
                            <Image
                              src={artwork.image}
                              alt={artwork.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <Link
                    href={`/subastas?categoryId=${category.id}`}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>Explorar Categoría</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron categorías</h3>
              <p className="text-gray-600">
                Intenta con otros términos de búsqueda
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-4">
              Nuestras Categorías en Números
            </h2>
            <p className="text-gray-600 text-lg">
              Una colección diversa que abarca toda la historia del arte
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">
                {categories.length}
              </div>
              <p className="text-gray-600">Categorías</p>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-green-600 mb-2">
                {categories.reduce((sum, cat) => sum + cat.artworkCount, 0)}
              </div>
              <p className="text-gray-600">Obras Totales</p>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-purple-600 mb-2">
                €{categories.reduce((sum, cat) => sum + cat.totalValue, 0).toLocaleString()}
              </div>
              <p className="text-gray-600">Valor Total</p>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-orange-600 mb-2">
                50+
              </div>
              <p className="text-gray-600">Artistas</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
