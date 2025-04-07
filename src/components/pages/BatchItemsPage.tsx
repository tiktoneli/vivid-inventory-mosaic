
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useBatchItems } from '@/hooks/useBatchItems';
import { useBatches } from '@/hooks/useBatches';
import { useLocations } from '@/hooks/useLocations';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, ChevronLeft, Search, ArrowUpDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BatchItemForm from '../ui/BatchItemForm';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

// Define the BatchItem type
export interface BatchItem {
  id: string;
  batch_id: string;
  sku: string;
  serial_number: string | null;
  location_id: string;
  status: 'available' | 'in_use' | 'maintenance' | 'retired';
  notes?: string;
  created_at: string;
  updated_at?: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'available':
      return 'bg-green-100 text-green-800';
    case 'in_use':
      return 'bg-blue-100 text-blue-800';
    case 'maintenance':
      return 'bg-amber-100 text-amber-800';
    case 'retired':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const BatchItemsPage = () => {
  const { batchId } = useParams<{ batchId: string }>();
  const navigate = useNavigate();
  
  // Use the useSingleBatchQuery function
  const { useSingleBatchQuery } = useBatches();
  const { data: batch, isLoading: batchLoading } = useSingleBatchQuery(batchId);
  
  const { 
    batchItems, 
    isLoading: itemsLoading, 
    createBatchItem,
    updateBatchItem,
    deleteBatchItem
  } = useBatchItems(batchId);
  const { locations } = useLocations();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [editingItem, setEditingItem] = useState<BatchItem | null>(null);
  const [quickAddQuantity, setQuickAddQuantity] = useState(1);
  const [quickAddLocation, setQuickAddLocation] = useState<string>(locations[0]?.id || '');
  const [quickAddPrefix, setQuickAddPrefix] = useState('');
  
  // Filter batch items based on search and filters
  const filteredItems = batchItems.filter(item => {
    const matchesSearch = item.serial_number?.toLowerCase().includes(searchTerm.toLowerCase()) || '';
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesLocation = locationFilter === 'all' || item.location_id === locationFilter;
    
    return matchesSearch && matchesStatus && matchesLocation;
  });
  
  const handleCreateItem = (values: any) => {
    if (!batchId) return;
    
    createBatchItem({
      ...values,
      batch_id: batchId,
      sku: batch?.sku || '',
    });
    
    setIsFormOpen(false);
  };

  // Handle quick add items
  const handleQuickAdd = () => {
    if (!batchId || !quickAddLocation || quickAddQuantity < 1) {
      toast.error('Please select a location and enter a valid quantity');
      return;
    }

    // Create batch of items
    const promises = [];
    const basePrefix = quickAddPrefix || batch?.sku || '';
    
    for (let i = 0; i < quickAddQuantity; i++) {
      const serialNumber = basePrefix ? `${basePrefix}-${i+1}` : null;
      
      const newItem = {
        batch_id: batchId,
        sku: batch?.sku || '',
        serial_number: serialNumber,
        location_id: quickAddLocation,
        status: 'available' as const,
        notes: 'Auto-generated batch item'
      };
      
      promises.push(createBatchItem(newItem));
    }

    // Handle completion
    Promise.all(promises)
      .then(() => {
        toast.success(`Successfully added ${quickAddQuantity} items`);
        setIsQuickAddOpen(false);
      })
      .catch(error => {
        toast.error('Error creating items', { description: error.message });
      });
  };
  
  const handleEditItem = (id: string) => {
    const item = batchItems.find(i => i.id === id);
    if (item) {
      setEditingItem(item);
      setIsFormOpen(true);
    }
  };
  
  const handleUpdateItem = (values: any) => {
    if (!editingItem) return;
    
    updateBatchItem({
      id: editingItem.id,
      data: values
    });
    
    setIsFormOpen(false);
    setEditingItem(null);
  };
  
  const confirmDelete = () => {
    if (!itemToDelete) return;
    
    deleteBatchItem(itemToDelete);
    setItemToDelete(null);
  };
  
  const handleFormSubmit = (values: any) => {
    if (editingItem) {
      handleUpdateItem(values);
    } else {
      handleCreateItem(values);
    }
  };
  
  const getLocationName = (locationId: string) => {
    const location = locations.find(loc => loc.id === locationId);
    return location ? location.name : 'Unknown';
  };
  
  if (batchLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00859e] mx-auto mb-4"></div>
          <p>Loading batch information...</p>
        </div>
      </div>
    );
  }
  
  if (!batch) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="p-6 bg-red-50 border border-red-200 rounded-md">
          <h2 className="text-xl font-medium mb-2 text-red-800">Batch not found</h2>
          <p className="mb-4">The requested batch does not exist or you don't have access to it.</p>
          <Button onClick={() => navigate('/batches')}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Batches
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link 
              to="/batches" 
              className="text-sm text-muted-foreground hover:text-foreground flex items-center"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Back to Batches
            </Link>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-[#445372]">
            {batch.name}
          </h1>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="outline" className="bg-primary/10">
              Code: {batch.sku}
            </Badge>
            <Badge variant="outline" className="bg-primary/10">
              Category: {batch.categories?.name || "Uncategorized"}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => {
              setEditingItem(null);
              setIsFormOpen(true);
            }}
            className="bg-[#00859e] hover:bg-[#00859e]/90"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Item
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setIsQuickAddOpen(true)}
            className="border-[#00859e] text-[#00859e] hover:bg-[#00859e]/10"
          >
            <Plus className="mr-2 h-4 w-4" /> Quick Add Items
          </Button>
        </div>
      </div>
      
      {/* Filters section */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by serial number..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="in_use">In Use</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="retired">Retired</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={locationFilter}
            onValueChange={setLocationFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map(location => (
                <SelectItem key={location.id} value={location.id}>
                  {location.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" className="h-10 w-10">
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Items count */}
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{filteredItems.length}</span> of {batchItems.length} items
        </p>
      </div>
      
      {/* Items table */}
      {itemsLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00859e] mx-auto mb-4"></div>
            <p>Loading items...</p>
          </div>
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Serial Number</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map(item => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.serial_number || '-'}</TableCell>
                  <TableCell>{getLocationName(item.location_id)}</TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(item.status)}`}>
                      {item.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {item.notes || '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditItem(item.id)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-500 border-red-200 hover:bg-red-50"
                        onClick={() => setItemToDelete(item.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/30 rounded-md border">
          <div className="p-3 bg-secondary rounded-full mb-4">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-1">No items found</h3>
          <p className="text-muted-foreground text-sm max-w-md mb-4">
            {batchItems.length > 0 
              ? "No items match your filter criteria. Try adjusting your filters." 
              : "This batch doesn't have any items yet. Add items to track individual units."}
          </p>
          <Button 
            onClick={() => {
              setEditingItem(null);
              setIsFormOpen(true);
            }}
            className="bg-[#00859e] hover:bg-[#00859e]/90"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Item
          </Button>
        </div>
      )}
      
      {/* Item Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-[#445372]">
              {editingItem ? 'Edit Item' : 'Add New Item'}
            </DialogTitle>
            <DialogDescription>
              {editingItem 
                ? 'Update the item information below.' 
                : `Add a new item to the "${batch.name}" batch.`}
            </DialogDescription>
          </DialogHeader>
          <BatchItemForm 
            initialValues={editingItem || {
              batch_id: batchId,
              serial_number: '',
              sku: batch.sku,
              location_id: '',
              status: 'available',
              notes: ''
            }}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingItem(null);
            }}
            locations={locations}
            isEditing={!!editingItem}
          />
        </DialogContent>
      </Dialog>
      
      {/* Quick Add Items Dialog */}
      <Dialog open={isQuickAddOpen} onOpenChange={setIsQuickAddOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-[#445372]">
              Quick Add Multiple Items
            </DialogTitle>
            <DialogDescription>
              Quickly add multiple items to "{batch.name}" batch
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="location">Location *</Label>
                <Select
                  value={quickAddLocation}
                  onValueChange={setQuickAddLocation}
                >
                  <SelectTrigger id="location">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quickAddQuantity}
                  onChange={(e) => setQuickAddQuantity(parseInt(e.target.value) || 1)}
                />
              </div>
              
              <div>
                <Label htmlFor="prefix">Serial Number Prefix (Optional)</Label>
                <Input
                  id="prefix"
                  placeholder="e.g. PROJ-001"
                  value={quickAddPrefix}
                  onChange={(e) => setQuickAddPrefix(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {quickAddPrefix ? `Example: ${quickAddPrefix}-1, ${quickAddPrefix}-2, etc.` : 'Leave empty for no serial numbers'}
                </p>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline"
                onClick={() => setIsQuickAddOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleQuickAdd}
                className="bg-[#00859e] hover:bg-[#00859e]/90 text-white"
                disabled={!quickAddLocation || quickAddQuantity < 1}
              >
                Add {quickAddQuantity} {quickAddQuantity === 1 ? 'Item' : 'Items'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#445372]">
              Delete Item
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this item from the batch. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BatchItemsPage;
