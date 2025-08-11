'use client';

import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

interface BidData {
  artworkId: string;
  amount: number;
  userId: string;
  userName: string;
  timestamp: string;
}

interface RealTimeBiddingProps {
  artworkId: string;
  currentPrice: number;
  onBidSubmit: (amount: number) => Promise<boolean>;
  userId?: string;
  userName?: string;
}

export default function RealTimeBidding({
  artworkId,
  currentPrice,
  onBidSubmit,
  userId,
  userName
}: RealTimeBiddingProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [bidAmount, setBidAmount] = useState(currentPrice + 100);
  const [recentBids, setRecentBids] = useState<BidData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Conectar al servidor de Socket.io
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('Conectado al servidor de pujas');
      
      // Unirse a la sala de la obra de arte
      newSocket.emit('join-artwork', artworkId);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Desconectado del servidor de pujas');
    });

    // Escuchar actualizaciones de pujas
    newSocket.on('bid-update', (bidData: BidData) => {
      setRecentBids(prev => [bidData, ...prev.slice(0, 4)]);
    });

    // Escuchar cambios de precio
    newSocket.on('price-changed', (data: { artworkId: string; newPrice: number }) => {
      if (data.artworkId === artworkId) {
        setBidAmount(data.newPrice + 100);
      }
    });

    return () => {
      newSocket.emit('leave-artwork', artworkId);
      newSocket.disconnect();
    };
  }, [artworkId]);

  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId || !userName) {
      alert('Debes iniciar sesión para pujar');
      return;
    }

    if (bidAmount <= currentPrice) {
      alert('La puja debe ser mayor al precio actual');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const success = await onBidSubmit(bidAmount);
      
      if (success && socket) {
        // Emitir la nueva puja al servidor
        socket.emit('new-bid', {
          artworkId,
          amount: bidAmount,
          userId,
          userName
        });
        
        setBidAmount(bidAmount + 100);
      }
    } catch (error) {
      console.error('Error al enviar puja:', error);
      alert('Error al enviar la puja');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">Puja en Tiempo Real</h3>
      
      {/* Estado de conexión */}
      <div className="mb-4">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          isConnected 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          <span className={`w-2 h-2 rounded-full mr-2 ${
            isConnected ? 'bg-green-400' : 'bg-red-400'
          }`}></span>
          {isConnected ? 'Conectado' : 'Desconectado'}
        </span>
      </div>

      {/* Formulario de puja */}
      <form onSubmit={handleBidSubmit} className="mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tu puja (€)
          </label>
          <input
            type="number"
            value={bidAmount}
            onChange={(e) => setBidAmount(Number(e.target.value))}
            min={currentPrice + 1}
            step="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            Precio actual: €{currentPrice.toLocaleString()}
          </p>
        </div>
        
        <button
          type="submit"
          disabled={!isConnected || isSubmitting || !userId}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Enviando...' : 'Hacer Puja'}
        </button>
      </form>

      {/* Pujas recientes */}
      <div>
        <h4 className="text-lg font-medium mb-3">Pujas Recientes</h4>
        {recentBids.length > 0 ? (
          <div className="space-y-2">
            {recentBids.map((bid, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <div>
                  <span className="font-medium">{bid.userName}</span>
                  <span className="text-gray-500 ml-2">
                    €{bid.amount.toLocaleString()}
                  </span>
                </div>
                <span className="text-sm text-gray-400">
                  {formatTime(bid.timestamp)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">
            No hay pujas recientes
          </p>
        )}
      </div>
    </div>
  );
}
