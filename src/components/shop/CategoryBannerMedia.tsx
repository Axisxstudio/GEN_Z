import { cn } from "@/lib/utils";
import { categoryBannerSrc } from "@/lib/categoryBanner";
import type { Category } from "@/types/shop";

type Props = {
  category: Pick<Category, "slug" | "image_url" | "name">;
  className?: string;
};

/** Full-bleed category photo + dark gradient for legible overlay text. */
export function CategoryBannerMedia({ category, className }: Props) {
  const src = categoryBannerSrc(category);
  return (
    <>
      <img
        src={src}
        alt=""
        className={cn(
          "absolute inset-0 h-full w-full object-cover",
          className,
        )}
        loading="lazy"
        decoding="async"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/25 transition-colors duration-400 ease-out group-hover:from-black/95"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-br from-primary/0 to-transparent opacity-0 transition-opacity duration-400 ease-out group-hover:opacity-100 group-hover:from-primary/20 pointer-events-none"
        aria-hidden
      />
    </>
  );
}
