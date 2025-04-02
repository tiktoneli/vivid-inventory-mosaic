
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProductItems } from '@/hooks/useProductItems';
import { useProducts } from '@/hooks/useProducts';
import { useLocations } from '@/hooks/useLocations';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Plus, ArrowLeft, Pencil, Trash2, Package, ArrowUpRight } from 'lucide-react';
import ProductItemSelectionForm from '../ui/ProductItemSelectionForm';

const statusColors: Record<string, string> = {
  available: 'bg-green-100 text-green-800 hover:bg-green-200',
  in_use: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  maintenance: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
  retired: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
};

const ProductItemsPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { productItems, isLoading, createProductItem, updateProductItem, deleteProductItem } = useProductItems(productId);
  const { products } = useProducts();
  const { locations } = useLocations();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [product, setProduct] = useState<any | null>(null);
  
  useEffect(() => {
    if (products.length > 0 && productId) {
      const foundProduct = products.find(p => p.id === productId);
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        // Product not found, navigate back
        navigate('/products');
      }
    }
  }, [products, productId, navigate]);
  
  if (!productId) {
    navigate('/products');
    return null;
  }
  
  const getLocationName = (locationId: string) => {
    const location = locations.find(loc => loc.id === locationId);
    return location ? location.name : 'Unknown Location';
  };
  
  const handleAddItem = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };
  
  const handleEditItem = (item: any) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };
  
  const handleDeleteItem = (itemId: string) => {
    setItemToDelete(itemId);
    setIsConfirmDeleteOpen(true);
  };
  
  const confirmDelete = () => {
    if (itemToDelete) {
      deleteProductItem(itemToDelete);
      setItemToDelete(null);
      setIsConfirmDeleteOpen(false);
    }
  };
  
  const handleFormSubmit = (values: any) => {
    if (editingItem) {
      // Update existing item - Explicitly type the status field
      const updatedValues = {
        ...values,
        status: values.status as "available" | "in_use" | "maintenance" | "retired"
      };
      updateProductItem({
        id: editingItem.id,
        data: updatedValues
      });
    } else {
      // Add new item - Explicitly type the status field
      const newItemValues = {
        ...values,
        product_id: productId,
        status: values.status as "available" | "in_use" | "maintenance" | "retired"
      };
      createProductItem(newItemValues);
    }
    
    setIsFormOpen(false);
    setEditingItem(null);
  };
  
  const getStatusColor = (status: string) => {
    return statusColors[status] || 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/products')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
        </Button>
        
        {product && (
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-[#445372]">{product.name}</h1>
              <p className="text-muted-foreground">
                Batch Code: <span className="font-medium">{product.sku}</span> | 
                Category: <span className="font-medium">{product.categories?.name || 'Uncategorized'}</span>
              </p>
            </div>
            <Button 
              onClick={handleAddItem}
              className="mt-4 md:mt-0 bg-[#00859e] hover:bg-[#00859e]/90"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Item
            </Button>
          </div>
        )}
      </div>
      
      <Separator className="my-6" />
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <p>Loading items...</p>
        </div>
      ) : productItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {productItems.map(item => (
            <Card key={item.id} className="overflow-hidden h-full">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg flex items-center">
                      <Package className="h-5 w-5 mr-2 text-[#00859e]" />
                      {item.serial_number || 'No Serial'}
                    </CardTitle>
                    <CardDescription>
                      {item.sku ? `SKU: ${item.sku}` : 'No SKU'}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(item.status)}>
                    {item.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <p className="text-sm font-medium">Location:</p>
                <p className="text-sm mb-2">{getLocationName(item.location_id)}</p>
                
                {item.notes && (
                  <>
                    <p className="text-sm font-medium">Notes:</p>
                    <p className="text-sm mb-2 line-clamp-2">{item.notes}</p>
                  </>
                )}
                
                <div className="flex mt-4 space-x-2 justify-end">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-blue-600 border-blue-600 hover:bg-blue-50"
                    onClick={() => handleEditItem(item)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-red-600 border-red-600 hover:bg-red-50"
                    onClick={() => handleDeleteItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="p-4 rounded-full bg-muted mb-4">
            <Package className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-medium mb-1">No items found</h3>
          <p className="text-muted-foreground max-w-md mb-6">
            This product batch doesn't have any items yet. Add individual items to track them in your inventory.
          </p>
          <Button 
            onClick={handleAddItem}
            className="bg-[#00859e] hover:bg-[#00859e]/90"
          >
            <Plus className="mr-2 h-4 w-4" /> Add First Item
          </Button>
        </div>
      )}
      
      {/* Add/Edit Item Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
            <DialogDescription>
              {editingItem 
                ? 'Update the information for this inventory item.' 
                : 'Add a new item to this product batch.'}
            </DialogDescription>
          </DialogHeader>
          <ProductItemSelectionForm
            initialValues={editingItem}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
            locations={locations}
            productId={productId}
            isEditing={!!editingItem}
          />
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isConfirmDeleteOpen} onOpenChange={setIsConfirmDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this item? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setItemToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductItemsPage;
