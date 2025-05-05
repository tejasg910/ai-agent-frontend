"use client";

import { useEffect, useState } from "react";
import { useCollectForm } from "@/api/hooks/form/useCollect";
import CandidateForm from "@/components/form/CandidateForm";
import SlotSelectionForm from "@/components/form/BookSlot";
import {
  Check,
  User,
  Calendar,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";
import { useValid } from "@/api/hooks/form/useValid";
import InvalidUrlCard from "@/components/common/InvalidUrl";
import { useToast } from "@/hooks/useToast";

const RecruitmentPortalPage = () => {
  const { id } = useParams();
  const { data, isError, isLoading, mutate } = useCollectForm();
  const [step, setStep] = useState(1);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [slotBooked, setSlotBooked] = useState(false);
  const { isError: validError, isLoading: fetchingData } = useValid(id);

  const { showError, showSuccess } = useToast();
  // Handle candidate form submission
  const handleCandidateSubmit = async (candidateData) => {
    try {
      const data = await mutate({ ...candidateData, recruiterId: id });
      setFormSubmitted(true);

      console.log(data, "this is data");
      if (data?.shortlisted && data?.slotsAvailable) {
        setStep(2);
      }else{
        setStep(3);
      }  
    } catch (error) {
      console.log(error, "This is erro ");
      showError(
        error?.error || "something went wrong while processing request "
      );
    }
  };

  // Handle slot booking success
  const handleSlotBookingSuccess = () => {
    setSlotBooked(true);
    setStep(3); // Move to success step
  };

  // Handle slot booking cancellation
  const handleSlotBookingCancel = () => {
    // Keep on the same page but show a different message
    setStep(3);
  };

  if (validError) {
    return <InvalidUrlCard />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Candidate Application Portal
          </h1>
          <p className="text-lg text-gray-600">
            Submit your details and schedule an interview with our recruitment
            team
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center w-full max-w-3xl">
            <div
              className={`flex flex-col items-center ${
                step >= 1 ? "text-orange-500" : "text-gray-400"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  step >= 1
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-300"
                }`}
              >
                <User className="h-5 w-5" />
              </div>
              <span className="text-sm mt-1 font-medium">Details</span>
            </div>
            <div
              className={`flex-1 h-1 mx-4 ${
                step >= 2 ? "bg-orange-500" : "bg-gray-300"
              }`}
            ></div>
            <div
              className={`flex flex-col items-center ${
                step >= 2 ? "text-orange-500" : "text-gray-400"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  step >= 2
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-300"
                }`}
              >
                <Calendar className="h-5 w-5" />
              </div>
              <span className="text-sm mt-1 font-medium">Schedule</span>
            </div>
            <div
              className={`flex-1 h-1 mx-4 ${
                step >= 3 ? "bg-orange-500" : "bg-gray-300"
              }`}
            ></div>
            <div
              className={`flex flex-col items-center ${
                step >= 3 ? "text-orange-500" : "text-gray-400"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  step >= 3
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-300"
                }`}
              >
                <Check className="h-5 w-5" />
              </div>
              <span className="text-sm mt-1 font-medium">Complete</span>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {isError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Error while subbmiting form</AlertDescription>
          </Alert>
        )}

        {/* Content Container */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="candidate-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <Card className="shadow-lg overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-transparent">
                  <CardTitle className="text-xl font-semibold text-gray-800">
                    Candidate Information
                  </CardTitle>
                  <CardDescription>
                    Please fill in your details accurately for our recruitment
                    team to review
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <CandidateForm
                    onSubmit={handleCandidateSubmit}
                    isSubmitting={isLoading}
                    id={id}

                  />
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 2 && data?.shortlisted && data?.slotsAvailable && (
            <motion.div
              key="slot-selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <Card className="shadow-lg overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-transparent">
                  <CardTitle className="text-xl font-semibold text-gray-800">
                    Schedule Interview
                  </CardTitle>
                  <CardDescription>
                    You've been shortlisted! Select a convenient time slot for
                    your interview
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <SlotSelectionForm
                    onSuccess={handleSlotBookingSuccess}
                    onCancel={handleSlotBookingCancel}
                    candidateId={data?.candidate?._id}
                    
                    job_id={id}
                  />
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="success-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <Card className="shadow-lg overflow-hidden border-t-4 border-t-green-500">
                <CardContent className="pt-8 pb-6 px-8">
                  <div className="text-center mb-6">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                      <Check className="h-8 w-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Application Successful!
                    </h2>
                    {slotBooked ? (
                      <p className="text-gray-600 mt-2">
                        Your application has been submitted and your interview
                        has been scheduled. We've sent the details to your
                        email.
                      </p>
                    ) : (
                      <p className="text-gray-600 mt-2">
                        Your application has been submitted successfully. Our
                        recruitment team will review your details and get back
                        to you soon.
                      </p>
                    )}
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h3 className="font-medium text-gray-800 mb-2">
                      What happens next?
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <div className="flex-shrink-0 mt-0.5">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                        </div>
                        <span className="text-gray-600">
                          You'll receive a confirmation email with your details
                        </span>
                      </li>
                      {slotBooked && (
                        <li className="flex items-start">
                          <div className="flex-shrink-0 mt-0.5">
                            <Check className="h-4 w-4 text-green-500 mr-2" />
                          </div>
                          <span className="text-gray-600">
                            Your interview is scheduled - please be prepared on
                            time
                          </span>
                        </li>
                      )}
                      <li className="flex items-start">
                        <div className="flex-shrink-0 mt-0.5">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                        </div>
                        <span className="text-gray-600">
                          Our team will review your application and prepare
                          accordingly
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="flex justify-center">
                    <Button
                      onClick={() => (window.location.href = "/")}
                      className="bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      Return to Homepage
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm mt-8">
          <p>© {new Date().getFullYear()} Your Company. All rights reserved.</p>
          <p className="mt-1">
            For any issues, please contact our support team at
            support@yourcompany.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecruitmentPortalPage;
