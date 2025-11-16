import React, { useState } from 'react';
import { authService } from '../../services/authService';

interface LoginPageProps {
  onNavigate: (path: string) => void;
}

type AuthMode = 'email' | 'phone';

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const [mode, setMode] = useState<AuthMode>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await authService.signInWithEmail(email, password);
      onNavigate('user/home');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
      await authService.sendOtp(formattedPhone);
      setOtpSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
      await authService.verifyOtp(formattedPhone, otp);
      // App.tsx will handle redirect
    } catch (err: any) {
      setError(err.message || 'Invalid OTP.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const TabButton: React.FC<{
    currentMode: AuthMode;
    targetMode: AuthMode;
    setMode: (mode: AuthMode) => void;
    children: React.ReactNode;
  }> = ({ currentMode, targetMode, setMode, children }) => (
    <button
      onClick={() => {
        setMode(targetMode);
        setError('');
      }}
      className={`w-1/2 py-3 text-sm font-medium leading-5 text-center transition-colors duration-150 ease-in-out
        ${currentMode === targetMode
          ? 'text-primary border-b-2 border-primary'
          : 'text-gray-500 hover:text-gray-700'
        }`
      }
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="flex border-b border-gray-200 mb-6">
                <TabButton currentMode={mode} targetMode="email" setMode={setMode}>Sign in with Email</TabButton>
                <TabButton currentMode={mode} targetMode="phone" setMode={setMode}>Sign in with Phone (OTP)</TabButton>
            </div>
            
            {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
            
            {mode === 'email' && (
                <form className="space-y-6" onSubmit={handleEmailSubmit}>
                    <div>
                        <label>Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 input-style w-full" />
                    </div>
                    <div>
                        <label>Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 input-style w-full" />
                    </div>
                    <button type="submit" disabled={isLoading} className="w-full btn-primary">
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>
            )}

            {mode === 'phone' && !otpSent && (
                <form className="space-y-6" onSubmit={handlePhoneSubmit}>
                    <div>
                        <label>Phone Number</label>
                        <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="9876543210" required className="mt-1 input-style w-full" />
                    </div>
                    <button type="submit" disabled={isLoading} className="w-full btn-primary">
                        {isLoading ? 'Sending...' : 'Send OTP'}
                    </button>
                </form>
            )}

            {mode === 'phone' && otpSent && (
                 <form className="space-y-6" onSubmit={handleOtpSubmit}>
                    <p className="text-center text-sm">Enter the OTP sent to +91{phone}</p>
                    <div>
                        <label>OTP Code</label>
                        <input type="text" value={otp} onChange={e => setOtp(e.target.value)} required maxLength={6} className="mt-1 input-style w-full" />
                    </div>
                    <button type="submit" disabled={isLoading} className="w-full btn-primary">
                        {isLoading ? 'Verifying...' : 'Verify & Sign In'}
                    </button>
                     <button onClick={() => setOtpSent(false)} className="text-center w-full text-sm text-primary hover:underline">Change number</button>
                </form>
            )}
        </div>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <a href="#user/signup" onClick={(e) => { e.preventDefault(); onNavigate('user/signup'); }} className="font-medium text-primary hover:text-primary/80">
            Sign up
          </a>
        </p>

      </div>
    </div>
  );
};