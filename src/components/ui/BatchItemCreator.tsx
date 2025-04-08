
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface BatchItemCreatorProps {
  enabled?: boolean;
  onEnabledChange?: (enabled: boolean) => void;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  location: string;
  onLocationChange: (locationId: string) => void;
  locations: { id: string; name: string }[];
  prefix?: string;
  onPrefixChange?: (prefix: string) => void;
  notes?: string;
  onNotesChange?: (notes: string) => void;
}

const BatchItemCreator: React.FC<BatchItemCreatorProps> = ({
  enabled = false,
  onEnabledChange,
  quantity,
  onQuantityChange,
  location,
  onLocationChange,
  locations = [],
  prefix = '',
  onPrefixChange,
  notes = '',
  onNotesChange
}) => {
  if (locations.length === 0) {
    return null;
  }

  return (
    <div className="bg-muted/50 rounded-md p-4 space-y-2 mt-6 dark:bg-muted/20 dark:text-white">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold dark:text-white">Item Creation</h3>
          <p className="text-xs text-muted-foreground dark:text-gray-300">
            Automatically create individual items for this batch
          </p>
        </div>
        {onEnabledChange && (
          <Switch
            checked={enabled}
            onCheckedChange={onEnabledChange}
            aria-label="Enable item creation"
          />
        )}
      </div>
      
      {(!onEnabledChange || enabled) && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Label htmlFor="quantity" className="text-sm w-32 dark:text-white">
              Items to create:
            </Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              className="w-24"
              value={quantity}
              onChange={(e) => onQuantityChange(parseInt(e.target.value) || 1)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Label htmlFor="location" className="text-sm w-32 dark:text-white">
              Location:
            </Label>
            <Select
              value={location}
              onValueChange={onLocationChange}
            >
              <SelectTrigger id="location" className="w-full">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map(location => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {onPrefixChange && (
            <div className="flex items-center gap-2">
              <Label htmlFor="prefix" className="text-sm w-32 dark:text-white">
                SKU/Serial Prefix:
              </Label>
              <Input
                id="prefix"
                type="text"
                className="w-full"
                value={prefix}
                onChange={(e) => onPrefixChange(e.target.value)}
                placeholder="Optional prefix for serial numbers"
              />
            </div>
          )}

          {onNotesChange && (
            <div className="flex items-center gap-2">
              <Label htmlFor="notes" className="text-sm w-32 dark:text-white">
                Notes:
              </Label>
              <Textarea
                id="notes"
                className="w-full h-20 min-h-20"
                value={notes}
                onChange={(e) => onNotesChange(e.target.value)}
                placeholder="Optional notes for all created items"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BatchItemCreator;
