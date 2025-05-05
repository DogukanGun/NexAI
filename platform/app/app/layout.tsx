"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  // Client-side authentication check
  useEffect(() => {
    const checkAuth = () => {
      const token = sessionStorage.getItem('token');
      const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('token='));
      
      // If no token in sessionStorage or cookies, redirect
      if (!token || !tokenCookie) {
        router.push('/?needLogin=true');
      }
    };
    
    // Check immediately and set up interval for periodic checks
    checkAuth();
    
    // Cleanup on unmount
    return () => {
      // No cleanup needed for the initial check
    };
  }, [router]);

  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      {children}
    </main>
  );
} 