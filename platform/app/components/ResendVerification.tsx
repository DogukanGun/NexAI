'use client';

import { useState } from 'react';
import { ApiService } from '../../services/ApiService';

interface ResendVerificationProps {
  userId: string;
  email: string;
}

export default function ResendVerification({ userId, email }: ResendVerificationProps) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleResend = async () => {
    if (sending) return;
    
    // Validate required props
    if (!userId || !email) {
      setError('Missing user ID or email. Cannot resend verification.');
      return;
    }
    
    setSending(true);
    setError('');
    
    try {
      const apiService = ApiService.getInstance();
      const result = await apiService.resendVerificationEmail(userId, email);
      
      if (result.success) {
        setSent(true);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to resend verification email');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mt-6 pt-4 border-t border-[#222]">
      <h3 className="text-lg font-medium mb-2">Didn't receive the email?</h3>
      
      {sent ? (
        <div className="bg-green-900/20 text-green-400 p-3 rounded-lg text-sm">
          Verification email sent successfully. Please check your inbox.
        </div>
      ) : (
        <>
          <p className="text-gray-400 text-sm mb-3">
            If you didn't receive the verification email or if it expired, you can request a new one.
          </p>
          
          {error && (
            <div className="bg-red-900/20 text-red-400 p-3 rounded-lg text-sm mb-3">
              {error}
            </div>
          )}
          
          <button
            onClick={handleResend}
            disabled={sending}
            className={`w-full py-2 px-4 rounded-lg transition-colors ${
              sending 
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {sending ? (
              <span className="flex items-center justify-center">
                <span className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin mr-2"></span>
                Sending...
              </span>
            ) : (
              'Resend Verification Email'
            )}
          </button>
        </>
      )}
    </div>
  );
} 