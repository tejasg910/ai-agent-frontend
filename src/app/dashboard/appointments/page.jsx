// src/app/appointments/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useGetAllAppointments } from "@/api/hooks/appointments/useGetAllAppointments";
import Link from "next/link";

// Import shadcn components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Clock,
  MapPin,
  FileText,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Plus,
  Mail,
  Briefcase,
  Video,
  DollarSign,
  MoreHorizontal,
  User,
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import { AppointmentListItem } from "@/components/appointments/AppointmentList";
import { AppointmentListItemSkeleton } from "@/components/appointments/AppointmentListSkeleton";
export default function AppointmentsPage() {
  const [currentTab, setCurrentTab] = useState("upcoming");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 6;

  // Reset to page 1 when tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [currentTab]);

  const {
    data: appointmentsResponse,
    isLoading,
    isError,
    mutate,
  } = useGetAllAppointments({ page: currentPage });
  console.log(currentPage, "this sis ");
  // Extract the actual data array from the response
  const appointmentsData = appointmentsResponse?.data || [];

  // Use the counts from the API response if available
  const appointmentCounts = appointmentsResponse?.counts || {
    total: appointmentsData.length || 0,
    upcoming: 0,
    past: 0,
  };

  console.log(appointmentsResponse, "This is appointment data");

  // Function to filter appointments by tab
  const filterAppointmentsByTab = (appointments, tab) => {
    if (!appointments || !Array.isArray(appointments)) return [];

    const now = new Date();

    return appointments.filter((appointment) => {
      // Check if slot_id exists and has required fields
      if (!appointment.slot_id || !appointment.slot_id.date) return false;

      // Create date from slot date and time
      const appointmentDate = new Date(appointment.slot_id.date);
      const [hours, minutes] = (appointment.slot_id.start_time || "00:00")
        .split(":")
        .map(Number);
      appointmentDate.setHours(hours, minutes, 0, 0);

      if (tab === "upcoming") {
        return appointmentDate >= now && appointment.status !== "canceled";
      } else if (tab === "past") {
        return appointmentDate < now || appointment.status === "completed";
      } else {
        return true; // All
      }
    });
  };

  // Count appointments by tab
  const upcomingAppointments = appointmentsData
    ? filterAppointmentsByTab(appointmentsData, "upcoming")
    : [];
  const pastAppointments = appointmentsData
    ? filterAppointmentsByTab(appointmentsData, "past")
    : [];
  const allAppointments = appointmentsData || [];

  // Get current tab's appointments
  const currentTabAppointments = (() => {
    switch (currentTab) {
      case "upcoming":
        return upcomingAppointments;
      case "past":
        return pastAppointments;
      default:
        return allAppointments;
    }
  })();

  // Sort appointments
  const sortedAppointments = [...currentTabAppointments].sort((a, b) => {
    const dateA = new Date(a.slot_id?.date || 0);
    const dateB = new Date(b.slot_id?.date || 0);

    const [hoursA, minutesA] = (a.slot_id?.start_time || "00:00")
      .split(":")
      .map(Number);
    const [hoursB, minutesB] = (b.slot_id?.start_time || "00:00")
      .split(":")
      .map(Number);

    dateA.setHours(hoursA, minutesA, 0, 0);
    dateB.setHours(hoursB, minutesB, 0, 0);

    return currentTab === "upcoming" ? dateA - dateB : dateB - dateA;
  });

  // Paginate appointments
  const paginatedAppointments = sortedAppointments.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const totalPages = appointmentsResponse?.pagination?.pages;

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
        {/* <Button
          asChild
          className="bg-orange-500 hover:bg-orange-600 text-white shadow-sm"
        >
          <Link href="/appointments/new">
            <Plus className="mr-2 h-4 w-4" />
            Schedule New
          </Link>
        </Button> */}
      </div>

      <Card className="overflow-hidden border-orange-100 shadow-md">
        <CardHeader className="pb-0 border-b border-orange-100">
          <div className="flex space-x-1 overflow-x-auto pb-2">
            <Button
              onClick={() => setCurrentTab("upcoming")}
              variant="ghost"
              className={`rounded-full px-4 text-sm font-medium ${
                currentTab === "upcoming"
                  ? "bg-orange-500 text-white hover:bg-orange-600"
                  : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
              }`}
            >
              Upcoming
              <Badge
                variant="outline"
                className={`ml-2 ${
                  currentTab === "upcoming"
                    ? "bg-white text-orange-600 border-white"
                    : "bg-gray-100"
                }`}
              >
                {appointmentCounts.upcoming || upcomingAppointments.length}
              </Badge>
            </Button>
            <Button
              onClick={() => setCurrentTab("past")}
              variant="ghost"
              className={`rounded-full px-4 text-sm font-medium ${
                currentTab === "past"
                  ? "bg-orange-500 text-white hover:bg-orange-600"
                  : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
              }`}
            >
              Past
              <Badge
                variant="outline"
                className={`ml-2 ${
                  currentTab === "past"
                    ? "bg-white text-orange-600 border-white"
                    : "bg-gray-100"
                }`}
              >
                {appointmentCounts.past || pastAppointments.length}
              </Badge>
            </Button>
            <Button
              onClick={() => setCurrentTab("all")}
              variant="ghost"
              className={`rounded-full px-4 text-sm font-medium ${
                currentTab === "all"
                  ? "bg-orange-500 text-white hover:bg-orange-600"
                  : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
              }`}
            >
              All
              <Badge
                variant="outline"
                className={`ml-2 ${
                  currentTab === "all"
                    ? "bg-white text-orange-600 border-white"
                    : "bg-gray-100"
                }`}
              >
                {appointmentCounts.total || allAppointments.length}
              </Badge>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <AppointmentListItemSkeleton key={i} />
                ))}
            </div>
          ) : isError ? (
            <Alert
              variant="destructive"
              className="my-6 border-red-300 bg-red-50"
            >
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-600">
                Error loading appointments. Please try again later.
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => mutate()}
                  className="ml-4 border-red-300 text-red-600 hover:bg-red-100"
                >
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          ) : (
            <>
              {sortedAppointments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="mb-4 rounded-full bg-orange-100 p-3">
                    <Calendar className="h-6 w-6 text-orange-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">
                    No appointments found
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    No appointments are currently available in this category.
                  </p>
                </div>
              ) : (
                <>
                  <div className="">
                    {sortedAppointments.map((appointment) => (
                      <AppointmentListItem
                        key={appointment._id}
                        appointment={appointment}
                      />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="mt-8 flex justify-center">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={() =>
                                setCurrentPage((p) => Math.max(1, p - 1))
                              }
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
                                (page >= currentPage - 1 &&
                                  page <= currentPage + 1)
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
                                setCurrentPage((p) =>
                                  Math.min(totalPages, p + 1)
                                )
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
                </>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
