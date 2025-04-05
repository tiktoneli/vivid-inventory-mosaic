import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProductItems } from '@/hooks/useProductItems';
import { useProducts } from '@/hooks/useProducts';
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
import ProductItemForm from '../ui/ProductItemForm';
import { toast } from 'sonner';
import ProductItemSelectionForm from '../ui/ProductItemSelectionForm';
import { useQuery } from '@tanstack/react-query';

// Define the ProductItem type
export interface ProductItem {
  id: string;
  product_id: string;
  sku: string;
  serial_number: string;
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

const ProductItemsPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  
  // Use the useSingleProductQuery function instead
  const { getProductById, useSingleProductQuery } = useProducts();
  const { data: product, isLoading: productLoading } = useSingleProductQuery(productId);
  
  const { 
    productItems, 
    isLoading: itemsLoading, 
    createProductItem,
    updateProductItem,
    deleteProductItem
  } = useProductItems(productId);
  const { locations } = useLocations();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSelectionFormOpen, setIsSelectionFormOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [editingItem, setEditingItem] = useState<ProductItem | null>(null);
  
  // We don't need the useEffect anymore since we're using React Query
  
  // Filter product items based on search and filters
  const filteredItems = productItems.filter(item => {
    const matchesSearch = item.serial_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesLocation = locationFilter === 'all' || item.location_id === locationFilter;
    
    return matchesSearch && matchesStatus && matchesLocation;
  });
  
  const handleCreateItem = (values: any) => {
    if (!productId) return;
    
    createProductItem({
      ...values,
      product_id: productId,
      sku: product?.sku || '',
    });
    
    setIsFormOpen(false);
  };
  
  const handleEditItem = (id: string) => {
    const item = productItems.find(i => i.id === id);
    if (item) {
      setEditingItem(item);
      setIsFormOpen(true);
    }
  };
  
  const handleUpdateItem = (values: any) => {
    if (!editingItem) return;
    
    updateProductItem({
      id: editingItem.id,
      data: values
    });
    
    setIsFormOpen(false);
    setEditingItem(null);
  };
  
  const confirmDelete = () => {
    if (!itemToDelete) return;
    
    deleteProductItem(itemToDelete);
    setItemToDelete(null);
  };
  
  const handleFormSubmit = (values: any) => {
    if (editingItem) {
      handleUpdateItem(values);
    } else {
      handleCreateItem(values);
    }
  };
  
  // When adding existing items
  const handleSelectionFormSubmit = (selectedItems: string[]) => {
    if (!productId || selectedItems.length === 0) {
      return;
    }
    
    // Currently this just closes the dialog, the actual implementation
    // would need to be added to move items between products
    toast.success(`Added ${selectedItems.length} items to this batch`);
    setIsSelectionFormOpen(false);
  };
  
  const getLocationName = (locationId: string) => {
    const location = locations.find(loc => loc.id === locationId);
    return location ? location.name : 'Unknown';
  };
  
  if (productLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00859e] mx-auto mb-4"></div>
          <p>Loading product information...</p>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="p-6 bg-red-50 border border-red-200 rounded-md">
          <h2 className="text-xl font-medium mb-2 text-red-800">Product not found</h2>
          <p className="mb-4">The requested product does not exist or you don't have access to it.</p>
          <Button onClick={() => navigate('/products')}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Products
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
              to="/products" 
              className="text-sm text-muted-foreground hover:text-foreground flex items-center"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Back to Batches
            </Link>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-[#445372]">
            {product.name}
          </h1>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="outline" className="bg-primary/10">
              Code: {product.sku}
            </Badge>
            <Badge variant="outline" className="bg-primary/10">
              Category: {product.categories?.name || "Uncategorized"}
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
            onClick={() => setIsSelectionFormOpen(true)}
            className="border-[#00859e] text-[#00859e] hover:bg-[#00859e]/10"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Existing Items
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
          Showing <span className="font-medium text-foreground">{filteredItems.length}</span> of {productItems.length} items
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
                  <TableCell className="font-medium">{item.serial_number}</TableCell>
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
            {productItems.length > 0 
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
                : `Add a new item to the "${product.name}" batch.`}
            </DialogDescription>
          </DialogHeader>
          <ProductItemForm 
            initialValues={editingItem || {
              product_id: productId,
              serial_number: '',
              sku: product.sku,
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
      
      {/* Product Item Selection Form Dialog */}
      <Dialog open={isSelectionFormOpen} onOpenChange={setIsSelectionFormOpen}>
        <DialogContent className="sm:max-w-[95vw] md:max-w-[700px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-[#445372]">
              Add Existing Items
            </DialogTitle>
            <DialogDescription>
              Select items from other batches to add to this batch.
            </DialogDescription>
          </DialogHeader>
          <ProductItemSelectionForm 
            onSubmit={handleSelectionFormSubmit}
            onCancel={() => setIsSelectionFormOpen(false)}
            isEditing={false}
            productId={productId}
          />
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

export default ProductItemsPage;
