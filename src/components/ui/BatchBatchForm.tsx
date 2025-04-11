import React, { useState, useEffect } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { X, Plus, Check, RefreshCw } from 'lucide-react';
import { Textarea } from './textarea';
import BatchItemCreator from './BatchItemCreator';
import { generateMultipleBatchCodes } from '@/utils/batchCodeGenerator';
import { toast } from 'sonner';

interface BatchBatchFormProps {
  onSubmit: (batches: any[], quickAdd: { enabled: boolean; quantity: number; location: string; prefix?: string; notes?: string }) => void;
  onCancel: () => void;
  categories: any[];
  locations: any[];
}

const EmptyBatchRow = {
  name: '',
  sku: '',
  category_id: '',
  description: '',
  min_stock: 0,
  price: null,
};

const BatchBatchForm: React.FC<BatchBatchFormProps> = ({ onSubmit, onCancel, categories, locations }) => {
  const [batches, setBatches] = useState([{ ...EmptyBatchRow }]);
  const [quickAdd, setQuickAdd] = useState<{ enabled: boolean; quantity: number; location: string; prefix: string; notes: string }>({
    enabled: true, // Default to enabled for better UX
    quantity: 1,
    location: locations.length > 0 ? locations[0].id : '',
    prefix: '',
    notes: 'Auto-generated batch item'
  });
  const [codePrefix, setCodePrefix] = useState<string>('BCH');
  const [isGeneratingCodes, setIsGeneratingCodes] = useState<boolean>(false);

  // Generate batch codes when batches array changes
  useEffect(() => {
    generateCodes();
  }, []); // Only run on initial load

  const generateCodes = async () => {
    if (batches.length === 0) return;
    
    setIsGeneratingCodes(true);
    try {
      const codes = await generateMultipleBatchCodes(batches.length, codePrefix);
      
      // Update each batch with its auto-generated code, only if the sku field is empty
      const updatedBatches = batches.map((batch, index) => ({
        ...batch,
        sku: batch.sku || codes[index] || `${codePrefix}-${Date.now().toString().slice(-6)}-${index+1}`
      }));
      
      setBatches(updatedBatches);
    } catch (error) {
      console.error('Failed to generate batch codes:', error);
      toast.error('Failed to generate batch codes', { 
        description: 'Using fallback codes instead' 
      });
      
      // Fallback code generation
      const fallbackCodes = batches.map((_, index) => 
        `${codePrefix}-${Date.now().toString().slice(-6)}-${index+1}`
      );
      
      const updatedBatches = batches.map((batch, index) => ({
        ...batch,
        sku: batch.sku || fallbackCodes[index]
      }));
      
      setBatches(updatedBatches);
    } finally {
      setIsGeneratingCodes(false);
    }
  };

  const refreshCodes = () => {
    generateCodes();
  };

  const addRow = async () => {
    const newBatches = [...batches, { ...EmptyBatchRow }];
    setBatches(newBatches);
    
    // Generate code for the new row
    try {
      const codes = await generateMultipleBatchCodes(newBatches.length, codePrefix);
      const lastCode = codes[codes.length - 1];
      
      // Only update the last row's code if it's empty
      setBatches(prev => prev.map((batch, idx) => {
        if (idx === prev.length - 1 && !batch.sku) {
          return { ...batch, sku: lastCode };
        }
        return batch;
      }));
    } catch (error) {
      console.error('Failed to generate code for new row:', error);
    }
  };

  const removeRow = (index: number) => {
    if (batches.length > 1) {
      setBatches(batches.filter((_, i) => i !== index));
    }
  };

  const updateBatch = (index: number, field: string, value: any) => {
    const updatedBatches = [...batches];
    updatedBatches[index] = {
      ...updatedBatches[index],
      [field]: value,
    };
    setBatches(updatedBatches);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validBatches = batches.filter(p => p.name.trim() !== '' && p.sku.trim() !== '' && p.category_id);
    if (validBatches.length > 0) {
      onSubmit(validBatches, quickAdd);
    }
  };

  const handlePrefixChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCodePrefix(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-wrap gap-4 items-end mb-4">
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="prefix" className="block text-sm font-medium mb-1 dark:text-white">
            Batch Code Prefix
          </label>
          <Input 
            id="prefix" 
            value={codePrefix} 
            onChange={handlePrefixChange} 
            placeholder="BCH" 
            className="w-full"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={refreshCodes}
          disabled={isGeneratingCodes}
          className="mb-[1px]"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isGeneratingCodes ? 'animate-spin' : ''}`} />
          Regenerate Codes
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[500px] border-collapse">
          <thead>
            <tr className="border-b dark:border-gray-700">
              <th className="text-left p-2 text-sm font-medium dark:text-white">Batch Name *</th>
              <th className="text-left p-2 text-sm font-medium dark:text-white">Batch Code *</th>
              <th className="text-left p-2 text-sm font-medium dark:text-white">Category *</th>
              <th className="text-left p-2 text-sm font-medium dark:text-white">Description</th>
              <th className="text-left p-2 text-sm font-medium dark:text-white">Min Stock</th>
              <th className="text-center p-2 text-sm font-medium w-10 dark:text-white"></th>
            </tr>
          </thead>
          <tbody>
            {batches.map((batch, index) => (
              <tr key={index} className="border-b dark:border-gray-700">
                <td className="p-2">
                  <Input
                    placeholder="Enter batch name"
                    value={batch.name}
                    onChange={e => updateBatch(index, 'name', e.target.value)}
                    className="w-full"
                    required
                  />
                </td>
                <td className="p-2">
                  <Input
                    placeholder="Auto-generated code"
                    value={batch.sku}
                    onChange={e => updateBatch(index, 'sku', e.target.value)}
                    className="w-full"
                    required
                  />
                </td>
                <td className="p-2">
                  <Select
                    value={batch.category_id}
                    onValueChange={value => updateBatch(index, 'category_id', value)}
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
                    value={batch.description || ''}
                    onChange={e => updateBatch(index, 'description', e.target.value)}
                    className="w-full h-10 min-h-10 resize-none"
                  />
                </td>
                <td className="p-2">
                  <Input
                    type="number"
                    placeholder="0"
                    value={batch.min_stock}
                    onChange={e => updateBatch(index, 'min_stock', parseInt(e.target.value) || 0)}
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
                    disabled={batches.length === 1}
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

      {/* Use updated BatchItemCreator with all options */}
      {locations.length > 0 && (
        <BatchItemCreator
          enabled={quickAdd.enabled}
          onEnabledChange={(enabled) => setQuickAdd(prev => ({ ...prev, enabled }))}
          quantity={quickAdd.quantity}
          onQuantityChange={(quantity) => setQuickAdd(prev => ({ ...prev, quantity }))}
          location={quickAdd.location}
          onLocationChange={(location) => setQuickAdd(prev => ({ ...prev, location }))}
          locations={locations}
          prefix={quickAdd.prefix}
          onPrefixChange={(prefix) => setQuickAdd(prev => ({ ...prev, prefix }))}
          notes={quickAdd.notes}
          onNotesChange={(notes) => setQuickAdd(prev => ({ ...prev, notes }))}
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

export default BatchBatchForm;
