"use client"

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  onLaunchClick: () => void;
}

export default function Navbar({ onLaunchClick }: NavbarProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check for token on component mount and when token changes
    const checkAuth = () => {
      const token = sessionStorage.getItem('token');
      setIsAuthenticated(!!token);
    };
    
    checkAuth();
    
    // Listen for storage events (in case token is updated in another tab)
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    setIsAuthenticated(false);
    router.push('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-[#0A0A0A] border-b border-[#1A1A1A] z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link 
              href="/" 
              className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
            >
              NexAI
            </Link>
          </div>
          <div className="flex items-center">
            {!isAuthenticated ? (
              <button
                onClick={onLaunchClick}
                className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Launch Platform
              </button>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  href="/app/chat" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Chat
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 