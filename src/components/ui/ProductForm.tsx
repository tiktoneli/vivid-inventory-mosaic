
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

// Schema for product validation
const productSchema = z.object({
  // Mandatory fields
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  sku: z.string().min(3, { message: 'SKU must be at least 3 characters.' }),
  description: z.string().optional(),
  category_id: z.string().min(1, { message: 'Category is required.' }),
  location: z.string().min(1, { message: 'Location is required.' }),
  stock: z.coerce.number().optional(),
  min_stock: z.coerce.number().min(0, { message: 'Minimum stock cannot be negative.' }),
  
  // Optional fields
  manufacturer: z.string().optional(),
  price: z.coerce.number().min(0).optional(),
  serial_number: z.string().optional(),
  mac_address: z.string().optional(),
  warranty_info: z.string().optional(),
  firmware_version: z.string().optional(),
  license_keys: z.string().optional(),
  compatibility_info: z.string().optional(),
  network_specs: z.string().optional(),
  power_consumption: z.string().optional(),
  lifecycle_status: z.string().optional(),
  is_active: z.boolean().default(true),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialValues?: any;
  onSubmit: (values: ProductFormValues) => void;
  onCancel: () => void;
  categories: { id: string; name: string; attributes: string[] }[];
  locations: { id: string; name: string }[];
  isEditing?: boolean;
}

const ProductForm = ({ 
  initialValues, 
  onSubmit,
  onCancel,
  categories,
  locations,
  isEditing = false 
}: ProductFormProps) => {
  const { toast } = useToast();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [categoryAttributes, setCategoryAttributes] = useState<string[]>([]);
  
  // Map form field names to match our schema
  const mappedInitialValues = initialValues ? {
    ...initialValues,
    category_id: initialValues.category || initialValues.category_id,
    price: initialValues.unitCost || initialValues.price,
  } : undefined;
  
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: mappedInitialValues || {
      name: '',
      sku: '',
      description: '',
      category_id: '',
      location: '',
      stock: undefined,
      min_stock: 0,
      manufacturer: '',
      price: undefined,
      serial_number: '',
      mac_address: '',
      warranty_info: '',
      firmware_version: '',
      license_keys: '',
      compatibility_info: '',
      network_specs: '',
      power_consumption: '',
      lifecycle_status: '',
      is_active: true,
    },
  });

  // When the category changes, update the available optional attributes
  useEffect(() => {
    const categoryId = form.watch('category_id');
    if (categoryId) {
      const selectedCategory = categories.find(cat => cat.id === categoryId);
      if (selectedCategory) {
        setSelectedCategoryId(categoryId);
        setCategoryAttributes(selectedCategory.attributes || []);
      } else {
        setCategoryAttributes([]);
      }
    } else {
      setCategoryAttributes([]);
    }
  }, [form.watch('category_id'), categories]);

  const handleSubmit = (values: ProductFormValues) => {
    toast({
      title: isEditing ? "Product Updated" : "Product Created",
      description: `${values.name} has been successfully ${isEditing ? 'updated' : 'added'} to inventory.`,
    });
    onSubmit(values);
  };

  // Function to check if an attribute should be shown based on selected category
  const shouldShowAttribute = (attributeId: string) => {
    return categoryAttributes.includes(attributeId);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="advanced">Optional Attributes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
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
                name="sku"
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
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter product description" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category *</FormLabel>
                    <FormControl>
                      <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      >
                        <option value="">Select category</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location *</FormLabel>
                    <FormControl>
                      <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      >
                        <option value="">Select location</option>
                        {locations.map(location => (
                          <option key={location.id} value={location.id}>{location.name}</option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Stock</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Current stock quantity" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormDescription>
                      Leave empty to set later with a stock movement
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="min_stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Stock *</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Minimum stock level" {...field} />
                    </FormControl>
                    <FormDescription>
                      System will alert when stock falls below this level
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4">
            {selectedCategoryId ? (
              <>
                {categoryAttributes.length > 0 ? (
                  <>
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground">
                        The following optional attributes are available for the selected category.
                      </p>
                    </div>
                
                    {/* Manufacturer */}
                    {shouldShowAttribute('manufacturer') && (
                      <FormField
                        control={form.control}
                        name="manufacturer"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Manufacturer</FormLabel>
                            <FormControl>
                              <Input placeholder="Manufacturer name" {...field} value={field.value || ''} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    
                    {/* Unit Cost */}
                    {shouldShowAttribute('unitCost') && (
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Unit Cost</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="Cost per unit" {...field} value={field.value ?? ''} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Serial Number */}
                      {shouldShowAttribute('serialNumber') && (
                        <FormField
                          control={form.control}
                          name="serial_number"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Serial Number</FormLabel>
                              <FormControl>
                                <Input placeholder="Serial number" {...field} value={field.value || ''} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                      
                      {/* MAC Address */}
                      {shouldShowAttribute('macAddress') && (
                        <FormField
                          control={form.control}
                          name="mac_address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>MAC Address</FormLabel>
                              <FormControl>
                                <Input placeholder="MAC address" {...field} value={field.value || ''} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Warranty Information */}
                      {shouldShowAttribute('warrantyInfo') && (
                        <FormField
                          control={form.control}
                          name="warranty_info"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Warranty Information</FormLabel>
                              <FormControl>
                                <Input placeholder="Warranty details" {...field} value={field.value || ''} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                      
                      {/* Firmware Version */}
                      {shouldShowAttribute('firmwareVersion') && (
                        <FormField
                          control={form.control}
                          name="firmware_version"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Firmware Version</FormLabel>
                              <FormControl>
                                <Input placeholder="Current firmware version" {...field} value={field.value || ''} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                    
                    {/* License Keys */}
                    {shouldShowAttribute('licenseKeys') && (
                      <FormField
                        control={form.control}
                        name="license_keys"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>License Keys</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Software license keys" {...field} value={field.value || ''} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Compatibility Information */}
                      {shouldShowAttribute('compatibilityInfo') && (
                        <FormField
                          control={form.control}
                          name="compatibility_info"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Compatibility Information</FormLabel>
                              <FormControl>
                                <Input placeholder="Compatible systems/devices" {...field} value={field.value || ''} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                      
                      {/* Network Specifications */}
                      {shouldShowAttribute('networkSpecs') && (
                        <FormField
                          control={form.control}
                          name="network_specs"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Network Specifications</FormLabel>
                              <FormControl>
                                <Input placeholder="Network requirements" {...field} value={field.value || ''} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Power Consumption */}
                      {shouldShowAttribute('powerConsumption') && (
                        <FormField
                          control={form.control}
                          name="power_consumption"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Power Consumption</FormLabel>
                              <FormControl>
                                <Input placeholder="Power requirements" {...field} value={field.value || ''} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                      
                      {/* Lifecycle Status */}
                      {shouldShowAttribute('lifecycleStatus') && (
                        <FormField
                          control={form.control}
                          name="lifecycle_status"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Lifecycle Status</FormLabel>
                              <FormControl>
                                <select 
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                  {...field}
                                  value={field.value || ''}
                                >
                                  <option value="">Select status</option>
                                  <option value="New">New</option>
                                  <option value="Current">Current</option>
                                  <option value="End of Life">End of Life</option>
                                  <option value="Deprecated">Deprecated</option>
                                </select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  </>
                ) : (
                  <div className="py-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      The selected category does not have any optional attributes defined.
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      You can add optional attributes in the Category Management section.
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="py-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Please select a category first to see available optional attributes.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-[#00859e] hover:bg-[#00859e]/90">
            {isEditing ? 'Update Product' : 'Add Product'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductForm;
