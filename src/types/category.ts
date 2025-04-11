
export type Category = {
  id: string;
  name: string;
  description: string | null;
  attributes: string[] | null;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
};

export type CategoryFormValues = {
  name: string;
  description?: string;
  attributes?: string[];
};
