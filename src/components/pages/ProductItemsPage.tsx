
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProductItems } from '@/hooks/useProductItems';
import { useProducts } from '@/hooks/useProducts';
import { useLocations } from '@/hooks/useLocations';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash2, Plus, HardDrive, Info } from 'lucide-react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ProductItemSelectionForm from '@/components/ui/ProductItemSelectionForm';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ProductItem } from '@/hooks/useProducts';

const ProductItemsPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const { productItems, isLoading, createProductItem, updateProductItem, deleteProductItem } = useProductItems(productId);
  const { products, getProductItems } = useProducts();
  const { locations } = useLocations();
  
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ProductItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (productId && products.length > 0) {
      const product = products.find(p => p.id === productId);
      if (product) {
        setSelectedProduct(product);
      }
    }
  }, [productId, products]);

  const handleEditItem = (item: ProductItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDeleteItem = (id: string) => {
    setItemToDelete(id);
  };

  const confirmDelete = () => {
    if (!itemToDelete) return;
    
    deleteProductItem(itemToDelete);
    setItemToDelete(null);
  };

  const handleFormSubmit = (values: any) => {
    if (editingItem) {
      // Update existing item
      updateProductItem({
        id: editingItem.id,
        data: values
      });
    } else if (productId) {
      // Add new item
      createProductItem({
        ...values,
        product_id: productId
      });
    }
    
    setIsFormOpen(false);
    setEditingItem(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'in_use':
        return 'bg-blue-100 text-blue-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'retired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'in_use':
        return 'In Use';
      case 'maintenance':
        return 'Maintenance';
      case 'retired':
        return 'Retired';
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#00859e]" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link to="/products" className="text-[#00859e] hover:underline flex items-center">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Products
            </Link>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight mb-1 text-[#445372]">
            {selectedProduct ? selectedProduct.name : 'Product'} Items
          </h1>
          <p className="text-muted-foreground">
            Manage individual items for this product
          </p>
        </div>
        
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

      {selectedProduct && (
        <div className="bg-gray-50 rounded-lg p-4 mb-8 border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Product Name</p>
              <p className="font-medium">{selectedProduct.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">SKU</p>
              <p className="font-medium">{selectedProduct.sku}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Category</p>
              <p className="font-medium">{selectedProduct.categories?.name || 'Uncategorized'}</p>
            </div>
          </div>
        </div>
      )}

      {productItems.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableCaption>List of individual items for this product.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Item SKU</TableHead>
                <TableHead>Serial Number</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productItems.map((item) => {
                const location = locations.find(l => l.id === item.location_id);
                
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.sku}</TableCell>
                    <TableCell>{item.serial_number}</TableCell>
                    <TableCell>{location?.name || 'Unknown'}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${getStatusColor(item.status)}`}>
                        {getStatusLabel(item.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate" title={item.notes || ''}>
                      {item.notes || '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditItem(item)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteItem(item.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg">
          <div className="p-3 bg-secondary rounded-full mb-4">
            <HardDrive className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-1">No items found</h3>
          <p className="text-muted-foreground text-sm max-w-md mb-6">
            There are no individual items registered for this product yet. Add your first item to start tracking inventory.
          </p>
          <Button 
            onClick={() => {
              setEditingItem(null);
              setIsFormOpen(true);
            }}
            className="bg-[#00859e] hover:bg-[#00859e]/90"
          >
            <Plus className="mr-2 h-4 w-4" /> Add First Item
          </Button>
        </div>
      )}

      {/* Item Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-[#445372]">{editingItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
            <DialogDescription>
              {editingItem 
                ? 'Update the item information below.' 
                : 'Enter the details for this item below.'}
            </DialogDescription>
          </DialogHeader>
          {productId && (
            <ProductItemSelectionForm
              initialValues={editingItem || undefined}
              onSubmit={handleFormSubmit}
              onCancel={() => setIsFormOpen(false)}
              isEditing={!!editingItem}
              productId={productId}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#445372]">Delete Item</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this item from the inventory. This action cannot be undone.
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
