"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  Calendar,
  MoreHorizontal,
  Tag,
  ChevronRight,
  MapPin,
  IndianRupee,
  Clock,
  Award,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import moment from "moment";
import { useDeleteJob } from "@/api/hooks/jobs/useDeleteJob";
import { useToast } from "@/hooks/useToast";

export default function JobCard({ job, fetchJobs }) {
  const router = useRouter();
  const { showError, showSuccess } = useToast();
  const { mutate: deleteJob, isLoading: deleting } = useDeleteJob();

  const formatTimeAgo = (dateString) => {
    return moment(dateString).fromNow();
  };

  const formatSalary = (range) => {
    if (!range || !range.min || !range.max) return "Not specified";
    
    const formatNumber = (num) => {
      if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + "M";
      } else if (num >= 1000) {
        return (num / 1000).toFixed(0) + "K";
      }
      return num;
    };
    
    return `${formatNumber(range.min)} - ${formatNumber(range.max)}`;
  };

  const getJobTypeLabel = (type) => {
    const types = {
      "onsite": "On-site",
      "remote": "Remote",
      "hybrid": "Hybrid"
    };
    return types[type] || type;
  };

  const handleDelete = async () => {
    try {
      await deleteJob(job._id);
      fetchJobs();
      showSuccess("Job deleted successfully");
    } catch (error) {
      showError(
        error?.response?.data?.message || "Error while performing action"
      );
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border-b border-orange-100 hover:bg-orange-50 transition-colors group">
      {/* Job Title and Status Section */}
      <div className="flex items-center gap-3 mb-3 md:mb-0 md:w-2/5">
        <Avatar className="h-10 w-10 border-2 border-orange-200">
          <AvatarFallback className="bg-orange-100 text-orange-800">
            <Briefcase className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center flex-wrap gap-1">
            <h3 className="font-medium text-gray-900">{job.title}</h3>
            <Badge className="bg-orange-100 text-orange-800 border-orange-200 text-xs">
              Active
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="h-3 w-3" />
            <span>Posted {formatTimeAgo(job.created_at)}</span>
          </div>
        </div>
      </div>

      {/* Job Details Section */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 text-sm md:w-2/5">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-orange-500" />
          <span className="text-gray-700">{job.location || "Not specified"}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-orange-500" />
          <span className="text-gray-700">{getJobTypeLabel(job.job_type)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Award className="h-4 w-4 text-orange-500" />
          <span className="text-gray-700">{job.min_experience}+ yrs exp</span>
        </div>
        <div className="flex items-center gap-2">
          <IndianRupee className="h-4 w-4 text-orange-500" />
          <span className="text-gray-700">{formatSalary(job.ctc_range)}</span>
        </div>

        <div className="flex items-center col-span-2 md:col-span-3 gap-2">
          <Tag className="h-4 w-4 text-orange-500" />
          <div className="flex flex-wrap gap-1">
            {job.skills &&
              job.skills.slice(0, 3).map((skill, index) => (
                <Badge
                  key={index}
                  className="bg-orange-50 text-orange-700 border border-orange-200 text-xs px-2 py-0 font-normal"
                >
                  {skill.name || skill}
                </Badge>
              ))}
            {job.skills && job.skills.length > 3 && (
              <Badge className="bg-orange-50 text-orange-700 border border-orange-200 text-xs px-2 py-0 font-normal">
                +{job.skills.length - 3} more
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Actions Section */}
      <div className="flex justify-end items-center mt-3 md:mt-0 md:w-1/5 gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => router.push(`/dashboard/jobs/${job._id}`)}
              className="cursor-pointer"
            >
              <Briefcase className="h-4 w-4 mr-2 text-orange-500" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push(`/dashboard/jobs/edit/${job._id}`)}
              className="cursor-pointer"
            >
              <Briefcase className="h-4 w-4 mr-2 text-orange-500" />
              Edit Job
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDelete}
              disabled={deleting}
              className="cursor-pointer text-red-600"
            >
              <Briefcase className="h-4 w-4 mr-2 text-red-500" />
              {deleting ? "Deleting..." : "Delete"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          asChild
          size="sm"
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          <Link href={`/dashboard/jobs/${job._id}`}>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}