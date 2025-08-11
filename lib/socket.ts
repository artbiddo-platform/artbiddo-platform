export interface BidData {
  artworkId: string;
  amount: number;
  userId: string;
  userName: string;
}

// Placeholder para funcionalidad de socket (se implementará en producción)
export const initSocket = () => {
  console.log('Socket server initialization not implemented for App Router');
  return null;
};

export const emitBidUpdate = (artworkId: string, bidData: BidData) => {
  console.log('Bid update emitted:', { artworkId, bidData });
  // Se implementará cuando se configure el socket real
};

export const emitPriceUpdate = (artworkId: string, newPrice: number) => {
  console.log('Price update emitted:', { artworkId, newPrice });
  // Se implementará cuando se configure el socket real
};
