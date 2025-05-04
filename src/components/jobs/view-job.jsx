"use client";

import {
  ArrowLeft,
  Briefcase,
  Calendar,
  Users,
  Edit2,
  ChevronRight,
  Share2,
  MapPin,
  Clock,
  IndianRupee,
  Globe,
  Award,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

export default function ViewJob({ job }) {
  console.log(job, "job data");
  // Format date helper function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format currency helper function
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Progress calculation - adding safeguards
  const candidates = job.candidates || 0;
  const appointments = job.appointments || 0;
  const progressPercentage =
    candidates > 0 ? Math.min((appointments / candidates) * 100, 100) : 0;

  // Create job info items for consistent display
  const jobInfoItems = [
    {
      icon: <MapPin className="h-4 w-4 text-orange-500" />,
      label: "Location",
      value: job.location || "Not specified",
    },
    {
      icon: <Clock className="h-4 w-4 text-orange-500" />,
      label: "Type",
      value: job.job_type
        ? job.job_type.charAt(0).toUpperCase() + job.job_type.slice(1)
        : "Not specified",
    },
    {
      icon: <Award className="h-4 w-4 text-orange-500" />,
      label: "Experience",
      value: job.min_experience
        ? `${job.min_experience}+ years`
        : "Not specified",
    },
    {
      icon: <IndianRupee className="h-4 w-4 text-orange-500" />,
      label: "Compensation",
      value: job.ctc_range
        ? `${formatCurrency(job.ctc_range.min)} - ${formatCurrency(
            job.ctc_range.max
          )}`
        : "Not specified",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <Link href="/dashboard/jobs">
          <Button
            variant="ghost"
            className="px-0 text-gray-600 hover:text-orange-600 hover:bg-transparent"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Jobs
          </Button>
        </Link>

        <div className="flex space-x-2">
          <Link href={`/dashboard/jobs/edit/${job._id}`}>
            <Button
              variant="outline"
              className="text-orange-600 border-orange-300 hover:bg-orange-50"
            >
              <Edit2 className="mr-2 h-4 w-4" />
              Edit Job
            </Button>
          </Link>
          <Button
            variant="outline"
            className="text-gray-700 border-gray-300 hover:bg-gray-100"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden border-gray-200 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-orange-100 to-orange-50 p-6 border-b border-gray-100">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="bg-orange-500 p-2 rounded-lg">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-2xl font-semibold text-gray-900">
                {job.title}
              </CardTitle>
              <Badge className="bg-green-100 text-green-800 ml-2">Active</Badge>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Posted on {formatDate(job.created_at)}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Job Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 bg-orange-50 p-4 rounded-lg">
            {jobInfoItems.map((item, index) => (
              <div key={index} className="flex items-center">
                <div className="bg-white p-2 rounded-md shadow-sm mr-3">
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs text-gray-500">{item.label}</p>
                  <p className="font-medium text-gray-800">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                <span className="bg-orange-100 p-1 rounded mr-2">
                  <Globe className="h-4 w-4 text-orange-600" />
                </span>
                Job Description
              </h3>
              <p className="text-gray-700 whitespace-pre-line pl-2 border-l-2 border-orange-200">
                {job.description}
              </p>
            </div>

            <Separator className="bg-orange-100" />

            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                <span className="bg-orange-100 p-1 rounded mr-2">
                  <Award className="h-4 w-4 text-orange-600" />
                </span>
                Requirements
              </h3>
              <p className="text-gray-700 whitespace-pre-line pl-2 border-l-2 border-orange-200">
                {job.requirements}
              </p>
            </div>

            <Separator className="bg-orange-100" />

            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                <span className="bg-orange-100 p-1 rounded mr-2">
                  <Award className="h-4 w-4 text-orange-600" />
                </span>
                Skills Required
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.skills &&
                  job.skills.map((skill, index) => (
                    <Badge
                      key={index}
                      className="bg-orange-50 text-orange-700 font-normal py-1 px-3 hover:bg-orange-100 border border-orange-200"
                    >
                      {skill.name || skill}
                    </Badge>
                  ))}
              </div>
            </div>

            <Separator className="bg-orange-100" />
            {/* 
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                <span className="bg-orange-100 p-1 rounded mr-2">
                  <Users className="h-4 w-4 text-orange-600" />
                </span>
                Application Statistics
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-white p-3 rounded-md shadow-sm">
                    <div className="text-gray-500 text-sm mb-1">Candidates</div>
                    <div className="font-semibold text-xl">{candidates || 0}</div>
                  </div>
                  <div className="bg-white p-3 rounded-md shadow-sm">
                    <div className="text-gray-500 text-sm mb-1">Appointments</div>
                    <div className="font-semibold text-xl">{appointments || 0}</div>
                  </div>
                  <div className="bg-white p-3 rounded-md shadow-sm">
                    <div className="text-gray-500 text-sm mb-1">Progress</div>
                    <div className="font-semibold text-xl">{Math.round(progressPercentage)}%</div>
                  </div>
                </div>
                <Progress 
                  value={progressPercentage} 
                  className="h-2" 
                  indicatorClassName="bg-gradient-to-r from-orange-400 to-orange-500"
                />
              </div>
            </div> */}
          </div>
        </CardContent>

        <CardFooter className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between">
          <Button
            variant="default"
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            <Users className="mr-2 h-4 w-4" />
            View Candidates
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>

          <div className="text-sm text-gray-500">
            Job ID: {job._id.substring(job._id.length - 8)}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
