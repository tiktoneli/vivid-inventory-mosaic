
import { useQuery } from '@tanstack/react-query';
import { getBatchById } from '@/utils/batchUtils';
import { BatchWithCategory } from '@/types';

/**
 * Hook to fetch a single batch by ID
 */
export const useSingleBatch = (id: string | undefined) => {
  return useQuery({
    queryKey: ['batch', id],
    queryFn: () => id ? getBatchById(id) : null,
    enabled: !!id,
    retry: 1, // Only retry once to avoid excessive retries on permanent failures
  });
};
