
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
          stock: number
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
          stock?: number
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
          stock?: number
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
      inventory_movements: {
        Row: {
          id: string
          type: string
          reference: string
          product_id: string
          quantity: number
          location: string
          user: string | null
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
          user?: string | null
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
          user?: string | null
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
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
