'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Select, Textarea } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  MessageSquareCode, 
  Sparkles, 
  Play, 
  ArrowRight, 
  Award, 
  Trophy, 
  RefreshCw,
  Speech
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Question {
  id: string;
  text: string;
}

export default function MockInterviewPage() {
  const [view, setView] = useState<'setup' | 'active' | 'results'>('setup');
  const [role, setRole] = useState('Frontend Engineer');
  const [type, setType] = useState('Technical');
  
  // Active questions list
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userReplies, setUserReplies] = useState<string[]>([]);
  const [currentReply, setCurrentReply] = useState('');
  
  // Results score states
  const [scores, setScores] = useState({ score: 80, confidenceScore: 82, feedback: '' });
  const [isEvaluating, setIsEvaluating] = useState(false);

  const startInterview = () => {
    let mockQuestions: Question[] = [];
    if (type === 'Technical') {
      mockQuestions = [
        { id: '1', text: 'Explain the core architectural differences between React Server Components and Client Components.' },
        { id: '2', text: 'How do you diagnose and resolve rendering layouts hydration errors in Next.js?' },
        { id: '3', text: 'What is the utility of debouncing and how would you optimize high-rate event listeners?' },
      ];
    } else if (type === 'Behavioral') {
      mockQuestions = [
        { id: '1', text: 'Describe a situation where you had a disagreement with a product designer or stakeholder. How did you align?' },
        { id: '2', text: 'Tell me about a high-stress bug or layout failure in production. How did you resolve it under pressure?' },
      ];
    } else {
      mockQuestions = [
        { id: '1', text: 'Why are you interested in joining our company, and where do you see your technical skills in 3 years?' },
        { id: '2', text: 'How do you handle onboarding to a massive legacy codebase with zero active documentation?' },
      ];
    }

    setQuestions(mockQuestions);
    setCurrentIdx(0);
    setUserReplies([]);
    setCurrentReply('');
    setView('active');
  };

  const handleNext = () => {
    setUserReplies(prev => [...prev, currentReply]);
    setCurrentReply('');
    
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      submitEvaluation();
    }
  };

  const submitEvaluation = async () => {
    setView('results');
    setIsEvaluating(true);
    try {
      const finalReplies = [...userReplies, currentReply];
      const answers = questions.map((q, idx) => ({ question: q.text, answer: finalReplies[idx] }));
      
      const res = await fetch('/api/interview/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          type,
          answers,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setScores({
          score: data.score,
          confidenceScore: data.confidenceScore,
          feedback: data.feedback,
        });
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsEvaluating(false);
    }
  };

  // Simple markdown converter
  const renderMarkdown = (text: string) => {
    if (!text) return null;
    return text.split('\n').map((line, idx) => {
      if (line.startsWith('### ')) {
        return <h3 key={idx} className="text-sm font-bold text-neutral-100 mt-4 mb-2 uppercase tracking-wide">{line.replace('### ', '')}</h3>;
      }
      if (line.startsWith('* ') || line.startsWith('- ')) {
        return (
          <li key={idx} className="ml-4 list-disc text-xs text-neutral-350 leading-relaxed mb-1">
            {line.replace(/^(\*\s|-\s)/, '')}
          </li>
        );
      }
      return <p key={idx} className="text-xs text-neutral-400 leading-relaxed mb-2">{line}</p>;
    });
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      
      {/* Interview Header */}
      <div className="pb-4 border-b border-neutral-900 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-100 flex items-center gap-2">
            AI Mock Interview <MessageSquareCode size={22} className="text-indigo-400" />
          </h1>
          <p className="text-xs text-neutral-450 mt-1">Practice mock dialogs with real-time feedback scores powered by OpenAI auditor.</p>
        </div>
      </div>

      {view === 'setup' && (
        /* Setup layout */
        <Card className="glass-panel border-neutral-800/80 p-8 max-w-xl mx-auto w-full relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
          
          <CardHeader className="px-0 pt-2 mb-6">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              Configure Interview <Speech size={18} className="text-indigo-400" />
            </CardTitle>
            <p className="text-xs text-neutral-400">Select target skills and categories to generate custom prompts.</p>
          </CardHeader>

          <CardContent className="px-0 flex flex-col gap-5">
            <Select
              label="Interview Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              options={[
                { value: 'Frontend Engineer', label: 'Frontend / UI Engineer' },
                { value: 'Product Designer', label: 'UI/UX Product Designer' },
                { value: 'Product Manager', label: 'AI Product Manager' },
              ]}
            />

            <Select
              label="Interview Category"
              value={type}
              onChange={(e) => setType(e.target.value)}
              options={[
                { value: 'Technical', label: 'Technical Core Knowledge' },
                { value: 'Behavioral', label: 'Behavioral Situations (STAR)' },
                { value: 'HR', label: 'HR Alignment & Professional Fit' },
              ]}
            />

            <Button variant="primary" className="w-full mt-4 flex items-center justify-center gap-1.5 py-2.5" onClick={startInterview}>
              Begin Mock Interview <Play size={13} fill="currentColor" />
            </Button>
          </CardContent>
        </Card>
      )}

      {view === 'active' && questions.length > 0 && (
        /* Active Interview Panel */
        <Card className="glass-panel border-neutral-800/80 p-8 max-w-2xl mx-auto w-full relative">
          <div className="flex justify-between items-center pb-3 border-b border-neutral-850 mb-6 text-xs text-neutral-500 font-bold uppercase">
            <span>Interview in Progress</span>
            <span>Question {currentIdx + 1} of {questions.length}</span>
          </div>

          <div className="mb-6">
            <Badge variant="primary" className="mb-2">{type}</Badge>
            <h3 className="text-base font-bold text-neutral-100 leading-snug">
              {questions[currentIdx].text}
            </h3>
          </div>

          <Textarea
            label="Your Answer"
            placeholder="Type your response here..."
            value={currentReply}
            onChange={(e) => setCurrentReply(e.target.value)}
            rows={5}
            className="text-xs"
          />

          <div className="flex justify-end gap-3 mt-8">
            <Button variant="secondary" onClick={() => setView('setup')}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleNext}
              disabled={!currentReply.trim()}
              className="flex items-center gap-1.5"
            >
              {currentIdx < questions.length - 1 ? (
                <>Next Question <ArrowRight size={13} /></>
              ) : (
                <>Submit Interview <Award size={13} /></>
              )}
            </Button>
          </div>
        </Card>
      )}

      {view === 'results' && (
        /* Results View */
        <Card className="glass-panel border-neutral-800/80 p-8 max-w-3xl mx-auto w-full">
          {isEvaluating ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="h-8 w-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
              <span className="text-xs text-neutral-450 tracking-wider">AI Auditor is analyzing answers...</span>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              
              {/* Top Title Banner */}
              <div className="flex justify-between items-center pb-3 border-b border-neutral-850">
                <span className="text-xs font-bold text-neutral-350 uppercase tracking-wider flex items-center gap-1.5">
                  <Trophy size={14} className="text-amber-400" /> Evaluation Report
                </span>
                <Button variant="secondary" size="sm" onClick={() => setView('setup')} className="flex items-center gap-1">
                  <RefreshCw size={12} /> Restart
                </Button>
              </div>

              {/* Graphic Score dials */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                
                {/* Communication score card */}
                <div className="p-5 bg-neutral-950/30 border border-neutral-850/60 rounded-xl text-center flex flex-col gap-2">
                  <span className="text-xs font-bold text-neutral-500 uppercase">Communication Logic</span>
                  <h3 className="text-3xl font-extrabold text-indigo-400">{scores.score} <span className="text-xs font-normal text-neutral-550">/100</span></h3>
                  <div className="mt-1">
                    <Progress value={scores.score} color="primary" />
                  </div>
                </div>

                {/* Confidence score card */}
                <div className="p-5 bg-neutral-950/30 border border-neutral-850/60 rounded-xl text-center flex flex-col gap-2">
                  <span className="text-xs font-bold text-neutral-500 uppercase">Fluency & Phrasing</span>
                  <h3 className="text-3xl font-extrabold text-purple-400">{scores.confidenceScore} <span className="text-xs font-normal text-neutral-550">/100</span></h3>
                  <div className="mt-1">
                    <Progress value={scores.confidenceScore} color="accent" />
                  </div>
                </div>

              </div>

              {/* Detailed AI report markdown */}
              <div className="p-6 bg-neutral-950/10 border border-neutral-850 rounded-[16px] text-xs">
                {renderMarkdown(scores.feedback)}
              </div>

            </div>
          )}
        </Card>
      )}

    </div>
  );
}
