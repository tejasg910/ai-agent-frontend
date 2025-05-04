"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import JobForm from "@/components/jobs/job-form";
import { useGetJob } from "@/api/hooks/jobs/useGetJob";
import { useUpdateJob } from "@/api/hooks/jobs/useUpdateJob";
import ErrorAlert from "@/components/common/Error";
import { useToast } from "@/hooks/useToast";

export default function EditJob() {
  const { id } = useParams();

  const {showError, showSuccess} = useToast()
  const { data: job, isLoading, isError, mutate } = useGetJob(id);
  const {
    isLoading: isUpdating,

    mutate: updateJob,
  } = useUpdateJob(id);
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    setError(null);

    try {
      console.log("came in update api ");
      await updateJob(formData);
      showSuccess("Job updated successfully")
      // router.push("/dashboard/jobs");
      // router.refresh();
    } catch (err) {
      console.log(err, "this is error in update job ");
      showError(err?.response?.data?.message || "Error while updating job")
      setError(err.message);
    } finally {
    }
  };



if(isLoading){
  return <div><Loader2 className="animate-spin"/></div>
}


  if (isError) {
    return <ErrorAlert />;
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

      <JobForm job={job} onSubmit={handleSubmit} isSubmitting={isUpdating} />
    </div>
  );
}
