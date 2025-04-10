
import { useQuery } from '@tanstack/react-query';
import { getBatchById } from '@/utils/batchUtils';
import { BatchWithCategory } from '@/hooks/useBatches';

/**
 * Hook to fetch a single batch by ID
 */
export const useSingleBatch = (id: string | undefined) => {
  return useQuery({
    queryKey: ['batch', id],
    queryFn: () => id ? getBatchById(id) : null,
    enabled: !!id,
  });
};
