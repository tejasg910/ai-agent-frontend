'use client';

import { useState } from 'react';
import Link from 'next/link';
import JobCard from '@/components/jobs/job-card';

export default function JobsPage() {
  const [jobs, setJobs] = useState([
    { 
      id: 1, 
      title: 'Frontend Developer', 
      description: 'We are looking for a skilled Frontend Developer with React experience.',
      requirements: 'React, Next.js, Tailwind CSS, 3+ years of experience',
      created_at: '2025-04-10T12:00:00Z',
      candidates: 12,
      appointments: 8
    },
    { 
      id: 2, 
      title: 'Backend Engineer', 
      description: 'Backend engineer position for our growing engineering team.',
      requirements: 'Node.js, Express, MongoDB, 2+ years of experience',
      created_at: '2025-04-12T10:00:00Z',
      candidates: 8,
      appointments: 5
    },
    { 
      id: 3, 
      title: 'UI/UX Designer', 
      description: 'Looking for a creative UI/UX designer to join our product team.',
      requirements: 'Figma, Adobe XD, User Research, 3+ years of experience',
      created_at: '2025-04-15T09:00:00Z',
      candidates: 6,
      appointments: 3
    }
  ]);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
        <Link
          href="/dashboard/jobs/new"
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Add New Job
        </Link>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search jobs..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
        
        <div className="space-y-4">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </div>
  );
}