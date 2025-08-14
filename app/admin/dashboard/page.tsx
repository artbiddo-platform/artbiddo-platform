'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import { 
  BarChart3, 
  DollarSign, 
  Shield, 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingCart, 
  Eye, 
  CheckCircle, 
  AlertTriangle, 
  Bell, 
  Settings,
  Clock,
  Calendar,
  Target,
  Zap
} from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for dashboard
  const dashboardData = {
    overview: {
      totalRevenue: 1250000,
      revenueChange: 12.5,
      totalUsers: 15420,
      userChange: 8.3,
      activeAuctions: 45,
      auctionChange: -2.1,
      totalBids: 8920,
      bidChange: 15.7
    },
    financial: {
      monthlyRevenue: [45000, 52000, 48000, 61000, 58000, 72000, 68000, 75000, 82000, 78000, 85000, 92000],
      commission: 125000,
      fees: 45000,
      refunds: 8500,
      pending: 23000
    },
    security: {
      securityScore: 94,
      suspiciousActivity: 3,
      blockedUsers: 12,
      failedLogins: 28,
      lastBackup: '2024-01-15 14:30:00'
    },
    recentActivity: [
      { id: 1, user: 'María García', action: 'Ganó subasta #1234', amount: 2500, time: 'Hace 2 minutos', type: 'bid' },
      { id: 2, user: 'Carlos López', action: 'Registró nueva cuenta', amount: 0, time: 'Hace 5 minutos', type: 'user' },
      { id: 3, user: 'Ana Martínez', action: 'Subió obra de arte', amount: 0, time: 'Hace 8 minutos', type: 'artwork' },
      { id: 4, user: 'Luis Rodríguez', action: 'Realizó puja de €1,200', amount: 1200, time: 'Hace 12 minutos', type: 'bid' },
      { id: 5, user: 'Sistema', action: 'Backup automático completado', amount: 0, time: 'Hace 15 minutos', type: 'system' }
    ]
  };

  // Authentication check
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('adminToken');
      const user = localStorage.getItem('adminUser');
      
      if (!token || !user) {
      router.push('/admin/login');
      return;
    }

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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'bid': return <ShoppingCart className="w-4 h-4 text-green-500" />;
      case 'user': return <Users className="w-4 h-4 text-blue-500" />;
      case 'artwork': return <Eye className="w-4 h-4 text-purple-500" />;
      case 'system': return <Settings className="w-4 h-4 text-gray-500" />;
      default: return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          {/* Header */}
          <div className="bg-white shadow-sm border-b border-gray-200">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Dashboard de Administración</h1>
                  <p className="text-gray-600">Vista general del sistema de subastas</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>Seguridad: {dashboardData.security.securityScore}%</span>
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Tabs */}
          <div className="bg-white border-b border-gray-200">
            <div className="px-6">
              <nav className="flex space-x-8">
                {[
                  { id: 'overview', name: 'Vista General', icon: BarChart3 },
                  { id: 'financial', name: 'Financiero', icon: DollarSign },
                  { id: 'security', name: 'Seguridad', icon: Shield },
                  { id: 'activity', name: 'Actividad', icon: Activity }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
                        <p className="text-2xl font-bold text-gray-900">
                          €{dashboardData.overview.totalRevenue.toLocaleString()}
                        </p>
                      </div>
                      <div className={`p-2 rounded-full ${
                        dashboardData.overview.revenueChange > 0 ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {dashboardData.overview.revenueChange > 0 ? (
                          <TrendingUp className="w-6 h-6 text-green-600" />
                        ) : (
                          <TrendingDown className="w-6 h-6 text-red-600" />
                        )}
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className={`text-sm font-medium ${
                        dashboardData.overview.revenueChange > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {dashboardData.overview.revenueChange > 0 ? '+' : ''}{dashboardData.overview.revenueChange}%
                      </span>
                      <span className="text-sm text-gray-600"> vs mes anterior</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Usuarios Activos</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {dashboardData.overview.totalUsers.toLocaleString()}
                        </p>
                      </div>
                      <div className={`p-2 rounded-full ${
                        dashboardData.overview.userChange > 0 ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {dashboardData.overview.userChange > 0 ? (
                          <TrendingUp className="w-6 h-6 text-green-600" />
                        ) : (
                          <TrendingDown className="w-6 h-6 text-red-600" />
                        )}
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className={`text-sm font-medium ${
                        dashboardData.overview.userChange > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {dashboardData.overview.userChange > 0 ? '+' : ''}{dashboardData.overview.userChange}%
                      </span>
                      <span className="text-sm text-gray-600"> vs mes anterior</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Subastas Activas</p>
                        <p className="text-2xl font-bold text-gray-900">{dashboardData.overview.activeAuctions}</p>
                      </div>
                      <div className={`p-2 rounded-full ${
                        dashboardData.overview.auctionChange > 0 ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {dashboardData.overview.auctionChange > 0 ? (
                          <TrendingUp className="w-6 h-6 text-green-600" />
                        ) : (
                          <TrendingDown className="w-6 h-6 text-red-600" />
                        )}
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className={`text-sm font-medium ${
                        dashboardData.overview.auctionChange > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {dashboardData.overview.auctionChange > 0 ? '+' : ''}{dashboardData.overview.auctionChange}%
                      </span>
                      <span className="text-sm text-gray-600"> vs mes anterior</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total de Pujas</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {dashboardData.overview.totalBids.toLocaleString()}
                        </p>
                      </div>
                      <div className={`p-2 rounded-full ${
                        dashboardData.overview.bidChange > 0 ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {dashboardData.overview.bidChange > 0 ? (
                          <TrendingUp className="w-6 h-6 text-green-600" />
                        ) : (
                          <TrendingDown className="w-6 h-6 text-red-600" />
                        )}
                      </div>
                  </div>
                    <div className="mt-4">
                      <span className={`text-sm font-medium ${
                        dashboardData.overview.bidChange > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {dashboardData.overview.bidChange > 0 ? '+' : ''}{dashboardData.overview.bidChange}%
                      </span>
                      <span className="text-sm text-gray-600"> vs mes anterior</span>
                  </div>
                </div>
              </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Zap className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Acciones Rápidas</h3>
                        <p className="text-gray-600">Gestiona tu plataforma</p>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                        Crear Nueva Subasta
                      </button>
                      <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                        Ver Reportes
                      </button>
                      <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                        Configurar Sistema
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                        <Target className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Objetivos</h3>
                        <p className="text-gray-600">Metas del mes</p>
                      </div>
                    </div>
                    <div className="mt-4 space-y-3">
                      <div>
                        <div className="flex justify-between text-sm">
                          <span>Ingresos</span>
                          <span>75%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm">
                          <span>Usuarios</span>
                          <span>90%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                  </div>
                </div>
              </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Clock className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Próximos Eventos</h3>
                        <p className="text-gray-600">Subastas programadas</p>
                      </div>
                    </div>
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Subasta Contemporánea</p>
                          <p className="text-xs text-gray-500">En 2 días</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Subasta Clásica</p>
                          <p className="text-xs text-gray-500">En 5 días</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Financial Tab */}
            {activeTab === 'financial' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Comisiones</p>
                        <p className="text-2xl font-bold text-gray-900">€{dashboardData.financial.commission.toLocaleString()}</p>
                  </div>
                      <div className="p-2 rounded-full bg-blue-100">
                        <DollarSign className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Tarifas</p>
                        <p className="text-2xl font-bold text-gray-900">€{dashboardData.financial.fees.toLocaleString()}</p>
                  </div>
                      <div className="p-2 rounded-full bg-green-100">
                        <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Reembolsos</p>
                        <p className="text-2xl font-bold text-gray-900">€{dashboardData.financial.refunds.toLocaleString()}</p>
                      </div>
                      <div className="p-2 rounded-full bg-red-100">
                        <DollarSign className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Pendiente</p>
                        <p className="text-2xl font-bold text-gray-900">€{dashboardData.financial.pending.toLocaleString()}</p>
                      </div>
                      <div className="p-2 rounded-full bg-yellow-100">
                        <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
                        </div>
                        </div>
                      </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Actividad Sospechosa</p>
                        <p className="text-2xl font-bold text-gray-900">{dashboardData.security.suspiciousActivity}</p>
                      </div>
                      <div className="p-2 rounded-full bg-yellow-100">
                        <Shield className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Usuarios Bloqueados</p>
                        <p className="text-2xl font-bold text-gray-900">{dashboardData.security.blockedUsers}</p>
                      </div>
                      <div className="p-2 rounded-full bg-gray-100">
                        <Users className="w-6 h-6 text-gray-600" />
                      </div>
                </div>
                      </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Puntuación Seguridad</p>
                        <p className="text-2xl font-bold text-gray-900">{dashboardData.security.securityScore}%</p>
                      </div>
                      <div className="p-2 rounded-full bg-green-100">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                      </div>
                      </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Logins Fallidos</p>
                        <p className="text-2xl font-bold text-gray-900">{dashboardData.security.failedLogins}</p>
                      </div>
                      <div className="p-2 rounded-full bg-red-100">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </div>
            </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Logs de Seguridad</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        <span className="text-sm text-gray-900">Intento de acceso no autorizado desde IP 192.168.1.100</span>
                      </div>
                      <span className="text-xs text-gray-500">Hace 5 minutos</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Shield className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm text-gray-900">Múltiples pujas sospechosas detectadas</span>
                      </div>
                      <span className="text-xs text-gray-500">Hace 15 minutos</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-900">Backup de seguridad completado exitosamente</span>
                      </div>
                      <span className="text-xs text-gray-500">Hace 1 hora</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Activity Tab */}
            {activeTab === 'activity' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad en Tiempo Real</h3>
                <div className="space-y-4">
                    {dashboardData.recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getActivityIcon(activity.type)}
                        <div>
                            <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                            <p className="text-sm text-gray-600">{activity.action}</p>
                        </div>
                      </div>
                      <div className="text-right">
                          {activity.amount > 0 && (
                            <p className="text-sm font-medium text-green-600">
                              €{activity.amount.toLocaleString()}
                        </p>
                          )}
                          <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
