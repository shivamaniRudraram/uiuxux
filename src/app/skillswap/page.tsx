'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input, Select, Textarea } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { 
  RefreshCw, 
  BookOpen, 
  Sparkles, 
  MessageSquare, 
  CalendarDays, 
  Star, 
  Check,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SwapMatch {
  id: string;
  partnerName: string;
  partnerTitle: string;
  teachSkill: string; // What they teach
  learnSkill: string; // What they want to learn
  matchPercentage: number;
  avatarColor: string;
  rating: number;
}

export default function SkillSwapPage() {
  const [teachInput, setTeachInput] = useState('React, Next.js');
  const [learnInput, setLearnInput] = useState('Figma, Interaction Design');
  const [activeTab, setActiveTab] = useState<'matches' | 'scheduled'>('matches');
  
  // Custom mock matches based on skills swapping
  const [matches, setMatches] = useState<SwapMatch[]>([
    {
      id: 'm1',
      partnerName: 'Alex Riviera',
      partnerTitle: 'Lead UX Designer at Airbnb',
      teachSkill: 'Figma Design Systems & Variables',
      learnSkill: 'React Server Components',
      matchPercentage: 98,
      avatarColor: 'from-purple-500 to-indigo-500',
      rating: 4.9,
    },
    {
      id: 'm2',
      partnerName: 'Sarah Chen',
      partnerTitle: 'AI Solutions Architect',
      teachSkill: 'Prompt Engineering & LangChain',
      learnSkill: 'TypeScript Advanced APIs',
      matchPercentage: 94,
      avatarColor: 'from-emerald-500 to-teal-500',
      rating: 4.8,
    },
  ]);

  // Scheduler states
  const [selectedPartner, setSelectedPartner] = useState<SwapMatch | null>(null);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [scheduledSessions, setScheduledSessions] = useState<any[]>([
    { id: 's1', partner: 'Alex Riviera', date: 'July 5, 2026', time: '4:00 PM', skill: 'Figma Design Systems' },
  ]);

  // Chat window state
  const [activeChatMatch, setActiveChatMatch] = useState<SwapMatch | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<any[]>([
    { sender: 'them', text: 'Hey there! I saw your post. I would love to learn React from you, and I can teach you Figma tokens!' },
  ]);

  // Review states
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState('5');
  const [reviewPartner, setReviewPartner] = useState('');

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleDate || !scheduleTime || !selectedPartner) return;

    const newSession = {
      id: Math.random().toString(),
      partner: selectedPartner.partnerName,
      date: new Date(scheduleDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
      time: scheduleTime,
      skill: selectedPartner.teachSkill,
    };

    setScheduledSessions(prev => [newSession, ...prev]);
    setSelectedPartner(null);
    confetti({
      particleCount: 80,
      spread: 60,
    });
    setActiveTab('scheduled');
  };

  const handleSendChat = () => {
    if (!chatMessage.trim()) return;
    setChatHistory(prev => [...prev, { sender: 'me', text: chatMessage }]);
    setChatMessage('');
    setTimeout(() => {
      setChatHistory(prev => [
        ...prev, 
        { sender: 'them', text: 'Awesome! Let’s schedule a Google Meet call to swap skills next week.' }
      ]);
    }, 1200);
  };

  const handleReviewSubmit = () => {
    setIsReviewOpen(false);
    confetti({
      particleCount: 50,
      spread: 40,
    });
    alert('Thank you for rating your peer swap!');
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      
      {/* SkillSwap Header */}
      <div className="pb-4 border-b border-neutral-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-100 flex items-center gap-2">
            SkillSwap Platform <RefreshCw size={20} className="text-indigo-400" />
          </h1>
          <p className="text-xs text-neutral-450 mt-1">Teach what you know, learn what you need — completely cashless peer-to-peer networking.</p>
        </div>

        {/* Tab Controls */}
        <div className="flex gap-1 bg-neutral-900/60 p-1 border border-neutral-850 rounded-[12px] w-full md:w-auto">
          <button
            onClick={() => setActiveTab('matches')}
            className={`flex-1 md:flex-none px-4 py-1.5 text-xs rounded-lg font-semibold transition cursor-pointer ${
              activeTab === 'matches' ? 'bg-indigo-600 text-white' : 'text-neutral-450 hover:text-neutral-250'
            }`}
          >
            Matches
          </button>
          <button
            onClick={() => setActiveTab('scheduled')}
            className={`flex-1 md:flex-none px-4 py-1.5 text-xs rounded-lg font-semibold transition cursor-pointer ${
              activeTab === 'scheduled' ? 'bg-indigo-600 text-white' : 'text-neutral-450 hover:text-neutral-250'
            }`}
          >
            Scheduled Syncs
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Left Panel: Preferences & Guidelines */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          
          {/* Swap Preference Form */}
          <Card className="glass-panel border-neutral-800/80 p-6 flex flex-col gap-4">
            <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen size={14} className="text-indigo-400" /> Swap Settings
            </h3>
            
            <Input
              label="I Can Teach (Skills)"
              value={teachInput}
              onChange={(e) => setTeachInput(e.target.value)}
              placeholder="e.g. TypeScript, React"
            />

            <Input
              label="I Want to Learn (Skills)"
              value={learnInput}
              onChange={(e) => setLearnInput(e.target.value)}
              placeholder="e.g. Figma, UX research"
            />

            <Button variant="primary" size="sm" className="w-full mt-2" onClick={() => alert('Swap preferences updated!')}>
              Update Preferences
            </Button>
          </Card>

          {/* Community Guidelines */}
          <Card className="glass-panel border-neutral-800/80 p-6 flex flex-col gap-4">
            <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-purple-400" /> Guidelines
            </h3>
            <ul className="space-y-3">
              <li className="text-[11px] text-neutral-400 leading-relaxed flex items-start gap-2">
                <span className="text-indigo-400 font-bold mt-0.5">1.</span>
                <span>**Zero Payment**: SkillSwap is entirely free. Do not charge or solicit money.</span>
              </li>
              <li className="text-[11px] text-neutral-400 leading-relaxed flex items-start gap-2">
                <span className="text-indigo-400 font-bold mt-0.5">2.</span>
                <span>**Mutual Respect**: Respect your peer’s timeline and match criteria.</span>
              </li>
              <li className="text-[11px] text-neutral-400 leading-relaxed flex items-start gap-2">
                <span className="text-indigo-400 font-bold mt-0.5">3.</span>
                <span>**Timeliness**: Attend scheduled video calls. Notify 24h prior to reschedules.</span>
              </li>
            </ul>
          </Card>
        </div>

        {/* Right Panel: Content tabs */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          
          {activeTab === 'matches' ? (
            /* Matches layout */
            <div className="flex flex-col gap-6">
              {matches.map((item) => (
                <Card key={item.id} className="glass-panel border-neutral-800/80 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-indigo-500/20 transition">
                  <div className="flex items-start gap-4">
                    <div className={`h-12 w-12 rounded-xl bg-gradient-to-tr ${item.avatarColor} flex items-center justify-center font-extrabold text-sm text-white shrink-0`}>
                      {item.partnerName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-neutral-200">{item.partnerName}</h3>
                        <Badge variant="primary" className="text-[9px] py-0.5">
                          <Sparkles size={9} className="mr-1 animate-pulse" /> {item.matchPercentage}% Match
                        </Badge>
                      </div>
                      <span className="text-[11px] text-neutral-500 block mt-0.5">{item.partnerTitle}</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 mt-3 text-xs leading-relaxed">
                        <p className="text-neutral-450"><span className="font-bold text-indigo-400">Teaches:</span> {item.teachSkill}</p>
                        <p className="text-neutral-450"><span className="font-bold text-purple-400">Wants to Learn:</span> {item.learnSkill}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex md:flex-col items-stretch gap-2.5 w-full md:w-auto self-end md:self-center">
                    <Button variant="secondary" size="sm" className="flex-1 md:flex-none text-xs flex items-center justify-center gap-1.5" onClick={() => setActiveChatMatch(item)}>
                      <MessageSquare size={13} /> Chat
                    </Button>
                    <Button variant="primary" size="sm" className="flex-1 md:flex-none text-xs flex items-center justify-center gap-1.5" onClick={() => setSelectedPartner(item)}>
                      <CalendarDays size={13} /> Schedule
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            /* Scheduled Sessions view */
            <div className="flex flex-col gap-4">
              {scheduledSessions.map((s) => (
                <Card key={s.id} className="glass-panel border-neutral-800/80 p-5 flex justify-between items-center hover:border-neutral-750 transition">
                  <div className="flex items-center gap-3.5">
                    <div className="p-3 bg-indigo-950/20 text-indigo-400 border border-indigo-900/20 rounded-xl">
                      <CalendarDays size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-neutral-200">Sync with {s.partner}</h4>
                      <p className="text-[11px] text-neutral-450 mt-1">Topic: {s.skill} • {s.date} at {s.time}</p>
                    </div>
                  </div>

                  <Button variant="secondary" size="sm" onClick={() => { setReviewPartner(s.partner); setIsReviewOpen(true); }} className="text-xs flex items-center gap-1">
                    <Star size={12} className="text-amber-400" /> Rate Session
                  </Button>
                </Card>
              ))}
              {scheduledSessions.length === 0 && (
                <div className="text-center py-16 border border-dashed border-neutral-850 rounded-[16px] text-xs text-neutral-500">
                  No upcoming sync sessions scheduled. Match with partners to schedule.
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* Scheduler Modal */}
      {selectedPartner && (
        <Modal
          isOpen={!!selectedPartner}
          onClose={() => setSelectedPartner(null)}
          title={`Schedule Sync with ${selectedPartner.partnerName}`}
          description={`Swap topic: ${selectedPartner.teachSkill}`}
        >
          <form onSubmit={handleScheduleSubmit} className="flex flex-col gap-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-neutral-300 font-medium">Select Date</label>
                <input
                  type="date"
                  required
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="w-full rounded-[12px] bg-neutral-900 border border-neutral-800 px-4 py-2 text-sm text-neutral-100 transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/20"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-neutral-300 font-medium">Select Time</label>
                <input
                  type="time"
                  required
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full rounded-[12px] bg-neutral-900 border border-neutral-800 px-4 py-2 text-sm text-neutral-100 transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/20"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <Button type="button" variant="secondary" onClick={() => setSelectedPartner(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Confirm Schedule
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Ratings & Reviews Modal */}
      {isReviewOpen && (
        <Modal
          isOpen={isReviewOpen}
          onClose={() => setIsReviewOpen(false)}
          title="Rate Peer Session"
          description={`Submit feedback for your swap session with ${reviewPartner}.`}
        >
          <div className="flex flex-col gap-4 mt-2">
            <Select
              label="Session Rating"
              value={reviewRating}
              onChange={(e) => setReviewRating(e.target.value)}
              options={[
                { value: '5', label: '5 Stars - Outstanding Experience' },
                { value: '4', label: '4 Stars - Very Informative' },
                { value: '3', label: '3 Stars - Satisfactory' },
                { value: '2', label: '2 Stars - Needs Improvement' },
              ]}
            />
            <Textarea
              label="Peer Review Notes"
              placeholder="What did you learn? Give alex or sarah constructive remarks..."
              rows={3}
            />
            <div className="flex justify-end gap-3 mt-2">
              <Button variant="secondary" onClick={() => setIsReviewOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleReviewSubmit}>
                Submit Review
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Chat Conversation Overlay */}
      {activeChatMatch && (
        <Modal
          isOpen={!!activeChatMatch}
          onClose={() => setActiveChatMatch(null)}
          title={`Chat with ${activeChatMatch.partnerName}`}
        >
          <div className="flex flex-col gap-4 h-[350px]">
            {/* Scrollable messages panel */}
            <div className="flex-1 overflow-y-auto p-2 space-y-3.5 bg-neutral-950/20 border border-neutral-900 rounded-xl max-h-[280px]">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3 rounded-xl max-w-[85%] text-xs leading-relaxed ${
                    msg.sender === 'me' 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-neutral-900 border border-neutral-850/80 rounded-tl-none text-neutral-300'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Message input */}
            <div className="flex gap-2">
              <Input
                placeholder="Type a message to discuss your swap..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
              />
              <Button variant="primary" onClick={handleSendChat}>
                Send
              </Button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}
