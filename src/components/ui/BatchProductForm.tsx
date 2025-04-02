
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

// Schema for batch product validation
const batchProductSchema = z.object({
  products: z.array(
    z.object({
      name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
      sku: z.string().min(3, { message: 'SKU must be at least 3 characters.' }),
      category_id: z.string().min(1, { message: 'Category is required.' }),
      location: z.string().min(1, { message: 'Location is required.' }),
      min_stock: z.coerce.number().min(0, { message: 'Minimum stock cannot be negative.' }).default(0),
      is_active: z.boolean().default(true),
    })
  ).min(1, { message: 'Add at least one product.' }),
});

type BatchProductFormValues = z.infer<typeof batchProductSchema>;

interface BatchProductFormProps {
  onSubmit: (values: any[]) => void;
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
          sku: '',
          category_id: '',
          location: '',
          min_stock: 0,
          is_active: true,
        }
      ]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "products"
  });

  const handleSubmit = (values: BatchProductFormValues) => {
    onSubmit(values.products);
  };

  const addProduct = () => {
    append({
      name: '',
      sku: '',
      category_id: '',
      location: '',
      min_stock: 0,
      is_active: true,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-6">
          {fields.map((field, index) => (
            <div key={field.id} className="p-4 border rounded-md relative">
              <div className="absolute top-3 right-3">
                {fields.length > 1 && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    onClick={() => remove(index)}
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <h3 className="text-sm font-medium mb-4">Product {index + 1}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`products.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Product name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`products.${index}.sku`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU * (Unique)</FormLabel>
                      <FormControl>
                        <Input placeholder="Product SKU" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
                      <FormLabel>Location *</FormLabel>
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
              
              <div className="mt-4">
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
            </div>
          ))}
        </div>
        
        <Button
          type="button"
          variant="outline"
          className="w-full border-dashed border-2 bg-background hover:bg-muted"
          onClick={addProduct}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Another Product
        </Button>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-[#00859e] hover:bg-[#00859e]/90">
            Add {fields.length} {fields.length === 1 ? 'Product' : 'Products'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BatchProductForm;
