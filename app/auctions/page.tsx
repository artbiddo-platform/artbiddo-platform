'use client';

import { useState, useEffect } from 'react';
import AuctionTimer from '@/components/AuctionTimer';
import { auctionTimer } from '@/lib/auctionTimer';

interface Artwork {
  id: string;
  title: string;
  artist: string;
  description: string;
  image: string;
  currentPrice: number;
  estimatedValue: number;
  totalBids: number;
  endDate: Date;
  status: string;
  category: {
    name: string;
  };
}

export default function AuctionsPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, ending-soon, last-minute, sniping
  const [sortBy, setSortBy] = useState('time'); // time, price, bids

  // Mock data para desarrollo
  const mockArtworks: Artwork[] = [
    {
      id: '1',
      title: 'Composición Abstracta',
      artist: 'María García',
      description: 'Obra abstracta contemporánea con técnicas mixtas',
      image: '/images/artworks/abstract1.jpg',
      currentPrice: 45,
      estimatedValue: 180,
      totalBids: 12,
      endDate: new Date(Date.now() + 25 * 1000), // 25 segundos
      status: 'ACTIVE',
      category: { name: 'Arte Contemporáneo' }
    },
    {
      id: '2',
      title: 'Paisaje Mediterráneo',
      artist: 'Carlos López',
      description: 'Paisaje impresionista del Mediterráneo',
      image: '/images/artworks/landscape1.jpg',
      currentPrice: 78,
      estimatedValue: 250,
      totalBids: 8,
      endDate: new Date(Date.now() + 2 * 60 * 1000), // 2 minutos
      status: 'ACTIVE',
      category: { name: 'Impresionismo' }
    },
    {
      id: '3',
      title: 'Retrato Moderno',
      artist: 'Ana Martínez',
      description: 'Retrato contemporáneo con técnica mixta',
      image: '/images/artworks/portrait1.jpg',
      currentPrice: 120,
      estimatedValue: 300,
      totalBids: 15,
      endDate: new Date(Date.now() + 15 * 60 * 1000), // 15 minutos
      status: 'ACTIVE',
      category: { name: 'Arte Contemporáneo' }
    },
    {
      id: '4',
      title: 'Escultura en Bronce',
      artist: 'Luis Rodríguez',
      description: 'Escultura figurativa en bronce patinado',
      image: '/images/artworks/sculpture1.jpg',
      currentPrice: 200,
      estimatedValue: 500,
      totalBids: 6,
      endDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 horas
      status: 'ACTIVE',
      category: { name: 'Escultura' }
    }
  ];

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setArtworks(mockArtworks);
      setLoading(false);
    }, 1000);
  }, []);

  const handleTimeUp = (artworkId: string) => {
    // Actualizar estado cuando una subasta finaliza
    setArtworks(prev => prev.map(artwork => 
      artwork.id === artworkId 
        ? { ...artwork, status: 'FINISHED' }
        : artwork
    ));
  };

  const handleBid = async (artworkId: string) => {
    // Simular puja
    console.log(`Pujando en obra ${artworkId}`);
    alert('Función de puja - Se integrará con el sistema de tokens');
  };

  const getFilteredArtworks = () => {
    let filtered = artworks.filter(artwork => artwork.status === 'ACTIVE');

    switch (filter) {
      case 'ending-soon':
        filtered = filtered.filter(artwork => {
          const timeLeft = auctionTimer.calculateTimeRemaining(artwork.endDate);
          return timeLeft <= 300 && timeLeft > 0; // Últimos 5 minutos
        });
        break;
      case 'last-minute':
        filtered = filtered.filter(artwork => {
          const timeLeft = auctionTimer.calculateTimeRemaining(artwork.endDate);
          return auctionTimer.isLastMinute(timeLeft);
        });
        break;
      case 'sniping':
        filtered = filtered.filter(artwork => {
          const timeLeft = auctionTimer.calculateTimeRemaining(artwork.endDate);
          return auctionTimer.isSnipingWindow(timeLeft);
        });
        break;
    }

    // Ordenar
    switch (sortBy) {
      case 'time':
        filtered.sort((a, b) => {
          const timeA = auctionTimer.calculateTimeRemaining(a.endDate);
          const timeB = auctionTimer.calculateTimeRemaining(b.endDate);
          return timeA - timeB;
        });
        break;
      case 'price':
        filtered.sort((a, b) => b.currentPrice - a.currentPrice);
        break;
      case 'bids':
        filtered.sort((a, b) => b.totalBids - a.totalBids);
        break;
    }

    return filtered;
  };

  const getFilteredCount = () => {
    return getFilteredArtworks().length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando subastas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <h1 className="text-3xl font-bold text-gray-900">Subastas Activas</h1>
            <p className="text-gray-600 mt-2">Puja en tiempo real en nuestras exclusivas obras de arte</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros y ordenamiento */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todas ({artworks.filter(a => a.status === 'ACTIVE').length})
              </button>
              <button
                onClick={() => setFilter('ending-soon')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'ending-soon'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                ⚠️ Finaliza Pronto ({artworks.filter(a => {
                  const timeLeft = auctionTimer.calculateTimeRemaining(a.endDate);
                  return timeLeft <= 300 && timeLeft > 0;
                }).length})
              </button>
              <button
                onClick={() => setFilter('last-minute')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'last-minute'
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                ⚡ Último Minuto ({artworks.filter(a => {
                  const timeLeft = auctionTimer.calculateTimeRemaining(a.endDate);
                  return auctionTimer.isLastMinute(timeLeft);
                }).length})
              </button>
              <button
                onClick={() => setFilter('sniping')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'sniping'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🔥 Sniping ({artworks.filter(a => {
                  const timeLeft = auctionTimer.calculateTimeRemaining(a.endDate);
                  return auctionTimer.isSnipingWindow(timeLeft);
                }).length})
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Ordenar por:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="time">Tiempo</option>
                <option value="price">Precio</option>
                <option value="bids">Pujas</option>
              </select>
            </div>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">🎨</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Subastas Activas</p>
                <p className="text-2xl font-bold text-gray-900">{getFilteredCount()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">⚠️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Finaliza Pronto</p>
                <p className="text-2xl font-bold text-gray-900">
                  {artworks.filter(a => {
                    const timeLeft = auctionTimer.calculateTimeRemaining(a.endDate);
                    return timeLeft <= 300 && timeLeft > 0;
                  }).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <span className="text-2xl">⚡</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Último Minuto</p>
                <p className="text-2xl font-bold text-gray-900">
                  {artworks.filter(a => {
                    const timeLeft = auctionTimer.calculateTimeRemaining(a.endDate);
                    return auctionTimer.isLastMinute(timeLeft);
                  }).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <span className="text-2xl">🔥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Sniping</p>
                <p className="text-2xl font-bold text-gray-900">
                  {artworks.filter(a => {
                    const timeLeft = auctionTimer.calculateTimeRemaining(a.endDate);
                    return auctionTimer.isSnipingWindow(timeLeft);
                  }).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de subastas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getFilteredArtworks().map((artwork) => (
            <div key={artwork.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
              {/* Imagen */}
              <div className="relative h-48 bg-gray-200">
                <img
                  src={artwork.image || '/images/artworks/default.jpg'}
                  alt={artwork.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    {artwork.category.name}
                  </span>
                </div>
              </div>

              {/* Contenido */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{artwork.title}</h3>
                <p className="text-sm text-gray-600 mb-2">por {artwork.artist}</p>
                <p className="text-sm text-gray-700 mb-4 line-clamp-2">{artwork.description}</p>

                {/* Timer */}
                <div className="mb-4">
                  <AuctionTimer
                    endDate={artwork.endDate}
                    artworkId={artwork.id}
                    onTimeUp={() => handleTimeUp(artwork.id)}
                    showExtension={true}
                  />
                </div>

                {/* Precio y pujas */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Precio actual</p>
                    <p className="text-xl font-bold text-blue-600">{artwork.currentPrice} tokens</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Pujas</p>
                    <p className="text-lg font-semibold text-gray-900">{artwork.totalBids}</p>
                  </div>
                </div>

                {/* Valor estimado */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Valor estimado</p>
                  <p className="text-lg font-semibold text-gray-900">€{artwork.estimatedValue}</p>
                </div>

                {/* Botón de puja */}
                <button
                  onClick={() => handleBid(artwork.id)}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Pujar Ahora
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Mensaje si no hay subastas */}
        {getFilteredArtworks().length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay subastas disponibles</h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? 'No hay subastas activas en este momento.'
                : `No hay subastas que coincidan con el filtro "${filter}".`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
