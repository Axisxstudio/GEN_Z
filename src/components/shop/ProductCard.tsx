import type { MouseEvent } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/brand";
import { useCart } from "@/store/cart";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/shop";
import { EASE_OUT_EXPO } from "@/lib/motion";

type Props = { product: Product; index?: number };

export const ProductCard = ({ product, index = 0 }: Props) => {
  const addItem = useCart((s) => s.addItem);
  const setOpen = useCart((s) => s.setOpen);
  const prefersReduced = useReducedMotion();
  const price = product.discount_price ?? product.price;
  const hasDiscount = product.discount_price != null && product.discount_price < product.price;
  const image = product.images?.[0] ?? "/logo.png";

  const handleAdd = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image,
      price: Number(price),
    });
    toast.success(`${product.name} added to cart`);
    setOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: prefersReduced ? 0 : 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.55,
        delay: prefersReduced ? 0 : Math.min(index * 0.07, 0.35),
        ease: EASE_OUT_EXPO,
      }}
      whileHover={prefersReduced ? {} : { y: -5, scale: 1.012 }}
      whileTap={prefersReduced ? {} : { scale: 0.98 }}
      style={{ willChange: "transform, opacity" }}
      className="product-card group relative flex min-w-0 flex-col bg-gradient-card border border-border/60 rounded-lg sm:rounded-xl overflow-hidden"
    >
      <Link
        to={`/product/${product.slug}`}
        className={cn(
          "relative z-0 block flex min-h-0 flex-1 flex-col outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-t-lg sm:rounded-t-xl",
        )}
      >
        <div className="relative aspect-[3/4] sm:aspect-[4/5] overflow-hidden bg-secondary shrink-0">
          <img
            src={image}
            alt=""
            loading="lazy"
            className="product-card-img absolute inset-0 h-full w-full object-cover"
          />
          {hasDiscount && (
            <motion.span
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.3, ease: EASE_OUT_EXPO }}
              className="absolute left-2 top-2 bg-gradient-red px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-primary-foreground sm:left-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-[10px]"
            >
              SALE
            </motion.span>
          )}
          {product.is_new_arrival && (
            <motion.span
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25, duration: 0.3, ease: EASE_OUT_EXPO }}
              className="absolute right-2 top-2 glass px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest sm:right-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-[10px]"
            >
              NEW
            </motion.span>
          )}
          {product.stock_status === "out_of_stock" && (
            <div className="absolute inset-0 grid place-items-center bg-background/70 backdrop-blur-sm">
              <span className="text-[10px] font-semibold uppercase tracking-widest sm:text-xs">Out of stock</span>
            </div>
          )}
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-1.5 p-3 sm:gap-2 sm:p-4">
          <div className="min-w-0">
            <p className="text-[9px] uppercase tracking-widest text-muted-foreground sm:text-[10px]">
              {product.categories?.name ?? "GEN-Z"}
            </p>
            <p className="mt-0.5 line-clamp-2 text-sm font-medium hover:text-primary sm:mt-1 sm:text-base">
              {product.name}
            </p>
          </div>
        </div>
      </Link>

      <div className="flex items-center justify-between gap-2 border-t border-border/50 px-3 pb-3 pt-2 sm:px-4 sm:pb-4 sm:pt-2.5">
        <div className="flex min-w-0 flex-1 items-baseline gap-1.5 sm:gap-2">
          <span className="truncate text-sm font-semibold text-foreground sm:text-base">{formatPrice(Number(price))}</span>
          {hasDiscount && (
            <span className="shrink-0 text-[10px] text-muted-foreground line-through sm:text-xs">
              {formatPrice(Number(product.price))}
            </span>
          )}
        </div>
        <motion.div whileTap={{ scale: 0.85 }} transition={{ duration: 0.15 }}>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleAdd}
            className="h-8 w-8 shrink-0 text-foreground hover:bg-secondary hover:text-primary sm:h-9 sm:w-9"
            disabled={product.stock_status === "out_of_stock"}
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingBag className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};
