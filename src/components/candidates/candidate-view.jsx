"use client";

import {
  ArrowLeft,
  User,
  Calendar,
  Briefcase,
  Edit2,
  ChevronRight,
  Mail,
  Phone,
  Clock,
  DollarSign,
  Star,
  Share2,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SlotSelectionFormCandidate from "./book-slot";
import { useState } from "react";
import { useToast } from "@/hooks/useToast";
export default function ViewCandidate({ candidate }) {
  const [openShedule, setOpenSchedule] = useState(false);
  const { showSuccess } = useToast();
  console.log(candidate, "This is candidate ");
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Skills match calculation
  const calculateSkillsMatch = () => {
    if (!candidate.ratings || candidate.ratings.length === 0) return 0;

    const totalPoints = candidate.ratings.reduce(
      (sum, item) => sum + item.rating,
      0
    );
    const maxPossiblePoints = candidate.ratings.length * 5;
    // return Math.round((totalPoints / maxPossiblePoints) * 100);
    return candidate?.score || 0;
  };

  const skillsMatchPercentage = calculateSkillsMatch();

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <Link href="/dashboard/candidates">
          <Button variant="ghost" className="px-0 text-gray-600">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Candidates
          </Button>
        </Link>
      </div>

      <Card className="overflow-hidden border-gray-200">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-white p-6 border-b border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <User className="h-6 w-6 text-orange-500" />
                <CardTitle className="text-2xl font-semibold text-gray-900">
                  {candidate.name}
                </CardTitle>
                <Badge className="bg-orange-100 text-orange-800 ml-2">
                  {candidate.experience} years exp
                </Badge>
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-1" />
                  <span>{candidate.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-1" />
                  <span>{candidate.phone}</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-2">
              <Link href={`/dashboard/candidates/edit/${candidate._id}`}>
                <Button
                  variant="outline"
                  className="text-orange-600 border-orange-300 hover:bg-orange-50"
                >
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </Link>
              {/* <Button
                variant="outline"
                className="text-gray-700 border-gray-300 hover:bg-gray-100"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button> */}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">About</h3>
            <p className="text-gray-700 whitespace-pre-line">
              {candidate.about || "No additional information provided."}
            </p>
          </div>

          <Separator />

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800">
                Professional Details
              </h3>

              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Current CTC</p>
                    <p className="font-medium text-gray-800">
                      ${candidate.current_ctc || "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Expected CTC</p>
                    <p className="font-medium text-gray-800">
                      ${candidate.expected_ctc || "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Notice Period</p>
                    <p className="font-medium text-gray-800">
                      {candidate.notice_period || "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Available From</p>
                    <p className="font-medium text-gray-800">
                      {formatDate(candidate.available)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800">
                Job Assignment
              </h3>

              <div className="bg-gray-50 p-4 rounded-lg">
                {candidate.jobAssignment ? (
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Briefcase className="h-5 w-5 text-gray-500 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">Assigned Job</p>
                        <p className="font-medium text-gray-800">
                          {/* Assume we'd have the job title here */}
                          {candidate.jobAssignment.title || "Job Title"}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2"
                      asChild
                    >
                      <Link
                        href={`/dashboard/jobs/${candidate?.jobAssignment?._id}`}
                      >
                        View Job Details
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500">
                      Not currently assigned to any job
                    </p>
                    {/* <Button variant="outline" size="sm" className="mt-2">
                      Assign to Job
                    </Button> */}
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Skills Assessment
            </h3>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-700">Overall Skills Match</span>
                <span className="font-medium">{skillsMatchPercentage}%</span>
              </div>
              <Progress value={skillsMatchPercentage} className="h-2" />
            </div>

            {candidate.ratings && candidate.ratings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
                {candidate.ratings.map((rating, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-3 rounded border border-gray-100"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">
                        {rating.skill.name || "Skill"}
                      </span>
                      <div className="flex items-center">
                        <span className="font-medium mr-1">
                          {rating.rating}
                        </span>
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">
                No skills have been rated yet.
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-6 bg-gray-50 border-t border-gray-100">
          <div className="flex justify-between w-full">
            {candidate && candidate?.jobAssignment?._id && (
              <Dialog onClose={setOpenSchedule}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="text-gray-700 border-gray-300 hover:bg-gray-100"
                  >
                    Schedule Interview
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[700px]">
                  <DialogHeader>
                    <DialogTitle>Shedule Interview</DialogTitle>
                   
                    <DialogDescription>
                    Shedule an interview with {candidate.name}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <SlotSelectionFormCandidate
                      candidateId={candidate._id}
                      job_id={candidate.jobAssignment?._id}
                      onCancel={() => setOpenSchedule(false)}
                      onSuccess={() => {
                        setOpenSchedule(false);
                        showSuccess("Interview scheduled successfully!");
                        // Optionally, you can add a success message or redirect here
                      }}
                    />
                  </div>
           
                </DialogContent>
              </Dialog>
            )}

            {/* <Button
              variant="default"
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Contact Candidate
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button> */}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
