'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input, Select, Textarea } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, ArrowLeft, Target, Award, BookOpen } from 'lucide-react';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [careerGoal, setCareerGoal] = useState('');
  const [experience, setExperience] = useState('Entry');
  const [skills, setSkills] = useState('');
  const [targetRoles, setTargetRoles] = useState('');
  const [learningTopics, setLearningTopics] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { refreshUser } = useAuth();
  const router = useRouter();

  const handleNext = () => {
    setError(null);
    if (step === 1 && !careerGoal) {
      setError('Please tell us about your primary career goal.');
      return;
    }
    if (step === 2 && (!skills || !targetRoles)) {
      setError('Please specify your current skills and target job roles.');
      return;
    }
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setError(null);
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!learningTopics) {
      setError('Please select or write down your preferred learning topics.');
      return;
    }
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/user/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          careerGoal,
          experience,
          skills,
          targetRoles,
          learningTopics,
          bio,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        await refreshUser();
        router.push('/dashboard');
      } else {
        setError(data.error || 'Onboarding failed');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepsInfo = [
    { title: 'Core Goals', desc: 'Identify your direction', icon: Target },
    { title: 'Skills & Roles', desc: 'Define your capabilities', icon: Award },
    { title: 'Learning Scope', desc: 'Select topics of interest', icon: BookOpen },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/20 via-neutral-950 to-neutral-950">
      <div className="w-full max-w-2xl flex flex-col gap-8">
        
        {/* Stepper Header */}
        <div className="flex justify-between items-center px-4 max-w-lg mx-auto w-full">
          {stepsInfo.map((s, idx) => {
            const Icon = s.icon;
            const stepNum = idx + 1;
            const isCompleted = step > stepNum;
            const isActive = step === stepNum;
            return (
              <React.Fragment key={idx}>
                <div className="flex flex-col items-center gap-1.5 relative z-10">
                  <div className={`h-9 w-9 rounded-full flex items-center justify-center border text-xs font-bold transition-all duration-350 ${
                    isCompleted 
                      ? 'bg-indigo-600 border-indigo-500 text-white' 
                      : isActive 
                        ? 'bg-neutral-900 border-indigo-500 text-indigo-400 ring-4 ring-indigo-500/15' 
                        : 'bg-neutral-900 border-neutral-800 text-neutral-500'
                  }`}>
                    <Icon size={14} />
                  </div>
                  <span className={`text-[10px] font-bold tracking-wide transition-colors ${isActive ? 'text-indigo-400' : 'text-neutral-500'}`}>
                    {s.title}
                  </span>
                </div>
                {idx < 2 && (
                  <div className={`h-[1px] flex-1 bg-neutral-800 mx-2 -mt-4 transition-colors ${step > stepNum ? 'bg-indigo-500' : ''}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Stepper Card Panel */}
        <Card className="glass-panel border-neutral-800/80 p-8 shadow-2xl relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500" />
          
          {error && (
            <div className="mb-6 p-3 bg-red-950/30 border border-red-900/40 rounded-lg text-xs text-red-400 font-medium">
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <h2 className="text-xl font-bold text-neutral-100 tracking-tight flex items-center gap-2">
                  What is your primary career goal? <Sparkles size={16} className="text-indigo-400" />
                </h2>
                <p className="text-xs text-neutral-400 mt-1">Specify what you want to achieve (e.g. land a senior role, switch from finance to software engineering, build AI products).</p>
              </div>

              <Textarea
                placeholder="Describe your career goals..."
                value={careerGoal}
                onChange={(e) => setCareerGoal(e.target.value)}
                label="Career Ambition"
                rows={3}
              />

              <Select
                label="Current Experience Level"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                options={[
                  { value: 'Entry', label: 'Entry Level (Student / Fresh Graduate)' },
                  { value: 'Mid', label: 'Mid Level (2-5 Years Experience)' },
                  { value: 'Senior', label: 'Senior Level (5+ Years Experience / Tech Lead)' },
                ]}
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <h2 className="text-xl font-bold text-neutral-100 tracking-tight">
                  Define your skills and target roles
                </h2>
                <p className="text-xs text-neutral-400 mt-1">Enter your main skills and the roles you are aiming for (comma separated).</p>
              </div>

              <Input
                label="Current Core Skills"
                placeholder="e.g. React, TypeScript, Figma, UI Design, CSS"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              />

              <Input
                label="Interested Job Roles"
                placeholder="e.g. Frontend Engineer, Product Designer, UI Engineer"
                value={targetRoles}
                onChange={(e) => setTargetRoles(e.target.value)}
              />

              <Textarea
                label="Short Bio (Optional)"
                placeholder="A brief summary for recruiters and networking partners..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={2}
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <h2 className="text-xl font-bold text-neutral-100 tracking-tight">
                  What topics do you want to learn?
                </h2>
                <p className="text-xs text-neutral-400 mt-1">Select or list down key technical/non-technical domains you want to upskill in (comma separated).</p>
              </div>

              <Input
                label="Upskilling Topics"
                placeholder="e.g. Design Systems, Next.js Server Actions, Large Language Models, System Design"
                value={learningTopics}
                onChange={(e) => setLearningTopics(e.target.value)}
              />

              {/* Multi Selection Quick Pills */}
              <div className="flex flex-wrap gap-2 pt-1">
                {['Machine Learning', 'Product Management', 'Design Systems', 'CSS Layouts', 'Node.js APIs', 'Data Structures'].map((t) => {
                  const isSelected = learningTopics.toLowerCase().includes(t.toLowerCase());
                  return (
                    <button
                      type="button"
                      key={t}
                      onClick={() => {
                        const topics = learningTopics ? learningTopics.split(',').map(x => x.trim()) : [];
                        if (isSelected) {
                          const updated = topics.filter(x => x.toLowerCase() !== t.toLowerCase());
                          setLearningTopics(updated.join(', '));
                        } else {
                          topics.push(t);
                          setLearningTopics(topics.filter(Boolean).join(', '));
                        }
                      }}
                      className={`px-3 py-1 text-xs rounded-full font-medium transition cursor-pointer border ${
                        isSelected 
                          ? 'bg-indigo-650/20 text-indigo-300 border-indigo-500/30' 
                          : 'bg-neutral-900 border-neutral-800 text-neutral-450 hover:text-neutral-350'
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Stepper Footer Controls */}
          <div className="flex items-center justify-between mt-8 pt-4 border-t border-neutral-850/60">
            {step > 1 ? (
              <Button type="button" variant="secondary" onClick={handleBack} disabled={isSubmitting}>
                <ArrowLeft size={14} className="mr-2" /> Back
              </Button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <Button type="button" variant="primary" onClick={handleNext}>
                Continue <ArrowRight size={14} className="ml-2" />
              </Button>
            ) : (
              <Button type="button" variant="primary" onClick={handleSubmit} isLoading={isSubmitting}>
                Build Dashboard <Sparkles size={14} className="ml-2" />
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
