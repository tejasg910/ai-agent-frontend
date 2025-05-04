"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  MapPin,
  FileText,
  AlertCircle,
  MoreHorizontal,
  User,
  Video,
  ChevronRight,
  DollarSign,
  Briefcase,
  Mail,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// Loading skeleton for list items

export function AppointmentListItem({ appointment }) {
  const router = useRouter();

  const statusConfig = {
    booked: {
      color: "bg-blue-100 text-blue-800 border-blue-200",
      hover: "hover:bg-blue-50",
    },
    completed: {
      color: "bg-green-100 text-green-800 border-green-200",
      hover: "hover:bg-green-50",
    },
    canceled: {
      color: "bg-red-100 text-red-800 border-red-200",
      hover: "hover:bg-red-50",
    },
    default: {
      color: "bg-gray-100 text-gray-800 border-gray-200",
      hover: "hover:bg-gray-50",
    },
  };

  // Handle the case when any of these objects might be null
  const candidate = appointment.candidate_id || {};
  const slot = appointment.slot_id || {};

  // Format date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (e) {
      return "Invalid date";
    }
  };

  // Format time from "HH:MM" string to "h:mm am/pm"
  const formatTime = (timeString) => {
    try {
      if (!timeString) return "";
      const [hours, minutes] = timeString.split(":").map(Number);
      const date = new Date();
      date.setHours(hours, minutes, 0, 0);
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch (e) {
      return timeString || "";
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

  const config = statusConfig[appointment.status] || statusConfig.default;

  // Calculate experience display
  const displayExperience = (years) => {
    if (years === undefined || years === null) return "N/A";
    if (years < 1) return "< 1 year";
    return `${years} ${years === 1 ? "year" : "years"}`;
  };

  // Format salary expectations
  const formatSalary = (amount) => {
    if (!amount) return "Not specified";

    // If it's a very large number (in the thousands or millions)
    if (amount >= 1000) {
      if (amount >= 1000000) {
        return `₹${(amount / 1000000).toFixed(2)}M`;
      }
      return `₹${(amount / 1000).toFixed(0)}K`;
    }

    return `₹${amount}`;
  };

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
            <h3 className="font-medium text-gray-900">
              {candidate.name || "Unknown Candidate"}
            </h3>
            <Badge className={`ml-2 text-xs ${config.color}`}>
              {appointment.status?.charAt(0).toUpperCase() +
                appointment.status?.slice(1) || "Unknown"}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Mail className="h-3 w-3" />
            <span className="truncate max-w-xs">
              {candidate.email || "No email"}
            </span>
          </div>
        </div>
      </div>

      {/* Interview Details Section */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 text-sm md:w-2/5">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-orange-500" />
          <span className="text-gray-700">{formatDate(slot.date)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-orange-500" />
          <span className="text-gray-700">{formatTime(slot.start_time)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-orange-500" />
          <span className="text-gray-700">
            {displayExperience(candidate.experience)}
          </span>
        </div>
        <div className="flex items-center gap-2 md:col-span-2">
          <Video className="h-4 w-4 text-orange-500" />
          <a
            href={appointment.meeting_link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 hover:underline truncate max-w-xs"
          >
            Meeting Link
          </a>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-orange-500" />
          <span className="text-gray-700">
            {formatSalary(candidate.expected_ctc)}
          </span>
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
              onClick={() => router.push(`/candidates/${candidate._id}`)}
              className="cursor-pointer"
            >
              <User className="h-4 w-4 mr-2 text-orange-500" />
              View Candidate
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => window.open(appointment.meeting_link, "_blank")}
              className="cursor-pointer"
            >
              <Video className="h-4 w-4 mr-2 text-orange-500" />
              Join Meeting
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                /* Implement reschedule logic */
              }}
              className="cursor-pointer"
            >
              <Calendar className="h-4 w-4 mr-2 text-orange-500" />
              Reschedule
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          asChild
          size="sm"
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          <Link href={`/dashboard/appointments/${appointment._id}`}>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
