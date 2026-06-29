'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input, Textarea } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Modal } from '@/components/ui/modal';
import { 
  FileText, 
  Sparkles, 
  Download, 
  RefreshCw, 
  Plus, 
  Trash, 
  History,
  CheckCircle,
  Eye,
  FileUp,
  Columns,
  Grid,
  Info
} from 'lucide-react';
import { ResumeAssistant } from '@/components/ui/Illustrations';
import confetti from 'canvas-confetti';

interface ExpItem {
  id: string;
  role: string;
  company: string;
  duration: string;
  description: string;
}

export default function ResumeStudioPage() {
  const [name, setName] = useState('Sarah Riviera');
  const [title, setTitle] = useState('Senior Frontend Developer');
  const [skills, setSkills] = useState('React, Next.js, TypeScript, Tailwind CSS, REST APIs');
  const [education, setEducation] = useState('B.S. in Computer Science - Stanford University');
  const [experienceList, setExperienceList] = useState<ExpItem[]>([
    {
      id: '1',
      role: 'Frontend Engineer',
      company: 'Vercel',
      duration: '2023 - Present',
      description: 'Built high-fidelity user interfaces, next-gen components, and optimized layout metrics. Led the implementation of advanced Next.js server components.',
    },
  ]);
  const [template, setTemplate] = useState<'minimal' | 'modern' | 'classic'>('modern');

  // Drag and drop state
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  // Resume Tailoring States
  const [jobDescription, setJobDescription] = useState('');
  const [activeMode, setActiveMode] = useState<'editor' | 'tailor'>('editor');
  const [isTailoring, setIsTailoring] = useState(false);
  
  // AI tailored outputs
  const [matchPercentage, setMatchPercentage] = useState<number>(68);
  const [missingSkills, setMissingSkills] = useState<string[]>(['Docker', 'GraphQL APIs', 'A/B Testing']);
  const [missingKeywords, setMissingKeywords] = useState<string[]>(['LCP optimization', 'hydration tuning', 'Server Actions']);
  const [tailorSuggestions, setTailorSuggestions] = useState<any[]>([
    {
      original: 'Built high-fidelity user interfaces, next-gen components, and optimized layout metrics.',
      suggested: 'Developed server-rendered components in Next.js, optimizing LCP metrics by 24% and streamlining hydration pipelines.',
      explanation: 'Connects directly with next-gen rendering keywords in the target JD.',
    }
  ]);
  
  const [tailoredResume, setTailoredResume] = useState<{ title: string; skills: string; experience: ExpItem[] }>({
    title: 'Senior Frontend Developer',
    skills: 'React, Next.js, TypeScript, Tailwind CSS, REST APIs',
    experience: [
      {
        id: '1',
        role: 'Frontend Engineer',
        company: 'Vercel',
        duration: '2023 - Present',
        description: 'Built high-fidelity user interfaces, next-gen components, and optimized layout metrics. Led the implementation of advanced Next.js server components.',
      },
    ],
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setUploadedFileName(file.name);
      setName('Sarah Riviera');
      setTitle('Senior UX Architect');
      setSkills('React, Figma, Design Systems, TypeScript, CSS layout');
      confetti({
        particleCount: 50,
        spread: 30,
      });
    }
  };

  const handleAddExperience = () => {
    setExperienceList(prev => [
      ...prev,
      {
        id: Math.random().toString(),
        role: '',
        company: '',
        duration: '',
        description: '',
      },
    ]);
  };

  const handleUpdateExperience = (id: string, field: keyof ExpItem, val: string) => {
    setExperienceList(prev => prev.map(item => item.id === id ? { ...item, [field]: val } : item));
  };

  const handleRemoveExperience = (id: string) => {
    setExperienceList(prev => prev.filter(item => item.id !== id));
  };

  const handleTailorResume = async () => {
    if (!jobDescription.trim()) {
      alert('Please paste a target Job Description first.');
      return;
    }
    setIsTailoring(true);
    try {
      const res = await fetch('/api/resume/tailor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume: {
            title,
            skills,
            experience: JSON.stringify(experienceList),
          },
          jobDescription,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMatchPercentage(data.matchPercentage);
        setMissingSkills(data.missingSkills);
        setMissingKeywords(data.missingKeywords);
        setTailorSuggestions(data.suggestions);
        setTailoredResume(data.tailoredResume);
        
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
        
        setActiveMode('tailor');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsTailoring(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto py-2 animate-in fade-in duration-300">
      
      {/* Studio Header */}
      <div className="pb-4 border-b border-neutral-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-100 flex items-center gap-2">
            AI Resume Studio <Sparkles size={20} className="text-indigo-400 animate-pulse" />
          </h1>
          <p className="text-xs text-neutral-450 mt-1">Audit, modify, and optimize your resume side-by-side with target job descriptions.</p>
        </div>

        {/* Tab Selection */}
        <div className="flex gap-1 bg-neutral-900/60 p-1 border border-neutral-850 rounded-[12px] w-full md:w-auto">
          <button
            onClick={() => setActiveMode('editor')}
            className={`flex-1 md:flex-none px-4 py-1.5 text-xs rounded-lg font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeMode === 'editor' ? 'bg-indigo-600 text-white' : 'text-neutral-450 hover:text-neutral-250'
            }`}
          >
            <Grid size={13} /> Builder Console
          </button>
          <button
            onClick={() => setActiveMode('tailor')}
            className={`flex-1 md:flex-none px-4 py-1.5 text-xs rounded-lg font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeMode === 'tailor' ? 'bg-indigo-600 text-white' : 'text-neutral-450 hover:text-neutral-250'
            }`}
          >
            <Columns size={13} /> Side-by-Side Tailor
          </button>
        </div>
      </div>

      {activeMode === 'editor' ? (
        /* Builder view */
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          
          {/* Left panel forms */}
          <div className="xl:col-span-5 flex flex-col gap-6">
            
            {/* Drag & Drop uploader */}
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`p-6 rounded-[20px] border-2 border-dashed transition flex flex-col items-center justify-center text-center gap-3 bg-neutral-950/20 ${
                isDragOver 
                  ? 'border-indigo-500 bg-indigo-950/15' 
                  : uploadedFileName 
                    ? 'border-emerald-500/50' 
                    : 'border-neutral-850 hover:border-indigo-500/20'
              }`}
            >
              <div className="p-3 bg-neutral-900 rounded-full border border-neutral-850 text-indigo-400">
                <FileUp size={22} className={isDragOver ? 'animate-bounce' : ''} />
              </div>
              <div>
                <span className="text-xs font-bold text-neutral-200 block">
                  {uploadedFileName ? `Imported: ${uploadedFileName}` : 'Drag & drop your resume file'}
                </span>
                <span className="text-[10px] text-neutral-500 mt-1 block">Supports PDF, DOCX up to 4MB</span>
              </div>
            </div>

            {/* Profile Forms */}
            <Card className="glass-panel border-neutral-800/80 p-6 flex flex-col gap-5">
              <h3 className="text-xs font-extrabold tracking-widest text-neutral-450 uppercase flex items-center gap-1.5">
                <FileText size={14} className="text-indigo-400" /> Resume Profile
              </h3>
              
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Sarah Riviera"
              />

              <Input
                label="Job Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Senior Frontend Developer"
              />

              <Textarea
                label="Core Skills Summary (comma separated)"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="React, Next.js, TypeScript"
                rows={2}
              />

              <Input
                label="Education Details"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
              />

              {/* Experience list */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-neutral-350">Work Experience</span>
                  <button 
                    onClick={handleAddExperience}
                    className="text-xs text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={12} /> Add position
                  </button>
                </div>

                {experienceList.map((item, idx) => (
                  <div key={item.id} className="p-4 rounded-xl bg-neutral-950/40 border border-neutral-850/50 flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-neutral-450">Position #{idx + 1}</span>
                      <button onClick={() => handleRemoveExperience(item.id)} className="text-neutral-500 hover:text-red-400">
                        <Trash size={12} />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        placeholder="Role"
                        value={item.role}
                        onChange={(e) => handleUpdateExperience(item.id, 'role', e.target.value)}
                      />
                      <Input
                        placeholder="Company"
                        value={item.company}
                        onChange={(e) => handleUpdateExperience(item.id, 'company', e.target.value)}
                      />
                    </div>
                    <Input
                      placeholder="Duration"
                      value={item.duration}
                      onChange={(e) => handleUpdateExperience(item.id, 'duration', e.target.value)}
                    />
                    <Textarea
                      placeholder="Duties & achievements..."
                      value={item.description}
                      onChange={(e) => handleUpdateExperience(item.id, 'description', e.target.value)}
                      rows={2}
                    />
                  </div>
                ))}
              </div>

              {/* Template selector */}
              <div className="flex flex-col gap-2 border-t border-neutral-900/60 pt-4">
                <span className="text-xs font-semibold text-neutral-300">Design Layout Template</span>
                <div className="grid grid-cols-3 gap-2">
                  {(['modern', 'minimal', 'classic'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTemplate(t)}
                      className={`py-2 text-xs rounded-xl font-medium transition cursor-pointer border ${
                        template === t 
                          ? 'bg-indigo-650/15 text-indigo-300 border-indigo-500/20' 
                          : 'bg-neutral-900 border-neutral-800 text-neutral-450 hover:bg-neutral-850'
                      }`}
                    >
                      {t.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Right panel live preview */}
          <div className="xl:col-span-7 flex flex-col gap-6">
            
            {/* Job Description Paste Area */}
            <Card className="glass-panel border-neutral-800/80 p-6 flex flex-col gap-4">
              <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={14} className="text-indigo-400" /> Optimize for Job Description
              </h3>
              
              <Textarea
                placeholder="Paste the target job description (JD) here to align keywords..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={3}
                className="text-xs bg-neutral-950/40 border-neutral-850"
              />

              <Button variant="primary" onClick={handleTailorResume} isLoading={isTailoring} className="w-full flex justify-center items-center gap-1.5 py-2.5">
                Optimize & Tailor Resume <Sparkles size={14} />
              </Button>
            </Card>

            {/* Resume Preview */}
            <div className="w-full bg-white text-neutral-850 p-8 rounded-[20px] shadow-2xl border border-neutral-300 min-h-[600px] flex flex-col justify-between">
              <div className="flex-1 flex flex-col gap-6 py-2 text-xs">
                
                {/* Header */}
                <div className={`border-b-2 pb-5 ${
                  template === 'minimal' ? 'border-neutral-200' :
                  template === 'classic' ? 'border-neutral-800 text-center font-serif' :
                  'border-indigo-600/30'
                }`}>
                  <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight">{name || 'Sarah Riviera'}</h2>
                  <p className="text-xs text-indigo-650 uppercase tracking-widest font-bold mt-1">{title || 'Specialist'}</p>
                </div>

                {/* Skills */}
                <div>
                  <h4 className="font-bold text-[10px] uppercase tracking-wider text-neutral-900 border-b border-neutral-100 pb-1 mb-2">Technical Skills</h4>
                  <p className="leading-relaxed text-neutral-700 font-medium">{skills}</p>
                </div>

                {/* Experience */}
                <div>
                  <h4 className="font-bold text-[10px] uppercase tracking-wider text-neutral-900 border-b border-neutral-100 pb-1 mb-3">Professional Experience</h4>
                  <div className="space-y-4">
                    {experienceList.map((item) => (
                      <div key={item.id} className="flex flex-col gap-0.5">
                        <div className="flex justify-between items-center text-neutral-950 font-bold">
                          <span>{item.role || 'Position'}</span>
                          <span className="font-normal text-neutral-500 text-[10px]">{item.duration}</span>
                        </div>
                        <span className="text-[10px] text-neutral-500 font-semibold">{item.company}</span>
                        <p className="text-neutral-600 leading-relaxed mt-1">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div>
                  <h4 className="font-bold text-[10px] uppercase tracking-wider text-neutral-900 border-b border-neutral-100 pb-1 mb-2">Education</h4>
                  <p className="leading-relaxed text-neutral-700 font-medium">{education}</p>
                </div>

              </div>
              <div className="border-t border-neutral-100 pt-3 text-[9px] text-neutral-400 text-center">
                Generated via SkillBridge AI Resume Studio
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Side-by-Side Tailor Comparison View */
        <div className="flex flex-col gap-6">
          
          {/* AI Tailoring score summary */}
          <Card className="glass-panel border-neutral-800/80 p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
              <div className="text-center md:border-r border-neutral-800/80 pr-2 flex flex-col items-center">
                <span className="text-xs font-bold text-neutral-550 uppercase">Skill Match Rate</span>
                <h3 className="text-3xl font-extrabold text-indigo-400 mt-2">{matchPercentage}%</h3>
                <div className="w-24 mt-2">
                  <Progress value={matchPercentage} color={matchPercentage >= 80 ? 'success' : 'primary'} />
                </div>
              </div>
              
              <div className="md:col-span-3 text-xs leading-relaxed flex flex-col gap-3">
                <span className="font-bold text-neutral-350 uppercase tracking-wide flex items-center gap-1.5">
                  <Sparkles size={13} className="text-indigo-400 animate-pulse" /> Tailoring Audit Summary
                </span>
                
                {/* Missing keywords & skills list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] text-neutral-500 font-bold uppercase">Missing Industry Skills</span>
                    <div className="flex flex-wrap gap-1">
                      {missingSkills.map((sk) => (
                        <Badge key={sk} variant="purple">{sk}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] text-neutral-500 font-bold uppercase">Missing Keywords to Inject</span>
                    <div className="flex flex-wrap gap-1">
                      {missingKeywords.map((kw) => (
                        <Badge key={kw} variant="warning">{kw}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* AI Suggestions with explanations */}
          <Card className="glass-panel border-neutral-850 p-6 flex flex-col gap-4">
            <span className="text-xs font-bold text-neutral-350 uppercase tracking-wider flex items-center gap-1">
              <Info size={13} className="text-indigo-400" /> Improvement Explanations
            </span>
            <div className="flex flex-col gap-4">
              {tailorSuggestions.map((s, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-neutral-950/40 border border-neutral-850 flex flex-col gap-2.5 text-xs">
                  <p className="text-neutral-450"><span className="font-bold text-red-400/80 mr-1.5">Original:</span> &quot;{s.original}&quot;</p>
                  <p className="text-neutral-200"><span className="font-bold text-emerald-400/80 mr-1.5">Suggested:</span> &quot;{s.suggested}&quot;</p>
                  <span className="text-[10px] text-indigo-400 font-medium block border-t border-neutral-900 pt-2">Rationale: {s.explanation}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Double Column Resume previews */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            
            {/* Column Left: Original Resume */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest px-2">Original Resume</span>
              <div className="bg-white text-neutral-850 p-8 rounded-[20px] border border-neutral-350 min-h-[500px] flex flex-col justify-between">
                <div className="flex-1 flex flex-col gap-5 text-xs">
                  <div className="border-b pb-3 border-neutral-200">
                    <h3 className="text-xl font-bold text-neutral-900">{name}</h3>
                    <p className="text-[10px] font-bold text-indigo-650 uppercase mt-0.5">{title}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[9px] uppercase tracking-wider text-neutral-900 border-b pb-1 mb-2">Experience</h4>
                    {experienceList.map((item) => (
                      <div key={item.id} className="flex flex-col gap-0.5 mb-3">
                        <div className="flex justify-between items-center text-neutral-950 font-bold">
                          <span>{item.role || 'Position'}</span>
                          <span className="font-normal text-neutral-450 text-[10px]">{item.duration}</span>
                        </div>
                        <p className="text-neutral-600 leading-relaxed mt-0.5">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Column Right: Tailored Resume */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest px-2 flex justify-between items-center">
                <span>AI Tailored Resume</span>
                <button 
                  onClick={() => window.print()}
                  className="text-[10px] text-indigo-450 hover:underline cursor-pointer flex items-center gap-1"
                >
                  <Download size={11} /> Print Tailored PDF
                </button>
              </span>
              <div className="bg-white text-neutral-850 p-8 rounded-[20px] border border-indigo-600/30 min-h-[500px] flex flex-col justify-between shadow-2xl shadow-indigo-600/5">
                <div className="flex-1 flex flex-col gap-5 text-xs">
                  <div className="border-b pb-3 border-indigo-600/20">
                    <h3 className="text-xl font-bold text-neutral-900">{name}</h3>
                    <p className="text-[10px] font-bold text-indigo-650 uppercase mt-0.5">{tailoredResume.title}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[9px] uppercase tracking-wider text-neutral-900 border-b pb-1 mb-2">Skills Optimized</h4>
                    <p className="leading-relaxed text-neutral-700 font-semibold mb-3">{tailoredResume.skills}</p>
                    
                    <h4 className="font-bold text-[9px] uppercase tracking-wider text-neutral-900 border-b pb-1 mb-2">Experience Optimized</h4>
                    {tailoredResume.experience.map((item) => (
                      <div key={item.id} className="flex flex-col gap-0.5 mb-3">
                        <div className="flex justify-between items-center text-neutral-950 font-bold">
                          <span>{item.role}</span>
                          <span className="font-normal text-neutral-550 text-[10px]">{item.duration}</span>
                        </div>
                        <span className="text-[9px] text-neutral-450 font-bold">{item.company}</span>
                        <p className="text-neutral-600 leading-relaxed mt-0.5">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
