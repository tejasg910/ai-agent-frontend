// /api/hooks/slots/useAvailableSlots.js
import useSWR from 'swr';
import { slotApi } from '@/api/services/slotApi';

export const useAvailableSlots = (startDate, endDate) => {
  const key = startDate && endDate ? 
    [`/slots/available`, startDate, endDate] : null;
  
  const fetcher = async () => {
    return slotApi.getAvailableSlots(startDate, endDate);
  };
  
  const { data, error, isLoading, mutate } = useSWR(key, fetcher);
  
  return {
    slots: data?.data || [],
    isLoading,
    isError: !!error,
    mutate
  };
};

