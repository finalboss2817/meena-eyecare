import React, { useState, useEffect } from 'react';
import { productService } from '../../services/productService';
import type { Product, Category, LensType } from '../../types';
import { Icon } from '../../components/Icon';
import { LoadingSpinner } from '../../components/LoadingSpinner';

// FIX: Define props interface for the component.
interface AdminProductFormProps {
  productId?: string;
  onNavigate: (path: string) => void;
}

const INITIAL_STATE: Omit<Product, 'id'> = {
    name: '', brand: '', price: 0, stock: 0, image_url: 'https://picsum.photos/seed/placeholder/400/400', 
    description: '', category_id: '', offer: '', frame_type: 'standard', lens_type: undefined
};

export const AdminProductForm: React.FC<AdminProductFormProps> = ({ productId, onNavigate }) => {
  const [product, setProduct] = useState<Partial<Product>>(INITIAL_STATE);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLensCategory, setIsLensCategory] = useState(false);
  const isEditing = !!productId;

  useEffect(() => {
    const loadData = async () => {
        setIsLoading(true);
        const cats = await productService.getCategories();
        setCategories(cats);

        if (isEditing) {
            const existingProduct = await productService.getProductById(productId);
            if (existingProduct) {
                setProduct(existingProduct);
                const category = cats.find(c => c.id === existingProduct.category_id);
                setIsLensCategory(category?.name.toLowerCase() === 'lenses');
            } else {
                 console.error("Product not found");
                 onNavigate('admin/products');
            }
        } else {
            setProduct(INITIAL_STATE);
        }
        setIsLoading(false);
    };

    loadData();
  }, [productId, isEditing, onNavigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'category_id') {
        const category = categories.find(c => c.id === value);
        setIsLensCategory(category?.name.toLowerCase() === 'lenses');
    }
    
    const parsedValue = name === 'price' || name === 'stock' ? parseFloat(value) : value;
    setProduct(prev => ({ ...prev, [name]: parsedValue }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Mock image handling
    if(e.target.files && e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target && typeof event.target.result === 'string') {
                // In a real app, you would upload this to Supabase Storage and get a URL.
                setProduct(prev => ({ ...prev, image_url: event.target.result as string }));
            }
        }
        reader.readAsDataURL(e.target.files[0]);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let productData = { ...product };
    if (!isLensCategory) {
        productData.lens_type = undefined;
    }

    if (isEditing) {
      await productService.updateProduct(productData as Product);
    } else {
      await productService.addProduct(productData as Omit<Product, 'id'>);
    }
    onNavigate('admin/products');
  };
  
  if(isLoading) {
    return <LoadingSpinner className="min-h-[50vh]"/>
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
       <button onClick={() => onNavigate('admin/products')} className="flex items-center text-primary mb-6 hover:underline">
        <Icon name="chevron-left" className="w-5 h-5 mr-1" />
        Back to Product List
      </button>
      <h1 className="text-3xl font-bold mb-8">{isEditing ? 'Edit Product' : 'Add New Product'}</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Product Name</label>
            <input type="text" name="name" value={product.name} onChange={handleChange} className="mt-1 block w-full input-style" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Brand</label>
            <input type="text" name="brand" value={product.brand} onChange={handleChange} className="mt-1 block w-full input-style" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select name="category_id" value={product.category_id} onChange={handleChange} className="mt-1 block w-full input-style" required>
              <option value="">Select a category</option>
              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </div>
          
          {isLensCategory && (
            <div>
                <label className="block text-sm font-medium text-gray-700">Lens Type</label>
                <select name="lens_type" value={product.lens_type} onChange={handleChange} className="mt-1 block w-full input-style" required>
                    <option value="">Select a lens type</option>
                    <option value="blue-cut">Blue Cut</option>
                    <option value="progressive">Progressive</option>
                    <option value="bifocal">Bifocal</option>
                </select>
            </div>
          )}

          {!isLensCategory && (
             <div>
                <label className="block text-sm font-medium text-gray-700">Frame Type</label>
                <select name="frame_type" value={product.frame_type} onChange={handleChange} className="mt-1 block w-full input-style" required>
                    <option value="standard">Standard</option>
                    <option value="thick-rim">Thick-Rim</option>
                    <option value="half-rim">Half-Rim</option>
                    <option value="rimless">Rimless</option>
                </select>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input type="number" step="0.01" name="price" value={product.price} onChange={handleChange} className="mt-1 block w-full input-style" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Stock</label>
            <input type="number" name="stock" value={product.stock} onChange={handleChange} className="mt-1 block w-full input-style" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Offer (e.g., 10% Off)</label>
            <input type="text" name="offer" value={product.offer} onChange={handleChange} placeholder="Optional" className="mt-1 block w-full input-style" />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea name="description" value={product.description} onChange={handleChange} rows={4} className="mt-1 block w-full input-style" required></textarea>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Product Image</label>
            <div className="mt-1 flex items-center space-x-4">
                <img src={product.image_url} alt="Product preview" className="w-24 h-24 object-cover rounded-md bg-gray-100" />
                <input type="file" onChange={handleFileChange} accept="image/*" className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>
            </div>
          </div>
        </div>
        <div className="mt-8 text-right">
          <button type="submit" className="bg-accent text-white font-bold py-3 px-8 rounded-lg hover:bg-accent/90 transition-colors">
            {isEditing ? 'Update Product' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  );
};
