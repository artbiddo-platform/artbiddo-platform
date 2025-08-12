'use client';

import { useState, useEffect } from 'react';

export default function ContentManagement() {
  const [activeTab, setActiveTab] = useState('home');
  const [content, setContent] = useState<any>({
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
    }
  });
  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                🎨 Panel de Administración
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
                  { id: 'home', name: '🏠 Página Principal', icon: '🏠' },
                  { id: 'about', name: 'ℹ️ Sobre Nosotros', icon: 'ℹ️' },
                  { id: 'contact', name: '📞 Contacto', icon: '📞' },
                  { id: 'auctions', name: '🎨 Subastas', icon: '🎨' },
                  { id: 'users', name: '👥 Usuarios', icon: '👥' },
                  { id: 'settings', name: '⚙️ Configuración', icon: '⚙️' }
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
              {/* Home Page Content */}
              {activeTab === 'home' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">🏠 Página Principal</h2>
                  
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
                            <p className="text-gray-600">{content.home.hero.subtitle}</p>
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
                  <div>
                    <h3 className="text-lg font-medium mb-4 text-gray-900">Características</h3>
                    <div className="grid gap-4 md:grid-cols-3">
                      {content.home.features.map((feature: any, index: number) => (
                        <div key={index} className="border rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-2">{feature.title}</h4>
                          <p className="text-sm text-gray-600">{feature.description}</p>
                          <button className="mt-2 text-blue-600 hover:text-blue-800 text-sm">
                            ✏️ Editar
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* About Page Content */}
              {activeTab === 'about' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">ℹ️ Sobre Nosotros</h2>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Título
                      </label>
                      <p className="text-gray-900">{content.about.title}</p>
                      <button className="mt-2 text-blue-600 hover:text-blue-800">
                        ✏️ Editar
                      </button>
                    </div>
                    <div className="border rounded-lg p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contenido
                      </label>
                      <p className="text-gray-600">{content.about.content}</p>
                      <button className="mt-2 text-blue-600 hover:text-blue-800">
                        ✏️ Editar
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Page Content */}
              {activeTab === 'contact' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">📞 Contacto</h2>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <p className="text-gray-900">{content.contact.email}</p>
                      <button className="mt-2 text-blue-600 hover:text-blue-800">
                        ✏️ Editar
                      </button>
                    </div>
                    <div className="border rounded-lg p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Teléfono
                      </label>
                      <p className="text-gray-900">{content.contact.phone}</p>
                      <button className="mt-2 text-blue-600 hover:text-blue-800">
                        ✏️ Editar
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Other tabs placeholder */}
              {['auctions', 'users', 'settings'].includes(activeTab) && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">
                    {activeTab === 'auctions' && '🎨 Gestión de Subastas'}
                    {activeTab === 'users' && '👥 Gestión de Usuarios'}
                    {activeTab === 'settings' && '⚙️ Configuración'}
                  </h2>
                  <p className="text-gray-600">
                    Esta sección estará disponible próximamente.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
