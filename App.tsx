
import React, { useState, useEffect, useCallback } from 'react';
import { UserHeader } from './components/UserHeader';
import { AdminHeader } from './components/AdminHeader';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { HomePage } from './pages/user/HomePage';
import { ProductListPage } from './pages/user/ProductListPage';
import { ProductDetailPage } from './pages/user/ProductDetailPage';
import { CartPage } from './pages/user/CartPage';
import { WishlistPage } from './pages/user/WishlistPage';
import { CheckoutPage } from './pages/user/CheckoutPage';
import { EducationHubPage } from './pages/user/EducationHubPage';
import { VirtualTryOnPage } from './pages/user/VirtualTryOnPage';
import { OrdersPage } from './pages/user/OrdersPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductListPage } from './pages/admin/AdminProductListPage';
import { AdminProductForm } from './pages/admin/AdminProductForm';
import { AdminEducationHubPage } from './pages/admin/AdminEducationHubPage';
import { AdminEducationForm } from './pages/admin/AdminEducationForm';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { LoginPage } from './pages/user/LoginPage';
import { SignUpPage } from './pages/user/SignUpPage';
import { CreateProfilePage } from './pages/user/CreateProfilePage';
import { authService } from './services/authService';
import type { Session } from '@supabase/supabase-js';
import type { Profile } from './types';

const App: React.FC = () => {
  const [route, setRoute] = useState(window.location.hash.slice(1) || 'user/home');
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const handleNavigate = useCallback((path: string) => {
    window.location.hash = path;
  }, []);

  useEffect(() => {
    const fetchSessionAndProfile = async () => {
      const currentSession = await authService.getSession();
      setSession(currentSession);
      if (currentSession) {
        const userProfile = await authService.getProfileForCurrentUser();
        setProfile(userProfile);
      } else {
        setProfile(null);
      }
      setIsAuthLoading(false);
    };

    fetchSessionAndProfile();

    const subscription = authService.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session) {
        const userProfile = await authService.getProfileForCurrentUser();
        setProfile(userProfile);
        if (session.user.phone && userProfile && !userProfile.full_name) {
            handleNavigate('user/create-profile');
        } else if (route === 'user/login' || route === 'user/signup' || route === 'user/create-profile') {
            handleNavigate('user/home');
        }
      } else {
        setProfile(null);
        if (route.startsWith('admin/')) {
          handleNavigate('user/home');
        }
      }
    });

    const handleHashChange = () => {
      setRoute(window.location.hash.slice(1) || 'user/home');
    };
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
        subscription?.unsubscribe();
        window.removeEventListener('hashchange', handleHashChange);
    };
  }, [route, handleNavigate]);

  const handleLogout = async () => {
    try {
        await authService.signOut();
        // Force update state immediately to ensure UI reflects logout
        setSession(null);
        setProfile(null);
        handleNavigate('user/home');
    } catch (error) {
        console.error("Error during logout:", error);
    }
  };

  const renderContent = () => {
    if (isAuthLoading) return null;

    const [area, page, ...params] = route.split('/');
    
    if (session && session.user.phone && profile && !profile.full_name && route !== 'user/create-profile') {
        handleNavigate('user/create-profile');
        return <CreateProfilePage onProfileCreated={() => handleNavigate('user/home')} />;
    }
    if (route === 'user/create-profile') {
        return <CreateProfilePage onProfileCreated={() => handleNavigate('user/home')} />;
    }

    if (area === 'admin') {
      if (profile?.role !== 'admin') {
        return (
            <div className="text-center py-20">
                <h1 className="text-3xl font-bold text-red-600">Access Denied</h1>
                <p className="mt-4 text-gray-700">You do not have permission to view this page.</p>
                <button onClick={() => handleNavigate('user/home')} className="mt-6 bg-primary text-white font-bold py-2 px-4 rounded-lg">Go to Homepage</button>
            </div>
        );
      }
      
      switch (page) {
        case 'dashboard': return <AdminDashboardPage onNavigate={handleNavigate} />;
        case 'products': return <AdminProductListPage onNavigate={handleNavigate} />;
        case 'orders': return <AdminOrdersPage onNavigate={handleNavigate} />;
        case 'product':
          if (params[0] === 'new') return <AdminProductForm onNavigate={handleNavigate} />;
          if (params[0] === 'edit' && params[1]) return <AdminProductForm productId={params[1]} onNavigate={handleNavigate} />;
          break;
        case 'education':
            if (!params.length) return <AdminEducationHubPage onNavigate={handleNavigate} />;
            if (params[0] === 'new') return <AdminEducationForm onNavigate={handleNavigate} />;
            if (params[0] === 'edit' && params[1]) return <AdminEducationForm contentId={params[1]} onNavigate={handleNavigate} />;
            break;
        default:
          handleNavigate('admin/dashboard');
          return <AdminDashboardPage onNavigate={handleNavigate} />;
      }
    }
    
    switch (`${area}/${page}`) {
        case 'user/home': return <HomePage onNavigate={handleNavigate} />;
        case 'user/products': return <ProductListPage onNavigate={handleNavigate} />;
        case 'user/product': return <ProductDetailPage productId={params[0]} onNavigate={handleNavigate} />;
        case 'user/cart': return <CartPage onNavigate={handleNavigate} />;
        case 'user/wishlist': return <WishlistPage onNavigate={handleNavigate} />;
        case 'user/checkout': return <CheckoutPage onNavigate={handleNavigate} />;
        case 'user/orders': return <OrdersPage onNavigate={handleNavigate} />;
        case 'user/education-hub': return <EducationHubPage />;
        case 'user/virtual-try-on': return <VirtualTryOnPage productId={params[0]} onNavigate={handleNavigate} />;
        case 'user/login': return <LoginPage onNavigate={handleNavigate} />;
        case 'user/signup': return <SignUpPage onNavigate={handleNavigate} />;
        default:
            handleNavigate('user/home');
            return <HomePage onNavigate={handleNavigate} />;
    }
  };

  const isAdminView = route.startsWith('admin/') && profile?.role === 'admin';

  return (
    <div className="flex flex-col min-h-screen">
      {isAdminView ? (
        <AdminHeader onNavigate={handleNavigate} onLogout={handleLogout} />
      ) : (
        <UserHeader onNavigate={handleNavigate} session={session} profile={profile} onLogout={handleLogout} />
      )}
      <main className="flex-grow">
        {renderContent()}
      </main>
      {!isAdminView && (
        <>
            <Footer />
            <WhatsAppButton />
        </>
      )}
    </div>
  );
};

export default App;
