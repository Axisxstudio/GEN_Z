import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useProduct, useRelatedProducts } from "@/hooks/useShop";
import { ProductCard } from "@/components/shop/ProductCard";
import { formatPrice, whatsappLink } from "@/lib/brand";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { ChevronLeft, Check, Heart, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { RevealOnView } from "@/components/motion/RevealOnView";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem, EASE_OUT_EXPO } from "@/lib/motion";
import { MagneticButton } from "@/components/motion/MagneticButton";

const ProductDetail = () => {
  const { slug } = useParams();
  const { data: product, isLoading } = useProduct(slug);
  const { data: related = [], isLoading: relatedLoading } = useRelatedProducts({
    categoryId: product?.category_id,
    excludeProductId: product?.id,
    limit: 4,
  });
  const [size, setSize] = useState<string | undefined>();
  const [color, setColor] = useState<string | undefined>();
  const addItem = useCart((s) => s.addItem);
  const setOpen = useCart((s) => s.setOpen);
  const wishlistToggle = useWishlist((s) => s.toggle);
  const wishlistHas = useWishlist((s) => s.has);

  if (isLoading) return (
    <div className="bg-background min-h-screen pt-32 text-center text-white/50">
      <div className="animate-pulse h-10 w-32 bg-white/10 mx-auto" />
    </div>
  );
  
  if (!product) return (
    <div className="bg-background min-h-screen pt-32 text-center text-white">
      <h1 className="font-display text-4xl uppercase tracking-widest">Piece not found</h1>
      <Link to="/shop" className="mt-8 inline-flex items-center gap-2 hover:text-white/70 transition-colors uppercase text-sm tracking-widest">
        <ArrowRight className="h-4 w-4" /> Discover Collections
      </Link>
    </div>
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
    const lines = [`Hi GEN-Z! I'd like to acquire:`, ``, `*${product.name}*`, formatPrice(price)];
    if (size) lines.push(`Size: ${size}`);
    if (color) lines.push(`Color: ${color}`);
    lines.push(productUrl, ``, `Please confirm availability.`);
    return lines.join("\n");
  };

  const waBuy = whatsappLink(buildBuyMessage());

  const handleAdd = () => {
    if (requiresSize && !size) return toast.error("Please select a size");
    if (requiresColor && !color) return toast.error("Please select a color");
    addItem({ productId: product.id, slug: product.slug, name: product.name, image: images[0], price, size, color });
    toast.success("Piece added to archive");
    setOpen(true);
  };

  const handleLike = () => {
    const wasLiked = liked;
    wishlistToggle(product.id);
    toast.success(wasLiked ? "Removed from archive" : "Saved to archive");
  };

  return (
    <div className="bg-background text-white min-h-screen pt-20">
      <div className="container-edge py-4 md:py-10 flex flex-col lg:flex-row gap-10 lg:gap-20 relative">
        
        {/* Left Side - Image Gallery (Scrollable on desktop, stacked on mobile) */}
        <div className="w-full lg:w-3/5 space-y-4 md:space-y-6 order-1">
          {images.map((src, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
              className="w-full bg-[#0a0a0a] overflow-hidden group"
            >
              <img 
                src={src} 
                alt={`${product.name} - view ${idx + 1}`} 
                className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-105" 
              />
            </motion.div>
          ))}
        </div>

        {/* Right Side - Sticky Product Details */}
        <div className="w-full lg:w-2/5 order-2">
          <div className="lg:sticky lg:top-32 pb-8">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-8"
            >
              <motion.div variants={staggerItem}>
                <Link to="/shop" className="inline-flex items-center gap-2 text-[10px] text-white/50 hover:text-white mb-8 uppercase tracking-widest transition-colors hover-trigger">
                  <ChevronLeft className="h-3 w-3" /> Archive
                </Link>
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 mb-4">{product.categories?.name}</p>
                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[0.9] tracking-tighter uppercase break-words">{product.name}</h1>
                
                <div className="mt-8 flex items-baseline gap-4">
                  <span className="font-display text-3xl font-light">{formatPrice(price)}</span>
                  {oldPrice && <span className="text-white/40 line-through text-lg">{formatPrice(oldPrice)}</span>}
                </div>
              </motion.div>

              <motion.div variants={staggerItem} className="h-px w-full bg-white/10" />

              {product.description && (
                <motion.p variants={staggerItem} className="text-white/60 font-light leading-relaxed text-sm sm:text-base">
                  {product.description}
                </motion.p>
              )}

              {/* Sizes */}
              {requiresSize && (
                <motion.div variants={staggerItem}>
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-[10px] uppercase tracking-widest text-white/50">Select Size</p>
                    <button className="text-[10px] uppercase tracking-widest text-white/30 hover:text-white underline-offset-4 hover:underline transition-all">Size Guide</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes!.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSize(s)}
                        className={cn(
                          "h-12 min-w-12 px-4 text-xs transition-all duration-300 border hover-trigger flex items-center justify-center",
                          size === s ? "border-white bg-white text-black font-bold" : "border-white/20 hover:border-white/60 text-white/70"
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Colors */}
              {requiresColor && (
                <motion.div variants={staggerItem}>
                  <p className="text-[10px] uppercase tracking-widest text-white/50 mb-4">Select Color</p>
                  <div className="flex flex-wrap gap-2">
                    {product.colors!.map((c) => (
                      <button
                        key={c}
                        onClick={() => setColor(c)}
                        className={cn(
                          "h-12 px-6 text-xs transition-all duration-300 border hover-trigger flex items-center justify-center",
                          color === c ? "border-white bg-white text-black font-bold" : "border-white/20 hover:border-white/60 text-white/70"
                        )}
                      >
                        {color === c && <Check className="h-3 w-3 inline-block mr-2 shrink-0" />} {c}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Actions */}
              <motion.div variants={staggerItem} className="flex flex-col sm:flex-row gap-4 pt-6">
                <MagneticButton className="flex-1 w-full">
                  <button
                    onClick={handleAdd}
                    disabled={!inStock}
                    className="w-full h-14 bg-white text-black uppercase tracking-[0.2em] text-[10px] font-bold hover:bg-white/80 transition-colors disabled:opacity-50 hover-trigger"
                  >
                    {inStock ? "Add to Archive" : "Sold Out"}
                  </button>
                </MagneticButton>
                
                <MagneticButton className="w-full sm:w-auto">
                  <button
                    onClick={handleLike}
                    className="w-full sm:w-14 h-14 border border-white/20 flex items-center justify-center hover:border-white transition-colors hover-trigger"
                  >
                    <Heart className={cn("h-5 w-5 transition-colors", liked && "fill-white text-white")} />
                  </button>
                </MagneticButton>
              </motion.div>

              {/* Specs */}
              <motion.div variants={staggerItem} className="mt-8 space-y-4 pt-8 border-t border-white/10">
                {product.material && (
                  <div className="flex flex-col sm:flex-row justify-between text-sm gap-1 sm:gap-4">
                    <span className="text-white/50 uppercase tracking-widest text-[10px]">Material</span>
                    <span className="sm:text-right font-light text-white/80">{product.material}</span>
                  </div>
                )}
                {product.fit_type && (
                  <div className="flex flex-col sm:flex-row justify-between text-sm gap-1 sm:gap-4">
                    <span className="text-white/50 uppercase tracking-widest text-[10px]">Fit</span>
                    <span className="sm:text-right font-light text-white/80">{product.fit_type}</span>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row justify-between text-sm gap-1 sm:gap-4">
                  <span className="text-white/50 uppercase tracking-widest text-[10px]">SKU</span>
                  <span className="sm:text-right font-mono text-xs text-white/60">{product.id.slice(0, 8).toUpperCase()}</span>
                </div>
              </motion.div>

            </motion.div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {(relatedLoading || related.length > 0) && (
        <RevealOnView className="container-edge py-20 md:py-32 border-t border-white/10 mt-10 md:mt-20">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/50">Discover</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold mt-2 text-white uppercase tracking-tighter">Similar Pieces</h2>
            </div>
            {product.categories?.slug && (
              <Link to={`/categories/${product.categories.slug}`} className="text-xs uppercase tracking-widest text-white/60 hover:text-white transition-colors flex items-center gap-2 hover-trigger">
                View Collection <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>

          {relatedLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[4/5] bg-secondary animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}
        </RevealOnView>
      )}
    </div>
  );
};

export default ProductDetail;
