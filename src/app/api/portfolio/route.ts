import { NextResponse } from 'next/server';
import { getSessionUserId } from '@/services/session';
import { db } from '@/services/db';

export async function GET(request: Request) {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let portfolio = await db.portfolio.findUnique({
      where: { userId },
    });

    // If it doesn't exist, create an empty template portfolio
    if (!portfolio) {
      portfolio = await db.portfolio.create({
        data: {
          userId,
          theme: 'minimal',
          projects: JSON.stringify([
            { id: '1', name: 'SkillBridge Core AI Engine', description: 'Next.js application matching skills with careers via OpenAI APIs.', link: 'https://github.com' },
          ]),
          experience: JSON.stringify([
            { id: '1', role: 'Staff UI Designer', company: 'Stripe', duration: '2023 - Present' },
          ]),
        },
      });
    }

    return NextResponse.json({ portfolio });
  } catch (error) {
    console.error('Fetch portfolio error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { theme, projects, experience, publicShare } = await request.json();

    const portfolio = await db.portfolio.upsert({
      where: { userId },
      update: {
        theme,
        projects: JSON.stringify(projects),
        experience: JSON.stringify(experience),
        publicShare,
      },
      create: {
        userId,
        theme,
        projects: JSON.stringify(projects),
        experience: JSON.stringify(experience),
        publicShare,
      },
    });

    return NextResponse.json({ success: true, portfolio });
  } catch (error) {
    console.error('Save portfolio error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
