
import React, { useState } from 'react';
import { Plus, FileText, ArrowDown, ArrowUp, History, AlertTriangle, Search, Filter, Download } from 'lucide-react';

const InventoryControl = () => {
  const [activeTab, setActiveTab] = useState('movements');

  // Mock data for inventory movements
  const inventoryMovements = [
    {
      id: '1',
      type: 'in',
      reference: 'PO-20240621-001',
      date: '2024-06-21',
      time: '09:34 AM',
      product: 'Premium Bluetooth Headphones',
      quantity: 20,
      location: 'Warehouse A',
      user: 'John Smith'
    },
    {
      id: '2',
      type: 'out',
      reference: 'SO-20240621-023',
      date: '2024-06-21',
      time: '11:42 AM',
      product: 'Ergonomic Office Chair',
      quantity: 5,
      location: 'Warehouse B',
      user: 'Emma Johnson'
    },
    {
      id: '3',
      type: 'transfer',
      reference: 'TR-20240620-007',
      date: '2024-06-20',
      time: '03:15 PM',
      product: 'Ultra HD Smart TV 55"',
      quantity: 3,
      location: 'Warehouse A → Warehouse B',
      user: 'Robert Davis'
    },
    {
      id: '4',
      type: 'in',
      reference: 'PO-20240620-002',
      date: '2024-06-20',
      time: '10:08 AM',
      product: 'Stainless Steel Water Bottle',
      quantity: 50,
      location: 'Warehouse A',
      user: 'John Smith'
    },
    {
      id: '5',
      type: 'out',
      reference: 'SO-20240619-018',
      date: '2024-06-19',
      time: '02:22 PM',
      product: 'Premium Bluetooth Headphones',
      quantity: 8,
      location: 'Warehouse A',
      user: 'Emma Johnson'
    },
    {
      id: '6',
      type: 'adjustment',
      reference: 'ADJ-20240619-004',
      date: '2024-06-19',
      time: '11:54 AM',
      product: 'Ceramic Coffee Mug Set',
      quantity: -3,
      location: 'Warehouse B',
      user: 'Robert Davis'
    },
  ];

  // Mock data for low stock alerts
  const lowStockItems = [
    {
      id: '1',
      name: 'Ultra HD Smart TV 55"',
      sku: 'TV-UHD-055',
      currentStock: 8,
      minStock: 10,
      location: 'Warehouse A',
      daysBelow: 5,
    },
    {
      id: '2',
      name: 'Ergonomic Office Chair',
      sku: 'FRN-CHR-021',
      currentStock: 12,
      minStock: 15,
      location: 'Warehouse B',
      daysBelow: 3,
    },
    {
      id: '3',
      name: 'Ceramic Coffee Mug Set',
      sku: 'KIT-MUG-201',
      currentStock: 5,
      minStock: 20,
      location: 'Warehouse B',
      daysBelow: 10,
    },
  ];

  // Function to render the movement type badge
  const renderMovementTypeBadge = (type: string) => {
    let bgColor = '';
    let textColor = '';
    let icon = null;
    
    switch (type) {
      case 'in':
        bgColor = 'bg-green-100';
        textColor = 'text-green-700';
        icon = <ArrowDown className="h-3 w-3 mr-1" />;
        break;
      case 'out':
        bgColor = 'bg-red-100';
        textColor = 'text-red-700';
        icon = <ArrowUp className="h-3 w-3 mr-1" />;
        break;
      case 'transfer':
        bgColor = 'bg-blue-100';
        textColor = 'text-blue-700';
        icon = <History className="h-3 w-3 mr-1" />;
        break;
      case 'adjustment':
        bgColor = 'bg-amber-100';
        textColor = 'text-amber-700';
        icon = <AlertTriangle className="h-3 w-3 mr-1" />;
        break;
      default:
        bgColor = 'bg-gray-100';
        textColor = 'text-gray-700';
    }
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
        {icon} {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight mb-1">Inventory Control</h1>
            <p className="text-muted-foreground">Monitor and manage your inventory movements</p>
          </div>
          <div className="flex gap-2">
            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 px-4 py-2 h-10">
              <Plus className="mr-2 h-4 w-4" /> Add Movement
            </button>
            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4">
              <FileText className="mr-2 h-4 w-4" /> Generate Report
            </button>
          </div>
        </div>
      </section>

      <section className="mb-6">
        <div className="border-b border-border">
          <nav className="flex gap-4">
            <button 
              onClick={() => setActiveTab('movements')}
              className={`pb-2 px-1 text-sm font-medium transition-colors relative ${
                activeTab === 'movements' 
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Inventory Movements
              {activeTab === 'movements' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />
              )}
            </button>
            <button 
              onClick={() => setActiveTab('lowstock')}
              className={`pb-2 px-1 text-sm font-medium transition-colors relative ${
                activeTab === 'lowstock' 
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Low Stock Alerts
              {activeTab === 'lowstock' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />
              )}
              <span className="ml-2 px-1.5 py-0.5 rounded-full text-xs bg-red-100 text-red-700">
                {lowStockItems.length}
              </span>
            </button>
          </nav>
        </div>
      </section>

      {activeTab === 'movements' && (
        <>
          <section className="mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search by product, reference or location..."
                  className="pl-10 w-full h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              
              <div className="flex gap-2">
                <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4">
                  <Filter className="mr-2 h-4 w-4" /> Filter
                </button>
                <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4">
                  <Download className="mr-2 h-4 w-4" /> Export
                </button>
              </div>
            </div>
          </section>

          <section>
            <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-secondary/50">
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Reference
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        User
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-card">
                    {inventoryMovements.map((movement, index) => (
                      <tr 
                        key={movement.id}
                        className={index !== inventoryMovements.length - 1 ? "border-b border-border" : ""}
                      >
                        <td className="px-4 py-4 whitespace-nowrap">
                          {renderMovementTypeBadge(movement.type)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          <span className="font-medium">{movement.reference}</span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          <div className="text-foreground">{movement.date}</div>
                          <div className="text-xs text-muted-foreground">{movement.time}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          {movement.product}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                          {movement.type === 'adjustment' && movement.quantity < 0 ? movement.quantity : `+${movement.quantity}`}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          {movement.location}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-muted-foreground">
                          {movement.user}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-3 border-t border-border flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing <span className="font-medium">{inventoryMovements.length}</span> of {inventoryMovements.length} movements
                </p>
                <div className="flex gap-1">
                  <button className="inline-flex items-center justify-center rounded-md text-sm font-medium disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8">
                    1
                  </button>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {activeTab === 'lowstock' && (
        <section>
          <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
            <div className="p-4 border-b border-border flex justify-between items-center">
              <h3 className="font-medium text-base">Low Stock Items</h3>
              <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3">
                Restock All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      SKU
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Current Stock
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Min. Stock
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Days Below
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Action
                    </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Days Below
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-card">
                  {lowStockItems.map((item, index) => (
                    <tr 
                      key={item.id}
                      className={index !== lowStockItems.length - 1 ? "border-b border-border" : ""}
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        {item.name}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {item.sku}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <span className="text-red-600 font-medium">{item.currentStock}</span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        {item.minStock}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        {item.location}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.daysBelow > 7 
                            ? 'bg-red-100 text-red-700' 
                            : item.daysBelow > 3 
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-blue-100 text-blue-700'
                        }`}>
                          {item.daysBelow} days
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-right">
                        <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-8 px-3">
                          Create Order
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default InventoryControl;
