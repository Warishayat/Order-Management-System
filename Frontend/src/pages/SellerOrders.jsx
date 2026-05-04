import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import { Loader2, Trash2, Edit2, XCircle, Info, X, UploadCloud, Truck, MessageSquare } from 'lucide-react';
const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [editImage, setEditImage] = useState(null);
  const [showViewNoteModal, setShowViewNoteModal] = useState(false);
  const [showDriverDetailsModal, setShowDriverDetailsModal] = useState(false);
  const [viewNote, setViewNote] = useState('');
  const [driverDetails, setDriverDetails] = useState({ name: '', phone: '' });
  const fetchOrders = async () => {
    try {
      const response = await api.get('/seller/my-orders');
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
  const renderImageUrl = (image) => {
    if (!image) return null;
    return image.startsWith('http') ? image : `http://localhost:8000/${image.replace(/\\/g, '/')}`;
  };
  const deleteOrder = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await api.delete(`/seller/order/${id}`);
      toast.success('Order deleted');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to delete order');
    }
  };
  const cancelOrder = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await api.put(`/seller/cancel-order/${id}`);
      toast.success('Order cancelled');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to cancel order');
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
      deliveryDate: order.deliveryDate ? new Date(order.deliveryDate).toISOString().split('T')[0] : '',
      deliveryNote: order.deliveryNote || '',
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
      data.append(key, editFormData[key]);
    }
    if (editImage) {
      data.append('image', editImage);
    }
    try {
      await api.put(`/seller/edit-order/${selectedOrder._id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Order updated successfully!');
      setShowEditModal(false);
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update order');
    } finally {
      setIsLoading(false);
    }
  };
  const openDetailsModal = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };
  if (isLoading && orders.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => openDetailsModal(order)}>
                      {order.image && (
                        <img src={renderImageUrl(order.image)} alt="" className="w-10 h-10 rounded object-cover" />
                      )}
                      <span className="hover:text-indigo-600 hover:underline">{order.productName} (x{order.quantity})</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.customerName}<br/>
                    <span className="text-xs text-gray-400">{order.phone}</span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        (order.status === 'confirmed' || order.status === 'delivered') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-4">
                      <button onClick={() => openDetailsModal(order)} className="text-blue-500 hover:text-blue-700 transition-colors" title="Details">
                        <Info className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => {
                          setViewNote(order.deliveryNote || 'No note available');
                          setShowViewNoteModal(true);
                        }} 
                        className={`${order.deliveryNote ? 'text-indigo-600' : 'text-gray-400'} hover:text-indigo-800`} 
                        title="View Delivery Note"
                      >
                        <MessageSquare className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => {
                          if (order.driver?.name) {
                            setDriverDetails({ name: order.driver.name, phone: order.driver.phone });
                            setShowDriverDetailsModal(true);
                          } else {
                            toast.error('Driver not assigned yet');
                          }
                        }} 
                        className={`${order.driver?.name ? 'text-green-600' : 'text-gray-400'} hover:text-green-800`} 
                        title="Driver Info"
                      >
                        <Truck className="w-5 h-5" />
                      </button>
                      {order.status !== 'confirmed' && order.status !== 'cancelled' && (
                        <>
                          <button onClick={() => openEditModal(order)} className="text-indigo-500 hover:text-indigo-700" title="Edit Order">
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button onClick={() => cancelOrder(order._id)} className="text-orange-500 hover:text-orange-700" title="Cancel Order">
                            <XCircle className="w-5 h-5" />
                          </button>
                        </>
                      )}
                      <button onClick={() => deleteOrder(order._id)} className="text-red-500 hover:text-red-700" title="Delete Order">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">No orders found.</td>
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Delivery Date</label>
                    <input type="date" name="deliveryDate" value={editFormData.deliveryDate} onChange={handleEditChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Delivery Note</label>
                    <textarea name="deliveryNote" value={editFormData.deliveryNote} onChange={handleEditChange} rows="2"
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
                      (selectedOrder.status === 'confirmed' || selectedOrder.status === 'delivered') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
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
                {selectedOrder.deliveryDate && (
                  <div>
                    <span className="text-gray-500 block">Delivery Date</span>
                    <span className="font-medium text-gray-900">{new Date(selectedOrder.deliveryDate).toLocaleDateString()}</span>
                  </div>
                )}
                {selectedOrder.deliveryNote && (
                  <div className="col-span-2">
                    <span className="text-gray-500 block">Delivery Note</span>
                    <span className="font-medium text-gray-900 italic text-indigo-600">"{selectedOrder.deliveryNote}"</span>
                  </div>
                )}
                {selectedOrder.driver && selectedOrder.driver.name && (
                  <div className="col-span-2 bg-indigo-50 p-2 rounded-md border border-indigo-100">
                    <span className="text-indigo-700 font-semibold text-xs uppercase tracking-wider block mb-1">Driver Information</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-gray-500 text-xs block">Name</span>
                        <span className="font-medium text-gray-900">{selectedOrder.driver.name}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs block">Phone</span>
                        <span className="font-medium text-gray-900">{selectedOrder.driver.phone}</span>
                      </div>
                    </div>
                  </div>
                )}
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

      {showViewNoteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b bg-indigo-50">
              <h3 className="text-lg font-semibold text-indigo-900">Delivery Note</h3>
              <button onClick={() => setShowViewNoteModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-700 italic text-lg leading-relaxed">"{viewNote}"</p>
            </div>
            <div className="p-4 border-t bg-gray-50 flex justify-end">
              <button onClick={() => setShowViewNoteModal(false)} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showDriverDetailsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b bg-green-50">
              <h3 className="text-lg font-semibold text-green-900 flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Driver Information
              </h3>
              <button onClick={() => setShowDriverDetailsModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-500 font-medium">Name</span>
                <span className="text-gray-900 font-bold text-lg">{driverDetails.name}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-500 font-medium">Phone</span>
                <span className="text-gray-900 font-bold text-lg text-indigo-600">{driverDetails.phone}</span>
              </div>
            </div>
            <div className="p-4 border-t bg-gray-50 flex justify-end">
              <button onClick={() => setShowDriverDetailsModal(false)} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium">
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default SellerOrders;
