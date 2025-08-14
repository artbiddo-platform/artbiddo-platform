'use client';

import { useState, useEffect } from 'react';
import { TokenPackage } from '@/lib/tokenSystem';

export default function TokensPage() {
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [userTokens, setUserTokens] = useState(0);

  const tokenPackages: TokenPackage[] = [
    {
      id: 'starter',
      tokens: 50,
      price: 25,
      pricePerToken: 0.5,
      bonus: 0
    },
    {
      id: 'popular',
      tokens: 100,
      price: 45,
      pricePerToken: 0.45,
      bonus: 10,
      popular: true
    },
    {
      id: 'premium',
      tokens: 250,
      price: 100,
      pricePerToken: 0.4,
      bonus: 50
    },
    {
      id: 'vip',
      tokens: 500,
      price: 180,
      pricePerToken: 0.36,
      bonus: 150
    },
    {
      id: 'collector',
      tokens: 1000,
      price: 300,
      pricePerToken: 0.3,
      bonus: 400
    }
  ];

  useEffect(() => {
    // Simular carga de tokens del usuario
    setUserTokens(25);
  }, []);

  const handlePurchase = async (packageId: string) => {
    setLoading(true);
    try {
      // Aquí iría la lógica de compra con Stripe
      console.log('Comprando paquete:', packageId);
      
      // Simular proceso de pago
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Actualizar tokens del usuario
      const pkg = tokenPackages.find(p => p.id === packageId);
      if (pkg) {
        setUserTokens(prev => prev + pkg.tokens + (pkg.bonus || 0));
      }
      
      alert('¡Compra exitosa! Tus tokens han sido añadidos a tu cuenta.');
    } catch (error) {
      console.error('Error en la compra:', error);
      alert('Error en la compra. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const getTotalTokens = (packageId: string) => {
    const pkg = tokenPackages.find(p => p.id === packageId);
    if (!pkg) return 0;
    return pkg.tokens + (pkg.bonus || 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tokens ArtBiddo</h1>
              <p className="text-gray-600 mt-2">Compra tokens para pujar en nuestras subastas exclusivas</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Tus tokens actuales</p>
              <p className="text-2xl font-bold text-blue-600">{userTokens} 💎</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Información sobre tokens */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">¿Cómo funcionan los tokens?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💰</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">1. Compra Tokens</h3>
                <p className="text-gray-600">Elige el paquete que mejor se adapte a ti</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎨</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">2. Puja en Subastas</h3>
                <p className="text-gray-600">Usa 1 token por cada puja que hagas</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏆</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">3. Gana y Compra</h3>
                <p className="text-gray-600">Si ganas, la obra se añade a tu carrito</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-3">💡 Ventajas del sistema de tokens:</h3>
            <ul className="space-y-2 text-blue-800">
              <li>• <strong>Pujas justas:</strong> Cada puja vale exactamente 1 token</li>
              <li>• <strong>Sin sorpresas:</strong> Sabes exactamente cuánto gastas</li>
              <li>• <strong>Bonificaciones:</strong> Paquetes más grandes = más tokens gratis</li>
              <li>• <strong>Experiencia premium:</strong> Solo obras de calidad en ArtBiddo</li>
            </ul>
          </div>
        </div>

        {/* Paquetes de tokens */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {tokenPackages.map((pkg) => (
            <div
              key={pkg.id}
              className={`bg-white rounded-lg shadow-lg p-6 relative transition-transform hover:scale-105 ${
                pkg.popular ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Más Popular
                  </span>
                </div>
              )}

              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2 capitalize">
                  {pkg.id === 'starter' && 'Inicial'}
                  {pkg.id === 'popular' && 'Popular'}
                  {pkg.id === 'premium' && 'Premium'}
                  {pkg.id === 'vip' && 'VIP'}
                  {pkg.id === 'collector' && 'Coleccionista'}
                </h3>

                <div className="mb-4">
                  <p className="text-3xl font-bold text-blue-600">
                    {getTotalTokens(pkg.id)}
                  </p>
                  <p className="text-sm text-gray-600">tokens</p>
                </div>

                <div className="mb-4">
                  <p className="text-2xl font-bold text-gray-900">€{pkg.price}</p>
                  <p className="text-sm text-gray-600">
                    €{pkg.pricePerToken.toFixed(2)} por token
                  </p>
                </div>

                {pkg.bonus && pkg.bonus > 0 && (
                  <div className="mb-4 p-2 bg-green-100 rounded-lg">
                    <p className="text-sm font-semibold text-green-800">
                      +{pkg.bonus} tokens gratis
                    </p>
                  </div>
                )}

                <button
                  onClick={() => handlePurchase(pkg.id)}
                  disabled={loading}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                    loading
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {loading ? 'Procesando...' : 'Comprar Ahora'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Información adicional */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Términos y Condiciones</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Los tokens no son reembolsables</li>
              <li>• Cada puja consume exactamente 1 token</li>
              <li>• Los tokens no expiran</li>
              <li>• Solo se pueden usar en subastas de ArtBiddo</li>
              <li>• Los precios incluyen IVA</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">❓ Preguntas Frecuentes</h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-semibold text-gray-900">¿Qué pasa si no gano la subasta?</p>
                <p className="text-gray-600">Los tokens gastados en pujas no se devuelven, pero puedes seguir pujando en otras subastas.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">¿Puedo transferir tokens a otro usuario?</p>
                <p className="text-gray-600">No, los tokens son personales e intransferibles.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">¿Los tokens tienen fecha de caducidad?</p>
                <p className="text-gray-600">No, los tokens no expiran y puedes usarlos cuando quieras.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">¿Listo para empezar a pujar?</h2>
          <p className="text-blue-100 mb-6">
            Únete a nuestra comunidad de coleccionistas y descubre obras únicas
          </p>
          <button
            onClick={() => window.location.href = '/auctions'}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Ver Subastas Activas
          </button>
        </div>
      </div>
    </div>
  );
}
