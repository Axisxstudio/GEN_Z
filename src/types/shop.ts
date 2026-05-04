import type { Database } from "@/integrations/supabase/types";

export type Product = Database["public"]["Tables"]["products"]["Row"] & {
  categories?: { name: string; slug: string } | null;
};
export type Category = Database["public"]["Tables"]["categories"]["Row"];
