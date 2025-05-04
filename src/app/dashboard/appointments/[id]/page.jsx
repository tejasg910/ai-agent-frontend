"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  CalendarClock,
  User,
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Star,
  Video,
  RefreshCw,
  ArrowLeft,
  Mail,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAppointment } from "@/api/hooks/appointments/useGetAppointment";
import { useUpdateAppointmentStatus } from "@/api/hooks/appointments/useUpdateAppointmentStatus";

export default function AppointmentDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("details");
  const { mutate: updateStatus } = useUpdateAppointmentStatus(id);
  const {
    data: appointment,
    isLoading,
    isError,
    mutate,
  } = useGetAppointment(id);
  console.log(appointment, "Tis sappointment");
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <Card className="shadow-lg border-orange-200 border-2">
          <CardHeader className="bg-orange-50">
            <Skeleton className="h-8 w-1/3" />
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !appointment) {
    return (
      <div className="container mx-auto p-6">
        <Card className="shadow-lg border-red-200 border-2">
          <CardHeader className="bg-red-50">
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-red-500 mb-4">
              Appointment not found or error loading data.
            </p>
            <Button
              variant="outline"
              className="border-orange-500 text-orange-600 hover:bg-orange-50"
              onClick={() => router.push("/dashboard/appointments")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Appointments
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const candidateData = appointment.candidate_id;
  const slotData = appointment.slot_id;

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            className="mr-4 text-orange-600 hover:bg-orange-50"
            onClick={() => router.push("/dashboard/appointments")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">
            Appointment Details
          </h1>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="border-orange-500 text-orange-600 hover:bg-orange-50"
            onClick={() => mutate()}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          {/* <Button
            className="bg-orange-500 hover:bg-orange-600 text-white"
            onClick={() => router.push(`/appointments/edit/${id}`)}
          >
            Edit Appointment
          </Button> */}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Appointment Info */}
        <Card className="lg:col-span-2 shadow-md border-orange-100 hover:border-orange-200 transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl text-gray-800">
                Interview Details
              </CardTitle>
              <Badge className="bg-orange-500 hover:bg-orange-600">
                {appointment.status.charAt(0).toUpperCase() +
                  appointment.status.slice(1)}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CalendarClock className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">{formatDate(slotData.date)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="font-medium">
                      {slotData.start_time} - {slotData.end_time}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Video className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-500">Meeting Link</p>
                    <a
                      href={appointment.meeting_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-600 hover:text-orange-700 underline font-medium"
                    >
                      Join Meeting
                    </a>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-500">Interviewer</p>
                    <p className="font-medium">
                      {slotData.interviewer_id?.name || "Not assigned"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-500">Created At</p>
                    <p className="font-medium">
                      {new Date(appointment.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Candidate Info Card */}
        <Card className="shadow-md border-orange-100 hover:border-orange-200 transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200">
            <CardTitle className="text-xl text-gray-800">Candidate</CardTitle>
          </CardHeader>

          <CardContent className="p-6">
            <div className="mb-4 flex items-center">
              <div className="h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 text-xl font-bold mr-4">
                {candidateData.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-lg">{candidateData.name}</h3>
                <p className="text-gray-500 text-sm">
                  {candidateData.experience} years experience
                </p>
              </div>
            </div>

            <div className="space-y-3 mt-6">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-orange-500" />
                <p className="text-sm">{candidateData.email}</p>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-orange-500" />
                <p className="text-sm">{candidateData.phone}</p>
              </div>

              <div className="flex items-center space-x-3">
                <DollarSign className="h-4 w-4 text-orange-500" />
                <div>
                  <p className="text-sm">
                    ₹{candidateData.current_ctc.toLocaleString()} → ₹
                    {candidateData.expected_ctc.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    Current → Expected CTC
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-orange-500" />
                <p className="text-sm capitalize">
                  {candidateData.location_preference}
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-orange-500" />
                <div>
                  <p className="text-sm">{candidateData.notice_period} days</p>
                  <p className="text-xs text-gray-500">Notice Period</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <CalendarClock className="h-4 w-4 text-orange-500" />
                <div>
                  <p className="text-sm">
                    {new Date(candidateData.available).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-500">Available From</p>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="bg-orange-50 p-4 border-t border-orange-100">
            <Button
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              onClick={() => router.push(`/candidates/${candidateData._id}`)}
            >
              View Full Profile
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Skills Section */}
      <Card className="mt-6 shadow-md border-orange-100 hover:border-orange-200 transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200">
          <CardTitle className="text-xl text-gray-800">
            Skills & Ratings
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {candidateData.ratings.map((rating) => (
              <div
                key={rating._id}
                className="bg-orange-50 p-4 rounded-lg border border-orange-100"
              >
                <p className="mb-2 font-medium text-gray-700">
                  {rating?.skill?.name}
                </p>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < rating.rating
                          ? "text-orange-500 fill-orange-500"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional Actions */}
      <div className="mt-6 flex justify-end space-x-4">
        <Button
          disalbed={appointment?.status === "canceled"}
          onClick={() => updateStatus({ status: "canceled" })}
          variant="outline"
          className="border-red-500 text-red-600 hover:bg-red-50"
        >
          {appointment?.status === "canceled"
            ? "Canceled"
            : "Cancel Appointment"}
        </Button>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white">
          Reschedule
        </Button>
      </div>
    </div>
  );
}
