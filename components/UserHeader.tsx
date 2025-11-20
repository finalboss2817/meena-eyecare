
import React, { useState, useEffect } from 'react';
import { cartService } from '../services/cartService';
import { wishlistService } from '../services/wishlistService';
import { Icon } from './Icon';
import type { Session } from '@supabase/supabase-js';
import type { Profile } from '../types';

interface UserHeaderProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
  session: Session | null;
  profile: Profile | null;
}

export const UserHeader: React.FC<UserHeaderProps> = ({ onNavigate, onLogout, session, profile }) => {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const updateCounts = () => {
    setCartCount(cartService.getCartItemCount());
    setWishlistCount(wishlistService.getWishlistItemCount());
  };

  useEffect(() => {
    updateCounts();
    window.addEventListener('storage', updateCounts);
    return () => {
      window.removeEventListener('storage', updateCounts);
    };
  }, []);
  
  const handleNavClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    onNavigate(path);
    setIsMenuOpen(false);
  };
  
  const handleLogoutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onLogout();
    setIsMenuOpen(false);
  };

  const NavLink: React.FC<{path: string, label: string, isMobile?: boolean}> = ({ path, label, isMobile = false }) => (
    <a 
      href={`#${path}`} 
      onClick={(e) => handleNavClick(e, path)} 
      className={isMobile ? "text-3xl font-bold text-dark hover:text-primary transition-colors" : "text-dark hover:text-primary transition-colors font-medium"}
    >
      {label}
    </a>
  );
  
  // Fallback name logic
  const displayName = profile?.full_name?.split(' ')[0] || session?.user?.user_metadata?.full_name?.split(' ')[0] || 'User';
  
  const authLinks = session ? (
    <div className="flex items-center space-x-4">
        <a href="#user/orders" onClick={(e) => handleNavClick(e, 'user/orders')} className="hidden sm:inline text-sm font-medium text-gray-600 hover:text-primary">My Orders</a>
        <span className="hidden sm:inline text-sm text-gray-600">| Hi, {displayName}</span>
        {profile?.role === 'admin' && (
           <a href="#admin/dashboard" onClick={(e) => handleNavClick(e, 'admin/dashboard')} className="hidden sm:inline bg-secondary text-primary text-sm font-bold px-3 py-1 rounded-md hover:bg-secondary/90">
             Admin Panel
           </a>
        )}
        <a href="#logout" onClick={handleLogoutClick} className="text-dark hover:text-primary transition-colors" title="Logout">
            <Icon name="logout" />
        </a>
    </div>
  ) : (
    <div className="hidden md:flex items-center space-x-2">
        <a href="#user/login" onClick={(e) => handleNavClick(e, 'user/login')} className="text-sm font-medium text-gray-600 hover:text-primary px-4 py-2 rounded-md">Login</a>
        <a href="#user/signup" onClick={(e) => handleNavClick(e, 'user/signup')} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90">Sign up</a>
    </div>
  );
  
  const mobileMenu = (
     <div className={`fixed inset-0 bg-light z-50 transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out`}>
        <div className="flex justify-end p-6">
            <button onClick={() => setIsMenuOpen(false)}>
                <Icon name="close" className="w-8 h-8"/>
            </button>
        </div>
        <nav className="flex flex-col items-center justify-center h-full space-y-8 -mt-16">
            <NavLink path="user/home" label="Home" isMobile />
            <NavLink path="user/products" label="Products" isMobile />
            <NavLink path="user/education-hub" label="Lens Education Hub" isMobile />
            
            <div className="border-t w-1/2 my-4"></div>

            {!session ? (
              <>
                <a href="#user/login" onClick={(e) => handleNavClick(e, 'user/login')} className="text-2xl font-bold text-dark hover:text-primary transition-colors">Login</a>
                <a href="#user/signup" onClick={(e) => handleNavClick(e, 'user/signup')} className="text-2xl font-bold text-primary hover:text-primary/80">Sign Up</a>
              </>
            ) : (
              <>
                <span className="text-xl text-gray-600">Hi, {displayName}</span>
                <NavLink path="user/orders" label="My Orders" isMobile />
                {profile?.role === 'admin' && <NavLink path="admin/dashboard" label="Admin Panel" isMobile />}
                <a href="#logout" onClick={handleLogoutClick} className="text-2xl font-bold text-dark hover:text-primary transition-colors">Logout</a>
              </>
            )}
        </nav>
     </div>
  );

  return (
    <header className="bg-light shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="#user/home" onClick={(e) => handleNavClick(e, 'user/home')} className="text-2xl font-bold text-primary">
            Meena Eyecare
          </a>
          
          <nav className="hidden md:flex md:items-center md:space-x-8">
            <NavLink path="user/products" label="Products" />
            <NavLink path="user/education-hub" label="Lens Education Hub" />
          </nav>

          <div className="flex items-center space-x-4">
             <a href="#user/wishlist" onClick={(e) => handleNavClick(e, 'user/wishlist')} className="relative text-dark hover:text-primary transition-colors" title="Wishlist">
              <Icon name="wishlist" />
              {wishlistCount > 0 && <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{wishlistCount}</span>}
            </a>
            <a href="#user/cart" onClick={(e) => handleNavClick(e, 'user/cart')} className="relative text-dark hover:text-primary transition-colors" title="Cart">
              <Icon name="cart" />
              {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{cartCount}</span>}
            </a>
            {authLinks}
            <button className="md:hidden" onClick={() => setIsMenuOpen(true)}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
            </button>
          </div>
        </div>
      </div>
      
      {mobileMenu}
    </header>
  );
};
