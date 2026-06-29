import { NextResponse } from 'next/server';
import { db } from '@/services/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const resolvedParams = await params;
    const userId = resolvedParams.userId;

    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        skills: true,
        bio: true,
        careerGoal: true,
        experience: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const portfolio = await db.portfolio.findUnique({
      where: { userId },
    });

    if (!portfolio || !portfolio.publicShare) {
      return NextResponse.json({ error: 'Portfolio is private or not configured' }, { status: 403 });
    }

    return NextResponse.json({
      user,
      portfolio: {
        theme: portfolio.theme,
        projects: JSON.parse(portfolio.projects),
        experience: JSON.parse(portfolio.experience),
      },
    });
  } catch (error) {
    console.error('Fetch public portfolio error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
