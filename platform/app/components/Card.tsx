import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-[#111] p-6 rounded-xl shadow-lg border border-[#1A1A1A] hover:border-[#2A2A2A] transition-colors ${className}`}>
      {children}
    </div>
  );
} 