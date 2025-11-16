
import React from 'react';
import { Icon } from './Icon';

interface AdminHeaderProps {
  onNavigate: (path: string) => void;
  onLogout: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onNavigate, onLogout }) => {
  const NavLink: React.FC<{ path: string; label: string; icon: 'dashboard' | 'products' | 'tools' }> = ({ path, label, icon }) => (
    <a
      href={`#${path}`}
      onClick={(e) => { e.preventDefault(); onNavigate(path); }}
      className="flex items-center space-x-2 text-gray-300 hover:bg-primary/50 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
    >
      <Icon name={icon} className="h-5 w-5" />
      <span>{label}</span>
    </a>
  );

  return (
    <header className="bg-dark text-white shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="#admin/dashboard" onClick={(e) => { e.preventDefault(); onNavigate('admin/dashboard'); }} className="text-xl font-bold text-secondary">
              Meena Eyecare Admin
            </a>
            <nav className="hidden md:flex items-center ml-10 space-x-4">
              <NavLink path="admin/dashboard" label="Dashboard" icon="dashboard" />
              <NavLink path="admin/products" label="Products" icon="products" />
              <NavLink path="admin/education" label="Education" icon="tools" />
            </nav>
          </div>
          <div className="flex items-center">
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 text-gray-300 hover:bg-primary/50 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <Icon name="logout" className="h-5 w-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
