'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Mail,
  Phone,
  Calendar,
  Shield,
  UserCheck,
  UserX,
  Users,
  AlertTriangle,
  CheckCircle,
  X,
  Settings,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Zap,
  Target,
  Award,
  FileText,
  Download,
  Upload,
  Lock,
  Unlock,
  Star,
  Flag,
  CreditCard,
  Activity,
  Clock,
  DollarSign,
  Gavel
} from 'lucide-react';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'bidder' | 'seller' | 'admin';
  status: 'active' | 'suspended' | 'pending' | 'verified';
  joinDate: string;
  lastLogin: string;
  totalBids: number;
  totalSpent: number;
  totalSales: number;
  totalEarnings: number;
  avatar: string;
  isKYCVerified: boolean;
  fraudScore: number;
  trustScore: number;
  documents: string; // JSON string
  paymentMethods: string; // JSON string
  location: string;
  preferences: string; // JSON string
  notes: string;
}

// Mock user data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'María González',
    email: 'maria.gonzalez@email.com',
    phone: '+34 612 345 678',
    role: 'bidder',
    status: 'verified',
    joinDate: '2024-01-15',
    lastLogin: '2024-01-20T10:30:00',
    totalBids: 24,
    totalSpent: 12500,
    totalSales: 0,
    totalEarnings: 0,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    isKYCVerified: true,
    fraudScore: 1,
    trustScore: 95,
    documents: JSON.stringify(['DNI', 'Comprobante de domicilio']),
    paymentMethods: JSON.stringify(['Visa ****1234', 'PayPal']),
    location: 'Madrid, España',
    preferences: JSON.stringify(['Arte Contemporáneo', 'Pintura']),
    notes: 'Cliente VIP, puja frecuentemente en obras de alto valor'
  },
  {
    id: '2',
    name: 'Carlos Rodríguez',
    email: 'carlos.rodriguez@email.com',
    phone: '+34 623 456 789',
    role: 'seller',
    status: 'verified',
    joinDate: '2024-01-10',
    lastLogin: '2024-01-19T15:45:00',
    totalBids: 0,
    totalSpent: 0,
    totalSales: 8,
    totalEarnings: 45000,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    isKYCVerified: true,
    fraudScore: 0,
    trustScore: 98,
    documents: JSON.stringify(['Pasaporte', 'Certificado de autenticidad']),
    paymentMethods: ['Transferencia bancaria'],
    location: 'Barcelona, España',
    preferences: JSON.stringify(['Escultura', 'Arte Clásico']),
    notes: 'Vendedor confiable, obras de alta calidad'
  },
  {
    id: '3',
    name: 'Ana Martínez',
    email: 'ana.martinez@email.com',
    phone: '+34 634 567 890',
    role: 'bidder',
    status: 'suspended',
    joinDate: '2024-01-05',
    lastLogin: '2024-01-18T09:15:00',
    totalBids: 8,
    totalSpent: 3200,
    totalSales: 0,
    totalEarnings: 0,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    isKYCVerified: false,
    fraudScore: 7,
    trustScore: 45,
    documents: ['DNI'],
    paymentMethods: ['Tarjeta prepago'],
    location: 'Valencia, España',
    preferences: ['Arte Moderno'],
    notes: 'Cuenta suspendida por pujas sospechosas'
  },
  {
    id: '4',
    name: 'Luis Fernández',
    email: 'luis.fernandez@email.com',
    phone: '+34 645 678 901',
    role: 'bidder',
    status: 'active',
    joinDate: '2024-01-20',
    lastLogin: '2024-01-20T14:20:00',
    totalBids: 15,
    totalSpent: 8900,
    totalSales: 0,
    totalEarnings: 0,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    isKYCVerified: true,
    fraudScore: 2,
    trustScore: 87,
    documents: JSON.stringify(['DNI', 'Comprobante de ingresos']),
    paymentMethods: ['Mastercard ****5678'],
    location: 'Sevilla, España',
    preferences: JSON.stringify(['Fotografía', 'Arte Digital']),
    notes: 'Nuevo cliente prometedor'
  },
  {
    id: '5',
    name: 'Sofia López',
    email: 'sofia.lopez@email.com',
    phone: '+34 656 789 012',
    role: 'seller',
    status: 'pending',
    joinDate: '2024-01-12',
    lastLogin: '2024-01-20T11:00:00',
    totalBids: 0,
    totalSpent: 0,
    totalSales: 0,
    totalEarnings: 0,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    isKYCVerified: false,
    fraudScore: 3,
    trustScore: 60,
    documents: ['DNI'],
    paymentMethods: [],
    location: 'Bilbao, España',
    preferences: ['Arte Contemporáneo'],
    notes: 'Pendiente de verificación KYC'
  }
];

export default function UsersManagement() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('list');
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
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Filter users based on search and filters
  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesVerification = verificationFilter === 'all' || 
      (verificationFilter === 'verified' && user.isKYCVerified) ||
      (verificationFilter === 'unverified' && !user.isKYCVerified);
    
    return matchesSearch && matchesRole && matchesStatus && matchesVerification;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Activo</span>;
      case 'suspended':
        return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Suspendido</span>;
      case 'pending':
        return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Pendiente</span>;
      case 'verified':
        return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Verificado</span>;
      default:
        return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Desconocido</span>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'bidder':
        return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Pujador</span>;
      case 'seller':
        return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">Vendedor</span>;
      case 'admin':
        return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Administrador</span>;
      default:
        return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Usuario</span>;
    }
  };

  const getFraudScoreColor = (score: number) => {
    if (score <= 2) return 'text-green-600 bg-green-100';
    if (score <= 5) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
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
                  <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
                  <p className="text-gray-600">Administra todos los usuarios del sistema</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => setShowCreateModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                  >
                  <Plus className="w-5 h-5" />
                  <span>Nuevo Usuario</span>
                </button>
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                    <Upload className="w-5 h-5" />
                    <span>Importar</span>
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
                  { id: 'list', name: 'Lista de Usuarios', icon: Users },
                  { id: 'analytics', name: 'Analíticas', icon: BarChart3 },
                  { id: 'kyc', name: 'Verificación KYC', icon: Shield },
                  { id: 'fraud', name: 'Detección de Fraude', icon: AlertTriangle }
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
            {/* List Tab */}
            {activeTab === 'list' && (
              <div className="space-y-6">
            {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar usuarios..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Role Filter */}
                <div>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">Todos los roles</option>
                    <option value="bidder">Pujadores</option>
                    <option value="seller">Vendedores</option>
                        <option value="admin">Administradores</option>
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">Todos los estados</option>
                    <option value="active">Activos</option>
                    <option value="suspended">Suspendidos</option>
                        <option value="pending">Pendientes</option>
                        <option value="verified">Verificados</option>
                      </select>
                    </div>

                    {/* Verification Filter */}
                    <div>
                      <select
                        value={verificationFilter}
                        onChange={(e) => setVerificationFilter(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">Toda verificación</option>
                        <option value="verified">KYC Verificado</option>
                        <option value="unverified">KYC Pendiente</option>
                  </select>
                </div>

                {/* Results Count */}
                <div className="flex items-center justify-end">
                  <span className="text-sm text-gray-600">
                    {filteredUsers.length} usuarios encontrados
                  </span>
                </div>
              </div>
            </div>

            {/* Users List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Lista de Usuarios</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Usuario
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Rol & Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actividad
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Verificación
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Seguridad
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Último Acceso
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full overflow-hidden">
                              <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.name}
                              </div>
                              <div className="text-sm text-gray-500 flex items-center">
                                <Mail className="w-3 h-3 mr-1" />
                                {user.email}
                              </div>
                              <div className="text-sm text-gray-500 flex items-center">
                                <Phone className="w-3 h-3 mr-1" />
                                {user.phone}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                              <div className="space-y-1">
                          {getRoleBadge(user.role)}
                          {getStatusBadge(user.status)}
                              </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                                {user.role === 'bidder' ? (
                                  <>
                            <div className="flex items-center">
                                      <Gavel className="w-4 h-4 text-gray-400 mr-2" />
                              {user.totalBids} pujas
                            </div>
                            <div className="text-xs text-gray-500">
                                      €{user.totalSpent.toLocaleString()} gastado
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div className="flex items-center">
                                      <DollarSign className="w-4 h-4 text-gray-400 mr-2" />
                                      {user.totalSales} ventas
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      €{user.totalEarnings.toLocaleString()} ganado
                                    </div>
                                  </>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                {user.isKYCVerified ? (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                ) : (
                                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                                )}
                                <span className={`text-xs font-semibold rounded-full px-2 py-1 ${
                                  user.isKYCVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {user.isKYCVerified ? 'KYC OK' : 'KYC Pendiente'}
                                </span>
                            </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="space-y-1">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getFraudScoreColor(user.fraudScore)}`}>
                                  Fraude: {user.fraudScore}/10
                                </span>
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTrustScoreColor(user.trustScore)}`}>
                                  Confianza: {user.trustScore}%
                                </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                                <Clock className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">
                                  {new Date(user.lastLogin).toLocaleDateString()}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                                <button 
                                  onClick={() => setSelectedUser(user)}
                                  className="text-blue-600 hover:text-blue-900 p-1"
                                  title="Ver detalles"
                                >
                              <Eye className="w-4 h-4" />
                            </button>
                                <button className="text-green-600 hover:text-green-900 p-1" title="Editar">
                              <Edit className="w-4 h-4" />
                            </button>
                            {user.status === 'active' ? (
                                  <button className="text-red-600 hover:text-red-900 p-1" title="Suspender">
                                    <Lock className="w-4 h-4" />
                              </button>
                            ) : (
                                  <button className="text-green-600 hover:text-green-900 p-1" title="Activar">
                                    <Unlock className="w-4 h-4" />
                              </button>
                            )}
                                <button className="text-red-600 hover:text-red-900 p-1" title="Eliminar">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Empty State */}
            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron usuarios</h3>
                <p className="text-gray-500 mb-6">
                  No hay usuarios que coincidan con los filtros aplicados.
                </p>
                    <button 
                      onClick={() => setShowCreateModal(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                    >
                  Crear Nuevo Usuario
                </button>
              </div>
            )}
          </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {mockUsers.length}
                        </p>
                      </div>
                      <div className="p-2 rounded-full bg-blue-100">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">KYC Verificados</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {mockUsers.filter(u => u.isKYCVerified).length}
                        </p>
                      </div>
                      <div className="p-2 rounded-full bg-green-100">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Usuarios Activos</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {mockUsers.filter(u => u.status === 'active').length}
                        </p>
                      </div>
                      <div className="p-2 rounded-full bg-purple-100">
                        <Activity className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Sospechosos</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {mockUsers.filter(u => u.fraudScore > 5).length}
                        </p>
                      </div>
                      <div className="p-2 rounded-full bg-red-100">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Análisis de Usuarios</h3>
                  <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Gráficos de análisis de usuarios</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* KYC Tab */}
            {activeTab === 'kyc' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Verificaciones KYC Pendientes</h3>
                  <div className="space-y-4">
                    {mockUsers.filter(u => !u.isKYCVerified).map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            <p className="text-xs text-gray-500">Documentos: {user.documents.join(', ')}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                            Aprobar
                          </button>
                          <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                            Rechazar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Fraud Detection Tab */}
            {activeTab === 'fraud' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Usuarios Sospechosos</h3>
                  <div className="space-y-4">
                    {mockUsers.filter(u => u.fraudScore > 3).map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <AlertTriangle className="w-5 h-5 text-red-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-600">Puntuación de fraude: {user.fraudScore}/10</p>
                            <p className="text-xs text-gray-500">Confianza: {user.trustScore}%</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                            Investigar
                          </button>
                          <button className="text-yellow-600 hover:text-yellow-800 text-sm font-medium">
                            Suspender
                          </button>
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

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Crear Nuevo Usuario</h2>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nombre completo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="email@ejemplo.com"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+34 600 000 000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rol</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="bidder">Pujador</option>
                    <option value="seller">Vendedor</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Contraseña segura"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button 
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors">
                Crear Usuario
              </button>
        </div>
      </div>
        </div>
      )}
    </div>
  );
}
