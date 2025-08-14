'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowRight, Search, Star, Award, TrendingUp } from 'lucide-react';

interface Artist {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  coverImage: string;
  specialty: string;
  location: string;
  totalArtworks: number;
  totalSales: number;
  averagePrice: number;
  rating: number;
  isVerified: boolean;
  featuredArtworks: {
    id: string;
    title: string;
    image: string;
    currentPrice: number;
    status: string;
  }[];
}

export default function ArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, verified, trending, featured

  // Mock data para desarrollo
  const mockArtists: Artist[] = [
    {
      id: '1',
      name: 'María García',
      bio: 'Artista contemporánea especializada en técnicas mixtas y expresiones abstractas. Su obra explora la relación entre el espacio urbano y la naturaleza.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face',
      coverImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=300&fit=crop',
      specialty: 'Arte Contemporáneo',
      location: 'Madrid, España',
      totalArtworks: 15,
      totalSales: 125000,
      averagePrice: 8300,
      rating: 4.8,
      isVerified: true,
      featuredArtworks: [
        {
          id: '1',
          title: 'Composición Urbana',
          image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=200&h=200&fit=crop',
          currentPrice: 8500,
          status: 'active'
        },
        {
          id: '2',
          title: 'Abstracción Natural',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop',
          currentPrice: 12000,
          status: 'active'
        }
      ]
    },
    {
      id: '2',
      name: 'Carlos López',
      bio: 'Pintor impresionista que captura la esencia de la luz mediterránea. Sus paisajes transmiten la calma y belleza del sur de España.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
      coverImage: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=300&fit=crop',
      specialty: 'Impresionismo',
      location: 'Valencia, España',
      totalArtworks: 22,
      totalSales: 89000,
      averagePrice: 4050,
      rating: 4.9,
      isVerified: true,
      featuredArtworks: [
        {
          id: '3',
          title: 'Paisaje Mediterráneo',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop',
          currentPrice: 4500,
          status: 'active'
        }
      ]
    },
    {
      id: '3',
      name: 'Ana Martínez',
      bio: 'Escultora contemporánea que trabaja principalmente con bronce y mármol. Sus obras exploran la forma humana y la emoción.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
      coverImage: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=300&fit=crop',
      specialty: 'Escultura',
      location: 'Barcelona, España',
      totalArtworks: 8,
      totalSales: 210000,
      averagePrice: 26250,
      rating: 4.7,
      isVerified: true,
      featuredArtworks: [
        {
          id: '4',
          title: 'Forma Humana',
          image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=200&h=200&fit=crop',
          currentPrice: 28000,
          status: 'active'
        }
      ]
    },
    {
      id: '4',
      name: 'Luis Rodríguez',
      bio: 'Fotógrafo documental que retrata la vida urbana y los contrastes sociales. Su obra ha sido expuesta en galerías internacionales.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
      coverImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=300&fit=crop',
      specialty: 'Fotografía',
      location: 'Sevilla, España',
      totalArtworks: 35,
      totalSales: 67000,
      averagePrice: 1914,
      rating: 4.6,
      isVerified: false,
      featuredArtworks: [
        {
          id: '5',
          title: 'Serie Urbana #12',
          image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=200&h=200&fit=crop',
          currentPrice: 2200,
          status: 'active'
        }
      ]
    },
    {
      id: '5',
      name: 'Elena Sánchez',
      bio: 'Artista digital pionera en el uso de nuevas tecnologías. Combina técnicas tradicionales con herramientas digitales.',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face',
      coverImage: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=300&fit=crop',
      specialty: 'Arte Digital',
      location: 'Bilbao, España',
      totalArtworks: 18,
      totalSales: 95000,
      averagePrice: 5278,
      rating: 4.5,
      isVerified: true,
      featuredArtworks: [
        {
          id: '6',
          title: 'Realidad Virtual',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop',
          currentPrice: 5800,
          status: 'active'
        }
      ]
    },
    {
      id: '6',
      name: 'David Fernández',
      bio: 'Pintor abstracto que explora la geometría y el color. Su obra se caracteriza por composiciones dinámicas y vibrantes.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
      coverImage: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=300&fit=crop',
      specialty: 'Arte Abstracto',
      location: 'Málaga, España',
      totalArtworks: 12,
      totalSales: 78000,
      averagePrice: 6500,
      rating: 4.4,
      isVerified: false,
      featuredArtworks: [
        {
          id: '7',
          title: 'Geometría Dinámica',
          image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=200&h=200&fit=crop',
          currentPrice: 7200,
          status: 'active'
        }
      ]
    }
  ];

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setArtists(mockArtists);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredArtists = artists.filter(artist => {
    const matchesSearch = artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         artist.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         artist.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    
    switch (filter) {
      case 'verified':
        return artist.isVerified;
      case 'trending':
        return artist.rating >= 4.5;
      case 'featured':
        return artist.totalSales > 100000;
      default:
        return true;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando artistas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-light mb-6 tracking-tight">
              Artistas Destacados
            </h1>
            <p className="text-xl sm:text-2xl text-purple-100 max-w-3xl mx-auto mb-8">
              Descubre talentos únicos y obras excepcionales de artistas emergentes y consagrados
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Buscar artistas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todos ({artists.length})
            </button>
            <button
              onClick={() => setFilter('verified')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'verified'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ✅ Verificados ({artists.filter(a => a.isVerified).length})
            </button>
            <button
              onClick={() => setFilter('trending')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'trending'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🔥 Tendencia ({artists.filter(a => a.rating >= 4.5).length})
            </button>
            <button
              onClick={() => setFilter('featured')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'featured'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ⭐ Destacados ({artists.filter(a => a.totalSales > 100000).length})
            </button>
          </div>
        </div>
      </section>

      {/* Artists Grid */}
      <section className="py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArtists.map((artist) => (
              <div key={artist.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300">
                {/* Artist Cover Image */}
                <div className="relative h-48">
                  <Image
                    src={artist.coverImage}
                    alt={artist.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                  
                  {/* Artist Avatar */}
                  <div className="absolute -bottom-12 left-6">
                    <div className="relative">
                      <Image
                        src={artist.avatar}
                        alt={artist.name}
                        width={80}
                        height={80}
                        className="rounded-full border-4 border-white"
                      />
                      {artist.isVerified && (
                        <div className="absolute -top-2 -right-2 bg-blue-500 rounded-full p-1">
                          <Award className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Artist Info */}
                <div className="pt-12 pb-6 px-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {artist.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-1">{artist.specialty}</p>
                      <p className="text-xs text-gray-500">{artist.location}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-900">{artist.rating}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {artist.bio}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                    <div>
                      <p className="text-lg font-semibold text-gray-900">{artist.totalArtworks}</p>
                      <p className="text-xs text-gray-500">Obras</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-green-600">€{artist.totalSales.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">Ventas</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-blue-600">€{artist.averagePrice.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">Promedio</p>
                    </div>
                  </div>

                  {/* Featured Artworks */}
                  {artist.featuredArtworks.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Obras destacadas:</p>
                      <div className="flex space-x-2">
                        {artist.featuredArtworks.slice(0, 3).map((artwork) => (
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
                    href={`/artista/${artist.id}`}
                    className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>Ver Perfil</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredArtists.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron artistas</h3>
              <p className="text-gray-600">
                Intenta con otros términos de búsqueda o filtros
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
              Nuestra Comunidad de Artistas
            </h2>
            <p className="text-gray-600 text-lg">
              Una red global de talentos creativos
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-purple-600 mb-2">
                {artists.length}
              </div>
              <p className="text-gray-600">Artistas</p>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">
                {artists.filter(a => a.isVerified).length}
              </div>
              <p className="text-gray-600">Verificados</p>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-green-600 mb-2">
                €{artists.reduce((sum, a) => sum + a.totalSales, 0).toLocaleString()}
              </div>
              <p className="text-gray-600">Ventas Totales</p>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-orange-600 mb-2">
                {artists.reduce((sum, a) => sum + a.totalArtworks, 0)}
              </div>
              <p className="text-gray-600">Obras</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
