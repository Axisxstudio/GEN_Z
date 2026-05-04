import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Heart, Menu, ShoppingBag, X } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/categories", label: "Categories" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { setOpen, totalCount } = useCart();
  const wishlistIds = useWishlist((s) => s.ids);
  const location = useLocation();
  const count = totalCount();
  const savedCount = wishlistIds.length;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-[background-color,backdrop-filter,border-color,box-shadow] duration-300 ease-out",
        scrolled ? "glass-strong border-b border-border/60" : "bg-transparent"
      )}
    >
      <div className="container-edge h-16 md:h-20 flex items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="font-display text-xl md:text-2xl font-bold tracking-tight">
            <span className="text-gradient-red">{BRAND.name}</span>
            <span className="text-foreground/70 font-light"> /Trinco</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                cn(
                  "text-sm uppercase tracking-widest font-medium transition-colors duration-200 ease-out relative py-1",
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {l.label}
                  <span
                    className={cn(
                      "absolute -bottom-1 left-0 h-px bg-gradient-red transition-[width] duration-300 ease-out",
                      isActive ? "w-full" : "w-0"
                    )}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <NavLink
            to="/favourites"
            aria-label="View saved items"
            className={({ isActive }) =>
              cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "relative shrink-0",
                isActive && "text-primary bg-secondary/40"
              )
            }
          >
            <Heart className="h-5 w-5" />
            {savedCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-5 min-w-5 px-1 rounded-full bg-gradient-red text-[10px] font-bold flex items-center justify-center text-primary-foreground">
                {savedCount > 9 ? "9+" : savedCount}
              </span>
            )}
          </NavLink>
          <Button
            variant="ghost"
            size="icon"
            className="relative shrink-0"
            onClick={() => setOpen(true)}
            aria-label="Open cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-5 min-w-5 px-1 rounded-full bg-gradient-red text-[10px] font-bold flex items-center justify-center text-primary-foreground">
                {count}
              </span>
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden glass-strong border-b border-border/60 overflow-hidden transition-[max-height] duration-300 ease-out",
          mobileOpen ? "max-h-96" : "max-h-0"
        )}
      >
        <nav className="container-edge py-4 flex flex-col gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                cn(
                  "py-3 px-3 rounded-md text-sm uppercase tracking-widest transition-colors duration-200 ease-out",
                  isActive ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/60"
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
          <NavLink
            to="/favourites"
            className={({ isActive }) =>
              cn(
                "flex w-full items-center gap-2 py-3 px-3 rounded-md text-sm uppercase tracking-widest transition-colors duration-200 ease-out",
                isActive ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/60"
              )
            }
          >
            <Heart className="h-4 w-4 shrink-0" />
            <span className="flex-1 text-left">Saved</span>
            {savedCount > 0 && (
              <span className="text-[10px] font-bold tabular-nums text-primary">{savedCount}</span>
            )}
          </NavLink>
        </nav>
      </div>
    </header>
  );
};
