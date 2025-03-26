
import React from 'react';
import { Edit, Trash, MoreVertical } from 'lucide-react';

interface ProductCardProps {
  id: string;
  name: string;
  category: string;
  sku: string;
  stock: number;
  minStock: number;
  price: number;
  imageUrl?: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const ProductCard = ({
  id,
  name,
  category,
  sku,
  stock,
  minStock,
  price,
  imageUrl,
  onEdit,
  onDelete
}: ProductCardProps) => {
  const isLowStock = stock <= minStock;
  
  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm hover:shadow transition-shadow duration-300">
      <div className="aspect-square overflow-hidden bg-secondary/30">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={name} 
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary/50">
            <span className="text-muted-foreground text-xs">No image</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium line-clamp-1">{name}</p>
            <p className="text-xs text-muted-foreground mt-1">{category}</p>
          </div>
          <div className="relative group">
            <button className="p-1 text-muted-foreground hover:text-foreground rounded-full transition-colors">
              <MoreVertical size={16} />
            </button>
            <div className="absolute right-0 mt-1 w-32 bg-card border border-border rounded-md shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <div className="py-1">
                <button 
                  onClick={() => onEdit?.(id)} 
                  className="w-full flex items-center px-3 py-2 text-xs text-left hover:bg-secondary transition-colors"
                >
                  <Edit size={14} className="mr-2" />
                  Edit
                </button>
                <button 
                  onClick={() => onDelete?.(id)} 
                  className="w-full flex items-center px-3 py-2 text-xs text-left text-destructive hover:bg-secondary transition-colors"
                >
                  <Trash size={14} className="mr-2" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-3 flex justify-between items-center text-xs">
          <span className="text-muted-foreground">SKU: {sku}</span>
          <span className={`font-medium ${isLowStock ? 'text-destructive' : 'text-foreground'}`}>
            Stock: {stock}
          </span>
        </div>
        
        <div className="mt-3 flex justify-between items-baseline">
          <span className="font-semibold">${price.toFixed(2)}</span>
          <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            isLowStock 
              ? 'bg-destructive/10 text-destructive' 
              : 'bg-green-100 text-green-700'
          }`}>
            {isLowStock ? 'Low Stock' : 'In Stock'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
