'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Drawer } from '@/components/ui/drawer';
import { 
  Briefcase, 
  Search, 
  MapPin, 
  DollarSign, 
  Clock, 
  Sparkles,
  Layers,
  CheckCircle,
  FileCheck2,
  CalendarDays,
  XCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  description: string;
  skills: string;
  matchScore: number;
}

interface Application {
  id: string;
  jobTitle: string;
  company: string;
  status: string;
  appliedAt: string;
}

export default function JobsPage() {
  const [activeTab, setActiveTab] = useState<'discover' | 'tracker'>('discover');
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch jobs
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/jobs?q=${query}&type=${typeFilter}`);
      const data = await res.ok ? await res.json() : { jobs: [] };
      setJobs(data.jobs || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Fetch applications
  const fetchApplications = async () => {
    try {
      const res = await fetch('/api/jobs/applications');
      const data = await res.ok ? await res.json() : { applications: [] };
      setApplications(data.applications || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, [query, typeFilter]);

  const handleEasyApply = async (job: Job) => {
    setIsApplying(true);
    try {
      const res = await fetch('/api/jobs/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: job.title,
          company: job.company,
        }),
      });

      if (res.ok) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        setSelectedJob(null);
        fetchApplications();
        // Switch to tracker tab
        setActiveTab('tracker');
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to apply');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsApplying(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Applied': return <CheckCircle size={14} className="text-indigo-400" />;
      case 'Interviewing': return <CalendarDays size={14} className="text-amber-400 animate-pulse" />;
      case 'Offered': return <FileCheck2 size={14} className="text-emerald-400" />;
      case 'Rejected': return <XCircle size={14} className="text-red-400" />;
      default: return <Briefcase size={14} className="text-neutral-400" />;
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      
      {/* Header controls */}
      <div className="pb-4 border-b border-neutral-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-100 flex items-center gap-2">
            Job Matching Hub <Briefcase size={22} className="text-indigo-400" />
          </h1>
          <p className="text-xs text-neutral-400 mt-1">Discover customized job listings with active matching percentages matching your onboarding skills.</p>
        </div>

        {/* Tab Selector */}
        <div className="flex gap-1 bg-neutral-900/60 p-1 border border-neutral-850 rounded-[12px] w-full md:w-auto">
          <button
            onClick={() => setActiveTab('discover')}
            className={`flex-1 md:flex-none px-4 py-1.5 text-xs rounded-lg font-semibold transition cursor-pointer ${
              activeTab === 'discover' 
                ? 'bg-indigo-600 text-white' 
                : 'text-neutral-450 hover:text-neutral-250'
            }`}
          >
            AI Matches
          </button>
          <button
            onClick={() => setActiveTab('tracker')}
            className={`flex-1 md:flex-none px-4 py-1.5 text-xs rounded-lg font-semibold transition cursor-pointer ${
              activeTab === 'tracker' 
                ? 'bg-indigo-600 text-white' 
                : 'text-neutral-450 hover:text-neutral-250'
            }`}
          >
            Application Tracker
          </button>
        </div>
      </div>

      {activeTab === 'discover' ? (
        <div className="space-y-6">
          {/* Query Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-3">
              <Input
                placeholder="Search jobs by title, company, or tech stacks..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                icon={<Search size={16} />}
              />
            </div>
            <div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full rounded-[12px] bg-neutral-900 border border-neutral-800 px-4 py-2 text-sm text-neutral-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer appearance-none"
              >
                <option value="All">All Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Remote">Remote</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
          </div>

          {/* Job Postings Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="glass-card p-6 h-40 animate-pulse bg-neutral-900/40" />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-neutral-850 rounded-[16px] text-xs text-neutral-500">
              No matching job postings found. Check back later or optimize your skill list.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <Card key={job.id} className="glass-panel border-neutral-800/80 flex flex-col justify-between hover:border-indigo-500/30 transition duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="primary">{job.type}</Badge>
                      <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-bold bg-indigo-950/30 px-2 py-0.5 rounded-full border border-indigo-900/30">
                        <Sparkles size={11} className="animate-pulse" />
                        <span>{job.matchScore}% Match</span>
                      </div>
                    </div>
                    <CardTitle className="text-base font-bold text-neutral-100 hover:text-indigo-400 transition cursor-pointer" onClick={() => setSelectedJob(job)}>
                      {job.title}
                    </CardTitle>
                    <CardDescription className="text-xs text-neutral-450 mt-1 font-semibold">
                      {job.company} • {job.location}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <p className="text-xs text-neutral-400 leading-relaxed line-clamp-3">
                      {job.description}
                    </p>
                  </CardContent>

                  <CardFooter className="flex items-center justify-between border-t border-neutral-900 pt-4 mt-2">
                    <span className="text-xs font-semibold text-neutral-350">{job.salary}</span>
                    <Button variant="secondary" size="sm" onClick={() => setSelectedJob(job)}>
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Kanban Tracker view */
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
          {['Applied', 'Interviewing', 'Offered', 'Rejected'].map((status) => {
            const list = applications.filter(a => a.status === status);
            return (
              <div key={status} className="flex flex-col gap-4">
                {/* Column header */}
                <div className="flex justify-between items-center px-2">
                  <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider">{status}</span>
                  <Badge variant={
                    status === 'Offered' ? 'success' :
                    status === 'Interviewing' ? 'warning' :
                    status === 'Rejected' ? 'danger' : 'primary'
                  }>
                    {list.length}
                  </Badge>
                </div>
                
                {/* Column list */}
                <div className="flex flex-col gap-3 min-h-[350px] p-3 rounded-[16px] bg-neutral-950/20 border border-neutral-900/60">
                  {list.length === 0 ? (
                    <span className="text-[11px] text-neutral-600 text-center py-12">Empty board</span>
                  ) : (
                    list.map((app) => (
                      <Card key={app.id} className="glass-panel p-4 flex flex-col gap-3 hover:border-neutral-750 transition">
                        <div className="flex items-start justify-between">
                          <h4 className="text-xs font-bold text-neutral-200 leading-snug">{app.jobTitle}</h4>
                          <div className="p-1.5 bg-neutral-900 rounded-lg shrink-0">
                            {getStatusIcon(app.status)}
                          </div>
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-neutral-500">
                          <span>{app.company}</span>
                          <span>{new Date(app.appliedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Details Slide Drawer */}
      {selectedJob && (
        <Drawer
          isOpen={!!selectedJob}
          onClose={() => setSelectedJob(null)}
          title="Position Profile"
          footer={
            <>
              <Button variant="secondary" onClick={() => setSelectedJob(null)}>
                Close
              </Button>
              <Button variant="primary" onClick={() => handleEasyApply(selectedJob)} isLoading={isApplying}>
                Easy Apply <Sparkles size={12} className="ml-1.5" />
              </Button>
            </>
          }
        >
          <div className="flex flex-col gap-5">
            <div>
              <Badge variant="primary" className="mb-2">{selectedJob.type}</Badge>
              <h3 className="text-lg font-bold text-neutral-100">{selectedJob.title}</h3>
              <h4 className="text-xs text-neutral-450 font-semibold mt-1">{selectedJob.company} • {selectedJob.location}</h4>
            </div>

            <div className="flex gap-4 items-center p-3 bg-neutral-950/40 border border-neutral-850/50 rounded-xl text-xs">
              <div className="flex items-center gap-1"><DollarSign size={13} className="text-neutral-500" /> {selectedJob.salary}</div>
              <div className="flex items-center gap-1"><Clock size={13} className="text-neutral-500" /> Active match</div>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-neutral-300">Job Description</span>
              <p className="text-xs text-neutral-400 leading-relaxed font-normal">{selectedJob.description}</p>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-neutral-300">Required Skills</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedJob.skills.split(',').map((s) => (
                  <Badge key={s} variant="secondary">
                    {s.trim()}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Drawer>
      )}

    </div>
  );
}
