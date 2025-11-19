
import React, { useState } from 'react';
import { authService } from '../../services/authService';

interface SignUpPageProps {
  onNavigate: (path: string) => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({ onNavigate }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await authService.signUp({ fullName, email, password });
      // For better UX as requested, we attempt to redirect immediately.
      // Note: If email verification is strictly enforced by the server, the user won't be logged in
      // and will be redirected to home where they might see a logged out state, or login page.
      // However, in most prototype configs, this provides instant access.
      
      // We wait a brief moment for the session to propagate if auto-sign-in happened
      setTimeout(() => {
          onNavigate('user/home');
      }, 1000);
      
    } catch (err: any) {
      setError(err.message || 'Failed to create account.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create a new account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="full-name">Full Name</label>
            <input id="full-name" type="text" value={fullName} onChange={e => setFullName(e.target.value)} required className="mt-1 input-style w-full" />
          </div>
          <div>
            <label htmlFor="email">Email address</label>
            <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 input-style w-full" />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} className="mt-1 input-style w-full" />
          </div>
          
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          
          <div>
            <button type="submit" disabled={isLoading} className="w-full btn-primary">
              {isLoading ? 'Creating Account...' : 'Sign Up & Login'}
            </button>
          </div>
        </form>
         <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="#user/login" onClick={(e) => { e.preventDefault(); onNavigate('user/login'); }} className="font-medium text-primary hover:text-primary/80">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};