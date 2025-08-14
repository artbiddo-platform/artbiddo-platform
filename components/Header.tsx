'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Search, User, Heart, Bell } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();

  // Ocultar header en rutas de admin
  if (pathname.startsWith('/admin')) {
    return null;
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="text-xl sm:text-2xl font-light tracking-wider">
            ARTBIDDO
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/subastas" 
              className={`font-light tracking-wide transition-colors ${
                isScrolled ? 'text-gray-900 hover:text-gray-600' : 'text-white hover:text-gray-200'
              }`}
            >
              Subastas
            </Link>
            <Link 
              href="/categorias" 
              className={`font-light tracking-wide transition-colors ${
                isScrolled ? 'text-gray-900 hover:text-gray-600' : 'text-white hover:text-gray-200'
              }`}
            >
              Categorías
            </Link>
            <Link 
              href="/artistas" 
              className={`font-light tracking-wide transition-colors ${
                isScrolled ? 'text-gray-900 hover:text-gray-600' : 'text-white hover:text-gray-200'
              }`}
            >
              Artistas
            </Link>
            <Link 
              href="/sobre-nosotros" 
              className={`font-light tracking-wide transition-colors ${
                isScrolled ? 'text-gray-900 hover:text-gray-600' : 'text-white hover:text-gray-200'
              }`}
            >
              Sobre Nosotros
            </Link>
            <Link 
              href="/tokens" 
              className={`font-light tracking-wide transition-colors ${
                isScrolled ? 'text-gray-900 hover:text-gray-600' : 'text-white hover:text-gray-200'
              }`}
            >
              💎 Tokens
            </Link>
            <Link 
              href="/sell" 
              className={`font-light tracking-wide transition-colors ${
                isScrolled ? 'text-gray-900 hover:text-gray-600' : 'text-white hover:text-gray-200'
              }`}
            >
              Vender
            </Link>
          </nav>

          {/* User Menu / Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {/* Token Display */}
                <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg">
                  <span className="text-blue-600 text-sm font-medium">💎</span>
                  <span className="text-blue-600 text-sm font-medium">
                    {user.tokens || 0} tokens
                  </span>
                </div>
                
                {/* User Menu */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-sm font-medium transition-colors">
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 text-sm font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span className={`${
                      isScrolled ? 'text-gray-900' : 'text-white'
                    }`}>
                      {user.name}
                    </span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link 
                      href="/perfil" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Mi Perfil
                    </Link>
                    <Link 
                      href="/tokens" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      💎 Comprar Tokens
                    </Link>
                    <Link 
                      href="/subastas" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Mis Subastas
                    </Link>
                    <hr className="my-2" />
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  href="/login" 
                  className={`font-light tracking-wide transition-colors ${
                    isScrolled ? 'text-gray-900 hover:text-gray-600' : 'text-white hover:text-gray-200'
                  }`}
                >
                  Iniciar Sesión
                </Link>
                <Link 
                  href="/register" 
                  className={`bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors ${
                    isScrolled ? 'text-black' : 'text-black'
                  }`}
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden p-2 transition-colors ${
              isScrolled ? 'text-gray-900' : 'text-white'
            }`}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <nav className="px-4 py-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Link 
                  href="/subastas" 
                  className="block text-gray-900 hover:text-gray-600 font-light text-center py-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Subastas
                </Link>
                <Link 
                  href="/categorias" 
                  className="block text-gray-900 hover:text-gray-600 font-light text-center py-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Categorías
                </Link>
                <Link 
                  href="/artistas" 
                  className="block text-gray-900 hover:text-gray-600 font-light text-center py-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Artistas
                </Link>
                <Link 
                  href="/sobre-nosotros" 
                  className="block text-gray-900 hover:text-gray-600 font-light text-center py-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sobre Nosotros
                </Link>
                <Link 
                  href="/tokens" 
                  className="block text-gray-900 hover:text-gray-600 font-light text-center py-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  💎 Tokens
                </Link>
                <Link 
                  href="/sell" 
                  className="block text-gray-900 hover:text-gray-600 font-light text-center py-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Vender
                </Link>
              </div>
              
              <hr className="my-6" />
              
              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <User className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-900 font-light">{user.name}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Link 
                      href="/perfil" 
                      className="block text-gray-900 hover:text-gray-600 font-light text-center py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Mi Perfil
                    </Link>
                    <Link 
                      href="/mis-pujas" 
                      className="block text-gray-900 hover:text-gray-600 font-light text-center py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Mis Pujas
                    </Link>
                    <Link 
                      href="/favoritos" 
                      className="block text-gray-900 hover:text-gray-600 font-light text-center py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Favoritos
                    </Link>
                    <button 
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-gray-900 hover:text-gray-600 font-light text-center py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Link 
                    href="/login" 
                    className="block text-gray-900 hover:text-gray-600 font-light text-center py-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Iniciar Sesión
                  </Link>
                  <Link 
                    href="/register" 
                    className="block px-6 py-3 border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300 uppercase tracking-wider text-sm text-center rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Registrarse
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
