'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';

export default function ContentManagement() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState<any>({
    header: {
      logo: 'ARTBIDDO',
      menuItems: [
        { name: 'Subastas', href: '/subastas' },
        { name: 'Categorías', href: '/categorias' },
        { name: 'Artistas', href: '/artistas' },
        { name: 'Sobre Nosotros', href: '/sobre-nosotros' }
      ]
    },
    home: {
      hero: {
        title: 'Descubre Obras de Arte Únicas',
        subtitle: 'Subastas exclusivas de arte contemporáneo y clásico',
        cta: 'Explorar Subastas'
      },
      features: [
        {
          title: 'Arte Exclusivo',
          description: 'Obras únicas de artistas reconocidos y emergentes'
        },
        {
          title: 'Subastas en Tiempo Real',
          description: 'Participa en subastas en vivo con pujas en tiempo real'
        },
        {
          title: 'Garantía de Autenticidad',
          description: 'Todas las obras están certificadas y autenticadas'
        }
      ]
    },
    about: {
      title: 'Sobre ArtBiddo',
      content: 'Somos la plataforma líder en subastas de arte online, conectando artistas, coleccionistas y amantes del arte.'
    },
    contact: {
      title: 'Contacto',
      email: 'info@artbiddo.es',
      phone: '+34 900 123 456'
    },
    theme: {
      primaryColor: '#3B82F6',
      secondaryColor: '#1F2937',
      accentColor: '#10B981'
    },
    seo: {
      title: 'ArtBiddo - Subastas de Arte Online',
      description: 'Descubre obras únicas en nuestras subastas de arte contemporáneo y clásico',
      keywords: 'arte, subastas, pinturas, esculturas, coleccionismo'
    },
    pricing: {
      commission: 15,
      minBid: 50,
      reserveFee: 100
    },
    images: {
      logo: '/logo.png',
      heroImage: '/hero-bg.jpg',
      favicon: '/favicon.ico'
    }
  });
  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  // Authentication check
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('adminToken');
      const user = localStorage.getItem('adminUser');
      
      if (!token || !user) {
        router.push('/admin/login');
        return;
      }
      
      // Simple token validation (in production, validate with backend)
      try {
        const userData = JSON.parse(user);
        if (userData.role !== 'admin') {
          router.push('/admin/login');
          return;
        }
        setIsAuthenticated(true);
    } catch (error) {
        router.push('/admin/login');
        return;
    }
      
      setIsLoading(false);
  };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleEdit = (path: string, value: string) => {
    setEditing(path);
    setEditValue(value);
  };

  const handleSave = (path: string) => {
    const keys = path.split('.');
    const newContent = { ...content };
    let current = newContent;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = editValue;
    setContent(newContent);
    setEditing(null);
    setEditValue('');
  };

  const handleCancel = () => {
    setEditing(null);
    setEditValue('');
  };

  const getValue = (obj: any, path: string) => {
    const keys = path.split('.');
    let current = obj;
    
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return '';
      }
    }
    
    return current;
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Panel de Administración
            </h1>
            <p className="text-gray-600">
              Gestiona todo el contenido de tu plataforma de subastas
            </p>
          </div>

          {/* Content Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Header Content */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Header</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo
                  </label>
                  {editing === 'header.logo' ? (
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="flex-1 border border-gray-300 rounded px-3 py-2"
                      />
                      <button
                        onClick={() => handleSave('header.logo')}
                        className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-3 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-900">{getValue(content, 'header.logo')}</span>
                <button
                        onClick={() => handleEdit('header.logo', getValue(content, 'header.logo'))}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Editar
                </button>
                    </div>
                  )}
                </div>
              </div>
          </div>

            {/* Home Content */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Página Principal</h2>
              <div className="space-y-4">
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título Hero
                  </label>
                  {editing === 'home.hero.title' ? (
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="flex-1 border border-gray-300 rounded px-3 py-2"
                      />
                      <button
                        onClick={() => handleSave('home.hero.title')}
                        className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-3 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-900">{getValue(content, 'home.hero.title')}</span>
                      <button
                        onClick={() => handleEdit('home.hero.title', getValue(content, 'home.hero.title'))}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Editar
                      </button>
                    </div>
                  )}
                    </div>
                </div>
              </div>

            {/* About Content */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Sobre Nosotros</h2>
              <div className="space-y-4">
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contenido
                  </label>
                  {editing === 'about.content' ? (
                    <div className="space-y-2">
                      <textarea
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        rows={4}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleSave('about.content')}
                          className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Guardar
                        </button>
                        <button
                          onClick={handleCancel}
                          className="px-3 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                        >
                          Cancelar
                        </button>
                </div>
              </div>
                  ) : (
                    <div className="flex justify-between items-start">
                      <p className="text-gray-900 flex-1">{getValue(content, 'about.content')}</p>
                      <button
                        onClick={() => handleEdit('about.content', getValue(content, 'about.content'))}
                        className="text-blue-600 hover:text-blue-800 ml-4"
                      >
                        Editar
                      </button>
                    </div>
                  )}
                    </div>
                </div>
            </div>

            {/* Contact Content */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Contacto</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  {editing === 'contact.email' ? (
                    <div className="flex space-x-2">
                      <input
                        type="email"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="flex-1 border border-gray-300 rounded px-3 py-2"
                      />
                      <button
                        onClick={() => handleSave('contact.email')}
                        className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-3 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-900">{getValue(content, 'contact.email')}</span>
                      <button
                        onClick={() => handleEdit('contact.email', getValue(content, 'contact.email'))}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Editar
                      </button>
              </div>
            )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
