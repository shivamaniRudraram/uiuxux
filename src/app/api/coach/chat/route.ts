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

    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
    }

    let reply = '';

    if (openai) {
      try {
        const response = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are SkillBridge AI Coach, an elite career mentor, executive coach, and tech recruiter. You provide highly personalized, crisp, and actionable career advice, interview strategies, salary negotiation details, and roadmap designs. Always format your responses using clean markdown (bolding, headers, lists).',
            },
            ...messages.slice(-6), // Send last 6 messages to preserve context while keeping token count low
          ],
        });

        reply = response.choices[0]?.message?.content || 'I encountered an issue processing your request.';
      } catch (err) {
        console.error('OpenAI coach error, falling back:', err);
        reply = generateFallbackReply(messages[messages.length - 1].content);
      }
    } else {
      reply = generateFallbackReply(messages[messages.length - 1].content);
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Coach API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateFallbackReply(message: string): string {
  const msg = message.toLowerCase();
  
  if (msg.includes('salary') || msg.includes('pay') || msg.includes('negotiat')) {
    return `### **Salary Negotiation Strategy**

Based on current industry rates for software engineers and designers:
1. **Never Give the First Number**: Try to lead the recruiter to specify the budget scope first.
2. **Focus on Total Compensation**: Base salary, equity (RSUs/Options), sign-on bonuses, and performance incentives.
3. **Bring Market Benchmarks**: Cite Glassdoor, levels.fyi, or SkillBridge Job Hub metrics.
4. **Define Your Target Range**: Always ask for 10-15% above your target to give room for compromise.`;
  }
  
  if (msg.includes('resume') || msg.includes('portfolio') || msg.includes('ats')) {
    return `### **Resume Review Guidelines**

To maximize your ATS compliance:
* **Quantify your bullet points**: Write "Delivered 4 Next.js tools, boosting load rates by 22%," instead of "Worked on frontend features."
* **Match job description keywords**: Ensure skills like **TypeScript, Design Systems, and REST APIs** are explicitly mentioned in your skills section.
* **Layout**: Keep formatting simple, clean, and single-column. Avoid fancy graphics which jam ATS parsers.`;
  }

  if (msg.includes('roadmap') || msg.includes('career') || msg.includes('switch')) {
    return `### **Upskilling Career Roadmap**

Here is a typical milestone roadmap to step into Next.js & UI Architecture:
1. **Milestone 1 (Foundations)**: Mastery of React Server Components, TypeScript compilation, and Tailwind styling grids.
2. **Milestone 2 (State & APIs)**: Advanced React Hooks, Server Actions, data prefetching, and TanStack query integrations.
3. **Milestone 3 (Performance)**: Dynamic layouts, bundle optimizations, and layout shift troubleshooting.
4. **Milestone 4 (Mentorship)**: Contributing to peer SkillSwaps and reviewing junior designs.`;
  }

  return `### **Greetings! I am your SkillBridge AI Career Coach.**

I can help you review resumes, map out custom upskilling paths, prepare for interviews, or negotiate compensation packages. 

* **To get started, try asking me:**
  * *"How can I negotiate my salary for a Senior Engineer role?"*
  * *"Give me a roadmap to learn System Design."*
  * *"What is a good way to describe React in my resume?"*`;
}
