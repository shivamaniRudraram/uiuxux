import React from 'react';

// Modern Notion/Duolingo-inspired friendly flat SVG illustrations
export const StudentLearning: React.FC<{ className?: string }> = ({ className = 'h-36 w-36' }) => {
  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="90" fill="#4f46e5" fillOpacity="0.05" />
      <path d="M40 145h120v10H40v-10z" fill="#1e1b4b" opacity="0.3" />
      {/* Book base */}
      <path d="M50 140c0-10 10-15 20-15h60c10 0 20 5 20 15v10H50v-10z" fill="#1f2937" />
      <path d="M70 125h60v20H70v-20z" fill="#9333ea" fillOpacity="0.3" />
      <path d="M60 145c0-5 5-8 10-8h60c5 0 10 3 10 8v5H60v-5z" fill="#ffffff" />
      {/* Desk Lamp */}
      <path d="M140 140v-40h-20" stroke="#4f46e5" strokeWidth="6" strokeLinecap="round" />
      <path d="M115 95a15 15 0 0115-15h10v30h-10a15 15 0 01-15-15z" fill="#4f46e5" />
      <path d="M100 120l15-20h10l-15 20h-10z" fill="#f59e0b" fillOpacity="0.3" />
      {/* Floating Graduation cap / sparks */}
      <path d="M100 40l45 15-45 15-45-15 45-15z" fill="#4f46e5" />
      <path d="M75 58v15c0 10 11 15 25 15s25-5 25-15V58" fill="#312e81" />
      <path d="M130 55v30" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
      <circle cx="130" cy="88" r="3.5" fill="#f59e0b" />
      <path d="M60 70l-5-5M60 65l5-5" stroke="#9333ea" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="160" cy="60" r="3" fill="#10b981" />
    </svg>
  );
};

export const ResumeAssistant: React.FC<{ className?: string }> = ({ className = 'h-36 w-36' }) => {
  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="90" fill="#9333ea" fillOpacity="0.05" />
      <path d="M55 150h90v8H55v-8z" fill="#1e1b4b" opacity="0.3" />
      {/* Document Sheet layout */}
      <rect x="65" y="45" width="70" height="95" rx="8" fill="#16161a" stroke="#374151" strokeWidth="3" />
      <rect x="75" y="60" width="35" height="6" rx="3" fill="#4f46e5" />
      <rect x="75" y="74" width="50" height="4" rx="2" fill="#4b5563" />
      <rect x="75" y="84" width="40" height="4" rx="2" fill="#4b5563" />
      <rect x="75" y="94" width="45" height="4" rx="2" fill="#4b5563" />
      {/* AI sparkles overlay */}
      <path d="M125 45l4 9 9 4-9 4-4 9-4-9-9-4 9-4 4-9z" fill="#9333ea" />
      <path d="M145 75l2.5 5.5 5.5 2.5-5.5 2.5-2.5 5.5-2.5-5.5-5.5-2.5 5.5-2.5 2.5-5.5z" fill="#4f46e5" />
      {/* Check seals */}
      <circle cx="120" cy="115" r="10" fill="#10b981" />
      <path d="M115 115l3.5 3.5 5-5" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const CoachAssistant: React.FC<{ className?: string }> = ({ className = 'h-36 w-36' }) => {
  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="90" fill="#4f46e5" fillOpacity="0.05" />
      {/* Avatar Bot Sphere */}
      <circle cx="100" cy="90" r="45" fill="#1f2937" stroke="#4f46e5" strokeWidth="3" />
      <rect x="75" y="105" width="50" height="12" rx="6" fill="#111827" stroke="#4f46e5" strokeWidth="2" />
      {/* Eyes glowing */}
      <circle cx="85" cy="85" r="5" fill="#10b981" className="animate-pulse" />
      <circle cx="115" cy="85" r="5" fill="#10b981" className="animate-pulse" />
      {/* Antenna glowing */}
      <path d="M100 45v-15" stroke="#9333ea" strokeWidth="4" strokeLinecap="round" />
      <circle cx="100" cy="25" r="6" fill="#9333ea" className="animate-pulse" />
      {/* Chat bubble representation */}
      <path d="M145 95c0-10 10-18 22-18s22 8 22 18-10 18-22 18h-5l-8 8v-8c-5 0-9-3-9-8z" fill="#4f46e5" fillOpacity="0.2" stroke="#4f46e5" strokeWidth="1.5" />
      <circle cx="158" cy="95" r="2" fill="#4f46e5" />
      <circle cx="167" cy="95" r="2" fill="#4f46e5" />
      <circle cx="176" cy="95" r="2" fill="#4f46e5" />
    </svg>
  );
};

export const JobRadar: React.FC<{ className?: string }> = ({ className = 'h-36 w-36' }) => {
  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="90" fill="#10b981" fillOpacity="0.05" />
      {/* Radar circles */}
      <circle cx="100" cy="100" r="70" stroke="#374151" strokeWidth="1.5" strokeDasharray="4 4" />
      <circle cx="100" cy="100" r="45" stroke="#4f46e5" strokeWidth="1.5" strokeOpacity="0.4" />
      {/* Radar hand line */}
      <path d="M100 100l50-30" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M100 100l50-30A58 58 0 00100 42v58z" fill="#10b981" fillOpacity="0.1" />
      {/* Hiring targets dots */}
      <circle cx="150" cy="70" r="6" fill="#10b981" />
      <circle cx="150" cy="70" r="12" stroke="#10b981" strokeWidth="1.5" strokeOpacity="0.5" className="animate-ping" />
      
      <circle cx="65" cy="130" r="5" fill="#4f46e5" />
      <circle cx="80" cy="65" r="4" fill="#9333ea" />
    </svg>
  );
};

export const TimeMachine: React.FC<{ className?: string }> = ({ className = 'h-36 w-36' }) => {
  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="90" fill="#f59e0b" fillOpacity="0.05" />
      {/* Hourglass body */}
      <path d="M60 50h80M60 150h80" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" />
      <path d="M70 50c0 25 15 45 30 50-15 5-30 25-30 50h60c0-25-15-45-30-50 15-5 30-25 30-50H70z" fill="#1f2937" stroke="#4b5563" strokeWidth="3" />
      {/* Sand flow */}
      <path d="M100 65l10 30H90l10-30z" fill="#f59e0b" />
      <path d="M96 95h8v45h-8z" fill="#f59e0b" fillOpacity="0.4" />
      <path d="M85 140c0-8 6-12 15-12s15 4 15 12H85z" fill="#f59e0b" />
      {/* Future portal sparks */}
      <circle cx="150" cy="100" r="3" fill="#10b981" />
      <path d="M135 70l4 9 9 4-9 4-4 9-4-9-9-4 9-4 4-9z" fill="#9333ea" />
    </svg>
  );
};
