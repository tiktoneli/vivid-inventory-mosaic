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
    // Create the inventory movement record
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

    // For product items, we would now need to update the status or location of specific product items
    // based on the movement type instead of directly updating stock quantity
    
    // This depends on the business logic - for example, for "out" movements, 
    // we might need to mark specific items as "sold" or "transferred"
    
    // For this MVP, we'll keep the existing interface but the actual inventory
    // is tracked at the item level now

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
