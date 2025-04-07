
import React from 'react';
import { Edit, Trash, AlertCircle, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BatchCardProps {
  id: string;
  name: string;
  category: string;
  sku: string;
  location: string;
  stock: number;
  minStock: number;
  description?: string;
  isActive?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const BatchCard = ({
  id,
  name,
  category,
  sku,
  location,
  stock,
  minStock,
  description,
  isActive = true,
  onEdit,
  onDelete
}: BatchCardProps) => {
  const isLowStock = stock <= minStock;
  
  return (
    <div className={`bg-card rounded-lg border overflow-hidden shadow-sm hover:shadow transition-shadow duration-300 ${!isActive ? 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800/50' : 'border-border'}`}>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center">
              <p className="text-sm font-medium line-clamp-1 text-[#445372] dark:text-white">{name}</p>
              {!isActive && (
                <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full dark:bg-red-900/30 dark:text-red-200">Inactive</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{category}</p>
            {description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{description}</p>}
          </div>
          <div className="relative group">
            <button 
              className="p-1 text-muted-foreground hover:text-[#00859e] rounded-full transition-colors" 
              aria-label="Batch options"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 4C9.1 4 10 3.1 10 2C10 0.9 9.1 0 8 0C6.9 0 6 0.9 6 2C6 3.1 6.9 4 8 4ZM8 6C6.9 6 6 6.9 6 8C6 9.1 6.9 10 8 10C9.1 10 10 9.1 10 8C10 6.9 9.1 6 8 6ZM8 12C6.9 12 6 12.9 6 14C6 15.1 6.9 16 8 16C9.1 16 10 15.1 10 14C10 12.9 9.1 12 8 12Z" fill="currentColor"/>
              </svg>
            </button>
            <div className="absolute right-0 mt-1 w-40 bg-card border border-border rounded-md shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <div className="py-1">
                <Link 
                  to={`/batches/${id}/items`}
                  className="w-full flex items-center px-3 py-2 text-xs text-left hover:bg-secondary transition-colors"
                  aria-label="View batch items"
                >
                  <Package size={14} className="mr-2" />
                  View Items
                </Link>
                <button 
                  onClick={() => onEdit?.(id)} 
                  className="w-full flex items-center px-3 py-2 text-xs text-left hover:bg-secondary transition-colors"
                  aria-label="Edit batch"
                >
                  <Edit size={14} className="mr-2" />
                  Edit
                </button>
                <button 
                  onClick={() => onDelete?.(id)} 
                  className="w-full flex items-center px-3 py-2 text-xs text-left text-destructive hover:bg-secondary transition-colors"
                  aria-label={isActive ? 'Deactivate batch' : 'Delete batch'}
                >
                  <Trash size={14} className="mr-2" />
                  {isActive ? 'Deactivate' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-3 flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">SKU: {sku}</span>
            <span className="text-muted-foreground">Location: {location}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className={`text-xs font-medium ${isLowStock ? 'text-destructive' : 'text-[#00859e] dark:text-[#4cc9e2]'}`}>
              Stock: {stock} {isLowStock && <AlertCircle className="inline h-3 w-3 ml-1" aria-label="Low stock warning" />}
            </span>
            <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              isLowStock 
                ? 'bg-destructive/15 text-destructive dark:bg-destructive/25 dark:text-destructive-foreground' 
                : 'bg-[#00859e]/15 text-[#00859e] dark:bg-[#00859e]/25 dark:text-[#4cc9e2]'
            }`}>
              {isLowStock ? 'Low Stock' : 'In Stock'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchCard;
