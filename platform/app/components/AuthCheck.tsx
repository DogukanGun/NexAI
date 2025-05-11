"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthCheck() {
  const router = useRouter();

  // Client-side authentication check
  useEffect(() => {
    const checkAuth = () => {
      const token = sessionStorage.getItem('token');
      
      // If no token in sessionStorage or cookies, redirect
      if (!token) {
        router.push('/?needLogin=true');
      }
    };
    
    // Check immediately
    checkAuth();
  }, [router]);

  return null;
} 