'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RealTimeBidding from '@/components/RealTimeBidding';
import { Gavel, Clock, Eye, Heart, Euro, User, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface Artwork {
  id: string;
  title: string;
  artist: string;
  description: string;
  year: number;
  medium: string;
  dimensions: string;
  image: string;
  startingPrice: number;
  currentPrice: number;
  estimatedValue: number;
  status: string;
  endDate: string;
  totalBids: number;
  views: number;
  favorites: number;
  category: {
    name: string;
  };
  seller: {
    name: string;
  };
}

interface Bid {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  user: {
    name: string;
    avatar?: string;
  };
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  balance: number;
}

export default function ArtworkPage() {
  const params = useParams();
  const router = useRouter();
  const artworkId = params.id as string;
  
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [bidAmount, setBidAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [bidLoading, setBidLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    loadArtworkData();
    checkUserAuth();
  }, [artworkId]);

  const loadArtworkData = async () => {
    try {
      // Cargar obra
      const artworkResponse = await fetch(`/api/artworks/${artworkId}`);
      if (artworkResponse.ok) {
        const artworkData = await artworkResponse.json();
        setArtwork(artworkData.artwork);
      }

      // Cargar pujas
      const bidsResponse = await fetch(`/api/bids?artworkId=${artworkId}`);
      if (bidsResponse.ok) {
        const bidsData = await bidsResponse.json();
        setBids(bidsData.bids);
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkUserAuth = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  };

  const handleBidSubmit = async (amount: number): Promise<boolean> => {
    if (!user) {
      setMessage('Debes iniciar sesión para pujar');
      setMessageType('error');
      return false;
    }

    if (amount <= artwork!.currentPrice) {
      setMessage(`La puja debe ser mayor a €${artwork!.currentPrice.toLocaleString()}`);
      setMessageType('error');
      return false;
    }

    if (amount > user.balance) {
      setMessage('Saldo insuficiente');
      setMessageType('error');
      return false;
    }

    setBidLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/bids', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          artworkId,
          amount
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al realizar la puja');
      }

      // Actualizar datos locales
      setArtwork(prev => prev ? {
        ...prev,
        currentPrice: amount,
        totalBids: prev.totalBids + 1
      } : null);

      // Agregar nueva puja al inicio
      const newBid: Bid = {
        id: data.bid.id,
        amount: data.bid.amount,
        status: data.bid.status,
        createdAt: data.bid.createdAt,
        user: {
          name: user.name,
          avatar: (user as any).avatar || null
        }
      };

      setBids(prev => [newBid, ...prev]);
      setMessage('¡Puja realizada con éxito!');
      setMessageType('success');

      // Actualizar saldo del usuario
      setUser(prev => prev ? {
        ...prev,
        balance: prev.balance - amount
      } : null);

      return true;

    } catch (error: any) {
      setMessage(error.message || 'Error al realizar la puja');
      setMessageType('error');
      return false;
    } finally {
      setBidLoading(false);
    }
  };

  const getTimeLeft = () => {
    if (!artwork) return '';
    
    const endDate = new Date(artwork.endDate);
    const now = new Date();
    const diff = endDate.getTime() - now.getTime();
    
    if (diff <= 0) return 'Finalizada';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getUserBid = () => {
    if (!user) return null;
    return bids.find(bid => bid.user.name === user.name);
  };

  const isAuctionActive = () => {
    if (!artwork) return false;
    return new Date() < new Date(artwork.endDate) && artwork.status === 'ACTIVE';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="min-h-screen bg-secondary-50">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Obra no encontrada</h1>
            <button
              onClick={() => router.push('/subastas')}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Volver a las subastas
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const userBid = getUserBid();
  const timeLeft = getTimeLeft();
  const isActive = isAuctionActive();

  return (
    <div className="min-h-screen bg-secondary-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Imagen de la obra */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={artwork.image}
                alt={artwork.title}
                className="w-full h-96 object-cover rounded-2xl shadow-lg"
              />
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {isActive ? 'Activa' : 'Finalizada'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{artwork.views} vistas</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="w-4 h-4" />
                  <span>{artwork.favorites} favoritos</span>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Gavel className="w-4 h-4" />
                <span>{artwork.totalBids} pujas</span>
              </div>
            </div>
          </div>

          {/* Información de la obra */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{artwork.title}</h1>
              <p className="text-xl text-gray-600 mb-4">por {artwork.artist}</p>
              <p className="text-gray-700 leading-relaxed">{artwork.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Año</p>
                <p className="font-semibold text-gray-900">{artwork.year}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Técnica</p>
                <p className="font-semibold text-gray-900">{artwork.medium}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Dimensiones</p>
                <p className="font-semibold text-gray-900">{artwork.dimensions}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Categoría</p>
                <p className="font-semibold text-gray-900">{artwork.category.name}</p>
              </div>
            </div>

            {/* Precios */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Precio inicial:</span>
                <span className="font-semibold">€{artwork.startingPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Precio actual:</span>
                <span className="text-2xl font-bold text-primary-600">€{artwork.currentPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Valor estimado:</span>
                <span className="font-semibold">€{artwork.estimatedValue.toLocaleString()}</span>
              </div>
            </div>

            {/* Tiempo restante */}
            <div className="bg-primary-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-primary-600" />
                  <span className="font-medium text-gray-900">Tiempo restante:</span>
                </div>
                <span className="text-lg font-bold text-primary-600">{timeLeft}</span>
              </div>
            </div>

            {/* Puja del usuario */}
            {userBid && (
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-blue-800 font-medium">Tu puja actual:</span>
                  <span className="text-lg font-bold text-blue-600">€{userBid.amount.toLocaleString()}</span>
                </div>
              </div>
            )}

            {/* Pujas en tiempo real */}
            {isActive && (
              <RealTimeBidding
                artworkId={artworkId}
                currentPrice={artwork.currentPrice}
                onBidSubmit={handleBidSubmit}
                userId={user?.id}
                userName={user?.name}
              />
            )}

            {!user && isActive && (
              <div className="bg-yellow-50 rounded-lg p-4 text-center">
                <p className="text-yellow-800 mb-2">Debes iniciar sesión para pujar</p>
                <button
                  onClick={() => router.push('/login')}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Iniciar Sesión
                </button>
              </div>
            )}

            {!isActive && (
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-gray-600">Esta subasta ha finalizado</p>
              </div>
            )}
          </div>
        </div>

        {/* Historial de pujas */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Historial de Pujas</h2>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pujador
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Monto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bids.map((bid) => (
                    <tr key={bid.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                            {bid.user.avatar ? (
                              <img src={bid.user.avatar} alt="" className="w-8 h-8 rounded-full" />
                            ) : (
                              <span className="text-primary-600 font-medium text-sm">
                                {bid.user.name.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{bid.user.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          €{bid.amount.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          bid.status === 'ACTIVE' 
                            ? 'bg-green-100 text-green-800' 
                            : bid.status === 'OUTBID'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {bid.status === 'ACTIVE' ? 'Activa' : 
                           bid.status === 'OUTBID' ? 'Superada' : 'Finalizada'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDistanceToNow(new Date(bid.createdAt), { 
                          addSuffix: true, 
                          locale: es 
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

