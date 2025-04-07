import React, { useState } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { X, Plus, Check } from 'lucide-react';
import { Textarea } from './textarea';
import ProductItemCreator from './ProductItemCreator';

interface BatchProductFormProps {
  onSubmit: (products: any[], quickAdd: { enabled: boolean; quantity: number }) => void;
  onCancel: () => void;
  categories: any[];
  locations: any[];
}

const EmptyProductRow = {
  name: '',
  sku: '', // Changed batch_code to sku to align with schema
  category_id: '',
  description: '',
  min_stock: 0,
  price: null,
};

const BatchProductForm: React.FC<BatchProductFormProps> = ({ onSubmit, onCancel, categories, locations }) => {
  const [products, setProducts] = useState([{ ...EmptyProductRow }]);
  const [quickAdd, setQuickAdd] = useState<{ enabled: boolean; quantity: number }>({
    enabled: true, // Default to enabled for better UX
    quantity: 1
  });

  const addRow = () => {
    setProducts([...products, { ...EmptyProductRow }]);
  };

  const removeRow = (index: number) => {
    if (products.length > 1) {
      setProducts(products.filter((_, i) => i !== index));
    }
  };

  const updateProduct = (index: number, field: string, value: any) => {
    const updatedProducts = [...products];
    updatedProducts[index] = {
      ...updatedProducts[index],
      [field]: value,
    };
    setProducts(updatedProducts);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validProducts = products.filter(p => p.name.trim() !== '' && p.sku.trim() !== '' && p.category_id);
    if (validProducts.length > 0) {
      onSubmit(validProducts, quickAdd);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[500px] border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2 text-sm font-medium">Batch Name *</th>
              <th className="text-left p-2 text-sm font-medium">Batch Code *</th>
              <th className="text-left p-2 text-sm font-medium">Category *</th>
              <th className="text-left p-2 text-sm font-medium">Description</th>
              <th className="text-left p-2 text-sm font-medium">Min Stock</th>
              <th className="text-center p-2 text-sm font-medium w-10"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index} className="border-b">
                <td className="p-2">
                  <Input
                    placeholder="Enter batch name"
                    value={product.name}
                    onChange={e => updateProduct(index, 'name', e.target.value)}
                    className="w-full"
                    required
                  />
                </td>
                <td className="p-2">
                  <Input
                    placeholder="Enter code"
                    value={product.sku}
                    onChange={e => updateProduct(index, 'sku', e.target.value)}
                    className="w-full"
                    required
                  />
                </td>
                <td className="p-2">
                  <Select
                    value={product.category_id}
                    onValueChange={value => updateProduct(index, 'category_id', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-2">
                  <Textarea
                    placeholder="Description"
                    value={product.description || ''}
                    onChange={e => updateProduct(index, 'description', e.target.value)}
                    className="w-full h-10 min-h-10 resize-none"
                  />
                </td>
                <td className="p-2">
                  <Input
                    type="number"
                    placeholder="0"
                    value={product.min_stock}
                    onChange={e => updateProduct(index, 'min_stock', parseInt(e.target.value) || 0)}
                    className="w-full"
                    min="0"
                  />
                </td>
                <td className="p-2 text-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeRow(index)}
                    disabled={products.length === 1}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addRow}
        className="mt-2"
      >
        <Plus className="mr-2 h-4 w-4" /> Add Row
      </Button>

      {/* Replace Quick Add Items with ProductItemCreator */}
      {locations.length > 0 && (
        <ProductItemCreator
          quantity={quickAdd.quantity}
          onQuantityChange={(quantity) => setQuickAdd(prev => ({ ...prev, quantity }))}
          location={locations[0]?.id || ''}
          onLocationChange={() => {}} // Not needed for this form as we always use the first location
          locations={[]} // Empty array as we don't need to show the location selector here
        />
      )}

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-[#00859e] hover:bg-[#00859e]/90 text-white">
          <Check className="mr-2 h-4 w-4" /> Confirm
        </Button>
      </div>
    </form>
  );
};

export default BatchProductForm;
