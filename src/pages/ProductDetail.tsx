import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useProduct, useRelatedProducts } from "@/hooks/useShop";
import { ProductCard } from "@/components/shop/ProductCard";
import { Button } from "@/components/ui/button";
import { formatPrice, whatsappLink } from "@/lib/brand";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { ChevronLeft, ShoppingBag, Check, Heart } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { RevealOnView } from "@/components/motion/RevealOnView";

const ProductDetail = () => {
  const { slug } = useParams();
  const { data: product, isLoading } = useProduct(slug);
  const { data: related = [], isLoading: relatedLoading } = useRelatedProducts({
    categoryId: product?.category_id,
    excludeProductId: product?.id,
    limit: 8,
  });
  const [activeImg, setActiveImg] = useState(0);
  const [size, setSize] = useState<string | undefined>();
  const [color, setColor] = useState<string | undefined>();
  const addItem = useCart((s) => s.addItem);
  const setOpen = useCart((s) => s.setOpen);
  const wishlistToggle = useWishlist((s) => s.toggle);
  const wishlistHas = useWishlist((s) => s.has);

  if (isLoading) return (
    <RevealOnView className="container-edge py-24 text-muted-foreground">Loading…</RevealOnView>
  );
  if (!product) return (
    <RevealOnView className="container-edge py-24 text-center">
      <h1 className="font-display text-3xl">Product not found</h1>
      <Button asChild variant="hero" className="mt-6"><Link to="/shop">Back to Shop</Link></Button>
    </RevealOnView>
  );

  const price = Number(product.discount_price ?? product.price);
  const oldPrice = product.discount_price != null ? Number(product.price) : null;
  const images = product.images?.length ? product.images : ["/placeholder.svg"];
  const inStock = product.stock_status !== "out_of_stock";
  const requiresSize = (product.sizes?.length ?? 0) > 0;
  const requiresColor = (product.colors?.length ?? 0) > 0;
  const liked = wishlistHas(product.id);
  const productUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/product/${product.slug}`;

  const buildBuyMessage = () => {
    const lines = [
      `Hi GEN-Z! I'd like to buy:`,
      ``,
      `*${product.name}*`,
      formatPrice(price),
    ];
    if (size) lines.push(`Size: ${size}`);
    if (color) lines.push(`Color: ${color}`);
    lines.push(productUrl, ``, `Please confirm availability & delivery. Thank you!`);
    return lines.join("\n");
  };

  const waBuy = whatsappLink(buildBuyMessage());

  const handleAdd = () => {
    if (requiresSize && !size) return toast.error("Please select a size");
    if (requiresColor && !color) return toast.error("Please select a color");
    addItem({ productId: product.id, slug: product.slug, name: product.name, image: images[0], price, size, color });
    toast.success("Added to bag");
    setOpen(true);
  };

  const handleLike = () => {
    const wasLiked = liked;
    wishlistToggle(product.id);
    toast.success(wasLiked ? "Removed from favourites" : "Saved to favourites");
  };

  return (
    <RevealOnView className="container-edge py-10">
      <Link to="/shop" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-8">
        <ChevronLeft className="h-4 w-4" /> Back to shop
      </Link>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 lg:items-start">
        {/* Gallery — inset margin on mobile; image fills frame (no gray letterbox) */}
        <div className="min-w-0 w-full max-w-xl mx-auto lg:max-w-none lg:mx-0">
          <div className="mx-3 my-1 sm:mx-4 sm:my-2 md:mx-0 md:my-0">
            <div
              className={cn(
                "relative w-full overflow-hidden rounded-xl border border-border/60 bg-background",
                "h-[min(64dvh,440px)] sm:h-[min(56dvh,500px)] md:h-[min(54dvh,520px)]",
                "lg:max-h-[640px] lg:h-[min(56dvh,calc(100dvh-10.5rem))]",
              )}
            >
              <img
                src={images[activeImg]}
                alt={product.name}
                className="absolute inset-0 h-full w-full object-cover object-center select-none"
                draggable={false}
              />
            </div>
          </div>
          {images.length > 1 && (
            <div className="mt-3 grid grid-cols-5 gap-2">
              {images.map((src, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImg(i)}
                  className={cn(
                    "aspect-square overflow-hidden rounded-md border bg-muted/30 transition-colors",
                    i === activeImg ? "border-primary ring-1 ring-primary/40" : "border-border hover:border-foreground/30",
                  )}
                >
                  <img src={src} alt={`${product.name} ${i + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="lg:pl-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-widest text-primary">{product.categories?.name}</p>
              <h1 className="font-display text-3xl md:text-5xl font-bold mt-2">{product.name}</h1>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0 h-11 w-11 text-muted-foreground hover:text-primary hover:bg-transparent"
              onClick={handleLike}
              aria-pressed={liked}
              aria-label={liked ? "Remove from favourites" : "Add to favourites"}
            >
              <Heart className={cn("h-6 w-6 transition-colors", liked && "fill-primary text-primary")} />
            </Button>
          </div>

          <div className="mt-5 flex min-w-0 items-baseline gap-3">
            <span className="font-display text-2xl font-semibold">{formatPrice(price)}</span>
            {oldPrice && <span className="text-muted-foreground line-through">{formatPrice(oldPrice)}</span>}
          </div>

          <div className="mt-3 flex items-center gap-2 text-sm">
            <span className={`h-2 w-2 rounded-full ${inStock ? "bg-emerald-500 shadow-[0_0_10px_rgb(16,185,129)]" : "bg-destructive"}`} />
            <span className={inStock ? "text-emerald-400" : "text-destructive"}>
              {inStock ? "In stock" : "Out of stock"}
            </span>
          </div>

          {product.description && (
            <p className="mt-6 text-muted-foreground leading-relaxed">{product.description}</p>
          )}

          {requiresSize && (
            <div className="mt-8">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes!.map((s) => (
                  <button key={s} type="button" onClick={() => setSize(s)} className={`h-11 min-w-11 px-4 text-sm border rounded-md transition-all ${size === s ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-foreground/40"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {requiresColor && (
            <div className="mt-6">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Color</p>
              <div className="flex flex-wrap gap-2">
                {product.colors!.map((c) => (
                  <button key={c} type="button" onClick={() => setColor(c)} className={`h-11 px-4 text-sm border rounded-md inline-flex items-center gap-2 transition-all ${color === c ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-foreground/40"}`}>
                    {color === c && <Check className="h-3 w-3" />} {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-10 flex flex-wrap items-stretch gap-3">
            {inStock ? (
              <Button asChild variant="hero" size="xl" className="min-h-14 flex-1 min-w-[200px]">
                <a href={waBuy} target="_blank" rel="noreferrer">
                  Buy now
                </a>
              </Button>
            ) : (
              <Button type="button" variant="hero" size="xl" className="min-h-14 flex-1 min-w-[200px]" disabled>
                Buy now
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-14 w-14 shrink-0 border-border bg-transparent hover:bg-secondary"
              onClick={handleAdd}
              disabled={!inStock}
              aria-label="Add to cart"
            >
              <ShoppingBag className="h-5 w-5" />
            </Button>
          </div>

          {/* Spec table */}
          <dl className="mt-10 grid grid-cols-2 gap-y-3 gap-x-6 text-sm border-t border-border pt-6">
            {product.material && (<><dt className="text-muted-foreground">Material</dt><dd>{product.material}</dd></>)}
            {product.fit_type && (<><dt className="text-muted-foreground">Fit</dt><dd>{product.fit_type}</dd></>)}
            {product.categories?.name && (<><dt className="text-muted-foreground">Category</dt><dd>{product.categories.name}</dd></>)}
            <dt className="text-muted-foreground">SKU</dt><dd className="font-mono text-xs">{product.id.slice(0, 8).toUpperCase()}</dd>
          </dl>
        </div>
      </div>

      {(relatedLoading || related.length > 0) && (
        <RevealOnView className="mt-16 md:mt-24 border-t border-border pt-12 md:pt-16" delay={0.08}>
          <section aria-labelledby="related-heading">
          <p className="text-xs uppercase tracking-[0.3em] text-primary">More to explore</p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
            <h2 id="related-heading" className="font-display text-2xl md:text-4xl font-bold">
              {product.categories?.name ? `More in ${product.categories.name}` : "Related products"}
            </h2>
            {product.categories?.slug && (
              <Link
                to={`/categories/${product.categories.slug}`}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                View category
              </Link>
            )}
          </div>

          {relatedLoading ? (
            <div className="mt-8 grid grid-cols-2 gap-3 min-[400px]:gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[4/5] rounded-xl bg-card animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-2 gap-3 min-[400px]:gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
          </section>
        </RevealOnView>
      )}
    </RevealOnView>
  );
};

export default ProductDetail;
