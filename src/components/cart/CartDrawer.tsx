import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart";
import { formatPrice, whatsappLink } from "@/lib/brand";
import { Minus, Plus, Trash2, MessageCircle, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { EASE_OUT_EXPO } from "@/lib/motion";

export const CartDrawer = () => {
  const { isOpen, setOpen, items, removeItem, updateQty, totalPrice, clear } = useCart();
  const total = totalPrice();

  const buildMessage = () => {
    const lines = [
      `*GEN-Z Trinco — New Order Inquiry*`,
      ``,
      ...items.map((i, idx) => {
        const url = `${window.location.origin}/product/${i.slug}`;
        const opts = [i.size && `Size: ${i.size}`, i.color && `Color: ${i.color}`].filter(Boolean).join(" · ");
        return `${idx + 1}. ${i.name}${opts ? ` (${opts})` : ""}\n   Qty: ${i.quantity} × ${formatPrice(i.price)} = ${formatPrice(i.price * i.quantity)}\n   ${url}`;
      }),
      ``,
      `*Estimated total:* ${formatPrice(total)}`,
      ``,
      `Please confirm availability & delivery. Thank you!`,
    ];
    return lines.join("\n");
  };

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col bg-card border-l border-border p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
          <SheetTitle className="font-display text-xl flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" /> Your Bag
          </SheetTitle>
        </SheetHeader>

        <AnimatePresence mode="wait" initial={false}>
          {items.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
              className="flex-1 grid place-items-center px-6 text-center"
            >
              <div>
                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.4, ease: EASE_OUT_EXPO }}
                  className="mx-auto h-16 w-16 rounded-full bg-secondary grid place-items-center mb-4"
                >
                  <ShoppingBag className="h-7 w-7 text-muted-foreground" />
                </motion.div>
                <p className="font-medium">Your bag is empty</p>
                <p className="text-sm text-muted-foreground mt-1">Find something you love.</p>
                <Button asChild variant="hero" className="mt-6" onClick={() => setOpen(false)}>
                  <Link to="/shop">Shop Now</Link>
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="items"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                <AnimatePresence initial={false}>
                  {items.map((i) => (
                    <motion.div
                      key={i.id}
                      layout
                      initial={{ opacity: 0, x: 40, height: 0 }}
                      animate={{ opacity: 1, x: 0, height: "auto" }}
                      exit={{ opacity: 0, x: 40, height: 0 }}
                      transition={{ duration: 0.32, ease: EASE_OUT_EXPO }}
                      className="flex gap-3 pb-4 border-b border-border/60 last:border-0 overflow-hidden"
                    >
                      <Link to={`/product/${i.slug}`} onClick={() => setOpen(false)} className="h-20 w-20 rounded-md overflow-hidden bg-secondary shrink-0">
                        <img src={i.image ?? "/logo.png"} alt={i.name} className="h-full w-full object-cover" />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link to={`/product/${i.slug}`} onClick={() => setOpen(false)} className="font-medium text-sm hover:text-primary line-clamp-1">{i.name}</Link>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {[i.size && `Size: ${i.size}`, i.color && i.color].filter(Boolean).join(" · ")}
                        </p>
                        <p className="text-sm font-semibold mt-1">{formatPrice(i.price)}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center border border-border rounded-md">
                            <motion.button
                              whileTap={{ scale: 0.85 }}
                              onClick={() => updateQty(i.id, i.quantity - 1)}
                              className="h-7 w-7 grid place-items-center hover:bg-secondary"
                            >
                              <Minus className="h-3 w-3" />
                            </motion.button>
                            <span className="px-2 text-sm w-8 text-center">{i.quantity}</span>
                            <motion.button
                              whileTap={{ scale: 0.85 }}
                              onClick={() => updateQty(i.id, i.quantity + 1)}
                              className="h-7 w-7 grid place-items-center hover:bg-secondary"
                            >
                              <Plus className="h-3 w-3" />
                            </motion.button>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1, color: "hsl(var(--destructive))" }}
                            whileTap={{ scale: 0.85 }}
                            onClick={() => removeItem(i.id)}
                            className="text-muted-foreground hover:text-destructive p-1"
                            aria-label="Remove"
                          >
                            <Trash2 className="h-4 w-4" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <motion.div
                layout
                className="border-t border-border px-6 py-4 space-y-3 bg-card"
              >
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-muted-foreground">Estimated total</span>
                  <motion.span
                    key={total}
                    initial={{ scale: 1.15, color: "hsl(var(--primary))" }}
                    animate={{ scale: 1, color: "hsl(var(--foreground))" }}
                    transition={{ duration: 0.4 }}
                    className="font-display text-xl font-semibold"
                  >
                    {formatPrice(total)}
                  </motion.span>
                </div>
                <Button asChild variant="whatsapp" size="lg" className="w-full">
                  <a href={whatsappLink(buildMessage())} target="_blank" rel="noreferrer">
                    <MessageCircle className="h-5 w-5" /> Send Cart via WhatsApp
                  </a>
                </Button>
                <button onClick={clear} className="w-full text-xs text-muted-foreground hover:text-destructive transition-colors">
                  Clear bag
                </button>
                <p className="text-[11px] text-muted-foreground text-center">
                  Final price & availability are confirmed on WhatsApp. No online payment.
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </SheetContent>
    </Sheet>
  );
};
