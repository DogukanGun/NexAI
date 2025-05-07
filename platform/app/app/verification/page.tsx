'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ApiService } from '../../../services/ApiService';
import ResendVerification from '../../components/ResendVerification';
import AuthCheck from '../../components/AuthCheck';
import { Suspense } from 'react';

interface UserData {
  id: string;
  email: string;
  isVerified: boolean;
}

export default function VerificationPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const apiService = ApiService.getInstance();
        apiService.setToken(token);
        
        // Get user profile
        const user = await apiService.getProfile();
        
        // Add debug logs to see what data we're getting
        console.log("User profile data:", user);
        
        // Make sure both ID and email are present
        if (!user.id || !user.email) {
          console.error("Missing user ID or email:", { id: user.id, email: user.email });
          setError('User profile is incomplete. Cannot verify email.');
          return;
        }
        
        // Check if user is verified
        const verificationStatus = await apiService.checkVerificationStatus(user.id);
        
        setUserData({
          id: user.id,
          email: user.email,
          isVerified: verificationStatus.isVerified
        });
      } catch (error) {
        setError('Failed to load user data. Please try again later.');
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Authentication check */}
      <Suspense fallback={null}>
        <AuthCheck />
      </Suspense>
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-[#111] p-6 rounded-xl border border-[#1A1A1A] shadow-lg">
          <h1 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Email Verification
          </h1>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="bg-red-900/20 text-red-400 p-4 rounded-lg border border-red-900/50">
              {error}
            </div>
          ) : userData ? (
            <div>
              {userData.isVerified ? (
                <div className="bg-green-900/20 text-green-400 p-4 rounded-lg border border-green-900/50">
                  <p className="font-medium">Your email has been verified!</p>
                  <p className="text-sm mt-2">You have full access to all features of the platform.</p>
                </div>
              ) : (
                <div>
                  <div className="bg-yellow-900/20 text-yellow-400 p-4 rounded-lg border border-yellow-900/50 mb-4">
                    <p className="font-medium">Your email is not verified</p>
                    <p className="text-sm mt-2">
                      Please check your inbox for a verification email and click the link to verify your account.
                      Some features may be limited until you verify your email.
                    </p>
                  </div>
                  
                  {/* Resend verification component */}
                  <ResendVerification userId={userData.id} email={userData.email} />
                </div>
              )}
            </div>
          ) : (
            <div className="bg-red-900/20 text-red-400 p-4 rounded-lg border border-red-900/50">
              User data could not be loaded.
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 