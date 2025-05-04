// /app/dashboard/slots/page.jsx
"use client";

import { useState } from "react";
import {
  format,
  addDays,
  startOfDay,
  endOfDay,
  parseISO,
  isSameDay,
} from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Users,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { useAvailableSlots } from "@/api/hooks/slots/useAvailableSlots";
import { useSlotsByDate } from "@/api/hooks/slots/useSlotsByDate";
import SlotList from "@/components/slots/SlotList";
import CreateSlotForm from "@/components/slots/CreateSlotForm";
import GenerateSlotsForm from "@/components/slots/GenerateSlotsForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/useToast";

export default function SlotsCalendarPage() {
  const { showSuccess, showError } = useToast();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showGenerateForm, setShowGenerateForm] = useState(false);

  const formattedDate = format(selectedDate, "yyyy-MM-dd");
  const { slots, isLoading } = useSlotsByDate(formattedDate);

  // Get all available slots for the next 30 days for the calendar highlighting
  const startDate = format(startOfDay(new Date()), "yyyy-MM-dd");
  const endDate = format(addDays(new Date(), 30), "yyyy-MM-dd");
  const { slots: allSlots, isLoading: allSlotsLoading } = useAvailableSlots(
    startDate,
    endDate
  );

  // Find days with available slots for calendar highlighting
  const daysWithSlots = allSlots.reduce((acc, slot) => {
    const slotDate = parseISO(slot.date);
    const dateStr = format(slotDate, "yyyy-MM-dd");
    if (!acc.includes(dateStr)) {
      acc.push(dateStr);
    }
    return acc;
  }, []);

  const handleDateSelect = (date) => {
    console.log(date, "this sid ate");
    if(date){

      setSelectedDate(date);
    }
  };

  const toggleCreateForm = () => {
    setShowCreateForm(!showCreateForm);
    setShowGenerateForm(false);
  };

  const toggleGenerateForm = () => {
    setShowGenerateForm(!showGenerateForm);
    setShowCreateForm(false);
  };

  const handleSlotCreated = () => {
    showSuccess("The slot has been successfully created.");
    setShowCreateForm(false);
  };

  const handleSlotsGenerated = (count) => {
    showSuccess(`${count} slots have been successfully generated.`);
    setShowGenerateForm(false);
  };

  if (isLoading) {
    return (
      <div>
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Slot Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Calendar Column */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarIcon className="mr-2 h-5 w-5 text-primary" />
              Calendar
            </CardTitle>
            <CardDescription>
              Select a date to view available slots
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              className="rounded-md border"
              modifiers={{
                hasSlots: (date) =>
                  daysWithSlots.includes(format(date, "yyyy-MM-dd")),
              }}
              modifiersStyles={{
                hasSlots: {
                  fontWeight: "bold",
                  backgroundColor: "hsl(24 95% 94%)",
                  color: "hsl(24 95% 30%)",
                },
              }}
            />
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedDate(new Date())}
            >
              Today
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={toggleGenerateForm}
              className="flex items-center"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Generate Slots
            </Button>
          </CardFooter>
        </Card>

        {/* Slots Column */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl">
                {format(selectedDate, "EEEE, MMMM d, yyyy")}
              </CardTitle>
              <CardDescription className="flex items-center mt-1">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                Available slots
              </CardDescription>
            </div>
            <Button onClick={toggleCreateForm} className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Add Slot
            </Button>
          </CardHeader>

          <CardContent>
            {showCreateForm && (
              <div className="mb-6">
                <CreateSlotForm
                  selectedDate={selectedDate}
                  onSuccess={handleSlotCreated}
                  onCancel={() => setShowCreateForm(false)}
                />
                <Separator className="my-6" />
              </div>
            )}

            {showGenerateForm && (
              <div className="mb-6">
                <GenerateSlotsForm
                  onSuccess={handleSlotsGenerated}
                  onCancel={() => setShowGenerateForm(false)}
                />
                <Separator className="my-6" />
              </div>
            )}

            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : slots.length > 0 ? (
              <SlotList slots={slots} date={selectedDate} />
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Clock className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p className="text-lg font-medium">
                  No slots available for this date
                </p>
                <p className="text-sm mt-1">
                  Try selecting a different date or create new slots
                </p>
              </div>
            )}
          </CardContent>

          <CardFooter className="bg-muted/50 border-t px-6 py-3">
            <div className="flex items-center text-xs text-muted-foreground">
              <Users className="mr-2 h-4 w-4" />
              <span>
                {slots.length} {slots.length === 1 ? "slot" : "slots"} available
                for {format(selectedDate, "MMM d")}
              </span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
