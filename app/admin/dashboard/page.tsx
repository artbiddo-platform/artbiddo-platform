'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Gavel, 
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Shield,
  Zap,
  Target,
  Award,
  CreditCard,
  FileText,
  Settings,
  Bell
} from 'lucide-react';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();

  // Mock data for demonstration
  const [dashboardData] = useState({
    overview: {
      totalRevenue: 2847500,
      revenueChange: 12.5,
      activeAuctions: 8,
      auctionsChange: -2,
      totalUsers: 1247,
      usersChange: 8.3,
      totalBids: 3421,
      bidsChange: 15.7
    },
    financial: {
      monthlyRevenue: [125000, 145000, 132000, 158000, 142000, 168000, 175000, 189000, 201000, 198000, 215000, 2847500],
      commissionEarned: 284750,
      pendingPayments: 125000,
      refundsIssued: 8500
    },
    security: {
      failedLogins: 23,
      suspiciousActivity: 5,
      blockedUsers: 3,
      securityScore: 94
    },
    recentActivity: [
      {
        id: 1,
        type: 'bid',
        user: 'María González',
        action: 'Pujó €15,000 en "Obra de Picasso"',
        time: '2 minutos',
        amount: 15000
      },
      {
        id: 2,
        type: 'auction',
        user: 'Sistema',
        action: 'Subasta "Arte Contemporáneo" finalizada',
        time: '15 minutos',
        amount: 45000
      },
      {
        id: 3,
        type: 'payment',
        user: 'Carlos Rodríguez',
        action: 'Pago procesado por €8,500',
        time: '1 hora',
        amount: 8500
      },
      {
        id: 4,
        type: 'user',
        user: 'Ana Martínez',
        action: 'Nuevo usuario registrado',
        time: '2 horas',
        amount: 0
      },
      {
        id: 5,
        type: 'alert',
        user: 'Sistema',
        action: 'Actividad sospechosa detectada',
        time: '3 horas',
        amount: 0
      }
    ],
    alerts: [
      {
        id: 1,
        type: 'warning',
        title: 'Pago pendiente',
        message: '3 pagos pendientes por más de 24 horas',
        time: '1 hora'
      },
      {
        id: 2,
        type: 'error',
        title: 'Error de sistema',
        message: 'Problema con el procesamiento de pagos',
        time: '2 horas'
      },
      {
        id: 3,
        type: 'info',
        title: 'Mantenimiento programado',
        message: 'Sistema offline mañana de 2:00 a 4:00 AM',
        time: '1 día'
      }
    ]
  });

  useEffect(() => {
    const adminUser = localStorage.getItem('adminUser');
    if (!adminUser) {
      router.push('/admin/login');
      return;
    }

    try {
      const userData = JSON.parse(adminUser);
      setUser(userData);
    } catch (error) {
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'bid': return <Gavel className="w-4 h-4 text-blue-500" />;
      case 'auction': return <Calendar className="w-4 h-4 text-green-500" />;
      case 'payment': return <CreditCard className="w-4 h-4 text-purple-500" />;
      case 'user': return <Users className="w-4 h-4 text-orange-500" />;
      case 'alert': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'info': return <Bell className="w-5 h-5 text-blue-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar activeTab="dashboard" onTabChange={() => {}} />

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
                        <p className="text-sm font-medium text-gray-600">Subastas Activas</p>
                        <p className="text-2xl font-bold text-gray-900">{dashboardData.overview.activeAuctions}</p>
                      </div>
                      <div className="p-2 rounded-full bg-blue-100">
                        <Gavel className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className={`text-sm font-medium ${
                        dashboardData.overview.auctionsChange > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {dashboardData.overview.auctionsChange > 0 ? '+' : ''}{dashboardData.overview.auctionsChange}
                      </span>
                      <span className="text-sm text-gray-600"> vs semana anterior</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Usuarios Registrados</p>
                        <p className="text-2xl font-bold text-gray-900">{dashboardData.overview.totalUsers.toLocaleString()}</p>
                      </div>
                      <div className="p-2 rounded-full bg-purple-100">
                        <Users className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className="text-sm font-medium text-green-600">
                        +{dashboardData.overview.usersChange}%
                      </span>
                      <span className="text-sm text-gray-600"> vs mes anterior</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total de Pujas</p>
                        <p className="text-2xl font-bold text-gray-900">{dashboardData.overview.totalBids.toLocaleString()}</p>
                      </div>
                      <div className="p-2 rounded-full bg-orange-100">
                        <Target className="w-6 h-6 text-orange-600" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className="text-sm font-medium text-green-600">
                        +{dashboardData.overview.bidsChange}%
                      </span>
                      <span className="text-sm text-gray-600"> vs mes anterior</span>
                    </div>
                  </div>
                </div>

                {/* Alerts and Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Alerts */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900">Alertas del Sistema</h3>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        {dashboardData.alerts.map((alert) => (
                          <div key={alert.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                            {getAlertIcon(alert.type)}
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-gray-900">{alert.title}</h4>
                              <p className="text-sm text-gray-600">{alert.message}</p>
                              <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900">Actividad Reciente</h3>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        {dashboardData.recentActivity.map((activity) => (
                          <div key={activity.id} className="flex items-start space-x-3">
                            {getActivityIcon(activity.type)}
                            <div className="flex-1">
                              <p className="text-sm text-gray-900">
                                <span className="font-medium">{activity.user}</span> {activity.action}
                              </p>
                              <p className="text-xs text-gray-500">{activity.time}</p>
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
              </div>
            )}

            {/* Financial Tab */}
            {activeTab === 'financial' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Comisiones Ganadas</p>
                        <p className="text-2xl font-bold text-gray-900">
                          €{dashboardData.financial.commissionEarned.toLocaleString()}
                        </p>
                      </div>
                      <div className="p-2 rounded-full bg-green-100">
                        <DollarSign className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Pagos Pendientes</p>
                        <p className="text-2xl font-bold text-gray-900">
                          €{dashboardData.financial.pendingPayments.toLocaleString()}
                        </p>
                      </div>
                      <div className="p-2 rounded-full bg-yellow-100">
                        <Clock className="w-6 h-6 text-yellow-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Reembolsos Emitidos</p>
                        <p className="text-2xl font-bold text-gray-900">
                          €{dashboardData.financial.refundsIssued.toLocaleString()}
                        </p>
                      </div>
                      <div className="p-2 rounded-full bg-red-100">
                        <CreditCard className="w-6 h-6 text-red-600" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Ingresos Mensuales</h3>
                  <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Gráfico de ingresos mensuales</p>
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
                        <p className="text-sm font-medium text-gray-600">Intentos Fallidos</p>
                        <p className="text-2xl font-bold text-gray-900">{dashboardData.security.failedLogins}</p>
                      </div>
                      <div className="p-2 rounded-full bg-red-100">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                      </div>
                    </div>
                  </div>

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
