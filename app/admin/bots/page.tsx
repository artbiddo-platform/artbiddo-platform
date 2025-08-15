'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { BotType, BotAction } from '@prisma/client';

interface Bot {
  id: string;
  name: string;
  type: BotType;
  avatar?: string;
  location?: string;
  interests: string; // JSON string
  isActive: boolean;
  maxBids: number;
  bidAmount: number;
  frequency: number;
  createdAt: string;
  updatedAt: string;
}

interface BotActivity {
  id: string;
  action: BotAction;
  tokens: number;
  artworkId: string;
  createdAt: string;
  bot: {
    id: string;
    name: string;
    type: BotType;
  };
  artwork: {
    id: string;
    title: string;
    currentPrice: number;
  };
}

interface BotStatistics {
  todayActions: Array<{
    action: BotAction;
    _count: { id: number };
  }>;
  activeBots: Array<{
    type: BotType;
    _count: { id: number };
  }>;
  totalBots: number;
}

export default function BotsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [bots, setBots] = useState<Bot[]>([]);
  const [botActivities, setBotActivities] = useState<BotActivity[]>([]);
  const [statistics, setStatistics] = useState<BotStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [config, setConfig] = useState({
    maxBotsPerAuction: 5,
    maxBidAmount: 10,
    minTimeBetweenBids: 30,
    maxDailyBids: 50,
    withdrawTime: 300,
    priceLimit: 0.8
  });

  // Mock data para desarrollo
  const mockBots: Bot[] = [
    {
      id: '1',
      name: 'Maria_Artista',
      type: 'ACTIVITY_BOT',
      avatar: '/avatars/maria.jpg',
      location: 'Madrid, España',
      interests: ['Arte Contemporáneo', 'Abstracto'],
      isActive: true,
      maxBids: 30,
      bidAmount: 1,
      frequency: 300,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      name: 'Carlos_Collector',
      type: 'COMPETITIVE_BOT',
      avatar: '/avatars/carlos.jpg',
      location: 'Barcelona, España',
      interests: ['Arte Clásico', 'Impresionismo'],
      isActive: true,
      maxBids: 50,
      bidAmount: 2,
      frequency: 180,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '3',
      name: 'Ana_Gallery',
      type: 'SPECIALIZED_BOT',
      avatar: '/avatars/ana.jpg',
      location: 'Valencia, España',
      interests: ['Arte Emergente', 'Fotografía'],
      isActive: true,
      maxBids: 25,
      bidAmount: 3,
      frequency: 240,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '4',
      name: 'LastChance',
      type: 'URGENCY_BOT',
      avatar: '/avatars/lastchance.jpg',
      location: 'España',
      interests: ['Todos'],
      isActive: false,
      maxBids: 20,
      bidAmount: 2,
      frequency: 120,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    }
  ];

  const mockActivities: BotActivity[] = [
    {
      id: '1',
      action: 'BID',
      tokens: 2,
      artworkId: 'art1',
      createdAt: '2024-01-15T14:30:00Z',
      bot: {
        id: '1',
        name: 'Maria_Artista',
        type: 'ACTIVITY_BOT'
      },
      artwork: {
        id: 'art1',
        title: 'Composición Abstracta',
        currentPrice: 45
      }
    },
    {
      id: '2',
      action: 'BID',
      tokens: 3,
      artworkId: 'art2',
      createdAt: '2024-01-15T14:25:00Z',
      bot: {
        id: '2',
        name: 'Carlos_Collector',
        type: 'COMPETITIVE_BOT'
      },
      artwork: {
        id: 'art2',
        title: 'Paisaje Mediterráneo',
        currentPrice: 78
      }
    },
    {
      id: '3',
      action: 'VIEW',
      tokens: 0,
      artworkId: 'art3',
      createdAt: '2024-01-15T14:20:00Z',
      bot: {
        id: '3',
        name: 'Ana_Gallery',
        type: 'SPECIALIZED_BOT'
      },
      artwork: {
        id: 'art3',
        title: 'Retrato Moderno',
        currentPrice: 120
      }
    }
  ];

  const mockStatistics: BotStatistics = {
    todayActions: [
      { action: 'BID', _count: { id: 45 } },
      { action: 'VIEW', _count: { id: 23 } },
      { action: 'FAVORITE', _count: { id: 8 } }
    ],
    activeBots: [
      { type: 'ACTIVITY_BOT', _count: { id: 1 } },
      { type: 'COMPETITIVE_BOT', _count: { id: 1 } },
      { type: 'SPECIALIZED_BOT', _count: { id: 1 } }
    ],
    totalBots: 3
  };

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setBots(mockBots);
      setBotActivities(mockActivities);
      setStatistics(mockStatistics);
      setLoading(false);
    }, 1000);
  }, []);

  const toggleBot = async (botId: string, isActive: boolean) => {
    // Aquí iría la llamada a la API
    setBots(bots.map(bot => 
      bot.id === botId ? { ...bot, isActive } : bot
    ));
  };

  const getBotTypeLabel = (type: BotType) => {
    const labels = {
      ACTIVITY_BOT: 'Actividad Base',
      COMPETITIVE_BOT: 'Competitivo',
      URGENCY_BOT: 'Urgencia',
      SPECIALIZED_BOT: 'Especializado'
    };
    return labels[type] || type;
  };

  const getBotTypeColor = (type: BotType) => {
    const colors = {
      ACTIVITY_BOT: 'bg-blue-100 text-blue-800',
      COMPETITIVE_BOT: 'bg-green-100 text-green-800',
      URGENCY_BOT: 'bg-red-100 text-red-800',
      SPECIALIZED_BOT: 'bg-purple-100 text-purple-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getActionLabel = (action: BotAction) => {
    const labels = {
      BID: 'Puja',
      VIEW: 'Vista',
      FAVORITE: 'Favorito'
    };
    return labels[action] || action;
  };

  const getActionIcon = (action: BotAction) => {
    const icons = {
      BID: '💰',
      VIEW: '👁️',
      FAVORITE: '❤️'
    };
    return icons[action] || '📝';
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando sistema de bots...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Sistema de Bots</h1>
            <p className="text-gray-600 mt-2">Gestiona los bots inteligentes que estimulan las subastas</p>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <nav className="flex space-x-8">
              {[
                { id: 'overview', label: 'Resumen', icon: '📊' },
                { id: 'bots', label: 'Bots Activos', icon: '🤖' },
                { id: 'activity', label: 'Actividad', icon: '📈' },
                { id: 'config', label: 'Configuración', icon: '⚙️' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <span className="text-2xl">🤖</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Bots Activos</p>
                      <p className="text-2xl font-bold text-gray-900">{statistics?.totalBots || 0}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <span className="text-2xl">💰</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Pujas Hoy</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {statistics?.todayActions.find(a => a.action === 'BID')?._count.id || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <span className="text-2xl">👁️</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Vistas Hoy</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {statistics?.todayActions.find(a => a.action === 'VIEW')?._count.id || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <span className="text-2xl">❤️</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Favoritos Hoy</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {statistics?.todayActions.find(a => a.action === 'FAVORITE')?._count.id || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bot Types Distribution */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Tipo</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {statistics?.activeBots.map((botType) => (
                    <div key={botType.type} className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-600">
                        {getBotTypeLabel(botType.type)}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">{botType._count.id}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
                <div className="space-y-3">
                  {botActivities.slice(0, 5).map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{getActionIcon(activity.action)}</span>
                        <div>
                          <p className="font-medium text-gray-900">
                            {activity.bot.name} - {getActionLabel(activity.action)}
                          </p>
                          <p className="text-sm text-gray-600">{activity.artwork.title}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          {activity.tokens > 0 ? `${activity.tokens} tokens` : ''}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(activity.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Bots Tab */}
          {activeTab === 'bots' && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Bots Activos</h3>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    + Nuevo Bot
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bot
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Configuración
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bots.map((bot) => (
                      <tr key={bot.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded-full"
                                src={bot.avatar || '/avatars/default.jpg'}
                                alt={bot.name}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{bot.name}</div>
                              <div className="text-sm text-gray-500">{bot.location}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getBotTypeColor(bot.type)}`}>
                            {getBotTypeLabel(bot.type)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>
                            <p>Máx: {bot.maxBids} pujas/día</p>
                            <p>Frecuencia: {bot.frequency}s</p>
                            <p>Tokens: {bot.bidAmount}/puja</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            bot.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {bot.isActive ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => toggleBot(bot.id, !bot.isActive)}
                              className={`px-3 py-1 rounded text-xs ${
                                bot.isActive
                                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                  : 'bg-green-100 text-green-700 hover:bg-green-200'
                              }`}
                            >
                              {bot.isActive ? 'Desactivar' : 'Activar'}
                            </button>
                            <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200">
                              Editar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Actividad de Bots</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bot
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acción
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Obra
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tokens
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {botActivities.map((activity) => (
                      <tr key={activity.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-900">{activity.bot.name}</span>
                            <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getBotTypeColor(activity.bot.type)}`}>
                              {getBotTypeLabel(activity.bot.type)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-xl mr-2">{getActionIcon(activity.action)}</span>
                            <span className="text-sm text-gray-900">{getActionLabel(activity.action)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {activity.artwork.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {activity.tokens > 0 ? `${activity.tokens} tokens` : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(activity.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Configuration Tab */}
          {activeTab === 'config' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Configuración del Sistema</h3>
                  <button
                    onClick={() => setShowConfigModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Editar Configuración
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Máximo bots por subasta</p>
                        <p className="text-sm text-gray-600">Número máximo de bots activos simultáneamente</p>
                      </div>
                      <span className="text-2xl font-bold text-blue-600">{config.maxBotsPerAuction}</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Máximo tokens por puja</p>
                        <p className="text-sm text-gray-600">Límite de tokens que un bot puede pujar</p>
                      </div>
                      <span className="text-2xl font-bold text-green-600">{config.maxBidAmount}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Tiempo mínimo entre pujas</p>
                        <p className="text-sm text-gray-600">Segundos entre pujas del mismo bot</p>
                      </div>
                      <span className="text-2xl font-bold text-purple-600">{config.minTimeBetweenBids}s</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Máximo pujas diarias</p>
                        <p className="text-sm text-gray-600">Límite de pujas por bot por día</p>
                      </div>
                      <span className="text-2xl font-bold text-red-600">{config.maxDailyBids}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Reglas de Seguridad</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-green-500">✅</span>
                    <span className="text-sm text-gray-700">Los bots nunca ganan subastas</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-green-500">✅</span>
                    <span className="text-sm text-gray-700">Los bots se retiran 5 minutos antes del final</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-green-500">✅</span>
                    <span className="text-sm text-gray-700">Los bots respetan límites de precio</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-green-500">✅</span>
                    <span className="text-sm text-gray-700">Los bots simulan comportamiento humano</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Configuration Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Editar Configuración</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Máximo bots por subasta
                </label>
                <input
                  type="number"
                  value={config.maxBotsPerAuction}
                  onChange={(e) => setConfig({...config, maxBotsPerAuction: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Máximo tokens por puja
                </label>
                <input
                  type="number"
                  value={config.maxBidAmount}
                  onChange={(e) => setConfig({...config, maxBidAmount: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tiempo mínimo entre pujas (segundos)
                </label>
                <input
                  type="number"
                  value={config.minTimeBetweenBids}
                  onChange={(e) => setConfig({...config, minTimeBetweenBids: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Máximo pujas diarias
                </label>
                <input
                  type="number"
                  value={config.maxDailyBids}
                  onChange={(e) => setConfig({...config, maxDailyBids: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowConfigModal(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  // Aquí iría la llamada a la API para guardar la configuración
                  setShowConfigModal(false);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
