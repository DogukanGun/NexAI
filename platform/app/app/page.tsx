"use client"

import { Suspense } from 'react';
import QuickActionsCard from './components/QuickActionsCard';
import AnalyticsCard from './components/AnalyticsCard';
import RecentActivityCard from './components/RecentActivityCard';
import ApplicationCard from './components/ApplicationCard';
import AuthCheck from '../components/AuthCheck';

export default function AppPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Authentication check */}
      <Suspense fallback={null}>
        <AuthCheck />
      </Suspense>
      
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Welcome to NexAI
          </h1>
          <p className="text-gray-400 text-lg">
            Your intelligent HR management platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <QuickActionsCard />
          <AnalyticsCard />
          <RecentActivityCard />
        </div>

        <ApplicationCard />
      </div>
    </div>
  );
} 