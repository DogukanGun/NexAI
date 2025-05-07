"use client";

import { useState, useEffect } from 'react';
import { ApiService } from '../../services/ApiService';
import Link from 'next/link';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  roles: string[];
}

export default function VerificationBanner() {
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkVerificationStatus = async () => {
      try {
        setLoading(true);
        // Get the profile information which includes verification status
        const api = ApiService.getInstance();
        const token = sessionStorage.getItem('token');
        
        if (token) {
          api.setToken(token);
          const userProfile = await api.getProfile() as UserProfile;
          setUserId(userProfile.id);
          
          // Check if user is verified using the verification endpoint
          if (userProfile.id) {
            const verificationStatus = await api.checkVerificationStatus(userProfile.id);
            setIsVerified(verificationStatus.isVerified);
          } else {
            setIsVerified(false);
          }
        } else {
          setIsVerified(false);
        }
      } catch (error) {
        console.error('Error checking verification status:', error);
        setIsVerified(false);
      } finally {
        setLoading(false);
      }
    };

    checkVerificationStatus();
  }, []);

  if (loading || isVerified === true || isVerified === null) {
    return null;
  }

  return (
    <div className="bg-amber-500 text-black p-3 text-center">
      <p className="font-medium flex items-center justify-center flex-wrap gap-2">
        Your account is not verified. Some features may be limited.
        <Link 
          href="/app/verification" 
          className="bg-black text-white px-3 py-1 rounded-full text-sm hover:bg-gray-800 transition-colors"
        >
          Verify Now
        </Link>
      </p>
    </div>
  );
} 