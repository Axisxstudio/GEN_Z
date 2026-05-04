import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart";
import { formatPrice, whatsappLink } from "@/lib/brand";
import { Minus, Plus, Trash2, MessageCircle, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

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

        {items.length === 0 ? (
          <div className="flex-1 grid place-items-center px-6 text-center">
            <div>
              <div className="mx-auto h-16 w-16 rounded-full bg-secondary grid place-items-center mb-4">
                <ShoppingBag className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="font-medium">Your bag is empty</p>
              <p className="text-sm text-muted-foreground mt-1">Find something you love.</p>
              <Button asChild variant="hero" className="mt-6" onClick={() => setOpen(false)}>
                <Link to="/shop">Shop Now</Link>
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.map((i) => (
                <div key={i.id} className="flex gap-3 pb-4 border-b border-border/60 last:border-0">
                  <Link to={`/product/${i.slug}`} onClick={() => setOpen(false)} className="h-20 w-20 rounded-md overflow-hidden bg-secondary shrink-0">
                    <img src={i.image ?? "/placeholder.svg"} alt={i.name} className="h-full w-full object-cover" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${i.slug}`} onClick={() => setOpen(false)} className="font-medium text-sm hover:text-primary line-clamp-1">{i.name}</Link>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {[i.size && `Size: ${i.size}`, i.color && i.color].filter(Boolean).join(" · ")}
                    </p>
                    <p className="text-sm font-semibold mt-1">{formatPrice(i.price)}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center border border-border rounded-md">
                        <button onClick={() => updateQty(i.id, i.quantity - 1)} className="h-7 w-7 grid place-items-center hover:bg-secondary"><Minus className="h-3 w-3" /></button>
                        <span className="px-2 text-sm w-8 text-center">{i.quantity}</span>
                        <button onClick={() => updateQty(i.id, i.quantity + 1)} className="h-7 w-7 grid place-items-center hover:bg-secondary"><Plus className="h-3 w-3" /></button>
                      </div>
                      <button onClick={() => removeItem(i.id)} className="text-muted-foreground hover:text-destructive p-1" aria-label="Remove">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border px-6 py-4 space-y-3 bg-card">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted-foreground">Estimated total</span>
                <span className="font-display text-xl font-semibold">{formatPrice(total)}</span>
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
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};
