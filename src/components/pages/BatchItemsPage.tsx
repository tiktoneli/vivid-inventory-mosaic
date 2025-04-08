import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PlusCircle, ArrowLeft, Filter, Download, Upload } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useBatches } from '@/hooks/useBatches';
import { useBatchItems } from '@/hooks/useBatchItems';
import { useLocations } from '@/hooks/useLocations';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import BatchItemSelectionForm from '../ui/BatchItemSelectionForm';
import BatchItemForm from '../ui/BatchItemForm';
import SearchAndFilter from '../ui/SearchAndFilter';
import { ScrollArea } from '@/components/ui/scroll-area';
import PaginationControl from '../ui/PaginationControl';

export type BatchItem = {
  id: string;
  batch_id: string;
  serial_number: string | null;
  sku: string;
  location_id: string;
  status: "available" | "in_use" | "maintenance" | "retired";
  notes: string | null;
  created_at: string;
  updated_at: string | null;
};

const BatchItemsPage = () => {
  const { batchId } = useParams<{ batchId: string }>();
  const { useSingleBatchQuery } = useBatches();
  const { data: batch, isLoading: batchLoading, isError: batchError } = useSingleBatchQuery(batchId);
  const { batchItems, isLoading: itemsLoading, createMultipleItems, updateBatchItem, deleteBatchItem } = useBatchItems(batchId);
  const { locations } = useLocations();
  
  // State for UI controls
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [isQuickAddDialogOpen, setIsQuickAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<BatchItem | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;
  
  // Create a filtered items list based on search and filters
  const filteredItems = batchItems
    .filter(item => 
      (item.serial_number?.toLowerCase().includes(searchTerm.toLowerCase()) || 
       item.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       item.notes?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedLocation === 'All' || item.location_id === selectedLocation)
    );
  
  // Pagination logic
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  // Handle creating multiple items
  const handleAddItems = (formData: { 
    quantity: number, 
    location_id: string,
    prefix?: string,
    notes?: string
  }) => {
    if (!batchId) return;
    
    createMultipleItems({
      batchId,
      locationId: formData.location_id,
      quantity: formData.quantity,
      prefix: formData.prefix || batch?.sku || '',
      notes: formData.notes || ''
    });
    
    setIsQuickAddDialogOpen(false);
  };
  
  // Handle editing an item
  const handleEditItem = (item: BatchItem) => {
    setCurrentItem(item);
    setIsEditDialogOpen(true);
  };
  
  // Handle deleting an item
  const handleDeleteItem = (item: BatchItem) => {
    setCurrentItem(item);
    setIsDeleteDialogOpen(true);
  };
  
  // Confirm item deletion
  const confirmDeleteItem = () => {
    if (currentItem) {
      deleteBatchItem(currentItem.id);
      setIsDeleteDialogOpen(false);
    }
  };
  
  // Get location name by id
  const getLocationName = (locationId: string) => {
    const location = locations.find(loc => loc.id === locationId);
    return location ? location.name : 'Unknown';
  };
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // Loading state
  if (batchLoading || itemsLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }
  
  // Error state
  if (batchError || !batch) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          <h2 className="font-medium">Error Loading Batch</h2>
          <p>Could not load the requested batch. Please try again.</p>
          <Link to="/batches" className="text-blue-500 hover:underline mt-2 inline-block">
            &larr; Back to Batches
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Link to="/batches" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4 inline mr-1" />
            Back to Batches
          </Link>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-[#445372] dark:text-white">{batch.name}</h1>
            <p className="text-muted-foreground">
              <span className="font-medium">Code:</span> {batch.sku} | 
              <span className="font-medium ml-2">Category:</span> {batch.categories?.name}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => setIsAddItemDialogOpen(true)}
              className="whitespace-nowrap"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add Item
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsQuickAddDialogOpen(true)}
              className="whitespace-nowrap bg-[#00859e]/10 border-[#00859e]/20 hover:bg-[#00859e]/20"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Quick Add Items
            </Button>
          </div>
        </div>
      </div>
      
      {/* Filters and controls */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div className="w-full sm:w-auto">
            <SearchAndFilter
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              searchPlaceholder="Search by serial or SKU..."
              selectedFilter={selectedLocation}
              onFilterChange={setSelectedLocation}
              filterOptions={[
                { id: 'All', name: 'All Locations' },
                ...locations.map(loc => ({ id: loc.id, name: loc.name }))
              ]}
              filterLabel="Location"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              <Download className="mr-1 h-4 w-4" /> Export
            </Button>
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              <Filter className="mr-1 h-4 w-4" /> More Filters
            </Button>
          </div>
        </div>
        
        {/* Item count indicator */}
        <p className="text-sm text-muted-foreground">
          Showing {currentItems.length} of {filteredItems.length} items
          {searchTerm && ` matching "${searchTerm}"`}
        </p>
      </div>
      
      {/* Items display */}
      <div className="mb-6">
        {currentItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {currentItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base truncate">
                        {item.serial_number || "No Serial"}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        SKU: {item.sku}
                      </CardDescription>
                    </div>
                    <Badge 
                      className={
                        item.status === 'available' ? 'bg-green-500' :
                        item.status === 'in_use' ? 'bg-blue-500' :
                        item.status === 'maintenance' ? 'bg-amber-500' :
                        'bg-red-500'
                      }
                    >
                      {item.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <p className="text-sm mb-2">
                    <span className="font-medium">Location:</span> {getLocationName(item.location_id)}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {item.notes || "No notes"}
                  </p>
                </CardContent>
                <CardFooter className="p-2 bg-muted/50 flex justify-end gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleEditItem(item)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteItem(item)}
                  >
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center bg-muted/30 rounded-lg p-8 text-center">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <PlusCircle className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">No Items Found</h3>
            <p className="text-muted-foreground max-w-sm mb-4">
              {searchTerm ? 
                "No items match your search criteria. Try adjusting your filters." :
                `This batch doesn't have any items yet. Add your first item to start tracking inventory.`}
            </p>
            {!searchTerm && (
              <Button 
                onClick={() => setIsQuickAddDialogOpen(true)}
                className="bg-[#00859e] hover:bg-[#00859e]/90"
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Add Items
              </Button>
            )}
          </div>
        )}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6">
          <PaginationControl
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
      
      {/* Add Single Item Dialog */}
      <Dialog open={isAddItemDialogOpen} onOpenChange={setIsAddItemDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add New Item</DialogTitle>
            <DialogDescription>
              Add a single item to this batch with custom information.
            </DialogDescription>
          </DialogHeader>
          <BatchItemForm
            batchId={batchId || ''}
            onCancel={() => setIsAddItemDialogOpen(false)}
            locations={locations}
            isEditing={false}
          />
        </DialogContent>
      </Dialog>
      
      {/* Quick Add Items Dialog */}
      <Dialog open={isQuickAddDialogOpen} onOpenChange={setIsQuickAddDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Quick Add Items</DialogTitle>
            <DialogDescription>
              Quickly add multiple identical items to this batch.
            </DialogDescription>
          </DialogHeader>
          <BatchItemSelectionForm
            batchId={batchId || ''}
            onSubmit={handleAddItems}
            onCancel={() => setIsQuickAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Edit Item Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
            <DialogDescription>
              Update information for this item.
            </DialogDescription>
          </DialogHeader>
          {currentItem && (
            <BatchItemForm
              batchId={batchId || ''}
              item={currentItem}
              onCancel={() => setIsEditDialogOpen(false)}
              locations={locations}
              isEditing={true} // Explicitly set isEditing to true
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Item?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the 
              item with serial {currentItem?.serial_number || 'Unknown'}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteItem}
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

export default BatchItemsPage;
