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
          created_at: string
          id: string
          location: string
          notes: string | null
          product_id: string
          quantity: number
          reference: string
          type: string
          username: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          location: string
          notes?: string | null
          product_id: string
          quantity: number
          reference: string
          type: string
          username?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          location?: string
          notes?: string | null
          product_id?: string
          quantity?: number
          reference?: string
          type?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_movements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_inventory"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "inventory_movements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
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
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      product_items: {
        Row: {
          created_at: string
          id: string
          location_id: string
          notes: string | null
          product_id: string
          serial_number: string | null
          sku: string
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          location_id: string
          notes?: string | null
          product_id: string
          serial_number?: string | null
          sku: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          location_id?: string
          notes?: string | null
          product_id?: string
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
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_inventory"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
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
          sku: string
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
          sku: string
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
          sku?: string
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
    }
    Views: {
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
