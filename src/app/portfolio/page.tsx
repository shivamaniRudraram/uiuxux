'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input, Textarea } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { 
  FolderGit2, 
  Sparkles, 
  ExternalLink, 
  Plus, 
  Trash, 
  Copy, 
  Eye, 
  Check, 
  DatabaseBackup 
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  link: string;
}

interface Experience {
  id: string;
  role: string;
  company: string;
  duration: string;
}

export default function PortfolioPage() {
  const { user } = useAuth();
  const [theme, setTheme] = useState<'minimal' | 'modern' | 'classic'>('minimal');
  const [projects, setProjects] = useState<Project[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [publicShare, setPublicShare] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Load portfolio
  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        const res = await fetch('/api/portfolio');
        if (res.ok) {
          const data = await res.json();
          setTheme(data.portfolio.theme);
          setProjects(JSON.parse(data.portfolio.projects));
          setExperience(JSON.parse(data.portfolio.experience));
          setPublicShare(data.portfolio.publicShare);
        }
      } catch (e) {
        console.error(e);
      }
    };
    loadPortfolio();
  }, []);

  const handleAddProject = () => {
    setProjects(prev => [
      ...prev,
      { id: Math.random().toString(), name: '', description: '', link: '' },
    ]);
  };

  const handleUpdateProject = (id: string, field: keyof Project, val: string) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, [field]: val } : p));
  };

  const handleRemoveProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const handleAddExperience = () => {
    setExperience(prev => [
      ...prev,
      { id: Math.random().toString(), role: '', company: '', duration: '' },
    ]);
  };

  const handleUpdateExperience = (id: string, field: keyof Experience, val: string) => {
    setExperience(prev => prev.map(e => e.id === id ? { ...e, [field]: val } : e));
  };

  const handleRemoveExperience = (id: string) => {
    setExperience(prev => prev.filter(e => e.id !== id));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme, projects, experience, publicShare }),
      });
      if (res.ok) {
        alert('Portfolio updated successfully!');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSyncResume = async () => {
    // Simulate syncing details from the user resume model
    if (confirm('Import profile experiences and skills from your resume database? This will overwrite the current list.')) {
      setExperience([
        { id: '1', role: 'Staff UI Designer', company: 'Stripe', duration: '2023 - Present' },
        { id: '2', role: 'UX Consultant', company: 'Google', duration: '2021 - 2023' },
      ]);
    }
  };

  const handleCopyLink = () => {
    if (!user) return;
    const path = `${window.location.origin}/portfolio/preview/${user.id}`;
    navigator.clipboard.writeText(path);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      
      {/* Portfolio Header */}
      <div className="pb-4 border-b border-neutral-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-100 flex items-center gap-2">
            Portfolio Builder <FolderGit2 size={22} className="text-indigo-400" />
          </h1>
          <p className="text-xs text-neutral-400 mt-1">Design a public-facing digital resume to share with recruitment leads and partners.</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => setPreviewMode(!previewMode)}>
            <Eye size={14} className="mr-1.5" /> {previewMode ? 'Edit Mode' : 'Recruiter View'}
          </Button>
          {!previewMode && (
            <Button variant="primary" size="sm" onClick={handleSave} isLoading={isSaving}>
              Save Portfolio
            </Button>
          )}
        </div>
      </div>

      {!previewMode ? (
        /* Form Editor View */
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          
          {/* Left panel options */}
          <div className="xl:col-span-4 flex flex-col gap-6">
            
            {/* Share controls */}
            <Card className="glass-panel border-neutral-800/80 p-6 flex flex-col gap-4">
              <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Sharing Options</h3>
              
              <div className="flex justify-between items-center p-3 bg-neutral-950/40 border border-neutral-850 rounded-xl">
                <div>
                  <span className="text-xs font-bold text-neutral-200 block">Public Availability</span>
                  <span className="text-[10px] text-neutral-500 mt-0.5 block">Allow search engines to find.</span>
                </div>
                <input
                  type="checkbox"
                  checked={publicShare}
                  onChange={(e) => setPublicShare(e.target.checked)}
                  className="rounded bg-neutral-900 border-neutral-850 text-indigo-650 cursor-pointer"
                />
              </div>

              {publicShare && user && (
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] text-neutral-550 font-bold uppercase">Share Link</span>
                  <div className="flex items-center gap-1">
                    <Input
                      value={`${window.location.origin}/portfolio/preview/${user.id}`}
                      readOnly
                      className="py-1 text-xs select-all text-neutral-400 bg-neutral-950 border border-neutral-900"
                    />
                    <Button variant="secondary" size="sm" onClick={handleCopyLink} className="py-2">
                      {isCopied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </Button>
                  </div>
                </div>
              )}

              <Button variant="secondary" size="sm" onClick={handleSyncResume} className="w-full flex items-center justify-center gap-2">
                <DatabaseBackup size={13} /> Sync from Resume
              </Button>
            </Card>

            {/* Theme picker */}
            <Card className="glass-panel border-neutral-800/80 p-6 flex flex-col gap-3">
              <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Themes</span>
              <div className="grid grid-cols-3 gap-2">
                {(['minimal', 'modern', 'classic'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`py-2 text-xs rounded-xl font-medium transition cursor-pointer border ${
                      theme === t 
                        ? 'bg-indigo-650/15 text-indigo-300 border-indigo-500/20' 
                        : 'bg-neutral-900 border-neutral-800 text-neutral-450 hover:bg-neutral-850'
                    }`}
                  >
                    {t.toUpperCase()}
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Right panel project forms */}
          <div className="xl:col-span-8 flex flex-col gap-6">
            
            {/* Projects card list */}
            <Card className="glass-panel border-neutral-800/80 p-6 flex flex-col gap-5">
              <div className="flex justify-between items-center pb-2 border-b border-neutral-850">
                <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Project Portfolio ({projects.length})</span>
                <button 
                  onClick={handleAddProject}
                  className="text-xs text-indigo-400 hover:text-indigo-350 flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={12} /> Add Project
                </button>
              </div>

              {projects.length === 0 ? (
                <div className="text-center py-12 text-xs text-neutral-550 italic">
                  No projects defined. Click &quot;Add Project&quot; to begin.
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {projects.map((p, idx) => (
                    <div key={p.id} className="p-4 rounded-xl bg-neutral-950/40 border border-neutral-850/50 flex flex-col gap-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-neutral-450">Project #{idx + 1}</span>
                        <button onClick={() => handleRemoveProject(p.id)} className="text-neutral-500 hover:text-red-400">
                          <Trash size={12} />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          placeholder="Project Name"
                          value={p.name}
                          onChange={(e) => handleUpdateProject(p.id, 'name', e.target.value)}
                        />
                        <Input
                          placeholder="Deployment/Github URL"
                          value={p.link}
                          onChange={(e) => handleUpdateProject(p.id, 'link', e.target.value)}
                        />
                      </div>
                      <Textarea
                        placeholder="Project description, frameworks utilized, goals reached..."
                        value={p.description}
                        onChange={(e) => handleUpdateProject(p.id, 'description', e.target.value)}
                        rows={2}
                      />
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Experience list */}
            <Card className="glass-panel border-neutral-800/80 p-6 flex flex-col gap-5">
              <div className="flex justify-between items-center pb-2 border-b border-neutral-850">
                <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Experiences ({experience.length})</span>
                <button 
                  onClick={handleAddExperience}
                  className="text-xs text-indigo-400 hover:text-indigo-350 flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={12} /> Add Experience
                </button>
              </div>

              {experience.length === 0 ? (
                <div className="text-center py-12 text-xs text-neutral-550 italic">
                  No experience milestones set.
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {experience.map((item, idx) => (
                    <div key={item.id} className="p-4 rounded-xl bg-neutral-950/40 border border-neutral-850/50 flex flex-col gap-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-neutral-450">Experience #{idx + 1}</span>
                        <button onClick={() => handleRemoveExperience(item.id)} className="text-neutral-500 hover:text-red-400">
                          <Trash size={12} />
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-2 grid grid-cols-2 gap-3">
                          <Input
                            placeholder="Role Title"
                            value={item.role}
                            onChange={(e) => handleUpdateExperience(item.id, 'role', e.target.value)}
                          />
                          <Input
                            placeholder="Company Name"
                            value={item.company}
                            onChange={(e) => handleUpdateExperience(item.id, 'company', e.target.value)}
                          />
                        </div>
                        <Input
                          placeholder="Duration (e.g. 2023 - Present)"
                          value={item.duration}
                          onChange={(e) => handleUpdateExperience(item.id, 'duration', e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      ) : (
        /* Recruiter Preview Panel */
        <div className="w-full bg-white text-neutral-850 p-8 rounded-[16px] border border-neutral-300 shadow-2xl min-h-[600px] flex flex-col justify-between">
          <div className="flex-1 flex flex-col gap-8 py-4">
            
            {/* Header info */}
            <div className={`border-b-2 pb-6 ${
              theme === 'minimal' ? 'border-neutral-200' :
              theme === 'classic' ? 'border-neutral-800 text-center font-serif' :
              'border-indigo-600/30'
            }`}>
              <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">{user?.name || 'Your Name'}</h1>
              <p className="text-sm text-indigo-650 uppercase tracking-widest font-bold mt-1.5">{user?.targetRoles?.split(',')[0] || 'Professional Title'}</p>
              {user?.bio && <p className="text-xs text-neutral-500 mt-3 max-w-xl leading-relaxed">{user.bio}</p>}
            </div>

            {/* Grid display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs leading-relaxed">
              
              {/* Experience list */}
              <div>
                <h3 className="font-bold text-[11px] uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-1.5 mb-4">Milestones</h3>
                <div className="space-y-4">
                  {experience.map((e) => (
                    <div key={e.id} className="flex flex-col gap-0.5">
                      <div className="flex justify-between items-center text-neutral-950 font-bold">
                        <span>{e.role}</span>
                        <span className="font-normal text-neutral-450 text-[10px]">{e.duration}</span>
                      </div>
                      <span className="text-[10px] text-neutral-500 font-semibold">{e.company}</span>
                    </div>
                  ))}
                  {experience.length === 0 && <span className="text-neutral-400 italic">No items.</span>}
                </div>
              </div>

              {/* Projects list */}
              <div>
                <h3 className="font-bold text-[11px] uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-1.5 mb-4">Featured Projects</h3>
                <div className="space-y-4">
                  {projects.map((p) => (
                    <div key={p.id} className="flex flex-col gap-1 border border-neutral-100 hover:border-neutral-200 rounded-xl p-3 bg-neutral-50/20 hover:bg-neutral-50 transition">
                      <div className="flex justify-between items-center text-neutral-950 font-bold">
                        <span>{p.name}</span>
                        {p.link && (
                          <a href={p.link} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-500">
                            <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                      <p className="text-neutral-500 text-[11px] mt-1 font-medium">{p.description}</p>
                    </div>
                  ))}
                  {projects.length === 0 && <span className="text-neutral-400 italic">No items.</span>}
                </div>
              </div>

            </div>
          </div>
          <div className="border-t border-neutral-100 pt-4 text-center text-[10px] text-neutral-400">
            Powered by SkillBridge Professional Portfolio
          </div>
        </div>
      )}

    </div>
  );
}
