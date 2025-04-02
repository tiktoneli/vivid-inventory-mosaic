
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
      products: {
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
      product_items: {
        Row: {
          id: string
          product_id: string
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
          product_id: string
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
          product_id?: string
          serial_number?: string
          sku?: string
          location_id?: string
          status?: string
          notes?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      inventory_movements: {
        Row: {
          id: string
          type: string
          reference: string
          product_id: string
          quantity: number
          location: string
          username: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          type: string
          reference: string
          product_id: string
          quantity: number
          location: string
          username?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          type?: string
          reference?: string
          product_id?: string
          quantity?: number
          location?: string
          username?: string | null
          notes?: string | null
          created_at?: string
        }
      }
      locations: {
        Row: {
          id: string
          name: string
          description: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          is_active?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      product_inventory: {
        Row: {
          product_id: string | null
          product_name: string | null
          category_id: string | null
          location_id: string | null
          location_name: string | null
          quantity: number | null
        }
      }
    }
    Functions: {
      get_product_stock_by_location: {
        Args: {
          p_product_id: string
          p_location_id: string
        }
        Returns: number
      }
      get_product_total_stock: {
        Args: {
          p_product_id: string
        }
        Returns: number
      }
      update_product_stock: {
        Args: {
          p_product_id: string
          p_quantity: number
        }
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
