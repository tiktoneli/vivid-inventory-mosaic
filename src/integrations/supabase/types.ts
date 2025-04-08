export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      batch_items: {
        Row: {
          batch_id: string
          created_at: string
          id: string
          location_id: string
          notes: string | null
          serial_number: string | null
          sku: string
          status: string
          updated_at: string | null
        }
        Insert: {
          batch_id: string
          created_at?: string
          id?: string
          location_id: string
          notes?: string | null
          serial_number?: string | null
          sku: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          batch_id?: string
          created_at?: string
          id?: string
          location_id?: string
          notes?: string | null
          serial_number?: string | null
          sku?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_items_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_items_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "product_inventory"
            referencedColumns: ["location_id"]
          },
          {
            foreignKeyName: "product_items_product_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batch_inventory"
            referencedColumns: ["batch_id"]
          },
          {
            foreignKeyName: "product_items_product_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_items_product_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "product_inventory"
            referencedColumns: ["product_id"]
          },
        ]
      }
      batches: {
        Row: {
          batch_code: string | null
          category_id: string
          compatibility_info: string | null
          created_at: string
          description: string | null
          firmware_version: string | null
          id: string
          is_active: boolean | null
          license_keys: string | null
          lifecycle_status: string | null
          mac_address: string | null
          manufacturer: string | null
          min_stock: number
          name: string
          network_specs: string | null
          power_consumption: string | null
          price: number | null
          serial_number: string | null
          sku: string | null
          updated_at: string | null
          warranty_info: string | null
        }
        Insert: {
          batch_code?: string | null
          category_id: string
          compatibility_info?: string | null
          created_at?: string
          description?: string | null
          firmware_version?: string | null
          id?: string
          is_active?: boolean | null
          license_keys?: string | null
          lifecycle_status?: string | null
          mac_address?: string | null
          manufacturer?: string | null
          min_stock?: number
          name: string
          network_specs?: string | null
          power_consumption?: string | null
          price?: number | null
          serial_number?: string | null
          sku?: string | null
          updated_at?: string | null
          warranty_info?: string | null
        }
        Update: {
          batch_code?: string | null
          category_id?: string
          compatibility_info?: string | null
          created_at?: string
          description?: string | null
          firmware_version?: string | null
          id?: string
          is_active?: boolean | null
          license_keys?: string | null
          lifecycle_status?: string | null
          mac_address?: string | null
          manufacturer?: string | null
          min_stock?: number
          name?: string
          network_specs?: string | null
          power_consumption?: string | null
          price?: number | null
          serial_number?: string | null
          sku?: string | null
          updated_at?: string | null
          warranty_info?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          attributes: string[] | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          attributes?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          attributes?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      inventory_movements: {
        Row: {
          batch_id: string
          created_at: string
          id: string
          location: string
          notes: string | null
          quantity: number
          reference: string
          type: string
          username: string | null
        }
        Insert: {
          batch_id: string
          created_at?: string
          id?: string
          location: string
          notes?: string | null
          quantity: number
          reference: string
          type: string
          username?: string | null
        }
        Update: {
          batch_id?: string
          created_at?: string
          id?: string
          location?: string
          notes?: string | null
          quantity?: number
          reference?: string
          type?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_movements_product_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batch_inventory"
            referencedColumns: ["batch_id"]
          },
          {
            foreignKeyName: "inventory_movements_product_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_product_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "product_inventory"
            referencedColumns: ["product_id"]
          },
        ]
      }
      locations: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      batch_inventory: {
        Row: {
          batch_id: string | null
          batch_name: string | null
          category_id: string | null
          location_id: string | null
          location_name: string | null
          quantity: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_items_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_items_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "product_inventory"
            referencedColumns: ["location_id"]
          },
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      product_inventory: {
        Row: {
          category_id: string | null
          location_id: string | null
          location_name: string | null
          product_id: string | null
          product_name: string | null
          quantity: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      get_batch_stock_by_location: {
        Args: { p_batch_id: string; p_location_id: string }
        Returns: number
      }
      get_batch_total_stock: {
        Args: { p_batch_id: string }
        Returns: number
      }
      get_product_stock_by_location: {
        Args: { p_product_id: string; p_location_id: string }
        Returns: number
      }
      get_product_total_stock: {
        Args: { p_product_id: string }
        Returns: number
      }
      update_batch_stock: {
        Args: { p_batch_id: string; p_quantity: number }
        Returns: undefined
      }
      update_product_stock: {
        Args: { p_product_id: string; p_quantity: number }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
