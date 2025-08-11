export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isVerified: boolean;
}

export interface Artwork {
  id: string;
  title: string;
  artist: string;
  description: string;
  image: string;
  category: string;
  year: number;
  dimensions: string;
  medium: string;
  startingPrice: number;
  currentPrice: number;
  estimatedValue: number;
  auctionEndDate: Date;
  isActive: boolean;
  bids: Bid[];
  totalBids: number;
}

export interface Bid {
  id: string;
  amount: number;
  userId: string;
  userName: string;
  timestamp: Date;
}

export interface Auction {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  artworks: Artwork[];
  isActive: boolean;
  totalParticipants: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
}
