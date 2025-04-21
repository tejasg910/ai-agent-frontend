"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useGetCandidate } from "@/api/hooks/candidates/useGetCandidate";

export default function CandidateDetailPage() {
  const { id } = useParams();
  // const [candidate, setCandidate] = useState(null);
  // const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");

  const {
    data: candidate,
    isLoading: loading,
    isError,
    mutate,
  } = useGetCandidate(id);



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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">{candidate.name}</h1>
        <div className="flex space-x-3">
          <Link
            href={`/dashboard/candidates/${id}/edit`}
            className="bg-white text-orange-500 border border-orange-500 hover:bg-orange-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Edit Candidate
          </Link>
          <Link
            href={`/dashboard/appointments/new?candidate=${id}`}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Schedule Appointment
          </Link>
        </div>
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
            <button
              onClick={() => setActiveTab("conversations")}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === "conversations"
                  ? "border-b-2 border-orange-500 text-orange-600"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Conversations
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "details" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Personal Information
                </h3>
                <dl className="space-y-3">
                  <div className="flex">
                    <dt className="w-36 flex-shrink-0 text-gray-500">
                      Full Name:
                    </dt>
                    <dd className="font-medium text-gray-900">
                      {candidate.name}
                    </dd>
                  </div>
                  <div className="flex">
                    <dt className="w-36 flex-shrink-0 text-gray-500">
                      Phone Number:
                    </dt>
                    <dd className="font-medium text-gray-900">
                      {candidate.phone}
                    </dd>
                  </div>
                  <div className="flex">
                    <dt className="w-36 flex-shrink-0 text-gray-500">
                      Experience:
                    </dt>
                    <dd className="font-medium text-gray-900">
                      {candidate.experience} years
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Job Preferences
                </h3>
                <dl className="space-y-3">
                  <div className="flex">
                    <dt className="w-36 flex-shrink-0 text-gray-500">
                      Current CTC:
                    </dt>
                    <dd className="font-medium text-gray-900">
                      ₹{candidate.current_ctc}
                    </dd>
                  </div>
                  <div className="flex">
                    <dt className="w-36 flex-shrink-0 text-gray-500">
                      Expected CTC:
                    </dt>
                    <dd className="font-medium text-gray-900">
                      ₹{candidate.expected_ctc}
                    </dd>
                  </div>
                  <div className="flex">
                    <dt className="w-36 flex-shrink-0 text-gray-500">
                      Notice Period:
                    </dt>
                    <dd className="font-medium text-gray-900">
                      {candidate.notice_period}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          )}

          {activeTab === "appointments" && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">
                Appointments
              </h3>

              {candidate.appointments.length === 0 ? (
                <p className="text-gray-500">No appointments scheduled.</p>
              ) : (
                <div className="space-y-4">
                  {candidate.appointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="bg-gray-50 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {appointment.job}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {formatDate(appointment.date_time)}
                          </p>
                        </div>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            appointment.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : appointment.status === "canceled"
                              ? "bg-red-100 text-red-800"
                              : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {appointment.status.charAt(0).toUpperCase() +
                            appointment.status.slice(1)}
                        </span>
                      </div>

                      <div className="mt-3 flex justify-end space-x-3">
                        <Link
                          href={`/dashboard/appointments/${appointment.id}`}
                          className="text-orange-500 hover:text-orange-600 text-sm font-medium"
                        >
                          View Details
                        </Link>
                        {appointment.status === "booked" && (
                          <>
                            <button className="text-green-500 hover:text-green-600 text-sm font-medium">
                              Complete
                            </button>
                            <button className="text-red-500 hover:text-red-600 text-sm font-medium">
                              Cancel
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
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
