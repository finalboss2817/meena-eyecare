
import React, { useState, useEffect } from 'react';
import { productService } from '../../services/productService';
import { cartService } from '../../services/cartService';
import { wishlistService } from '../../services/wishlistService';
import type { Product, Category } from '../../types';
import { Icon } from '../../components/Icon';
import { LoadingSpinner } from '../../components/LoadingSpinner';

interface ProductDetailPageProps {
  productId: string;
  onNavigate: (path: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ productId, onNavigate }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showVirtualTryOn, setShowVirtualTryOn] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
        setIsLoading(true);
        const p = await productService.getProductById(productId);
        if (p) {
            setProduct(p);
            const cat = await productService.getCategoryById(p.category_id);
            if (cat) {
              setCategory(cat);
              const catName = cat.name.toLowerCase();
              setShowVirtualTryOn(catName.includes('eyeglasses') || catName.includes('sunglasses'));
            }
            setIsWishlisted(wishlistService.isWishlisted(p.id));
        }
        setIsLoading(false);
    };
    
    fetchProduct();

    const handleStorageChange = () => {
       if (product) setIsWishlisted(wishlistService.isWishlisted(product.id));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);

  }, [productId, product?.id]);

  const formatCurrency = (price: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(price);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!product) {
    return (
      <div className="container mx-auto text-center py-20">
        <h2 className="text-2xl font-bold">Product not found</h2>
        <button onClick={() => onNavigate('user/products')} className="mt-4 text-primary hover:underline">
          Back to Products
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    cartService.addToCart(product.id, quantity);
    alert(`${quantity} x ${product.name} added to cart!`);
  };

  const handleToggleWishlist = () => {
    wishlistService.toggleWishlist(product.id);
  };
  
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <button onClick={() => onNavigate('user/products')} className="flex items-center text-primary mb-6 hover:underline font-semibold">
        <Icon name="chevron-left" className="w-5 h-5 mr-1" />
        Back to Products
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Image */}
        <div className="bg-white rounded-lg shadow-lg p-4 flex items-center justify-center">
          <img src={product.image_url} alt={product.name} className="w-full h-auto object-contain rounded-md" style={{maxHeight: '500px'}} />
        </div>
        
        {/* Product Details */}
        <div>
          <span className="text-sm text-gray-500 uppercase font-bold">{product.brand}</span>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-dark my-2">{product.name}</h1>
          <div className="flex items-center space-x-2">
            {category && <span className="text-md text-gray-600 bg-gray-100 px-3 py-1 rounded-full font-medium">{category.name}</span>}
            {product.lens_type && <span className="text-md text-primary bg-blue-100 px-3 py-1 rounded-full font-medium capitalize">{product.lens_type.replace('-', ' ')}</span>}
          </div>
          <p className="text-4xl font-bold text-primary my-4">{formatCurrency(product.price)}</p>
          <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>
          
          <div className="flex items-center space-x-4 mb-6">
            <label htmlFor="quantity" className="font-semibold text-lg">Quantity:</label>
            <div className="flex items-center border rounded-md">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-2 text-gray-600 hover:bg-gray-100 rounded-l-md transition-colors"><Icon name="minus" /></button>
              <input type="number" id="quantity" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} className="w-16 text-center text-lg font-bold border-none focus:ring-0" />
              <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="p-2 text-gray-600 hover:bg-gray-100 rounded-r-md transition-colors"><Icon name="plus" /></button>
            </div>
            <span className="text-sm text-gray-500">{product.stock} in stock</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={handleAddToCart} className="flex-1 bg-accent text-white font-bold py-3 px-6 rounded-lg hover:bg-accent/90 transition-colors transform hover:scale-105">
              Add to Cart
            </button>
            <button onClick={handleToggleWishlist} className="flex items-center justify-center bg-gray-200 text-dark font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors">
              <Icon name="wishlist" className={`w-6 h-6 mr-2 transition-colors ${isWishlisted ? 'text-red-500 fill-current' : ''}`} />
              {isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}
            </button>
          </div>
          
           {showVirtualTryOn && (
              <div className="mt-6 border-t pt-6">
                <button 
                  onClick={() => onNavigate(`user/virtual-try-on/${product.id}`)}
                  className="w-full bg-primary text-white font-bold py-4 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2 text-lg transform hover:scale-105"
                >
                  <Icon name="eye" className="w-6 h-6" />
                  <span>Virtual Try-On</span>
                </button>
              </div>
           )}

           {/* Mock Prescription Upload */}
           <div className="mt-6 border-t pt-6">
             <h3 className="text-lg font-semibold mb-2">Have a Prescription?</h3>
             <p className="text-sm text-gray-600 mb-3">You can upload it during checkout. For this prototype, just click the button to simulate the action.</p>
             <button className="w-full border-2 border-dashed border-gray-400 text-gray-600 py-4 rounded-lg hover:bg-gray-100 hover:border-primary hover:text-primary transition-colors font-semibold">
                Click to Mock Upload Prescription
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};
