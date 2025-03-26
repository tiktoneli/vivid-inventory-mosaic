
import React, { useState } from 'react';
import { Plus, Search, Filter, ArrowUpDown, Download, Upload, Trash } from 'lucide-react';
import ProductCard from '../ui/ProductCard';

const ProductManagement = () => {
  // Mock product data
  const initialProducts = [
    {
      id: '1',
      name: 'Premium Bluetooth Headphones',
      category: 'Electronics',
      sku: 'BT-HDPH-001',
      stock: 45,
      minStock: 10,
      price: 129.99,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e'
    },
    {
      id: '2',
      name: 'Ergonomic Office Chair',
      category: 'Furniture',
      sku: 'FRN-CHR-021',
      stock: 12,
      minStock: 15,
      price: 249.99,
      imageUrl: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8'
    },
    {
      id: '3',
      name: 'Ultra HD Smart TV 55"',
      category: 'Electronics',
      sku: 'TV-UHD-055',
      stock: 8,
      minStock: 10,
      price: 899.99,
      imageUrl: 'https://images.unsplash.com/photo-1593784991095-a205069470b6'
    },
    {
      id: '4',
      name: 'Stainless Steel Water Bottle',
      category: 'Kitchen',
      sku: 'KIT-BTL-118',
      stock: 86,
      minStock: 20,
      price: 24.99,
      imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8'
    },
    {
      id: '5',
      name: 'Professional DSLR Camera',
      category: 'Electronics',
      sku: 'ELEC-CAM-001',
      stock: 15,
      minStock: 8,
      price: 1299.99,
      imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32'
    },
    {
      id: '6',
      name: 'Wireless Charging Pad',
      category: 'Electronics',
      sku: 'ELEC-CHG-005',
      stock: 34,
      minStock: 15,
      price: 49.99,
      imageUrl: 'https://images.unsplash.com/photo-1618577912008-9b6197f3ac67'
    },
    {
      id: '7',
      name: 'Ceramic Coffee Mug Set',
      category: 'Kitchen',
      sku: 'KIT-MUG-201',
      stock: 5,
      minStock: 20,
      price: 39.99,
      imageUrl: 'https://images.unsplash.com/photo-1481833761820-0509d3217039'
    },
    {
      id: '8',
      name: 'Smart Home Security System',
      category: 'Electronics',
      sku: 'ELEC-SEC-108',
      stock: 23,
      minStock: 10,
      price: 349.99,
      imageUrl: 'https://images.unsplash.com/photo-1558002038-1055907df827'
    },
  ];

  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Product actions handlers
  const handleEditProduct = (id: string) => {
    console.log('Edit product:', id);
    // In a real application, this would open a modal or navigate to edit form
  };

  const handleDeleteProduct = (id: string) => {
    console.log('Delete product:', id);
    // In a real application, this would show a confirmation modal
    setProducts(products.filter(product => product.id !== id));
  };

  // Filter products based on search term and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filter
  const categories = ['All', ...new Set(products.map(product => product.category))];

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight mb-1">Products</h1>
            <p className="text-muted-foreground">Manage your product catalog</p>
          </div>
          <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 px-4 py-2 h-10">
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </button>
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
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
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
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{filteredProducts.length}</span> of {products.length} products
          </p>
          
          <div className="flex gap-2">
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3">
              <Download className="mr-2 h-4 w-4" /> Export
            </button>
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3">
              <Upload className="mr-2 h-4 w-4" /> Import
            </button>
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 w-9">
              <Trash className="h-4 w-4" />
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
                {...product}
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
    </div>
  );
};

export default ProductManagement;
