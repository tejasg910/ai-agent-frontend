// components/interviews/SlotSelectionForm.jsx
"use client";

import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import {
  Calendar,
  Clock,
  Check,
  X,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetSlots } from "@/api/hooks/form/useGetSlots";
import { useShedule } from "@/api/hooks/form/useShedule";

export default function SlotSelectionForm({
  candidateId,
  onSuccess,
  onCancel,
  job_id,
}) {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [interviewType, setInterviewType] = useState("initial");
  const [selectedDate, setSelectedDate] = useState(null);
  const [filteredSlots, setFilteredSlots] = useState([]);

  const { data: slots, isLoading, error } = useGetSlots(candidateId);

  console.log(slots, "this si slots");
  const {
    mutate: scheduleInterview,
    isLoading: isScheduling,
    error: scheduleError,
  } = useShedule();

  // Extract unique dates from available slots
  const dates = slots
    ? [
        ...new Set(
          slots?.availableSlots.map((slot) =>
            format(parseISO(slot.date), "yyyy-MM-dd")
          )
        ),
      ].sort()
    : [];

  // Group slots by date
  useEffect(() => {
    if (slots && selectedDate) {
      const filtered = slots?.availableSlots.filter(
        (slot) => format(parseISO(slot.date), "yyyy-MM-dd") === selectedDate
      );
      setFilteredSlots(filtered);
    } else {
      setFilteredSlots([]);
    }
  }, [slots, selectedDate]);

  const handleSelectDate = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null); // Reset selected slot when date changes
  };

  const handleSubmit = () => {
    if (!selectedSlot || !interviewType) return;

    scheduleInterview(
      {
        candidateId,
        slotId: selectedSlot,
        interviewType,
        job_id,
        recruiterId: job_id,
      },
      {
        onSuccess: (data) => {
          onSuccess?.(data);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-10 w-1/2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error loading slots</AlertTitle>
        <AlertDescription>
          {error.message || "Could not load available slots. Please try again."}
        </AlertDescription>
        <div className="mt-4">
          <Button onClick={onCancel}>Go Back</Button>
        </div>
      </Alert>
    );
  }

  if (!slots?.candidate || !slots || slots?.availableSlots.length === 0) {
    return (
      <Alert>
        <AlertTitle>No slots available</AlertTitle>
        <AlertDescription>
          There are no available interview slots at the moment. Please check
          back later.
        </AlertDescription>
        <div className="mt-4">
          <Button onClick={onCancel}>Go Back</Button>
        </div>
      </Alert>
    );
  }

  return (
    <Card className="w-full shadow-lg border-t-4 border-t-orange-500">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-transparent">
        <CardTitle className="flex items-center text-xl font-semibold text-gray-800">
          <Calendar className="mr-2 h-5 w-5 text-orange-500" />
          Schedule Interview for {slots?.candidate?.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {scheduleError && (
          <Alert variant="destructive" className="mb-4">
            <X className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {scheduleError.message ||
                "Failed to schedule interview. Please try again."}
            </AlertDescription>
          </Alert>
        )}

        {/* <div className="space-y-2">
          <Label
            htmlFor="interview-type"
            className="text-sm font-medium flex items-center text-gray-700"
          >
            <Clock className="mr-2 h-4 w-4 text-orange-500" />
            Interview Type
          </Label>
          <Select value={interviewType} onValueChange={setInterviewType}>
            <SelectTrigger className="border-gray-300 focus:border-orange-500 focus:ring-orange-500">
              <SelectValue placeholder="Select interview type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="initial">Initial Screening</SelectItem>
              <SelectItem value="technical">Technical Interview</SelectItem>
              <SelectItem value="managerial">Managerial Round</SelectItem>
              <SelectItem value="hr">HR Discussion</SelectItem>
              <SelectItem value="final">Final Interview</SelectItem>
            </SelectContent>
          </Select>
        </div> */}

        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center text-gray-700">
            <CalendarIcon className="mr-2 h-4 w-4 text-orange-500" />
            Select Date
          </Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {dates.map((date) => (
              <Button
                key={date}
                type="button"
                variant={selectedDate === date ? "default" : "outline"}
                className={`text-sm justify-start ${
                  selectedDate === date
                    ? "bg-orange-500 text-white"
                    : "text-gray-700"
                }`}
                onClick={() => handleSelectDate(date)}
              >
                {format(parseISO(date), "EEE, MMM d")}
              </Button>
            ))}
          </div>
        </div>

        {selectedDate && filteredSlots.length > 0 ? (
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center text-gray-700">
              <Clock className="mr-2 h-4 w-4 text-orange-500" />
              Select Time Slot
            </Label>
            <RadioGroup
              value={selectedSlot}
              onValueChange={setSelectedSlot}
              className="grid grid-cols-2 sm:grid-cols-3 gap-2"
            >
              {filteredSlots.map((slot) => (
                <div key={slot.id} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={slot.id}
                    id={slot.id}
                    className="text-orange-500"
                  />
                  <Label
                    htmlFor={slot.id}
                    className="flex flex-col cursor-pointer p-2 rounded-md hover:bg-gray-50"
                  >
                    <span className="font-medium">
                      {slot.start_time} - {slot.end_time}
                    </span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        ) : selectedDate ? (
          <Alert>
            <AlertTitle>No slots available</AlertTitle>
            <AlertDescription>
              No time slots available for the selected date. Please choose
              another date.
            </AlertDescription>
          </Alert>
        ) : null}
      </CardContent>

      <CardFooter className="bg-gray-50 flex justify-end space-x-3 py-4 px-6 border-t border-gray-100">
        <Button
          type="button"
          onClick={onCancel}
          variant="outline"
          className="border-gray-300 text-gray-700 hover:bg-gray-50"
          disabled={isScheduling}
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={!selectedSlot || !interviewType || isScheduling}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          {isScheduling ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Scheduling...
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Schedule Interview
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
