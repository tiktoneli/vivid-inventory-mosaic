
import React from 'react';
import { type LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon: LucideIcon;
  description?: string;
  delay?: 1 | 2 | 3 | 4;
}

const StatsCard = ({ 
  title, 
  value, 
  trend, 
  icon: Icon, 
  description,
  delay = 1
}: StatsCardProps) => {
  return (
    <div 
      className={`relative overflow-hidden bg-card rounded-lg border border-border shadow-sm p-6 opacity-0 animate-slide-in-delayed-${delay}`}
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
            {trend && (
              <span 
                className={`ml-2 text-xs font-medium ${
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
            )}
          </div>
          {description && (
            <p className="mt-1 text-xs text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        
        <div className="p-2 bg-secondary rounded-full">
          <Icon className="h-5 w-5 text-foreground opacity-80" />
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
