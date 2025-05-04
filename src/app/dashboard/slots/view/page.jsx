// /app/dashboard/page.jsx
'use client';

import { useState } from 'react';
import { format, startOfDay, endOfDay, addDays, parseISO } from 'date-fns';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, CheckCircle, AlertCircle, User, Calendar as CalendarIcon } from 'lucide-react';
import { useAvailableSlots } from '@/api/hooks/slots/useAvailableSlots';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

export default function DashboardPage() {
  const today = new Date();
  const startDate = format(startOfDay(today), 'yyyy-MM-dd');
  const endDate = format(addDays(today, 30), 'yyyy-MM-dd');
  
  const { slots, isLoading } = useAvailableSlots(startDate, endDate);
  
  // Group slots by date
  const slotsByDate = slots.reduce((acc, slot) => {
    const date = format(parseISO(slot.date), 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(slot);
    return acc;
  }, {});
  
  // Get the next 5 dates with available slots
  const nextDatesWithSlots = Object.keys(slotsByDate)
    .sort()
    .slice(0, 5);

  return (
    
      <div className="container mx-auto py-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome to your interview slot management dashboard
          </p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Total Available Slots</CardTitle>
              <CardDescription>Upcoming 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {isLoading ? <Skeleton className="h-10 w-16" /> : slots.length}
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/slots">
                  View All Slots
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Today's Slots</CardTitle>
              <CardDescription>
                {format(today, 'EEEE, MMMM d')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {isLoading ? (
                  <Skeleton className="h-10 w-16" />
                ) : (
                  slotsByDate[format(today, 'yyyy-MM-dd')]?.length || 0
                )}
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/dashboard/slots?date=${format(today, 'yyyy-MM-dd')}`}>
                  View Today's Slots
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
              <CardDescription>Manage your slots</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Button className="w-full justify-start" asChild>
                <Link href="/dashboard/slots">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  View Calendar
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <User className="mr-2 h-4 w-4" />
                Manage Interviewers
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <h2 className="text-xl font-semibold mb-4">Upcoming Slots</h2>
        
        <div className="grid grid-cols-1 gap-4">
          {isLoading ? (
            [1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))
          ) : nextDatesWithSlots.length > 0 ? (
            nextDatesWithSlots.map((dateStr) => {
              const date = parseISO(dateStr);
              return (
                <Card key={dateStr} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex border-l-4 border-primary">
                      <div className="py-4 px-6 bg-primary/5 w-48 flex flex-col justify-center">
                        <p className="text-lg font-medium">
                          {format(date, 'EEEE')}
                        </p>
                        <p className="text-2xl font-bold">
                          {format(date, 'MMM d')}
                        </p>
                        <Badge className="mt-2 w-fit">
                          {slotsByDate[dateStr].length} slots
                        </Badge>
                      </div>
                      
                      <div className="flex-1 p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {slotsByDate[dateStr].slice(0, 6).map((slot) => (
                          <div 
                            key={slot._id} 
                            className="bg-background border rounded-md p-2 flex items-center"
                          >
                            <Clock className="h-4 w-4 mr-2 text-primary" />
                            <span>{slot.start_time} - {slot.end_time}</span>
                          </div>
                        ))}
                        
                        {slotsByDate[dateStr].length > 6 && (
                          <div className="bg-muted/50 border rounded-md p-2 flex items-center justify-center">
                            <span className="text-sm text-muted-foreground">
                              +{slotsByDate[dateStr].length - 6} more
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="border-l flex items-center px-4">
                        <Button variant="ghost" asChild>
                          <Link href={`/dashboard/slots?date=${dateStr}`}>
                            View All
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="text-center py-12 bg-muted/20 rounded-lg border">
              <Calendar className="mx-auto h-12 w-12 mb-4 text-muted-foreground/70" />
              <h3 className="text-lg font-medium">No upcoming slots found</h3>
              <p className="text-muted-foreground mt-2">
                Create new slots to get started
              </p>
              <Button className="mt-4" asChild>
                <Link href="/dashboard/slots">
                  Create Slots
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
  
  );
}