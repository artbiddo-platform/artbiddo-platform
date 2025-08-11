'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, Clock, Gavel, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface ArtworkCardProps {
  artwork: {
    id: string;
    title: string;
    artist: string;
    description: string;
    category: string;
    year: number;
    medium: string;
    dimensions: string;
    image: string;
    startingPrice: number;
    currentPrice: number;
    estimatedValue: number;
    auctionId: string;
    sellerId: string;
    status: 'active' | 'sold' | 'expired' | 'pending';
    createdAt: Date;
    endDate: Date;
    totalBids: number;
    views: number;
    favorites: number;
  };
}

export default function ArtworkCard({ artwork }: ArtworkCardProps) {
  const [isLiked, setIsLiked] = useState(false);

  const getTimeLeft = () => {
    const now = new Date();
    const end = new Date(artwork.endDate);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Finalizada';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getCategoryName = (categoryId: string) => {
    switch (categoryId) {
      case '1': return 'Pintura';
      case '2': return 'Escultura';
      case '3': return 'Fotografía';
      case '4': return 'Digital';
      default: return 'Arte';
    }
  };

  const timeLeft = getTimeLeft();
  const isAuctionEnded = new Date(artwork.endDate) < new Date();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image */}
      <div className="relative group">
        <img
          src={artwork.image}
          alt={artwork.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300">
          <div className="absolute top-3 right-3 flex space-x-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsLiked(!isLiked);
              }}
              className={`p-2 rounded-full shadow-lg transition-colors ${
                isLiked ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:text-red-500'
              }`}
            >
              <Heart className="w-4 h-4" fill={isLiked ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            isAuctionEnded 
              ? 'bg-gray-100 text-gray-800' 
              : 'bg-primary-100 text-primary-800'
          }`}>
            {isAuctionEnded ? 'Finalizada' : 'Activa'}
          </span>
        </div>

        {/* Category Badge */}
        <div className="absolute bottom-3 left-3">
          <span className="px-2 py-1 bg-white bg-opacity-90 text-xs font-medium rounded-full text-gray-700">
            {getCategoryName(artwork.category)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title and Artist */}
        <div className="mb-3">
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
            {artwork.title}
          </h3>
          <p className="text-sm text-gray-600">
            por {artwork.artist}
          </p>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {artwork.description}
        </p>

        {/* Details */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-gray-500">
          <div>
            <span className="font-medium">Año:</span> {artwork.year}
          </div>
          <div>
            <span className="font-medium">Medio:</span> {artwork.medium}
          </div>
          <div>
            <span className="font-medium">Dimensiones:</span> {artwork.dimensions}
          </div>
          <div>
            <span className="font-medium">Valor estimado:</span> €{artwork.estimatedValue.toLocaleString()}
          </div>
        </div>

        {/* Auction Info */}
        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-gray-500">Precio actual</p>
              <p className="text-lg font-bold text-primary-600">
                €{artwork.currentPrice.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Precio inicial</p>
              <p className="text-sm text-gray-600">
                €{artwork.startingPrice.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
            <div className="flex items-center space-x-1">
              <Gavel className="w-3 h-3" />
              <span>{artwork.totalBids} pujas</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="w-3 h-3" />
              <span>{artwork.views} vistas</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="w-3 h-3" />
              <span>{artwork.favorites} favoritos</span>
            </div>
          </div>

          {/* Time Left */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-1 text-sm">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className={isAuctionEnded ? 'text-gray-500' : 'text-orange-600 font-medium'}>
                {timeLeft}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Link
              href={`/obra/${artwork.id}`}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors text-center"
            >
              Ver Detalles
            </Link>
            {!isAuctionEnded && (
              <Link
                href={`/obra/${artwork.id}`}
                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-center"
              >
                Pujar Ahora
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
