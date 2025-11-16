
import React, { useState, useEffect } from 'react';
import { productService } from '../../services/productService';
import type { Product } from '../../types';
import { ProductCard } from '../../components/ProductCard';
import { Icon } from '../../components/Icon';
import { LoadingSpinner } from '../../components/LoadingSpinner';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

const FeatureCard: React.FC<{title: string, description: string, icon: 'eye' | 'education', onClick: () => void, buttonText: string}> = ({ title, description, icon, onClick, buttonText }) => (
    <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex flex-col text-center border-b-4 border-transparent hover:border-secondary">
        <div className="bg-secondary p-4 rounded-full mb-4 self-center">
            <Icon name={icon} className="w-10 h-10 text-primary"/>
        </div>
        <h3 className="text-2xl font-bold text-primary mb-2 flex-grow">{title}</h3>
        <p className="text-gray-600 mb-6">{description}</p>
        <button onClick={onClick} className="mt-auto bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary/90 transition-colors">
            {buttonText}
        </button>
    </div>
);


export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      const allProducts = await productService.getProducts();
      setFeaturedProducts(allProducts.slice(0, 4));
      setIsLoading(false);
    };
    fetchProducts();
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative text-white py-20 md:py-32 rounded-b-3xl overflow-hidden mb-16 text-center">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-blue-800 to-teal-600"></div>
         <img src="https://picsum.photos/seed/hero-bg/1600/900" alt="Abstract background" className="absolute inset-0 w-full h-full object-cover opacity-10"/>
        <div className="container mx-auto px-6 relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 drop-shadow-lg">Clarity in Every Frame</h1>
          <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto drop-shadow-sm">Discover premium eyewear and innovative lens technology tailored for your vision.</p>
          <button onClick={() => onNavigate('user/products')} className="bg-secondary text-primary font-bold py-3 px-8 rounded-full hover:bg-yellow-300 transition-all text-lg transform hover:scale-110 shadow-lg">
            Explore Collection
          </button>
        </div>
      </section>

      {/* Unique Features Section */}
      <section className="mb-16 container mx-auto px-6">
        <h2 className="text-4xl font-extrabold text-center mb-10 text-dark">Experience the Future of Eyewear</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
           <FeatureCard
                title="Virtual Try-On"
                description="Upload your photo and virtually try on any frame from our collection. It's simple, manual, and intuitive."
                icon="eye"
                onClick={() => onNavigate('user/products')}
                buttonText="Try It Now"
           />
           <FeatureCard
                title="Lens Education Hub"
                description="Learn everything about lens technology, from ARC and Blue Cut to Progressive lenses, all in one place."
                icon="education"
                onClick={() => onNavigate('user/education-hub')}
                buttonText="Learn More"
           />
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-6">
            <h2 className="text-4xl font-extrabold text-center mb-10 text-dark">Featured Products</h2>
            {isLoading ? (
            <LoadingSpinner />
            ) : (
            <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {featuredProducts.map(product => (
                    <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
                ))}
                </div>
                <div className="text-center mt-12">
                    <button onClick={() => onNavigate('user/products')} className="bg-accent text-white font-bold py-3 px-10 rounded-full hover:bg-accent/90 transition-colors text-lg transform hover:scale-110 shadow-lg">
                        View All
                    </button>
                </div>
            </>
            )}
        </div>
      </section>
    </div>
  );
};
