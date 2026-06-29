import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionUserId } from '@/services/session';
import { db } from '@/services/db';

const onboardSchema = z.object({
  careerGoal: z.string().min(3, 'Career goal is required'),
  experience: z.string().min(1, 'Experience level is required'),
  skills: z.string().min(1, 'Please enter at least one skill'),
  targetRoles: z.string().min(1, 'Please enter interested roles'),
  learningTopics: z.string().min(1, 'Please select learning topics'),
  bio: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const result = onboardSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const data = result.data;

    // Update user profile in database
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        careerGoal: data.careerGoal,
        experience: data.experience,
        skills: data.skills,
        targetRoles: data.targetRoles,
        learningTopics: data.learningTopics,
        bio: data.bio || '',
        onboarded: true,
      },
    });

    // Create a welcoming system notification for the user
    await db.notification.create({
      data: {
        userId,
        title: 'Welcome to SkillBridge AI!',
        message: 'Your career profile has been generated. Explore courses, review your resume, or practice an interview.',
        type: 'success',
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        onboarded: updatedUser.onboarded,
      },
    });
  } catch (error) {
    console.error('Onboarding API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
