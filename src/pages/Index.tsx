import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles, Truck, ShieldCheck, MessageCircle } from "lucide-react";
import { RevealOnView } from "@/components/motion/RevealOnView";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/shop/ProductCard";
import { useCategories, useProducts } from "@/hooks/useShop";
import { BRAND } from "@/lib/brand";
import { CategoryBannerMedia } from "@/components/shop/CategoryBannerMedia";
import { HeroDropTyping } from "@/components/motion/HeroDropTyping";
import {
  staggerContainer,
  staggerItem,
  EASE_OUT_EXPO,
} from "@/lib/motion";

// Hero Images
import heroImg from "@/assets/hero.jpg";
import streetwearHero1 from "@/assets/streetwear_hero1.png";
import streetwearHero2 from "@/assets/streetwear_hero2.png";

const Index = () => {
  const { data: featured = [] } = useProducts({ featured: true, limit: 8 });
  const { data: newArrivals = [] } = useProducts({ newArrival: true, limit: 4 });
  const { data: categories = [] } = useCategories();
  const prefersReduced = useReducedMotion();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const heroImages = [heroImg, streetwearHero1, streetwearHero2];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: EASE_OUT_EXPO,
      },
    },
  };

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden">
        {/* Slideshow with AnimatePresence */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <AnimatePresence mode="popLayout">
            <motion.img
              key={currentImageIndex}
              src={heroImages[currentImageIndex]}
              alt="GEN-Z streetwear hero"
              className="absolute inset-0 h-full w-full object-cover object-center sm:object-top"
              initial={{ opacity: 0, scale: 1.12 }}
              animate={{ opacity: 1, scale: 1.0 }}
              exit={{ opacity: 0 }}
              transition={{
                opacity: { duration: 1.2, ease: "easeInOut" },
                scale: { duration: 5.0, ease: "easeOut" },
              }}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/20 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
        </div>

        {/* Content with Stagger Animations */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="container-edge relative z-20 py-24"
        >
          <motion.div variants={itemVariants}>
            <HeroDropTyping />
          </motion.div>
          
          <motion.h1
            variants={itemVariants}
            className="font-display text-5xl sm:text-6xl md:text-8xl font-bold leading-[0.95] max-w-4xl"
          >
            The <span className="text-gradient-red">Happiness</span><br />
            of Men <span className="text-foreground/60 font-light italic">&</span> Boys.
          </motion.h1>
          
          <motion.p
            variants={itemVariants}
            className="mt-6 max-w-xl text-base md:text-lg text-muted-foreground"
          >
            Premium streetwear, perfumes & accessories — curated for the new generation.
            Order in seconds via WhatsApp.
          </motion.p>
          
          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-wrap gap-3"
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button asChild variant="hero" size="xl" className="rounded-full">
                <Link to="/shop">Shop Now <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button asChild variant="glass" size="xl" className="rounded-full">
                <Link to="/categories">Browse Categories</Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

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
      </section>

      {/* VALUE BAR — Staggered individual cards */}
      <RevealOnView className="container-edge py-12">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { icon: Sparkles, t: "Curated Drops", d: "Hand-picked premium pieces" },
            { icon: MessageCircle, t: "Order on WhatsApp", d: "No checkout, no hassle" },
            { icon: Truck, t: "Island-wide Delivery", d: "Fast Sri Lanka shipping" },
            { icon: ShieldCheck, t: "100% Authentic", d: "Real materials, real quality" },
          ].map((f, i) => (
            <motion.div
              key={i}
              variants={staggerItem}
              whileHover={prefersReduced ? {} : { y: -4, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="glass rounded-xl p-5 cursor-default"
            >
              <f.icon className="h-5 w-5 text-primary mb-3" />
              <p className="font-medium text-sm">{f.t}</p>
              <p className="text-xs text-muted-foreground mt-1">{f.d}</p>
            </motion.div>
          ))}
        </motion.div>
      </RevealOnView>

      {/* CATEGORIES — staggered grid */}
      <RevealOnView className="container-edge py-16" delay={0.04}>
        <SectionHead eyebrow="Shop by Category" title="Find your vibe" />
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-10 grid grid-cols-2 gap-3 min-[400px]:gap-4 lg:grid-cols-4"
        >
          {categories.map((c, i) => (
            <motion.div
              key={c.id}
              variants={staggerItem}
              whileHover={prefersReduced ? {} : { y: -6, scale: 1.015 }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
            >
              <Link
                to={`/categories/${c.slug}`}
                className="group relative aspect-[4/5] rounded-xl overflow-hidden border border-border/60 bg-black flex flex-col hover:border-primary/40 hover:shadow-[0_20px_50px_-20px_hsl(var(--primary)/0.25)] transition-[border-color,box-shadow] duration-300"
              >
                <CategoryBannerMedia category={c} />
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <p className="text-xs uppercase tracking-widest text-white/70">Category</p>
                  <h3 className="font-display text-2xl md:text-3xl font-semibold mt-1 text-white drop-shadow-sm">{c.name}</h3>
                  <motion.span
                    initial={{ opacity: 0, x: -8 }}
                    whileHover={{ opacity: 1, x: 0 }}
                    className="mt-3 inline-flex items-center gap-2 text-sm text-primary"
                  >
                    Explore <ArrowRight className="h-4 w-4" />
                  </motion.span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </RevealOnView>

      {/* FEATURED */}
      <RevealOnView className="container-edge py-16" delay={0.06}>
        <SectionHead eyebrow="Featured" title="Hot right now" cta={{ to: "/shop", label: "View all" }} />
        <div className="mt-10 grid grid-cols-2 gap-3 min-[400px]:gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
          {featured.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </RevealOnView>

      {/* NEW ARRIVALS */}
      {newArrivals.length > 0 && (
        <RevealOnView className="container-edge py-16" delay={0.08}>
          <SectionHead eyebrow="Just Dropped" title="New arrivals" />
          <div className="mt-10 grid grid-cols-2 gap-3 min-[400px]:gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
            {newArrivals.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
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
      <motion.div whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 400 }}>
        <Link to={cta.to} className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1 transition-colors duration-200 ease-out">
          {cta.label} <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>
    )}
  </div>
);

export default Index;
