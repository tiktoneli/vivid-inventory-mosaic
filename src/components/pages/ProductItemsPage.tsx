
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Filter, Download, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useProducts } from '@/hooks/useProducts';
import { useProductItems } from '@/hooks/useProductItems';
import { useLocations } from '@/hooks/useLocations';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

// Schema for product item validation
const productItemSchema = z.object({
  serial_number: z.string().min(1, { message: 'Serial number is required' }),
  sku: z.string().min(3, { message: 'SKU must be at least 3 characters' }),
  location_id: z.string().min(1, { message: 'Location is required' }),
  status: z.string().min(1, { message: 'Status is required' }),
  notes: z.string().optional(),
});

type ProductItemFormValues = z.infer<typeof productItemSchema>;

const ProductItemsPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  
  const { products } = useProducts();
  const { productItems, isLoading, createProductItem, updateProductItem, deleteProductItem } = useProductItems(productId);
  const { locations } = useLocations();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  
  const product = products.find(p => p.id === productId);
  
  // Form for adding/editing items
  const form = useForm<ProductItemFormValues>({
    resolver: zodResolver(productItemSchema),
    defaultValues: {
      serial_number: '',
      sku: '',
      location_id: '',
      status: 'available',
      notes: '',
    },
  });
  
  // Reset form when dialog opens
  const openAddDialog = () => {
    form.reset({
      serial_number: '',
      sku: `${product?.sku || 'PROD'}-${Math.floor(Math.random() * 10000)}`,
      location_id: product?.location || '',
      status: 'available',
      notes: '',
    });
    setIsAddDialogOpen(true);
  };
  
  const openEditDialog = (item: any) => {
    setSelectedItem(item);
    form.reset({
      serial_number: item.serial_number,
      sku: item.sku,
      location_id: item.location_id,
      status: item.status,
      notes: item.notes || '',
    });
    setIsEditDialogOpen(true);
  };
  
  const handleSubmitAdd = (values: ProductItemFormValues) => {
    if (!productId) return;
    
    createProductItem({
      product_id: productId,
      ...values,
    });
    setIsAddDialogOpen(false);
  };
  
  const handleSubmitEdit = (values: ProductItemFormValues) => {
    if (!selectedItem) return;
    
    updateProductItem({
      id: selectedItem.id,
      data: values,
    });
    setIsEditDialogOpen(false);
    setSelectedItem(null);
  };
  
  const confirmDelete = () => {
    if (!itemToDelete) return;
    
    deleteProductItem(itemToDelete);
    setItemToDelete(null);
  };
  
  const statusColors: Record<string, string> = {
    available: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
    reserved: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
    in_use: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200',
    maintenance: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200',
    damaged: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200',
    retired: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  };
  
  if (!product && !isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-2">Product Not Found</h2>
          <p className="text-muted-foreground mb-4">The product you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/products')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Button variant="ghost" size="sm" onClick={() => navigate('/products')}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <h1 className="text-2xl font-semibold tracking-tight text-[#445372]">Product Items</h1>
            </div>
            <p className="text-muted-foreground">
              Managing individual items for 
              <span className="font-medium ml-1 text-foreground">{product?.name}</span>
            </p>
          </div>
          <Button onClick={openAddDialog} className="bg-[#00859e] hover:bg-[#00859e]/90">
            <Plus className="mr-2 h-4 w-4" /> Add Item
          </Button>
        </div>
      </section>
      
      <section className="mb-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-[#445372] text-lg flex items-center">
              <Package className="mr-2 h-5 w-5" />
              Item Summary
            </CardTitle>
            <CardDescription>
              Overview of all items for this product
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#00859e]/10 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Total Items</p>
                <p className="text-2xl font-semibold">{productItems.length}</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Available</p>
                <p className="text-2xl font-semibold">
                  {productItems.filter(item => item.status === 'available').length}
                </p>
              </div>
              <div className="bg-yellow-100 dark:bg-yellow-900/20 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Other Status</p>
                <p className="text-2xl font-semibold">
                  {productItems.filter(item => item.status !== 'available').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
      
      <section>
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <p>Loading items...</p>
          </div>
        ) : productItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {productItems.map((item) => {
              const location = locations.find(loc => loc.id === item.location_id)?.name || "Unknown";
              
              return (
                <Card key={item.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base font-medium">
                          {item.serial_number}
                        </CardTitle>
                        <CardDescription>
                          SKU: {item.sku}
                        </CardDescription>
                      </div>
                      <Badge className={statusColors[item.status] || ''}>
                        {item.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mt-1">
                      <p className="text-sm">
                        <span className="text-muted-foreground">Location:</span> {location}
                      </p>
                      {item.notes && (
                        <p className="text-sm mt-2">
                          <span className="text-muted-foreground">Notes:</span> {item.notes}
                        </p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-3 flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => openEditDialog(item)}
                    >
                      <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => setItemToDelete(item.id)}
                    >
                      <Trash className="h-3.5 w-3.5 mr-1" /> Delete
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-3 bg-secondary rounded-full mb-4">
              <Package className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">No Items Found</h3>
            <p className="text-muted-foreground text-sm max-w-md mb-4">
              This product doesn't have any individual items yet. Add items to track them individually.
            </p>
            <Button onClick={openAddDialog} className="bg-[#00859e] hover:bg-[#00859e]/90">
              <Plus className="mr-2 h-4 w-4" /> Add First Item
            </Button>
          </div>
        )}
      </section>
      
      {/* Add Item Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-[#445372]">Add New Item</DialogTitle>
            <DialogDescription>
              Create a new individual item for {product?.name}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmitAdd)} className="space-y-4">
              <FormField
                control={form.control}
                name="serial_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Serial Number *</FormLabel>
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
                    <FormLabel>SKU * (Unique)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter unique SKU" {...field} />
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
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status *</FormLabel>
                    <FormControl>
                      <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      >
                        <option value="available">Available</option>
                        <option value="reserved">Reserved</option>
                        <option value="in_use">In Use</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="damaged">Damaged</option>
                        <option value="retired">Retired</option>
                      </select>
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
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Additional information about this item" 
                        {...field} 
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#00859e] hover:bg-[#00859e]/90">
                  Add Item
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Item Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-[#445372]">Edit Item</DialogTitle>
            <DialogDescription>
              Update details for this product item
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmitEdit)} className="space-y-4">
              <FormField
                control={form.control}
                name="serial_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Serial Number *</FormLabel>
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
                    <FormLabel>SKU * (Unique)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter unique SKU" {...field} />
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
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status *</FormLabel>
                    <FormControl>
                      <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      >
                        <option value="available">Available</option>
                        <option value="reserved">Reserved</option>
                        <option value="in_use">In Use</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="damaged">Damaged</option>
                        <option value="retired">Retired</option>
                      </select>
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
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Additional information about this item" 
                        {...field} 
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#00859e] hover:bg-[#00859e]/90">
                  Update Item
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#445372]">Delete Product Item</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this item from the system. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductItemsPage;
