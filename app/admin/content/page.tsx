'use client';

import { useState, useEffect } from 'react';

export default function ContentManagement() {
  const [activeTab, setActiveTab] = useState('pages');
  const [content, setContent] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/content', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setContent(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Cargando CMS...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">
              🎨 Gestión de Contenido
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Edita textos, imágenes y configuraciones del sitio web
            </p>
          </div>

          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'pages', name: '📄 Páginas', count: content.pageContent?.length || 0 },
                { id: 'settings', name: '⚙️ Configuración', count: content.siteSettings?.length || 0 },
                { id: 'blocks', name: '🧱 Bloques', count: content.contentBlocks?.length || 0 }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.name}
                  <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'pages' && (
              <div>
                <h2 className="text-lg font-medium mb-4">Contenido de Páginas</h2>
                <div className="grid gap-4">
                  {content.pageContent?.map((item: any) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <h3 className="font-medium">{item.page} - {item.section}</h3>
                      <p className="text-sm text-gray-600">{item.title}</p>
                      <p className="text-xs text-gray-500">Orden: {item.order}</p>
                    </div>
                  )) || <p className="text-gray-500">No hay contenido de páginas</p>}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h2 className="text-lg font-medium mb-4">Configuraciones del Sitio</h2>
                <div className="grid gap-4">
                  {content.siteSettings?.map((item: any) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <h3 className="font-medium">{item.key}</h3>
                      <p className="text-sm text-gray-600">{item.value}</p>
                      <p className="text-xs text-gray-500">Tipo: {item.type}</p>
                    </div>
                  )) || <p className="text-gray-500">No hay configuraciones</p>}
                </div>
              </div>
            )}

            {activeTab === 'blocks' && (
              <div>
                <h2 className="text-lg font-medium mb-4">Bloques de Contenido</h2>
                <div className="grid gap-4">
                  {content.contentBlocks?.map((item: any) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.title}</p>
                      <p className="text-xs text-gray-500">Tipo: {item.type}</p>
                    </div>
                  )) || <p className="text-gray-500">No hay bloques de contenido</p>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
