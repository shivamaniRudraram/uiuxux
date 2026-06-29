'use client';

import React, { useState, useEffect } from 'react';
import { Search, Briefcase, GraduationCap, Users, FolderKanban, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'jobs' | 'courses' | 'networking'>('all');
  const router = useRouter();

  // Search items representing initial loaded searchable content
  const searchableDatabase = [
    { type: 'job', title: 'Senior Frontend Engineer', company: 'Vercel', link: '/jobs', details: 'React, Next.js, Tailwind CSS' },
    { type: 'job', title: 'Product Designer (Design Systems)', company: 'Stripe', link: '/jobs', details: 'Figma, UI Design, Design Systems' },
    { type: 'job', title: 'AI Product Manager', company: 'OpenAI', link: '/jobs', details: 'Roadmaps, AI models, Product Growth' },
    { type: 'course', title: 'AI & Machine Learning Foundations', category: 'Technical', link: '/learning', details: 'Generative AI, Prompts' },
    { type: 'course', title: 'UX Design Essentials & Styling Systems', category: 'Design', link: '/learning', details: 'Figma layouts, CSS layout systems' },
    { type: 'networking', title: 'Alex Riviera (Senior Mentor)', category: 'Design & Engineering', link: '/networking', details: 'Teaches: Next.js, Tailwind, Figma' },
    { type: 'networking', title: 'Sarah Chen (Tech Lead)', category: 'Machine Learning', link: '/networking', details: 'Teaches: PyTorch, LLMs, Python' },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredResults = searchableDatabase.filter(item => {
    // Tab match
    if (activeTab === 'jobs' && item.type !== 'job') return false;
    if (activeTab === 'courses' && item.type !== 'course') return false;
    if (activeTab === 'networking' && item.type !== 'networking') return false;

    // Search query match
    const text = `${item.title} ${item.details} ${item.type}`.toLowerCase();
    return text.includes(query.toLowerCase());
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'job': return <Briefcase size={14} className="text-emerald-400" />;
      case 'course': return <GraduationCap size={14} className="text-purple-400" />;
      case 'networking': return <Users size={14} className="text-indigo-400" />;
      default: return <FolderKanban size={14} className="text-neutral-400" />;
    }
  };

  const handleItemClick = (link: string) => {
    router.push(link);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Spotlight Window */}
      <div 
        className="relative w-full max-w-xl glass-panel bg-neutral-900 border border-neutral-800 p-4 shadow-2xl flex flex-col z-10 animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Search input header */}
        <div className="flex items-center gap-3 px-3 py-2 bg-neutral-950 border border-neutral-850 rounded-[12px] mb-4">
          <Search size={18} className="text-neutral-500" />
          <input
            type="text"
            placeholder="Type a skill, job title, course or colleague..."
            className="flex-1 bg-transparent border-none text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-0"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 border-b border-neutral-850/60 pb-3 mb-3">
          {(['all', 'jobs', 'courses', 'networking'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 text-xs rounded-full font-medium transition cursor-pointer capitalize ${
                activeTab === tab 
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/20' 
                  : 'text-neutral-450 hover:text-neutral-200 hover:bg-neutral-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search results list */}
        <div className="flex flex-col gap-1 max-h-[300px] overflow-y-auto pr-1">
          {filteredResults.length === 0 ? (
            <div className="text-center py-8 text-neutral-500 text-xs">
              No results found for &quot;{query}&quot;
            </div>
          ) : (
            filteredResults.map((item, index) => (
              <button
                key={index}
                onClick={() => handleItemClick(item.link)}
                className="w-full text-left flex items-start justify-between p-3 rounded-[12px] bg-neutral-950/20 hover:bg-neutral-800/40 border border-transparent hover:border-neutral-800 transition group cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-neutral-900 rounded-[10px] group-hover:bg-neutral-850 transition">
                    {getIcon(item.type)}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-200 group-hover:text-white transition flex items-center gap-1.5">
                      {item.title}
                      {item.type === 'job' && <span className="text-[10px] text-neutral-400 font-medium font-mono">({(item as any).company})</span>}
                    </h4>
                    <p className="text-xs text-neutral-450 mt-0.5 leading-relaxed">{item.details}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Sparkles size={12} className="text-indigo-400" />
                  <span className="text-[9px] uppercase tracking-wider text-indigo-400 font-bold">Go</span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
