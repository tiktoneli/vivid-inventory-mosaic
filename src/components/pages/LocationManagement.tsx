
import React, { useState } from 'react';
import { Plus, Search, Trash2, Pencil, MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { useLocations } from '@/hooks/useLocations';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

// Form validation schema
const locationSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
});

type LocationFormValues = z.infer<typeof locationSchema>;

const LocationManagement = () => {
  const { locations, isLoading, createLocation, updateLocation, deleteLocation } = useLocations();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<any | null>(null);
  const [locationToDelete, setLocationToDelete] = useState<string | null>(null);
  const [showInactive, setShowInactive] = useState(false);

  const filteredLocations = locations.filter(loc => {
    const matchesSearch = loc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (loc.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = showInactive ? true : loc.is_active;
    return matchesSearch && matchesStatus;
  });

  const form = useForm<LocationFormValues>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      name: '',
      description: '',
      is_active: true,
    },
  });

  const handleEditLocation = (id: string) => {
    const location = locations.find(l => l.id === id);
    if (location) {
      setEditingLocation(location);
      form.reset({
        name: location.name,
        description: location.description || '',
        is_active: location.is_active,
      });
      setIsFormOpen(true);
    }
  };

  const handleDeleteLocation = (id: string) => {
    setLocationToDelete(id);
  };

  const confirmDelete = () => {
    if (!locationToDelete) return;
    
    deleteLocation(locationToDelete);
    setLocationToDelete(null);
  };

  const handleFormSubmit = (values: LocationFormValues) => {
    if (editingLocation) {
      updateLocation({
        id: editingLocation.id,
        data: values
      });
    } else {
      createLocation(values);
    }
    
    setIsFormOpen(false);
    form.reset();
    setEditingLocation(null);
  };

  const openAddLocationForm = () => {
    setEditingLocation(null);
    form.reset({
      name: '',
      description: '',
      is_active: true,
    });
    setIsFormOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight mb-1 text-[#445372]">Locations</h1>
            <p className="text-muted-foreground">Manage your storage locations</p>
          </div>
          <div className="flex flex-col md:flex-row gap-2">
            <Link
              to="/products"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground px-4 py-2 h-10"
            >
              Manage Products
            </Link>
            <Link
              to="/categories"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground px-4 py-2 h-10"
            >
              Manage Categories
            </Link>
            <Button 
              onClick={openAddLocationForm}
              className="bg-[#00859e] hover:bg-[#00859e]/90"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Location
            </Button>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search locations..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center">
            <label className="flex items-center gap-2 text-sm">
              <input 
                type="checkbox" 
                checked={showInactive}
                onChange={(e) => setShowInactive(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-[#00859e] focus:ring-[#00859e]"
              />
              Show inactive locations
            </label>
          </div>
        </div>
      </section>

      <section>
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <p>Loading locations...</p>
          </div>
        ) : filteredLocations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredLocations.map((location) => (
              <Card key={location.id} className={`overflow-hidden ${!location.is_active ? 'opacity-60' : ''}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-start justify-between">
                    <span className="truncate">{location.name}</span>
                    {!location.is_active && (
                      <Badge variant="outline" className="ml-2 text-xs">Inactive</Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="truncate">
                    {location.description || 'No description provided'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>Location ID: {location.id.substring(0, 8)}...</span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEditLocation(location.id)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDeleteLocation(location.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-3 bg-secondary rounded-full mb-4">
              <MapPin className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">No locations found</h3>
            <p className="text-muted-foreground text-sm max-w-md">
              {searchTerm 
                ? "We couldn't find any locations matching your search criteria." 
                : "You haven't added any locations yet. Get started by adding a new location."}
            </p>
            {!searchTerm && (
              <Button 
                onClick={openAddLocationForm} 
                className="mt-4 bg-[#00859e] hover:bg-[#00859e]/90"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Your First Location
              </Button>
            )}
          </div>
        )}
      </section>

      {/* Location Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={(open) => {
        setIsFormOpen(open);
        if (!open) {
          form.reset();
          setEditingLocation(null);
        }
      }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-[#445372]">{editingLocation ? 'Edit Location' : 'Add New Location'}</DialogTitle>
            <DialogDescription>
              {editingLocation 
                ? 'Update the location information below.' 
                : 'Fill out the form below to add a new location.'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Location name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the location (optional)" 
                        className="resize-none" 
                        {...field} 
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {editingLocation && (
                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4 rounded border-gray-300 text-[#00859e] focus:ring-[#00859e]"
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">Location is active</FormLabel>
                    </FormItem>
                  )}
                />
              )}
              
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#00859e] hover:bg-[#00859e]/90">
                  {editingLocation ? 'Update Location' : 'Add Location'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!locationToDelete} onOpenChange={(open) => !open && setLocationToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#445372]">Delete Location</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the location from the database. This action cannot be undone.
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
