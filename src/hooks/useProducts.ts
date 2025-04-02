
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
  stock?: number; // Calculated from product_items
};

export type ProductInput = Omit<Product, 'id' | 'created_at' | 'updated_at'>;

export type ProductItem = {
  id: string;
  product_id: string;
  serial_number: string;
  sku: string;
  location_id: string;
  status: "available" | "in_use" | "maintenance" | "retired";
  notes: string | null;
  created_at: string;
  updated_at: string | null;
};

export type ProductInventory = {
  product_id: string | null;
  product_name: string | null;
  category_id: string | null;
  location_id: string | null;
  location_name: string | null;
  quantity: number | null;
};

export const useProducts = () => {
  const queryClient = useQueryClient();

  const fetchProducts = async (): Promise<ProductWithCategory[]> => {
    // Fetch basic product data
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select(`
        *,
        categories:category_id (
          name
        )
      `)
      .order('name');

    if (productsError) {
      toast.error('Failed to fetch products', {
        description: productsError.message,
      });
      throw productsError;
    }

    // Fetch inventory data for each product
    const productsWithStock = await Promise.all(
      productsData.map(async (product) => {
        const { data: stockData, error: stockError } = await supabase.rpc(
          'get_product_total_stock',
          { p_product_id: product.id }
        );

        if (stockError) {
          console.error('Error fetching stock data:', stockError);
          return { ...product, stock: 0 };
        }

        return { 
          ...product, 
          stock: stockData || 0 
        };
      })
    );

    return productsWithStock;
  };

  const createProduct = async (product: ProductInput): Promise<Product> => {
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

  // New functions for product items

  const createProductItem = async (productItem: Omit<ProductItem, 'id' | 'created_at' | 'updated_at'>): Promise<ProductItem> => {
    const { data, error } = await supabase
      .from('product_items')
      .insert([{
        ...productItem,
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

  const createProductItems = async (
    productId: string,
    locationId: string,
    quantity: number,
    basePrefix: string = ''
  ): Promise<number> {
    let successCount = 0;
    
    for (let i = 0; i < quantity; i++) {
      try {
        // Create basic product item with auto-generated serial numbers
        await createProductItem({
          product_id: productId,
          sku: "", // Empty SKU to be filled later
          serial_number: basePrefix ? `${basePrefix}-${i+1}` : `ITEM-${Date.now()}-${i+1}`,
          location_id: locationId,
          status: "available",
          notes: "Auto-generated batch item"
        });
        successCount++;
      } catch (error) {
        console.error("Error creating item", error);
      }
    }
    
    return successCount;
  };

  const getProductInventory = async (productId: string): Promise<ProductInventory[]> => {
    const { data, error } = await supabase
      .from('product_inventory')
      .select('*')
      .eq('product_id', productId);

    if (error) {
      toast.error('Failed to fetch product inventory', {
        description: error.message,
      });
      throw error;
    }

    return data || [];
  };

  const getProductItems = async (productId: string): Promise<ProductItem[]> => {
    const { data, error } = await supabase
      .from('product_items')
      .select('*')
      .eq('product_id', productId);

    if (error) {
      toast.error('Failed to fetch product items', {
        description: error.message,
      });
      throw error;
    }

    return data || [];
  };

  // React Query hooks
  const productsQuery = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const createProductMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product batch created successfully');
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProductInput> }) => 
      updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product batch updated successfully');
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product batch deleted successfully');
    },
  });

  const createProductItemMutation = useMutation({
    mutationFn: createProductItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['productItems'] });
      toast.success('Product item created successfully');
    },
  });

  const createProductItemsMutation = useMutation({
    mutationFn: ({ productId, locationId, quantity, basePrefix }: { 
      productId: string; 
      locationId: string; 
      quantity: number; 
      basePrefix?: string 
    }) => createProductItems(productId, locationId, quantity, basePrefix),
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['productItems'] });
      toast.success(`Successfully created ${count} product items`);
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
    createProductItem: createProductItemMutation.mutate,
    createProductItems: createProductItemsMutation.mutate,
    getProductInventory,
    getProductItems,
  };
};
