
import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CategoryForm from '../ui/CategoryForm';
import { useToast } from '@/hooks/use-toast';
import { useCategories, type Category } from '@/hooks/useCategories';
import { Loader2 } from 'lucide-react';

const CategoryManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  const { toast } = useToast();
  const { 
    categories, 
    isLoading, 
    isError, 
    createCategory, 
    updateCategory 
  } = useCategories();

  // Filter categories based on search term
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Get attribute name by id
  const getAttributeName = (attributeId: string) => {
    const attribute = optionalAttributes.find(attr => attr.id === attributeId);
    return attribute ? attribute.name : attributeId;
  };

  // Optional attributes for reference
  const optionalAttributes = [
    { id: 'manufacturer', name: 'Manufacturer' },
    { id: 'unitCost', name: 'Unit Cost/Price' },
    { id: 'serialNumber', name: 'Serial Number' },
    { id: 'macAddress', name: 'MAC Address' },
    { id: 'warrantyInfo', name: 'Warranty Information' },
    { id: 'firmwareVersion', name: 'Firmware Version' },
    { id: 'licenseKeys', name: 'Software License Keys' },
    { id: 'compatibilityInfo', name: 'Compatibility Information' },
    { id: 'networkSpecs', name: 'Network Specifications' },
    { id: 'powerConsumption', name: 'Power Consumption' },
    { id: 'lifecycleStatus', name: 'Lifecycle Status' }
  ];

  const handleFormSubmit = (values: any) => {
    if (editingCategory) {
      // Update existing category
      updateCategory({ 
        id: editingCategory.id, 
        data: {
          name: values.name,
          description: values.description || null,
          attributes: values.attributes || null,
          is_active: true
        }
      });
    } else {
      // Add new category
      createCategory({
        name: values.name,
        description: values.description || null,
        attributes: values.attributes || null,
        is_active: true
      });
    }
    
    setIsFormOpen(false);
    setEditingCategory(null);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[#00859e]" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>Error loading categories. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight mb-1 text-[#445372]">Categories</h1>
            <p className="text-muted-foreground">Manage product categories and their attributes</p>
          </div>
          <button 
            onClick={() => {
              setEditingCategory(null);
              setIsFormOpen(true);
            }}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-[#00859e] text-white shadow hover:bg-[#00859e]/90 px-4 py-2 h-10"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Category
          </button>
        </div>
      </section>

      <section className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            type="text"
            placeholder="Search categories..."
            className="pl-10 w-full h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </section>

      <section>
        {filteredCategories.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {filteredCategories.map((category) => (
              <div 
                key={category.id} 
                className="bg-card rounded-lg border border-border shadow-sm p-6"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-medium text-[#445372]">{category.name}</h3>
                    {category.description && (
                      <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                    )}
                  </div>
                  <button 
                    onClick={() => handleEditCategory(category)}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4"
                  >
                    Edit
                  </button>
                </div>
                
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Optional Attributes:</h4>
                  {category.attributes && category.attributes.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {category.attributes.map((attrId) => (
                        <span 
                          key={attrId} 
                          className="bg-[#00859e]/10 text-[#00859e] text-xs px-2 py-1 rounded-full"
                        >
                          {getAttributeName(attrId)}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No optional attributes defined.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-3 bg-secondary rounded-full mb-4">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">No categories found</h3>
            <p className="text-muted-foreground text-sm max-w-md">
              We couldn't find any categories matching your search term. Try adjusting your search or create a new category.
            </p>
          </div>
        )}
      </section>

      {/* Category Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-[#445372]">{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
            <DialogDescription>
              {editingCategory 
                ? 'Update the category information and optional attributes below.' 
                : 'Fill out the form below to add a new product category.'}
            </DialogDescription>
          </DialogHeader>
          <CategoryForm 
            initialValues={editingCategory ? {
              name: editingCategory.name,
              description: editingCategory.description || '',
              attributes: editingCategory.attributes || []
            } : undefined}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
            isEditing={!!editingCategory}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoryManagement;
