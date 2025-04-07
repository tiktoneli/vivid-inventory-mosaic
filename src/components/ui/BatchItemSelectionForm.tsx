
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useLocations } from '@/hooks/useLocations';
import { Loader2, Check, Search, Plus } from 'lucide-react';

// Define the form schema
const formSchema = z.object({
  quantity: z.coerce.number().min(1, { message: "At least 1 item is required" }).default(1),
  location_id: z.string().min(1, { message: "Location is required" }),
  prefix: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface BatchItemSelectionFormProps {
  onSubmit: (values: FormValues) => void;
  onCancel: () => void;
  batchId?: string;
}

const BatchItemSelectionForm = ({
  onSubmit,
  onCancel,
  batchId,
}: BatchItemSelectionFormProps) => {
  const { locations, isLoading, isError } = useLocations();

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: 1,
      location_id: locations?.length > 0 ? locations[0].id : '',
      prefix: '',
      notes: ''
    },
  });

  // Set location value when locations are loaded
  React.useEffect(() => {
    if (locations?.length > 0 && !form.getValues('location_id')) {
      form.setValue('location_id', locations[0].id);
    }
  }, [locations, form]);

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-[#00859e]" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <p>Error loading locations. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of items to create</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="1" 
                      {...field} 
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 1)} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {locations.map(location => (
                        <SelectItem key={location.id} value={location.id}>
                          {location.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="prefix"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SKU/Serial Number Prefix (Optional)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Custom prefix for generated serial numbers" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes (Optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Add any relevant notes for these items" 
                    className="min-h-[80px]" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-[#00859e] hover:bg-[#00859e]/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Items
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default BatchItemSelectionForm;
