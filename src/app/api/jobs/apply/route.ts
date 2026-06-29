import { NextResponse } from 'next/server';
import { getSessionUserId } from '@/services/session';
import { db } from '@/services/db';

export async function POST(request: Request) {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { jobTitle, company } = await request.json();

    if (!jobTitle || !company) {
      return NextResponse.json({ error: 'Job title and company are required' }, { status: 400 });
    }

    // Check if already applied
    const existing = await db.jobApplication.findFirst({
      where: { userId, jobTitle, company },
    });

    if (existing) {
      return NextResponse.json({ error: 'Already applied to this position' }, { status: 409 });
    }

    // Create job application
    const application = await db.jobApplication.create({
      data: {
        userId,
        jobTitle,
        company,
        status: 'Applied',
      },
    });

    // Create system notification
    await db.notification.create({
      data: {
        userId,
        title: 'Application Submitted',
        message: `Your application for ${jobTitle} at ${company} has been recorded in the Application Tracker.`,
        type: 'info',
      },
    });

    return NextResponse.json({ success: true, application });
  } catch (error) {
    console.error('Job apply error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
