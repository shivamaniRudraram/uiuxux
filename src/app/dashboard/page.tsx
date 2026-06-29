'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Sparkles, 
  ArrowRight, 
  FileText, 
  Calendar, 
  Target,
  Trophy,
  CheckCircle,
  BookOpen
} from 'lucide-react';
import { StudentLearning, CoachAssistant } from '@/components/ui/Illustrations';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats] = useState({
    resumeScore: 84,
    learningProgress: 68,
    todayGoal: 'Refine your resume ATS optimization and schedule one peer-to-peer SkillSwap sync.',
    aiInsight: 'Technical roles targeting next-gen React frameworks prioritize experience in Server Actions and Hydration tuning. Focus on completing your active Next.js track today.',
    upcomingInterview: { role: 'Senior UX Architect', company: 'Stripe', date: 'July 5, 2026' }
  });

  return (
    <div className="flex flex-col gap-10 max-w-5xl mx-auto py-4 animate-in fade-in duration-300">
      
      {/* Personalized Welcome Message */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-2">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-100 flex items-center gap-3">
            Welcome back, {user?.name?.split(' ')[0] || 'Professional'}! <span className="wave">👋</span>
          </h1>
          <p className="text-sm text-neutral-400 mt-1 max-w-xl leading-relaxed">
            Your career roadmap is set to <span className="text-indigo-400 font-semibold">{user?.targetRoles?.split(',')[0] || 'Tech Architect'}</span>.
          </p>
        </div>
        <Badge variant="primary" className="py-1.5 px-4 rounded-full border border-indigo-500/20 text-xs font-bold bg-indigo-950/20">
          <Trophy size={13} className="mr-1.5 text-indigo-400" /> {user?.experience || 'Mid'} Level
        </Badge>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Today's Goal Card (Spans 2 columns) */}
        <Card className="glass-panel border-neutral-800/80 md:col-span-2 relative overflow-hidden p-8 flex flex-col justify-between h-[200px]">
          <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-purple-500" />
          <CardHeader className="p-0">
            <CardTitle className="text-xs font-extrabold tracking-widest text-neutral-450 uppercase flex items-center gap-2">
              <Target size={14} className="text-indigo-400" /> Today&apos;s Career Goal
            </CardTitle>
            <p className="text-base text-neutral-200 mt-3 font-semibold leading-relaxed">
              {stats.todayGoal}
            </p>
          </CardHeader>
          <CardContent className="p-0 flex items-center justify-between text-xs text-neutral-500 mt-4 border-t border-neutral-900/60 pt-4">
            <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-indigo-400" /> Focus for today</span>
            <Link href="/learning" className="text-indigo-400 hover:text-indigo-350 hover:underline flex items-center gap-1 font-bold">
              Review tasks <ArrowRight size={12} />
            </Link>
          </CardContent>
        </Card>

        {/* Upcoming Interview Card */}
        <Card className="glass-panel border-neutral-800/80 p-8 flex flex-col justify-between h-[200px]">
          <CardHeader className="p-0">
            <CardTitle className="text-xs font-extrabold tracking-widest text-neutral-450 uppercase flex items-center gap-2">
              <Calendar size={14} className="text-purple-400" /> Upcoming Interview
            </CardTitle>
            {stats.upcomingInterview ? (
              <div className="mt-3">
                <h4 className="text-sm font-bold text-neutral-200 leading-snug">{stats.upcomingInterview.role}</h4>
                <p className="text-xs text-neutral-400 mt-1">{stats.upcomingInterview.company} • {stats.upcomingInterview.date}</p>
              </div>
            ) : (
              <p className="text-xs text-neutral-500 mt-4">No sessions scheduled.</p>
            )}
          </CardHeader>
          <CardContent className="p-0 mt-4">
            <Link href="/mock-interview" className="w-full">
              <button className="w-full text-center py-2 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800/80 rounded-[12px] text-xs font-bold text-neutral-300 cursor-pointer transition-all active:scale-[0.98]">
                Practice Mock prep
              </button>
            </Link>
          </CardContent>
        </Card>

        {/* AI Insight of the Day (Spans full width) */}
        <Card className="glass-panel border-neutral-800/80 md:col-span-3 p-8 flex flex-col md:flex-row items-center gap-8 bg-gradient-to-tr from-indigo-950/10 via-neutral-900/10 to-transparent">
          <div className="shrink-0 bg-neutral-900/50 p-2 rounded-2xl border border-neutral-800/40">
            <CoachAssistant className="h-20 w-20" />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-extrabold tracking-widest text-neutral-450 uppercase flex items-center gap-2">
              <Sparkles size={14} className="text-indigo-400 animate-pulse" /> AI Insight of the Day
            </span>
            <p className="text-sm text-neutral-300 leading-relaxed font-semibold">
              &ldquo;{stats.aiInsight}&rdquo;
            </p>
          </div>
        </Card>

        {/* Resume Score Card */}
        <Card className="glass-panel border-neutral-800/80 p-8 flex flex-col justify-between gap-6">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-extrabold tracking-widest text-neutral-450 uppercase flex items-center gap-1.5">
                <FileText size={13} className="text-indigo-400" /> Resume Score
              </span>
              <h3 className="text-3xl font-extrabold text-neutral-100 mt-3">{stats.resumeScore} <span className="text-xs font-normal text-neutral-500">/ 100</span></h3>
            </div>
            <Badge variant="success" className="rounded-full px-2.5 font-bold text-[10px]">ATS Compliant</Badge>
          </div>
          <div className="flex flex-col gap-2">
            <Progress value={stats.resumeScore} color="primary" />
            <span className="text-[10px] text-neutral-500 leading-normal">Missing keywords: next-gen server actions, hydration layout.</span>
          </div>
          <Link href="/resume" className="text-xs font-bold text-indigo-400 hover:text-indigo-350 hover:underline flex items-center gap-1">
            Optimize Resume <ArrowRight size={12} />
          </Link>
        </Card>

        {/* Learning Progress Card */}
        <Card className="glass-panel border-neutral-800/80 p-8 flex flex-col justify-between gap-6">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-extrabold tracking-widest text-neutral-450 uppercase flex items-center gap-1.5">
                <BookOpen size={13} className="text-purple-400" /> Learning Progress
              </span>
              <h3 className="text-3xl font-extrabold text-neutral-100 mt-3">{stats.learningProgress}% <span className="text-xs font-normal text-neutral-550">done</span></h3>
            </div>
            <Badge variant="purple" className="rounded-full px-2.5 font-bold text-[10px]">Active Track</Badge>
          </div>
          <div className="flex flex-col gap-2">
            <Progress value={stats.learningProgress} color="accent" />
            <span className="text-[10px] text-neutral-500 leading-normal">Currently on: Next.js Server Components rendering hierarchy.</span>
          </div>
          <Link href="/learning" className="text-xs font-bold text-purple-400 hover:text-purple-350 hover:underline flex items-center gap-1">
            Continue Learning <ArrowRight size={12} />
          </Link>
        </Card>

        {/* Continue Learning Card */}
        <Card className="glass-panel border-neutral-800/80 p-8 flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-extrabold tracking-widest text-neutral-450 uppercase">Academy Catalog</span>
            <h4 className="text-sm font-bold text-neutral-200 mt-3">Design Systems in Figma</h4>
            <p className="text-xs text-neutral-500 leading-relaxed mt-1">Complete variables and tokens layouts to earn your academy certificate badge.</p>
          </div>
          <div className="flex gap-2.5 mt-2">
            <Link href="/learning" className="flex-1">
              <button className="w-full text-center py-2 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 rounded-[12px] text-xs font-bold text-neutral-300 cursor-pointer transition-all active:scale-[0.98]">
                Start Program
              </button>
            </Link>
          </div>
        </Card>

      </div>
    </div>
  );
}
