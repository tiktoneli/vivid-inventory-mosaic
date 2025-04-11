
import { useQuery } from '@tanstack/react-query';
import { getBatchInventory } from '@/utils/batchUtils';
import { BatchInventory } from '@/types'; // Import from types directory

/**
 * Hook to fetch batch inventory data
 */
export const useBatchInventory = (batchId: string) => {
  return useQuery({
    queryKey: ['batchInventory', batchId],
    queryFn: () => getBatchInventory(batchId),
    enabled: !!batchId,
  });
};
