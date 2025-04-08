
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type Batch = {
  id: string;
  name: string;
  sku: string;
  description: string | null;
  category_id: string;
  min_stock: number;
  price: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
  manufacturer: string | null;
  serial_number: string | null;
  warranty_info: string | null;
  firmware_version: string | null;
  mac_address: string | null;
  network_specs: string | null;
  license_keys: string | null;
  compatibility_info: string | null;
  power_consumption: string | null;
  lifecycle_status: string | null;
  batch_code?: string | null; // Make this optional
  location?: string; // Make this optional since we're using locations array instead
};

export type BatchWithCategory = Omit<Batch, 'location'> & {
  categories: {
    name: string;
  };
  stock?: number; // Calculated from batch_items
  locations?: string[]; // Array of location names for this batch's items
};

export type BatchInput = Omit<Batch, 'id' | 'created_at' | 'updated_at'>;

export type BatchItem = {
  id: string;
  batch_id: string;
  serial_number: string | null;
  sku: string;
  location_id: string;
  status: "available" | "in_use" | "maintenance" | "retired";
  notes: string | null;
  created_at: string;
  updated_at: string | null;
};

export type BatchInventory = {
  batch_id: string | null;
  batch_name: string | null;
  category_id: string | null;
  location_id: string | null;
  location_name: string | null;
  quantity: number | null;
};

export const useBatches = () => {
  const queryClient = useQueryClient();

  // Add the getBatchById function
  const getBatchById = async (id: string): Promise<BatchWithCategory | null> => {
    const { data, error } = await supabase
      .from('batches')
      .select(`
        *,
        categories:category_id (
          name
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching batch:', error);
      return null;
    }
    
    // Get stock count
    const { data: stockData, error: stockError } = await supabase.rpc(
      'get_batch_total_stock',
      { p_batch_id: data.id }
    );

    if (stockError) {
      console.error('Error fetching stock data:', stockError);
    }
    
    // Get item locations
    const { data: itemsData, error: itemsError } = await supabase
      .from('batch_items')
      .select('location_id')
      .eq('batch_id', data.id);
      
    if (itemsError) {
      console.error('Error fetching item locations:', itemsError);
    }
    
    // Get unique location IDs
    const locationIds = itemsData ? [...new Set(itemsData.map(item => item.location_id))] : [];
    
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
    
    const batchWithCategory: BatchWithCategory = {
      ...data,
      stock: stockData || 0,
      locations: locationNames
    };
    
    return batchWithCategory;
  };

  // Create a query for a single batch
  const useSingleBatchQuery = (id: string | undefined) => {
    return useQuery({
      queryKey: ['batch', id],
      queryFn: () => id ? getBatchById(id) : null,
      enabled: !!id,
    });
  };

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

  const getBatchInventory = async (batchId: string): Promise<BatchInventory[]> => {
    const { data, error } = await supabase
      .from('batch_inventory')
      .select('*')
      .eq('batch_id', batchId);

    if (error) {
      toast.error('Failed to fetch batch inventory', {
        description: error.message,
      });
      throw error;
    }

    return data || [];
  };

  const getBatchItems = async (batchId: string): Promise<BatchItem[]> => {
    const { data, error } = await supabase
      .from('batch_items')
      .select('*')
      .eq('batch_id', batchId);

    if (error) {
      toast.error('Failed to fetch batch items', {
        description: error.message,
      });
      throw error;
    }

    return data as unknown as BatchItem[];
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
    getBatchInventory,
    getBatchItems,
    getBatchById, // Export the new function
    useSingleBatchQuery, // Export the new query hook
  };
};
