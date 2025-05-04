"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, DivideIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import JobForm from "@/components/jobs/job-form";
import { useGetJob } from "@/api/hooks/jobs/useGetJob";
import { useGetCandidate } from "@/api/hooks/candidates/useGetCandidate";
import { useUpdateCandidate } from "@/api/hooks/candidates/useUpdateCandidate";
import CandidateForm from "@/components/candidates/candidate-form";

export default function EditCandidate() {
  const { id } = useParams();
  const { data: candidate, isLoading, isError, mutate } = useGetCandidate(id);

  console.log(candidate, "this is candidate");
  const {
    isLoading: isUpdating,

    mutate: updateCandidate,
  } = useUpdateCandidate(id);
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    setError(null);

    try {
      await updateCandidate(formData);

      router.push("/dashboard/jobs");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
    }
  };

  if (isLoading) {
    return (
      <div>
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (isError) {
    return <div>Error while fetch cadndiate</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <Link href="/dashboard/jobs">
          <Button variant="ghost" className="px-0 text-gray-600">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Jobs
          </Button>
        </Link>
      </div>

      <div className="space-y-2 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Job</h1>
        <p className="text-gray-600">
          Update the job details and requirements.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <CandidateForm
        candidate={candidate}
        onSubmit={handleSubmit}
        isSubmitting={isUpdating}
      />
    </div>
  );
}
