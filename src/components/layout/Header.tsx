'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, Search, Bell, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { GlobalSearch } from './GlobalSearch';

interface HeaderProps {
  toggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Page titles map
  const getPageTitle = () => {
    const route = pathname.split('/')[1];
    switch (route) {
      case 'dashboard': return 'Personal Workspace';
      case 'resume': return 'AI Resume Helper';
      case 'coach': return 'AI Career Coach';
      case 'learning': return 'Learning Academy';
      case 'jobs': return 'Job Matching Hub';
      case 'portfolio': return 'Portfolio Builder';
      case 'skillswap': return 'SkillSwap Community';
      case 'networking': return 'Networking Feed';
      case 'mock-interview': return 'AI Mock Interview';
      case 'discover': return 'Career Discover';
      case 'profile': return 'Profile Settings';
      default: return 'SkillBridge AI';
    }
  };

  // Fetch initial notifications
  useEffect(() => {
    // Standard mock notification feeds to simulate a live product
    setNotifications([
      { id: '1', title: 'SkillSwap Match Found!', message: 'Alex is ready to swap TypeScript for your UI Design skills.', read: false, time: '2h ago' },
      { id: '2', title: 'Interview Preparation', message: 'Your Technical Mock Interview is scheduled for tomorrow.', read: false, time: '5h ago' },
      { id: '3', title: 'Resume Optimizer', message: 'AI scored your resume at 87! Check recommendations to hit 95.', read: true, time: '1d ago' },
    ]);

    // Setup global key handler for search (Ctrl + K)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-35 flex h-16 w-full items-center justify-between border-b border-neutral-900 bg-neutral-950/70 backdrop-blur-md px-6">
      {/* Left controls */}
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar} 
          className="lg:hidden p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-900 transition"
        >
          <Menu size={18} />
        </button>
        <div className="flex flex-col">
          <h1 className="text-sm font-semibold tracking-tight text-neutral-100">{getPageTitle()}</h1>
          <span className="text-[10px] text-neutral-450 hidden sm:inline-block">Welcome back, {user?.name || 'Professional'}</span>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Global Search trigger */}
        <button 
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-[10px] bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-xs text-neutral-400 cursor-pointer transition-all"
        >
          <Search size={14} className="text-neutral-500" />
          <span className="hidden md:inline">Global Search</span>
          <kbd className="hidden md:inline px-1.5 py-0.5 rounded bg-neutral-950 border border-neutral-850 font-mono text-[9px]">Ctrl K</kbd>
        </button>

        {/* Notifications trigger */}
        <div className="relative">
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-900 transition relative"
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-neutral-950 animate-pulse" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {isNotificationsOpen && (
            <>
              <div onClick={() => setIsNotificationsOpen(false)} className="fixed inset-0 z-40" />
              <div className="absolute right-0 mt-2 w-80 glass-panel bg-neutral-900 border border-neutral-800/80 p-4 shadow-xl z-45 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex justify-between items-center pb-2 border-b border-neutral-800 mb-3">
                  <span className="text-xs font-bold text-neutral-100">Notifications</span>
                  {unreadCount > 0 && (
                    <button 
                      onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                      className="text-[10px] text-indigo-400 hover:underline cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="flex flex-col gap-2.5 max-h-[300px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <span className="text-xs text-neutral-500 py-4 text-center block">No notifications</span>
                  ) : (
                    notifications.map((n) => (
                      <div 
                        key={n.id} 
                        className={`p-2 rounded-lg transition-colors ${n.read ? 'opacity-60 bg-transparent' : 'bg-indigo-950/20 border border-indigo-950/30'}`}
                      >
                        <div className="flex justify-between items-start gap-1">
                          <span className="text-xs font-bold text-neutral-200">{n.title}</span>
                          <span className="text-[9px] text-neutral-550 whitespace-nowrap">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User initials bubble */}
        <div className="flex items-center gap-2 border-l border-neutral-850 pl-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-xs text-white border border-indigo-400/20">
            {user?.name?.slice(0, 2).toUpperCase() || 'SB'}
          </div>
          <span className="text-xs font-semibold text-neutral-300 hidden md:inline">{user?.name || 'User'}</span>
        </div>
      </div>

      {/* Global Search dialog */}
      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
};
