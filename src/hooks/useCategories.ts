
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export type Category = {
  id: string;
  name: string;
  description: string | null;
  attributes: string[] | null;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
};

export type CategoryInput = Omit<Category, 'id' | 'created_at' | 'updated_at'>;

export const useCategories = () => {
  const queryClient = useQueryClient();

  const fetchCategories = async (): Promise<Category[]> => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) {
      toast.error('Failed to fetch categories', {
        description: error.message,
      });
      throw error;
    }

    return data;
  };

  const createCategory = async (category: CategoryInput): Promise<Category> => {
    const { data, error } = await supabase
      .from('categories')
      .insert([{ 
        ...category, 
        created_at: new Date().toISOString() 
      }])
      .select()
      .single();

    if (error) {
      toast.error('Failed to create category', {
        description: error.message,
      });
      throw error;
    }

    return data;
  };

  const updateCategory = async (id: string, category: Partial<CategoryInput>): Promise<Category> => {
    const { data, error } = await supabase
      .from('categories')
      .update({ 
        ...category, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      toast.error('Failed to update category', {
        description: error.message,
      });
      throw error;
    }

    return data;
  };

  const deleteCategory = async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete category', {
        description: error.message,
      });
      throw error;
    }
  };

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const createCategoryMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category created successfully');
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CategoryInput> }) => 
      updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category updated successfully');
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category deleted successfully');
    },
  });

  return {
    categories: categoriesQuery.data || [],
    isLoading: categoriesQuery.isLoading,
    isError: categoriesQuery.isError,
    error: categoriesQuery.error,
    createCategory: createCategoryMutation.mutate,
    updateCategory: updateCategoryMutation.mutate,
    deleteCategory: deleteCategoryMutation.mutate,
  };
};
