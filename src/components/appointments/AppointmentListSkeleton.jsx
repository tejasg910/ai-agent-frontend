"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  FileText, 
  AlertCircle,
  MoreHorizontal,
  User,
  Video,
  ChevronRight,
  DollarSign,
  Briefcase,
  Mail,
  Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// Loading skeleton for list items
export function AppointmentListItemSkeleton() {
    return (
      <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border-b border-orange-100 animate-pulse">
        <div className="flex items-center gap-3 mb-3 md:mb-0 md:w-2/5">
          <Skeleton className="h-10 w-10 rounded-full bg-orange-100" />
          <div>
            <Skeleton className="h-4 w-40 mb-2 bg-orange-100" />
            <Skeleton className="h-3 w-32 bg-orange-100" />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:w-2/5">
          <Skeleton className="h-4 w-24 bg-orange-100" />
          <Skeleton className="h-4 w-24 bg-orange-100" />
          <Skeleton className="h-4 w-24 bg-orange-100" />
        </div>
        <div className="flex justify-end mt-3 md:mt-0 md:w-1/5">
          <Skeleton className="h-8 w-24 bg-orange-100" />
        </div>
      </div>
    );
  }
  
