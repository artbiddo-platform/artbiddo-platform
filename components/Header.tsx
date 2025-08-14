'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Search, Heart, Bell, ShoppingCart } from 'lucide-react';

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
      setIsScrolled(window.scrollY > 0);
    };

    // Verificar usuario al cargar
    const checkUser = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    checkUser();

    // Escuchar cambios en localStorage
    const handleStorageChange = () => {
      checkUser();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', checkUser);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', checkUser);
    };
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className={`text-2xl font-bold transition-colors ${
              isScrolled ? 'text-gray-900' : 'text-white'
            }`}>
            ARTBIDDO
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/subastas" 
              className={`font-medium transition-colors ${
                isScrolled ? 'text-gray-900 hover:text-blue-600' : 'text-white hover:text-blue-200'
              }`}
            >
              Subastas
            </Link>
            <Link 
              href="/categorias" 
              className={`font-medium transition-colors ${
                isScrolled ? 'text-gray-900 hover:text-blue-600' : 'text-white hover:text-blue-200'
              }`}
            >
              Categorías
            </Link>
            <Link 
              href="/artistas" 
              className={`font-medium transition-colors ${
                isScrolled ? 'text-gray-900 hover:text-blue-600' : 'text-white hover:text-blue-200'
              }`}
            >
              Artistas
            </Link>
            <Link 
              href="/about" 
              className={`font-medium transition-colors ${
                isScrolled ? 'text-gray-900 hover:text-blue-600' : 'text-white hover:text-blue-200'
              }`}
            >
              Sobre Nosotros
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
                    {user.role === 'ADMIN' && (
                      <Link 
                        href="/admin/dashboard" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Panel Admin
                      </Link>
                    )}
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
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isScrolled ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-white text-black hover:bg-gray-100'
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
            className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        </div>

      {/* Mobile menu */}
        {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
                <Link 
                  href="/subastas" 
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                >
                  Subastas
                </Link>
                <Link 
                  href="/categorias" 
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                >
                  Categorías
                </Link>
                <Link 
                  href="/artistas" 
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                >
                  Artistas
                </Link>
                <Link 
              href="/about" 
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                >
                  Sobre Nosotros
                </Link>
              
              {user ? (
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex items-center px-3">
                  <div className="flex-shrink-0">
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="h-10 w-10 rounded-full"
                      />
                    ) : (
                      <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">{user.name}</div>
                    <div className="text-sm font-medium text-gray-500">
                      💎 {user.tokens || 0} tokens
                    </div>
                  </div>
                  </div>
                <div className="mt-3 space-y-1">
                    <Link 
                      href="/perfil" 
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                    >
                      Mi Perfil
                    </Link>
                    <Link 
                    href="/tokens" 
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                    >
                    💎 Comprar Tokens
                    </Link>
                    <Link 
                    href="/subastas" 
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                  >
                    Mis Subastas
                  </Link>
                  {user.role === 'ADMIN' && (
                    <Link 
                      href="/admin/dashboard" 
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                    >
                      Panel Admin
                    </Link>
                  )}
                    <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:text-red-900 hover:bg-gray-50 rounded-md"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              ) : (
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="space-y-1">
                  <Link 
                    href="/login" 
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                  >
                    Iniciar Sesión
                  </Link>
                  <Link 
                    href="/register" 
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                  >
                    Registrarse
                  </Link>
                </div>
          </div>
        )}
      </div>
        </div>
      )}
    </header>
  );
}
