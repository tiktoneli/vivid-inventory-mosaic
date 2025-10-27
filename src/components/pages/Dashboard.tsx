
import React, { useState } from 'react';
import StatsCard from '@/components/ui/StatsCard';
import { BarChart, LineChart, PieChart } from '@/components/ui/charts';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, ArrowUpRight, Box, DollarSign, Package, TrendingUp, Users } from 'lucide-react';
import ProductCard from '../ui/ProductCard';

const Dashboard = () => {
  const [dateRange, setDateRange] = useState('7d');

  const recentMovements = [
    { id: 1, type: 'in', quantity: 15, product: 'Premium Bluetooth Headphones', date: '2023-11-10', user: 'John Doe' },
    { id: 2, type: 'out', quantity: 5, product: 'Ergonomic Office Chair', date: '2023-11-09', user: 'Jane Smith' },
    { id: 3, type: 'in', quantity: 20, product: 'Ultra HD Smart TV 55"', date: '2023-11-08', user: 'John Doe' },
    { id: 4, type: 'out', quantity: 3, product: 'Stainless Steel Water Bottle', date: '2023-11-07', user: 'Mike Brown' },
    { id: 5, type: 'out', quantity: 2, product: 'Wireless Charging Pad', date: '2023-11-06', user: 'Sarah Williams' },
  ];

  const lowStockProducts = [
    {
      id: '2',
      name: 'Ergonomic Office Chair',
      category: 'Furniture',
      sku: 'FRN-CHR-021',
      location: 'Warehouse B',
      stock: 12,
      minStock: 15,
      price: 249.99
    },
    {
      id: '3',
      name: 'Ultra HD Smart TV 55"',
      category: 'Electronics',
      sku: 'TV-UHD-055',
      location: 'Warehouse A',
      stock: 8,
      minStock: 10,
      price: 899.99
    },
    {
      id: '7',
      name: 'Ceramic Coffee Mug Set',
      category: 'Kitchen',
      sku: 'KIT-MUG-201',
      location: 'Warehouse C',
      stock: 5,
      minStock: 20,
      price: 39.99
    }
  ];

  // Sample data for charts
  const barChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Product Entries',
        data: [65, 59, 80, 81, 56, 55],
        backgroundColor: '#00859e',
      },
      {
        label: 'Product Exits',
        data: [28, 48, 40, 19, 86, 27],
        backgroundColor: '#445372',
      }
    ],
  };

  const lineChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Inventory Value ($)',
        data: [4000, 3000, 3500, 4200, 4800, 5000, 5200],
        borderColor: '#00859e',
        tension: 0.3,
      }
    ],
  };

  const pieChartData = {
    labels: ['Electronics', 'Furniture', 'Kitchen', 'Office'],
    datasets: [
      {
        label: 'Products by Category',
        data: [42, 23, 15, 20],
        backgroundColor: ['#00859e', '#445372', '#5a6d8f', '#8fa3c8'],
      }
    ],
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight mb-6 text-[#445372]">Dashboard</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Products"
            value="324"
            change="+12"
            status="increase"
            description="from last month"
            icon={<Box size={24} />}
          />
          <StatsCard
            title="Inventory Value"
            value="$142,384"
            change="+8.2%"
            status="increase"
            description="from last month"
            icon={<DollarSign size={24} />}
          />
          <StatsCard
            title="Low Stock Items"
            value="12"
            change="+3"
            status="decrease"
            description="from last week"
            icon={<AlertCircle size={24} />}
          />
          <StatsCard
            title="Total Users"
            value="14"
            change="+2"
            status="increase"
            description="new this month"
            icon={<Users size={24} />}
          />
        </div>
      </section>
      
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl text-[#445372]">Inventory Movements</CardTitle>
              <Tabs defaultValue="7d" className="w-[180px]" onValueChange={setDateRange}>
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="7d">7d</TabsTrigger>
                  <TabsTrigger value="30d">30d</TabsTrigger>
                  <TabsTrigger value="90d">90d</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <CardDescription>Entries vs. exits over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <BarChart data={barChartData} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl text-[#445372]">Inventory Value Trend</CardTitle>
                <CardDescription>Total value over time</CardDescription>
              </div>
              <div className="flex items-center gap-1 text-sm bg-[#00859e]/10 text-[#00859e] px-2 py-0.5 rounded">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>+14.2%</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <LineChart data={lineChartData} />
            </div>
          </CardContent>
        </Card>
      </section>
      
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-xl text-[#445372]">Products by Category</CardTitle>
            <CardDescription>Distribution of inventory items</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <PieChart data={pieChartData} />
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl text-[#445372]">Recent Activity</CardTitle>
            <CardDescription>Latest inventory movements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMovements.map((movement) => (
                <div key={movement.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div className="flex items-start gap-2">
                    <div className={`p-2 rounded-full ${movement.type === 'in' ? 'bg-green-100' : 'bg-orange-100'}`}>
                      <Package className={`h-4 w-4 ${movement.type === 'in' ? 'text-green-600' : 'text-orange-600'}`} />
                    </div>
                    <div>
                      <div className="font-medium">{movement.product}</div>
                      <div className="text-sm text-muted-foreground">
                        {movement.type === 'in' ? 'Added to' : 'Removed from'} inventory by {movement.user}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-medium ${movement.type === 'in' ? 'text-green-600' : 'text-orange-600'}`}>
                      {movement.type === 'in' ? '+' : '-'}{movement.quantity} units
                    </div>
                    <div className="text-sm text-muted-foreground">{movement.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
      
      <section className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-[#445372]">Low Stock Alerts</h2>
          <a href="/inventory" className="text-[#00859e] text-sm hover:underline flex items-center">
            View All <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
          </a>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {lowStockProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              category={product.category}
              sku={product.sku}
              location={product.location}
              stock={product.stock}
              minStock={product.minStock}
              onEdit={() => {}}
              onDelete={() => {}}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
