
import React, { useState } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { X, Plus, Check } from 'lucide-react';
import { Textarea } from './textarea';
import { Switch } from './switch';
import { Label } from './label';

interface BatchProductFormProps {
  onSubmit: (products: any[], quickAdd: { enabled: boolean; quantity: number }) => void;
  onCancel: () => void;
  categories: any[];
  locations: any[];
}

const EmptyProductRow = {
  name: '',
  batch_code: '',
  category_id: '',
  description: '',
  min_stock: 0,
  price: null,
};

const BatchProductForm: React.FC<BatchProductFormProps> = ({ onSubmit, onCancel, categories, locations }) => {
  const [products, setProducts] = useState([{ ...EmptyProductRow }]);
  const [quickAdd, setQuickAdd] = useState<{ enabled: boolean; quantity: number }>({
    enabled: false,
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
    const validProducts = products.filter(p => p.name.trim() !== '' && p.batch_code.trim() !== '' && p.category_id);
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
                    value={product.batch_code}
                    onChange={e => updateProduct(index, 'batch_code', e.target.value)}
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

      {/* Quick add items option */}
      <div className="bg-muted/50 rounded-md p-4 space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold mb-1">Quick Item Addition</h3>
            <p className="text-xs text-muted-foreground">
              Add individual items for each batch automatically
            </p>
          </div>
          <Switch
            checked={quickAdd.enabled}
            onCheckedChange={(checked) => setQuickAdd(prev => ({ ...prev, enabled: checked }))}
          />
        </div>
        
        {quickAdd.enabled && (
          <div className="pt-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="quantity" className="text-sm">
                Items per batch:
              </Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                className="w-24"
                value={quickAdd.quantity}
                onChange={(e) => setQuickAdd(prev => ({ 
                  ...prev, 
                  quantity: parseInt(e.target.value) || 1 
                }))}
              />
              <p className="text-xs text-muted-foreground">
                Each batch will get this many items at the default location
              </p>
            </div>
          </div>
        )}
      </div>

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
