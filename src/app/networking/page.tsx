'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input, Textarea, Select } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { 
  Users, 
  MessageSquare, 
  Sparkles, 
  UserPlus, 
  Compass, 
  BookOpen, 
  Send, 
  UserCheck2,
  Calendar
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Post {
  id: string;
  content: string;
  category: string;
  createdAt: string;
  user: {
    name: string;
    avatarUrl?: string | null;
  };
}

export default function NetworkingPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('General');
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);

  // Suggested Mentors directory
  const mentors = [
    { id: '1', name: 'Alex Riviera', role: 'Lead UX Architect at Airbnb', bio: 'Helped design core component libraries. Passionate about design systems.', skills: 'Figma, Design Tokens' },
    { id: '2', name: 'Sarah Chen', role: 'Staff AI Engineer at OpenAI', bio: 'Builds API pipelines and developer fine-tuning structures.', skills: 'LLMs, PyTorch, PyPipe' },
  ];

  const [selectedMentorForRequest, setSelectedMentorForRequest] = useState<any | null>(null);
  const [mentorshipMessage, setMentorshipMessage] = useState('');

  // Fetch posts
  const fetchPosts = async () => {
    try {
      const res = await fetch(`/api/posts?category=${activeCategory}`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [activeCategory]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    setIsSubmittingPost(true);

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newPostContent,
          category: newPostCategory,
        }),
      });

      if (res.ok) {
        setNewPostContent('');
        fetchPosts();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmittingPost(false);
    }
  };

  const handleMentorshipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mentorshipMessage.trim() || !selectedMentorForRequest) return;
    
    setSelectedMentorForRequest(null);
    setMentorshipMessage('');
    confetti({
      particleCount: 50,
      spread: 40,
    });
    alert('Your mentorship request has been sent! You will receive an alert if accepted.');
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      
      {/* Networking Header */}
      <div className="pb-4 border-b border-neutral-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-100 flex items-center gap-2">
            Networking Hub <Users size={22} className="text-indigo-400" />
          </h1>
          <p className="text-xs text-neutral-450 mt-1">Connect with industry peers, share career insights, and schedule mentorship audits.</p>
        </div>

        {/* Categories tabs */}
        <div className="flex flex-wrap gap-1 bg-neutral-900/60 p-1 border border-neutral-850 rounded-[12px]">
          {['All', 'General', 'Mentorship', 'Advice'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 text-xs rounded-lg font-semibold transition cursor-pointer ${
                activeCategory === cat 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-neutral-450 hover:text-neutral-250'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Community Feed & Event cards */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          
          {/* Post composer */}
          <Card className="glass-panel border-neutral-800/80 p-5">
            <form onSubmit={handleCreatePost} className="flex flex-col gap-3">
              <span className="text-xs font-bold text-neutral-350 px-1 uppercase tracking-wider">Start Discussion</span>
              <Textarea
                placeholder="Share a career milestone, design concept, or seek help..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                rows={2}
              />
              <div className="flex justify-between items-center mt-1">
                <div className="w-1/3">
                  <Select
                    value={newPostCategory}
                    onChange={(e) => setNewPostCategory(e.target.value)}
                    options={[
                      { value: 'General', label: 'General Discussion' },
                      { value: 'Mentorship', label: 'Mentorship Request' },
                      { value: 'Advice', label: 'Career Advice' },
                    ]}
                  />
                </div>
                <Button type="submit" variant="primary" isLoading={isSubmittingPost} className="px-5">
                  Publish <Send size={12} className="ml-1.5" />
                </Button>
              </div>
            </form>
          </Card>

          {/* Discussion feed posts */}
          <div className="flex flex-col gap-5">
            {posts.map((post) => (
              <Card key={post.id} className="glass-panel border-neutral-850 p-5 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white border border-indigo-400/25">
                    {post.user.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-neutral-200 block">{post.user.name}</span>
                    <span className="text-[9px] text-neutral-500 mt-0.5 block">
                      {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} at {new Date(post.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <Badge variant={post.category === 'Mentorship' ? 'purple' : post.category === 'Advice' ? 'warning' : 'primary'} className="ml-auto">
                    {post.category}
                  </Badge>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed font-normal">
                  {post.content}
                </p>
                <div className="flex gap-4 items-center text-[10px] text-neutral-500 font-semibold uppercase tracking-wider border-t border-neutral-900/60 pt-3">
                  <button className="hover:text-indigo-400 flex items-center gap-1 cursor-pointer">
                    <MessageSquare size={12} /> Comment (0)
                  </button>
                </div>
              </Card>
            ))}
            {posts.length === 0 && (
              <div className="text-center py-16 border border-dashed border-neutral-850 rounded-[16px] text-xs text-neutral-500">
                No discussion threads posted in this category. Write the first post!
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Connection directory & events */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          
          {/* Mentors Suggested */}
          <Card className="glass-panel border-neutral-800/80 p-6 flex flex-col gap-5">
            <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles size={14} className="text-indigo-400 animate-pulse" /> Verified Mentors
            </h3>
            
            <div className="flex flex-col gap-4">
              {mentors.map((mentor) => (
                <div key={mentor.id} className="p-4 rounded-xl bg-neutral-950/40 border border-neutral-850/60 flex flex-col gap-3">
                  <div>
                    <span className="text-xs font-bold text-neutral-250 block">{mentor.name}</span>
                    <span className="text-[10px] text-neutral-500 block mt-0.5">{mentor.role}</span>
                  </div>
                  <p className="text-[11px] text-neutral-450 leading-relaxed font-normal">{mentor.bio}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[9px] text-indigo-400 font-bold font-mono">Core: {mentor.skills}</span>
                    <button 
                      onClick={() => setSelectedMentorForRequest(mentor)}
                      className="text-xs font-bold text-indigo-400 hover:text-indigo-350 hover:underline cursor-pointer flex items-center gap-0.5"
                    >
                      Request <UserPlus size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Upcoming Career Webinars */}
          <Card className="glass-panel border-neutral-800/80 p-6 flex flex-col gap-4">
            <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar size={14} className="text-purple-400" /> Career Panels
            </h3>
            
            <div className="p-3.5 bg-neutral-950/20 border border-neutral-850 rounded-xl flex gap-3 items-start">
              <div className="p-2 bg-purple-950/30 text-purple-400 border border-purple-900/30 rounded-lg shrink-0">
                <Calendar size={15} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-neutral-200">Scale Next.js Production Systems</h4>
                <p className="text-[10px] text-neutral-500 mt-1">Hosted by SkillBridge • July 10 at 5:00 PM</p>
                <button className="text-[10px] font-bold text-indigo-400 hover:underline mt-2 block cursor-pointer">Register Seat</button>
              </div>
            </div>
          </Card>

        </div>

      </div>

      {/* Mentorship request modal */}
      {selectedMentorForRequest && (
        <Modal
          isOpen={!!selectedMentorForRequest}
          onClose={() => setSelectedMentorForRequest(null)}
          title={`Request Mentorship with ${selectedMentorForRequest.name}`}
          description={selectedMentorForRequest.role}
        >
          <form onSubmit={handleMentorshipSubmit} className="flex flex-col gap-4 mt-2">
            <Textarea
              label="Why are you seeking mentorship?"
              placeholder="e.g. I am looking for guidance on design system guidelines and components review..."
              required
              value={mentorshipMessage}
              onChange={(e) => setMentorshipMessage(e.target.value)}
              rows={3}
            />
            <div className="flex justify-end gap-3 mt-2">
              <Button type="button" variant="secondary" onClick={() => setSelectedMentorForRequest(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Send Request
              </Button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
}
