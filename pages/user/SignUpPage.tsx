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
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await authService.signUp({ fullName, email, password });
      setSuccess(true);
      // After a brief moment, redirect to login
      setTimeout(() => onNavigate('user/login'), 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to create account.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
        <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 py-12 px-4">
            <div className="max-w-md w-full text-center">
                <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <h2 className="mt-4 text-2xl font-bold text-gray-900">Account Created!</h2>
                <p className="mt-2 text-gray-600">Please check your email to verify your account. Redirecting you to login...</p>
            </div>
        </div>
    )
  }

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
              {isLoading ? 'Creating Account...' : 'Sign Up'}
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