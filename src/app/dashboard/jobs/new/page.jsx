"use client";

import { useRouter } from "next/navigation";

import JobForm from "@/components/jobs/job-form";

import { useCreateJob } from "@/api/hooks/jobs/useCreateJob";

export default function NewJobPage() {
  const router = useRouter();
  const { mutate, isLoading, data, isError } = useCreateJob();
  const handleSubmit = async (jobData) => {
    try {
      await mutate(jobData);
      console.log("Job created:", jobData);
      router.push("/dashboard/jobs");
    } catch (error) {
      console.error("Error creating job:", error);
      alert("Failed to create job. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Create New Job</h1>

      <div className="bg-white shadow rounded-lg p-6">
        <JobForm onSubmit={handleSubmit} isSubmitting={isLoading} />
      </div>
    </div>
  );
}
