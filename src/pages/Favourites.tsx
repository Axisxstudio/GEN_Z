import { Link } from "react-router-dom";
import { RevealOnView } from "@/components/motion/RevealOnView";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/shop/ProductCard";
import { useWishlist } from "@/store/wishlist";
import { useWishlistProducts } from "@/hooks/useShop";

const Favourites = () => {
  const ids = useWishlist((s) => s.ids);
  const { data: products = [], isLoading } = useWishlistProducts(ids);

  return (
    <RevealOnView className="container-edge py-12">
      <p className="text-xs uppercase tracking-[0.3em] text-primary">Your list</p>
      <h1 className="font-display text-4xl md:text-6xl font-bold mt-2 flex flex-wrap items-center gap-3">
        <Heart className="h-10 w-10 md:h-12 md:w-12 text-primary shrink-0" strokeWidth={1.75} />
        Saved items
      </h1>
      <p className="text-muted-foreground mt-3 max-w-xl">
        Products you have liked appear here on this device. Tap the heart on any product to add or remove it.
      </p>

      <div className="mt-10">
        {ids.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/80 bg-card/40 px-8 py-16 text-center">
            <Heart className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
            <p className="mt-4 font-medium">Nothing saved yet</p>
            <p className="text-sm text-muted-foreground mt-1">Browse the shop and tap the heart on products you love.</p>
            <Button asChild variant="hero" className="mt-8">
              <Link to="/shop">Shop now</Link>
            </Button>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-2 gap-3 min-[400px]:gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
            {Array.from({ length: Math.min(ids.length, 8) }).map((_, i) => (
              <div key={i} className="aspect-[4/5] rounded-xl bg-card animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-muted-foreground">
            Saved items could not be loaded. They may have been removed from the store.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 min-[400px]:gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </RevealOnView>
  );
};

export default Favourites;
