"use client";

import { useState, useEffect } from 'react';

interface DecodedToken {
  sub: string;
  username: string;
  roles: string[];
  verified: boolean;
  companyId?: string;
  exp: number;
  iat: number;
}

export default function JwtDecoder() {
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      try {
        // JWT tokens are three base64-encoded parts separated by periods
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );

        setDecodedToken(JSON.parse(jsonPayload));
      } catch (error) {
        console.error('Failed to decode token:', error);
      }
    }
  }, []);

  if (!decodedToken) {
    return null;
  }

  // Calculate token expiration time
  const expirationDate = new Date(decodedToken.exp * 1000);
  const isExpired = expirationDate < new Date();
  const timeRemaining = new Date(decodedToken.exp * 1000 - Date.now());
  const hoursRemaining = Math.floor(timeRemaining.getTime() / (1000 * 60 * 60));
  const minutesRemaining = Math.floor((timeRemaining.getTime() % (1000 * 60 * 60)) / (1000 * 60));

  return (
    <div className="mt-6 p-4 bg-gray-800 rounded-lg text-sm">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <h3 className="font-medium text-white">Authentication Status</h3>
          {decodedToken.verified ? (
            <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">Verified</span>
          ) : (
            <span className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs">Unverified</span>
          )}
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-400 hover:text-white"
        >
          {isExpanded ? 'Hide Details' : 'Show Details'}
        </button>
      </div>
      
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-gray-700 text-gray-300">
          <div className="mb-2">
            <span className="text-gray-500">Username:</span> {decodedToken.username}
          </div>
          <div className="mb-2">
            <span className="text-gray-500">Roles:</span> {decodedToken.roles.join(', ')}
          </div>
          <div className="mb-2">
            <span className="text-gray-500">User ID:</span> {decodedToken.sub}
          </div>
          <div className="mb-2">
            <span className="text-gray-500">Token expires:</span>{' '}
            <span className={isExpired ? 'text-red-400' : 'text-green-400'}>
              {isExpired 
                ? 'Expired' 
                : `${hoursRemaining}h ${minutesRemaining}m remaining`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
} 