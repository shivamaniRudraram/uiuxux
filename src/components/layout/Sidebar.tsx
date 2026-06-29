'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  LayoutDashboard, 
  FileText, 
  Bot, 
  GraduationCap, 
  Briefcase, 
  FolderGit2, 
  RefreshCw, 
  Users, 
  MessageSquareCode, 
  Compass, 
  UserCog, 
  LogOut,
  Sparkles
} from 'lucide-react';

export const Sidebar: React.FC<{ isOpen: boolean; toggleSidebar: () => void }> = ({ isOpen, toggleSidebar }) => {
  const pathname = usePathname();
  const { logout } = useAuth();

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'AI Resume Helper', href: '/resume', icon: FileText },
    { name: 'AI Career Coach', href: '/coach', icon: Bot },
    { name: 'Learning Hub', href: '/learning', icon: GraduationCap },
    { name: 'Job Hub', href: '/jobs', icon: Briefcase },
    { name: 'Portfolio Builder', href: '/portfolio', icon: FolderGit2 },
    { name: 'SkillSwap Hub', href: '/skillswap', icon: RefreshCw },
    { name: 'Networking Hub', href: '/networking', icon: Users },
    { name: 'Mock Interview', href: '/mock-interview', icon: MessageSquareCode },
    { name: 'Discover Page', href: '/discover', icon: Compass },
    { name: 'Profile Settings', href: '/profile', icon: UserCog },
  ];

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div 
          onClick={toggleSidebar} 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed inset-y-0 left-0 z-45 w-64 border-r border-neutral-800/80 bg-neutral-950/80 backdrop-blur-xl p-5 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col gap-8">
          {/* Logo Title */}
          <div className="flex items-center gap-2.5 px-2">
            <div className="p-2 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-[10px] shadow-lg shadow-indigo-500/10">
              <Sparkles size={18} className="text-white" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight bg-gradient-to-r from-neutral-100 to-neutral-300 bg-clip-text text-transparent">
                SkillBridge AI
              </span>
              <span className="block text-[9px] uppercase tracking-widest text-indigo-400 font-bold -mt-0.5">
                Enterprise SaaS
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1 overflow-y-auto max-h-[70vh] pr-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-sm font-medium transition-all duration-200 group ${
                    isActive 
                      ? 'bg-indigo-600/10 text-indigo-300 border border-indigo-500/20' 
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/50 border border-transparent'
                  }`}
                  onClick={() => {
                    if (window.innerWidth < 1024) toggleSidebar();
                  }}
                >
                  <Icon 
                    size={16} 
                    className={`transition-colors ${isActive ? 'text-indigo-400' : 'text-neutral-500 group-hover:text-neutral-300'}`} 
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Footer controls */}
        <div className="pt-4 border-t border-neutral-900 flex flex-col gap-2">
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-sm font-medium text-neutral-450 hover:text-red-400 hover:bg-red-950/20 transition-all border border-transparent"
          >
            <LogOut size={16} className="text-neutral-550 group-hover:text-red-400" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
