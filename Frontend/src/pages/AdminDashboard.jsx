import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import { Users, ShoppingBag, Loader2, PoundSterling } from 'lucide-react';
const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, pendingRequests: 0 });
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/admin/dashboard');
        setStats(response.data);
      } catch (error) {
        toast.error('Failed to fetch dashboard data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }
  const statCards = [
    { title: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Total Revenue', value: `£${stats.totalRevenue}`, icon: PoundSterling, color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'Pending Seller Requests', value: stats.pendingRequests, icon: Users, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 flex items-center gap-4">
              <div className={`p-4 rounded-full ${stat.bg} ${stat.color}`}>
                <Icon className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default AdminDashboard;
