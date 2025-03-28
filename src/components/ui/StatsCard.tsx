
import React from 'react';
import { type ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change: string;
  status: "increase" | "decrease" | "neutral";
  description?: string;
  icon: ReactNode;
}

const StatsCard = ({ 
  title, 
  value, 
  change,
  status,
  icon,
  description
}: StatsCardProps) => {
  return (
    <div 
      className="relative overflow-hidden bg-card rounded-lg border border-border shadow-sm p-6"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-muted-foreground text-sm font-medium">
            {title}
          </p>
          <div className="mt-1 flex items-baseline">
            <p className="text-2xl font-semibold tracking-tight">
              {value}
            </p>
            <span 
              className={`ml-2 text-xs font-medium ${
                status === 'increase' ? 'text-green-600' : 
                status === 'decrease' ? 'text-red-600' : 
                'text-gray-600'
              }`}
            >
              {change}
            </span>
          </div>
          {description && (
            <p className="mt-1 text-xs text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        
        <div className="p-2 bg-secondary rounded-full">
          {icon}
        </div>
      </div>
      
      <div 
        className="absolute -bottom-1/2 -right-1/2 w-32 h-32 rounded-full bg-primary opacity-5 blur-3xl" 
        aria-hidden="true"
      />
    </div>
  );
};

export default StatsCard;
