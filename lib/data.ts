// Removed import of User - using Prisma types instead

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  artworkCount: number;
}

export interface Artwork {
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
}

export interface Bid {
  id: string;
  artworkId: string;
  userId: string;
  amount: number;
  timestamp: Date;
  status: 'active' | 'outbid' | 'won' | 'cancelled';
}

export interface Auction {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: 'upcoming' | 'active' | 'ended';
  totalArtworks: number;
  totalRevenue: number;
  totalBids: number;
  category: string;
}

export interface UserActivity {
  id: string;
  userId: string;
  type: 'bid' | 'purchase' | 'sale' | 'login' | 'registration';
  description: string;
  timestamp: Date;
  amount?: number;
  artworkId?: string;
}

// Categories
export const categories: Category[] = [
  {
    id: '1',
    name: 'Pintura Contemporánea',
    description: 'Obras de arte contemporáneo de artistas emergentes y establecidos',
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
    artworkCount: 45
  },
  {
    id: '2',
    name: 'Escultura',
    description: 'Esculturas únicas en diversos materiales y estilos',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
    artworkCount: 28
  },
  {
    id: '3',
    name: 'Fotografía',
    description: 'Fotografía artística y documental de alta calidad',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    artworkCount: 67
  },
  {
    id: '4',
    name: 'Arte Digital',
    description: 'Arte digital innovador y NFT de artistas digitales',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
    artworkCount: 34
  }
];

// Artworks with real data
export const artworks: Artwork[] = [
  {
    id: '1',
    title: 'Abstracción Nocturna',
    artist: 'Elena Martínez',
    description: 'Una obra maestra del expresionismo abstracto que captura la esencia de la noche urbana. Los trazos gestuales y la paleta de colores oscuros crean una atmósfera misteriosa y contemplativa.',
    category: '1',
    year: 2023,
    medium: 'Óleo sobre lienzo',
    dimensions: '120 x 80 cm',
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=400&fit=crop',
    startingPrice: 2500,
    currentPrice: 4200,
    estimatedValue: 6000,
    auctionId: '1',
    sellerId: 'user2',
    status: 'active',
    createdAt: new Date('2024-01-15'),
    endDate: new Date('2024-02-15T20:00:00'),
    totalBids: 8,
    views: 156,
    favorites: 12
  },
  {
    id: '2',
    title: 'Mujer en el Espejo',
    artist: 'Carlos Rodríguez',
    description: 'Retrato íntimo que explora la dualidad del ser humano. La técnica mixta combina acrílico y collage para crear texturas únicas que invitan a la reflexión.',
    category: '1',
    year: 2022,
    medium: 'Acrílico y collage sobre lienzo',
    dimensions: '100 x 100 cm',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
    startingPrice: 1800,
    currentPrice: 3100,
    estimatedValue: 4500,
    auctionId: '1',
    sellerId: 'user2',
    status: 'active',
    createdAt: new Date('2024-01-10'),
    endDate: new Date('2024-02-10T18:00:00'),
    totalBids: 12,
    views: 203,
    favorites: 18
  },
  {
    id: '3',
    title: 'Formas Orgánicas',
    artist: 'Ana López',
    description: 'Escultura en bronce que celebra la belleza de las formas naturales. Cada curva y volumen está cuidadosamente trabajado para crear una pieza única.',
    category: '2',
    year: 2021,
    medium: 'Bronce patinado',
    dimensions: '60 x 40 x 30 cm',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop',
    startingPrice: 3500,
    currentPrice: 5800,
    estimatedValue: 7500,
    auctionId: '2',
    sellerId: 'user2',
    status: 'active',
    createdAt: new Date('2024-01-20'),
    endDate: new Date('2024-02-20T22:00:00'),
    totalBids: 6,
    views: 89,
    favorites: 7
  },
  {
    id: '4',
    title: 'Luz Urbana',
    artist: 'Miguel Fernández',
    description: 'Fotografía artística que captura la energía vibrante de la ciudad por la noche. La composición y el juego de luces crean una narrativa visual única.',
    category: '3',
    year: 2023,
    medium: 'Fotografía digital',
    dimensions: '80 x 60 cm',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
    startingPrice: 1200,
    currentPrice: 2100,
    estimatedValue: 2800,
    auctionId: '2',
    sellerId: 'user2',
    status: 'active',
    createdAt: new Date('2024-01-25'),
    endDate: new Date('2024-02-25T19:00:00'),
    totalBids: 15,
    views: 267,
    favorites: 23
  }
];

// Bids with real data
export const bids: Bid[] = [
  {
    id: 'bid1',
    artworkId: '1',
    userId: 'user1',
    amount: 4200,
    timestamp: new Date('2024-01-28T15:30:00'),
    status: 'active'
  },
  {
    id: 'bid2',
    artworkId: '1',
    userId: 'user3',
    amount: 3800,
    timestamp: new Date('2024-01-28T14:45:00'),
    status: 'outbid'
  },
  {
    id: 'bid3',
    artworkId: '2',
    userId: 'user1',
    amount: 3100,
    timestamp: new Date('2024-01-28T16:20:00'),
    status: 'active'
  },
  {
    id: 'bid4',
    artworkId: '2',
    userId: 'user3',
    amount: 2800,
    timestamp: new Date('2024-01-28T15:10:00'),
    status: 'outbid'
  },
  {
    id: 'bid5',
    artworkId: '3',
    userId: 'user1',
    amount: 5800,
    timestamp: new Date('2024-01-28T17:15:00'),
    status: 'active'
  },
  {
    id: 'bid6',
    artworkId: '4',
    userId: 'user3',
    amount: 2100,
    timestamp: new Date('2024-01-28T18:30:00'),
    status: 'active'
  }
];

// Auctions
export const auctions: Auction[] = [
  {
    id: '1',
    title: 'Subasta de Arte Contemporáneo',
    description: 'Una colección excepcional de obras de arte contemporáneo de artistas emergentes y establecidos.',
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-02-15'),
    status: 'active',
    totalArtworks: 2,
    totalRevenue: 7300,
    totalBids: 20,
    category: '1'
  },
  {
    id: '2',
    title: 'Subasta de Escultura y Fotografía',
    description: 'Obras únicas de escultura y fotografía artística de la más alta calidad.',
    startDate: new Date('2024-01-20'),
    endDate: new Date('2024-02-20'),
    status: 'active',
    totalArtworks: 2,
    totalRevenue: 7900,
    totalBids: 21,
    category: '2'
  }
];

// User activities
export const userActivities: UserActivity[] = [
  {
    id: 'act1',
    userId: 'user1',
    type: 'bid',
    description: 'Pujó €4,200 en "Abstracción Nocturna"',
    timestamp: new Date('2024-01-28T15:30:00'),
    amount: 4200,
    artworkId: '1'
  },
  {
    id: 'act2',
    userId: 'user3',
    type: 'bid',
    description: 'Pujó €3,800 en "Abstracción Nocturna"',
    timestamp: new Date('2024-01-28T14:45:00'),
    amount: 3800,
    artworkId: '1'
  },
  {
    id: 'act3',
    userId: 'user1',
    type: 'bid',
    description: 'Pujó €3,100 en "Mujer en el Espejo"',
    timestamp: new Date('2024-01-28T16:20:00'),
    amount: 3100,
    artworkId: '2'
  },
  {
    id: 'act4',
    userId: 'user2',
    type: 'sale',
    description: 'Vendió "Abstracción Nocturna" por €4,200',
    timestamp: new Date('2024-01-28T15:30:00'),
    amount: 4200,
    artworkId: '1'
  }
];

// Helper functions
export const getArtworkById = (id: string): Artwork | undefined => {
  return artworks.find(artwork => artwork.id === id);
};

export const getBidsByArtworkId = (artworkId: string): Bid[] => {
  return bids.filter(bid => bid.artworkId === artworkId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const getActiveBidsByUser = (userId: string): Bid[] => {
  return bids.filter(bid => bid.userId === userId && bid.status === 'active');
};

export const placeBid = (artworkId: string, userId: string, amount: number): Bid => {
  const newBid: Bid = {
    id: `bid${Date.now()}`,
    artworkId,
    userId,
    amount,
    timestamp: new Date(),
    status: 'active'
  };
  
  // Update artwork current price
  const artwork = artworks.find(a => a.id === artworkId);
  if (artwork) {
    artwork.currentPrice = amount;
    artwork.totalBids += 1;
  }
  
  // Outbid previous bids
  bids.forEach(bid => {
    if (bid.artworkId === artworkId && bid.status === 'active') {
      bid.status = 'outbid';
    }
  });
  
  bids.push(newBid);
  return newBid;
};

export const getArtworksByCategory = (categoryId: string): Artwork[] => {
  return artworks.filter(artwork => artwork.category === categoryId);
};

export const getArtworksBySeller = (sellerId: string): Artwork[] => {
  return artworks.filter(artwork => artwork.sellerId === sellerId);
};

export const getActiveAuctions = (): Auction[] => {
  return auctions.filter(auction => auction.status === 'active');
};

export const getUpcomingAuctions = (): Auction[] => {
  return auctions.filter(auction => auction.status === 'upcoming');
};

export const getEndedAuctions = (): Auction[] => {
  return auctions.filter(auction => auction.status === 'ended');
};
