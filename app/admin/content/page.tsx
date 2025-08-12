'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ContentManagement() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('home');
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

  const handleEdit = (path: string, value: string) => {
    setEditing(path);
    setEditValue(value);
  };

  const handleSave = (path: string) => {
    const pathArray = path.split('.');
    const newContent = { ...content };
    let current = newContent;
    
    for (let i = 0; i < pathArray.length - 1; i++) {
      current = current[pathArray[i]];
    }
    
    current[pathArray[pathArray.length - 1]] = editValue;
    setContent(newContent);
    setEditing(null);
    setEditValue('');
  };

  const handleCancel = () => {
    setEditing(null);
    setEditValue('');
  };

  const handleImageUpload = (field: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const newContent = { ...content };
      newContent.images[field] = e.target?.result as string;
      setContent(newContent);
    };
    reader.readAsDataURL(file);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    router.push('/admin/login');
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
            <h1 className="text-2xl font-bold text-gray-900">
                Panel de Administración
            </h1>
              <p className="text-sm text-gray-600">
                Gestiona el contenido de tu plataforma
              </p>
            </div>
            <div className="flex space-x-3">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Guardar Cambios
              </button>
              <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                Vista Previa
              </button>
              <button 
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
          </div>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-4">Secciones</h2>
              <nav className="space-y-2">
                {[
                  { id: 'header', name: 'Header/Navegación', icon: '🔝' },
                  { id: 'home', name: 'Página Principal', icon: '🏠' },
                  { id: 'about', name: 'Sobre Nosotros', icon: 'ℹ️' },
                  { id: 'contact', name: 'Contacto', icon: '📞' },
                  { id: 'images', name: 'Imágenes', icon: '🖼️' },
                  { id: 'theme', name: 'Tema & Colores', icon: '🎨' },
                  { id: 'seo', name: 'SEO', icon: '🔍' },
                  { id: 'pricing', name: 'Precios', icon: '💰' },
                  { id: 'users', name: 'Usuarios', icon: '👥' },
                  { id: 'settings', name: 'Configuración', icon: '⚙️' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                    <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow">
              {/* Header/Navigation Content */}
              {activeTab === 'header' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Header & Navegación</h2>
                  
                  {/* Logo */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium mb-4 text-gray-900">Logo</h3>
                    <div className="border rounded-lg p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Texto del Logo
                      </label>
                      {editing === 'header.logo' ? (
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <button
                            onClick={() => handleSave('header.logo')}
                            className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700"
                          >
                            ✓
                          </button>
                          <button
                            onClick={handleCancel}
                            className="bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center">
                          <p className="text-gray-900 font-bold text-xl">{content.header.logo}</p>
                          <button
                            onClick={() => handleEdit('header.logo', content.header.logo)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            ✏️ Editar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium mb-4 text-gray-900">Elementos del Menú</h3>
                    <div className="space-y-4">
                      {content.header.menuItems.map((item: any, index: number) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-gray-900">Elemento {index + 1}</h4>
                            <button className="text-blue-600 hover:text-blue-800">
                              ✏️ Editar
                            </button>
                          </div>
                          <p className="text-gray-700 mb-2"><strong>Nombre:</strong> {item.name}</p>
                          <p className="text-gray-700"><strong>Enlace:</strong> {item.href}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Home Page Content */}
              {activeTab === 'home' && (
          <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Página Principal</h2>
                  
                  {/* Hero Section */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium mb-4 text-gray-900">Sección Hero</h3>
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Título Principal
                        </label>
                        {editing === 'home.hero.title' ? (
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                              onClick={() => handleSave('home.hero.title')}
                              className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700"
                            >
                              ✓
                            </button>
                            <button
                              onClick={handleCancel}
                              className="bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-between items-center">
                            <p className="text-gray-900">{content.home.hero.title}</p>
                            <button
                              onClick={() => handleEdit('home.hero.title', content.home.hero.title)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              ✏️ Editar
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="border rounded-lg p-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Subtítulo
                        </label>
                        {editing === 'home.hero.subtitle' ? (
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                              onClick={() => handleSave('home.hero.subtitle')}
                              className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700"
                            >
                              ✓
                            </button>
                            <button
                              onClick={handleCancel}
                              className="bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-between items-center">
                            <p className="text-gray-900">{content.home.hero.subtitle}</p>
                            <button
                              onClick={() => handleEdit('home.hero.subtitle', content.home.hero.subtitle)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              ✏️ Editar
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="border rounded-lg p-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Botón CTA
                        </label>
                        {editing === 'home.hero.cta' ? (
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                              onClick={() => handleSave('home.hero.cta')}
                              className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700"
                            >
                              ✓
                            </button>
                            <button
                              onClick={handleCancel}
                              className="bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-between items-center">
                            <p className="text-gray-900">{content.home.hero.cta}</p>
                            <button
                              onClick={() => handleEdit('home.hero.cta', content.home.hero.cta)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              ✏️ Editar
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Features Section */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium mb-4 text-gray-900">Características</h3>
                    <div className="space-y-4">
                      {content.home.features.map((feature: any, index: number) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-gray-900">Característica {index + 1}</h4>
                            <button className="text-blue-600 hover:text-blue-800">
                              ✏️ Editar
                            </button>
                          </div>
                          <p className="text-gray-700 mb-2"><strong>Título:</strong> {feature.title}</p>
                          <p className="text-gray-700"><strong>Descripción:</strong> {feature.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* About Page Content */}
              {activeTab === 'about' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Sobre Nosotros</h2>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Título
                      </label>
                      {editing === 'about.title' ? (
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <button
                            onClick={() => handleSave('about.title')}
                            className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700"
                          >
                            ✓
                          </button>
                          <button
                            onClick={handleCancel}
                            className="bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center">
                          <p className="text-gray-900">{content.about.title}</p>
                          <button
                            onClick={() => handleEdit('about.title', content.about.title)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            ✏️ Editar
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="border rounded-lg p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contenido
                      </label>
                      {editing === 'about.content' ? (
                        <div className="space-y-2">
                          <textarea
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            rows={4}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleSave('about.content')}
                              className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700"
                            >
                              ✓ Guardar
                            </button>
                            <button
                              onClick={handleCancel}
                              className="bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700"
                            >
                              ✕ Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-start">
                          <p className="text-gray-900">{content.about.content}</p>
                          <button
                            onClick={() => handleEdit('about.content', content.about.content)}
                            className="text-blue-600 hover:text-blue-800 ml-4"
                          >
                            ✏️ Editar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Page Content */}
              {activeTab === 'contact' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Contacto</h2>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      {editing === 'contact.email' ? (
                        <div className="flex space-x-2">
                          <input
                            type="email"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <button
                            onClick={() => handleSave('contact.email')}
                            className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700"
                          >
                            ✓
                          </button>
                          <button
                            onClick={handleCancel}
                            className="bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center">
                          <p className="text-gray-900">{content.contact.email}</p>
                          <button
                            onClick={() => handleEdit('contact.email', content.contact.email)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            ✏️ Editar
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="border rounded-lg p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Teléfono
                      </label>
                      {editing === 'contact.phone' ? (
                        <div className="flex space-x-2">
                          <input
                            type="tel"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <button
                            onClick={() => handleSave('contact.phone')}
                            className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700"
                          >
                            ✓
                          </button>
                          <button
                            onClick={handleCancel}
                            className="bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center">
                          <p className="text-gray-900">{content.contact.phone}</p>
                          <button
                            onClick={() => handleEdit('contact.phone', content.contact.phone)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            ✏️ Editar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Images Management */}
              {activeTab === 'images' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Gestión de Imágenes</h2>
                  <div className="space-y-6">
                    <div className="border rounded-lg p-4">
                      <h3 className="text-lg font-medium mb-4">Logo</h3>
                      <div className="flex items-center space-x-4">
                        <img 
                          src={content.images.logo} 
                          alt="Logo" 
                          className="w-20 h-20 object-contain border rounded"
                        />
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload('logo', file);
                            }}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          />
                          <p className="text-sm text-gray-500 mt-1">Recomendado: 200x200px, PNG</p>
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h3 className="text-lg font-medium mb-4">Imagen de Fondo Hero</h3>
                      <div className="flex items-center space-x-4">
                        <img 
                          src={content.images.heroImage} 
                          alt="Hero Background" 
                          className="w-32 h-20 object-cover border rounded"
                        />
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload('heroImage', file);
                            }}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          />
                          <p className="text-sm text-gray-500 mt-1">Recomendado: 1920x1080px, JPG</p>
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h3 className="text-lg font-medium mb-4">Favicon</h3>
                      <div className="flex items-center space-x-4">
                        <img 
                          src={content.images.favicon} 
                          alt="Favicon" 
                          className="w-8 h-8 object-contain border rounded"
                        />
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload('favicon', file);
                            }}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          />
                          <p className="text-sm text-gray-500 mt-1">Recomendado: 32x32px, ICO</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Theme & Colors */}
              {activeTab === 'theme' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Tema & Colores</h2>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Color Primario
                      </label>
                      <div className="flex items-center space-x-4">
                        <input
                          type="color"
                          value={content.theme.primaryColor}
                          onChange={(e) => {
                            const newContent = { ...content };
                            newContent.theme.primaryColor = e.target.value;
                            setContent(newContent);
                          }}
                          className="w-12 h-12 border rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={content.theme.primaryColor}
                          onChange={(e) => {
                            const newContent = { ...content };
                            newContent.theme.primaryColor = e.target.value;
                            setContent(newContent);
                          }}
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                        />
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Color Secundario
                      </label>
                      <div className="flex items-center space-x-4">
                        <input
                          type="color"
                          value={content.theme.secondaryColor}
                          onChange={(e) => {
                            const newContent = { ...content };
                            newContent.theme.secondaryColor = e.target.value;
                            setContent(newContent);
                          }}
                          className="w-12 h-12 border rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={content.theme.secondaryColor}
                          onChange={(e) => {
                            const newContent = { ...content };
                            newContent.theme.secondaryColor = e.target.value;
                            setContent(newContent);
                          }}
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                        />
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Color de Acento
                      </label>
                      <div className="flex items-center space-x-4">
                        <input
                          type="color"
                          value={content.theme.accentColor}
                          onChange={(e) => {
                            const newContent = { ...content };
                            newContent.theme.accentColor = e.target.value;
                            setContent(newContent);
                          }}
                          className="w-12 h-12 border rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={content.theme.accentColor}
                          onChange={(e) => {
                            const newContent = { ...content };
                            newContent.theme.accentColor = e.target.value;
                            setContent(newContent);
                          }}
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SEO Settings */}
              {activeTab === 'seo' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Configuración SEO</h2>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Título de la Página
                      </label>
                      {editing === 'seo.title' ? (
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <button
                            onClick={() => handleSave('seo.title')}
                            className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700"
                          >
                            ✓
                          </button>
                          <button
                            onClick={handleCancel}
                            className="bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center">
                          <p className="text-gray-900">{content.seo.title}</p>
                          <button
                            onClick={() => handleEdit('seo.title', content.seo.title)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            ✏️ Editar
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="border rounded-lg p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descripción Meta
                      </label>
                      {editing === 'seo.description' ? (
                        <div className="space-y-2">
                          <textarea
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            rows={3}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleSave('seo.description')}
                              className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700"
                            >
                              ✓ Guardar
                            </button>
                            <button
                              onClick={handleCancel}
                              className="bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700"
                            >
                              ✕ Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-start">
                          <p className="text-gray-900">{content.seo.description}</p>
                          <button
                            onClick={() => handleEdit('seo.description', content.seo.description)}
                            className="text-blue-600 hover:text-blue-800 ml-4"
                          >
                            ✏️ Editar
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="border rounded-lg p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Palabras Clave
                      </label>
                      {editing === 'seo.keywords' ? (
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="palabra1, palabra2, palabra3"
                          />
                          <button
                            onClick={() => handleSave('seo.keywords')}
                            className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700"
                          >
                            ✓
                          </button>
                          <button
                            onClick={handleCancel}
                            className="bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center">
                          <p className="text-gray-900">{content.seo.keywords}</p>
                          <button
                            onClick={() => handleEdit('seo.keywords', content.seo.keywords)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            ✏️ Editar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Pricing Management */}
              {activeTab === 'pricing' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Gestión de Precios</h2>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Comisión (%) - Porcentaje que cobras por cada venta
                      </label>
                      {editing === 'pricing.commission' ? (
                        <div className="flex space-x-2">
                          <input
                            type="number"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            min="0"
                            max="100"
                          />
                          <button
                            onClick={() => handleSave('pricing.commission')}
                            className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700"
                          >
                            ✓
                          </button>
                          <button
                            onClick={handleCancel}
                            className="bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center">
                          <p className="text-gray-900">{content.pricing.commission}%</p>
                          <button
                            onClick={() => handleEdit('pricing.commission', content.pricing.commission.toString())}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            ✏️ Editar
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="border rounded-lg p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Puja Mínima (€) - Cantidad mínima para pujar
                      </label>
                      {editing === 'pricing.minBid' ? (
                        <div className="flex space-x-2">
                          <input
                            type="number"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            min="0"
                          />
                          <button
                            onClick={() => handleSave('pricing.minBid')}
                            className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700"
                          >
                            ✓
                          </button>
                          <button
                            onClick={handleCancel}
                            className="bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center">
                          <p className="text-gray-900">€{content.pricing.minBid}</p>
                          <button
                            onClick={() => handleEdit('pricing.minBid', content.pricing.minBid.toString())}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            ✏️ Editar
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="border rounded-lg p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tarifa de Reserva (€) - Costo para reservar una obra
                      </label>
                      {editing === 'pricing.reserveFee' ? (
                        <div className="flex space-x-2">
                          <input
                            type="number"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            min="0"
                          />
                          <button
                            onClick={() => handleSave('pricing.reserveFee')}
                            className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700"
                          >
                            ✓
                          </button>
                          <button
                            onClick={handleCancel}
                            className="bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center">
                          <p className="text-gray-900">€{content.pricing.reserveFee}</p>
                          <button
                            onClick={() => handleEdit('pricing.reserveFee', content.pricing.reserveFee.toString())}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            ✏️ Editar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Users Management */}
              {activeTab === 'users' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Gestión de Usuarios</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Usuarios Registrados</h3>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                        + Agregar Usuario
                      </button>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-600">Funcionalidad en desarrollo...</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Aquí podrás gestionar usuarios, permisos, roles y administradores.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Settings */}
              {activeTab === 'settings' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Configuración General</h2>
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-lg font-medium mb-2">Configuraciones Avanzadas</h3>
                      <p className="text-gray-600">Funcionalidad en desarrollo...</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Aquí podrás configurar emails, notificaciones, integraciones y más.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
