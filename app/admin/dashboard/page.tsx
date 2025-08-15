'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import { 
  Users, 
  Eye, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Calendar,
  Target,
  Zap,
  BarChart3,
  Shield,
  AlertTriangle, 
  Bell, 
  Settings,
  Clock,
  Target as TargetIcon,
  Zap as ZapIcon
} from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

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
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (!token || !userData) {
        router.push('/login');
      return;
    }

    try {
        const userInfo = JSON.parse(userData);
        if (userInfo.role !== 'ADMIN') {
          router.push('/login');
          return;
        }
        setUser(userInfo);
        setIsAuthenticated(true);
    } catch (error) {
        router.push('/login');
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
      <AdminSidebar />

      <div className="ml-64 p-8">
          {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Panel de Administración
          </h1>
          <p className="text-gray-600">
            Bienvenido, {user?.name || 'Administrador'}
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', name: 'Resumen', icon: BarChart3 },
                { id: 'financial', name: 'Financiero', icon: DollarSign },
                { id: 'security', name: 'Seguridad', icon: Shield },
                { id: 'activity', name: 'Actividad', icon: Activity }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
            </div>
          </div>

          {/* Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <DollarSign className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
                    <p className="text-2xl font-bold text-gray-900">
                      €{dashboardData.overview.totalRevenue.toLocaleString()}
                    </p>
                    <div className="flex items-center mt-1">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600 ml-1">
                        +{dashboardData.overview.revenueChange}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Usuarios Totales</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboardData.overview.totalUsers.toLocaleString()}
                    </p>
                    <div className="flex items-center mt-1">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600 ml-1">
                        +{dashboardData.overview.userChange}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Eye className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Subastas Activas</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboardData.overview.activeAuctions}
                    </p>
                    <div className="flex items-center mt-1">
                      <TrendingDown className="h-4 w-4 text-red-500" />
                      <span className="text-sm text-red-600 ml-1">
                        {dashboardData.overview.auctionChange}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <ShoppingCart className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total de Pujas</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboardData.overview.totalBids.toLocaleString()}
                    </p>
                    <div className="flex items-center mt-1">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600 ml-1">
                        +{dashboardData.overview.bidChange}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Actividad Reciente</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                  {dashboardData.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4">
                      {getActivityIcon(activity.type)}
                        <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.user} - {activity.action}
                        </p>
                        <p className="text-sm text-gray-500">{activity.time}</p>
                        </div>
                      {activity.amount > 0 && (
                        <span className="text-sm font-medium text-green-600">
                          €{activity.amount.toLocaleString()}
                        </span>
                      )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
                </div>
        )}

        {activeTab === 'financial' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Comisiones</h3>
                <p className="text-3xl font-bold text-green-600">
                  €{dashboardData.financial.commission.toLocaleString()}
                </p>
                      </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Tarifas</h3>
                <p className="text-3xl font-bold text-blue-600">
                  €{dashboardData.financial.fees.toLocaleString()}
                </p>
                      </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Reembolsos</h3>
                <p className="text-3xl font-bold text-red-600">
                  €{dashboardData.financial.refunds.toLocaleString()}
                </p>
                      </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Pendiente</h3>
                <p className="text-3xl font-bold text-yellow-600">
                  €{dashboardData.financial.pending.toLocaleString()}
                </p>
                  </div>
                </div>
              </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Puntuación de Seguridad</h3>
                <p className="text-3xl font-bold text-green-600">
                  {dashboardData.security.securityScore}/100
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Actividad Sospechosa</h3>
                <p className="text-3xl font-bold text-orange-600">
                  {dashboardData.security.suspiciousActivity}
                </p>
                        </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Usuarios Bloqueados</h3>
                <p className="text-3xl font-bold text-red-600">
                  {dashboardData.security.blockedUsers}
                          </p>
                        </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Logins Fallidos</h3>
                <p className="text-3xl font-bold text-yellow-600">
                  {dashboardData.security.failedLogins}
                        </p>
                      </div>
                    </div>
                </div>
        )}

        {activeTab === 'activity' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Actividad del Sistema</h3>
              <p className="text-gray-600">
                Último backup: {dashboardData.security.lastBackup}
              </p>
              </div>
            </div>
        )}
      </div>
    </div>
  );
}
