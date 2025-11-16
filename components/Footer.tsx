import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-dark text-light mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="text-xl font-bold text-secondary mb-2">Meena Eyecare</h3>
            <p className="text-gray-400">A venture by Meena Technologies. Providing quality eyecare with cutting-edge technology.</p>
          </div>
          <div>
            <h4 className="font-semibold text-lg text-white mb-2">Quick Links</h4>
            <ul className="space-y-1">
              <li><a href="#user/home" className="text-gray-400 hover:text-secondary">Home</a></li>
              <li><a href="#user/products" className="text-gray-400 hover:text-secondary">Products</a></li>
              <li><a href="#user/login" className="text-gray-400 hover:text-secondary">My Account</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg text-white mb-2">Contact Us</h4>
            <p className="text-gray-400"> Linking Rd, Bandra West, Mumbai, Maharashtra 400050</p>
            <p className="text-gray-400">contact@meenaeyecare.com</p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Meena Technologies. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};