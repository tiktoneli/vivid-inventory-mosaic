
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export type Location = {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
};

export type LocationInput = Omit<Location, 'id' | 'created_at' | 'updated_at'>;

export const useLocations = () => {
  const queryClient = useQueryClient();

  const fetchLocations = async (): Promise<Location[]> => {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .order('name');

    if (error) {
      toast.error('Failed to fetch locations', {
        description: error.message,
      });
      throw error;
    }

    return data;
  };

  const createLocation = async (location: LocationInput): Promise<Location> => {
    const { data, error } = await supabase
      .from('locations')
      .insert([{ 
        ...location, 
        created_at: new Date().toISOString() 
      }])
      .select()
      .single();

    if (error) {
      toast.error('Failed to create location', {
        description: error.message,
      });
      throw error;
    }

    return data;
  };

  const updateLocation = async (id: string, location: Partial<LocationInput>): Promise<Location> => {
    // No need to explicitly set updated_at as it's handled by the database trigger
    const { data, error } = await supabase
      .from('locations')
      .update(location)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      toast.error('Failed to update location', {
        description: error.message,
      });
      throw error;
    }

    return data;
  };

  const deleteLocation = async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('locations')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete location', {
        description: error.message,
      });
      throw error;
    }
  };

  const locationsQuery = useQuery({
    queryKey: ['locations'],
    queryFn: fetchLocations,
  });

  const createLocationMutation = useMutation({
    mutationFn: createLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      toast.success('Location created successfully');
    },
  });

  const updateLocationMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<LocationInput> }) => 
      updateLocation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      toast.success('Location updated successfully');
    },
  });

  const deleteLocationMutation = useMutation({
    mutationFn: deleteLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      toast.success('Location deleted successfully');
    },
  });

  return {
    locations: locationsQuery.data || [],
    isLoading: locationsQuery.isLoading,
    isError: locationsQuery.isError,
    error: locationsQuery.error,
    createLocation: createLocationMutation.mutate,
    updateLocation: updateLocationMutation.mutate,
    deleteLocation: deleteLocationMutation.mutate,
  };
};
