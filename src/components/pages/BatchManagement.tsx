import React, { useState } from 'react';
import { Plus, Download, Upload, Search } from 'lucide-react';
import BatchCard from '../ui/BatchCard';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import BatchForm from '../ui/BatchForm';
import { Link } from 'react-router-dom';
import { useBatches, BatchInput } from '@/hooks/useBatches';
import { useCategories } from '@/hooks/useCategories';
import { useLocations } from '@/hooks/useLocations';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import BatchBatchForm from '../ui/BatchBatchForm';
import { ScrollArea } from '@/components/ui/scroll-area';
import SearchAndFilter from '../ui/SearchAndFilter';
import PaginationControl from '../ui/PaginationControl';

const BatchManagement = () => {
  const { batches, isLoading: batchesLoading, createBatch, updateBatch, deleteBatch, createBatchItems } = useBatches();
  const { categories } = useCategories();
  const { locations } = useLocations();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isBatchFormOpen, setIsBatchFormOpen] = useState(false);
  const [showInactiveBatches, setShowInactiveBatches] = useState(false);
  const [batchToDelete, setBatchToDelete] = useState<string | null>(null);
  const [editingBatch, setEditingBatch] = useState<any | null>(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const batchesPerPage = 8;

  // Batch actions handlers
  const handleEditBatch = (id: string) => {
    const batch = batches.find(p => p.id === id);
    if (batch) {
      setEditingBatch(batch);
      setIsFormOpen(true);
    }
  };

  const handleDeleteBatch = (id: string) => {
    setBatchToDelete(id);
  };

  const confirmDelete = () => {
    if (!batchToDelete) return;
    
    deleteBatch(batchToDelete);
    setBatchToDelete(null);
  };

  // Fixed promise handling in handleFormSubmit
  const handleFormSubmit = async (values: any, quickAdd?: { enabled: boolean; quantity: number; location: string }) => {
    try {
      if (editingBatch) {
        // Update existing batch
        updateBatch({ id: editingBatch.id, data: values });
        setIsFormOpen(false);
        setEditingBatch(null);
      } else {
        // Add new batch
        createBatch(values, {
          onSuccess: (result) => {
            // Add quick items if enabled
            if (quickAdd?.enabled && quickAdd.quantity > 0 && result) {
              createBatchItems({ 
                batchId: result.id, 
                locationId: quickAdd.location, 
                quantity: quickAdd.quantity, 
                basePrefix: result.sku 
              });
            }
            setIsFormOpen(false);
          }
        });
      }
    } catch (error) {
      console.error('Error handling batch submission:', error);
    }
  };

  // Fixed promise handling in handleBatchFormSubmit
  const handleBatchFormSubmit = async (batches: BatchInput[], quickAdd: { enabled: boolean; quantity: number }) => {
    let createdCount = 0;
    
    // Process each batch in the batch
    for (const batchData of batches) {
      try {
        // Create the batch
        createBatch(batchData, {
          onSuccess: (result) => {
            createdCount++;
            
            // If quick add is enabled, create the specified number of batch items
            if (quickAdd.enabled && quickAdd.quantity > 0 && locations.length > 0 && result) {
              createBatchItems({ 
                batchId: result.id, 
                locationId: locations[0]?.id || '', 
                quantity: quickAdd.quantity, 
                basePrefix: result.sku || '' 
              });
            }
          }
        });
      } catch (error) {
        console.error("Error creating batch:", error);
      }
    }
    
    if (createdCount > 0) {
      toast.success(`Successfully added ${createdCount} batch${createdCount > 1 ? 'es' : ''} to inventory`);
      if (quickAdd.enabled && quickAdd.quantity > 0) {
        toast.success(`Added items to inventory`);
      }
    }
    
    setIsBatchFormOpen(false);
  };

  // Filter batches based on search term, category, and location
  const filteredBatches = batches.filter(batch => {
    const matchesSearch = batch.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          batch.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || batch.category_id === selectedCategory;
    const matchesStatus = showInactiveBatches ? true : batch.is_active;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredBatches.length / batchesPerPage);
  const indexOfLastBatch = currentPage * batchesPerPage;
  const indexOfFirstBatch = indexOfLastBatch - batchesPerPage;
  const currentBatches = filteredBatches.slice(indexOfFirstBatch, indexOfLastBatch);

  // Page change handler
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Get unique categories for filter
  const categoryOptions = [
    { id: 'All', name: 'All Categories' },
    ...categories.map(cat => ({ id: cat.id, name: cat.name }))
  ];

  // Get location text for a batch
  const getLocationText = (batch: any) => {
    if (!batch.locations || batch.locations.length === 0) {
      // No items in batch
      return "None";
    } else if (batch.locations.length === 1) {
      // Single location
      return batch.locations[0];
    } else {
      // Multiple locations
      return "Various";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header section */}
      <section className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight mb-1 text-[#445372] dark:text-white">Batches</h1>
            <p className="text-muted-foreground">Manage your batches</p>
          </div>
          <div className="flex flex-col md:flex-row gap-2">
            <Link
              to="/categories"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground px-4 py-2 h-10"
            >
              Manage Categories
            </Link>
            <Link
              to="/locations"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground px-4 py-2 h-10"
            >
              Manage Locations
            </Link>
            <div className="flex gap-2">
              <Button 
                onClick={() => {
                  setEditingBatch(null);
                  setIsFormOpen(true);
                }}
                className="bg-[#00859e] text-white hover:bg-[#00859e]/90"
              >
                <Plus className="mr-2 h-4 w-4" /> Add New Batch
              </Button>
              <Button 
                className="bg-[#00859e] text-white hover:bg-[#00859e]/90"
                onClick={() => setIsBatchFormOpen(true)}
              >
                <Upload className="mr-2 h-4 w-4" /> Add Multiple Batches
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Search and filter section */}
      <section className="mb-8">
        <SearchAndFilter 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search batches by name or code..."
          selectedFilter={selectedCategory}
          onFilterChange={setSelectedCategory}
          filterOptions={categoryOptions}
          filterLabel="Select Category"
        />
      </section>

      {/* Batch count and export/import buttons section */}
      <section className="mb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{currentBatches.length}</span> of {filteredBatches.length} batches
            </p>
            <label className="flex items-center gap-1 text-sm">
              <input 
                type="checkbox" 
                checked={showInactiveBatches}
                onChange={(e) => setShowInactiveBatches(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-[#00859e] focus:ring-[#00859e]"
              />
              Show inactive
            </label>
          </div>
          
          <div className="flex gap-2">
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3">
              <Download className="mr-2 h-4 w-4" /> Export
            </button>
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3">
              <Upload className="mr-2 h-4 w-4" /> Import
            </button>
          </div>
        </div>
      </section>

      {/* Batches grid section */}
      <section>
        {batchesLoading ? (
          <div className="flex justify-center items-center py-12">
            <p>Loading batches...</p>
          </div>
        ) : currentBatches.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {currentBatches.map((batch) => {
                const locationName = getLocationText(batch);
                
                return (
                  <BatchCard
                    key={batch.id}
                    id={batch.id}
                    name={batch.name}
                    category={batch.categories?.name || "Uncategorized"}
                    sku={batch.sku}
                    location={locationName}
                    stock={batch.stock || 0}
                    minStock={batch.min_stock}
                    description={batch.description || ""}
                    isActive={batch.is_active}
                    onEdit={handleEditBatch}
                    onDelete={handleDeleteBatch}
                  />
                );
              })}
            </div>
            
            {/* Use the PaginationControl component */}
            {totalPages > 1 && (
              <div className="mt-8">
                <PaginationControl
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-3 bg-secondary rounded-full mb-4">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">No batches found</h3>
            <p className="text-muted-foreground text-sm max-w-md">
              We couldn't find any batches matching your search criteria. Try adjusting your filters or search term.
            </p>
          </div>
        )}
      </section>

      {/* Batch Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[95vw] md:max-w-[800px] max-h-[90vh] overflow-hidden p-0">
          <DialogHeader className="p-4 md:p-6 pb-0 md:pb-0">
            <DialogTitle className="text-[#445372] dark:text-white">
              {editingBatch ? 'Edit Batch' : 'Add New Batch'}
            </DialogTitle>
            <DialogDescription>
              {editingBatch 
                ? 'Update the batch information below.' 
                : 'Fill out the form below to add a new batch to inventory.'}
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 md:p-6 overflow-auto max-h-[calc(90vh-120px)]">
            <BatchForm 
              initialValues={editingBatch}
              onSubmit={handleFormSubmit}
              onCancel={() => setIsFormOpen(false)}
              categories={categories.map(cat => ({ 
                id: cat.id, 
                name: cat.name, 
                attributes: cat.attributes || [] 
              }))}
              locations={locations}
              isEditing={!!editingBatch}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Batch Form Dialog */}
      <Dialog open={isBatchFormOpen} onOpenChange={setIsBatchFormOpen}>
        <DialogContent className="sm:max-w-[95vw] md:max-w-[800px] max-h-[90vh] overflow-hidden p-0">
          <DialogHeader className="p-4 md:p-6 pb-0 md:pb-0">
            <DialogTitle className="text-[#445372] dark:text-white">Add Multiple Batches</DialogTitle>
            <DialogDescription>
              Quickly add multiple batches to inventory at once. You can fill in more details later.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 md:p-6 overflow-auto max-h-[calc(90vh-120px)]">
            <BatchBatchForm 
              onSubmit={handleBatchFormSubmit}
              onCancel={() => setIsBatchFormOpen(false)}
              categories={categories}
              locations={locations}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!batchToDelete} onOpenChange={(open) => !open && setBatchToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#445372]">
              {batches.find(p => p.id === batchToDelete)?.is_active 
                ? 'Deactivate Batch' 
                : 'Permanently Delete Batch'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {batches.find(p => p.id === batchToDelete)?.is_active 
                ? 'This will deactivate the batch. It will remain in the database but won\'t appear in active inventory.' 
                : 'This will permanently remove the batch from the database. This action cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className={batches.find(p => p.id === batchToDelete)?.is_active 
                ? 'bg-orange-500 hover:bg-orange-600' 
                : 'bg-red-500 hover:bg-red-600'}
            >
              {batches.find(p => p.id === batchToDelete)?.is_active 
                ? 'Deactivate' 
                : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BatchManagement;
