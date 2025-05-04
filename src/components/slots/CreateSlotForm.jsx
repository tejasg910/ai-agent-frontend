// /components/slots/CreateSlotForm.jsx
"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { useCreateSlot } from "@/api/hooks/slots/useGenerateSlots";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CalendarIcon, Clock } from "lucide-react";
import { useToast } from "@/hooks/useToast";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const formSchema = z
  .object({
    interviewer_id: z.string().min(1, "Interviewer ID is required"),
    start_time: z
      .string()
      .regex(timeRegex, "Start time must be in HH:MM format (24-hour)"),
    end_time: z
      .string()
      .regex(timeRegex, "End time must be in HH:MM format (24-hour)"),
  })
  .refine(
    (data) => {
      const start = data.start_time.split(":").map(Number);
      const end = data.end_time.split(":").map(Number);

      const startMinutes = start[0] * 60 + start[1];
      const endMinutes = end[0] * 60 + end[1];

      return endMinutes > startMinutes;
    },
    {
      message: "End time must be after start time",
      path: ["end_time"],
    }
  );

export default function CreateSlotForm({ selectedDate, onSuccess, onCancel }) {
  const { showError, showSuccess } = useToast();
  const { mutate: createSlot, isLoading } = useCreateSlot();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // interviewer_id: "",
      start_time: "09:00",
      end_time: "10:00",
    },
  });

  const onSubmit = async (data) => {
    try {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");

      await createSlot({
        date: formattedDate,
        start_time: data.start_time,
        end_time: data.end_time,
        // interviewer_id: data.interviewer_id,
      });

      form.reset();
      onSuccess?.();
    } catch (error) {
      //   showToast({
      //     title: "Error",
      //     description: error.message || "Failed to create slot",
      //     variant: "destructive",
      //   });

      showError(error.message || "Failed to create slot");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center">
          <Clock className="mr-2 h-5 w-5 text-primary" />
          Create New Slot for {format(selectedDate, "MMMM d, yyyy")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* <FormField
              control={form.control}
              name="interviewer_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interviewer ID</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter interviewer ID"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the MongoDB ID of the interviewer
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        placeholder="HH:MM"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        placeholder="HH:MM"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="pt-4 flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Slot"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
