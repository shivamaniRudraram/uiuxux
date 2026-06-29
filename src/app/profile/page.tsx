'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input, Textarea, Select } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { 
  UserCog, 
  Sparkles, 
  Plus, 
  X, 
  BellRing, 
  Lock, 
  FileCheck2,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  
  // Forms state
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [careerGoal, setCareerGoal] = useState('');
  const [experience, setExperience] = useState('Entry');
  const [skillsList, setSkillsList] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Settings states
  const [reminders, setReminders] = useState(true);
  const [alerts, setAlerts] = useState(true);
  const [swaps, setSwaps] = useState(true);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setBio(user.bio || '');
      setCareerGoal(user.careerGoal || '');
      setExperience(user.experience || 'Entry');
      setSkillsList(user.skills ? user.skills.split(',').map(s => s.trim()).filter(Boolean) : []);
    }
  }, [user]);

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim() || skillsList.includes(newSkill.trim())) return;
    setSkillsList(prev => [...prev, newSkill.trim()]);
    setNewSkill('');
  };

  const handleRemoveSkill = (skill: string) => {
    setSkillsList(prev => prev.filter(s => s !== skill));
  };

  const handleSaveProfile = async () => {
    setIsUpdating(true);
    try {
      const res = await fetch('/api/user/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          careerGoal,
          experience,
          skills: skillsList.join(', '),
          targetRoles: user?.targetRoles || 'Frontend Engineer',
          bio,
        }),
      });

      if (res.ok) {
        await refreshUser();
        confetti({
          particleCount: 50,
          spread: 30,
        });
        alert('Profile details updated successfully!');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      
      {/* Profile Header */}
      <div className="pb-4 border-b border-neutral-900 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-100 flex items-center gap-2">
            Profile Settings <UserCog size={22} className="text-indigo-400" />
          </h1>
          <p className="text-xs text-neutral-450 mt-1">Manage your biographical settings, core target roles, upskilling metrics, and email alerts.</p>
        </div>
        <Button variant="primary" size="sm" onClick={handleSaveProfile} isLoading={isUpdating}>
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Personal details */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          <Card className="glass-panel border-neutral-800/80 p-6 flex flex-col gap-5">
            <h3 className="text-sm font-bold text-neutral-350 px-1 uppercase tracking-wider flex items-center gap-1">
              <Sparkles size={13} className="text-indigo-400" /> Personal Identity
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sarah Riviera"
              />
              
              <Select
                label="Target Experience Grade"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                options={[
                  { value: 'Entry', label: 'Entry Level (0-2 Yrs)' },
                  { value: 'Mid', label: 'Mid Level (2-5 Yrs)' },
                  { value: 'Senior', label: 'Senior Grade (5+ Yrs)' },
                ]}
              />
            </div>

            <Textarea
              label="Bio / Professional Summary"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Explain your technical journey..."
              rows={3}
            />

            <Textarea
              label="Primary Career Ambition / Goals"
              value={careerGoal}
              onChange={(e) => setCareerGoal(e.target.value)}
              placeholder="I want to build Next.js tools..."
              rows={3}
            />
          </Card>

          {/* Skill Tag list */}
          <Card className="glass-panel border-neutral-800/80 p-6 flex flex-col gap-4">
            <h3 className="text-sm font-bold text-neutral-350 px-1 uppercase tracking-wider">Upskilling Core Skills</h3>
            
            <form onSubmit={handleAddSkill} className="flex gap-2">
              <Input
                placeholder="Add a new skill tag (e.g. Docker, GraphQL)..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
              />
              <Button type="submit" variant="secondary" className="px-4">
                <Plus size={14} /> Add
              </Button>
            </form>

            <div className="flex flex-wrap gap-2 mt-2">
              {skillsList.map((skill) => (
                <Badge key={skill} variant="primary" className="flex items-center gap-1.5 py-1 px-3">
                  <span>{skill}</span>
                  <button type="button" onClick={() => handleRemoveSkill(skill)} className="text-indigo-400 hover:text-red-400">
                    <X size={11} />
                  </button>
                </Badge>
              ))}
              {skillsList.length === 0 && (
                <span className="text-xs text-neutral-500 italic">No skills defined yet. Add some above.</span>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: Settings & notifications configurations */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          
          {/* Notification settings */}
          <Card className="glass-panel border-neutral-800/80 p-6 flex flex-col gap-5">
            <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
              <BellRing size={14} className="text-indigo-400" /> Notifications settings
            </h3>

            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center p-3 bg-neutral-950/20 border border-neutral-850 rounded-xl text-xs">
                <div>
                  <span className="font-bold text-neutral-200 block">Interview Reminders</span>
                  <span className="text-[10px] text-neutral-500 mt-0.5 block">Alerts 24h prior to mock sessions.</span>
                </div>
                <input
                  type="checkbox"
                  checked={reminders}
                  onChange={(e) => setReminders(e.target.checked)}
                  className="rounded bg-neutral-900 border-neutral-850 text-indigo-650 cursor-pointer"
                />
              </div>

              <div className="flex justify-between items-center p-3 bg-neutral-950/20 border border-neutral-850 rounded-xl text-xs">
                <div>
                  <span className="font-bold text-neutral-200 block">Job Alerts</span>
                  <span className="text-[10px] text-neutral-500 mt-0.5 block">Weekly matched openings emails.</span>
                </div>
                <input
                  type="checkbox"
                  checked={alerts}
                  onChange={(e) => setAlerts(e.target.checked)}
                  className="rounded bg-neutral-900 border-neutral-850 text-indigo-650 cursor-pointer"
                />
              </div>

              <div className="flex justify-between items-center p-3 bg-neutral-950/20 border border-neutral-850 rounded-xl text-xs">
                <div>
                  <span className="font-bold text-neutral-200 block">SkillSwap Requests</span>
                  <span className="text-[10px] text-neutral-500 mt-0.5 block">Immediate notices on new swap matches.</span>
                </div>
                <input
                  type="checkbox"
                  checked={swaps}
                  onChange={(e) => setSwaps(e.target.checked)}
                  className="rounded bg-neutral-900 border-neutral-850 text-indigo-650 cursor-pointer"
                />
              </div>
            </div>
          </Card>

          {/* Account Security Info */}
          <Card className="glass-panel border-neutral-800/80 p-6 flex flex-col gap-4">
            <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
              <Lock size={14} className="text-purple-400" /> Account Context
            </h3>
            <div className="p-3 bg-neutral-950/20 border border-neutral-850 rounded-xl text-xs flex items-center gap-3">
              <div className="p-2 bg-emerald-950/30 text-emerald-400 border border-emerald-900/30 rounded-lg">
                <CheckCircle2 size={14} />
              </div>
              <div>
                <span className="font-bold text-neutral-250 block">Database Status</span>
                <span className="text-[9px] text-neutral-500 mt-0.5 block">Local dev.db sync active.</span>
              </div>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
