import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getSessionUserId } from '@/services/session';

// Initialize OpenAI client if the key is available
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

export async function POST(request: Request) {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, title, skills, experience, education } = await request.json();

    if (!title || !skills) {
      return NextResponse.json({ error: 'Title and skills are required' }, { status: 400 });
    }

    let atsScore = 80;
    let suggestions: string[] = [];
    let keywordsToAdd: string[] = [];

    if (openai) {
      try {
        const response = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are an expert ATS (Applicant Tracking System) parser and senior recruiter. Analyze the resume details provided in JSON and return a JSON object with: 1. "score" (number from 40 to 100), 2. "suggestions" (array of 3-4 bullet strings), 3. "keywords" (array of 4-5 missing industry keywords to optimize). Keep responses constructive and brief.',
            },
            {
              role: 'user',
              content: JSON.stringify({ name, title, skills, experience, education }),
            },
          ],
          response_format: { type: 'json_object' },
        });

        const resultText = response.choices[0]?.message?.content;
        if (resultText) {
          const parsed = JSON.parse(resultText);
          atsScore = parsed.score || 80;
          suggestions = parsed.suggestions || [];
          keywordsToAdd = parsed.keywords || [];
        }
      } catch (err) {
        console.error('OpenAI execution error, falling back:', err);
        // Fall back to mock analysis if API key errors
        ({ atsScore, suggestions, keywordsToAdd } = generateMockAnalysis(title, skills));
      }
    } else {
      // Direct mock if no OpenAI key configured
      ({ atsScore, suggestions, keywordsToAdd } = generateMockAnalysis(title, skills));
    }

    return NextResponse.json({
      atsScore,
      suggestions,
      keywordsToAdd,
    });
  } catch (error) {
    console.error('Resume API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateMockAnalysis(title: string, skills: string) {
  const isDesign = title.toLowerCase().includes('design') || title.toLowerCase().includes('ux');
  const isProduct = title.toLowerCase().includes('product') || title.toLowerCase().includes('pm');
  
  let score = 84;
  let suggestions = [
    'Quantify accomplishments in experience bullets (e.g. Improved performance by 30% rather than just Developed web interfaces).',
    'Include active links to project repositories or design mockups in the description.',
    'Add an introductory summary paragraph detailing key values at the top of the resume.',
  ];
  let keywords = ['Tailwind CSS', 'Next.js Server Actions', 'UI/UX Prototypes', 'REST APIs'];

  if (isDesign) {
    score = 82;
    suggestions[1] = 'Include references to usability testing and design thinking metrics.';
    keywords = ['Figma Libraries', 'Interaction Models', 'Design Systems', 'Usability Auditing'];
  } else if (isProduct) {
    score = 86;
    suggestions[1] = 'Define quantitative metrics showing user growth or cost savings.';
    keywords = ['Agile Methodologies', 'Product Roadmap', 'A/B Testing', 'Stakeholder Alignment'];
  }

  return { atsScore: score, suggestions, keywordsToAdd: keywords };
}
