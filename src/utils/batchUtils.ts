
import { supabase } from '@/integrations/supabase/client';
import { BatchWithCategory } from '@/types';

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
