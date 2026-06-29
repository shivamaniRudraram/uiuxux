'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAuth } from '@/context/AuthContext';

export const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isAuthRoute = pathname.startsWith('/auth');
  const isOnboardingRoute = pathname === '/onboarding';
  const isPublicRoute = pathname.startsWith('/portfolio/preview');

  // Protect client-side dashboard routes
  useEffect(() => {
    if (!loading) {
      if (!user && !isAuthRoute && !isPublicRoute) {
        router.push('/auth');
      } else if (user && !user.onboarded && !isOnboardingRoute && !isAuthRoute && !isPublicRoute) {
        router.push('/onboarding');
      } else if (user && user.onboarded && isOnboardingRoute) {
        router.push('/dashboard');
      }
    }
  }, [user, loading, pathname, isAuthRoute, isOnboardingRoute, isPublicRoute, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center gap-4">
        {/* Sleek loading logo animation */}
        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 animate-bounce">
          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <span className="text-xs text-neutral-450 tracking-widest uppercase font-bold animate-pulse">Initializing Platform...</span>
      </div>
    );
  }

  // Auth pages & onboarding pages get a full clean view without sidebars
  if (isAuthRoute || isOnboardingRoute || isPublicRoute) {
    return <main className="min-h-screen bg-neutral-950 flex flex-col">{children}</main>;
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex">
      {/* Navigation Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* Main Panel Content Container */}
      <div className="flex-1 flex flex-col lg:pl-64 min-h-screen">
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 p-6 md:p-8 max-w-[1400px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
