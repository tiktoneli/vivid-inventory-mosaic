import React, { useState } from 'react';
import { Plus, Search, Filter, ArrowUpDown, Download, Upload } from 'lucide-react';
import ProductCard from '../ui/ProductCard';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import ProductForm from '../ui/ProductForm';
import { Link } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useLocations } from '@/hooks/useLocations';
import { useProductItems } from '@/hooks/useProductItems';
import { toast } from 'sonner';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import BatchProductForm from '../ui/BatchProductForm';
import { ScrollArea } from '@/components/ui/scroll-area';

const ProductManagement = () => {
  const { products, isLoading: productsLoading, createProduct, updateProduct, deleteProduct } = useProducts();
  const { createProductItem } = useProductItems();
  const { categories } = useCategories();
  const { locations } = useLocations();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isBatchFormOpen, setIsBatchFormOpen] = useState(false);
  const [showInactiveProducts, setShowInactiveProducts] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  // Product actions handlers
  const handleEditProduct = (id: string) => {
    const product = products.find(p => p.id === id);
    if (product) {
      setEditingProduct(product);
      setIsFormOpen(true);
    }
  };

  const handleDeleteProduct = (id: string) => {
    setProductToDelete(id);
  };

  const confirmDelete = () => {
    if (!productToDelete) return;
    
    deleteProduct(productToDelete);
    setProductToDelete(null);
  };

  const handleFormSubmit = (values: any) => {
    if (editingProduct) {
      // Update existing product
      updateProduct({
        id: editingProduct.id,
        data: values
      });
    } else {
      // Add new product
      createProduct(values);
    }
    
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const handleBatchFormSubmit = (products: any[], quickAdd: { enabled: boolean; quantity: number }) => {
    let createdCount = 0;
    
    // Process each product in the batch (which are now batches themselves)
    const processProducts = async () => {
      for (const productData of products) {
        try {
          // Create the product batch
          const product = await createProduct({
            ...productData,
            sku: productData.batch_code, // Map batch_code to sku field in the database
          });
          createdCount++;
          
          // If quick add is enabled, create the specified number of product items
          if (quickAdd.enabled && quickAdd.quantity > 0) {
            for (let i = 0; i < quickAdd.quantity; i++) {
              await createProductItem({
                product_id: product.id,
                sku: "", // Leave blank for later editing
                serial_number: `${product.name}-${i+1}`, // Generate a temporary serial number
                location_id: product.location,
                status: "available",
                notes: `Auto-created as part of batch ${productData.batch_code}`
              });
            }
          }
        } catch (error) {
          console.error("Error creating product batch:", error);
        }
      }
      
      if (createdCount > 0) {
        toast.success(`Successfully added ${createdCount} product batch${createdCount > 1 ? 'es' : ''} to inventory`);
        if (quickAdd.enabled) {
          toast.success(`Added ${quickAdd.quantity * createdCount} items to inventory`);
        }
      }
    };
    
    processProducts();
    setIsBatchFormOpen(false);
  };

  // Filter products based on search term, category, and location
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category_id === selectedCategory;
    const matchesLocation = selectedLocation === 'All' || product.location === selectedLocation;
    const matchesStatus = showInactiveProducts ? true : product.is_active;
    return matchesSearch && matchesCategory && matchesLocation && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Page change handler
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Get unique categories for filter
  const categoryOptions = [
    { id: 'All', name: 'All Categories' },
    ...categories.map(cat => ({ id: cat.id, name: cat.name }))
  ];

  // Get unique locations for filter
  const locationOptions = [
    { id: 'All', name: 'All Locations' },
    ...locations.map(loc => ({ id: loc.id, name: loc.name }))
  ];

  // Generate pagination items
  const renderPaginationItems = () => {
    const items = [];
    
    // Show first page
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="first">
          <PaginationLink onClick={() => handlePageChange(1)}>1</PaginationLink>
        </PaginationItem>
      );
      
      if (currentPage > 4) {
        items.push(<PaginationItem key="ellipsis1"><span className="px-4">...</span></PaginationItem>);
      }
    }
    
    // Show pages around current page
    for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink 
            isActive={currentPage === i} 
            onClick={() => handlePageChange(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Show last page
    if (currentPage < totalPages - 2) {
      if (currentPage < totalPages - 3) {
        items.push(<PaginationItem key="ellipsis2"><span className="px-4">...</span></PaginationItem>);
      }
      
      items.push(
        <PaginationItem key="last">
          <PaginationLink onClick={() => handlePageChange(totalPages)}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight mb-1 text-[#445372]">Product Batches</h1>
            <p className="text-muted-foreground">Manage your product batches</p>
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
                  setEditingProduct(null);
                  setIsFormOpen(true);
                }}
                className="bg-[#00859e] text-white hover:bg-[#00859e]/90"
              >
                <Plus className="mr-2 h-4 w-4" /> Add New Batch
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsBatchFormOpen(true)}
                className="border-[#00859e] text-[#00859e] hover:bg-[#00859e]/10"
              >
                <Upload className="mr-2 h-4 w-4" /> Add Multiple Batches
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search batches by name or code..."
              className="pl-10 w-full h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map(category => (
                  <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select
              value={selectedLocation}
              onValueChange={setSelectedLocation}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select Location" />
              </SelectTrigger>
              <SelectContent>
                {locationOptions.map(location => (
                  <SelectItem key={location.id} value={location.id}>{location.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10">
              <Filter className="h-4 w-4" />
            </button>
            
            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10">
              <ArrowUpDown className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      <section className="mb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{currentProducts.length}</span> of {filteredProducts.length} product batches
            </p>
            <label className="flex items-center gap-1 text-sm">
              <input 
                type="checkbox" 
                checked={showInactiveProducts}
                onChange={(e) => setShowInactiveProducts(e.target.checked)}
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

      <section>
        {productsLoading ? (
          <div className="flex justify-center items-center py-12">
            <p>Loading product batches...</p>
          </div>
        ) : currentProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {currentProducts.map((product) => {
                const locationName = locations.find(loc => loc.id === product.location)?.name || "Unknown";
                
                return (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    category={product.categories?.name || "Uncategorized"}
                    sku={product.sku}
                    location={locationName}
                    stock={product.stock || 0}
                    minStock={product.min_stock}
                    description={product.description || ""}
                    isActive={product.is_active}
                    onEdit={handleEditProduct}
                    onDelete={handleDeleteProduct}
                  />
                );
              })}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination>
                  <PaginationContent>
                    {currentPage > 1 && (
                      <PaginationItem>
                        <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />
                      </PaginationItem>
                    )}
                    
                    {renderPaginationItems()}
                    
                    {currentPage < totalPages && (
                      <PaginationItem>
                        <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-3 bg-secondary rounded-full mb-4">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">No product batches found</h3>
            <p className="text-muted-foreground text-sm max-w-md">
              We couldn't find any product batches matching your search criteria. Try adjusting your filters or search term.
            </p>
          </div>
        )}
      </section>

      {/* Product Form Dialog - Made more responsive */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[95vw] md:max-w-[800px] h-[90vh] sm:h-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-[#445372]">
              {editingProduct ? 'Edit Batch' : 'Add New Batch'}
            </DialogTitle>
            <DialogDescription>
              {editingProduct 
                ? 'Update the batch information below.' 
                : 'Fill out the form below to add a new product batch to inventory.'}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(90vh-10rem)] pr-4 -mr-4">
            <ProductForm 
              initialValues={editingProduct}
              onSubmit={handleFormSubmit}
              onCancel={() => setIsFormOpen(false)}
              categories={categories.map(cat => ({ 
                id: cat.id, 
                name: cat.name, 
                attributes: cat.attributes || [] 
              }))}
              locations={locations}
              isEditing={!!editingProduct}
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Batch Product Form Dialog - Made more responsive */}
      <Dialog open={isBatchFormOpen} onOpenChange={setIsBatchFormOpen}>
        <DialogContent className="sm:max-w-[95vw] md:max-w-[800px] h-[90vh] sm:h-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-[#445372]">Add Multiple Batches</DialogTitle>
            <DialogDescription>
              Quickly add multiple product batches to inventory at once. You can fill in more details later.
            </DialogDescription>
          </DialogHeader>
          <BatchProductForm 
            onSubmit={handleBatchFormSubmit}
            onCancel={() => setIsBatchFormOpen(false)}
            categories={categories}
            locations={locations}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!productToDelete} onOpenChange={(open) => !open && setProductToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#445372]">
              {products.find(p => p.id === productToDelete)?.is_active 
                ? 'Deactivate Batch' 
                : 'Permanently Delete Batch'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {products.find(p => p.id === productToDelete)?.is_active 
                ? 'This will deactivate the batch. It will remain in the database but won\'t appear in active inventory.' 
                : 'This will permanently remove the batch from the database. This action cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className={products.find(p => p.id === productToDelete)?.is_active 
                ? 'bg-orange-500 hover:bg-orange-600' 
                : 'bg-red-500 hover:bg-red-600'}
            >
              {products.find(p => p.id === productToDelete)?.is_active 
                ? 'Deactivate' 
                : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductManagement;
