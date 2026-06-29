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

    const { role, type, answers } = await request.json();

    if (!role || !answers || !Array.isArray(answers)) {
      return NextResponse.json({ error: 'Role and answers are required' }, { status: 400 });
    }

    let score = 75;
    let confidenceScore = 80;
    let feedback = '';

    if (openai) {
      try {
        const response = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are an expert interviewer and career counselor. Evaluate the user’s interview answers. Return a JSON object with: 1. "score" (average performance out of 100), 2. "confidence" (confidence score out of 100), 3. "feedback" (markdown string providing constructive critiques and suggested phrasing adjustments).',
            },
            {
              role: 'user',
              content: JSON.stringify({ role, type, answers }),
            },
          ],
          response_format: { type: 'json_object' },
        });

        const resultText = response.choices[0]?.message?.content;
        if (resultText) {
          const parsed = JSON.parse(resultText);
          score = parsed.score || 75;
          confidenceScore = parsed.confidence || 80;
          feedback = parsed.feedback || 'Great job answering the prompts.';
        }
      } catch (err) {
        console.error('OpenAI interview audit error, falling back:', err);
        ({ score, confidenceScore, feedback } = generateMockEvaluation(type));
      }
    } else {
      ({ score, confidenceScore, feedback } = generateMockEvaluation(type));
    }

    return NextResponse.json({
      score,
      confidenceScore,
      feedback,
    });
  } catch (error) {
    console.error('Interview evaluation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateMockEvaluation(type: string) {
  let score = 82;
  let confidenceScore = 85;
  let feedback = `### **Interview Evaluation Feedback**

* **Strengths**: 
  * Good structure in articulating past design layouts (STAR format).
  * Direct answers avoiding unnecessary fluff.
* **Areas for Improvement**:
  * Speak more explicitly about the **quantitative metrics** of your projects (e.g. bundle size reduction, conversion boosts).
  * In behavioral items, emphasize team collaborative alignments rather than solo efforts.
* **Suggested Alternative Phrase**:
  * *"Instead of saying: 'I wrote CSS styles and libraries for Stripe,' try saying: 'I established design system tokens in Figma and Next.js, syncing styling guidelines across 3 development teams.'"*`;

  if (type === 'Technical') {
    score = 78;
    confidenceScore = 80;
    feedback = `### **Technical Audit Feedback**

* **Strengths**:
  * Demonstrates strong knowledge of React server layouts and state queries.
* **Areas for Improvement**:
  * Expand on **hydration error handling** and server action validations.
  * Clarify performance trade-offs of Client vs Server components in routing architectures.`;
  }

  return { score, confidenceScore, feedback };
}
