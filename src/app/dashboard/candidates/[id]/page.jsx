"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useGetCandidate } from "@/api/hooks/candidates/useGetCandidate";
import ViewCandidate from "@/components/candidates/candidate-view";
import { useGetAppointmentByCandidate } from "@/api/hooks/appointments/useGetAppointbyCandidate";
import { AppointmentListItem } from "@/components/appointments/AppointmentList";
import SlotSelectionFormCandidate from "@/components/candidates/book-slot";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export default function CandidateDetailPage() {
  const { id } = useParams();
  // const [candidate, setCandidate] = useState(null);
  // const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");
  const [currentPage, setCurrentPage] = useState(1);
  const [openShedule, setOpenSchedule] = useState(false);
  const itemsPerPage = 10; // Number of appointments per page
  const {
    data: candidate,
    isLoading: loading,
    isError,
    mutate,
  } = useGetCandidate(id);

  console.log(candidate, "This is candidate data");

  const { data: appointmentData, isLoading: loadingAppointments } =
    useGetAppointmentByCandidate(id, currentPage, itemsPerPage);
  const appointment = appointmentData?.appointments;
  console.log(appointmentData, "This s appointment");

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium text-gray-900">
          Candidate not found
        </h2>
        <Link
          href="/dashboard/candidates"
          className="mt-4 inline-block text-orange-500 hover:text-orange-600"
        >
          Back to Candidates
        </Link>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const totalItems = appointment ? appointment.length : 0;
  const totalPages = appointmentData?.totalPages;
  const paginatedAppointments = appointment
    ? appointment.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    : [];
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">{candidate.name}</h1>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("details")}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === "details"
                  ? "border-b-2 border-orange-500 text-orange-600"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab("appointments")}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === "appointments"
                  ? "border-b-2 border-orange-500 text-orange-600"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Appointments
            </button>
            {/* <button
              onClick={() => setActiveTab("conversations")}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === "conversations"
                  ? "border-b-2 border-orange-500 text-orange-600"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Conversations
            </button> */}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "details" && (
            // <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            //   <div>
            //     <h3 className="text-lg font-medium text-gray-900 mb-4">
            //       Personal Information
            //     </h3>
            //     <dl className="space-y-3">
            //       <div className="flex">
            //         <dt className="w-36 flex-shrink-0 text-gray-500">
            //           Full Name:
            //         </dt>
            //         <dd className="font-medium text-gray-900">
            //           {candidate.name}
            //         </dd>
            //       </div>
            //       <div className="flex">
            //         <dt className="w-36 flex-shrink-0 text-gray-500">
            //           Phone Number:
            //         </dt>
            //         <dd className="font-medium text-gray-900">
            //           {candidate.phone}
            //         </dd>
            //       </div>
            //       <div className="flex">
            //         <dt className="w-36 flex-shrink-0 text-gray-500">
            //           Experience:
            //         </dt>
            //         <dd className="font-medium text-gray-900">
            //           {candidate.experience} years
            //         </dd>
            //       </div>
            //     </dl>
            //   </div>

            //   <div>
            //     <h3 className="text-lg font-medium text-gray-900 mb-4">
            //       Job Preferences
            //     </h3>
            //     <dl className="space-y-3">
            //       <div className="flex">
            //         <dt className="w-36 flex-shrink-0 text-gray-500">
            //           Current CTC:
            //         </dt>
            //         <dd className="font-medium text-gray-900">
            //           ₹{candidate.current_ctc}
            //         </dd>
            //       </div>
            //       <div className="flex">
            //         <dt className="w-36 flex-shrink-0 text-gray-500">
            //           Expected CTC:
            //         </dt>
            //         <dd className="font-medium text-gray-900">
            //           ₹{candidate.expected_ctc}
            //         </dd>
            //       </div>
            //       <div className="flex">
            //         <dt className="w-36 flex-shrink-0 text-gray-500">
            //           Notice Period:
            //         </dt>
            //         <dd className="font-medium text-gray-900">
            //           {candidate.notice_period}
            //         </dd>
            //       </div>
            //     </dl>
            //   </div>
            // </div>
            <ViewCandidate candidate={candidate} />
          )}

          {activeTab === "appointments" && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">
                Appointments
              </h3>
              {loadingAppointments ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                </div>
              ) : !appointment || appointment.length === 0 ? (
                <p className="text-gray-500">No appointments scheduled.</p>
              ) : (
                <>
                  <div className="space-y-4">
                    {appointment.map((appt) => (
                      <AppointmentListItem key={appt._id} appointment={appt} />
                    ))}
                  </div>
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center space-x-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      <span className="text-sm text-gray-700">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === "conversations" && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">
                Conversation History
              </h3>

              {candidate.conversations.length === 0 ? (
                <p className="text-gray-500">No conversations recorded.</p>
              ) : (
                <div className="space-y-6">
                  {candidate.conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className="bg-gray-50 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-medium text-gray-900">
                          Conversation on {formatDate(conversation.timestamp)}
                        </h4>
                      </div>

                      <div className="bg-white rounded border border-gray-200 p-3 mb-3">
                        <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                          {conversation.transcript}
                        </pre>
                      </div>

                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-2">
                          Extracted Information:
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(conversation.entities_extracted).map(
                            ([key, value]) => (
                              <span
                                key={key}
                                className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded"
                              >
                                {key}: {value}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

  
    </div>
  );
}
