
export type BatchItemStatus = "available" | "in_use" | "maintenance" | "retired";

export type BatchItem = {
  id: string;
  batch_id: string;
  serial_number: string | null;
  sku: string;
  location_id: string;
  status: BatchItemStatus;
  notes: string | null;
  created_at: string;
  updated_at: string | null;
};

export type BatchItemInput = Omit<BatchItem, 'id' | 'created_at' | 'updated_at'>;

export type BatchItemFormValues = {
  serial_number: string;
  sku: string;
  location_id: string;
  status: BatchItemStatus;
  notes?: string;
};

export type BatchItemSelectionValues = {
  quantity: number;
  location_id: string;
  prefix?: string;
  notes?: string;
};
