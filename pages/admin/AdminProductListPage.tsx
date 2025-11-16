
import React, { useState, useEffect } from 'react';
import { productService } from '../../services/productService';
import type { Product } from '../../types';
import { Icon } from '../../components/Icon';
import { LoadingSpinner } from '../../components/LoadingSpinner';

interface AdminProductListPageProps {
  onNavigate: (path: string) => void;
}

export const AdminProductListPage: React.FC<AdminProductListPageProps> = ({ onNavigate }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadProducts = async () => {
    setIsLoading(true);
    const prods = await productService.getProducts();
    setProducts(prods);
    setIsLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);
  
  const formatCurrency = (price: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(price);
  };

  const handleDelete = async (productId: string, productName: string) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      await productService.deleteProduct(productId);
      loadProducts();
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Products</h1>
        <button
          onClick={() => onNavigate('admin/product/new')}
          className="flex items-center space-x-2 bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Icon name="plus" className="h-5 w-5" />
          <span>Add Product</span>
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.length > 0 ? products.map(product => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img src={product.image_url} alt={product.name} className="w-12 h-12 object-cover rounded-md" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{product.brand}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{formatCurrency(product.price)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{product.stock}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-4">
                      <button onClick={() => onNavigate(`admin/product/edit/${product.id}`)} className="text-primary hover:text-indigo-900"><Icon name="edit" /></button>
                      <button onClick={() => handleDelete(product.id, product.name)} className="text-red-600 hover:text-red-900"><Icon name="trash" /></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                    <td colSpan={6} className="text-center py-10 text-gray-500">No products found. Add one to get started!</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};