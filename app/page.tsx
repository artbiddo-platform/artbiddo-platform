import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowRight, Clock, Euro, Users, Award, Shield, Star, TrendingUp } from 'lucide-react';

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

async function getFeaturedArtworks(): Promise<Artwork[]> {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/artworks?limit=6&sortBy=most-bids`, {
      cache: 'no-store'
    });
    const data = await response.json();
    return (data.artworks || []).map((artwork: any) => ({
      ...artwork,
      endDate: new Date(artwork.endDate),
      createdAt: new Date(artwork.createdAt)
    }));
  } catch (error) {
    console.error('Error fetching featured artworks:', error);
    return [];
  }
}

async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/categories`, {
      cache: 'no-store'
    });
    const data = await response.json();
    return data.categories || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function Home() {
  const [featuredArtworks, categories] = await Promise.all([
    getFeaturedArtworks(),
    getCategories()
  ]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section - Elegante y minimalista */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background con imagen de arte */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=1080&fit=crop"
            alt="Arte de fondo"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>
        
        {/* Contenido central */}
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-light mb-4 sm:mb-6 tracking-tight">
            ARTBIDDO
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 font-light tracking-wide text-gray-200 px-4">
            Subastas de Arte Contemporáneo
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4">
            <Link
              href="/subastas"
              className="bg-white text-black px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg font-medium hover:bg-gray-100 transition-all duration-300 uppercase tracking-wider w-full sm:w-auto text-center"
            >
              Ver Subastas
            </Link>
            <Link
              href="/register"
              className="border-2 border-white text-white px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg font-medium hover:bg-white hover:text-black transition-all duration-300 uppercase tracking-wider w-full sm:w-auto text-center"
            >
              Registrarse
            </Link>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Stats Section - Elegante */}
      <section className="py-12 sm:py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-12 text-center">
            <div>
              <div className="text-2xl sm:text-4xl md:text-5xl font-light mb-1 sm:mb-2">€2.8B</div>
              <div className="text-gray-400 uppercase tracking-wider text-xs sm:text-sm">Ventas Anuales</div>
            </div>
            <div>
              <div className="text-2xl sm:text-4xl md:text-5xl font-light mb-1 sm:mb-2">15,000+</div>
              <div className="text-gray-400 uppercase tracking-wider text-xs sm:text-sm">Coleccionistas</div>
            </div>
            <div>
              <div className="text-2xl sm:text-4xl md:text-5xl font-light mb-1 sm:mb-2">250+</div>
              <div className="text-gray-400 uppercase tracking-wider text-xs sm:text-sm">Subastas por Año</div>
            </div>
            <div>
              <div className="text-2xl sm:text-4xl md:text-5xl font-light mb-1 sm:mb-2">2024</div>
              <div className="text-gray-400 uppercase tracking-wider text-xs sm:text-sm">Año de Fundación</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Auctions */}
      <section className="py-12 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-3 sm:mb-4 tracking-wide">
              Subastas Destacadas
            </h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-4">
              Descubre las obras más importantes de nuestra próxima temporada
            </p>
          </div>
          
          {featuredArtworks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {featuredArtworks.map((artwork) => (
                <Link
                  key={artwork.id}
                  href={`/obra/${artwork.id}`}
                  className="group bg-white hover:shadow-2xl transition-all duration-500"
                >
                  <div className="relative h-64 sm:h-80 overflow-hidden">
                    <Image
                      src={artwork.image}
                      alt={artwork.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-black bg-opacity-75 text-white px-2 sm:px-3 py-1 text-xs sm:text-sm">
                      {artwork.totalBids} pujas
                    </div>
                    <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 bg-white px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium">
                      €{artwork.currentPrice.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2 group-hover:text-gray-600 transition-colors">
                      {artwork.title}
                    </h3>
                    <p className="text-gray-600 mb-2 font-light text-sm sm:text-base">{artwork.artist}</p>
                    <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">{artwork.medium}, {artwork.year}</p>
                    <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500">
                      <span>Estimado: €{artwork.estimatedValue.toLocaleString()}</span>
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-base sm:text-lg">No hay subastas disponibles en este momento.</p>
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-3 sm:mb-4 tracking-wide">
              Categorías de Arte
            </h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-4">
              Explora nuestra colección especializada en diferentes técnicas y períodos
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {categories.map((category: Category) => (
              <Link
                key={category.id}
                href={`/subastas?categoryId=${category.id}`}
                className="group relative h-64 sm:h-96 overflow-hidden bg-gray-900"
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300"></div>
                <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 text-white">
                  <h3 className="text-xl sm:text-2xl font-medium mb-2 group-hover:text-gray-200 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-200 text-xs sm:text-sm mb-3 sm:mb-4 opacity-90">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-medium">
                      {category.artworkCount} obras
                    </span>
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-12 sm:py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-light mb-4 sm:mb-6 tracking-wide">
                ArtBiddo
              </h2>
              <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8 leading-relaxed">
                ArtBiddo es la plataforma líder en subastas de arte contemporáneo en línea. 
                Conectamos a coleccionistas con obras únicas de artistas reconocidos y emergentes, 
                ofreciendo una experiencia de subasta profesional y accesible.
              </p>
              <div className="grid grid-cols-2 gap-6 sm:gap-8">
                <div>
                  <div className="text-2xl sm:text-3xl font-light mb-1 sm:mb-2">50+</div>
                  <div className="text-gray-400 text-xs sm:text-sm uppercase tracking-wider">Países</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-light mb-1 sm:mb-2">100+</div>
                  <div className="text-gray-400 text-xs sm:text-sm uppercase tracking-wider">Especialistas</div>
                </div>
              </div>
            </div>
            <div className="relative h-64 sm:h-96">
              <Image
                src="https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=400&fit=crop"
                alt="ArtBiddo"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-light mb-4 sm:mb-6 tracking-wide">
            Únete a ArtBiddo
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 mb-8 sm:mb-12 max-w-2xl mx-auto px-4">
            Descubre obras de arte excepcionales y participa en subastas exclusivas 
            con coleccionistas de todo el mundo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
            <Link
              href="/register"
              className="bg-white text-black px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg font-medium hover:bg-gray-100 transition-all duration-300 uppercase tracking-wider w-full sm:w-auto text-center"
            >
              Crear Cuenta
            </Link>
            <Link
              href="/subastas"
              className="border-2 border-white text-white px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg font-medium hover:bg-white hover:text-black transition-all duration-300 uppercase tracking-wider w-full sm:w-auto text-center"
            >
              Ver Subastas
            </Link>
          </div>
        </div>
      </section>

      {/* Tokens Section */}
      <section className="py-12 sm:py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-light mb-3 sm:mb-4 tracking-wide">
              Sistema de Tokens
            </h2>
            <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto px-4">
              Puja con tokens virtuales y gana obras de arte reales. 
              Un sistema único que combina diversión y valor real.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💎</span>
              </div>
              <h3 className="text-xl font-medium mb-2">Compra Tokens</h3>
              <p className="text-blue-100">Adquiere paquetes de tokens desde €25. Mientras más compres, mejor precio.</p>
            </div>
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-medium mb-2">Puja y Gana</h3>
              <p className="text-blue-100">Usa tus tokens para pujar en subastas. 1 token = 1 puja.</p>
            </div>
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-xl font-medium mb-2">Obra Real</h3>
              <p className="text-blue-100">Si ganas, la obra aparece en tu carrito al precio real para comprarla.</p>
            </div>
          </div>
          
          <div className="text-center">
            <Link
              href="/tokens"
              className="bg-white text-blue-600 px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg font-medium hover:bg-gray-100 transition-all duration-300 uppercase tracking-wider inline-block"
            >
              Comprar Tokens
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-3 sm:mb-4 tracking-wide">
              Cómo Funciona
            </h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-4">
              Proceso simple y transparente para participar en nuestras subastas
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-gray-600">1</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Regístrate</h3>
              <p className="text-gray-600 text-sm">Crea tu cuenta gratuita en menos de 2 minutos</p>
            </div>
            <div className="text-center">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-gray-600">2</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Compra Tokens</h3>
              <p className="text-gray-600 text-sm">Adquiere tokens para participar en las subastas</p>
            </div>
            <div className="text-center">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-gray-600">3</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Puja</h3>
              <p className="text-gray-600 text-sm">Participa en subastas en tiempo real</p>
            </div>
            <div className="text-center">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-gray-600">4</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Gana</h3>
              <p className="text-gray-600 text-sm">Si ganas, compra la obra al precio real</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-3 sm:mb-4 tracking-wide">
              Lo Que Dicen Nuestros Coleccionistas
            </h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-4">
              Experiencias reales de coleccionistas que han encontrado obras únicas
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-semibold">MG</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">María García</h4>
                  <p className="text-sm text-gray-600">Coleccionista desde 2020</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                "ArtBiddo ha revolucionado mi forma de coleccionar arte. El sistema de tokens es genial y he encontrado obras increíbles."
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-green-600 font-semibold">CL</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Carlos López</h4>
                  <p className="text-sm text-gray-600">Inversor de Arte</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                "La calidad de las obras y la transparencia del proceso me han convertido en un usuario fiel. Excelente plataforma."
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-purple-600 font-semibold">AM</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Ana Martínez</h4>
                  <p className="text-sm text-gray-600">Galerista</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                "Como galerista, aprecio la profesionalidad de ArtBiddo. El sistema de verificación de obras es impecable."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-12 sm:py-20 bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-light mb-4 sm:mb-6 tracking-wide">
            ¿Listo para Empezar?
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 mb-8 sm:mb-12 max-w-2xl mx-auto px-4">
            Únete a miles de coleccionistas que ya han descubierto obras únicas en ArtBiddo
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
            <Link
              href="/register"
              className="bg-white text-black px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg font-medium hover:bg-gray-100 transition-all duration-300 uppercase tracking-wider w-full sm:w-auto text-center"
            >
              Crear Cuenta Gratis
            </Link>
            <Link
              href="/tokens"
              className="border-2 border-white text-white px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg font-medium hover:bg-white hover:text-black transition-all duration-300 uppercase tracking-wider w-full sm:w-auto text-center"
            >
              Comprar Tokens
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
