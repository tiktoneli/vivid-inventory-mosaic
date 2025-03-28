
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export type InventoryMovement = {
  id: string;
  type: string;
  reference: string;
  product_id: string;
  quantity: number;
  location: string;
  username: string | null;
  notes: string | null;
  created_at: string;
};

export type InventoryMovementWithProduct = InventoryMovement & {
  products: {
    name: string;
  };
};

export type InventoryMovementInput = Omit<InventoryMovement, 'id' | 'created_at'>;

export const useInventoryMovements = () => {
  const queryClient = useQueryClient();

  const fetchInventoryMovements = async (): Promise<InventoryMovementWithProduct[]> => {
    const { data, error } = await supabase
      .from('inventory_movements')
      .select(`
        *,
        products:product_id (
          name
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to fetch inventory movements', {
        description: error.message,
      });
      throw error;
    }

    return data;
  };

  const createInventoryMovement = async (movement: InventoryMovementInput): Promise<InventoryMovement> => {
    // Start a transaction
    const { data: movementData, error: movementError } = await supabase
      .from('inventory_movements')
      .insert([{ 
        ...movement, 
        created_at: new Date().toISOString() 
      }])
      .select()
      .single();

    if (movementError) {
      toast.error('Failed to create inventory movement', {
        description: movementError.message,
      });
      throw movementError;
    }

    // Update product stock
    const stockChange = movement.type === 'out' || (movement.type === 'adjustment' && movement.quantity < 0) 
      ? -Math.abs(movement.quantity) 
      : movement.quantity;
    
    const { error: productError } = await supabase.rpc('update_product_stock', {
      p_product_id: movement.product_id,
      p_quantity: stockChange
    });

    if (productError) {
      toast.error('Failed to update product stock', {
        description: productError.message,
      });
      throw productError;
    }

    return movementData;
  };

  const inventoryMovementsQuery = useQuery({
    queryKey: ['inventoryMovements'],
    queryFn: fetchInventoryMovements,
  });

  const createInventoryMovementMutation = useMutation({
    mutationFn: createInventoryMovement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventoryMovements'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Inventory movement recorded successfully');
    },
  });

  return {
    inventoryMovements: inventoryMovementsQuery.data || [],
    isLoading: inventoryMovementsQuery.isLoading,
    isError: inventoryMovementsQuery.isError,
    error: inventoryMovementsQuery.error,
    createInventoryMovement: createInventoryMovementMutation.mutate,
  };
};
