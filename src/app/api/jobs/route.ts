import { NextResponse } from 'next/server';
import { getSessionUserId } from '@/services/session';
import { db } from '@/services/db';

export async function GET(request: Request) {
  try {
    const userId = await getSessionUserId();
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'All';

    // Retrieve user skills to calculate AI Match Score
    let userSkills: string[] = [];
    if (userId) {
      const user = await db.user.findUnique({
        where: { id: userId },
        select: { skills: true },
      });
      if (user?.skills) {
        userSkills = user.skills.split(',').map(s => s.trim().toLowerCase());
      }
    }

    // Retrieve jobs from SQLite
    const jobs = await db.job.findMany({
      orderBy: { postedAt: 'desc' },
    });

    // Filter jobs
    const filteredJobs = jobs.filter(job => {
      const titleMatch = job.title.toLowerCase().includes(query.toLowerCase());
      const companyMatch = job.company.toLowerCase().includes(query.toLowerCase());
      const skillsMatch = job.skills.toLowerCase().includes(query.toLowerCase());
      
      const textMatches = titleMatch || companyMatch || skillsMatch;
      const typeMatches = type === 'All' || job.type === type;

      return textMatches && typeMatches;
    });

    // Inject AI Match Score
    const jobsWithMatches = filteredJobs.map(job => {
      let matchScore = 50; // Base score
      const reqSkills = job.skills.split(',').map(s => s.trim().toLowerCase());
      
      if (userSkills.length > 0) {
        const intersection = reqSkills.filter(s => userSkills.includes(s));
        const percentage = Math.round((intersection.length / reqSkills.length) * 100);
        matchScore = Math.min(Math.max(50, percentage + 50), 99); // Scale matching cleanly from 50 to 99
      }

      return {
        ...job,
        matchScore,
      };
    });

    return NextResponse.json({ jobs: jobsWithMatches });
  } catch (error) {
    console.error('Fetch jobs error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
