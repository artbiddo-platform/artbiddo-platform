'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Users,
  Gavel,
  Calendar,
  Download,
  Filter
} from 'lucide-react';
import { artworks, auctions } from '@/lib/data';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
}

export default function AdminReports() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30');
  const router = useRouter();

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
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Calculate statistics
  const totalArtworks = artworks.length;
  const activeAuctions = auctions.filter(a => new Date(a.endDate) > new Date()).length;
  const totalRevenue = artworks.reduce((sum, artwork) => sum + artwork.currentPrice, 0);
  const totalBids = artworks.reduce((sum, artwork) => sum + artwork.totalBids, 0);
  const avgPrice = totalArtworks > 0 ? totalRevenue / totalArtworks : 0;

  // Mock data for charts
  const monthlyRevenue = [
    { month: 'Ene', revenue: 45000 },
    { month: 'Feb', revenue: 52000 },
    { month: 'Mar', revenue: 48000 },
    { month: 'Abr', revenue: 61000 },
    { month: 'May', revenue: 55000 },
    { month: 'Jun', revenue: 67000 },
  ];

  const topCategories = [
    { name: 'Pintura', count: 45, revenue: 125000 },
    { name: 'Escultura', count: 23, revenue: 89000 },
    { name: 'Fotografía', count: 18, revenue: 67000 },
    { name: 'Dibujo', count: 12, revenue: 45000 },
    { name: 'Digital', count: 8, revenue: 32000 },
  ];

  const recentActivity = [
    { type: 'Nueva puja', item: 'La Noche Estrellada', amount: 25000, time: '2 min' },
    { type: 'Subasta finalizada', item: 'Guernica', amount: 45000, time: '1 hora' },
    { type: 'Nuevo usuario', item: 'María González', amount: 0, time: '3 horas' },
    { type: 'Nueva obra', item: 'El Grito', amount: 15000, time: '5 horas' },
    { type: 'Puja ganadora', item: 'Los Girasoles', amount: 32000, time: '1 día' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar user={user} />

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          {/* Header */}
          <div className="bg-white shadow-sm border-b border-gray-200">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Reportes y Analytics</h1>
                  <p className="text-gray-600">Análisis detallado del rendimiento del sistema</p>
                </div>
                <div className="flex items-center space-x-4">
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="7">Últimos 7 días</option>
                    <option value="30">Últimos 30 días</option>
                    <option value="90">Últimos 90 días</option>
                    <option value="365">Último año</option>
                  </select>
                  <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                    <Download className="w-5 h-5" />
                    <span>Exportar</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
                    <p className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
                    <div className="flex items-center text-sm text-green-600">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      +12.5%
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Gavel className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Subastas Activas</p>
                    <p className="text-2xl font-bold text-gray-900">{activeAuctions}</p>
                    <div className="flex items-center text-sm text-green-600">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      +8.2%
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pujas Totales</p>
                    <p className="text-2xl font-bold text-gray-900">{totalBids}</p>
                    <div className="flex items-center text-sm text-green-600">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      +15.3%
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Precio Promedio</p>
                    <p className="text-2xl font-bold text-gray-900">${avgPrice.toLocaleString()}</p>
                    <div className="flex items-center text-sm text-red-600">
                      <TrendingDown className="w-4 h-4 mr-1" />
                      -2.1%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts and Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Revenue Chart */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Ingresos Mensuales</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {monthlyRevenue.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">{item.month}</span>
                        <div className="flex items-center space-x-4">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-primary-600 h-2 rounded-full"
                              style={{ width: `${(item.revenue / 67000) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            ${item.revenue.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Top Categories */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Categorías Más Populares</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {topCategories.map((category, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{category.name}</p>
                          <p className="text-xs text-gray-500">{category.count} obras</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            ${category.revenue.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {((category.revenue / totalRevenue) * 100).toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
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
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          activity.type.includes('puja') ? 'bg-green-100' :
                          activity.type.includes('usuario') ? 'bg-blue-100' :
                          activity.type.includes('obra') ? 'bg-purple-100' :
                          'bg-yellow-100'
                        }`}>
                          {activity.type.includes('puja') ? (
                            <Gavel className="w-4 h-4 text-green-600" />
                          ) : activity.type.includes('usuario') ? (
                            <Users className="w-4 h-4 text-blue-600" />
                          ) : activity.type.includes('obra') ? (
                            <BarChart3 className="w-4 h-4 text-purple-600" />
                          ) : (
                            <Calendar className="w-4 h-4 text-yellow-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{activity.type}</p>
                          <p className="text-xs text-gray-500">{activity.item}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {activity.amount > 0 && (
                          <p className="text-sm font-medium text-gray-900">
                            ${activity.amount.toLocaleString()}
                          </p>
                        )}
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
