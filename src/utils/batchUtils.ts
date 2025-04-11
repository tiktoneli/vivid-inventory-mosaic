
import { supabase } from '@/integrations/supabase/client';
import { BatchWithCategory, BatchInventory } from '@/types';

export const getBatchById = async (id: string): Promise<BatchWithCategory | null> => {
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
    throw new Error(`Failed to fetch batch: ${error.message}`);
  }
  
  if (!data) return null;

  // Get stock count
  const { data: stockData, error: stockError } = await supabase.rpc(
    'get_batch_total_stock',
    { p_batch_id: id }
  );
  
  if (stockError) {
    console.error('Error fetching stock data:', stockError);
  }
  
  return { 
    ...data, 
    stock: stockData || 0 
  } as BatchWithCategory;
};

// Add the missing getBatchInventory function
export const getBatchInventory = async (batchId: string): Promise<BatchInventory[]> => {
  // Query the batch_inventory view or function to get inventory data
  const { data, error } = await supabase
    .from('batch_inventory')
    .select('*')
    .eq('batch_id', batchId);
    
  if (error) {
    console.error('Error fetching batch inventory:', error);
    throw new Error(`Failed to fetch batch inventory: ${error.message}`);
  }
  
  return data as BatchInventory[];
};
