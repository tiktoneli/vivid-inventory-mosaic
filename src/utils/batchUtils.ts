
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BatchWithCategory } from '@/hooks/useBatches';

/**
 * Fetches a batch by ID with category information and calculated stock
 */
export const getBatchById = async (id: string): Promise<BatchWithCategory | null> => {
  try {
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
      throw new Error(`Failed to fetch batch: ${error.message}`);
    }
    
    if (!data) {
      throw new Error('Batch not found');
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
  } catch (error) {
    console.error('Error in getBatchById:', error);
    throw error;
  }
};

/**
 * Fetches batch inventory data by batch ID
 */
export const getBatchInventory = async (batchId: string) => {
  try {
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
  } catch (error) {
    console.error('Error in getBatchInventory:', error);
    throw error;
  }
};

/**
 * Fetches all batch items for a specific batch
 */
export const getBatchItems = async (batchId: string) => {
  try {
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

    return data || [];
  } catch (error) {
    console.error('Error in getBatchItems:', error);
    throw error;
  }
};
