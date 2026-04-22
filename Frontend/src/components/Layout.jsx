import React, { useState, useContext } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Users, ShoppingCart, LogOut, PlusCircle, Package, MessageSquare, Menu, X } from 'lucide-react';

const Layout = ({ role }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Seller Requests', path: '/admin/requests', icon: Users },
    { name: 'All Orders', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Messages', path: '/admin/messages', icon: MessageSquare },
  ];

  const sellerLinks = [
    { name: 'Dashboard', path: '/seller/dashboard', icon: LayoutDashboard },
    { name: 'Create Order', path: '/seller/create-order', icon: PlusCircle },
    { name: 'My Orders', path: '/seller/orders', icon: Package },
    { name: 'Messages', path: '/seller/messages', icon: MessageSquare },
  ];

  const links = role === 'admin' ? adminLinks : sellerLinks;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-800/50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 bg-white border-r border-gray-200 z-30 w-64 transform transition-transform duration-300 md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          <span className="text-xl font-bold text-gray-800">OMS Portal</span>
          <button className="md:hidden text-gray-500 hover:text-gray-700" onClick={() => setIsSidebarOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname.startsWith(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 z-10">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-md"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="md:hidden text-lg font-semibold text-gray-800 truncate">OMS Portal</div>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <span className="text-sm font-medium text-gray-700 hidden sm:block">
              {user?.name} <span className="text-gray-400 capitalize">({user?.role})</span>
            </span>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
