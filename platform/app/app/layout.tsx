"use client";

import { Suspense } from 'react';
import AuthCheck from '../components/AuthCheck';
import VerificationBanner from '../components/VerificationBanner';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      {/* Authentication check */}
      <Suspense fallback={null}>
        <AuthCheck />
      </Suspense>
      
      {/* Verification banner */}
      <Suspense fallback={null}>
        <VerificationBanner />
      </Suspense>
      
      {children}
    </main>
  );
} 