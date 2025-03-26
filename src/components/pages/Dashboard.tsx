
import React from 'react';
import { Package, ArrowUpDown, DollarSign, AlertTriangle, TrendingUp, ShoppingCart, Truck, ArrowRight, RefreshCw } from 'lucide-react';
import StatsCard from '../ui/StatsCard';
import ProductCard from '../ui/ProductCard';

const Dashboard = () => {
  // Mock data for stats
  const stats = [
    { 
      title: 'Total Products', 
      value: '1,284', 
      trend: { value: 12, isPositive: true },
      icon: Package,
      description: '142 added this month',
      delay: 1
    },
    { 
      title: 'Inventory Value', 
      value: '$124,856', 
      trend: { value: 8.2, isPositive: true },
      icon: DollarSign,
      description: '+$9,276 since last month',
      delay: 2
    },
    { 
      title: 'Stock Movements', 
      value: '867', 
      trend: { value: 4, isPositive: true },
      icon: ArrowUpDown,
      description: 'Last 30 days',
      delay: 3
    },
    { 
      title: 'Low Stock Items', 
      value: '24', 
      trend: { value: 6, isPositive: false },
      icon: AlertTriangle,
      description: 'Requiring attention',
      delay: 4
    },
  ];

  // Mock data for products
  const products = [
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
  ];

  // Handlers for product actions
  const handleEditProduct = (id: string) => {
    console.log('Edit product:', id);
  };

  const handleDeleteProduct = (id: string) => {
    console.log('Delete product:', id);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight mb-1">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your inventory system</p>
      </section>

      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              trend={stat.trend}
              icon={stat.icon}
              description={stat.description}
              delay={stat.delay as 1 | 2 | 3 | 4}
            />
          ))}
        </div>
      </section>

      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold tracking-tight">Recent Activity</h2>
          <button className="text-sm text-primary flex items-center gap-1 hover:underline">
            View all <ArrowRight size={14} />
          </button>
        </div>
        
        <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-border">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Latest Transactions</h3>
              <button className="p-1 text-muted-foreground hover:text-foreground rounded-full transition-colors">
                <RefreshCw size={16} />
              </button>
            </div>
          </div>
          
          <div>
            {[
              { icon: ShoppingCart, label: 'Purchase Order #12453', details: '24 items received', time: '2 hours ago', status: 'Completed' },
              { icon: Truck, label: 'Shipment #89732', details: '12 items shipped to Customer', time: '5 hours ago', status: 'In Transit' },
              { icon: ArrowUpDown, label: 'Internal Transfer', details: 'Warehouse A to Warehouse B', time: '8 hours ago', status: 'Completed' },
              { icon: ShoppingCart, label: 'Purchase Order #12452', details: '36 items received', time: '1 day ago', status: 'Completed' },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div 
                  key={index}
                  className={`px-6 py-4 flex items-center justify-between ${
                    index < 3 ? 'border-b border-border' : ''
                  }`}
                >
                  <div className="flex items-center">
                    <div className="mr-4 p-2 bg-secondary rounded-full">
                      <Icon size={16} className="text-foreground opacity-80" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.details}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                    <p className={`text-xs font-medium ${
                      item.status === 'Completed' 
                        ? 'text-green-600' 
                        : item.status === 'In Transit' 
                          ? 'text-blue-600' 
                          : 'text-amber-600'
                    }`}>
                      {item.status}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold tracking-tight">Popular Products</h2>
          <button className="text-sm text-primary flex items-center gap-1 hover:underline">
            View all <ArrowRight size={14} />
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
