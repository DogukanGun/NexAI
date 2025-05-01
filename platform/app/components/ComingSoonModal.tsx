"use client"
import { useState, useEffect } from 'react';

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ComingSoonModal = ({ isOpen, onClose }: ComingSoonModalProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-black/80 border border-white/10 rounded-2xl p-8 max-w-lg w-full mx-4 transform transition-all duration-300 scale-100">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-transparent rounded-2xl" />
        
        {/* Content */}
        <div className="relative">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Coming Soon
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
          
          {/* Loading animation */}
          <div className="flex justify-center mb-6">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-2 border-blue-500/20 rounded-full" />
              <div className="absolute inset-0 border-2 border-transparent border-t-blue-500 rounded-full animate-spin" />
            </div>
          </div>

          <p className="text-lg text-center text-gray-300 mb-4">
            We're building something extraordinary
          </p>
          <p className="text-center text-gray-400 mb-6">
            Our team is working hard to bring you the next generation of AI-powered HR solutions. Stay tuned for updates!
          </p>

          {/* Email notification form */}
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email for updates"
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50"
            />
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
              Notify Me
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 