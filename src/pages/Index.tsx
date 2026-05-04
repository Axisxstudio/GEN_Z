import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles, Truck, ShieldCheck, MessageCircle } from "lucide-react";
import { RevealOnView } from "@/components/motion/RevealOnView";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/shop/ProductCard";
import { useCategories, useProducts } from "@/hooks/useShop";
import heroImg from "@/assets/hero.jpg";
import { BRAND } from "@/lib/brand";
import { CategoryBannerMedia } from "@/components/shop/CategoryBannerMedia";

const Index = () => {
  const reduce = useReducedMotion();
  const { data: featured = [] } = useProducts({ featured: true, limit: 8 });
  const { data: newArrivals = [] } = useProducts({ newArrival: true, limit: 4 });
  const { data: categories = [] } = useCategories();

  return (
    <>
      {/* HERO */}
      <motion.section
        className="relative min-h-[88vh] flex items-center overflow-hidden"
        initial={reduce ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt="GEN-Z streetwear hero"
            className="absolute inset-0 h-full w-full object-cover object-center sm:object-right"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="container-edge relative z-10 py-24">
          <p className="text-xs uppercase tracking-[0.4em] text-primary mb-6 animate-fade-in">
            <span className="flex flex-col gap-2 sm:hidden">
              <span className="flex items-center gap-3">
                <span className="inline-block h-px w-8 bg-primary shrink-0" aria-hidden />
                New Drop
              </span>
              <span className="pl-11">· {BRAND.city}</span>
            </span>
            <span className="hidden sm:inline">
              <span className="inline-block h-px w-8 bg-primary align-middle mr-3" aria-hidden />
              New Drop · {BRAND.city}
            </span>
          </p>
          <h1 className="font-display text-5xl sm:text-6xl md:text-8xl font-bold leading-[0.95] max-w-4xl animate-fade-in delay-75">
            The <span className="text-gradient-red">Happiness</span><br />
            of Men <span className="text-foreground/60 font-light italic">&</span> Boys.
          </h1>
          <p className="mt-6 max-w-xl text-base md:text-lg text-muted-foreground animate-fade-in delay-150">
            Premium streetwear, perfumes & accessories — curated for the new generation.
            Order in seconds via WhatsApp.
          </p>
          <div className="mt-10 flex flex-wrap gap-3 animate-fade-in delay-200">
            <Button asChild variant="hero" size="xl">
              <Link to="/shop">Shop Now <ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="glass" size="xl">
              <Link to="/categories">Browse Categories</Link>
            </Button>
          </div>
        </div>

        {/* Ticker */}
        <div className="absolute bottom-0 inset-x-0 border-y border-border/60 bg-background/40 backdrop-blur overflow-hidden py-3">
          <div className="ticker flex whitespace-nowrap gap-12 text-xs tracking-[0.3em] uppercase text-muted-foreground">
            {Array.from({ length: 2 }).map((_, k) => (
              <div key={k} className="flex gap-12 shrink-0">
                {["Men's Wear", "Kids Wear", "Perfumes", "Belts", "New Arrivals", "Order via WhatsApp", "Trincomalee"].map((t, i) => (
                  <span key={i} className="flex items-center gap-12">
                    <span>{t}</span><span className="text-primary">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* VALUE BAR */}
      <RevealOnView className="container-edge py-12 grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { icon: Sparkles, t: "Curated Drops", d: "Hand-picked premium pieces" },
          { icon: MessageCircle, t: "Order on WhatsApp", d: "No checkout, no hassle" },
          { icon: Truck, t: "Island-wide Delivery", d: "Fast Sri Lanka shipping" },
          { icon: ShieldCheck, t: "100% Authentic", d: "Real materials, real quality" },
        ].map((f, i) => (
          <div key={i} className="glass rounded-xl p-5 transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg">
            <f.icon className="h-5 w-5 text-primary mb-3" />
            <p className="font-medium text-sm">{f.t}</p>
            <p className="text-xs text-muted-foreground mt-1">{f.d}</p>
          </div>
        ))}
      </RevealOnView>

      {/* CATEGORIES */}
      <RevealOnView className="container-edge py-16" delay={0.04}>
        <SectionHead eyebrow="Shop by Category" title="Find your vibe" />
        <div className="mt-10 grid grid-cols-2 gap-3 min-[400px]:gap-4 lg:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.id}
              to={`/categories/${c.slug}`}
              className="group relative aspect-[4/5] rounded-xl overflow-hidden border border-border/60 bg-black transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_20px_50px_-20px_hsl(var(--primary)/0.25)]"
            >
              <CategoryBannerMedia category={c} />
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <p className="text-xs uppercase tracking-widest text-white/70">Category</p>
                <h3 className="font-display text-2xl md:text-3xl font-semibold mt-1 text-white drop-shadow-sm">{c.name}</h3>
                <span className="mt-3 inline-flex items-center gap-2 text-sm text-primary opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100">
                  Explore <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </RevealOnView>

      {/* FEATURED */}
      <RevealOnView className="container-edge py-16" delay={0.06}>
        <SectionHead eyebrow="Featured" title="Hot right now" cta={{ to: "/shop", label: "View all" }} />
        <div className="mt-10 grid grid-cols-2 gap-3 min-[400px]:gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
          {featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </RevealOnView>

      {/* NEW ARRIVALS */}
      {newArrivals.length > 0 && (
        <RevealOnView className="container-edge py-16" delay={0.08}>
          <SectionHead eyebrow="Just Dropped" title="New arrivals" />
          <div className="mt-10 grid grid-cols-2 gap-3 min-[400px]:gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
            {newArrivals.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </RevealOnView>
      )}
    </>
  );
};

const SectionHead = ({ eyebrow, title, cta }: { eyebrow: string; title: string; cta?: { to: string; label: string } }) => (
  <div className="flex items-end justify-between gap-6 flex-wrap">
    <div>
      <p className="text-xs uppercase tracking-[0.3em] text-primary">{eyebrow}</p>
      <h2 className="font-display text-3xl md:text-5xl font-bold mt-2">{title}</h2>
    </div>
    {cta && (
      <Link to={cta.to} className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1 transition-colors duration-200 ease-out">
        {cta.label} <ArrowRight className="h-4 w-4" />
      </Link>
    )}
  </div>
);

export default Index;
