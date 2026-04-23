import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import { Loader2, Plus, X, Wallet } from 'lucide-react';
const AdminSellers = () => {
  const [sellers, setSellers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [commissionData, setCommissionData] = useState({
    amount: '',
    week: '',
    note: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fetchSellers = async () => {
    try {
      const response = await api.get('/admin/all-sellers');
      setSellers(response.data.sellers || []);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to fetch sellers');
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchSellers();
  }, []);
  const openCommissionModal = (seller) => {
    setSelectedSeller(seller);
    setCommissionData({ amount: '', week: '', note: '' });
    setShowModal(true);
  };
  const handleCommissionChange = (e) => {
    setCommissionData({ ...commissionData, [e.target.name]: e.target.value });
  };
  const handleCommissionSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/admin/add-commission', {
        sellerId: selectedSeller._id,
        amount: Number(commissionData.amount),
        week: commissionData.week,
        note: commissionData.note
      });
      toast.success('Commission assigned successfully');
      setShowModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to assign commission');
    } finally {
      setIsSubmitting(false);
    }
  };
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">All Sellers</h1>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sellers.map((seller) => (
                <tr key={seller._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {seller.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {seller.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => openCommissionModal(seller)} 
                      className="inline-flex items-center gap-1 px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                    >
                      <Wallet className="w-4 h-4" />
                      Assign Commission
                    </button>
                  </td>
                </tr>
              ))}
              {sellers.length === 0 && (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">No sellers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {}
      {showModal && selectedSeller && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Assign Commission to {selectedSeller.name}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCommissionSubmit}>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount (£)</label>
                  <input 
                    type="number" 
                    name="amount" 
                    required 
                    min="0"
                    value={commissionData.amount} 
                    onChange={handleCommissionChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Week / Period</label>
                  <input 
                    type="text" 
                    name="week" 
                    required 
                    placeholder="e.g., Week 1, Jan 2024"
                    value={commissionData.week} 
                    onChange={handleCommissionChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Note (Optional)</label>
                  <textarea 
                    name="note" 
                    rows="2"
                    value={commissionData.note} 
                    onChange={handleCommissionChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                  />
                </div>
              </div>
              <div className="p-4 border-t flex justify-end gap-3 bg-gray-50">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 flex items-center"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                  Assign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminSellers;
