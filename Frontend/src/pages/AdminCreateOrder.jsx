import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import { Loader2, UploadCloud } from 'lucide-react';
const AdminCreateOrder = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    productName: '',
    quantity: 1,
    phone: '',
    address: '',
    price: '',
    description: '',
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      toast.error('Product Image is required');
      return;
    }
    setIsLoading(true);
    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }
    data.append('image', image);
    try {
      await api.post('/admin/create-order', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Company Order created successfully!');
      navigate('/admin/orders');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create order');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Create Company Order</h1>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Customer Name</label>
              <input type="text" name="customerName" required value={formData.customerName} onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input type="text" name="phone" required value={formData.phone} onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <textarea name="address" required value={formData.address} onChange={handleChange} rows="2"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div className="md:col-span-2 border-t pt-4 mt-2">
              <h3 className="text-lg font-medium text-gray-900">Product Details</h3>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Product Name</label>
              <input type="text" name="productName" required value={formData.productName} onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Price (£)</label>
              <input type="number" name="price" required value={formData.price} onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <input type="number" name="quantity" min="1" required value={formData.quantity} onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Product Image</label>
              <div className="mt-1 flex items-center">
                <label className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer w-full">
                  <UploadCloud className="w-5 h-5 mr-2 text-gray-400" />
                  <span className="truncate">{image ? image.name : 'Choose file'}</span>
                  <input type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                </label>
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" className="ml-4 h-10 w-10 object-cover rounded-md" />
                )}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="3"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
          </div>
          <div className="pt-4 border-t border-gray-200">
            <button type="submit" disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 items-center">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              Create Company Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default AdminCreateOrder;
