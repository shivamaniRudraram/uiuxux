'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Textarea } from '@/components/ui/input';
import { Timeline, TimelineItem } from '@/components/ui/timeline';
import { 
  Compass, 
  Sparkles, 
  Radar, 
  Hourglass, 
  Sword, 
  TrendingUp, 
  MapPin, 
  ArrowRight, 
  ChevronRight,
  Code2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function DiscoverPage() {
  const [activeWidget, setActiveWidget] = useState<'radar' | 'timemachine' | 'challenges' | 'insights'>('timemachine');
  
  // Time Machine States
  const [targetDestination, setTargetDestination] = useState('CTO');
  const [roadmapSteps, setRoadmapSteps] = useState<any[]>([
    { title: 'Current Role', subtitle: 'Frontend Developer', date: 'Year 0', desc: 'Focus on coding high fidelity designs and master Next.js.', active: true },
    { title: 'Systems Architect', subtitle: 'Senior System Lead', date: 'Year 2', desc: 'Learn database designs, docker orchestration, API scaling, and backend architectures.', active: false },
    { title: 'Engineering Manager', subtitle: 'Director of Engineering', date: 'Year 4', desc: 'Study scrum alignment, product roadmaps, budgeting, and corporate recruitment.', active: false },
    { title: 'Chief Technology Officer', subtitle: 'CTO / Co-Founder', date: 'Year 5', desc: 'Own architectural vision, alignment with board goals, and company technical direction.', active: false },
  ]);

  // Challenge Arena States
  const [selectedChallenge, setSelectedChallenge] = useState<any | null>(null);
  const [challengeAnswer, setChallengeAnswer] = useState('');
  const [challenges, setChallenges] = useState([
    { id: 'ch1', title: 'RSC Client Boundary', desc: 'Where do Next.js Server Components serialize data to Client boundaries?', difficulty: 'Medium', points: 150 },
    { id: 'ch2', title: 'Layout Shift optimization', desc: 'How do you prevent layouts shifts on high-resolution graphic grids?', difficulty: 'Hard', points: 300 },
  ]);

  const handleTimeMachineChange = (dest: string) => {
    setTargetDestination(dest);
    if (dest === 'Founder') {
      setRoadmapSteps([
        { title: 'Engineer', subtitle: 'General Builder', date: 'Year 0', desc: 'Acquire wide stack coding abilities.', active: true },
        { title: 'Product Strategist', subtitle: 'Product lead', date: 'Year 2', desc: 'Understand business metrics, growth tunnels, and user surveys.', active: false },
        { title: 'Company Founder', subtitle: 'CEO / CTO', date: 'Year 3', desc: 'Raise funding, deploy MVP, and manage initial marketing channels.', active: false },
      ]);
    } else {
      setRoadmapSteps([
        { title: 'Current Role', subtitle: 'Frontend Developer', date: 'Year 0', desc: 'Focus on coding high fidelity designs and master Next.js.', active: true },
        { title: 'Systems Architect', subtitle: 'Senior System Lead', date: 'Year 2', desc: 'Learn database designs, docker orchestration, API scaling, and backend architectures.', active: false },
        { title: 'Engineering Manager', subtitle: 'Director of Engineering', date: 'Year 4', desc: 'Study scrum alignment, product roadmaps, budgeting, and corporate recruitment.', active: false },
        { title: 'Chief Technology Officer', subtitle: 'CTO / Co-Founder', date: 'Year 5', desc: 'Own architectural vision, alignment with board goals, and company technical direction.', active: false },
      ]);
    }
  };

  const handleChallengeSubmit = () => {
    setSelectedChallenge(null);
    setChallengeAnswer('');
    confetti({
      particleCount: 100,
      spread: 70,
    });
    alert('Congratulations! Challenge passed +150 points added to your academy account.');
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      
      {/* Discover Header */}
      <div className="pb-4 border-b border-neutral-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-100 flex items-center gap-2">
            Advanced Discover Tools <Compass size={22} className="text-indigo-400" />
          </h1>
          <p className="text-xs text-neutral-450 mt-1">Explore advanced predictive systems, timeline simulators, and skill challenge games.</p>
        </div>

        {/* Menu selections */}
        <div className="flex flex-wrap gap-1 bg-neutral-900/60 p-1 border border-neutral-850 rounded-[12px] w-full md:w-auto">
          {(['timemachine', 'challenges', 'radar', 'insights'] as const).map((widget) => (
            <button
              key={widget}
              onClick={() => setActiveWidget(widget)}
              className={`flex-1 md:flex-none px-3.5 py-1.5 text-xs rounded-lg font-semibold transition cursor-pointer capitalize ${
                activeWidget === widget 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-neutral-450 hover:text-neutral-250'
              }`}
            >
              {widget === 'timemachine' ? 'Time Machine' : widget === 'challenges' ? 'Challenge Arena' : widget === 'radar' ? 'Hiring Radar' : 'AI Insights'}
            </button>
          ))}
        </div>
      </div>

      {activeWidget === 'timemachine' && (
        /* Career Time Machine */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 flex flex-col gap-5">
            <Card className="glass-panel border-neutral-800/80 p-6 flex flex-col gap-4">
              <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                <Hourglass size={14} className="text-indigo-400" /> Simulator settings
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">Choose your target career milestones. The AI simulator generates intermediate skill paths and manager competencies.</p>
              
              <div className="flex flex-col gap-2 mt-2">
                <span className="text-[10px] text-neutral-500 font-bold uppercase">Target 5-Year Role</span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'CTO', label: 'Tech CTO' },
                    { value: 'Founder', label: 'Founder / CEO' },
                  ].map((role) => (
                    <button
                      key={role.value}
                      onClick={() => handleTimeMachineChange(role.value)}
                      className={`py-2 text-xs rounded-xl font-medium transition border cursor-pointer ${
                        targetDestination === role.value 
                          ? 'bg-indigo-650/15 text-indigo-300 border-indigo-500/20' 
                          : 'bg-neutral-900 border-neutral-800 text-neutral-450 hover:bg-neutral-850'
                      }`}
                    >
                      {role.label}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-8">
            <Card className="glass-panel border-neutral-800/80 p-8 flex flex-col gap-6">
              <h3 className="text-sm font-bold text-neutral-200 flex items-center gap-2">
                Roadmap to {targetDestination} <Sparkles size={14} className="text-indigo-400 animate-pulse" />
              </h3>

              <Timeline>
                {roadmapSteps.map((step, idx) => (
                  <TimelineItem
                    key={idx}
                    title={step.title}
                    subtitle={step.subtitle}
                    date={step.date}
                    description={step.desc}
                    active={step.active}
                  />
                ))}
              </Timeline>
            </Card>
          </div>
        </div>
      )}

      {activeWidget === 'challenges' && (
        /* Challenge Arena list */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {challenges.map((ch) => (
            <Card key={ch.id} className="glass-panel border-neutral-800/80 p-6 flex flex-col justify-between gap-5 hover:border-indigo-500/20 transition">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <Badge variant={ch.difficulty === 'Hard' ? 'danger' : 'purple'}>{ch.difficulty}</Badge>
                  <span className="text-[10px] text-indigo-400 font-bold font-mono">+{ch.points} Academy Pts</span>
                </div>
                <h3 className="text-base font-bold text-neutral-100">{ch.title}</h3>
                <p className="text-xs text-neutral-400 mt-2 leading-relaxed">{ch.desc}</p>
              </div>

              <Button variant="secondary" size="sm" className="w-full flex items-center justify-center gap-1.5" onClick={() => setSelectedChallenge(ch)}>
                <Code2 size={13} /> Enter Challenge
              </Button>
            </Card>
          ))}
        </div>
      )}

      {activeWidget === 'radar' && (
        /* Opportunity Radar */
        <Card className="glass-panel border-neutral-800/80 p-6 flex flex-col gap-4">
          <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
            <Radar size={14} className="text-indigo-400" /> Active Hiring Radar
          </h3>
          <p className="text-xs text-neutral-400 leading-relaxed">Companies matching your skills that are currently expanding design and frontend architectural teams.</p>
          
          <div className="flex flex-col gap-3.5 mt-2">
            {[
              { company: 'Stripe', roles: '3 positions open', location: 'San Francisco, CA', match: '98% skills overlap' },
              { company: 'Vercel', roles: '1 position open', location: 'Remote, US', match: '95% skills overlap' },
            ].map((c, idx) => (
              <div key={idx} className="p-4 bg-neutral-950/20 border border-neutral-850 rounded-xl flex justify-between items-center hover:border-neutral-750 transition text-xs">
                <div>
                  <span className="font-bold text-neutral-200 block">{c.company}</span>
                  <span className="text-[10px] text-neutral-500 mt-1 block flex items-center gap-1"><MapPin size={10} /> {c.location} • {c.roles}</span>
                </div>
                <div className="text-right">
                  <Badge variant="success">{c.match}</Badge>
                  <button className="text-[10px] text-indigo-400 hover:underline font-bold mt-2 block ml-auto flex items-center gap-0.5 cursor-pointer">
                    View Jobs <ChevronRight size={10} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeWidget === 'insights' && (
        /* AI Career Insights */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="glass-panel border-neutral-800/80 p-6">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1"><TrendingUp size={12} className="text-indigo-400" /> Industry Demand Shifts</span>
            <h3 className="text-sm font-bold text-neutral-200 mt-3">TypeScript & Server Compilers</h3>
            <p className="text-xs text-neutral-400 leading-relaxed mt-2">Over 72% of modern web openings in enterprise companies require knowledge of Next-Gen Server execution environments (React Server Components, Next.js route preloading, caching).</p>
          </Card>
          
          <Card className="glass-panel border-neutral-800/80 p-6">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1"><Compass size={12} className="text-purple-400" /> Designer-to-Developer Hybrid Roles</span>
            <h3 className="text-sm font-bold text-neutral-200 mt-3">Design Systems Engineering</h3>
            <p className="text-xs text-neutral-400 leading-relaxed mt-2">High demand for UI/UX Professionals who understand styling schemas, CSS layout variables, and component implementation. Master code-design system tools to maximize salary leverage.</p>
          </Card>
        </div>
      )}

      {/* Challenge Sandbox Modal */}
      {selectedChallenge && (
        <Modal
          isOpen={!!selectedChallenge}
          onClose={() => setSelectedChallenge(null)}
          title={`Challenge: ${selectedChallenge.title}`}
          description={`${selectedChallenge.difficulty} • +${selectedChallenge.points} Pts`}
        >
          <div className="flex flex-col gap-4 mt-2">
            <p className="text-xs text-neutral-300 font-bold leading-relaxed">{selectedChallenge.desc}</p>
            <Textarea
              label="Your Code/Conceptual Answer"
              placeholder="Write your explanation or code solution..."
              value={challengeAnswer}
              onChange={(e) => setChallengeAnswer(e.target.value)}
              rows={4}
              className="font-mono text-xs text-indigo-300"
            />
            <div className="flex justify-end gap-3 mt-2">
              <Button variant="secondary" onClick={() => setSelectedChallenge(null)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleChallengeSubmit} disabled={!challengeAnswer.trim()}>
                Submit Solution
              </Button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}
