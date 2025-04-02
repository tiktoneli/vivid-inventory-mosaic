
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProductItems } from '@/hooks/useProductItems';
import { useLocations } from '@/hooks/useLocations';
import { ProductItem } from '@/hooks/useProducts';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Check, ChevronsUpDown, Package, Plus } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

const itemSelectionSchema = z.object({
  item_id: z.string().min(1, { message: 'Please select an item' }),
  quantity: z.coerce.number().min(1, { message: 'Quantity must be at least 1' }),
  notes: z.string().optional(),
});

const newItemSchema = z.object({
  serial_number: z.string().min(1, { message: 'Serial number is required' }),
  sku: z.string().min(3, { message: 'SKU must be at least 3 characters' }),
  location_id: z.string().min(1, { message: 'Location is required' }),
  status: z.string().min(1, { message: 'Status is required' }),
  notes: z.string().optional(),
});

type ItemSelectionFormValues = z.infer<typeof itemSelectionSchema>;
type NewItemFormValues = z.infer<typeof newItemSchema>;

interface ProductItemSelectionFormProps {
  productId: string;
  onSelectItems: (items: string[]) => void;
  onCancel: () => void;
  movementType: 'in' | 'out' | 'transfer';
  initialLocation?: string;
}

const ProductItemSelectionForm = ({
  productId,
  onSelectItems,
  onCancel,
  movementType,
  initialLocation,
}: ProductItemSelectionFormProps) => {
  const { productItems, isLoading, createProductItem } = useProductItems(productId);
  const { locations } = useLocations();
  
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isNewItemDialogOpen, setIsNewItemDialogOpen] = useState(false);
  const [isCreateMultipleOpen, setIsCreateMultipleOpen] = useState(false);
  const [multipleCount, setMultipleCount] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form for selecting items
  const selectionForm = useForm<ItemSelectionFormValues>({
    resolver: zodResolver(itemSelectionSchema),
    defaultValues: {
      item_id: '',
      quantity: 1,
      notes: '',
    },
  });
  
  // Form for creating new item
  const newItemForm = useForm<NewItemFormValues>({
    resolver: zodResolver(newItemSchema),
    defaultValues: {
      serial_number: '',
      sku: `PROD-${Math.floor(Math.random() * 10000)}`,
      location_id: initialLocation || '',
      status: 'available',
      notes: '',
    },
  });
  
  // Filter items based on movement type
  const availableItems = productItems.filter(item => {
    if (movementType === 'in') {
      // For incoming items, we typically want to show items that are not yet available
      return item.status !== 'available';
    } else if (movementType === 'out') {
      // For outgoing items, we want to show only available items
      return item.status === 'available';
    } else {
      // For transfers, show available items
      return item.status === 'available';
    }
  });
  
  // Filter items based on search term
  const filteredItems = availableItems.filter(item => 
    item.serial_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };
  
  const handleSubmit = () => {
    if (selectedItems.length === 0) {
      toast.error('Please select at least one item');
      return;
    }
    
    onSelectItems(selectedItems);
  };
  
  const handleCreateNewItem = async (values: NewItemFormValues) => {
    if (!productId) return;
    
    try {
      await createProductItem({
        product_id: productId,
        ...values,
      });
      
      setIsNewItemDialogOpen(false);
      newItemForm.reset();
      toast.success('New item created successfully');
    } catch (error) {
      console.error('Error creating item:', error);
      toast.error('Failed to create item');
    }
  };
  
  const handleCreateMultipleItems = async () => {
    if (!productId || multipleCount < 1) return;
    
    const baseValues = newItemForm.getValues();
    const creationPromises = [];
    
    for (let i = 1; i <= multipleCount; i++) {
      const itemValues = {
        ...baseValues,
        serial_number: `${baseValues.serial_number}-${i}`,
        sku: `${baseValues.sku}-${i}`,
        product_id: productId,
      };
      
      creationPromises.push(createProductItem(itemValues));
    }
    
    try {
      await Promise.all(creationPromises);
      setIsCreateMultipleOpen(false);
      setIsNewItemDialogOpen(false);
      newItemForm.reset();
      toast.success(`Created ${multipleCount} new items successfully`);
    } catch (error) {
      console.error('Error creating multiple items:', error);
      toast.error('Failed to create multiple items');
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-[#445372]">
          Select Items for {movementType === 'in' ? 'Inbound' : movementType === 'out' ? 'Outbound' : 'Transfer'} Movement
        </h3>
        <Button 
          onClick={() => setIsNewItemDialogOpen(true)}
          variant="outline"
          className="flex items-center"
        >
          <Plus className="mr-1 h-4 w-4" /> New Item
        </Button>
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">Loading items...</div>
      ) : availableItems.length === 0 ? (
        <div className="text-center py-8">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h4 className="text-lg font-medium mb-2">No Items Available</h4>
          <p className="text-muted-foreground mb-4">
            {movementType === 'in' 
              ? "There are no items ready for inbound processing." 
              : "There are no available items for this product."}
          </p>
          <Button onClick={() => setIsNewItemDialogOpen(true)} className="bg-[#00859e] hover:bg-[#00859e]/90">
            <Plus className="mr-2 h-4 w-4" /> Create New Item
          </Button>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <Input
              placeholder="Search by serial number or SKU"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          <Card>
            <CardContent className="p-0">
              <ScrollArea className="h-[300px] w-full rounded-md border">
                <div className="p-4">
                  {filteredItems.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No items match your search criteria</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {filteredItems.map(item => {
                        const location = locations.find(loc => loc.id === item.location_id)?.name || "Unknown";
                        const isSelected = selectedItems.includes(item.id);
                        
                        return (
                          <div
                            key={item.id}
                            className={`p-3 rounded-md border cursor-pointer transition-colors ${
                              isSelected 
                                ? 'border-[#00859e] bg-[#00859e]/10' 
                                : 'border-border hover:bg-accent'
                            }`}
                            onClick={() => toggleItemSelection(item.id)}
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="font-medium flex items-center">
                                  {isSelected && <Check className="h-4 w-4 mr-1 text-[#00859e]" />}
                                  {item.serial_number}
                                </div>
                                <div className="text-sm text-muted-foreground">SKU: {item.sku}</div>
                                <div className="text-sm text-muted-foreground">Location: {location}</div>
                              </div>
                              <div className={`px-2 py-1 text-xs rounded-full ${
                                item.status === 'available' 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200' 
                                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200'
                              }`}>
                                {item.status.replace('_', ' ')}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
          
          <div className="text-sm text-muted-foreground">
            {selectedItems.length} item(s) selected
          </div>
        </>
      )}
      
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          className="bg-[#00859e] hover:bg-[#00859e]/90"
          disabled={selectedItems.length === 0}
        >
          Confirm Selection
        </Button>
      </div>
      
      {/* Dialog for creating new item */}
      <Dialog open={isNewItemDialogOpen} onOpenChange={setIsNewItemDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-[#445372]">Create New Item</DialogTitle>
            <DialogDescription>
              Add a new individual item for this product
            </DialogDescription>
          </DialogHeader>
          
          <Form {...newItemForm}>
            <form onSubmit={newItemForm.handleSubmit(handleCreateNewItem)} className="space-y-4">
              <FormField
                control={newItemForm.control}
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
                control={newItemForm.control}
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
                control={newItemForm.control}
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
                control={newItemForm.control}
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
                control={newItemForm.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Additional information about this item" 
                        {...field} 
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-between items-center pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsCreateMultipleOpen(true)}
                >
                  Create Multiple
                </Button>
                
                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsNewItemDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-[#00859e] hover:bg-[#00859e]/90"
                  >
                    Create Item
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Dialog for creating multiple items */}
      <Dialog open={isCreateMultipleOpen} onOpenChange={setIsCreateMultipleOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#445372]">Create Multiple Items</DialogTitle>
            <DialogDescription>
              Create multiple items with sequential serial numbers and SKUs
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <FormLabel>Number of Items</FormLabel>
              <Input 
                type="number" 
                min="1" 
                max="100"
                value={multipleCount} 
                onChange={(e) => setMultipleCount(parseInt(e.target.value) || 1)}
              />
              <FormDescription>
                This will create {multipleCount} items with the base details specified in the previous form.
                Serial numbers and SKUs will be appended with -1, -2, etc.
              </FormDescription>
            </div>
            
            <div className="flex justify-end gap-2 pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsCreateMultipleOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="button" 
                className="bg-[#00859e] hover:bg-[#00859e]/90"
                onClick={handleCreateMultipleItems}
              >
                Create {multipleCount} Items
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductItemSelectionForm;
