import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useBatchItems } from '@/hooks/useBatchItems';
import { BatchItem, BatchItemStatus, BatchItemFormValues, Location } from '@/types';

// Define the form schema
const formSchema = z.object({
  serial_number: z.string().min(1, "Serial number is required"),
  sku: z.string().min(1, "SKU is required"),
  location_id: z.string().min(1, "Location is required"),
  status: z.enum(["available", "in_use", "maintenance", "retired"]).default("available"),
  notes: z.string().optional(),
});

interface BatchItemFormProps {
  initialValues?: any;
  onSubmit?: (values: BatchItemFormValues) => void;
  onCancel: () => void;
  locations: Location[];
  isEditing?: boolean;
  batchId: string;
  item?: BatchItem;
}

const BatchItemForm = ({
  initialValues,
  onSubmit,
  onCancel,
  locations,
  isEditing = false,
  batchId,
  item,
}: BatchItemFormProps) => {
  const { createBatchItem, updateBatchItem } = useBatchItems(batchId);
  
  // Initialize the form with default values or initial values if editing
  const form = useForm<BatchItemFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serial_number: item?.serial_number || initialValues?.serial_number || '',
      sku: item?.sku || initialValues?.sku || '',
      location_id: item?.location_id || initialValues?.location_id || '',
      status: item?.status || initialValues?.status || 'available',
      notes: item?.notes || initialValues?.notes || '',
    },
  });

  const handleSubmit = (values: BatchItemFormValues) => {
    if (onSubmit) {
      onSubmit(values);
    } else {
      // Use the hook functions directly if no onSubmit was provided
      if (isEditing && item) {
        // Fix: Pass the item id and the updated data to the updateBatchItem function
        updateBatchItem({ 
          id: item.id, 
          data: {
            batch_id: batchId,
            serial_number: values.serial_number,
            sku: values.sku,
            location_id: values.location_id,
            status: values.status,
            notes: values.notes || null,
          }
        });
      } else {
        createBatchItem({
          batch_id: batchId,
          sku: values.sku, // Ensure sku is explicitly passed
          serial_number: values.serial_number,
          location_id: values.location_id,
          status: values.status,
          notes: values.notes || null,
        });
      }
      onCancel();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="serial_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Serial Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter serial number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sku"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SKU</FormLabel>
              <FormControl>
                <Input placeholder="Enter SKU" {...field} />
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
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a location" />
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

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="in_use">In Use</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="retired">Retired</SelectItem>
                </SelectContent>
              </Select>
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
                <Textarea placeholder="Enter additional notes" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-[#00859e] hover:bg-[#00859e]/90">
            {isEditing ? 'Update Item' : 'Add Item'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BatchItemForm;
