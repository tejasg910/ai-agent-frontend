"use client";

import { useState } from "react";
import Link from "next/link";
import {
  User,
  Calendar,
  Briefcase,
  MoreHorizontal,
  Tag,
  Phone,
  Mail,
  ChevronRight
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
import { useToast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";

export default function CandidateCard({ candidate }) {
  const router = useRouter();
  const { showError, showSuccess } = useToast();

  const formatTimeAgo = (dateString) => {
    return moment(dateString).fromNow();
  };

  const handleDelete = async () => {
    try {
      // Replace with actual delete candidate function
      // await deleteCandidate(candidate._id);
      showSuccess("Candidate deleted successfully");
    } catch (error) {
      showError(
        error?.response?.data?.message || "Error while performing action"
      );
    }
  };

  // Get candidate initials for avatar fallback
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  // Calculate skills match if ratings exist
  const skillsMatchPercentage =
    candidate.ratings && candidate.ratings.length > 0
      ? Math.round(
          (candidate.ratings.reduce((sum, item) => sum + item.rating, 0) /
            (candidate.ratings.length * 5)) *
            100
        )
      : 0;

  const statusConfig = {
    pending: {
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    },
    screening: {
      color: "bg-blue-100 text-blue-800 border-blue-200",
    },
    shortlisted: {
      color: "bg-green-100 text-green-800 border-green-200",
    },
    rejected: {
      color: "bg-red-100 text-red-800 border-red-200",
    },
    hired: {
      color: "bg-purple-100 text-purple-800 border-purple-200",
    },
    default: {
      color: "bg-gray-100 text-gray-800 border-gray-200",
    }
  };

  const config = statusConfig[candidate.status] || statusConfig.default;

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border-b border-orange-100 hover:bg-orange-50 transition-colors group">
      {/* Candidate Info Section */}
      <div className="flex items-center gap-3 mb-3 md:mb-0 md:w-2/5">
        <Avatar className="h-10 w-10 border-2 border-orange-200">
          <AvatarImage src={candidate.profile_image} alt={candidate.name} />
          <AvatarFallback className="bg-orange-100 text-orange-800">
            {getInitials(candidate.name)}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center">
            <h3 className="font-medium text-gray-900">{candidate.name}</h3>
            <Badge className={`ml-2 text-xs ${config.color}`}>
              {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
            </Badge>
            <Badge className="ml-2 bg-orange-100 text-orange-800 border-orange-200">
              {candidate.experience} yrs
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Mail className="h-3 w-3" />
            <span className="truncate max-w-xs">{candidate.email}</span>
          </div>
        </div>
      </div>

      {/* Skills & Details Section */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 text-sm md:w-2/5">
        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-orange-500" />
          <span className="text-gray-700">
            {candidate.jobAssignment ? "Assigned" : "Not assigned"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-orange-500" />
          <span className="text-gray-700 ">
            {candidate.available ? `${moment(candidate.available).format("MMM D, YYYY")}` : "Not Mentioned"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-orange-500" />
          <span className="text-gray-700 truncate">{candidate.phone}</span>
        </div>
        
        <div className="flex items-center col-span-2 md:col-span-3 gap-2">
          <Tag className="h-4 w-4 text-orange-500" />
          <div className="flex flex-wrap gap-1">
            {candidate.ratings && candidate.ratings.slice(0, 3).map((rating, index) => (
              <Badge
                key={index}
                className="bg-orange-50 text-orange-700 border border-orange-200 text-xs px-2 py-0 font-normal"
              >
                {rating.skill.name || "Skill"}: {rating.rating}/5
              </Badge>
            ))}
            {candidate.ratings && candidate.ratings.length > 3 && (
              <Badge className="bg-orange-50 text-orange-700 border border-orange-200 text-xs px-2 py-0 font-normal">
                +{candidate.ratings.length - 3} more
              </Badge>
            )}
            <Badge className="bg-orange-100 text-orange-800 border-orange-200 text-xs px-2 py-0">
              Match: {skillsMatchPercentage}%
            </Badge>
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
              onClick={() => router.push(`/dashboard/candidates/${candidate._id}`)}
              className="cursor-pointer"
            >
              <User className="h-4 w-4 mr-2 text-orange-500" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push(`/dashboard/candidates/edit/${candidate._id}`)}
              className="cursor-pointer"
            >
              <Calendar className="h-4 w-4 mr-2 text-orange-500" />
              Edit Candidate
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDelete}
              className="cursor-pointer text-red-600"
            >
              <Mail className="h-4 w-4 mr-2 text-red-500" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          asChild
          size="sm"
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          <Link href={`/dashboard/candidates/${candidate._id}`}>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}