
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Category } from '@/hooks/useCategories';
import { Label } from '@/components/ui/label';

// Define the form schema
const productSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  sku: z.string().min(1, { message: 'Batch code is required' }),
  category_id: z.string().min(1, { message: 'Category is required' }),
  min_stock: z.coerce.number().min(0, { message: 'Minimum stock cannot be negative' }).default(0),
  is_active: z.boolean().default(true),
  description: z.string().optional(),
  price: z.coerce.number().min(0).optional().nullable(),
  // Custom fields (can be expanded)
  manufacturer: z.string().optional().nullable(),
  warranty_info: z.string().optional().nullable(),
  lifecycle_status: z.string().optional().nullable(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialValues?: any;
  onSubmit: (values: any, quickAdd?: { enabled: boolean; quantity: number; location: string }) => void;
  onCancel: () => void;
  categories: { id: string; name: string; attributes: string[] }[];
  locations?: { id: string; name: string }[];
  isEditing?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  categories,
  locations = [],
  isEditing = false
}) => {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: initialValues || {
      name: '',
      sku: '',
      category_id: '',
      min_stock: 0,
      is_active: true,
      description: '',
      price: null,
      manufacturer: null,
      warranty_info: null,
      lifecycle_status: null,
    },
  });

  // Quick add state - enabled set to false by default to make it optional
  const [quickAdd, setQuickAdd] = useState({
    enabled: false, // Changed from !isEditing to false to make item creation optional
    quantity: 1,
    location: locations.length > 0 ? locations[0].id : '',
  });

  const handleSubmit = (values: ProductFormValues) => {
    onSubmit(values, quickAdd);
  };

  // Get selected category to show relevant attributes
  const selectedCategoryId = form.watch("category_id");
  const selectedCategory = categories.find(cat => cat.id === selectedCategoryId);
  
  // Determine if we should show standard optional fields
  const showManufacturer = selectedCategory && selectedCategory.attributes && 
                          selectedCategory.attributes.includes('manufacturer');
  const showWarrantyInfo = selectedCategory && selectedCategory.attributes && 
                          selectedCategory.attributes.includes('warranty_info');
  const showLifecycleStatus = selectedCategory && selectedCategory.attributes && 
                          selectedCategory.attributes.includes('lifecycle_status');
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="advanced">Additional Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Batch Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter batch name" {...field} />
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
                    <FormLabel>Batch Code * (Unique)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter batch code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category *</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="min_stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Stock Level</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0" 
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
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter batch description" 
                      className="min-h-[100px]" 
                      {...field} 
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit Price (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      placeholder="0.00" 
                      {...field}
                      value={field.value === null ? '' : field.value}
                      onChange={(e) => field.onChange(e.target.value === '' ? null : parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active Status</FormLabel>
                    <FormDescription>
                      Inactive batches won't appear in normal inventory views
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

            {/* Updated Item Creation Section with optional toggle */}
            {!isEditing && locations.length > 0 && (
              <div className="bg-muted/50 rounded-md p-4 space-y-2 mt-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold">Item Creation</h3>
                    <p className="text-xs text-muted-foreground">
                      Automatically create individual items for this batch
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={quickAdd.enabled}
                      onCheckedChange={(checked) => setQuickAdd(prev => ({ ...prev, enabled: checked }))}
                      aria-label="Enable item creation"
                    />
                  </FormControl>
                </div>
                
                {quickAdd.enabled && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="quantity" className="text-sm w-32">
                        Items to create:
                      </Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        className="w-24"
                        value={quickAdd.quantity}
                        onChange={(e) => setQuickAdd(prev => ({ 
                          ...prev, 
                          quantity: parseInt(e.target.value) || 1 
                        }))}
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Label htmlFor="location" className="text-sm w-32">
                        Location:
                      </Label>
                      <Select
                        value={quickAdd.location}
                        onValueChange={(value) => setQuickAdd(prev => ({ ...prev, location: value }))}
                      >
                        <SelectTrigger id="location" className="w-full">
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          {locations.map(location => (
                            <SelectItem key={location.id} value={location.id}>
                              {location.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4 pt-4">
            {!selectedCategory && (
              <div className="text-center py-8 text-muted-foreground">
                <p>Please select a category first to view additional attributes</p>
              </div>
            )}
            
            {selectedCategory && (
              <div className="space-y-6">
                {/* Only show manufacturer field if the attribute exists in selected category */}
                {showManufacturer && (
                  <FormField
                    control={form.control}
                    name="manufacturer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Manufacturer</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter manufacturer" {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                {/* Only show warranty info field if the attribute exists in selected category */}
                {showWarrantyInfo && (
                  <FormField
                    control={form.control}
                    name="warranty_info"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Warranty Information</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter warranty details" {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                {/* Only show lifecycle status if the attribute exists in selected category */}
                {showLifecycleStatus && (
                  <FormField
                    control={form.control}
                    name="lifecycle_status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lifecycle Status</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value || ''}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="current">Current</SelectItem>
                            <SelectItem value="deprecated">Deprecated</SelectItem>
                            <SelectItem value="end_of_life">End of Life</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                {/* Display category-specific attributes dynamically */}
                {selectedCategory && selectedCategory.attributes && selectedCategory.attributes.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Category-Specific Attributes</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedCategory.attributes
                        .filter(attr => 
                          !['manufacturer', 'warranty_info', 'lifecycle_status'].includes(attr)
                        )
                        .map(attribute => (
                          <FormField
                            key={attribute}
                            control={form.control}
                            name={attribute as any}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{attribute}</FormLabel>
                                <FormControl>
                                  <Input placeholder={`Enter ${attribute.toLowerCase()}`} {...field} value={field.value || ''} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-[#00859e] hover:bg-[#00859e]/90">
            {isEditing ? 'Update Batch' : 'Add New Batch'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductForm;
