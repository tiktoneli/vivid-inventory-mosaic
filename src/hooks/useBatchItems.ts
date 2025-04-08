
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BatchItem } from '@/components/pages/BatchItemsPage';

export type BatchItemInput = Omit<BatchItem, 'id' | 'created_at' | 'updated_at'>;

export const useBatchItems = (batchId?: string) => {
  const queryClient = useQueryClient();

  const fetchBatchItems = async (): Promise<BatchItem[]> => {
    let query = supabase
      .from('batch_items')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (batchId) {
      query = query.eq('batch_id', batchId);
    }
    
    const { data, error } = await query;

    if (error) {
      toast.error('Failed to fetch batch items', {
        description: error.message,
      });
      throw error;
    }

    // Explicitly cast the status to ensure it's the correct type
    return (data || []).map(item => ({
      ...item,
      status: item.status as "available" | "in_use" | "maintenance" | "retired"
    }));
  };

  const createBatchItem = async (batchItem: BatchItemInput): Promise<BatchItem> => {
    const { data, error } = await supabase
      .from('batch_items')
      .insert([{ 
        ...batchItem, 
        created_at: new Date().toISOString(),
        // Ensure serial_number is explicitly set to null if not provided
        serial_number: batchItem.serial_number || null
      }])
      .select()
      .single();

    if (error) {
      toast.error('Failed to create batch item', {
        description: error.message,
      });
      throw error;
    }

    // Cast the status to ensure it's the correct type
    return {
      ...data,
      status: data.status as "available" | "in_use" | "maintenance" | "retired"
    };
  };

  const updateBatchItem = async ({ id, data }: { id: string; data: Partial<BatchItemInput> }): Promise<BatchItem> => {
    const { data: updatedItem, error } = await supabase
      .from('batch_items')
      .update({ 
        ...data, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      toast.error('Failed to update batch item', {
        description: error.message,
      });
      throw error;
    }

    // Cast the status to ensure it's the correct type
    return {
      ...updatedItem,
      status: updatedItem.status as "available" | "in_use" | "maintenance" | "retired"
    };
  };

  const deleteBatchItem = async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('batch_items')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete batch item', {
        description: error.message,
      });
      throw error;
    }
  };

  // Create multiple batch items at once with enhanced options
  const createMultipleItems = async ({
    batchId,
    locationId,
    quantity,
    prefix = '',
    notes = ''
  }: {
    batchId: string;
    locationId: string;
    quantity: number;
    prefix?: string;
    notes?: string;
  }): Promise<number> => {
    let successCount = 0;
    
    for (let i = 0; i < quantity; i++) {
      try {
        await createBatchItem({
          batch_id: batchId,
          sku: prefix || '',
          // Create serial numbers with prefixes if provided
          serial_number: prefix ? `${prefix}-${i+1}` : null,
          location_id: locationId,
          status: "available",
          notes: notes || "Auto-generated item"
        });
        successCount++;
      } catch (error) {
        console.error("Error creating item", error);
      }
    }
    
    return successCount;
  };

  const batchItemsQuery = useQuery({
    queryKey: ['batchItems', batchId],
    queryFn: fetchBatchItems,
    enabled: !!batchId,
  });

  const createBatchItemMutation = useMutation({
    mutationFn: createBatchItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batchItems'] });
      queryClient.invalidateQueries({ queryKey: ['batches'] });
      toast.success('Batch item created successfully');
    },
  });

  const updateBatchItemMutation = useMutation({
    mutationFn: updateBatchItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batchItems'] });
      queryClient.invalidateQueries({ queryKey: ['batches'] });
      toast.success('Batch item updated successfully');
    },
  });

  const deleteBatchItemMutation = useMutation({
    mutationFn: deleteBatchItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batchItems'] });
      queryClient.invalidateQueries({ queryKey: ['batches'] });
      toast.success('Batch item deleted successfully');
    },
  });

  const createMultipleItemsMutation = useMutation({
    mutationFn: createMultipleItems,
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: ['batchItems'] });
      queryClient.invalidateQueries({ queryKey: ['batches'] });
      toast.success(`Successfully created ${count} batch items`);
    },
  });

  return {
    batchItems: batchItemsQuery.data || [],
    isLoading: batchItemsQuery.isLoading,
    isError: batchItemsQuery.isError,
    error: batchItemsQuery.error,
    createBatchItem: createBatchItemMutation.mutate,
    updateBatchItem: updateBatchItemMutation.mutate,
    deleteBatchItem: deleteBatchItemMutation.mutate,
    createMultipleItems: createMultipleItemsMutation.mutate,
  };
};
