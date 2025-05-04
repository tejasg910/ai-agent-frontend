"use client";

import { useState } from "react";
import Link from "next/link";
import JobCard from "@/components/jobs/job-card";
import { useGetAllJobs } from "@/api/hooks/jobs/useGetAllJobs";
import { Loader2 } from "lucide-react";
import ErrorAlert from "@/components/common/Error";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function JobsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 6;
  const {
    data: jobsData,
    isLoading,
    isError,
    mutate,
  } = useGetAllJobs({ page: currentPage });

  console.log(currentPage, "this is current page");
  const totalPages = jobsData?.totalPages;
  const jobs = jobsData?.data || [];
  if (isLoading) {
    return (
      <div className="flex justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  // if (isError) {
  //   return <ErrorAlert />;
  // }

  // if (!jobs || jobs.length === 0) {
  //   return (
  //     <div className="flex flex-col items-center justify-center h-full">
  //       <h2 className="text-lg font-semibold text-gray-700">No jobs found</h2>
  //       <Link
  //         href="/dashboard/jobs/new"
  //         className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
  //       >
  //         Add New Job
  //       </Link>
  //     </div>
  //   );
  // }
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
        {/* <div className="mb-4">
          <input
            type="text"
            placeholder="Search jobs..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div> */}

        <div className="space-y-4">

        {isError ? (
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">Error loading jobs</p>
              <Button
                onClick={() => mutate()}
                variant="outline"
                className="border-orange-300 text-orange-700 hover:bg-orange-50"
              >
                Retry
              </Button>
            </div>
          ) : jobs.length >  0 ? 
          jobs.map((job) => (
            <JobCard key={job.id} job={job} fetchJobs={mutate} />
          )) :     <div className="text-center py-16 text-gray-500">
          <p>No jobs found.</p>
        </div>}

          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className={
                        currentPage !== 1 ? "hover:text-orange-500" : ""
                      }
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(
                      (page) =>
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                    )
                    .map((page, index, array) => (
                      <PaginationItem key={page}>
                        {index > 0 && array[index - 1] !== page - 1 ? (
                          <div className="px-2">...</div>
                        ) : null}
                        <PaginationLink
                          isActive={currentPage === page}
                          onClick={() => setCurrentPage(page)}
                          className={
                            currentPage === page
                              ? "bg-orange-500 text-white hover:bg-orange-600"
                              : "hover:text-orange-500"
                          }
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className={
                        currentPage !== totalPages
                          ? "hover:text-orange-500"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
