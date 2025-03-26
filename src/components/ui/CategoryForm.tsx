
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

// Define the attribute options that can be selected for a category
const optionalAttributes = [
  { id: 'manufacturer', name: 'Manufacturer' },
  { id: 'unitCost', name: 'Unit Cost/Price' },
  { id: 'serialNumber', name: 'Serial Number' },
  { id: 'macAddress', name: 'MAC Address' },
  { id: 'warrantyInfo', name: 'Warranty Information' },
  { id: 'firmwareVersion', name: 'Firmware Version' },
  { id: 'licenseKeys', name: 'Software License Keys' },
  { id: 'compatibilityInfo', name: 'Compatibility Information' },
  { id: 'networkSpecs', name: 'Network Specifications' },
  { id: 'powerConsumption', name: 'Power Consumption' },
  { id: 'lifecycleStatus', name: 'Lifecycle Status' }
];

// Schema for category validation
const categorySchema = z.object({
  name: z.string().min(2, { message: 'Category name must be at least 2 characters.' }),
  description: z.string().optional(),
  attributes: z.array(z.string()).optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  initialValues?: Partial<CategoryFormValues>;
  onSubmit: (values: CategoryFormValues) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const CategoryForm = ({
  initialValues,
  onSubmit,
  onCancel,
  isEditing = false
}: CategoryFormProps) => {
  const { toast } = useToast();
  
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: initialValues || {
      name: '',
      description: '',
      attributes: [],
    },
  });

  const handleSubmit = (values: CategoryFormValues) => {
    toast({
      title: isEditing ? "Category Updated" : "Category Created",
      description: `${values.name} has been successfully ${isEditing ? 'updated' : 'created'}.`,
    });
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name *</FormLabel>
              <FormControl>
                <Input placeholder="Enter category name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter a description for this category" 
                  className="min-h-[100px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div>
          <FormLabel className="block mb-2">Optional Attributes</FormLabel>
          <FormDescription className="mb-4">
            Select the attributes that products in this category can have. These will appear as optional fields when creating products in this category.
          </FormDescription>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {optionalAttributes.map((attribute) => (
              <FormField
                key={attribute.id}
                control={form.control}
                name="attributes"
                render={({ field }) => {
                  return (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3">
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(attribute.id)}
                          onCheckedChange={(checked) => {
                            const updatedAttributes = checked
                              ? [...(field.value || []), attribute.id]
                              : (field.value || []).filter((value) => value !== attribute.id);
                            field.onChange(updatedAttributes);
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">{attribute.name}</FormLabel>
                    </FormItem>
                  );
                }}
              />
            ))}
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-[#00859e] hover:bg-[#00859e]/90">
            {isEditing ? 'Update Category' : 'Create Category'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CategoryForm;
