'use client';

import { useState } from 'react';

export default function TechnicalDocumentation() {
  const [activeSection, setActiveSection] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">
              📚 Documentación Técnica Interna
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Guía completa de la arquitectura y funcionamiento de ArtBiddo
            </p>
          </div>

          <div className="flex">
            <div className="w-64 border-r border-gray-200 bg-gray-50">
              <nav className="p-4 space-y-2">
                {[
                  { id: 'overview', name: '📋 Visión General' },
                  { id: 'architecture', name: '🏗️ Arquitectura' },
                  { id: 'database', name: '🗄️ Base de Datos' },
                  { id: 'apis', name: '🔌 APIs' },
                  { id: 'auth', name: '🔐 Autenticación' },
                  { id: 'cms', name: '🎨 CMS' },
                  { id: 'payments', name: '💳 Pagos' },
                  { id: 'features', name: '⚡ Funcionalidades' },
                  { id: 'deployment', name: '🚀 Despliegue' }
                ].map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {section.name}
                  </button>
                ))}
              </nav>
            </div>

            <div className="flex-1 p-6">
              {activeSection === 'overview' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold">📋 Visión General del Sistema</h2>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">🎯 Propósito</h3>
                    <p className="text-blue-800">
                      ArtBiddo es una plataforma completa de subastas de arte contemporáneo 
                      que conecta artistas, galerías y coleccionistas en un entorno digital seguro.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-2">🛠️ Tecnologías Principales</h3>
                      <ul className="space-y-1 text-sm">
                        <li>• <strong>Frontend:</strong> Next.js 14 (App Router)</li>
                        <li>• <strong>Backend:</strong> Node.js con TypeScript</li>
                        <li>• <strong>Base de Datos:</strong> SQLite (dev) / PostgreSQL (prod)</li>
                        <li>• <strong>ORM:</strong> Prisma</li>
                        <li>• <strong>Estilos:</strong> Tailwind CSS</li>
                        <li>• <strong>Autenticación:</strong> JWT + bcrypt</li>
                        <li>• <strong>Pagos:</strong> Stripe</li>
                        <li>• <strong>Despliegue:</strong> Vercel</li>
                      </ul>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-2">👥 Roles de Usuario</h3>
                      <ul className="space-y-1 text-sm">
                        <li>• <strong>ADMIN:</strong> Gestión completa del sistema</li>
                        <li>• <strong>SELLER:</strong> Vendedores de obras de arte</li>
                        <li>• <strong>BUYER:</strong> Compradores y pujadores</li>
                        <li>• <strong>MODERATOR:</strong> Moderación de contenido</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'architecture' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold">🏗️ Arquitectura del Sistema</h2>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-3">📁 Estructura de Carpetas</h3>
                    <div className="bg-gray-100 rounded p-3 font-mono text-sm">
                      <div>📦 auction-master/</div>
                      <div className="ml-4">├── 📁 app/ (Next.js App Router)</div>
                      <div className="ml-8">├── 📁 api/ (APIs REST)</div>
                      <div className="ml-8">├── 📁 admin/ (Panel admin)</div>
                      <div className="ml-4">├── 📁 components/ (Componentes React)</div>
                      <div className="ml-4">├── 📁 lib/ (Utilidades)</div>
                      <div className="ml-4">├── 📁 prisma/ (Base de datos)</div>
                      <div className="ml-4">└── 📁 public/ (Archivos estáticos)</div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-2">🔄 Flujo de Datos</h3>
                      <ol className="space-y-2 text-sm">
                        <li>1. <strong>Cliente</strong> hace petición HTTP</li>
                        <li>2. <strong>Next.js</strong> maneja el routing</li>
                        <li>3. <strong>API Route</strong> procesa la petición</li>
                        <li>4. <strong>Prisma</strong> consulta la base de datos</li>
                        <li>5. <strong>Respuesta</strong> se envía al cliente</li>
                      </ol>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-2">🔧 Patrones Utilizados</h3>
                      <ul className="space-y-1 text-sm">
                        <li>• <strong>MVC:</strong> Separación de responsabilidades</li>
                        <li>• <strong>Repository:</strong> Acceso a datos con Prisma</li>
                        <li>• <strong>Middleware:</strong> Autenticación y validación</li>
                        <li>• <strong>Component:</strong> React components reutilizables</li>
                        <li>• <strong>API Routes:</strong> Endpoints RESTful</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'database' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold">🗄️ Base de Datos</h2>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-3">📊 Modelos de Datos</h3>
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-3 rounded">
                        <h4 className="font-medium text-blue-600">👤 User</h4>
                        <p className="text-sm text-gray-600">Usuarios del sistema (admin, seller, buyer)</p>
                        <p className="text-xs text-gray-500">Campos: id, email, name, role, balance, avatar</p>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded">
                        <h4 className="font-medium text-green-600">🎨 Artwork</h4>
                        <p className="text-sm text-gray-600">Obras de arte en subasta</p>
                        <p className="text-xs text-gray-500">Campos: id, title, artist, price, status, endDate</p>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded">
                        <h4 className="font-medium text-purple-600">💰 Bid</h4>
                        <p className="text-sm text-gray-600">Pujas realizadas por usuarios</p>
                        <p className="text-xs text-gray-500">Campos: id, artworkId, userId, amount, status</p>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded">
                        <h4 className="font-medium text-orange-600">📄 PageContent</h4>
                        <p className="text-sm text-gray-600">Contenido dinámico del CMS</p>
                        <p className="text-xs text-gray-500">Campos: id, page, section, content, isActive</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'apis' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold">🔌 APIs del Sistema</h2>
                  
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-3">🔐 Autenticación</h3>
                      <div className="space-y-2 text-sm">
                        <div className="bg-gray-50 p-2 rounded">
                          <strong>POST /api/auth/login</strong> - Iniciar sesión
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <strong>POST /api/auth/register</strong> - Registro de usuarios
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-3">🎨 Gestión de Arte</h3>
                      <div className="space-y-2 text-sm">
                        <div className="bg-gray-50 p-2 rounded">
                          <strong>GET /api/artworks</strong> - Listar obras de arte
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <strong>GET /api/artworks/[id]</strong> - Obtener obra específica
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <strong>GET /api/categories</strong> - Listar categorías
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-3">💰 Sistema de Pujas</h3>
                      <div className="space-y-2 text-sm">
                        <div className="bg-gray-50 p-2 rounded">
                          <strong>GET /api/bids</strong> - Obtener pujas de una obra
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <strong>POST /api/bids</strong> - Crear nueva puja
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <strong>GET /api/user/bids</strong> - Pujas del usuario
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-3">🎨 CMS</h3>
                      <div className="space-y-2 text-sm">
                        <div className="bg-gray-50 p-2 rounded">
                          <strong>GET /api/content</strong> - Contenido público
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <strong>GET /api/admin/content</strong> - Gestión de contenido (admin)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'auth' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold">🔐 Sistema de Autenticación</h2>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-3">🔑 Flujo de Autenticación</h3>
                    <ol className="space-y-2 text-sm">
                      <li>1. <strong>Login:</strong> Usuario envía email/password</li>
                      <li>2. <strong>Validación:</strong> Verificar credenciales en BD</li>
                      <li>3. <strong>Hash:</strong> Comparar password con bcrypt</li>
                      <li>4. <strong>Token:</strong> Generar JWT con datos del usuario</li>
                      <li>5. <strong>Respuesta:</strong> Enviar token al cliente</li>
                      <li>6. <strong>Almacenamiento:</strong> Token en localStorage</li>
                    </ol>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-2">🛡️ Seguridad</h3>
                      <ul className="space-y-1 text-sm">
                        <li>• <strong>Passwords:</strong> Hasheados con bcrypt</li>
                        <li>• <strong>JWT:</strong> Tokens firmados con secreto</li>
                        <li>• <strong>Expiración:</strong> Tokens con tiempo límite</li>
                        <li>• <strong>Roles:</strong> Control de acceso por permisos</li>
                        <li>• <strong>Validación:</strong> Sanitización de inputs</li>
                      </ul>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-2">👥 Roles y Permisos</h3>
                      <ul className="space-y-1 text-sm">
                        <li>• <strong>ADMIN:</strong> Acceso completo al sistema</li>
                        <li>• <strong>SELLER:</strong> Gestionar sus obras</li>
                        <li>• <strong>BUYER:</strong> Pujar y comprar</li>
                        <li>• <strong>MODERATOR:</strong> Moderar contenido</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'cms' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold">🎨 Sistema de Gestión de Contenido (CMS)</h2>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-3">📊 Tipos de Contenido</h3>
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-3 rounded">
                        <h4 className="font-medium text-blue-600">📄 PageContent</h4>
                        <p className="text-sm text-gray-600">Contenido específico por página y sección</p>
                        <p className="text-xs text-gray-500">Ejemplo: Hero de la página principal</p>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded">
                        <h4 className="font-medium text-green-600">⚙️ SiteSettings</h4>
                        <p className="text-sm text-gray-600">Configuraciones globales del sitio</p>
                        <p className="text-xs text-gray-500">Ejemplo: Email de contacto, redes sociales</p>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded">
                        <h4 className="font-medium text-purple-600">🧱 ContentBlock</h4>
                        <p className="text-sm text-gray-600">Bloques reutilizables de contenido</p>
                        <p className="text-xs text-gray-500">Ejemplo: Títulos, descripciones</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-2">🔧 APIs del CMS</h3>
                      <ul className="space-y-1 text-sm">
                        <li>• <strong>GET /api/content</strong> - Contenido público</li>
                        <li>• <strong>GET /api/admin/content</strong> - Gestión (admin)</li>
                        <li>• <strong>POST /api/admin/content</strong> - Crear contenido</li>
                        <li>• <strong>PUT /api/admin/content/[id]</strong> - Actualizar</li>
                        <li>• <strong>DELETE /api/admin/content/[id]</strong> - Eliminar</li>
                      </ul>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-2">🎯 Uso en Frontend</h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <strong>Componente:</strong> DynamicContent
                        </div>
                        <div>
                          <strong>Props:</strong> blockName, settingKey, fallback
                        </div>
                        <div>
                          <strong>Ejemplo:</strong> &lt;DynamicContent blockName="hero_title" /&gt;
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'payments' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold">💳 Sistema de Pagos</h2>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-3">🔌 Integración con Stripe</h3>
                    <div className="space-y-2 text-sm">
                      <div className="bg-gray-50 p-2 rounded">
                        <strong>Configuración:</strong> Variables de entorno STRIPE_*
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <strong>Webhooks:</strong> /api/webhooks/stripe
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <strong>Depósitos:</strong> /api/payments/deposit
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <strong>Comisiones:</strong> /api/payments/commission
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-2">💰 Flujo de Pagos</h3>
                      <ol className="space-y-2 text-sm">
                        <li>1. <strong>Depósito:</strong> Usuario añade saldo</li>
                        <li>2. <strong>Puja:</strong> Se descuenta del saldo</li>
                        <li>3. <strong>Comisión:</strong> Se aplica al vendedor</li>
                        <li>4. <strong>Transacción:</strong> Se registra en BD</li>
                      </ol>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-2">📊 Modelos de Pago</h3>
                      <ul className="space-y-1 text-sm">
                        <li>• <strong>Transaction:</strong> Historial de transacciones</li>
                        <li>• <strong>User.balance:</strong> Saldo del usuario</li>
                        <li>• <strong>Bid.amount:</strong> Cantidad de la puja</li>
                        <li>• <strong>Commission:</strong> Comisión por venta</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'features' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold">⚡ Funcionalidades del Sistema</h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-3">🎨 Gestión de Arte</h3>
                      <ul className="space-y-2 text-sm">
                        <li>• <strong>Catálogo:</strong> Listado de obras con filtros</li>
                        <li>• <strong>Detalles:</strong> Información completa de obras</li>
                        <li>• <strong>Categorías:</strong> Organización por tipo</li>
                        <li>• <strong>Imágenes:</strong> Galería de fotos</li>
                        <li>• <strong>Estados:</strong> Activa, vendida, expirada</li>
                      </ul>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-3">💰 Sistema de Pujas</h3>
                      <ul className="space-y-2 text-sm">
                        <li>• <strong>Pujas en tiempo real:</strong> Actualizaciones instantáneas</li>
                        <li>• <strong>Historial:</strong> Todas las pujas de una obra</li>
                        <li>• <strong>Validaciones:</strong> Pujas mínimas y saldo</li>
                        <li>• <strong>Notificaciones:</strong> Cuando te superan</li>
                        <li>• <strong>Auto-puja:</strong> Pujas automáticas</li>
                      </ul>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-3">👥 Gestión de Usuarios</h3>
                      <ul className="space-y-2 text-sm">
                        <li>• <strong>Perfiles:</strong> Información personal</li>
                        <li>• <strong>Favoritos:</strong> Obras guardadas</li>
                        <li>• <strong>Historial:</strong> Actividad del usuario</li>
                        <li>• <strong>Notificaciones:</strong> Sistema de alertas</li>
                        <li>• <strong>Mensajes:</strong> Chat interno</li>
                      </ul>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-3">🛠️ Panel de Administración</h3>
                      <ul className="space-y-2 text-sm">
                        <li>• <strong>Dashboard:</strong> Estadísticas generales</li>
                        <li>• <strong>Usuarios:</strong> Gestión de cuentas</li>
                        <li>• <strong>Subastas:</strong> Control de obras</li>
                        <li>• <strong>CMS:</strong> Gestión de contenido</li>
                        <li>• <strong>Reportes:</strong> Análisis de datos</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'deployment' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold">🚀 Despliegue y Configuración</h2>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-3">🌐 Despliegue en Vercel</h3>
                    <div className="space-y-2 text-sm">
                      <div className="bg-gray-50 p-2 rounded">
                        <strong>Plataforma:</strong> Vercel (optimizado para Next.js)
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <strong>Configuración:</strong> vercel.json
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <strong>Variables:</strong> Configuradas en Vercel Dashboard
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <strong>Dominio:</strong> Personalizable
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-2">🔧 Variables de Entorno</h3>
                      <ul className="space-y-1 text-sm">
                        <li>• <strong>DATABASE_URL:</strong> Conexión a BD</li>
                        <li>• <strong>NEXTAUTH_URL:</strong> URL de la aplicación</li>
                        <li>• <strong>JWT_SECRET:</strong> Secreto para tokens</li>
                        <li>• <strong>STRIPE_SECRET_KEY:</strong> Clave de Stripe</li>
                        <li>• <strong>STRIPE_PUBLISHABLE_KEY:</strong> Clave pública</li>
                      </ul>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-2">📊 Base de Datos</h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <strong>Desarrollo:</strong> SQLite local
                        </div>
                        <div>
                          <strong>Producción:</strong> PostgreSQL (Vercel/Neon)
                        </div>
                        <div>
                          <strong>Migraciones:</strong> Automáticas en deploy
                        </div>
                        <div>
                          <strong>Backup:</strong> Automático en Vercel
                        </div>
                      </div>
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
