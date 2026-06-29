import { NextResponse } from 'next/server';
import { getSessionUserId } from '@/services/session';
import { db } from '@/services/db';

export async function GET() {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json({ user: null });
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        onboarded: true,
        careerGoal: true,
        experience: true,
        skills: true,
        targetRoles: true,
        learningTopics: true,
        bio: true,
        avatarUrl: true,
      },
    });

    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Session retrieval error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
