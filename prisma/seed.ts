import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const jobsData = [
  {
    title: 'Senior Frontend Engineer',
    company: 'Vercel',
    location: 'Remote, US',
    salary: '$140,000 - $180,000',
    type: 'Full-time',
    description: 'We are looking for a Senior Frontend Engineer to join our core Next.js team. You will build and optimize user interfaces, design system components, and framework abstractions for millions of developers worldwide. Requirements: 5+ years of experience with React, TypeScript, and modern styling solutions (Tailwind CSS, CSS Modules). Strong understanding of Web Vitals and performance optimization.',
    skills: 'React, Next.js, TypeScript, Tailwind CSS, Performance Optimization',
  },
  {
    title: 'Product Designer (Design Systems)',
    company: 'Stripe',
    location: 'San Francisco, CA (Hybrid)',
    salary: '$150,000 - $190,000',
    type: 'Full-time',
    description: 'Join the Stripe Design Systems team to craft accessible, beautiful, and consistent interfaces across all Stripe products. You will collaborate closely with engineering and product partners to expand our Figma libraries, establish guidelines, and write high-fidelity UI documentation. Requirements: Strong portfolio demonstrating excellence in interaction design, typography, color theory, and system design.',
    skills: 'Figma, UI Design, Design Systems, Typography, Prototyping',
  },
  {
    title: 'AI Product Manager',
    company: 'OpenAI',
    location: 'San Francisco, CA',
    salary: '$180,000 - $240,000',
    type: 'Full-time',
    description: 'As an AI Product Manager, you will define the roadmap for our developer APIs and consumer workspace features. You will work with top AI researchers and engineers to launch generative features that help professionals write, build, and research faster. Requirements: Technical background in CS, past experience launching LLM-based products, and exceptional UX product intuition.',
    skills: 'Product Management, LLMs, AI APIs, Roadmap, Technical Strategy',
  },
  {
    title: 'Junior Full-Stack Developer',
    company: 'Linear',
    location: 'Remote, Europe',
    salary: '€70,000 - €90,000',
    type: 'Full-time',
    description: 'We are expanding our product team and looking for a Junior Full-Stack Developer who is passionate about detail-oriented user experiences and fast web engines. You will work across Next.js, Node.js, and PostgreSQL to deliver polished issue-tracking features. Requirements: 1-2 years of software engineering experience, solid foundations in TypeScript and databases.',
    skills: 'TypeScript, Next.js, React, Node.js, SQL, Tailwind CSS',
  },
  {
    title: 'Staff AI Solutions Architect',
    company: 'Google Cloud',
    location: 'Sunnyvale, CA (Hybrid)',
    salary: '$200,000 - $260,000',
    type: 'Full-time',
    description: 'Help enterprises design, train, and deploy large language models and machine learning pipelines on Google Cloud Platform. You will partner with Fortune 500 companies to engineer prompt architectures, fine-tuning scripts, and vector search strategies. Requirements: Deep experience in cloud infrastructure, AI models, and enterprise architecture.',
    skills: 'Cloud Infrastructure, GCP, LLMs, Vector Databases, Python, Architecture',
  },
];

async function main() {
  console.log('Seeding initial jobs...');
  for (const job of jobsData) {
    const existing = await prisma.job.findFirst({
      where: { title: job.title, company: job.company },
    });
    if (!existing) {
      await prisma.job.create({ data: job });
    }
  }
  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
