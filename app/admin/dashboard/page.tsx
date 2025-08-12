'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import { 
  Users, 
  Gavel, 
  DollarSign, 
  TrendingUp, 
  Eye,
  Plus,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { artworks, auctions } from '@/lib/data';

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

  // Recent activities
  const recentArtworks = artworks.slice(0, 5);
  const upcomingAuctions = auctions
    .filter(a => new Date(a.endDate) > new Date())
    .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
    .slice(0, 3);

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
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Bienvenido al panel de administración</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Gavel className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Obras de Arte</p>
                    <p className="text-2xl font-bold text-gray-900">{totalArtworks}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Calendar className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Subastas Activas</p>
                    <p className="text-2xl font-bold text-gray-900">{activeAuctions}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
                    <p className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pujas Totales</p>
                    <p className="text-2xl font-bold text-gray-900">{totalBids}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activities & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Artworks */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Obras Recientes</h3>
                    <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                      Ver todas
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {recentArtworks.map((artwork) => (
                      <div key={artwork.id} className="flex items-center space-x-4">
                        <img
                          src={artwork.image}
                          alt={artwork.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{artwork.title}</p>
                          <p className="text-xs text-gray-500">{artwork.artist}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">${artwork.currentPrice}</p>
                          <p className="text-xs text-gray-500">{artwork.totalBids} pujas</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Acciones Rápidas</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <button className="w-full flex items-center justify-between p-4 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors">
                      <div className="flex items-center">
                        <Plus className="w-5 h-5 text-primary-600 mr-3" />
                        <span className="font-medium text-primary-700">Nueva Subasta</span>
                      </div>
                      <span className="text-primary-600">→</span>
                    </button>

                    <button className="w-full flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                      <div className="flex items-center">
                        <Gavel className="w-5 h-5 text-green-600 mr-3" />
                        <span className="font-medium text-green-700">Gestionar Subastas</span>
                      </div>
                      <span className="text-green-600">→</span>
                    </button>

                    <button className="w-full flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                      <div className="flex items-center">
                        <Users className="w-5 h-5 text-blue-600 mr-3" />
                        <span className="font-medium text-blue-700">Gestionar Usuarios</span>
                      </div>
                      <span className="text-blue-600">→</span>
                    </button>

                    <button className="w-full flex items-center justify-between p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors">
                      <div className="flex items-center">
                        <AlertCircle className="w-5 h-5 text-yellow-600 mr-3" />
                        <span className="font-medium text-yellow-700">Ver Reportes</span>
                      </div>
                      <span className="text-yellow-600">→</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Auctions */}
            <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Próximas Subastas</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {upcomingAuctions.map((auction) => (
                    <div key={auction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{auction.title}</p>
                          <p className="text-sm text-gray-500">
                            Finaliza: {new Date(auction.endDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {artworks.filter(a => a.auctionId === auction.id).length} obras
                        </p>
                        <p className="text-xs text-gray-500">
                          {Math.ceil((new Date(auction.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} días
                        </p>
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
