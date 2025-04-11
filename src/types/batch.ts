
import { Category } from './category';

export type Batch = {
  id: string;
  name: string;
  sku: string;
  description: string | null;
  category_id: string;
  min_stock: number;
  price: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
  manufacturer: string | null;
  serial_number: string | null;
  warranty_info: string | null;
  firmware_version: string | null;
  mac_address: string | null;
  network_specs: string | null;
  license_keys: string | null;
  compatibility_info: string | null;
  power_consumption: string | null;
  lifecycle_status: string | null;
  batch_code?: string | null;
  location?: string;
};

export type BatchWithCategory = Omit<Batch, 'location'> & {
  categories: {
    name: string;
  };
  stock?: number;
  locations?: string[];
};

// Make this type explicitly exported
export type BatchInput = Omit<Batch, 'id' | 'created_at' | 'updated_at'>;

export type BatchInventory = {
  batch_id: string;
  batch_name: string;
  location_id: string;
  location_name: string;
  category_id: string;
  quantity: number;
};
