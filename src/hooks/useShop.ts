import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Category, Product } from "@/types/shop";

const DEFAULT_CATEGORIES: Category[] = [
  { id: "cat-mens", name: "Mens Wear", slug: "mens-wear", is_active: true, image_url: null, created_at: "" },
  { id: "cat-kids", name: "Kids Wear", slug: "kids-wear", is_active: true, image_url: null, created_at: "" },
  { id: "cat-perfumes", name: "Perfumes", slug: "perfumes", is_active: true, image_url: null, created_at: "" },
  { id: "cat-belts", name: "Belts", slug: "belts", is_active: true, image_url: null, created_at: "" }
];

let cachedCategories: Category[] | null = null;
let categoriesPromise: Promise<Category[]> | null = null;

async function fetchCategoriesWithFallback(): Promise<Category[]> {
  if (cachedCategories) return cachedCategories;
  if (categoriesPromise) return categoriesPromise;

  categoriesPromise = (async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("is_active", true);

      if (error) {
        console.warn("Supabase fetch failed inside hook, using fallback:", error);
        cachedCategories = DEFAULT_CATEGORIES;
      } else if (!data || data.length === 0) {
        cachedCategories = DEFAULT_CATEGORIES;
      } else {
        cachedCategories = data;
      }
    } catch (err) {
      console.warn("Exception fetching categories inside hook, using fallback:", err);
      cachedCategories = DEFAULT_CATEGORIES;
    }
    return cachedCategories;
  })();

  return categoriesPromise;
}

export const useCategories = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: async (): Promise<Category[]> => {
      return fetchCategoriesWithFallback();
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
      const categoriesList = await fetchCategoriesWithFallback();
      const mockProductsList = getMockProducts(categoriesList);

      let list = [...mockProductsList];

      if (filters.featured) list = list.filter((p) => p.is_featured);
      if (filters.newArrival) list = list.filter((p) => p.is_new_arrival);
      if (filters.search) {
        const tokens = filters.search.toLowerCase().trim().split(/\s+/).filter(Boolean);
        if (tokens.length > 0) {
          list = list.filter((p) => {
            const name = p.name.toLowerCase();
            const desc = (p.description ?? "").toLowerCase();
            const catName = (p.categories?.name ?? "").toLowerCase();
            const material = (p.material ?? "").toLowerCase();
            const fit = (p.fit_type ?? "").toLowerCase();
            
            return tokens.every(token => 
              name.includes(token) || 
              desc.includes(token) || 
              catName.includes(token) ||
              material.includes(token) ||
              fit.includes(token)
            );
          });
        }
      }
      if (filters.minPrice != null) list = list.filter((p) => p.price >= filters.minPrice!);
      if (filters.maxPrice != null) list = list.filter((p) => p.price <= filters.maxPrice!);
      if (filters.size) list = list.filter((p) => p.sizes.includes(filters.size!));
      if (filters.categorySlug) list = list.filter((p) => p.categories?.slug === filters.categorySlug);

      switch (filters.sort) {
        case "price_asc": list.sort((a, b) => a.price - b.price); break;
        case "price_desc": list.sort((a, b) => b.price - a.price); break;
        default: list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      }

      if (filters.limit) list = list.slice(0, filters.limit);
      return list;
    },
  });

export const useProduct = (slug: string | undefined) =>
  useQuery({
    enabled: !!slug,
    queryKey: ["product", slug],
    queryFn: async (): Promise<Product | null> => {
      const categoriesList = await fetchCategoriesWithFallback();
      const mockProductsList = getMockProducts(categoriesList);

      const match = mockProductsList.find((p) => p.slug === slug);
      return match ?? null;
    },
  });

type RelatedOpts = {
  categoryId: string | null | undefined;
  excludeProductId: string | undefined;
  limit?: number;
};

export const useRelatedProducts = ({ categoryId, excludeProductId, limit = 8 }: RelatedOpts) =>
  useQuery({
    enabled: !!excludeProductId,
    queryKey: ["related-products", categoryId ?? "all", excludeProductId, limit],
    queryFn: async (): Promise<Product[]> => {
      const categoriesList = await fetchCategoriesWithFallback();
      const mockProductsList = getMockProducts(categoriesList);

      let list = [...mockProductsList];
      if (categoryId) list = list.filter((p) => p.category_id === categoryId);
      
      return list
        .filter((p) => p.id !== excludeProductId)
        .slice(0, limit);
    },
  });

export const useWishlistProducts = (ids: string[]) =>
  useQuery({
    enabled: ids.length > 0,
    queryKey: ["wishlist-products", [...ids].sort().join(",")],
    queryFn: async (): Promise<Product[]> => {
      const categoriesList = await fetchCategoriesWithFallback();
      const mockProductsList = getMockProducts(categoriesList);

      const list = mockProductsList.filter((p) => ids.includes(p.id));
      const order = new Map(ids.map((id, i) => [id, i]));
      return [...list].sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
    },
  });

// Mock Data Generator containing 10 premium products per category
function getMockProducts(categoriesList: Category[]): Product[] {
  const mockProductsList: Product[] = [];
  const getCategoryInfo = (slug: string) => {
    const cat = categoriesList.find((c) => c.slug === slug);
    return cat ? { id: cat.id, name: cat.name } : null;
  };

  // 10 Mens Wear products
  const mensInfo = getCategoryInfo("mens-wear");
  if (mensInfo) {
    const items = [
      { name: "Oversized Street Tee", price: 4500, discount_price: 3900, images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900"], sizes: ["S","M","L","XL"], colors: ["Black","White"], material: "100% Cotton", fit_type: "Oversized", is_featured: true, is_new_arrival: true },
      { name: "Slim Fit Denim", price: 8900, discount_price: null, images: ["https://images.unsplash.com/photo-1542272604-787c3835535d?w=900"], sizes: ["30","32","34","36"], colors: ["Indigo","Black"], material: "Denim", fit_type: "Slim", is_featured: true, is_new_arrival: false },
      { name: "Graphic Print Shirt", price: 5200, discount_price: null, images: ["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=900"], sizes: ["S","M","L","XL"], colors: ["Black","Red"], material: "Cotton Blend", fit_type: "Regular", is_featured: false, is_new_arrival: true },
      { name: "Heavyweight Zip Hoodie", price: 7800, discount_price: 6900, images: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=900"], sizes: ["M","L","XL"], colors: ["Grey","Black"], material: "Heavyweight Fleece", fit_type: "Relaxed", is_featured: true, is_new_arrival: false },
      { name: "Cargo Utility Pants", price: 6500, discount_price: null, images: ["https://images.unsplash.com/photo-1517423568366-8b83523034fd?w=900"], sizes: ["30","32","34","36"], colors: ["Olive","Khaki"], material: "Ripstop Cotton", fit_type: "Relaxed", is_featured: false, is_new_arrival: true },
      { name: "Vintage Wash Tee", price: 3800, discount_price: 3200, images: ["https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=900"], sizes: ["S","M","L","XL"], colors: ["Charcoal"], material: "Washed Cotton", fit_type: "Regular", is_featured: false, is_new_arrival: false },
      { name: "Techwear Windbreaker", price: 9500, discount_price: null, images: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900"], sizes: ["M","L","XL"], colors: ["Black","Neon Green"], material: "Water-resistant Nylon", fit_type: "Athletic", is_featured: true, is_new_arrival: true },
      { name: "Corduroy Overshirt", price: 5800, discount_price: null, images: ["https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=900"], sizes: ["S","M","L","XL"], colors: ["Brown","Navy"], material: "Premium Corduroy", fit_type: "Regular", is_featured: false, is_new_arrival: false },
      { name: "Knit Bomber Jacket", price: 11000, discount_price: 9500, images: ["https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=900"], sizes: ["M","L","XL"], colors: ["Tan","Black"], material: "Wool Blend", fit_type: "Regular", is_featured: true, is_new_arrival: true },
      { name: "Relaxed Fit Track Pants", price: 4800, discount_price: null, images: ["https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=900"], sizes: ["S","M","L","XL"], colors: ["Black","Grey"], material: "Polyester", fit_type: "Relaxed", is_featured: false, is_new_arrival: false }
    ].map((x, i) => ({
      ...x,
      id: `mens-${i}`,
      category_id: mensInfo.id,
      created_at: new Date(Date.now() - i * 3600000).toISOString(),
      is_active: true,
      slug: x.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      stock_status: "in_stock",
      categories: { name: mensInfo.name, slug: "mens-wear" }
    }));
    mockProductsList.push(...items);
  }

  // 10 Kids Wear products
  const kidsInfo = getCategoryInfo("kids-wear");
  if (kidsInfo) {
    const items = [
      { name: "Kids Hoodie", price: 3800, discount_price: null, images: ["https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=900"], sizes: ["4Y","6Y","8Y","10Y"], colors: ["Black","Grey"], material: "Fleece", fit_type: "Regular", is_featured: true, is_new_arrival: true },
      { name: "Mini Street Tee", price: 2200, discount_price: 1800, images: ["https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=900"], sizes: ["4Y","6Y","8Y"], colors: ["White","Yellow"], material: "100% Cotton", fit_type: "Regular", is_featured: true, is_new_arrival: false },
      { name: "Kids Denim Jacket", price: 4900, discount_price: null, images: ["https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?w=900"], sizes: ["6Y","8Y","10Y","12Y"], colors: ["Blue Denim"], material: "Denim", fit_type: "Regular", is_featured: false, is_new_arrival: true },
      { name: "Kids Cozy Joggers", price: 2800, discount_price: null, images: ["https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=900"], sizes: ["4Y","6Y","8Y","10Y"], colors: ["Grey","Navy"], material: "French Terry", fit_type: "Regular", is_featured: false, is_new_arrival: false },
      { name: "Youth Varsity Jacket", price: 5800, discount_price: 4900, images: ["https://images.unsplash.com/photo-1611601679655-7c8bc197f0c6?w=900"], sizes: ["8Y","10Y","12Y"], colors: ["Red","Navy"], material: "Cotton/Polyester", fit_type: "Regular", is_featured: true, is_new_arrival: true },
      { name: "Kids Cotton Beanie", price: 1500, discount_price: null, images: ["https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=900"], sizes: ["One Size"], colors: ["Black","Orange"], material: "Acrylic", fit_type: "Regular", is_featured: false, is_new_arrival: false },
      { name: "Kids Cargo Shorts", price: 2600, discount_price: null, images: ["https://images.unsplash.com/photo-1503919005314-30d93d07d823?w=900"], sizes: ["4Y","6Y","8Y"], colors: ["Khaki","Olive"], material: "Cotton Canvas", fit_type: "Regular", is_featured: false, is_new_arrival: false },
      { name: "Kids Graphic Tee", price: 2400, discount_price: null, images: ["https://images.unsplash.com/photo-1471286174240-e6791a117180?w=900"], sizes: ["4Y","6Y","8Y","10Y"], colors: ["Green","Black"], material: "Cotton", fit_type: "Regular", is_featured: false, is_new_arrival: true },
      { name: "Mini Windbreaker", price: 4200, discount_price: 3500, images: ["https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=900"], sizes: ["6Y","8Y","10Y"], colors: ["Blue","Yellow"], material: "Nylon", fit_type: "Regular", is_featured: true, is_new_arrival: true },
      { name: "Kids Fleece Pullover", price: 3400, discount_price: null, images: ["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=900"], sizes: ["4Y","6Y","8Y","10Y"], colors: ["Green","Beige"], material: "Fleece", fit_type: "Regular", is_featured: false, is_new_arrival: false }
    ].map((x, i) => ({
      ...x,
      id: `kids-${i}`,
      category_id: kidsInfo.id,
      created_at: new Date(Date.now() - i * 3600000).toISOString(),
      is_active: true,
      slug: x.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      stock_status: "in_stock",
      categories: { name: kidsInfo.name, slug: "kids-wear" }
    }));
    mockProductsList.push(...items);
  }

  // 10 Perfumes products
  const perfumesInfo = getCategoryInfo("perfumes");
  if (perfumesInfo) {
    const items = [
      { name: "Noir Eau de Parfum", price: 12500, discount_price: 11000, images: ["https://images.unsplash.com/photo-1541643600914-78b084683601?w=900"], sizes: ["100ml"], colors: ["Default"], material: "EDP", fit_type: null, is_featured: true, is_new_arrival: true },
      { name: "Mystic Oud EDP", price: 14500, discount_price: null, images: ["https://images.unsplash.com/photo-1594035910387-fea47794261f?w=900"], sizes: ["100ml"], colors: ["Default"], material: "EDP", fit_type: null, is_featured: true, is_new_arrival: false },
      { name: "Citrus Breeze Perfume", price: 9500, discount_price: null, images: ["https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=900"], sizes: ["50ml","100ml"], colors: ["Default"], material: "EDP", fit_type: null, is_featured: false, is_new_arrival: true },
      { name: "Amber Woods Cologne", price: 11800, discount_price: null, images: ["https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=900"], sizes: ["100ml"], colors: ["Default"], material: "EDC", fit_type: null, is_featured: false, is_new_arrival: false },
      { name: "Santal Fusion EDP", price: 13200, discount_price: 12000, images: ["https://images.unsplash.com/photo-1594035910387-fea47794261f?w=900"], sizes: ["100ml"], colors: ["Default"], material: "EDP", fit_type: null, is_featured: true, is_new_arrival: true },
      { name: "Ocean Drift Parfum", price: 8500, discount_price: null, images: ["https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=900"], sizes: ["50ml"], colors: ["Default"], material: "Parfum", fit_type: null, is_featured: false, is_new_arrival: false },
      { name: "Vanilla Seduction", price: 10500, discount_price: null, images: ["https://images.unsplash.com/photo-1541643600914-78b084683601?w=900"], sizes: ["100ml"], colors: ["Default"], material: "EDP", fit_type: null, is_featured: false, is_new_arrival: true },
      { name: "Platinum Sport EDP", price: 11000, discount_price: 9500, images: ["https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=900"], sizes: ["100ml"], colors: ["Default"], material: "EDP", fit_type: null, is_featured: true, is_new_arrival: true },
      { name: "Spice Infusion Cologne", price: 8900, discount_price: null, images: ["https://images.unsplash.com/photo-1594035910387-fea47794261f?w=900"], sizes: ["100ml"], colors: ["Default"], material: "EDC", fit_type: null, is_featured: false, is_new_arrival: false },
      { name: "Velvet Rose EDP", price: 12200, discount_price: null, images: ["https://images.unsplash.com/photo-1541643600914-78b084683601?w=900"], sizes: ["100ml"], colors: ["Default"], material: "EDP", fit_type: null, is_featured: false, is_new_arrival: false }
    ].map((x, i) => ({
      ...x,
      id: `perfumes-${i}`,
      category_id: perfumesInfo.id,
      created_at: new Date(Date.now() - i * 3600000).toISOString(),
      is_active: true,
      slug: x.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      stock_status: "in_stock",
      categories: { name: perfumesInfo.name, slug: "perfumes" }
    }));
    mockProductsList.push(...items);
  }

  // 10 Belts products
  const beltsInfo = getCategoryInfo("belts");
  if (beltsInfo) {
    const items = [
      { name: "Classic Leather Belt", price: 3200, discount_price: null, images: ["https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=900"], sizes: ["32","34","36","38","40"], colors: ["Black","Brown"], material: "Genuine Leather", fit_type: null, is_featured: true, is_new_arrival: false },
      { name: "Utility Webbing Belt", price: 2400, discount_price: 1900, images: ["https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=900"], sizes: ["One Size"], colors: ["Black","Olive","Navy"], material: "Nylon Webbing", fit_type: null, is_featured: true, is_new_arrival: true },
      { name: "Woven Canvas Belt", price: 2100, discount_price: null, images: ["https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=900"], sizes: ["One Size"], colors: ["Beige","Black"], material: "Canvas", fit_type: null, is_featured: false, is_new_arrival: true },
      { name: "Heavy Buckle Belt", price: 3800, discount_price: null, images: ["https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=900"], sizes: ["34","36","38"], colors: ["Dark Brown"], material: "Full Grain Leather", fit_type: null, is_featured: false, is_new_arrival: false },
      { name: "Suede Leather Belt", price: 4200, discount_price: 3600, images: ["https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=900"], sizes: ["32","34","36","38"], colors: ["Tan","Charcoal"], material: "Suede Leather", fit_type: null, is_featured: true, is_new_arrival: true },
      { name: "Street Tactical Belt", price: 3500, discount_price: null, images: ["https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=900"], sizes: ["One Size"], colors: ["Black","Orange"], material: "Nylon/Metal Quick Release", fit_type: null, is_featured: false, is_new_arrival: false },
      { name: "Embossed Logo Belt", price: 4500, discount_price: null, images: ["https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=900"], sizes: ["32","34","36","38"], colors: ["Black"], material: "Genuine Leather", fit_type: null, is_featured: false, is_new_arrival: true },
      { name: "Vintage Brass Belt", price: 3600, discount_price: null, images: ["https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=900"], sizes: ["34","36","38"], colors: ["Brown"], material: "Leather/Brass", fit_type: null, is_featured: false, is_new_arrival: false },
      { name: "Double Ring Belt", price: 1800, discount_price: null, images: ["https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=900"], sizes: ["One Size"], colors: ["Black","White"], material: "Cotton Canvas", fit_type: null, is_featured: false, is_new_arrival: false },
      { name: "Reversible Leather Belt", price: 4800, discount_price: 4200, images: ["https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=900"], sizes: ["32","34","36","38","40"], colors: ["Black/Brown"], material: "Reversible Leather", fit_type: null, is_featured: true, is_new_arrival: true }
    ].map((x, i) => ({
      ...x,
      id: `belts-${i}`,
      category_id: beltsInfo.id,
      created_at: new Date(Date.now() - i * 3600000).toISOString(),
      is_active: true,
      slug: x.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      stock_status: "in_stock",
      categories: { name: beltsInfo.name, slug: "belts" }
    }));
    mockProductsList.push(...items);
  }

  return mockProductsList;
}

