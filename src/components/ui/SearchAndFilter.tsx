
import React from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FilterOption {
  id: string;
  name: string;
}

interface SearchAndFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  selectedFilter?: string;
  onFilterChange?: (value: string) => void;
  filterOptions?: FilterOption[];
  filterLabel?: string;
  showSortButton?: boolean;
  onSortClick?: () => void;
  showFilterButton?: boolean;
  onFilterClick?: () => void;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchTerm,
  onSearchChange,
  searchPlaceholder = 'Search...',
  selectedFilter,
  onFilterChange,
  filterOptions = [],
  filterLabel = 'Filter',
  showSortButton = true,
  onSortClick,
  showFilterButton = true,
  onFilterClick
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          className="pl-10 w-full h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="flex gap-2 flex-wrap">
        {filterOptions.length > 0 && onFilterChange && (
          <Select
            value={selectedFilter}
            onValueChange={onFilterChange}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder={filterLabel} />
            </SelectTrigger>
            <SelectContent>
              {filterOptions.map(option => (
                <SelectItem key={option.id} value={option.id}>{option.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        
        {showFilterButton && (
          <button 
            onClick={onFilterClick}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10"
          >
            <Filter className="h-4 w-4" />
          </button>
        )}
        
        {showSortButton && (
          <button 
            onClick={onSortClick}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10"
          >
            <ArrowUpDown className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchAndFilter;
