
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
import { Loader2, Check, Search } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from '@/components/ui/checkbox';

// Define the form schema
const formSchema = z.object({
  sku: z.string().optional(),
  serial_number: z.string().optional(),
  location_id: z.string().optional(),
  status: z.enum(["available", "in_use", "maintenance", "retired", ""]).optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ProductItemSelectionFormProps {
  initialValues?: Partial<FormValues>;
  onSubmit: (values: string[]) => void; // Changed to string[] for selected item IDs
  onCancel: () => void;
  isEditing?: boolean;
  productId?: string;
}

// Mock data for demo - in a real app this would come from an API
const mockItems = [
  { id: '1', sku: 'ITEM001', serial_number: 'SN00123', status: 'available', location_name: 'Warehouse A' },
  { id: '2', sku: 'ITEM002', serial_number: 'SN00124', status: 'in_use', location_name: 'Office B' },
  { id: '3', sku: 'ITEM003', serial_number: 'SN00125', status: 'maintenance', location_name: 'Warehouse A' },
];

const ProductItemSelectionForm = ({
  initialValues,
  onSubmit,
  onCancel,
  isEditing = false,
  productId,
}: ProductItemSelectionFormProps) => {
  const { locations, isLoading, isError } = useLocations();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [filteredItems, setFilteredItems] = useState(mockItems);

  // Initialize the form with default values or initial values if editing
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sku: initialValues?.sku || '',
      serial_number: initialValues?.serial_number || '',
      location_id: initialValues?.location_id || '',
      status: initialValues?.status || '',
      notes: initialValues?.notes || '',
    },
  });

  const handleSubmit = (values: FormValues) => {
    // In a real app, this would filter items from the API based on search criteria
    console.log("Search criteria:", values);
    // For now, we'll just submit the selected items
    onSubmit(selectedItems);
  };

  const handleItemSelection = (itemId: string) => {
    setSelectedItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
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
              name="sku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SKU</FormLabel>
                  <FormControl>
                    <Input placeholder="Search by SKU" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="serial_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Serial Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Search by serial number" {...field} />
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
                        <SelectValue placeholder="All locations" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">All locations</SelectItem>
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
                        <SelectValue placeholder="All statuses" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">All statuses</SelectItem>
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
          </div>

          <div>
            <Button type="submit" className="flex items-center">
              <Search className="mr-2 h-4 w-4" />
              Search Items
            </Button>
          </div>
        </form>
      </Form>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Serial Number</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.length > 0 ? (
              filteredItems.map(item => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={() => handleItemSelection(item.id)}
                    />
                  </TableCell>
                  <TableCell>{item.serial_number}</TableCell>
                  <TableCell>{item.sku}</TableCell>
                  <TableCell>{item.location_name}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      item.status === 'available' ? 'bg-green-100 text-green-800' :
                      item.status === 'in_use' ? 'bg-blue-100 text-blue-800' :
                      item.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  <p className="text-muted-foreground">No items found matching your search criteria.</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between pt-4">
        <div>
          <p className="text-sm text-muted-foreground">
            {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
          </p>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            onClick={() => onSubmit(selectedItems)} 
            disabled={selectedItems.length === 0} 
            className="bg-[#00859e] hover:bg-[#00859e]/90"
          >
            <Check className="mr-2 h-4 w-4" />
            Add Selected Items
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductItemSelectionForm;
