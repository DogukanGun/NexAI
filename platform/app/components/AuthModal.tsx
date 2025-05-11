import { useState, useEffect } from 'react';
import { useApi } from '../hooks/api.hook';
import { LoginResponse } from '../../services/ApiService';
import { useRouter } from 'next/navigation';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ValidationError {
  message: string;
}

interface PasswordValidation {
  hasUpperCase: boolean;
  hasNumber: boolean;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [validationError, setValidationError] = useState<ValidationError | null>(null);
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidation>({
    hasUpperCase: false,
    hasNumber: false,
  });

  const { data, loading, error, callApi } = useApi<LoginResponse>();

  useEffect(() => {
    if (!isLogin) {
      const hasUpperCase = /[A-Z]/.test(formData.password);
      const hasNumber = /[0-9]/.test(formData.password);
      setPasswordValidation({ hasUpperCase, hasNumber });
    }
  }, [formData.password, isLogin]);

  useEffect(() => {
    if (data?.access_token) {
      // Save token to session storage
      sessionStorage.setItem('token', data.access_token);
      
      // Also save token to cookies for middleware authentication
      document.cookie = `token=${data.access_token}; path=/; max-age=86400; SameSite=Strict`;
      
      // Close modal and redirect to app page
      onClose();
      router.push('/app');
    }
  }, [data, onClose, router]);

  const validatePassword = (password: string): boolean => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (!hasUpperCase) {
      setValidationError({ message: 'Password must contain at least one uppercase letter' });
      return false;
    }

    if (!hasNumber) {
      setValidationError({ message: 'Password must contain at least one number' });
      return false;
    }

    setValidationError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Only validate password for registration
    if (!isLogin && !validatePassword(formData.password)) {
      return;
    }

    try {
      if (isLogin) {
        await callApi({
          path: 'login',
          params: {
            username: formData.username,
            password: formData.password,
          },
        });
      } else {
        await callApi({
          path: 'register',
          params: formData,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setFormData({ ...formData, password: newPassword });
    
    // Clear validation error when user starts typing
    if (validationError) {
      setValidationError(null);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-8 w-full max-w-md">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-white">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {(error || validationError) && (
          <div className="bg-red-900/50 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6">
            {validationError?.message || error?.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Username
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="w-full px-4 py-2.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#3A3A3A] focus:ring-1 focus:ring-[#3A3A3A] transition-colors"
              placeholder="Enter your username"
              required
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#3A3A3A] focus:ring-1 focus:ring-[#3A3A3A] transition-colors"
                placeholder="Enter your email"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={handlePasswordChange}
              className="w-full px-4 py-2.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#3A3A3A] focus:ring-1 focus:ring-[#3A3A3A] transition-colors"
              placeholder={isLogin ? "Enter your password" : "Must contain uppercase and number"}
              required
            />
            {!isLogin && (
              <div className="mt-2 text-sm">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${passwordValidation.hasUpperCase ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className={passwordValidation.hasUpperCase ? 'text-green-500' : 'text-red-500'}>
                    At least one uppercase letter
                  </span>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <div className={`w-2 h-2 rounded-full ${passwordValidation.hasNumber ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className={passwordValidation.hasNumber ? 'text-green-500' : 'text-red-500'}>
                    At least one number
                  </span>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-white text-black font-medium rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0A0A0A] focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </div>
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
} 