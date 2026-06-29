'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, FolderGit2, Calendar, Sparkles } from 'lucide-react';

interface PublicPortfolio {
  theme: string;
  projects: any[];
  experience: any[];
}

interface PublicUser {
  name: string;
  skills: string;
  bio: string;
  careerGoal: string;
  experience: string;
}

export default function PortfolioPreview() {
  const params = useParams();
  const userId = params.userId as string;
  const [data, setData] = useState<{ user: PublicUser; portfolio: PublicPortfolio } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        const res = await fetch(`/api/portfolio/public/${userId}`);
        const result = await res.json();
        if (res.ok) {
          setData(result);
        } else {
          setError(result.error || 'Failed to load portfolio.');
        }
      } catch (err) {
        setError('Network error loading candidate portfolio.');
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchPublicData();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center gap-3">
        <div className="h-6 w-6 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
        <span className="text-xs text-neutral-450 tracking-wider">Retrieving candidate profile...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md p-6 glass-panel border-neutral-900 flex flex-col gap-3">
          <h2 className="text-base font-bold text-neutral-100">Profile Unavailable</h2>
          <p className="text-xs text-neutral-400 leading-relaxed">{error || 'This user portfolio is private or not configured.'}</p>
        </div>
      </div>
    );
  }

  const { user, portfolio } = data;
  const theme = portfolio.theme;

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col justify-between py-12 px-6">
      
      {/* Portfolio card wrapper */}
      <div className="max-w-3xl w-full mx-auto bg-white text-neutral-850 p-10 rounded-[20px] shadow-2xl border border-neutral-200">
        
        {/* Header Title block */}
        <div className={`border-b-2 pb-6 ${
          theme === 'minimal' ? 'border-neutral-200 text-left' :
          theme === 'classic' ? 'border-neutral-800 text-center font-serif' :
          'border-indigo-600/30 text-left'
        }`}>
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">{user.name}</h1>
            <Badge variant="primary" className="text-[10px] py-1">Verified Candidate</Badge>
          </div>
          <p className="text-xs text-indigo-650 uppercase tracking-widest font-bold mt-2">
            {user.careerGoal?.slice(0, 50) || 'Creative Specialist'}
          </p>
          {user.bio && <p className="text-xs text-neutral-500 mt-4 leading-relaxed max-w-xl">{user.bio}</p>}
        </div>

        {/* Content sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-8 text-xs">
          
          {/* Work Milestone Timeline */}
          <div>
            <h3 className="font-bold text-[11px] uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-1.5 mb-4">Milestones</h3>
            <div className="space-y-4">
              {portfolio.experience.map((e) => (
                <div key={e.id} className="flex flex-col gap-0.5">
                  <div className="flex justify-between items-center text-neutral-950 font-bold">
                    <span>{e.role}</span>
                    <span className="font-normal text-neutral-450 text-[10px]">{e.duration}</span>
                  </div>
                  <span className="text-[10px] text-neutral-500 font-semibold">{e.company}</span>
                </div>
              ))}
              {portfolio.experience.length === 0 && <span className="text-neutral-400 italic">No milestones defined.</span>}
            </div>
          </div>

          {/* Skill list and Projects */}
          <div className="flex flex-col gap-6">
            
            {/* Core Tech Stack */}
            <div>
              <h3 className="font-bold text-[11px] uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-1.5 mb-3">Tech Stacks</h3>
              <div className="flex flex-wrap gap-1.5">
                {user.skills.split(',').map((s) => (
                  <span key={s} className="px-2.5 py-0.5 bg-neutral-100 text-neutral-700 rounded-full font-bold text-[10px] border border-neutral-200">
                    {s.trim()}
                  </span>
                ))}
              </div>
            </div>

            {/* Project grid */}
            <div>
              <h3 className="font-bold text-[11px] uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-1.5 mb-4">Projects</h3>
              <div className="space-y-4">
                {portfolio.projects.map((p) => (
                  <div key={p.id} className="flex flex-col gap-1 border border-neutral-100 hover:border-neutral-200 rounded-xl p-3 bg-neutral-50/20 hover:bg-neutral-50 transition">
                    <div className="flex justify-between items-center text-neutral-950 font-bold">
                      <span>{p.name}</span>
                      {p.link && (
                        <a href={p.link} target="_blank" rel="noopener noreferrer" className="text-indigo-650 hover:text-indigo-500">
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                    <p className="text-neutral-500 text-[11px] mt-1 font-medium leading-relaxed">{p.description}</p>
                  </div>
                ))}
                {portfolio.projects.length === 0 && <span className="text-neutral-400 italic">No projects added yet.</span>}
              </div>
            </div>

          </div>

        </div>

      </div>

      <div className="text-center text-[10px] text-neutral-500 mt-8 flex items-center justify-center gap-1">
        <Sparkles size={11} className="text-indigo-400 animate-pulse" />
        <span>Verified candidate via SkillBridge AI Hub</span>
      </div>

    </div>
  );
}
