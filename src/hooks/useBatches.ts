import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { getBatchById } from '@/utils/batchUtils';
import { useSingleBatch } from './useSingleBatch';
import { Batch, BatchInput, BatchWithCategory, BatchItem, BatchInventory } from '@/types';

export const useBatches = () => {
  const queryClient = useQueryClient();

  const fetchBatches = async (): Promise<BatchWithCategory[]> => {
    // Fetch basic batch data
    const { data: batchesData, error: batchesError } = await supabase
      .from('batches')
      .select(`
        *,
        categories:category_id (
          name
        )
      `)
      .order('name');

    if (batchesError) {
      toast.error('Failed to fetch batches', {
        description: batchesError.message,
      });
      throw batchesError;
    }

    // Fetch inventory data for each batch
    const batchesWithStock = await Promise.all(
      batchesData.map(async (batch) => {
        // Get stock count
        const { data: stockData, error: stockError } = await supabase.rpc(
          'get_batch_total_stock',
          { p_batch_id: batch.id }
        );

        if (stockError) {
          console.error('Error fetching stock data:', stockError);
          return { ...batch, stock: 0, locations: [] } as BatchWithCategory;
        }

        // Get item locations
        const { data: itemsData, error: itemsError } = await supabase
          .from('batch_items')
          .select('location_id')
          .eq('batch_id', batch.id);
          
        if (itemsError) {
          console.error('Error fetching item locations:', itemsError);
          return { 
            ...batch, 
            stock: stockData || 0,
            locations: []
          } as BatchWithCategory;
        }
        
        // Get unique location IDs
        const locationIds = [...new Set(itemsData.map(item => item.location_id))];
        
        // Fetch location names if there are any items
        let locationNames: string[] = [];
        if (locationIds.length > 0) {
          const { data: locationsData, error: locationsError } = await supabase
            .from('locations')
            .select('name')
            .in('id', locationIds);
            
          if (!locationsError && locationsData) {
            locationNames = locationsData.map(loc => loc.name);
          }
        }
        
        return { 
          ...batch, 
          stock: stockData || 0,
          locations: locationNames
        } as BatchWithCategory;
      })
    );

    return batchesWithStock;
  };

  const createBatch = async (batch: BatchInput): Promise<Batch> => {
    const batchToCreate = { ...batch }; 
    // Remove the location property if it exists since we don't need it in the database
    if ('location' in batchToCreate) {
      delete (batchToCreate as any).location;
    }
    
    const { data, error } = await supabase
      .from('batches')
      .insert([{ 
        ...batchToCreate, 
        created_at: new Date().toISOString() 
      }])
      .select()
      .single();

    if (error) {
      console.error('Batch creation error:', error);
      toast.error('Failed to create batch', {
        description: error.message,
      });
      throw error;
    }

    return data;
  };

  const updateBatch = async ({ id, data: batch }: { id: string; data: Partial<BatchInput> }): Promise<Batch> => {
    const batchToUpdate = { ...batch }; 
    // Remove the location property if it exists since we don't need it in the database
    if ('location' in batchToUpdate) {
      delete (batchToUpdate as any).location;
    }
    
    const { data, error } = await supabase
      .from('batches')
      .update({ 
        ...batchToUpdate, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      toast.error('Failed to update batch', {
        description: error.message,
      });
      throw error;
    }

    return data;
  };

  const deleteBatch = async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('batches')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete batch', {
        description: error.message,
      });
      throw error;
    }
  };

  // New functions for batch items
  const createBatchItem = async (batchItem: Omit<BatchItem, 'id' | 'created_at' | 'updated_at'>): Promise<BatchItem> => {
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

    return data as unknown as BatchItem;
  };

  const createBatchItems = async ({
    batchId,
    locationId,
    quantity,
    basePrefix = '',
    notes = 'Auto-generated batch item'
  }: {
    batchId: string;
    locationId: string;
    quantity: number;
    basePrefix?: string;
    notes?: string;
  }): Promise<number> => {
    let successCount = 0;
    
    for (let i = 0; i < quantity; i++) {
      try {
        // Create batch item with customizable serial number prefix and notes
        await createBatchItem({
          batch_id: batchId,
          sku: basePrefix || '',
          serial_number: basePrefix ? `${basePrefix}-${i+1}` : null,
          location_id: locationId,
          status: "available",
          notes: notes || "Auto-generated batch item"
        });
        successCount++;
      } catch (error) {
        console.error("Error creating item", error);
      }
    }
    
    return successCount;
  };

  // React Query hooks
  const batchesQuery = useQuery({
    queryKey: ['batches'],
    queryFn: fetchBatches,
  });

  const createBatchMutation = useMutation({
    mutationFn: createBatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
      toast.success('Batch created successfully');
    },
  });

  const updateBatchMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BatchInput> }) => 
      updateBatch({id, data}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
      toast.success('Batch updated successfully');
    },
  });

  const deleteBatchMutation = useMutation({
    mutationFn: deleteBatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
      toast.success('Batch deleted successfully');
    },
  });

  const createBatchItemMutation = useMutation({
    mutationFn: createBatchItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
      queryClient.invalidateQueries({ queryKey: ['batchItems'] });
      toast.success('Batch item created successfully');
    },
  });

  const createBatchItemsMutation = useMutation({
    mutationFn: createBatchItems,
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
      queryClient.invalidateQueries({ queryKey: ['batchItems'] });
      toast.success(`Successfully created ${count} batch items`);
    },
  });

  return {
    batches: batchesQuery.data || [],
    isLoading: batchesQuery.isLoading,
    isError: batchesQuery.isError,
    error: batchesQuery.error,
    createBatch: createBatchMutation.mutateAsync, // Using mutateAsync to get the returned batch
    updateBatch: updateBatchMutation.mutate,
    deleteBatch: deleteBatchMutation.mutate,
    createBatchItem: createBatchItemMutation.mutate,
    createBatchItems: createBatchItemsMutation.mutate,
    useSingleBatch, // Export the hook instead of the function
  };
};
