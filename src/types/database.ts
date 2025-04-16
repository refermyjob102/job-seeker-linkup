
export interface Company {
  id: string;
  name: string;
  logo_url?: string;
  description?: string;
  website?: string;
  location?: string;
  sector?: string;  // Add this line to include sector
  created_at: string;
}
