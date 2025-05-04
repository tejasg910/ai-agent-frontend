// /components/slots/GenerateSlotsForm.jsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CalendarIcon, Clock, ListPlus } from "lucide-react";
import { format, addDays } from "date-fns";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/useToast";
import { useGenerateSlots } from "@/api/hooks/slots/useGeneralSlot";

const formSchema = z
  .object({
    start_date: z.date({
      required_error: "Start date is required",
    }),
    end_date: z.date({
      required_error: "End date is required",
    }),
    // interviewer_id: z.string().min(1, "Interviewer ID is required"),
    interval_minutes: z.coerce.number().int().min(15).max(120),
  })
  .refine((data) => data.end_date >= data.start_date, {
    message: "End date must be after start date",
    path: ["end_date"],
  });

export default function GenerateSlotsForm({ onSuccess, onCancel }) {
  const { showSuccess, showError } = useToast();
  const { mutate, isLoading } = useGenerateSlots();
  console.log(isLoading, "This si iloading");
  const today = new Date();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      start_date: today,
      end_date: addDays(today, 7),
      // interviewer_id: "", // Should be populated with the current user ID in a real app
      interval_minutes: 60,
    },
  });

  const onSubmit = async (data) => {
    try {
      console.log("came in this api ");
      const response = await mutate({
        start_date: format(data.start_date, "yyyy-MM-dd"),
        end_date: format(data.end_date, "yyyy-MM-dd"),
        // interviewer_id: data.interviewer_id,
        interval_minutes: data.interval_minutes,
      });

      showSuccess("Slots Generated");

      form.reset();
      onSuccess?.(response.count);
    } catch (error) {
      console.log(error, "this is erro r");
      showError(error.message || "Failed to generate slots");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center">
          <ListPlus className="mr-2 h-5 w-5 text-primary" />
          Generate Multiple Slots
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className="w-full pl-3 text-left font-normal"
                            disabled={isLoading}
                          >
                            {field.value ? (
                              format(field.value, "MMMM d, yyyy")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < today}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className="w-full pl-3 text-left font-normal"
                            disabled={isLoading}
                          >
                            {field.value ? (
                              format(field.value, "MMMM d, yyyy")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < today ||
                            (form.getValues("start_date") &&
                              date < form.getValues("start_date"))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* <FormField
                control={form.control}
                name="interviewer_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interviewer ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter interviewer ID" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormDescription>
                      Enter the MongoDB ID of the interviewer
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              <FormField
                control={form.control}
                name="interval_minutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interval (minutes)</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value.toString()}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select interval" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">60 minutes (1 hour)</SelectItem>
                        <SelectItem value="90">
                          90 minutes (1.5 hours)
                        </SelectItem>
                        <SelectItem value="120">
                          120 minutes (2 hours)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Duration of each slot</FormDescription>
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
                {isLoading ? "Generating..." : "Generate Slots"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
