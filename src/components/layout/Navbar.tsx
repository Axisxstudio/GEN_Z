import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { ChevronDown, Heart, Menu, ShoppingBag, X } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";
import { useCategories } from "@/hooks/useShop";

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
  const [mobileCatExpanded, setMobileCatExpanded] = useState(false);
  const { setOpen, totalCount } = useCart();
  const wishlistIds = useWishlist((s) => s.ids);
  const location = useLocation();
  const count = totalCount();
  const savedCount = wishlistIds.length;

  const { data: categories = [] } = useCategories();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMobileCatExpanded(false);
  }, [location.pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-[background-color,backdrop-filter,border-color,box-shadow] duration-300 ease-out",
        scrolled ? "glass-strong border-b border-border/60" : "bg-transparent"
      )}
    >
      <div className="container-edge h-16 md:h-20 flex items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-2 group">
          <img 
            src="/logo.png" 
            alt={BRAND.name} 
            className="h-10 md:h-14 object-contain mix-blend-lighten [filter:brightness(1.2)]" 
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => {
            if (l.to === "/categories") {
              const isCategoriesActive = location.pathname.startsWith("/categories");
              return (
                <div key={l.to} className="relative group py-5">
                  <NavLink
                    to={l.to}
                    className={
                      cn(
                        "text-sm uppercase tracking-widest font-medium transition-colors duration-200 ease-out relative py-1 flex items-center gap-1",
                        isCategoriesActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                      )
                    }
                  >
                    <>
                      {l.label}
                      <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180" />
                      <span
                        className={cn(
                          "absolute -bottom-1 left-0 h-px bg-gradient-red transition-[width] duration-300 ease-out",
                          isCategoriesActive ? "w-full" : "w-0"
                        )}
                      />
                    </>
                  </NavLink>
                  {/* Dropdown Menu */}
                  <div className="absolute top-[calc(100%-8px)] left-1/2 -translate-x-1/2 mt-1 w-52 rounded-xl overflow-hidden glass-strong border border-border/80 shadow-elegant opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out origin-top scale-95 group-hover:scale-100 z-50">
                    <div className="p-2 space-y-0.5">
                      <Link
                        to="/categories"
                        className="block px-3.5 py-2 text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary hover:bg-secondary/40 rounded-lg transition-colors font-medium"
                      >
                        All Categories
                      </Link>
                      <div className="h-px bg-border/40 my-1" />
                      {categories.map((c) => (
                        <Link
                          key={c.id}
                          to={`/categories/${c.slug}`}
                          className="block px-3.5 py-2 text-[10px] uppercase tracking-widest text-foreground hover:text-primary hover:bg-secondary/40 rounded-lg transition-colors font-medium"
                        >
                          {c.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

            return (
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
            );
          })}
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
          "md:hidden glass-strong border-b border-border/60 overflow-y-auto transition-[max-height] duration-300 ease-out",
          mobileOpen ? "max-h-[min(80vh,540px)]" : "max-h-0"
        )}
      >
        <nav className="container-edge py-4 flex flex-col gap-1">
          {links.map((l) => {
            if (l.to === "/categories") {
              const isCategoriesActive = location.pathname.startsWith("/categories");
              return (
                <div key={l.to} className="flex flex-col">
                  <div className="flex items-center justify-between py-1 px-3 rounded-md hover:bg-secondary/40 transition-colors">
                    <button
                      type="button"
                      onClick={() => setMobileCatExpanded((v) => !v)}
                      className={cn(
                        "py-2 flex-1 text-left text-sm uppercase tracking-widest transition-colors duration-200 ease-out outline-none select-none",
                        isCategoriesActive ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {l.label}
                    </button>
                    <Link
                      to={l.to}
                      className="p-2 text-muted-foreground hover:text-primary transition-colors shrink-0 outline-none"
                      aria-label="Go to categories page"
                    >
                      <ChevronDown
                        className={cn(
                          "h-5 w-5 transition-transform duration-300",
                          mobileCatExpanded ? "rotate-180 text-primary" : ""
                        )}
                      />
                    </Link>
                  </div>
                  {/* Expanded Categories List */}
                  <div
                    className={cn(
                      "overflow-hidden transition-[max-height,opacity] duration-300 ease-out pl-6 flex flex-col gap-1 border-l border-border/40 ml-6",
                      mobileCatExpanded ? "max-h-[320px] opacity-100 my-2" : "max-h-0 opacity-0 pointer-events-none"
                    )}
                  >
                    <NavLink
                      to="/categories"
                      end
                      className={({ isActive }) =>
                        cn(
                          "py-2 px-2 text-xs uppercase tracking-widest transition-colors duration-200 rounded-md",
                          isActive ? "bg-secondary text-primary font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                        )
                      }
                    >
                      All Categories
                    </NavLink>
                    {categories.map((c) => (
                      <NavLink
                        key={c.id}
                        to={`/categories/${c.slug}`}
                        className={({ isActive }) =>
                          cn(
                            "py-2 px-2 text-xs uppercase tracking-widest transition-colors duration-200 rounded-md",
                            isActive ? "bg-secondary text-primary font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                          )
                        }
                      >
                        {c.name}
                      </NavLink>
                    ))}
                  </div>
                </div>
              );
            }

            return (
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
            );
          })}
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

