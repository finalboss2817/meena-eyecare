
import React, { useState, useEffect } from 'react';
import { productService } from '../../services/productService';
import { educationService } from '../../services/educationService';
import { Icon } from '../../components/Icon';

interface AdminDashboardPageProps {
  onNavigate: (path: string) => void;
}

const StatCard: React.FC<{ title: string; value: number | string; icon: 'products' | 'tools' }> = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
    <div className="bg-secondary p-3 rounded-full">
      <Icon name={icon} className="h-8 w-8 text-primary" />
    </div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-3xl font-bold text-dark">{value}</p>
    </div>
  </div>
);

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate }) => {
  const [productCount, setProductCount] = useState<number | string>('...');
  const [categoryCount, setCategoryCount] = useState<number | string>('...');
  const [educationCount, setEducationCount] = useState<number | string>('...');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
        setIsLoading(true);
        const [products, categories, education] = await Promise.all([
            productService.getProducts(),
            productService.getCategories(),
            educationService.getContent()
        ]);
        setProductCount(products.length);
        setCategoryCount(categories.length);
        setEducationCount(education.length);
        setIsLoading(false);
    };
    fetchStats();
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Products" value={isLoading ? '...' : productCount} icon="products" />
        <StatCard title="Total Categories" value={isLoading ? '...' : categoryCount} icon="tools" />
        <StatCard title="Education Articles" value={isLoading ? '...' : educationCount} icon="tools" />
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={() => onNavigate('admin/product/new')}
            className="flex items-center space-x-2 bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Icon name="plus" className="h-5 w-5" />
            <span>Add New Product</span>
          </button>
           <button 
            onClick={() => onNavigate('admin/products')}
            className="flex items-center space-x-2 bg-gray-200 text-dark font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <Icon name="edit" className="h-5 w-5" />
            <span>Manage Products</span>
          </button>
          <button 
            onClick={() => onNavigate('admin/education')}
            className="flex items-center space-x-2 bg-gray-200 text-dark font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <Icon name="edit" className="h-5 w-5" />
            <span>Manage Education Hub</span>
          </button>
        </div>
      </div>
    </div>
  );
};
