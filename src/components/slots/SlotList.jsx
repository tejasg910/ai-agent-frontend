// /components/slots/SlotList.jsx
"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Clock,
  Users,
  Calendar,
  Trash2,
  MoreVertical,
  ShowerHead,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReleaseSlot } from "@/api/hooks/slots/useReleaseSlot";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/useToast";

export default function SlotList({ slots, date }) {
  console.log(slots, "this is slots");
  const { showError, showSuccess } = useToast();
  const { releaseSlot, isLoading } = useReleaseSlot();
  const [slotToDelete, setSlotToDelete] = useState(null);

  const handleReleaseSlot = async () => {
    if (!slotToDelete) return;

    try {
      await releaseSlot(slotToDelete._id);
      showSuccess("slot released");
      setSlotToDelete(null);
      // You would typically refresh the slots data here
    } catch (error) {
      showError(error.message || "Failed to release slot");
    }
  };

  const formatTime = (timeString) => {
    // Convert 24h format to 12h format
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <div className="space-y-3">
      {slots.map((slot) => (
        <div
          key={slot._id}
          className="bg-white border rounded-lg shadow-sm p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center">
            <div className="bg-primary/10 p-3 rounded-full mr-4">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-medium text-sm sm:text-base">
                {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
              </h4>
              <p className="text-xs sm:text-sm text-muted-foreground flex items-center mt-1">
                <Users className="h-3 w-3 mr-1" />
                Interviewer ID: {slot.interviewer_id}
              </p>
            </div>
          </div>

          <div className="flex items-center mt-3 sm:mt-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => setSlotToDelete(slot)}>
                  <Trash2 className="h-4 w-4 mr-2 text-destructive" />
                  Release Slot
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}

      <AlertDialog
        open={!!slotToDelete}
        onOpenChange={() => setSlotToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Release this slot?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will release the slot and make it available for
              rebooking.
              {slotToDelete && (
                <div className="mt-2 p-3 bg-muted rounded-md">
                  <p className="font-medium">
                    {format(new Date(slotToDelete.date), "MMMM d, yyyy")}
                  </p>
                  <p>
                    {formatTime(slotToDelete.start_time)} -{" "}
                    {formatTime(slotToDelete.end_time)}
                  </p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReleaseSlot}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? "Releasing..." : "Release Slot"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
