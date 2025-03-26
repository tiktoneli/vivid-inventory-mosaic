
import React, { useState } from 'react';
import { Plus, Search, Filter, ArrowUpDown, Download, Upload } from 'lucide-react';
import ProductCard from '../ui/ProductCard';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import ProductForm from '../ui/ProductForm';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const ProductManagement = () => {
  // Mock product data
  const initialProducts = [
    {
      id: '1',
      name: 'Premium Bluetooth Headphones',
      category: '1', // Electronics
      categoryName: 'Electronics',
      sku: 'BT-HDPH-001',
      location: 'Warehouse A',
      stock: 45,
      minStock: 10,
      price: 129.99,
      description: 'High-quality wireless headphones with noise cancellation',
      dateCreated: '2023-04-15',
      isActive: true,
      manufacturer: 'Audio Tech',
      serialNumber: 'AT-0012345',
      warrantyInfo: '2 years limited warranty'
    },
    {
      id: '2',
      name: 'Ergonomic Office Chair',
      category: '4', // Office Equipment
      categoryName: 'Office Equipment',
      sku: 'FRN-CHR-021',
      location: 'Warehouse B',
      stock: 12,
      minStock: 15,
      price: 249.99,
      description: 'Adjustable office chair with lumbar support',
      dateCreated: '2023-05-22',
      isActive: true,
      manufacturer: 'Office Pro',
      warrantyInfo: '5 years warranty'
    },
    {
      id: '3',
      name: 'Ultra HD Smart TV 55"',
      category: '1', // Electronics
      categoryName: 'Electronics',
      sku: 'TV-UHD-055',
      location: 'Warehouse A',
      stock: 8,
      minStock: 10,
      price: 899.99,
      description: '4K smart television with HDR support',
      dateCreated: '2023-06-10',
      isActive: true,
      manufacturer: 'Vision Electronics',
      serialNumber: 'VE-78901234',
      warrantyInfo: '1 year warranty'
    },
    {
      id: '4',
      name: 'Network Switch 24 Port',
      category: '2', // Networking
      categoryName: 'Networking',
      sku: 'NET-SWT-024',
      location: 'Warehouse C',
      stock: 15,
      minStock: 5,
      price: 189.99,
      description: '24-port gigabit managed switch',
      dateCreated: '2023-07-15',
      isActive: true,
      manufacturer: 'NetGear',
      macAddress: '00:1A:2B:3C:4D:5E',
      serialNumber: 'NG-45678901',
      networkSpecs: 'Gigabit Ethernet, PoE+'
    },
    {
      id: '5',
      name: 'CAD Software License',
      category: '3', // Software
      categoryName: 'Software',
      sku: 'SW-CAD-001',
      location: 'Server Room',
      stock: 25,
      minStock: 10,
      price: 1299.99,
      description: 'Professional CAD software for engineering',
      dateCreated: '2023-08-05',
      isActive: false,
      licenseKeys: 'Multiple license keys stored in secure vault',
      compatibilityInfo: 'Windows 10/11, macOS 12+',
      lifecycleStatus: 'Current'
    }
  ];

  // Mock categories with their optional attributes
  const initialCategories = [
    {
      id: '1',
      name: 'Electronics',
      description: 'Electronic devices and equipment',
      attributes: ['manufacturer', 'serialNumber', 'warrantyInfo', 'firmwareVersion'],
      isActive: true
    },
    {
      id: '2',
      name: 'Networking',
      description: 'Networking equipment and accessories',
      attributes: ['manufacturer', 'macAddress', 'networkSpecs', 'licenseKeys'],
      isActive: true
    },
    {
      id: '3',
      name: 'Software',
      description: 'Software products and licenses',
      attributes: ['licenseKeys', 'compatibilityInfo', 'lifecycleStatus'],
      isActive: true
    },
    {
      id: '4',
      name: 'Office Equipment',
      description: 'Office equipment and supplies',
      attributes: ['manufacturer', 'warrantyInfo', 'powerConsumption'],
      isActive: true
    }
  ];

  // Mock locations
  const locations = ['Warehouse A', 'Warehouse B', 'Warehouse C', 'Office Storage', 'Server Room', 'IT Department'];

  const [products, setProducts] = useState(initialProducts);
  const [categories] = useState(initialCategories);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showInactiveProducts, setShowInactiveProducts] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  
  const { toast } = useToast();

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
    
    const product = products.find(p => p.id === productToDelete);
    if (!product) return;
    
    if (product.isActive) {
      // Deactivate product (soft delete)
      setProducts(products.map(p => 
        p.id === productToDelete ? { ...p, isActive: false } : p
      ));
      toast({
        title: "Product Deactivated",
        description: `${product.name} has been deactivated and will be removed from active inventory.`,
      });
    } else {
      // Hard delete after grace period (in real app this would be handled by backend)
      setProducts(products.filter(p => p.id !== productToDelete));
      toast({
        title: "Product Deleted",
        description: `${product.name} has been permanently removed from the database.`,
        variant: "destructive"
      });
    }
    
    setProductToDelete(null);
  };

  const handleFormSubmit = (values: any) => {
    // Get category name based on category ID
    const category = categories.find(c => c.id === values.category);
    const categoryName = category ? category.name : '';
    
    if (editingProduct) {
      // Update existing product
      setProducts(products.map(p => 
        p.id === editingProduct.id ? { 
          ...p, 
          ...values,
          categoryName,
          price: values.unitCost || p.price
        } : p
      ));
    } else {
      // Add new product
      const newProduct = {
        id: `${Date.now()}`, // In a real app this would be generated by the backend
        ...values,
        categoryName,
        dateCreated: new Date().toISOString().split('T')[0],
        price: values.unitCost || 0,
        isActive: true
      };
      setProducts([newProduct, ...products]);
    }
    
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  // Filter products based on search term and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesStatus = showInactiveProducts ? true : product.isActive;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Get unique categories for filter
  const categoryOptions = [
    { id: 'All', name: 'All Categories' },
    ...categories.map(cat => ({ id: cat.id, name: cat.name }))
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight mb-1 text-[#445372]">Products</h1>
            <p className="text-muted-foreground">Manage your product catalog</p>
          </div>
          <div className="flex flex-col md:flex-row gap-2">
            <Link
              to="/categories"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground px-4 py-2 h-10"
            >
              Manage Categories
            </Link>
            <button 
              onClick={() => {
                setEditingProduct(null);
                setIsFormOpen(true);
              }}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-[#00859e] text-white shadow hover:bg-[#00859e]/90 px-4 py-2 h-10"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </button>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search products by name or SKU..."
              className="pl-10 w-full h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <select
              className="h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categoryOptions.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            
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
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{filteredProducts.length}</span> of {products.length} products
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
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                category={product.categoryName}
                sku={product.sku}
                location={product.location}
                stock={product.stock}
                minStock={product.minStock}
                description={product.description}
                isActive={product.isActive}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-3 bg-secondary rounded-full mb-4">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">No products found</h3>
            <p className="text-muted-foreground text-sm max-w-md">
              We couldn't find any products matching your search criteria. Try adjusting your filters or search term.
            </p>
          </div>
        )}
      </section>

      {/* Product Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[900px]">
          <DialogHeader>
            <DialogTitle className="text-[#445372]">{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            <DialogDescription>
              {editingProduct ? 'Update the product information below.' : 'Fill out the form below to add a new product to inventory.'}
            </DialogDescription>
          </DialogHeader>
          <ProductForm 
            initialValues={editingProduct}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
            categories={categories}
            locations={locations}
            isEditing={!!editingProduct}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!productToDelete} onOpenChange={(open) => !open && setProductToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#445372]">
              {products.find(p => p.id === productToDelete)?.isActive 
                ? 'Deactivate Product' 
                : 'Permanently Delete Product'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {products.find(p => p.id === productToDelete)?.isActive 
                ? 'This will deactivate the product. It will remain in the database but won\'t appear in active inventory.' 
                : 'This will permanently remove the product from the database. This action cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className={products.find(p => p.id === productToDelete)?.isActive 
                ? 'bg-orange-500 hover:bg-orange-600' 
                : 'bg-red-500 hover:bg-red-600'}
            >
              {products.find(p => p.id === productToDelete)?.isActive 
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
