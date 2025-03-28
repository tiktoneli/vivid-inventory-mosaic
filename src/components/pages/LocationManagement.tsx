
import React, { useState } from 'react';
import { Plus, Search, Filter, ArrowUpDown, Pencil, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useLocations } from '@/hooks/useLocations';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const LocationManagement = () => {
  const { locations, createLocation, updateLocation, deleteLocation } = useLocations();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showInactiveLocations, setShowInactiveLocations] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState<string | null>(null);
  const [editingLocation, setEditingLocation] = useState<any | null>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);

  // Location actions handlers
  const handleEditLocation = (id: string) => {
    const location = locations.find(l => l.id === id);
    if (location) {
      setEditingLocation(location);
      setName(location.name);
      setDescription(location.description || '');
      setIsActive(location.is_active);
      setIsFormOpen(true);
    }
  };

  const handleDeleteLocation = (id: string) => {
    setLocationToDelete(id);
  };

  const confirmDelete = () => {
    if (!locationToDelete) return;
    
    deleteLocation(locationToDelete);
    toast.success('Location deleted successfully');
    setLocationToDelete(null);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!name.trim()) {
      toast.error('Location name is required');
      return;
    }
    
    if (editingLocation) {
      // Update existing location
      updateLocation({
        id: editingLocation.id,
        data: {
          name: name,
          description: description,
          is_active: isActive
        }
      });
      toast.success('Location updated successfully');
    } else {
      // Add new location
      createLocation({
        name: name,
        description: description,
        is_active: isActive
      });
      toast.success('Location created successfully');
    }
    
    // Reset form and close dialog
    resetForm();
    setIsFormOpen(false);
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setIsActive(true);
    setEditingLocation(null);
  };

  // Filter locations based on search term
  const filteredLocations = locations.filter(location => {
    const matchesSearch = location.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = showInactiveLocations ? true : location.is_active;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight mb-1 text-[#445372]">Locations</h1>
            <p className="text-muted-foreground">Manage your storage locations</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => {
                resetForm();
                setIsFormOpen(true);
              }}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-[#00859e] text-white shadow hover:bg-[#00859e]/90 px-4 py-2 h-10"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Location
            </button>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search locations..."
              className="pl-10 w-full h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10">
              <Filter className="h-4 w-4" />
            </button>
            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10">
              <ArrowUpDown className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      <section className="mb-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{filteredLocations.length}</span> of {locations.length} locations
            </p>
            <label className="flex items-center gap-1 text-sm">
              <input 
                type="checkbox" 
                checked={showInactiveLocations}
                onChange={(e) => setShowInactiveLocations(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-[#00859e] focus:ring-[#00859e]"
              />
              Show inactive
            </label>
          </div>
        </div>
      </section>

      <section>
        {filteredLocations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredLocations.map((location) => (
              <Card key={location.id} className={`overflow-hidden ${!location.is_active ? 'opacity-60' : ''}`}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg text-[#445372] truncate">{location.name}</CardTitle>
                    <Badge variant={location.is_active ? "default" : "outline"} className={`${location.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {location.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  {location.description && (
                    <CardDescription className="text-sm mt-1 line-clamp-2">
                      {location.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardFooter className="flex gap-2 pt-4">
                  <Button variant="outline" size="sm" onClick={() => handleEditLocation(location.id)}>
                    <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600" onClick={() => handleDeleteLocation(location.id)}>
                    <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-3 bg-secondary rounded-full mb-4">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">No locations found</h3>
            <p className="text-muted-foreground text-sm max-w-md">
              We couldn't find any locations matching your search criteria. Try adjusting your search or create a new location.
            </p>
          </div>
        )}
      </section>

      {/* Location Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={(open) => {
        if (!open) resetForm();
        setIsFormOpen(open);
      }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-[#445372]">{editingLocation ? 'Edit Location' : 'Add New Location'}</DialogTitle>
            <DialogDescription>
              {editingLocation ? 'Update the location information below.' : 'Fill out the form below to add a new storage location.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleFormSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Location Name*
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter location name"
                  required
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter location description"
                  rows={3}
                />
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="is-active" className="text-sm font-medium">
                  Active
                </label>
                <input
                  type="checkbox"
                  id="is-active"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-[#00859e] focus:ring-[#00859e]"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={() => {
                resetForm();
                setIsFormOpen(false);
              }}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#00859e] hover:bg-[#00859e]/90">
                {editingLocation ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!locationToDelete} onOpenChange={(open) => !open && setLocationToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#445372]">
              Delete Location
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the location from the system. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LocationManagement;
