import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Category, Product } from "@/types/shop";

export const useCategories = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: async (): Promise<Category[]> => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .order("name");
      if (error) throw error;
      return data ?? [];
    },
  });

type ProductFilters = {
  categorySlug?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  sort?: "newest" | "price_asc" | "price_desc";
  featured?: boolean;
  newArrival?: boolean;
  limit?: number;
};

export const useProducts = (filters: ProductFilters = {}) =>
  useQuery({
    queryKey: ["products", filters],
    queryFn: async (): Promise<Product[]> => {
      let q = supabase
        .from("products")
        .select("*, categories(name, slug)")
        .eq("is_active", true);

      if (filters.featured) q = q.eq("is_featured", true);
      if (filters.newArrival) q = q.eq("is_new_arrival", true);
      if (filters.search) q = q.ilike("name", `%${filters.search}%`);
      if (filters.minPrice != null) q = q.gte("price", filters.minPrice);
      if (filters.maxPrice != null) q = q.lte("price", filters.maxPrice);
      if (filters.size) q = q.contains("sizes", [filters.size]);

      switch (filters.sort) {
        case "price_asc": q = q.order("price", { ascending: true }); break;
        case "price_desc": q = q.order("price", { ascending: false }); break;
        default: q = q.order("created_at", { ascending: false });
      }

      if (filters.limit) q = q.limit(filters.limit);

      const { data, error } = await q;
      if (error) throw error;
      let list = (data ?? []) as Product[];
      if (filters.categorySlug) list = list.filter((p) => p.categories?.slug === filters.categorySlug);
      return list;
    },
  });

export const useProduct = (slug: string | undefined) =>
  useQuery({
    enabled: !!slug,
    queryKey: ["product", slug],
    queryFn: async (): Promise<Product | null> => {
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(name, slug)")
        .eq("slug", slug!)
        .eq("is_active", true)
        .maybeSingle();
      if (error) throw error;
      return data as Product | null;
    },
  });

type RelatedOpts = {
  categoryId: string | null | undefined;
  excludeProductId: string | undefined;
  limit?: number;
};

/** Same-category products when `categoryId` is set; otherwise newest across the shop. */
export const useRelatedProducts = ({ categoryId, excludeProductId, limit = 8 }: RelatedOpts) =>
  useQuery({
    enabled: !!excludeProductId,
    queryKey: ["related-products", categoryId ?? "all", excludeProductId, limit],
    queryFn: async (): Promise<Product[]> => {
      let q = supabase
        .from("products")
        .select("*, categories(name, slug)")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(limit + 4);
      if (categoryId) q = q.eq("category_id", categoryId);
      const { data, error } = await q;
      if (error) throw error;
      return ((data ?? []) as Product[])
        .filter((p) => p.id !== excludeProductId)
        .slice(0, limit);
    },
  });

export const useWishlistProducts = (ids: string[]) =>
  useQuery({
    enabled: ids.length > 0,
    queryKey: ["wishlist-products", [...ids].sort().join(",")],
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(name, slug)")
        .eq("is_active", true)
        .in("id", ids);
      if (error) throw error;
      const list = (data ?? []) as Product[];
      const order = new Map(ids.map((id, i) => [id, i]));
      return [...list].sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
    },
  });
