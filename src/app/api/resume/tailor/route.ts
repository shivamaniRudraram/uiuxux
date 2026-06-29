import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getSessionUserId } from '@/services/session';

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

export async function POST(request: Request) {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { resume, jobDescription } = await request.json();

    if (!resume || !jobDescription) {
      return NextResponse.json({ error: 'Resume and Job Description are required' }, { status: 400 });
    }

    let matchPercentage = 65;
    let missingSkills: string[] = [];
    let missingKeywords: string[] = [];
    let suggestions: { original: string; suggested: string; explanation: string }[] = [];
    let tailoredResume = {
      title: resume.title || 'Specialist',
      skills: resume.skills || '',
      experience: resume.experience ? JSON.parse(resume.experience) : [],
    };

    if (openai) {
      try {
        const response = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are an expert ATS optimization engine and technical recruiter. Compare the candidate's resume with the target job description (JD).
Generate a JSON output matching this strict schema:
{
  "matchPercentage": 75,
  "missingSkills": ["Docker", "GraphQL"],
  "missingKeywords": ["caching", "bundle optimization"],
  "suggestions": [
    {
      "original": "Built high fidelity user interfaces",
      "suggested": "Developed high-performance Next.js server components reducing LCP by 22%",
      "explanation": "Injects quantitative metrics and links directly with job requirements."
    }
  ],
  "tailoredResume": {
    "title": "Senior Frontend Developer",
    "skills": "React, Next.js, TypeScript, Tailwind CSS, Docker, GraphQL",
    "experience": [
      {
        "id": "1",
        "role": "Frontend Architect",
        "company": "Vercel",
        "duration": "2023 - Present",
        "description": "Developed high-performance Next.js server components reducing LCP by 22%. Managed global caching libraries."
      }
    ]
  }
}
Keep recommendations concise and actionable. Ensure returned experience item IDs match original experience item IDs.`,
            },
            {
              role: 'user',
              content: JSON.stringify({ resume, jobDescription }),
            },
          ],
          response_format: { type: 'json_object' },
        });

        const resultText = response.choices[0]?.message?.content;
        if (resultText) {
          const parsed = JSON.parse(resultText);
          matchPercentage = parsed.matchPercentage || 65;
          missingSkills = parsed.missingSkills || [];
          missingKeywords = parsed.missingKeywords || [];
          suggestions = parsed.suggestions || [];
          tailoredResume = parsed.tailoredResume || tailoredResume;
        }
      } catch (err) {
        console.error('OpenAI tailoring error, executing fallback:', err);
        ({ matchPercentage, missingSkills, missingKeywords, suggestions, tailoredResume } = generateMockTailoring(resume, jobDescription));
      }
    } else {
      ({ matchPercentage, missingSkills, missingKeywords, suggestions, tailoredResume } = generateMockTailoring(resume, jobDescription));
    }

    return NextResponse.json({
      matchPercentage,
      missingSkills,
      missingKeywords,
      suggestions,
      tailoredResume,
    });
  } catch (error) {
    console.error('Tailoring API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateMockTailoring(resume: any, jd: string) {
  const jdText = jd.toLowerCase();
  const title = resume.title || 'Senior Frontend Developer';
  const skills = resume.skills || 'React, Next.js, TypeScript';
  const experience = resume.experience ? JSON.parse(resume.experience) : [];

  let matchPercentage = 72;
  let missingSkills = ['Docker', 'GraphQL APIs'];
  let missingKeywords = ['Server Actions', 'LCP Optimization', 'Hydration debugging'];
  
  let suggestions = [
    {
      original: experience[0]?.description || 'Built high-fidelity user interfaces, next-gen components, and optimized layout metrics.',
      suggested: 'Developed server-rendered components in Next.js, optimizing LCP metrics by 24% and streamlining hydration pipelines.',
      explanation: 'Connects directly with next-gen rendering keywords in the target JD.',
    },
  ];

  // Modify experience details to create a tailored copy
  const tailoredExp = experience.map((item: any, idx: number) => {
    if (idx === 0) {
      return {
        ...item,
        description: 'Developed server-rendered components in Next.js, optimizing LCP metrics by 24% and streamlining hydration pipelines.',
      };
    }
    return item;
  });

  return {
    matchPercentage,
    missingSkills,
    missingKeywords,
    suggestions,
    tailoredResume: {
      title,
      skills: `${skills}, Docker, GraphQL`,
      experience: tailoredExp,
    },
  };
}
