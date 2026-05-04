import type { Category } from "@/types/shop";

/**
 * Default category art (Unsplash, cropped wide for banners).
 * Set `image_url` on a category in Supabase to override any slug.
 */
const DEFAULT_BANNERS: Record<string, string> = {
  // Men’s denim / streetwear — matches shop seed aesthetic
  "mens-wear":
    "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=1800&h=1125&q=85",
  // Kids’ casual — from product seed imagery
  "kids-wear":
    "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?auto=format&fit=crop&w=1800&h=1125&q=85",
  // Fragrance / bottles — from product seed imagery
  perfumes:
    "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1800&h=1125&q=85",
  // Leather belt / accessories — from product seed imagery
  belts:
    "https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=1800&h=1125&q=85",
};

export function categoryBannerSrc(category: Pick<Category, "slug" | "image_url">): string {
  const remote = category.image_url?.trim();
  if (remote) return remote;
  const slug = (category.slug ?? "").toLowerCase();
  return DEFAULT_BANNERS[slug] ?? "/placeholder.svg";
}
