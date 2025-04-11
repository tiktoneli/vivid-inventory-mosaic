
// If this file doesn't exist yet, we'll create it with the correct BatchInventory definition

export type BatchInventory = {
  batch_id: string;
  batch_name: string;
  location_id: string;
  location_name: string;
  category_id: string;
  quantity: number;
};

// Add any other inventory related types here
