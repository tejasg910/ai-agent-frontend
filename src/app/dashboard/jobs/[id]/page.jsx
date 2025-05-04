"use client";
import { useGetJob } from "@/api/hooks/jobs/useGetJob";
import ViewJob from "@/components/jobs/view-job";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import React from "react";

const page = () => {
  const { id } = useParams();
  const { data: job, isLoading, isError, mutate } = useGetJob(id);
  console.log(job, "job data");
  if (isLoading) {
    return (
      <div className="flex justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (isError || !job) {
    return <div>Error while fetching</div>;
  }
  return (
    <div>
      <ViewJob job={job} />
    </div>
  );
};

export default page;
