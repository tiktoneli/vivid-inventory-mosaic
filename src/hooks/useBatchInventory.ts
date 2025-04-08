
import { useQuery } from '@tanstack/react-query';
import { getBatchInventory } from '@/utils/batchUtils';

export type BatchInventory = {
  batch_id: string | null;
  batch_name: string | null;
  category_id: string | null;
  location_id: string | null;
  location_name: string | null;
  quantity: number | null;
};

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
