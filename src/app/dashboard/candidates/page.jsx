"use client";

import { useState } from "react";
import Link from "next/link";
import CandidateCard from "@/components/candidates/candidate-card";
import { useGetAllCandidates } from "@/api/hooks/candidates/useGetAllCandidates";
import { Loader2 } from "lucide-react";

export default function CandidatesPage() {
  // const [candidates, setCandidates] = useState([
  //   {
  //     id: 1,
  //     name: 'John Smith',
  //     phone: '+1 (555) 123-4567',
  //     current_ctc: '80000',
  //     expected_ctc: '95000',
  //     notice_period: '30 days',
  //     experience: 5,
  //     appointments: 2
  //   },
  //   {
  //     id: 2,
  //     name: 'Sarah Johnson',
  //     phone: '+1 (555) 987-6543',
  //     current_ctc: '92000',
  //     expected_ctc: '110000',
  //     notice_period: '15 days',
  //     experience: 7,
  //     appointments: 1
  //   },
  //   {
  //     id: 3,
  //     name: 'Michael Brown',
  //     phone: '+1 (555) 456-7890',
  //     current_ctc: '75000',
  //     expected_ctc: '85000',
  //     notice_period: '60 days',
  //     experience: 3,
  //     appointments: 3
  //   }
  // ]);
  const {
    data: candidates,
    isLoading,
    isError,
    mutate,
  } = useGetAllCandidates();

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Candidates</h1>
        <Link
          href="/dashboard/candidates/new"
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Add New Candidate
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search candidates..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <div className="space-y-4">
          {candidates.map((candidate) => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))}
        </div>
      </div>
    </div>
  );
}
