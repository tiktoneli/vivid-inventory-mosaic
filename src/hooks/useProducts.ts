
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export type Product = {
  id: string;
  name: string;
  sku: string;
  description: string | null;
  category_id: string;
  location: string;
  stock: number;
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
};

export type ProductWithCategory = Product & {
  categories: {
    name: string;
  };
};

export type ProductInput = Omit<Product, 'id' | 'created_at' | 'updated_at'>;

export const useProducts = () => {
  const queryClient = useQueryClient();

  const fetchProducts = async (): Promise<ProductWithCategory[]> => {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories:category_id (
          name
        )
      `)
      .order('name');

    if (error) {
      toast.error('Failed to fetch products', {
        description: error.message,
      });
      throw error;
    }

    return data;
  };

  const createProduct = async (product: ProductInput): Promise<Product> => {
    // Make sure we've got the correct location ID
    const { data, error } = await supabase
      .from('products')
      .insert([{ 
        ...product, 
        created_at: new Date().toISOString() 
      }])
      .select()
      .single();

    if (error) {
      console.error('Product creation error:', error);
      toast.error('Failed to create product', {
        description: error.message,
      });
      throw error;
    }

    return data;
  };

  const updateProduct = async (id: string, product: Partial<ProductInput>): Promise<Product> => {
    const { data, error } = await supabase
      .from('products')
      .update({ 
        ...product, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      toast.error('Failed to update product', {
        description: error.message,
      });
      throw error;
    }

    return data;
  };

  const deleteProduct = async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete product', {
        description: error.message,
      });
      throw error;
    }
  };

  const productsQuery = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const createProductMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product created successfully');
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProductInput> }) => 
      updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product updated successfully');
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product deleted successfully');
    },
  });

  return {
    products: productsQuery.data || [],
    isLoading: productsQuery.isLoading,
    isError: productsQuery.isError,
    error: productsQuery.error,
    createProduct: createProductMutation.mutate,
    updateProduct: updateProductMutation.mutate,
    deleteProduct: deleteProductMutation.mutate,
  };
};
