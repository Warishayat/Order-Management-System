import React, { useState, useEffect, useContext, useRef } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Loader2, Send, User } from 'lucide-react';
const Messages = () => {
  const { user } = useContext(AuthContext);
  const [sellers, setSellers] = useState([]);
  const [selectedSellerId, setSelectedSellerId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const isAdmin = user?.role === 'admin';
  useEffect(() => {
    if (isAdmin) {
      fetchSellers();
    } else {
      fetchMessages();
    }
  }, [isAdmin]);
  useEffect(() => {
    if (isAdmin && selectedSellerId) {
      fetchMessages(selectedSellerId);
    }
  }, [selectedSellerId]);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  const fetchSellers = async () => {
    try {
      const res = await api.get('/admin/sellers');
      setSellers(res.data.sellers);
      if (res.data.sellers.length > 0) {
        setSelectedSellerId(res.data.sellers[0]._id);
      }
    } catch (error) {
      toast.error('Failed to load sellers');
    } finally {
      setIsLoading(false);
    }
  };
  const fetchMessages = async (sellerId = null) => {
    try {
      const url = isAdmin ? `/admin/messages/${sellerId}` : '/seller/messages';
      const res = await api.get(url);
      setMessages(res.data.messages);
    } catch (error) {
      toast.error('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      const url = isAdmin ? `/admin/messages/${selectedSellerId}` : '/seller/messages';
      const res = await api.post(url, { message: newMessage });
      setMessages([...messages, res.data.newMessage]);
      setNewMessage('');
    } catch (error) {
      toast.error('Failed to send message');
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 flex h-[calc(100vh-8rem)] overflow-hidden">
      {isAdmin && (
        <div className={`w-full md:w-64 border-r border-gray-200 flex-col bg-gray-50 ${selectedSellerId ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-gray-200 font-semibold text-gray-700">Sellers</div>
          <div className="flex-1 overflow-y-auto">
            {sellers.map(seller => (
              <button
                key={seller._id}
                onClick={() => setSelectedSellerId(seller._id)}
                className={`w-full text-left p-4 flex items-center gap-3 transition-colors border-b border-gray-100
                  ${selectedSellerId === seller._id ? 'bg-indigo-50 border-indigo-100' : 'hover:bg-white'}`}
              >
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${selectedSellerId === seller._id ? 'text-indigo-900' : 'text-gray-900'}`}>
                    {seller.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{seller.email}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
      <div className={`flex-1 flex-col min-w-0 bg-white ${isAdmin && !selectedSellerId ? 'hidden md:flex' : 'flex'}`}>
        <div className="h-16 border-b border-gray-200 flex items-center px-4 md:px-6 gap-3">
          {isAdmin && selectedSellerId && (
            <button 
              onClick={() => setSelectedSellerId(null)}
              className="md:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-md"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
          )}
          <h2 className="text-lg font-semibold text-gray-800">
            {isAdmin ? 
              (sellers.find(s => s._id === selectedSellerId)?.name || 'Select a Seller') : 
              'Chat with Admin'}
          </h2>
        </div>
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">No messages yet. Start the conversation!</div>
          ) : (
            messages.map((msg, idx) => {
              const isMine = String(msg.sender) === String(user.id || user._id);
              return (
                <div key={idx} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                    isMine ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                  }`}>
                    <p className="text-sm">{msg.message}</p>
                    <p className={`text-[10px] mt-1 ${isMine ? 'text-indigo-200' : 'text-gray-400'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 bg-white border-t border-gray-200">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || (isAdmin && !selectedSellerId)}
              className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Messages;
