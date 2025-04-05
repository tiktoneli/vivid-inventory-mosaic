
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { ProductItem } from '@/components/pages/ProductItemsPage';

export type ProductItemInput = Omit<ProductItem, 'id' | 'created_at' | 'updated_at'>;

export const useProductItems = (productId?: string) => {
  const queryClient = useQueryClient();

  const fetchProductItems = async (): Promise<ProductItem[]> => {
    let query = supabase
      .from('product_items')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (productId) {
      query = query.eq('product_id', productId);
    }
    
    const { data, error } = await query;

    if (error) {
      toast.error('Failed to fetch product items', {
        description: error.message,
      });
      throw error;
    }

    return data || [];
  };

  const createProductItem = async (item: ProductItemInput): Promise<ProductItem> => {
    const { data, error } = await supabase
      .from('product_items')
      .insert([{ 
        ...item, 
        created_at: new Date().toISOString() 
      }])
      .select()
      .single();

    if (error) {
      toast.error('Failed to create product item', {
        description: error.message,
      });
      throw error;
    }

    return data;
  };

  const updateProductItem = async ({ id, data }: { id: string; data: Partial<ProductItemInput> }): Promise<ProductItem> => {
    const { data: updatedItem, error } = await supabase
      .from('product_items')
      .update({ 
        ...data, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      toast.error('Failed to update product item', {
        description: error.message,
      });
      throw error;
    }

    return updatedItem;
  };

  const deleteProductItem = async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('product_items')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete product item', {
        description: error.message,
      });
      throw error;
    }
  };

  const productItemsQuery = useQuery({
    queryKey: ['productItems', productId],
    queryFn: fetchProductItems,
    enabled: !!productId,
  });

  const createProductItemMutation = useMutation({
    mutationFn: createProductItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productItems'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product item created successfully');
    },
  });

  const updateProductItemMutation = useMutation({
    mutationFn: updateProductItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productItems'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product item updated successfully');
    },
  });

  const deleteProductItemMutation = useMutation({
    mutationFn: deleteProductItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productItems'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product item deleted successfully');
    },
  });

  return {
    productItems: productItemsQuery.data || [],
    isLoading: productItemsQuery.isLoading,
    isError: productItemsQuery.isError,
    error: productItemsQuery.error,
    createProductItem: createProductItemMutation.mutate,
    updateProductItem: updateProductItemMutation.mutate,
    deleteProductItem: deleteProductItemMutation.mutate,
  };
};
