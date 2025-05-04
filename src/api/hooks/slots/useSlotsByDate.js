
// /api/hooks/slots/useSlotsByDate.js
import useSWR from 'swr';
import { slotApi } from '@/api/services/slotApi';

export const useSlotsByDate = (date) => {
  const key = date ? [`/slots/date`, date] : null;
  
  const fetcher = async () => {
    return slotApi.getSlotsForDate(date);
  };
  
  const { data, error, isLoading, mutate } = useSWR(key, fetcher);
  
  return {
    slots: data?.data || [],
    isLoading,
    isError: !!error,
    mutate
  };
};