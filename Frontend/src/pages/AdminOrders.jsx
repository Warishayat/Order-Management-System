import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import { Loader2, Trash2, Edit2, X, UploadCloud, Info } from 'lucide-react';
const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); 
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [editImage, setEditImage] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const openDetailsModal = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };
  const fetchOrders = async () => {
    try {
      const response = await api.get('/admin/orders');
      setOrders(response.data.orders || []);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, []);
  const updateStatus = async (id, newStatus) => {
    try {
      await api.put(`/admin/order/${id}/status`, { status: newStatus });
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };
  const deleteOrder = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await api.delete(`/admin/order/${id}`);
      toast.success('Order deleted');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to delete order');
    }
  };
  const openEditModal = (order) => {
    setSelectedOrder(order);
    setEditFormData({
      customerName: order.customerName,
      productName: order.productName,
      quantity: order.quantity,
      phone: order.phone,
      address: order.address,
      postcode: order.postcode,
      price: order.price,
      description: order.description || '',
    });
    setEditImage(null);
    setShowEditModal(true);
  };
  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const data = new FormData();
    for (const key in editFormData) {
      if (editFormData[key] !== undefined && editFormData[key] !== null && editFormData[key] !== '') {
        data.append(key, editFormData[key]);
      }
    }
    if (editImage) {
      data.append('image', editImage);
    }
    try {
      await api.put(`/admin/edit-order/${selectedOrder._id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Order updated successfully!');
      setShowEditModal(false);
      fetchOrders();
    } catch (error) {
      console.error('Update Order Error:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to update order');
    } finally {
      setIsLoading(false);
    }
  };
  if (isLoading && orders.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }
  const renderImageUrl = (image) => {
    if (!image) return null;
    return image.startsWith('http') ? image : `http://localhost:8000/${image.replace(/\\/g, '/')}`;
  };
  const filteredOrders = orders.filter(order => activeTab === 'company' ? order.isCompanyOrder : true);
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
      </div>
      <div className="flex space-x-1 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('all')}
          className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'all' 
              ? 'border-indigo-500 text-indigo-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          All Orders
        </button>
        <button
          onClick={() => setActiveTab('company')}
          className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'company' 
              ? 'border-indigo-500 text-indigo-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Company Orders
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => openDetailsModal(order)}>
                      {order.image && (
                        <img src={renderImageUrl(order.image)} alt="" className="w-10 h-10 rounded object-cover" />
                      )}
                      <div>
                        <span className="hover:text-indigo-600 hover:underline">{order.productName} (x{order.quantity})</span>
                        {order.isCompanyOrder && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            Company
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.isCompanyOrder ? 'Admin' : (order.seller?.name || 'Unknown')}<br/>
                    <span className="text-xs text-gray-400">{order.isCompanyOrder ? 'N/A' : (order.seller?.email || 'N/A')}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.customerName}<br/>
                    <span className="text-xs text-gray-400">{order.phone}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">£{order.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      className={`text-xs font-semibold rounded-full px-2 py-1 border-0 ring-1 ring-inset 
                        ${order.status === 'pending' ? 'bg-yellow-50 text-yellow-700 ring-yellow-600/20' : 
                          order.status === 'confirmed' ? 'bg-green-50 text-green-700 ring-green-600/20' : 
                          'bg-red-50 text-red-700 ring-red-600/20'}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openDetailsModal(order)} className="text-blue-500 hover:text-blue-700" title="Details">
                        <Info className="w-5 h-5" />
                      </button>
                      <button onClick={() => openEditModal(order)} className="text-indigo-500 hover:text-indigo-700" title="Edit Order">
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button onClick={() => deleteOrder(order._id)} className="text-red-500 hover:text-red-700" title="Delete Order">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {showEditModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Edit Order</h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              <form id="editForm" className="space-y-4" onSubmit={handleEditSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                    <input type="text" name="customerName" required value={editFormData.customerName} onChange={handleEditChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input type="text" name="phone" required value={editFormData.phone} onChange={handleEditChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <textarea name="address" required value={editFormData.address} onChange={handleEditChange} rows="2"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Postcode</label>
                    <input type="text" name="postcode" required value={editFormData.postcode || ''} onChange={handleEditChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Product Name</label>
                    <input type="text" name="productName" required value={editFormData.productName} onChange={handleEditChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Price (£)</label>
                    <input type="number" name="price" required value={editFormData.price} onChange={handleEditChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Quantity</label>
                    <input type="number" name="quantity" min="1" required value={editFormData.quantity} onChange={handleEditChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Update Image (optional)</label>
                    <div className="mt-1 flex items-center">
                      <label className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer w-full">
                        <UploadCloud className="w-5 h-5 mr-2 text-gray-400" />
                        <span className="truncate">{editImage ? editImage.name : 'Choose file'}</span>
                        <input type="file" className="sr-only" accept="image/*" onChange={(e) => { if (e.target.files && e.target.files[0]) setEditImage(e.target.files[0]); }} />
                      </label>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea name="description" value={editFormData.description} onChange={handleEditChange} rows="2"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                  </div>
                </div>
              </form>
            </div>
            <div className="p-4 border-t flex justify-end gap-3 bg-gray-50">
              <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Cancel
              </button>
              <button type="submit" form="editForm" disabled={isLoading} className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 flex items-center">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Order Details</h3>
              <button onClick={() => setShowDetailsModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto space-y-4">
              {selectedOrder.image && (
                <div className="w-full flex justify-center">
                  <img src={renderImageUrl(selectedOrder.image)} alt="Product" className="max-h-48 object-contain rounded-md border" />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 block">Product Name</span>
                  <span className="font-medium text-gray-900">{selectedOrder.productName}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Status</span>
                  <span className={`inline-flex text-xs leading-5 font-semibold rounded-full px-2 mt-1
                    ${selectedOrder.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      selectedOrder.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">Quantity</span>
                  <span className="font-medium text-gray-900">{selectedOrder.quantity}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Price</span>
                  <span className="font-medium text-gray-900">£{selectedOrder.price}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Customer Name</span>
                  <span className="font-medium text-gray-900">{selectedOrder.customerName}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Phone</span>
                  <span className="font-medium text-gray-900">{selectedOrder.phone}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500 block">Address</span>
                  <span className="font-medium text-gray-900">{selectedOrder.address}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500 block">Postcode</span>
                  <span className="font-medium text-gray-900">{selectedOrder.postcode}</span>
                </div>
                {selectedOrder.description && (
                  <div className="col-span-2">
                    <span className="text-gray-500 block">Description</span>
                    <span className="font-medium text-gray-900">{selectedOrder.description}</span>
                  </div>
                )}
                <div className="col-span-2 border-t pt-2 mt-2">
                  <span className="text-gray-500 block">Seller Information</span>
                  <span className="font-medium text-gray-900">
                    {selectedOrder.isCompanyOrder ? 'Company Order (Admin)' : `${selectedOrder.seller?.name || 'Unknown'} (${selectedOrder.seller?.email || 'N/A'})`}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-4 border-t flex justify-end bg-gray-50">
              <button type="button" onClick={() => setShowDetailsModal(false)} className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminOrders;
