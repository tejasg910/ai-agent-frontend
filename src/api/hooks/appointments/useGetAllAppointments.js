import { appointmentsApi } from "@/api/services/appointmentsApi";
import { useCallback, useMemo, useState } from "react";
import useSWR from "swr";


export const useGetAllAppointments = (params = {}) => {
  const fetcher = useCallback(() => appointmentsApi.getAll(params), [params]);

  const { data, error, isValidating, mutate } = useSWR(
    ['/appointments', params], // Key includes params
    fetcher,
    { revalidateOnFocus: false }
  );

  // Optimize counts calculation
  const counts = useMemo(() => {
    const result = { upcoming: 0, past: 0, total: data?.length || 0 };
    if (data && Array.isArray(data)) {
      const now = new Date();
      data.forEach(appointment => {
        if (!appointment.slot_id?.date) return;
        const appointmentDate = new Date(appointment.slot_id.date);
        const [hours, minutes] = (appointment.slot_id.start_time || "00:00").split(':').map(Number);
        appointmentDate.setHours(hours, minutes, 0, 0);
        if (appointmentDate >= now && appointment.status !== "canceled") {
          result.upcoming++;
        } else if (appointmentDate < now || appointment.status === "completed") {
          result.past++;
        }
      });
    }
    return result;
  }, [data]);

  return {
    data,
    isLoading: isValidating,
    isError: !!error,
    mutate,
    counts,
  };
};