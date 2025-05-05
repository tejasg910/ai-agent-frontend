"use client";

import { useState } from "react";
import Link from "next/link";
import { useGetAllCandidates } from "@/api/hooks/candidates/useGetAllCandidates";
import { useStartCall } from "@/api/hooks/voice/useStartVoiceCall";
import CandidateCard from "@/components/candidates/candidate-card";

// Import shadcn components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Phone,
  UserPlus,
  Search,
  Filter,
  Briefcase,
  CopyIcon,
  CopyPlusIcon,
  Copy,
  ClipboardCheck,
  Lock,
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverTrigger,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useCopyForm } from "@/api/hooks/form/useCopyForm";
export default function CandidatesPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [jobOpen, setJobOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [copyLink, setCopyLink] = useState(false);
  const limit = 10;
  const [jobFilter, setJobFilter] = useState(null);

  // Parse filters based on active tab
  const filters = {
    page: currentPage,
    limit,
    status: statusFilter === "all" ? undefined : statusFilter,
    source: activeTab === "all" ? undefined : activeTab,
    jobId: jobFilter,
  };

  const {
    data: candidates,
    totalCounts,
    pagination,
    isLoading,
    isError,
    mutate,
  } = useGetAllCandidates(filters);
  const { mutate: startCall } = useStartCall();
  const { mutate: copy } = useCopyForm();

  // Handle tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset to first page when tab changes
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Filter candidates based on search term (client-side filtering for instant results)
  const filteredCandidates =
    candidates?.filter(
      (candidate) =>
        candidate.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.phone?.includes(searchTerm)
    ) || [];

  if (isLoading && !candidates?.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-orange-500" />
      </div>
    );
  }

 
  // Filter jobs based on search term


  const handelCopy = async () => {
    const data = await copy();
    if (data?.success) {
      setCopyLink(true);
      setTimeout(() => {
        setCopyLink(false);
      }, 5000);
    }

    console.log(data, "this is data from copy form");
    navigator.clipboard.writeText(data?.url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Candidates</h1>
        <div className="flex gap-3">
          <Button
            onClick={handelCopy}
            variant="outline"
            size="sm"
            className="border-orange-300 text-orange-700 hover:bg-orange-50 cursor-pointer"
          >
            {copyLink ? <ClipboardCheck /> : <Copy className="mr-2 h-4 w-4" />}
            {copyLink ? "Copied!" : "Copy Link"}
          </Button>
          <Button 
    disabled={true}
    variant="outline"
    size="sm"
    className="border-orange-300 text-gray-400 hover:bg-orange-50 cursor-not-allowed opacity-70 flex items-center"
  >
    <Phone className="mr-2 h-4 w-4" />
    <Lock className="mr-2 h-3 w-3" />
    Start Calling
  </Button>

          <Button
            asChild
            className="bg-orange-500 hover:bg-orange-600 text-white shadow-sm"
          >
            <Link href="/dashboard/candidates/new">
              <UserPlus className="mr-2 h-4 w-4" />
              Add New Candidate
            </Link>
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden border-orange-100 shadow-md">
        <CardHeader className="pb-0 border-b border-orange-100">
          <div className="flex space-x-1 overflow-x-auto pb-2">
            <Button
              onClick={() => handleTabChange("all")}
              variant={activeTab === "all" ? "default" : "ghost"}
              className={`rounded-full px-4 text-sm font-medium ${
                activeTab === "all"
                  ? "bg-orange-500 text-white hover:bg-orange-600"
                  : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
              }`}
            >
              All
              <Badge
                variant="outline"
                className={`ml-2 ${
                  activeTab === "all"
                    ? "bg-white text-orange-600 border-white"
                    : "bg-gray-100"
                }`}
              >
                {totalCounts?.all || 0}
              </Badge>
            </Button>
            <Button
              onClick={() => handleTabChange("manual")}
              variant={activeTab === "manual" ? "default" : "ghost"}
              className={`rounded-full px-4 text-sm font-medium ${
                activeTab === "manual"
                  ? "bg-orange-500 text-white hover:bg-orange-600"
                  : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
              }`}
            >
              Manual Entry
              <Badge
                variant="outline"
                className={`ml-2 ${
                  activeTab === "manual"
                    ? "bg-white text-orange-600 border-white"
                    : "bg-gray-100"
                }`}
              >
                {totalCounts?.manual || 0}
              </Badge>
            </Button>
            <Button
              onClick={() => handleTabChange("form")}
              variant={activeTab === "form" ? "default" : "ghost"}
              className={`rounded-full px-4 text-sm font-medium ${
                activeTab === "form"
                  ? "bg-orange-500 text-white hover:bg-orange-600"
                  : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
              }`}
            >
              Form Submissions
              <Badge
                variant="outline"
                className={`ml-2 ${
                  activeTab === "form"
                    ? "bg-white text-orange-600 border-white"
                    : "bg-gray-100"
                }`}
              >
                {totalCounts?.form || 0}
              </Badge>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Search and filters */}
          <div className="flex  mb-6 justify-end">
            {/* <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search candidates by name or phone..."
                className="pl-9 border-orange-200 focus-visible:ring-orange-500"
              />
            </div> */}
            <div className="w-48">
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="border-orange-200 focus:ring-orange-500">
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4 text-orange-500" />
                    <SelectValue placeholder="Filter status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="screening">Screening</SelectItem>
                  <SelectItem value="shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="hired">Hired</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* <div className="w-48">
              <div className="space-y-3">
                <Popover open={jobOpen} onOpenChange={setJobOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-orange-200 focus:ring-orange-500 flex items-center"
                    >
                      <Filter className="mr-2 h-4 w-4 text-orange-500 font-normal" />
                      {selectedJob ? (
                        <span className="font-normal">{selectedJob.title}</span>
                      ) : (
                        <span className=" font-normal">
                          Select a job position
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput
                        placeholder="Search jobs..."
                        className="h-9"
                        value={searchTerm}
                        onValueChange={setSearchTerm}
                      />
                      <CommandList>
                        <CommandEmpty>No jobs found</CommandEmpty>
                        <CommandGroup>
                          {filteredJobs.map((job) => (
                            <CommandItem
                              key={job._id}
                              onSelect={() => handleSelectJob(job)}
                              className="flex items-center justify-between"
                            >
                              {job.title}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div> */}
          </div>

          {/* Candidates List */}
          {isError ? (
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">Error loading candidates</p>
              <Button
                onClick={() => mutate()}
                variant="outline"
                className="border-orange-300 text-orange-700 hover:bg-orange-50"
              >
                Retry
              </Button>
            </div>
          ) : filteredCandidates.length > 0 ? (
            <div className="space-y-4">
              {filteredCandidates.map((candidate) => (
                <CandidateCard key={candidate.id} candidate={candidate} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500">
              <p>No candidates found matching your criteria.</p>
            </div>
          )}

          {/* Pagination */}
          {pagination?.totalPages > 1 && (
            <div className="mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationLink
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={
                        currentPage !== 1 ? "hover:text-orange-500" : ""
                      }
                    >
                      Previous
                    </PaginationLink>
                  </PaginationItem>

                  {/* Page numbers */}
                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1
                  )
                    .filter(
                      (page) =>
                        page === 1 ||
                        page === pagination.totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                    )
                    .map((page, index, array) => {
                      // Add ellipsis where needed
                      if (index > 0 && array[index - 1] !== page - 1) {
                        return (
                          <PaginationItem key={`ellipsis-${page}`}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }

                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            isActive={currentPage === page}
                            onClick={() => handlePageChange(page)}
                            className={
                              currentPage === page
                                ? "bg-orange-500 text-white hover:bg-orange-600"
                                : "hover:text-orange-500"
                            }
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}

                  <PaginationItem>
                    <PaginationLink
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === pagination.totalPages}
                      className={
                        currentPage !== pagination.totalPages
                          ? "hover:text-orange-500"
                          : ""
                      }
                    >
                      Next
                    </PaginationLink>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
