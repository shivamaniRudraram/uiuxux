'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, signup } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!email || !password || (!isLogin && !name)) {
      setError('Please fill in all fields');
      setIsSubmitting(false);
      return;
    }

    try {
      if (isLogin) {
        const result = await login(email, password);
        if (result.error) {
          setError(result.error);
        } else {
          router.push('/dashboard');
        }
      } else {
        const result = await signup(name, email, password);
        if (result.error) {
          setError(result.error);
        } else {
          router.push('/onboarding');
        }
      }
    } catch (err) {
      setError('Authentication failed. Please check credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = () => {
    setIsSubmitting(true);
    // Simulate secure google auth delay and login standard demo user
    setTimeout(async () => {
      const res = await login('demo@skillbridge.ai', 'password123');
      if (res.error) {
        // If demo doesn't exist, sign up demo user
        const signupRes = await signup('Demo Professional', 'demo@skillbridge.ai', 'password123');
        if (!signupRes.error) {
          router.push('/onboarding');
        } else {
          setError('Google authentication simulation failed');
        }
      } else {
        router.push('/dashboard');
      }
      setIsSubmitting(false);
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/20 via-neutral-950 to-neutral-950">
      <div className="w-full max-w-md flex flex-col gap-6">
        
        {/* Brand Logo header */}
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-[14px] shadow-lg shadow-indigo-500/10">
            <Sparkles className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-neutral-100">SkillBridge AI</h1>
            <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider -mt-1">All-in-One Career Platform</p>
          </div>
        </div>

        {/* Auth form card */}
        <Card className="glass-panel border-neutral-800/80 p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500" />
          
          <CardHeader className="px-0 pt-2 mb-6">
            <CardTitle className="text-2xl font-bold tracking-tight">
              {isLogin ? 'Sign In' : 'Create Account'}
            </CardTitle>
            <CardDescription className="text-xs text-neutral-450 mt-1">
              {isLogin ? 'Welcome back! Enter credentials to access your career workspace.' : 'Get started to build resumes, match jobs, and grow.'}
            </CardDescription>
          </CardHeader>

          <CardContent className="px-0">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && (
                <div className="p-3 bg-red-950/30 border border-red-900/40 rounded-lg text-xs text-red-400 font-medium">
                  {error}
                </div>
              )}

              {!isLogin && (
                <Input
                  label="Full Name"
                  placeholder="e.g. Sarah Chen"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSubmitting}
                />
              )}

              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
              />

              {isLogin && (
                <div className="flex justify-end -mt-1">
                  <button 
                    type="button" 
                    onClick={() => setError('Password reset simulation sent to email')}
                    className="text-[11px] text-indigo-400 hover:text-indigo-350 hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              <Button type="submit" variant="primary" isLoading={isSubmitting} className="w-full mt-2 py-2.5">
                {isLogin ? 'Sign In' : 'Sign Up'}
              </Button>
            </form>

            <div className="relative flex items-center justify-center my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-neutral-850" />
              </div>
              <span className="relative bg-neutral-900 px-3 text-[10px] text-neutral-500 uppercase tracking-widest font-semibold">Or continue with</span>
            </div>

            <Button 
              type="button" 
              variant="secondary" 
              onClick={handleGoogleSignIn}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2.5 py-2.5 hover:bg-neutral-800 transition"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#ffffff"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#ffffff"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#ffffff"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#ffffff"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Sign In with Google</span>
            </Button>
          </CardContent>
        </Card>

        {/* Toggle link */}
        <p className="text-center text-xs text-neutral-450">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
            }}
            className="text-indigo-400 hover:text-indigo-350 hover:underline font-semibold cursor-pointer"
          >
            {isLogin ? 'Create one now' : 'Sign in instead'}
          </button>
        </p>
      </div>
    </div>
  );
}
