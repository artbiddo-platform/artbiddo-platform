'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArtworkCard from '@/components/ArtworkCard';
import { Filter, Search, SortAsc, Clock, Gavel, Loader2 } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  artworkCount: number;
}

interface Artwork {
  id: string;
  title: string;
  artist: string;
  description: string;
  category: string;
  categoryId: string;
  year: number;
  medium: string;
  dimensions: string;
  image: string;
  startingPrice: number;
  currentPrice: number;
  estimatedValue: number;
  auctionId: string;
  status: 'active' | 'sold' | 'expired' | 'pending';
  endDate: Date;
  createdAt: Date;
  totalBids: number;
  views: number;
  favorites: number;
  sellerId: string;
  sellerName: string;
}

export default function SubastasPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('ending-soon');
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Cargar categorías
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        if (response.ok) {
          setCategories(data.categories);
        }
      } catch (error) {
        console.error('Error al cargar categorías:', error);
      }
    };

    fetchCategories();
  }, []);

  // Cargar obras de arte
  useEffect(() => {
    const fetchArtworks = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          categoryId: selectedCategory,
          search: searchTerm,
          sortBy: sortBy
        });

        const response = await fetch(`/api/artworks?${params}`);
        const data = await response.json();
        
        if (response.ok) {
          // Convertir strings a Date objects
          const artworksWithDates = data.artworks.map((artwork: any) => ({
            ...artwork,
            endDate: new Date(artwork.endDate),
            createdAt: new Date(artwork.createdAt)
          }));
          setArtworks(artworksWithDates);
          setError('');
        } else {
          setError(data.error || 'Error al cargar las obras');
        }
      } catch (error) {
        console.error('Error al cargar obras:', error);
        setError('Error de conexión');
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, [selectedCategory, searchTerm, sortBy]);

  return (
    <div className="min-h-screen bg-secondary-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Subastas Activas</h1>
            <p className="text-xl opacity-90">
              Descubre obras únicas y participa en subastas exclusivas
            </p>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">Todas las categorías</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar por título o artista..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ordenar por
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="ending-soon">Terminando pronto</option>
                  <option value="price-low">Precio: menor a mayor</option>
                  <option value="price-high">Precio: mayor a menor</option>
                  <option value="most-bids">Más pujas</option>
                  <option value="newest">Más recientes</option>
                </select>
              </div>

              {/* Results Count */}
              <div className="flex items-end">
                <div className="text-sm text-gray-600">
                  {loading ? (
                    <div className="flex items-center">
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Cargando...
                    </div>
                  ) : (
                    `${artworks.length} obra${artworks.length !== 1 ? 's' : ''} encontrada${artworks.length !== 1 ? 's' : ''}`
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Artworks Grid */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-600" />
              <p className="text-gray-600">Cargando obras de arte...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <Gavel className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar</h3>
              <p className="text-gray-600">{error}</p>
            </div>
          ) : artworks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {artworks.map((artwork) => (
                <ArtworkCard key={artwork.id} artwork={artwork} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Gavel className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron obras</h3>
              <p className="text-gray-600">
                Intenta ajustar los filtros de búsqueda
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
