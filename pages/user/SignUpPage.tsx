
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

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateEmail(email)) {
        setError('Please enter a valid email address.');
        return;
    }

    setIsLoading(true);
    
    try {
      // 1. Attempt Sign Up ONLY. 
      // Do not attempt to SignIn here to avoid the "loophole" of logging in existing users via Signup form.
      const data = await authService.signUp({ fullName, email, password });

      // CRITICAL CHECK: Supabase Silent Duplicate Detection (Security Feature)
      // If 'identities' is an empty array, it means the user already exists, but Supabase is hiding the error.
      if (data.user && data.user.identities && data.user.identities.length === 0) {
          setError('This email is already registered. Please sign in instead.');
          setIsLoading(false);
          return;
      }

      // 2. Check for immediate session (Success - Auto Login)
      // This happens if "Confirm Email" is disabled in Supabase settings.
      if (data.session) {
          onNavigate('user/home');
          return;
      }

      // 3. If no session, but no error, it means Email Confirmation is required.
      // We do NOT attempt to auto-login manually here.
      if (data.user && !data.session) {
          setError('Account created! Please check your email to confirm your account before logging in.');
          setIsLoading(false);
          return;
      }
      
      setIsLoading(false);

    } catch (err: any) {
      console.error("Signup error:", err);
      setIsLoading(false);
      const errorMessage = err.message?.toLowerCase() || '';
      
      if (errorMessage.includes('already registered') || errorMessage.includes('unique constraint')) {
          setError('This email is already registered. Please sign in instead.');
      } else {
          setError(err.message || 'Failed to create account.');
      }
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
            <label htmlFor="full-name" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input id="full-name" type="text" value={fullName} onChange={e => setFullName(e.target.value)} required className="mt-1 input-style w-full" placeholder="John Doe" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
            <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 input-style w-full" placeholder="you@example.com" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} className="mt-1 input-style w-full" placeholder="••••••••" />
          </div>
          
          {error && <div className={`border px-4 py-3 rounded relative text-sm ${error.includes('created') ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-600'}`} role="alert">{error}</div>}
          
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
