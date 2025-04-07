
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          attributes: string[] | null
          is_active: boolean
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          attributes?: string[] | null
          is_active?: boolean
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          attributes?: string[] | null
          is_active?: boolean
          created_at?: string
          updated_at?: string | null
        }
      }
      batches: {
        Row: {
          id: string
          name: string
          sku: string
          description: string | null
          category_id: string
          location: string
          min_stock: number
          price: number | null
          is_active: boolean
          created_at: string
          updated_at: string | null
          manufacturer: string | null
          serial_number: string | null
          warranty_info: string | null
          firmware_version: string | null
          mac_address: string | null
          network_specs: string | null
          license_keys: string | null
          compatibility_info: string | null
          power_consumption: string | null
          lifecycle_status: string | null
        }
        Insert: {
          id?: string
          name: string
          sku: string
          description?: string | null
          category_id: string
          location: string
          min_stock: number
          price?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string | null
          manufacturer?: string | null
          serial_number?: string | null
          warranty_info?: string | null
          firmware_version?: string | null
          mac_address?: string | null
          network_specs?: string | null
          license_keys?: string | null
          compatibility_info?: string | null
          power_consumption?: string | null
          lifecycle_status?: string | null
        }
        Update: {
          id?: string
          name?: string
          sku?: string
          description?: string | null
          category_id?: string
          location?: string
          min_stock?: number
          price?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string | null
          manufacturer?: string | null
          serial_number?: string | null
          warranty_info?: string | null
          firmware_version?: string | null
          mac_address?: string | null
          network_specs?: string | null
          license_keys?: string | null
          compatibility_info?: string | null
          power_consumption?: string | null
          lifecycle_status?: string | null
        }
      }
      batch_items: {
        Row: {
          id: string
          batch_id: string
          serial_number: string
          sku: string
          location_id: string
          status: string
          notes: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          batch_id: string
          serial_number: string
          sku: string
          location_id: string
          status?: string
          notes?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          batch_id?: string
          serial_number?: string
          sku?: string
          location_id?: string
          status?: string
          notes?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      batch_inventory: {
        Row: {
          batch_name: string | null
          location_id: string | null
          batch_id: string | null
          location_name: string | null
          quantity: number | null
          category_id: string | null
        }
        Insert: {
          batch_name?: string | null
          location_id?: string | null
          batch_id?: string | null
          location_name?: string | null
          quantity?: number | null
          category_id?: string | null
        }
        Update: {
          batch_name?: string | null
          location_id?: string | null
          batch_id?: string | null
          location_name?: string | null
          quantity?: number | null
          category_id?: string | null
        }
      }
      locations: {
        Row: {
          description: string | null
          id: string
          name: string
          created_at: string
          is_active: boolean
        }
        Insert: {
          description?: string | null
          id?: string
          name: string
          created_at?: string
          is_active?: boolean
        }
        Update: {
          description?: string | null
          id?: string
          name?: string
          created_at?: string
          is_active?: boolean
        }
      }
      inventory_movements: {
        Row: {
          created_at: string
          location: string
          type: string
          reference: string
          username: string | null
          id: string
          batch_id: string
          quantity: number
          notes: string | null
        }
        Insert: {
          created_at?: string
          location: string
          type: string
          reference: string
          username?: string | null
          id?: string
          batch_id: string
          quantity: number
          notes?: string | null
        }
        Update: {
          created_at?: string
          location?: string
          type?: string
          reference?: string
          username?: string | null
          id?: string
          batch_id?: string
          quantity?: number
          notes?: string | null
        }
      }
    }
  }
}
