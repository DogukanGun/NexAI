'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ApiService } from '../../services/ApiService';

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // If no token is present, show an error
    if (!token) {
      setVerifying(false);
      setSuccess(false);
      setMessage('Verification token is missing');
      return;
    }

    const verifyEmail = async () => {
      try {
        const apiService = ApiService.getInstance();
        const result = await apiService.verifyEmail(token);
        
        setSuccess(result.success);
        setMessage(result.message);
      } catch (error) {
        setSuccess(false);
        setMessage(error instanceof Error ? error.message : 'Verification failed');
      } finally {
        setVerifying(false);
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
      <div className="bg-[#111] p-8 rounded-xl border border-[#1A1A1A] shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Email Verification
        </h1>
        
        {verifying ? (
          <div className="flex flex-col items-center py-8">
            <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400">Verifying your email address...</p>
          </div>
        ) : success ? (
          <div className="py-6">
            <div className="bg-green-900/20 text-green-400 p-4 rounded-lg mb-6 border border-green-900/50">
              <p className="font-medium">Email verification successful!</p>
              <p className="text-sm mt-2">Your account has been verified. You can now access all features of the platform.</p>
            </div>
            <div className="flex justify-center">
              <Link 
                href="/app" 
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition-colors"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <div className="py-6">
            <div className="bg-red-900/20 text-red-400 p-4 rounded-lg mb-6 border border-red-900/50">
              <p className="font-medium">Verification failed</p>
              <p className="text-sm mt-2">{message}</p>
            </div>
            <div className="flex justify-center">
              <Link 
                href="/app" 
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition-colors"
              >
                Return to Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 