'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  User, 
  Send, 
  Sparkles, 
  DollarSign, 
  FileText, 
  Map, 
  Zap,
  Info
} from 'lucide-react';
import { CoachAssistant } from '@/components/ui/Illustrations';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export default function CoachPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `### **Welcome to SkillBridge AI Career Coach!** 

I am your personal AI mentor. I can help you:
* Audit your **resume and portfolio**
* Formulate **salary negotiation strategies**
* Design step-by-step **upskilling roadmaps**
* Practice **mock interviews**

*Choose one of the quick accelerators on the left or type your question below!*`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMessage: Message = { role: 'user', content: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/coach/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages(prev => [
          ...prev,
          { role: 'assistant', content: 'Sorry, I failed to process that request. Please try again.' },
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleAccelerator = (type: string) => {
    let prompt = '';
    switch (type) {
      case 'roadmap':
        prompt = 'Provide a structured career roadmap to transition from mid-level to senior frontend architect.';
        break;
      case 'salary':
        prompt = 'Give me negotiation tips and average compensation ranges for a Senior Product Designer role in SF.';
        break;
      case 'resume':
        prompt = 'How should I optimize my resume bullet points for a high-traffic AI PM position?';
        break;
      case 'gaps':
        prompt = 'Perform a skill gap analysis for engineering roles shifting into LLM integration workflows.';
        break;
    }
    handleSendMessage(prompt);
  };

  // Convert simple markdown into clean HTML snippets
  const renderMarkdown = (text: string) => {
    return text.split('\n').map((line, idx) => {
      // Headers
      if (line.startsWith('### ')) {
        return <h3 key={idx} className="text-base font-bold text-neutral-100 mt-4 mb-2 tracking-tight">{line.replace('### ', '')}</h3>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={idx} className="text-lg font-bold text-neutral-100 mt-4 mb-2 tracking-tight">{line.replace('## ', '')}</h2>;
      }
      if (line.startsWith('# ')) {
        return <h1 key={idx} className="text-xl font-bold text-neutral-100 mt-4 mb-2 tracking-tight">{line.replace('# ', '')}</h1>;
      }
      // Bullet points
      if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
        return (
          <li key={idx} className="ml-4 list-disc text-xs text-neutral-300 leading-relaxed mb-1">
            {line.replace(/^(\*\s|-\s)/, '')}
          </li>
        );
      }
      // Numbered lists
      if (/^\d+\.\s/.test(line.trim())) {
        return (
          <li key={idx} className="ml-4 list-decimal text-xs text-neutral-300 leading-relaxed mb-1">
            {line.replace(/^\d+\.\s/, '')}
          </li>
        );
      }
      // Regular paragraphs
      return (
        <p key={idx} className="text-xs text-neutral-300 leading-relaxed mb-2">
          {line.split('**').map((chunk, cidx) => {
            if (cidx % 2 === 1) return <strong key={cidx} className="text-indigo-400 font-semibold">{chunk}</strong>;
            return chunk;
          })}
        </p>
      );
    });
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto py-2 animate-in fade-in duration-300 h-[calc(100vh-120px)]">
      
      {/* Banner */}
      <div className="pb-4 border-b border-neutral-900 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-100 flex items-center gap-2">
            AI Career Coach <Bot size={20} className="text-indigo-400" />
          </h1>
          <p className="text-xs text-neutral-450 mt-1">Get instant guidance on resume audits, interview practices, and salary targets.</p>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-8 min-h-0">
        
        {/* Sidebar prompt accelerators */}
        <div className="flex flex-col gap-3.5">
          <span className="text-[10px] font-extrabold text-neutral-500 uppercase tracking-widest px-1">Coach Accelerators</span>
          
          <button 
            onClick={() => handleAccelerator('roadmap')}
            className="w-full text-left p-4 rounded-[16px] bg-neutral-950/20 hover:bg-neutral-900/50 border border-neutral-900 hover:border-indigo-500/20 text-xs transition flex gap-3.5 group cursor-pointer"
          >
            <div className="p-2.5 bg-neutral-900 rounded-xl group-hover:bg-indigo-900/10 transition text-indigo-400 shrink-0">
              <Map size={15} />
            </div>
            <div>
              <span className="font-bold text-neutral-200 block">Career Roadmap</span>
              <span className="text-[10px] text-neutral-500 mt-1 block">Plan milestones & goals.</span>
            </div>
          </button>

          <button 
            onClick={() => handleAccelerator('salary')}
            className="w-full text-left p-4 rounded-[16px] bg-neutral-950/20 hover:bg-neutral-900/50 border border-neutral-900 hover:border-purple-500/20 text-xs transition flex gap-3.5 group cursor-pointer"
          >
            <div className="p-2.5 bg-neutral-900 rounded-xl group-hover:bg-purple-900/10 transition text-purple-400 shrink-0">
              <DollarSign size={15} />
            </div>
            <div>
              <span className="font-bold text-neutral-200 block">Salary Insights</span>
              <span className="text-[10px] text-neutral-500 mt-1 block">Audit compensation rates.</span>
            </div>
          </button>

          <button 
            onClick={() => handleAccelerator('resume')}
            className="w-full text-left p-4 rounded-[16px] bg-neutral-950/20 hover:bg-neutral-900/50 border border-neutral-900 hover:border-emerald-500/20 text-xs transition flex gap-3.5 group cursor-pointer"
          >
            <div className="p-2.5 bg-neutral-900 rounded-xl group-hover:bg-emerald-900/10 transition text-emerald-400 shrink-0">
              <FileText size={15} />
            </div>
            <div>
              <span className="font-bold text-neutral-200 block">Resume Review</span>
              <span className="text-[10px] text-neutral-500 mt-1 block">Rewrite experience bullets.</span>
            </div>
          </button>

          <button 
            onClick={() => handleAccelerator('gaps')}
            className="w-full text-left p-4 rounded-[16px] bg-neutral-950/20 hover:bg-neutral-900/50 border border-neutral-900 hover:border-amber-500/20 text-xs transition flex gap-3.5 group cursor-pointer"
          >
            <div className="p-2.5 bg-neutral-900 rounded-xl group-hover:bg-amber-900/10 transition text-amber-400 shrink-0">
              <Zap size={15} />
            </div>
            <div>
              <span className="font-bold text-neutral-200 block">Interview Practice</span>
              <span className="text-[10px] text-neutral-500 mt-1 block">Practice role-based questions.</span>
            </div>
          </button>
        </div>

        {/* ChatGPT Chat Console */}
        <Card className="glass-panel border-neutral-800/80 lg:col-span-3 flex flex-col justify-between overflow-hidden p-0 bg-neutral-950/15 h-full">
          
          {/* Chat scrolling feed */}
          <div className="flex-1 overflow-y-auto p-8 space-y-8">
            
            {/* Coach assistant illustration on greeting */}
            {messages.length === 1 && (
              <div className="flex flex-col items-center justify-center text-center py-6 gap-3">
                <CoachAssistant className="h-24 w-24" />
                <span className="text-[10px] text-indigo-400 font-extrabold uppercase tracking-widest mt-2">AI assistant online</span>
              </div>
            )}

            {messages.map((m, idx) => (
              <div 
                key={idx} 
                className={`flex gap-4 items-start ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role !== 'user' && (
                  <div className="h-8 w-8 rounded-xl bg-indigo-650 flex items-center justify-center text-white border border-indigo-500/20 shadow-md shadow-indigo-650/10 mt-1 shrink-0">
                    <Bot size={16} />
                  </div>
                )}
                
                <div className={`p-5 rounded-[16px] max-w-[85%] leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none text-xs font-semibold' 
                    : 'bg-neutral-900/40 border border-neutral-850 rounded-tl-none text-neutral-200 shadow-xl shadow-black/10'
                }`}>
                  {m.role === 'user' ? (
                    <p>{m.content}</p>
                  ) : (
                    <div>{renderMarkdown(m.content)}</div>
                  )}
                </div>

                {m.role === 'user' && (
                  <div className="h-8 w-8 rounded-xl bg-neutral-800 flex items-center justify-center text-neutral-300 border border-neutral-700 mt-1 shrink-0">
                    <User size={16} />
                  </div>
                )}
              </div>
            ))}

            {/* Typing status indicator */}
            {isTyping && (
              <div className="flex gap-4 items-start justify-start">
                <div className="h-8 w-8 rounded-xl bg-indigo-650 flex items-center justify-center text-white border border-indigo-500/20 mt-1 shrink-0">
                  <Bot size={16} />
                </div>
                <div className="p-4 bg-neutral-900/60 border border-neutral-850 rounded-[16px] rounded-tl-none text-xs text-neutral-450 flex items-center gap-1.5 shadow-xl shadow-black/10">
                  <span>Coach is formulating tips</span>
                  <div className="flex gap-0.5 items-center">
                    <span className="h-1 w-1 bg-neutral-450 rounded-full animate-bounce delay-0" />
                    <span className="h-1 w-1 bg-neutral-450 rounded-full animate-bounce delay-150" />
                    <span className="h-1 w-1 bg-neutral-450 rounded-full animate-bounce delay-300" />
                  </div>
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Form input console */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(input);
            }}
            className="p-5 border-t border-neutral-900 bg-neutral-950/60 flex items-center gap-3"
          >
            <div className="flex-1">
              <Input
                placeholder="Ask about resume rewrites, target salaries, or roadmap benchmarks..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isTyping}
                className="py-3 rounded-[12px] bg-neutral-900/80"
              />
            </div>
            <Button 
              type="submit" 
              variant="primary" 
              disabled={isTyping || !input.trim()}
              className="py-3 px-3.5 rounded-[12px]"
            >
              <Send size={15} />
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
