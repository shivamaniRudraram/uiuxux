'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <div className="h-6 w-6 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mb-4" />
      <span className="text-xs text-neutral-450 tracking-wider">Redirecting to dashboard...</span>
    </div>
  );
}
