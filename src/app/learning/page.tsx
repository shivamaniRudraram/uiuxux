'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { useAuth } from '@/context/AuthContext';
import { 
  GraduationCap, 
  Play, 
  Award, 
  CheckCircle2, 
  BookOpen, 
  Clock, 
  Star, 
  Heart,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Course {
  id: string;
  title: string;
  category: 'Dev' | 'Design' | 'PM' | 'AI';
  lessons: number;
  duration: string;
  progress: number;
  rating: number;
  instructor: string;
  description: string;
  modules: string[];
}

export default function LearningPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([
    {
      id: 'c1',
      title: 'Advanced Next.js Architecture',
      category: 'Dev',
      lessons: 12,
      duration: '8h 45m',
      progress: 68,
      rating: 4.9,
      instructor: 'Lee Robinson',
      description: 'Master Server Components, advanced routing grids, hydration issues, and optimal rendering layouts.',
      modules: ['React Server Components', 'Streaming and Suspense', 'Server Actions & Hydration', 'Webpack/Turbopack custom configurations'],
    },
    {
      id: 'c2',
      title: 'Design Systems for Scalable Products',
      category: 'Design',
      lessons: 9,
      duration: '5h 15m',
      progress: 100,
      rating: 4.8,
      instructor: 'Sarah Riviera',
      description: 'Establish typography tokens, color scale variables, and complex components for multi-device platforms in Figma.',
      modules: ['Variables & Tokens', 'Component Library Layouts', 'Documentation & Spec handoffs'],
    },
    {
      id: 'c3',
      title: 'AI Product Strategy & Prompt Pipelines',
      category: 'PM',
      lessons: 10,
      duration: '6h 30m',
      progress: 0,
      rating: 4.7,
      instructor: 'Dave Chen (OpenAI PM)',
      description: 'Integrate LLMs, engineer secure prompts, optimize completion costs, and structure product validation.',
      modules: ['Introduction to LLMs', 'Prompt Engineering Patterns', 'Token Cost Analysis', 'AI User Experience Principles'],
    },
  ]);

  const [activeCategory, setActiveCategory] = useState<'All' | 'Dev' | 'Design' | 'PM' | 'AI'>('All');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [certifiedCourse, setCertifiedCourse] = useState<Course | null>(null);

  const handleLessonAdvance = (courseId: string) => {
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        const nextProgress = Math.min(c.progress + 15, 100);
        if (nextProgress === 100 && c.progress < 100) {
          // Trigger confetti explosion on 100% completion
          confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 }
          });
          setCertifiedCourse(c);
          setIsCertificateOpen(true);
        }
        return { ...c, progress: nextProgress };
      }
      return c;
    }));
  };

  const handleShowCertificate = (course: Course) => {
    setCertifiedCourse(course);
    setIsCertificateOpen(true);
  };

  const filteredCourses = activeCategory === 'All' 
    ? courses 
    : courses.filter(c => c.category === activeCategory);

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      
      {/* Academy Header */}
      <div className="pb-4 border-b border-neutral-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-100 flex items-center gap-2">
            Learning academy <GraduationCap size={22} className="text-indigo-400" />
          </h1>
          <p className="text-xs text-neutral-400 mt-1">Upgrade your skills through bite-sized, curriculum-based courses designed by industry executives.</p>
        </div>

        {/* Categories toggler */}
        <div className="flex flex-wrap gap-1.5 bg-neutral-900/60 p-1 border border-neutral-850 rounded-[12px]">
          {(['All', 'Dev', 'Design', 'PM', 'AI'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 text-xs rounded-lg font-semibold transition cursor-pointer ${
                activeCategory === cat 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-650/10' 
                  : 'text-neutral-450 hover:text-neutral-250'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Courses list */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCourses.map((c) => (
          <Card key={c.id} className="glass-panel border-neutral-800/80 flex flex-col justify-between relative overflow-hidden">
            {c.progress === 100 && (
              <div className="absolute top-0 right-0 p-1.5 bg-emerald-500/20 text-emerald-400 rounded-bl-[12px] border-l border-b border-emerald-500/10 flex items-center gap-1 font-bold text-[9px] uppercase tracking-wide">
                <CheckCircle2 size={10} /> Certified
              </div>
            )}
            
            <CardHeader className="mb-2">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={
                  c.category === 'Dev' ? 'primary' :
                  c.category === 'Design' ? 'purple' :
                  c.category === 'PM' ? 'warning' : 'success'
                }>
                  {c.category}
                </Badge>
                <div className="flex items-center text-[10px] text-amber-400 gap-0.5">
                  <Star size={10} fill="currentColor" />
                  <span>{c.rating}</span>
                </div>
              </div>
              <CardTitle className="text-base font-bold text-neutral-100 hover:text-indigo-400 transition cursor-pointer" onClick={() => setSelectedCourse(c)}>
                {c.title}
              </CardTitle>
              <CardDescription className="text-xs text-neutral-400 mt-2 leading-relaxed line-clamp-2">
                {c.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">
              <div className="flex justify-between items-center text-[10px] text-neutral-500 font-semibold uppercase tracking-wider">
                <span className="flex items-center gap-1"><BookOpen size={11} /> {c.lessons} Lessons</span>
                <span className="flex items-center gap-1"><Clock size={11} /> {c.duration}</span>
              </div>

              {/* Progress and status */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-[10px] text-neutral-450 font-bold">
                  <span>Track Progress</span>
                  <span>{c.progress}%</span>
                </div>
                <Progress value={c.progress} color={c.progress === 100 ? 'success' : 'primary'} />
              </div>
            </CardContent>

            <CardFooter className="flex gap-2">
              {c.progress === 100 ? (
                <Button variant="secondary" className="w-full flex items-center justify-center gap-1 text-xs" onClick={() => handleShowCertificate(c)}>
                  <Award size={13} className="text-amber-400" /> View Certificate
                </Button>
              ) : (
                <>
                  <Button variant="secondary" className="flex-1 text-xs" onClick={() => setSelectedCourse(c)}>
                    Curriculum
                  </Button>
                  <Button variant="primary" className="flex-1 text-xs flex items-center justify-center gap-1" onClick={() => handleLessonAdvance(c.id)}>
                    <Play size={10} /> {c.progress === 0 ? 'Start' : 'Next Lesson'}
                  </Button>
                </>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Curriculum Detail Modal */}
      {selectedCourse && (
        <Modal
          isOpen={!!selectedCourse}
          onClose={() => setSelectedCourse(null)}
          title={selectedCourse.title}
          description={`Instructor: ${selectedCourse.instructor} • Rating: ${selectedCourse.rating}/5`}
        >
          <div className="flex flex-col gap-4 mt-2">
            <p className="text-xs text-neutral-400 leading-relaxed">{selectedCourse.description}</p>
            <div className="flex flex-col gap-2 mt-2">
              <span className="text-xs font-bold text-neutral-300">Course Syllabus ({selectedCourse.lessons} Modules)</span>
              <div className="flex flex-col gap-2">
                {selectedCourse.modules.map((m, idx) => (
                  <div key={idx} className="p-3 bg-neutral-950/40 border border-neutral-850/60 rounded-xl flex items-center gap-3 text-xs">
                    <span className="h-5 w-5 rounded-full bg-indigo-900/40 text-indigo-400 flex items-center justify-center font-bold text-[10px]">{idx + 1}</span>
                    <span className="text-neutral-200 font-medium">{m}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Certificate Modal */}
      {isCertificateOpen && certifiedCourse && (
        <Modal
          isOpen={isCertificateOpen}
          onClose={() => setIsCertificateOpen(false)}
          title="Congratulations!"
          size="md"
        >
          <div className="flex flex-col items-center justify-center text-center p-6 bg-gradient-to-b from-indigo-950/10 to-transparent border border-indigo-900/20 rounded-[20px] shadow-2xl relative overflow-hidden my-2">
            
            <div className="p-4 bg-indigo-900/20 text-indigo-400 rounded-full mb-4 border border-indigo-500/20 shadow-lg shadow-indigo-650/15 animate-bounce">
              <Award size={36} />
            </div>

            <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400">Certificate of Completion</span>
            
            <h2 className="text-lg font-bold text-neutral-100 mt-3 max-w-sm tracking-tight leading-snug">
              {certifiedCourse.title}
            </h2>
            
            <p className="text-[11px] text-neutral-450 mt-1">Instructor: {certifiedCourse.instructor}</p>

            <div className="my-6 border-t border-b border-neutral-800/80 py-4 w-full text-xs">
              <p className="text-neutral-400 font-medium">This document certifies that</p>
              <h3 className="text-sm font-extrabold text-neutral-200 mt-1 uppercase tracking-wider">{user?.name || 'Professional User'}</h3>
              <p className="text-neutral-400 font-medium mt-1">has successfully completed the upskilling track program.</p>
            </div>

            <Button variant="primary" size="sm" onClick={() => setIsCertificateOpen(false)} className="w-full flex items-center justify-center gap-1.5">
              <Sparkles size={13} /> Add to SkillBridge Profile
            </Button>
          </div>
        </Modal>
      )}

    </div>
  );
}
