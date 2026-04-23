import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import { ShoppingBag, Loader2, PoundSterling, PackageCheck, Wallet } from 'lucide-react';
const SellerDashboard = () => {
  const [stats, setStats] = useState({ totalOrders: 0, pendingOrders: 0, completedOrders: 0, totalRevenue: 0 });
  const [commissionData, setCommissionData] = useState({ totalCommission: 0, commissions: [] });
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [dashboardRes, commissionRes] = await Promise.all([
          api.get('/seller/dashboard'),
          api.get('/seller/my-commission')
        ]);
        setStats(dashboardRes.data);
        setCommissionData(commissionRes.data);
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
    { title: 'Pending Orders', value: stats.pendingOrders, icon: PackageCheck, color: 'text-orange-600', bg: 'bg-orange-100' },
    { title: 'Completed Orders', value: stats.completedOrders, icon: PackageCheck, color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'Total Revenue', value: `£${stats.totalRevenue}`, icon: PoundSterling, color: 'text-purple-600', bg: 'bg-purple-100' },
    { title: 'Total Commission', value: `£${commissionData.totalCommission}`, icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  ];
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Seller Dashboard</h1>
      <div className="flex flex-wrap justify-center gap-4 md:gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 flex items-center gap-4 flex-1 min-w-[240px] max-w-[320px]">
              <div className={`p-4 rounded-full ${stat.bg} ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-500 whitespace-nowrap">{stat.title}</p>
                <p className="text-lg md:text-xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>
      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">My Commission History</h2>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Week</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {commissionData.commissions.map((comm) => (
                <tr key={comm._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{comm.week}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">£{comm.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{comm.note || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(comm.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {commissionData.commissions.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">No commission records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default SellerDashboard;
