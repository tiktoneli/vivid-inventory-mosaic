
import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { Category } from '@/hooks/useCategories';
import { Location } from '@/hooks/useLocations';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';

// Schema for batch product validation
const batchProductSchema = z.object({
  products: z.array(
    z.object({
      name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
      batch_code: z.string().min(3, { message: 'Batch code must be at least 3 characters.' }),
      category_id: z.string().min(1, { message: 'Category is required.' }),
      location: z.string().min(1, { message: 'Location is required.' }),
      min_stock: z.coerce.number().min(0, { message: 'Minimum stock cannot be negative.' }).default(0),
      is_active: z.boolean().default(true),
      description: z.string().optional(),
    })
  ).min(1, { message: 'Add at least one batch.' }),
  quickAdd: z.object({
    enabled: z.boolean().default(false),
    quantity: z.coerce.number().min(1, { message: 'Quantity must be at least 1.' }).default(1),
  }),
});

type BatchProductFormValues = z.infer<typeof batchProductSchema>;

interface BatchProductFormProps {
  onSubmit: (values: any[], quickAdd: { enabled: boolean; quantity: number }) => void;
  onCancel: () => void;
  categories: Category[];
  locations: Location[];
}

const BatchProductForm = ({ 
  onSubmit,
  onCancel,
  categories,
  locations,
}: BatchProductFormProps) => {
  const form = useForm<BatchProductFormValues>({
    resolver: zodResolver(batchProductSchema),
    defaultValues: {
      products: [
        {
          name: '',
          batch_code: '',
          category_id: '',
          location: '',
          min_stock: 0,
          is_active: true,
          description: '',
        }
      ],
      quickAdd: {
        enabled: false,
        quantity: 1
      }
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "products"
  });

  const handleSubmit = (values: BatchProductFormValues) => {
    onSubmit(values.products, values.quickAdd);
  };

  const addProduct = () => {
    append({
      name: '',
      batch_code: '',
      category_id: '',
      location: '',
      min_stock: 0,
      is_active: true,
      description: '',
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <ScrollArea className="max-h-[60vh] overflow-y-auto pr-2 -mr-2">
          <div className="space-y-6">
            {fields.map((field, index) => (
              <div key={field.id} className="p-3 sm:p-4 border rounded-md relative">
                <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                  {fields.length > 1 && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={() => remove(index)}
                      className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <h3 className="text-sm font-medium mb-3 sm:mb-4">Batch {index + 1}</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <FormField
                    control={form.control}
                    name={`products.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Batch name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`products.${index}.batch_code`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Batch Code * (Unique)</FormLabel>
                        <FormControl>
                          <Input placeholder="Batch code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3 sm:mt-4">
                  <FormField
                    control={form.control}
                    name={`products.${index}.category_id`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category *</FormLabel>
                        <Select 
                          value={field.value} 
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map(category => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
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
                    name={`products.${index}.location`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Storage Location *</FormLabel>
                        <Select 
                          value={field.value} 
                          onValueChange={field.onChange}
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
                
                <div className="mt-3 sm:mt-4">
                  <FormField
                    control={form.control}
                    name={`products.${index}.min_stock`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Stock Level</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Minimum stock level" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormDescription>
                          System will alert when stock falls below this level
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mt-3 sm:mt-4">
                  <FormField
                    control={form.control}
                    name={`products.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter batch description" 
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <Button
          type="button"
          variant="outline"
          className="w-full border-dashed border-2 bg-background hover:bg-muted"
          onClick={addProduct}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Another Batch
        </Button>
        
        <Separator />
        
        <div className="bg-muted/50 p-3 sm:p-4 rounded-lg">
          <h3 className="font-medium mb-2 sm:mb-3">Quick Item Addition</h3>
          <p className="text-sm text-muted-foreground mb-3 sm:mb-4">
            Enable this option to quickly add multiple items to a batch. Individual SKUs will be left blank for later editing.
          </p>
          
          <div className="flex items-center justify-between">
            <FormField
              control={form.control}
              name="quickAdd.enabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-md">
                  <div className="space-y-0.5">
                    <FormLabel>Enable Quick Addition</FormLabel>
                    <FormDescription>
                      Add multiple items in one go
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          
          {form.watch("quickAdd.enabled") && (
            <div className="mt-3 sm:mt-4">
              <FormField
                control={form.control}
                name="quickAdd.quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Items to Add</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        placeholder="Enter quantity"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      />
                    </FormControl>
                    <FormDescription>
                      These items will inherit batch properties but have unique identifiers
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-2 pt-3 sm:pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-[#00859e] hover:bg-[#00859e]/90">
            Add {fields.length} {fields.length === 1 ? 'Batch' : 'Batches'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BatchProductForm;
