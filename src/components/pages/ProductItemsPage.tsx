
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProductItems } from '@/hooks/useProductItems';
import { useProducts } from '@/hooks/useProducts';
import { useLocations } from '@/hooks/useLocations';
import { Loader2, Plus, Search, Edit, Trash, Filter, ChevronLeft } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProductItemSelectionForm from '../ui/ProductItemSelectionForm';
import { useToast } from '@/hooks/use-toast';

const ProductItemsPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [editingItem, setEditingItem] = useState<any>(null);
  
  const { toast } = useToast();
  
  const { 
    product, 
    isLoading: isProductLoading,
    isError: isProductError
  } = useProducts(productId);
  
  const {
    productItems,
    isLoading: isItemsLoading,
    isError: isItemsError,
    createProductItem,
    updateProductItem,
    deleteProductItem
  } = useProductItems(productId);
  
  const { locations, isLoading: isLocationsLoading } = useLocations();

  // Filter product items based on search term and filters
  const filteredItems = productItems?.filter(item => {
    const matchesSearch = 
      item.serial_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.notes && item.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesLocation = locationFilter === 'all' || item.location_id === locationFilter;
    
    return matchesSearch && matchesStatus && matchesLocation;
  });

  // Get location name by ID
  const getLocationName = (locationId: string) => {
    const location = locations?.find(loc => loc.id === locationId);
    return location ? location.name : 'Unknown';
  };

  const handleFormSubmit = (values: any) => {
    if (editingItem) {
      // Update existing item
      updateProductItem({
        id: editingItem.id,
        data: {
          sku: values.sku,
          serial_number: values.serial_number,
          location_id: values.location_id,
          status: values.status,
          notes: values.notes,
          product_id: productId!
        }
      });
      
      toast({
        title: "Product item updated",
        description: `The item with SKU ${values.sku} has been updated.`
      });
    } else {
      // Create new item
      createProductItem({
        sku: values.sku,
        serial_number: values.serial_number,
        location_id: values.location_id,
        status: values.status || 'available',
        notes: values.notes || '',
        product_id: productId!
      });
      
      toast({
        title: "Product item added",
        description: `A new item with SKU ${values.sku} has been added to inventory.`
      });
    }
    
    setIsFormOpen(false);
    setEditingItem(null);
  };

  const handleEditItem = (item: any) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDeleteItem = (itemId: string, sku: string) => {
    if (window.confirm(`Are you sure you want to delete the item with SKU ${sku}?`)) {
      deleteProductItem(itemId);
      
      toast({
        title: "Product item deleted",
        description: `The item with SKU ${sku} has been removed from inventory.`
      });
    }
  };

  if (isProductLoading || isItemsLoading || isLocationsLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[#00859e]" />
      </div>
    );
  }

  if (isProductError || isItemsError || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>Error loading product data. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-8">
        <div className="flex items-center mb-4">
          <Link 
            to="/products" 
            className="text-[#445372] hover:text-[#00859e] transition-colors flex items-center mr-4"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Products
          </Link>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight mb-1 text-[#445372]">{product.name} - Inventory Items</h1>
            <p className="text-muted-foreground">
              Manage individual inventory items for this product
            </p>
          </div>
          <button 
            onClick={() => {
              setEditingItem(null);
              setIsFormOpen(true);
            }}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-[#00859e] text-white shadow hover:bg-[#00859e]/90 px-4 py-2 h-10"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Item
          </button>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="mb-8 grid grid-cols-1 md:grid-cols-[1fr_200px_200px] gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            type="text"
            placeholder="Search by SKU, serial number, or notes..."
            className="pl-10 w-full h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="in_use">In Use</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="retired">Retired</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={locationFilter} onValueChange={setLocationFilter}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter by Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {locations.map(location => (
              <SelectItem key={location.id} value={location.id}>{location.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </section>

      {/* Item List */}
      <section>
        {filteredItems && filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <div 
                key={item.id} 
                className="bg-card rounded-lg border border-border shadow-sm p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex flex-col">
                      <h3 className="text-base font-medium text-[#445372]">SKU: {item.sku}</h3>
                      <p className="text-sm text-muted-foreground">S/N: {item.serial_number}</p>
                    </div>
                    <div className="mt-1">
                      <Badge 
                        className={`
                          ${item.status === 'available' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
                          ${item.status === 'in_use' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' : ''}
                          ${item.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' : ''}
                          ${item.status === 'retired' ? 'bg-gray-100 text-gray-800 hover:bg-gray-100' : ''}
                        `}
                      >
                        {item.status === 'in_use' ? 'In Use' : 
                         item.status === 'maintenance' ? 'Maintenance' :
                         item.status === 'retired' ? 'Retired' : 'Available'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex gap-1">
                    <button 
                      onClick={() => handleEditItem(item)} 
                      className="p-1.5 text-muted-foreground hover:text-[#00859e] rounded-full transition-colors" 
                      aria-label="Edit item"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteItem(item.id, item.sku)} 
                      className="p-1.5 text-muted-foreground hover:text-red-500 rounded-full transition-colors" 
                      aria-label="Delete item"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="mt-2 text-sm text-muted-foreground">
                  <p>Location: {getLocationName(item.location_id)}</p>
                  {item.notes && <p className="mt-1">Notes: {item.notes}</p>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-3 bg-secondary rounded-full mb-4">
              <Filter className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">No items found</h3>
            <p className="text-muted-foreground text-sm max-w-md">
              No inventory items match your current filters. Try adjusting your filters or add new items.
            </p>
          </div>
        )}
      </section>

      {/* Item Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-[#445372]">{editingItem ? 'Edit Inventory Item' : 'Add New Inventory Item'}</DialogTitle>
            <DialogDescription>
              {editingItem 
                ? 'Update the inventory item information below.' 
                : 'Fill out the form below to add a new inventory item for this product.'}
            </DialogDescription>
          </DialogHeader>
          <ProductItemSelectionForm 
            initialValues={editingItem ? {
              sku: editingItem.sku,
              serial_number: editingItem.serial_number,
              location_id: editingItem.location_id,
              status: editingItem.status,
              notes: editingItem.notes || ''
            } : undefined}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
            isEditing={!!editingItem}
            productId={productId!}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductItemsPage;
