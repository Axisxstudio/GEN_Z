import { BRAND } from "@/lib/brand";
import { RevealOnView } from "@/components/motion/RevealOnView";
import { useProducts } from "@/hooks/useShop";
import { ProductCard } from "@/components/shop/ProductCard";
import { Link } from "react-router-dom";
import { Sparkles, MessageSquare, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const About = () => {
  // Fetch 4 featured products for the showcase at the bottom of the page
  const { data: products = [] } = useProducts({ limit: 4, featured: true });

  return (
    <div className="space-y-20 pb-20 pt-8">
      {/* 1. Hero / Header Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20">
        <div className="container-edge">
          <RevealOnView className="max-w-4xl mx-auto text-center space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-primary font-semibold">About Us</p>
            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight">
              Curating Culture.<br className="hidden sm:inline" /> Defining Style.
            </h1>
            <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
              {BRAND.fullName} is the ultimate streetwear destination, crafted specifically for the new generation.
            </p>
          </RevealOnView>
        </div>
      </section>

      {/* 2. Editorial Split Section */}
      <section className="container-edge">
        <RevealOnView className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div className="relative aspect-[4/5] sm:aspect-[16/10] md:aspect-[4/5] rounded-2xl overflow-hidden border border-border/50 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1200"
              alt="Streetwear Culture"
              className="absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-in-out scale-105 hover:scale-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-65" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="text-[10px] font-bold uppercase tracking-widest bg-primary/20 backdrop-blur-md border border-primary/30 px-3 py-1.5 rounded-full text-primary">
                EST. 2026
              </span>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
              Built for the new generation of trendsetters.
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed text-base sm:text-lg">
              <p>
                At <span className="text-foreground font-medium">{BRAND.name}</span>, we curate the kind of fits, fragrances, and accessories that make young men feel absolutely unstoppable.
              </p>
              <p>
                We believe that shopping should be fast, highly personal, and entirely free of complicated checkout funnels. That is why we have engineered a zero-friction checkout experience.
              </p>
              <p>
                See something you love? Tap the product to open a direct WhatsApp connection. Our concierge will confirm your size, verify the color, and process your shipping instantly.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-4">
              <Button asChild size="lg" className="rounded-full shadow-lg hover:shadow-primary/25 transition-all">
                <Link to="/shop">
                  Browse Collection <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full">
                <a href={BRAND.socials.instagram} target="_blank" rel="noopener noreferrer">
                  Follow Our Drop
                </a>
              </Button>
            </div>
          </div>
        </RevealOnView>
      </section>

      {/* 3. Pillars Grid */}
      <section className="bg-card/30 border-y border-border/40 py-16">
        <div className="container-edge">
          <RevealOnView className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold">Why Shop GEN-Z?</h2>
            <p className="text-muted-foreground text-sm sm:text-base">We are rewriting the rules of modern streetwear retail.</p>
          </RevealOnView>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <RevealOnView className="bg-gradient-card border border-border/50 p-6 sm:p-8 rounded-2xl space-y-4 hover:border-primary/30 transition-all duration-300 animate-fade-in">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl font-bold">Selected for Impact</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Every hoodie, tee, belt, and fragrance in our catalog is handpicked for aesthetic edge, premium fit, and heavyweight craftsmanship.
              </p>
            </RevealOnView>

            <RevealOnView className="bg-gradient-card border border-border/50 p-6 sm:p-8 rounded-2xl space-y-4 hover:border-primary/30 transition-all duration-300 animate-fade-in">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl font-bold">Direct WhatsApp Checkout</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Forget complex checkout forms. One tap opens a secure, direct WhatsApp chat. Get sizes confirmed, colors verified, and delivery sorted instantly.
              </p>
            </RevealOnView>

            <RevealOnView className="bg-gradient-card border border-border/50 p-6 sm:p-8 rounded-2xl space-y-4 hover:border-primary/30 transition-all duration-300 sm:col-span-2 lg:col-span-1 animate-fade-in">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl font-bold">Trincomalee Roots</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Based on Main Street in Trincomalee. We support Sri Lanka's coastal and urban subcultures, providing fast island-wide express shipping to your door.
              </p>
            </RevealOnView>
          </div>
        </div>
      </section>

      {/* 4. Brand Statement Banner */}
      <section className="container-edge">
        <RevealOnView className="relative bg-black rounded-3xl overflow-hidden py-16 px-6 text-center border border-border/30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--primary-rgb),0.07)_0%,transparent_100%)]" />
          <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
            <span className="text-[10px] tracking-[0.4em] font-semibold text-primary uppercase">Our Mantra</span>
            <blockquote className="font-display text-3xl sm:text-5xl font-bold tracking-tight leading-tight text-white">
              "{BRAND.tagline}"
            </blockquote>
            <p className="text-zinc-400 text-sm sm:text-base max-w-md mx-auto">
              Bringing premium styling, confident vibes, and pure happiness to men and boys island-wide.
            </p>
          </div>
        </RevealOnView>
      </section>

      {/* 5. Showcase Grid at End of Page */}
      {products.length > 0 && (
        <section className="container-edge space-y-10">
          <RevealOnView className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-primary font-semibold">Featured Drops</p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold mt-1">Explore the Collection</h2>
            </div>
            <Button asChild variant="ghost" className="text-primary hover:text-primary/80 hover:bg-transparent group p-0">
              <Link to="/shop">
                View All Products <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </RevealOnView>

          <RevealOnView className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {products.map((p, idx) => (
              <ProductCard key={p.id} product={p} index={idx} />
            ))}
          </RevealOnView>
        </section>
      )}
    </div>
  );
};

export default About;
